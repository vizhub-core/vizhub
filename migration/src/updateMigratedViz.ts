import { timeMinute, timeFormat } from 'd3';
import { Gateways } from 'gateways';
import { VizV2 } from './VizV2';
import { Info, timestampToDate } from 'entities';

const dateFormat = timeFormat('%m/%d/%Y');

// Auto-commit changes from the oplog for every viz every 15 minutes.
const autoCommitInterval = timeMinute.every(15);

// If we are here, then the viz has been migrated
// AND has also been updated in V2 but not yet in V3.
// We need to update the viz in V3 to reflect the changes.
// This applies to both the primordial viz and all other vizzes.
export const updateMigratedViz = async ({
  vizV2,
  gateways,
  infoMigrated,
}: {
  vizV2: VizV2;
  gateways: Gateways;
  infoMigrated: Info | undefined;
}) => {
  // console.log('in updateMigratedViz');
  // console.log('vizV2.info', vizV2.info);
  // console.log('vizV2.content', vizV2.content);
  // console.log(JSON.stringify(vizV2, null, 2));
  if (!infoMigrated) {
    throw new Error('infoMigrated is undefined');
  }
  // We only need to consider the delta between the V2 and V3 versions,
  // which is isolated in the ops that happen between the last updated timestamps
  // for the V2 and V3 versions.

  // Get the last updated timestamp for the V2 version
  const lastUpdatedV2 = vizV2.info.lastUpdatedTimestamp;
  const lastUpdatedV2Date = timestampToDate(lastUpdatedV2);

  // Get the last updated timestamp for the V3 version
  const lastUpdatedV3 = infoMigrated.updated;
  const lastUpdatedV3Date = timestampToDate(lastUpdatedV3);

  console.log('lastUpdatedV2', dateFormat(lastUpdatedV2Date));
  console.log('lastUpdatedV3', dateFormat(lastUpdatedV3Date));

  // Get the ops that happened between the last updated timestamps
  const ops = vizV2.ops.filter(
    (op) => op.timestamp >= lastUpdatedV2 && op.timestamp <= lastUpdatedV3
  );

  console.log('vizV2.ops', vizV2.ops);
  process.exit(0);

  // // At this point, this viz has a new commit,
  // // but the content is still what it was forked from.
  // //
  // // Next, we need to modify its content.
  // let vizV3Forked = (await getViz(vizV2.info.id)).value;
};

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
