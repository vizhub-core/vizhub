import { timeMinute } from 'd3';
import { generateId, SaveViz } from 'interactors';
import { Viz, Info, Content, Files, Commit } from 'entities';
import { diff } from 'ot';
import { logDetail } from './logDetail';
import { generateEmbeddingOpenAI } from './generateEmbeddingOpenAI';
import { storeEmbedding } from './storeEmbedding';
import { computeForkedFrom } from './computeForkedFrom';
import { isolateGoodFiles, getGoodFiles } from './isolateGoodFiles';
import { computeV3Files } from './computeV3Files';
import { Gateways } from 'gateways';
import { Collection } from 'mongodb-legacy';

// Default height in pixels for vizzes.
// In V3 data model, height is always explicit.
const defaultHeight = 500;

// Hardcoded ID of the primordial viz (actually in the V2 database)
const primordialVizId = '86a75dc8bdbe4965ba353a79d4bd44c8';

// Auto-commit changes from the oplog for every viz every 15 minutes.
const autoCommitInterval = timeMinute.every(15);

// Feature flag for development.
// Should be set to false in production (CRON job)
// Set to true to re-migrate all vizzes.
const alwaysReMigrate = true;

// Processes a single viz.
// Assumption: the same viz can be processed multiple times without issue.
// e.g. if the process is interrupted, it can be restarted, or
// if the process is run multiple times, it will not cause issues, or
// if an already migrated viz has been updated in V2, it can be re-migrated.
export const processViz = async ({
  vizV2,
  gateways,
  i,
  redisClient,
  contentCollection,
}: {
  vizV2: any;
  gateways: Gateways;
  i: number;
  redisClient: any;
  contentCollection: Collection;
}) => {
  // Setup
  const saveViz = SaveViz(gateways);
  const { id, createdTimestamp } = vizV2.info;
  const isPrimordialViz = id === primordialVizId;

  // Sometimes titles have leading or trailing spaces, so trim that.
  const title = vizV2.info.title.trim();

  // Figure out if the viz has already been migrated.
  const infoMigratedResult = await gateways.getInfo(id);
  const isAlreadyMigrated = infoMigratedResult.outcome === 'success';
  logDetail(`  Already migrated: ${isAlreadyMigrated}`);

  // If the viz has already been migrated, figure out if it has been updated since then.
  let hasBeenUpdatedSinceLastMigration = false;
  if (isAlreadyMigrated) {
    const infoMigrated: Info = infoMigratedResult.value.data;
    hasBeenUpdatedSinceLastMigration =
      vizV2.info.lastUpdatedTimestamp > infoMigrated.updated;
  }
  logDetail(
    `    Updated since last migration: ${hasBeenUpdatedSinceLastMigration}`
  );

  // If the viz has already been migrated and has not been updated since,
  // then skip it.
  if (!hasBeenUpdatedSinceLastMigration && !alwaysReMigrate) {
    logDetail('  Already migrated and not updated since, skipping this viz.');
    return;
  }

  // Isolate the "good files" that we want to use for embedding.
  // This excludes invalid files and `bundle.js` (since it's auto-generated).
  const goodFiles = isolateGoodFiles(vizV2.content);

  // If there are no good files, skip this viz! It's not worth migrating.
  if (!goodFiles) {
    console.log('  No good files, skipping this viz.');
    return;
  }

  // If we are here, it means we are going to migrate this viz,
  // either because it has not been migrated yet,
  // or because it has been updated since the last migration.

  // Generate the embedding for the viz (latest version).
  logDetail('  Generating embedding');
  const embedding = await generateEmbeddingOpenAI(goodFiles);

  // Store the embedding in Redis.
  logDetail('    Storing embedding in Redis...');
  await storeEmbedding({
    redisClient,
    id,
    embedding,
    timestamp: createdTimestamp,
  });
  logDetail('    Stored embedding!');

  // Compute the forkedFrom and forkedFromIsBackfilled fields.

  const { forkedFrom, forkedFromIsBackfilled } = await computeForkedFrom({
    isPrimordialViz,
    vizV2,
    contentCollection,
    embedding,
    redisClient,
  });

  console.log('  forkedFrom:', forkedFrom);
  console.log('  forkedFromIsBackfilled:', forkedFromIsBackfilled);

  // Scaffold the V3 viz.
  const info: Info = {
    id: vizV2.info.id,
    owner: vizV2.info.owner,

    // For now, folder is undefined,
    // which should put it automatically in the users's
    // "home view" above all folders.
    //folder: 'TODO figure out folder here!',
    title: title,
    forkedFrom,
    // This will be incremented later
    forksCount: 0,
    created: vizV2.info.createdTimestamp,
    updated: vizV2.info.lastUpdatedTimestamp,
    visibility: vizV2.info.privacy || 'public',
    // This will be incremented later
    upvotesCount: 0,
    // Start and end will be filled in later
    start: 'invalid',
    end: 'invalid',
    folder: null,
    isFrozen: false,
    committed: false,
    commitAuthors: [],
  };

  // If the forkedFrom is backfilled, set the flag.
  // Otherwise leave `forkedFromIsBackfilled` as undefined.
  if (forkedFromIsBackfilled) {
    info.forkedFromIsBackfilled = true;
  }

  const content: Content = {
    id: vizV2.info.id,
    height: vizV2.info.height | defaultHeight,
    title: vizV2.info.title,
    files: {}, // This is filled in later
  };
  const vizV3: Viz = { info, content };

  // Handle the primordial viz.
  // TODO handle the case that the primordial viz has been updated.
  if (isPrimordialViz) {
    console.log('  This is the primordial viz!');
    console.log('    Generating the Primordial Commit');

    // The first ever commit.
    // Special because it's the only with no parentCommitId.

    // TODO don't clobber the primordial commit if it already exists.
    const primordialCommitId = generateId();

    vizV3.info.start = primordialCommitId;
    vizV3.info.end = primordialCommitId;
    vizV3.info.committed = true;
    vizV3.info.commitAuthors = [];
    vizV3.info.isFrozen = false;

    // Compute migrated V3 files from V2 files
    vizV3.content.files = computeV3Files(goodFiles) as Files;

    // The first ever commit.
    // Special because it's the only with no parentCommitId.
    const primordialCommit: Commit = {
      id: primordialCommitId,
      viz: vizV2.info.id,
      authors: [vizV2.info.owner],
      timestamp: vizV2.info.createdTimestamp,
      ops: diff({}, vizV3.content),
      milestone: null,
    };

    await gateways.saveCommit(primordialCommit);

    const saveVizResult = await saveViz(vizV3);
    if (saveVizResult.outcome === 'failure') {
      throw new Error('Failed to save primordial viz! ' + saveVizResult.error);
    }
    console.log('    Saved primordial commit and viz!');
    //          console.log((await getCommit(primordialCommitId)).value);
    //          console.log((await getViz(vizV3.info.id)).value);
    //    process.exit();
    //
    // Don't try for revision history on the primordial viz.
    // It was not working correctly - some commits had no parents.
  } else {
    console.log('  This is not the primordial viz!');
    process.exit();

    // // Fork the forkedFrom viz.
    // // TODO fork from specific timestamp
    // const forkResult = await forkViz({
    //   newOwner: vizV2.info.owner,
    //   forkedFrom,
    //   timestamp: vizV2.info.createdTimestamp,
    //   newVizId: vizV2.info.id,
    // });
    // if (forkResult.outcome === 'failure') {
    //   console.log('Error while forking.');
    //   console.log(forkResult.error);
    //   process.exit();
    // }

    // // vizV3Forked is the viz generated by forkViz.
    // // At this point, this viz has a new commit,
    // // but the content is still what it was forked from.
    // //
    // // Next, we need to modify its content.
    // let vizV3Forked = (await getViz(vizV2.info.id)).value;

    // // Revision History from ShareDB Ops
    // //
    // // Some of the op history for the early vizzes was unfortunately deleted.
    // // In particular, that of the first 1286 vizzes created.
    // // First, let's check if the viz has op history starting at version 0.
    // // If it does, then the op log history is intact and we can derive
    // // a complete revision history from it.
    // //
    // // While we could in theory try reconstructing a partial history by applying
    // // inverted ops from the current state, that seems sketchy as I'm
    // // not sure if the op inverses are all actually valid or not.
    // //
    // // So, let's just ignore the partial revision histories.

    // const ops = vizV2.ops;
    // const opHistoryIsValid = ops.length > 0 && ops[0].v === 0;

    // if (!opHistoryIsValid) {
    //   //      await play(soundTom);
    //   logDetail('  Op history is not valid. Creating simple commits.');
    //   // Since we don't have valid revision history,
    //   // let's just created a boring set of commits for this viz:
    //   //  * One commit to fork (that just changes the id) at created timestamps
    //   //  * One commit to modify the content at last updated

    //   // Compute migrated V3 files from V2 files
    //   const forkedFromContentV3 = (await getContent(forkedFrom)).value.data;
    //   vizV3.content.files = computeV3Files(goodFiles, forkedFromContentV3);

    //   // Prepare the viz for CommitViz
    //   vizV3.info.committed = false;
    //   vizV3.info.commitAuthors = [vizV2.info.owner];

    //   // We modify the forked viz with the changes
    //   // that make it the most recently modified
    //   // version from Viz V2.
    //   // Note that we want to keep a few fields
    //   // in vizV3Forked, namely:
    //   //  * info.start
    //   //  * info.end
    //   //  * info.isFrozen
    //   vizV3Forked.info = { ...vizV3Forked.info, ...vizV3.info };
    //   vizV3Forked.content = { ...vizV3Forked.content, ...vizV3.content };

    //   // Kludge: special case fix for strange emoji-related unicode diff error.
    //   vizV3Forked = removeEmoji(vizV3Forked);
    //   await saveViz(vizV3Forked);
    //   const commitVizResult = await commitViz(vizV3Forked.info.id);

    //   //await new Promise((resolve) => setTimeout(resolve, 10000000));
    // } else {
    //   //await play(soundHiHat);
    //   logDetail(
    //     '  Op history is valid! Reconstructing history from ' +
    //       ops.length +
    //       ' ops...'
    //   );

    //   // We have a valid revision history.
    //   // Let's compress all ops into commits
    //   // that fall into 15 minute intervals.

    //   // data will track the V2 content document.
    //   let data = {};

    //   //let previousCommitTimestamp = vizV3.info.created;

    //   let previousCommitTimestampFloored = dateToTimestamp(
    //     every15Min.floor(timestampToDate(vizV3.info.created))
    //   );
    //   let uncommittedChanges = 0;
    //   let previousOpTimestamp;
    //   let previousContentV3 = (await getContent(forkedFrom)).value.data;
    //   let opTimestamp;

    //   const commitChanges = async ({ goodFiles, commitTimestamp }) => {
    //     //await play(soundHiHatTiny);
    //     //await new Promise((resolve) =>
    //     //  setTimeout(resolve, uncommittedChanges)
    //     //);

    //     logDetail(
    //       `    Aggregating changes from ${uncommittedChanges} ops to a commit at ${timestampToDate(
    //         commitTimestamp
    //       )}`
    //     );
    //     vizV3.content.files = computeV3Files(goodFiles, previousContentV3);
    //     vizV3.info.committed = false;
    //     vizV3.info.commitAuthors = [vizV2.info.owner];
    //     vizV3Forked.info = { ...vizV3Forked.info, ...vizV3.info };
    //     vizV3Forked.content = { ...vizV3Forked.content, ...vizV3.content };

    //     // Kludge: special case fix for strange emoji-related unicode diff error.
    //     vizV3Forked = removeEmoji(vizV3Forked);

    //     await saveViz(vizV3Forked);
    //     const commitVizResult = await commitViz(vizV3Forked.info.id);

    //     previousContentV3 = vizV3.content;
    //     uncommittedChanges = 0;
    //     vizV3Forked = (await getViz(vizV2.info.id)).value;
    //   };

    //   for (const op of ops) {
    //     // Initialize data from the create op.
    //     if (op.v === 0) {
    //       if (!op.create) {
    //         console.log("ERROR: First op should have op.create but it doesn't");
    //         process.exit();
    //       }
    //       data = op.create;
    //       continue;
    //     }

    //     // Round down to the nearest 15min interval
    //     const opDate = new Date(op.m.ts);
    //     const opDateFloored = every15Min.floor(opDate);
    //     const opTimestampFloored = dateToTimestamp(opDateFloored);
    //     opTimestamp = dateToTimestamp(opDate);

    //     // If we're moving on from the 15min interval of the previous commit...
    //     // AND there are uncommitted changes,
    //     // then make a commit now.
    //     if (
    //       opTimestampFloored !== previousCommitTimestampFloored &&
    //       uncommittedChanges
    //     ) {
    //       await commitChanges({
    //         goodFiles: getGoodFiles(data.data.files),

    //         // Use the actual timestamp from the op,
    //         // not the floored one,
    //         // to avoid cases where the commit timestamp
    //         // is before the creation timestamp.
    //         commitTimestamp: previousOpTimestamp,
    //       });
    //       previousCommitTimestampFloored = opTimestampFloored;
    //     } else {
    //       //console.log(
    //       //  `      Ops in same 15m interval ${opDateFloored}, not committing yet...`
    //       //);
    //     }

    //     data = json0.type.apply(data, op);
    //     uncommittedChanges++;
    //     previousOpTimestamp = opTimestamp;

    //     //await new Promise((resolve) => setTimeout(resolve, 1000));
    //   }
    //   // If we're done with all the ops,
    //   // AND there are uncommitted changes,
    //   // then make a commit now.
    //   if (uncommittedChanges) {
    //     logDetail('    Committing changes from final ops...');
    //     await commitChanges({
    //       goodFiles: getGoodFiles(data.data.files),
    //       commitTimestamp: opTimestamp,
    //     });
    //   }
    //   logDetail('  Done reconstructing history!');
    //   //await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};
