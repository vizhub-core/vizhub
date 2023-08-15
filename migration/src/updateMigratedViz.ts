import { timeMinute, timeFormat } from 'd3';
import { Gateways } from 'gateways';
import {
  Content,
  Info,
  Op,
  Viz,
  timestampToDate,
  FilesV2,
} from 'entities';
import { VizV2 } from './VizV2';
import { logDetail } from './logDetail';
import { computeV3Files } from './computeV3Files';
import { CommitViz, SaveViz } from 'interactors';

const dateFormat = timeFormat('%m/%d/%Y');

// Auto-commit changes from the oplog for every viz every 15 minutes.
const autoCommitInterval = timeMinute.every(15);

const debug = false;

// If we are here, then the viz has been migrated
// AND has also been updated in V2 but not yet in V3.
// We need to update the viz in V3 to reflect the changes.
// This applies to both the primordial viz and all other vizzes.
export const updateMigratedViz = async ({
  vizV2,
  gateways,

  // `infoMigrated` is the info for the viz in V3,
  // which is the already migrated version that
  // needs to be updated with more commits.
  infoMigrated,
  goodFiles,
}: {
  vizV2: VizV2;
  gateways: Gateways;
  infoMigrated: Info | undefined;
  goodFiles: FilesV2;
}) => {
  // console.log('vizV2.info', vizV2.info);
  // console.log('vizV2.content', vizV2.content);
  // console.log(JSON.stringify(vizV2, null, 2));
  if (!infoMigrated) {
    throw new Error('infoMigrated is undefined');
  }

  // Get the migrated content as well.
  const contentMigratedResult = await gateways.getContent(
    infoMigrated.id,
  );
  if (contentMigratedResult.outcome === 'failure') {
    console.log(
      'Error while getting content for viz in V3.',
    );
    console.log(contentMigratedResult.error);
    process.exit();
  }
  const contentMigrated: Content =
    contentMigratedResult.value.data;

  // We only need to consider the delta between the V2 and V3 versions,
  // which is isolated in the ops that happen between the last updated timestamps
  // for the V2 and V3 versions.

  // Get the last updated timestamp for the V2 version
  const lastUpdatedV2 = vizV2.info.lastUpdatedTimestamp;
  const lastUpdatedV2Date = timestampToDate(lastUpdatedV2);

  // Get the last updated timestamp for the V3 version
  const lastUpdatedV3 = infoMigrated.updated;
  const lastUpdatedV3Date = timestampToDate(lastUpdatedV3);

  if (debug) {
    console.log('in updateMigratedViz');
    console.log(
      'lastUpdatedV2',
      dateFormat(lastUpdatedV2Date),
    );
    console.log(
      'lastUpdatedV3',
      dateFormat(lastUpdatedV3Date),
    );
  }

  // Revision History from ShareDB Ops
  // ---------------------------------
  // Some of the op history for the early vizzes was unfortunately deleted.
  // In particular, that of the first 1286 vizzes created.
  // First, let's check if the viz has op history starting at version 0.
  // If it does, then the op log history is intact and we can derive
  // a complete revision history from it.
  //
  // While we could in theory try reconstructing a partial history by applying
  // inverted ops from the current state, that seems sketchy as I'm
  // not sure if the op inverses are all actually valid or not.
  //
  // So, let's just ignore the partial revision histories.
  const ops: Array<Op> = vizV2.ops;
  const opHistoryIsValid = ops.length > 0 && ops[0].v === 0;
  if (!opHistoryIsValid) {
    logDetail(
      '  Op history is not valid. Creating simple commits.',
    );
    // Since we don't have valid revision history,
    // let's just created a boring set of commits for this viz:
    //  * One commit to modify the content at last updated date

    // Prepare the viz for CommitViz by simulating the user editing it.
    // This is necessary because CommitViz expects the viz to have
    // been edited by the user.
    // All changes up until the last updated date are considered.
    const uncommitted: Viz = {
      // We modify the migrated viz with the changes
      // that make it the most recently modified
      // version from Viz V2.
      // Note that we want to keep a few fields
      // in vizV3Forked intact (from `...infoMigrated,`), namely:
      //  * info.start
      //  * info.end
      //  * info.isFrozen
      info: {
        ...infoMigrated,
        updated: lastUpdatedV2,
        committed: false,
        commitAuthors: [vizV2.info.owner],

        // Include title in case the title has changed.
        title: vizV2.info.title,
      },
      content: {
        ...contentMigrated,
        // Compute the files for the viz, ensuring that
        // where possible the file IDs carry over.
        files: computeV3Files(goodFiles, contentMigrated),
      },
    };

    const saveViz = SaveViz(gateways);
    const commitViz = CommitViz(gateways);

    //   // Kludge: special case fix for strange emoji-related unicode diff error.
    //   vizV3Forked = removeEmoji(vizV3Forked);
    const saveVizResult = await saveViz(uncommitted);
    if (saveVizResult.outcome === 'failure') {
      console.log('Error while saving viz.');
      console.log(saveVizResult.error);
      process.exit();
    }

    if (debug) {
      console.log(JSON.stringify(uncommitted, null, 2));

      console.log('infoMigrated.id', infoMigrated.id);

      console.log('==== Attempting to commit viz...');
    }
    const commitVizResult = await commitViz(
      infoMigrated.id,
    );
    if (commitVizResult.outcome === 'failure') {
      console.log('Error while committing viz.');
      console.log(commitVizResult.error);
      process.exit();
    }
    if (debug) {
      console.log('==== Successfully committed viz!');
    }
    logDetail(
      '  Created simple commits! Migrated viz is now up to date.',
    );
  }
};

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
// We have a valid revision history.

// // TODO figure out where this goes
// // Get the ops that happened between the last updated timestamps
// const ops = vizV2.ops.filter(
//   (op) => op.timestamp >= lastUpdatedV2 && op.timestamp <= lastUpdatedV3
// );
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
