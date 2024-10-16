// For reference only. This is the old version of processViz.js
// import { timeMinute } from 'd3';
// import json0 from 'ot-json0';
// import {
//   generateId,
//   SaveViz,
//   ForkViz,
//   GetViz,
//   CommitViz,
//   UpvoteViz,
// } from 'interactors';
// import { timestampToDate, dateToTimestamp } from 'entities';
// import { diff } from 'ot';
// import { logDetail } from './logDetail';
// import { generateEmbedding } from './generateEmbedding';
// import { storeEmbedding } from './storeEmbedding';
// import { computeForkedFrom } from './computeForkedFrom';
// import { isolateGoodFiles, getGoodFiles } from './isolateGoodFiles';
// import { computeV3Files } from './computeV3Files';
// import { removeEmoji } from './removeEmoji';

// // Default height in pixels for vizzes.
// // In V3 data model, height is always explicit.
// const defaultHeight = 500;

// const every15Min = timeMinute.every(15);

// // TODO migrate collaborators
// export const processViz = async ({
//   vizV2,
//   gateways,
//   i,
//   redisClient,
//   contentCollection,
// }) => {
//   const { info, content, ops } = vizV2;
//   const { id, createdTimestamp } = info;

//   // Sometimes titles have leading or trailing spaces.
//   const title = info.title.trim();

//   logDetail(`Processing viz #${i}: ${id} ${title} `);

//   const goodFiles = isolateGoodFiles(content);
//   if (!goodFiles) {
//     console.log('  No good files, skipping.');
//     return;
//   }
//   const embedding = await generateEmbedding(goodFiles);

//   const isPrimordialViz = i === 0;

//   const { forkedFrom, forkedFromIsBackfilled } = await computeForkedFrom({
//     isPrimordialViz,
//     vizV2,
//     contentCollection,
//     embedding,
//     redisClient,
//   });

//   await storeEmbedding({
//     redisClient,
//     id,
//     embedding,
//     timestamp: createdTimestamp,
//   });

//   //  console.log({ forkedFrom, forkedFromIsBackfilled });

//   const vizV3 = {
//     info: {
//       id: vizV2.info.id,
//       owner: vizV2.info.owner,

//       // For now, folder is undefined,
//       // which should put it automatically in the users's
//       // "home view" above all folders.
//       //folder: 'TODO figure out folder here!',
//       title: title,
//       forkedFrom,
//       forkedFromIsBackfilled,
//       // This will be incremented later
//       forksCount: 0,
//       created: vizV2.info.createdTimestamp,
//       updated: vizV2.info.lastUpdatedTimestamp,
//       visibility: vizV2.info.privacy || 'public',
//       // This will be incremented later
//       upvotesCount: 0,
//     },
//     content: {
//       id: vizV2.info.id,
//       height: vizV2.info.height | defaultHeight,
//       title: vizV2.info.title,
//     },
//   };

//   if (forkedFromIsBackfilled) {
//     vizV3.info.forkedFromIsBackfilled = forkedFromIsBackfilled;
//   }

//   const {
//     saveCommit,
//     getContent,
//     getCommit,
//     getCommitAncestors,
//     saveMilestone,
//   } = gateways;
//   const saveViz = SaveViz(gateways);
//   const forkViz = ForkViz(gateways);
//   const getViz = GetViz(gateways);
//   const commitViz = CommitViz(gateways);
//   const upvoteViz = UpvoteViz(gateways);

//   if (isPrimordialViz) {
//     console.log('  This is the primordial viz!');
//     console.log('    Generating the Primordial Commit');

//     const primordialCommitId = generateId();

//     vizV3.info.start = primordialCommitId;
//     vizV3.info.end = primordialCommitId;
//     vizV3.info.committed = true;
//     vizV3.info.commitAuthors = [];
//     vizV3.info.isFrozen = false;

//     // Compute migrated V3 files from V2 files
//     vizV3.content.files = computeV3Files(goodFiles);

//     // The first ever commit.
//     // Special because it's the only with no parentCommitId.
//     const primordialCommit = {
//       id: primordialCommitId,
//       viz: vizV2.info.id,
//       authors: [vizV2.info.owner],
//       timestamp: vizV2.info.createdTimestamp,
//       ops: diff({}, vizV3.content),
//       milestone: null,
//     };

//     await saveCommit(primordialCommit);

//     const saveVizResult = await saveViz(vizV3);
//     console.log('    Saved primordial commit and viz!');
//     //          console.log((await getCommit(primordialCommitId)).value);
//     //          console.log((await getViz(vizV3.info.id)).value);
//     //    process.exit();
//     //
//     // Don't try for revision history on the primordial viz.
//     // It was not working correctly - some commits had no parents.
//   } else {
//     // Fork the forkedFrom viz.
//     // TODO fork from specific timestamp
//     const forkResult = await forkViz({
//       newOwner: vizV2.info.owner,
//       forkedFrom,
//       timestamp: vizV2.info.createdTimestamp,
//       newVizId: vizV2.info.id,
//     });
//     if (forkResult.outcome === 'failure') {
//       console.log('Error while forking.');
//       console.log(forkResult.error);
//       process.exit();
//     }

//     // vizV3Forked is the viz generated by forkViz.
//     // At this point, this viz has a new commit,
//     // but the content is still what it was forked from.
//     //
//     // Next, we need to modify its content.
//     let vizV3Forked = (await getViz(vizV2.info.id)).value;

//     // Revision History from ShareDB Ops
//     //
//     // Some of the op history for the early vizzes was unfortunately deleted.
//     // In particular, that of the first 1286 vizzes created.
//     // First, let's check if the viz has op history starting at version 0.
//     // If it does, then the op log history is intact and we can derive
//     // a complete revision history from it.
//     //
//     // While we could in theory try reconstructing a partial history by applying
//     // inverted ops from the current state, that seems sketchy as I'm
//     // not sure if the op inverses are all actually valid or not.
//     //
//     // So, let's just ignore the partial revision histories.

//     const ops = vizV2.ops;
//     const opHistoryIsValid = ops.length > 0 && ops[0].v === 0;

//     if (!opHistoryIsValid) {
//       //      await play(soundTom);
//       logDetail('  Op history is not valid. Creating simple commits.');
//       // Since we don't have valid revision history,
//       // let's just created a boring set of commits for this viz:
//       //  * One commit to fork (that just changes the id) at created timestamps
//       //  * One commit to modify the content at last updated

//       // Compute migrated V3 files from V2 files
//       const forkedFromContentV3 = (await getContent(forkedFrom)).value.data;
//       vizV3.content.files = computeV3Files(goodFiles, forkedFromContentV3);

//       // Prepare the viz for CommitViz
//       vizV3.info.committed = false;
//       vizV3.info.commitAuthors = [vizV2.info.owner];

//       // We modify the forked viz with the changes
//       // that make it the most recently modified
//       // version from Viz V2.
//       // Note that we want to keep a few fields
//       // in vizV3Forked, namely:
//       //  * info.start
//       //  * info.end
//       //  * info.isFrozen
//       vizV3Forked.info = { ...vizV3Forked.info, ...vizV3.info };
//       vizV3Forked.content = { ...vizV3Forked.content, ...vizV3.content };

//       // Kludge: special case fix for strange emoji-related unicode diff error.
//       vizV3Forked = removeEmoji(vizV3Forked);
//       await saveViz(vizV3Forked);
//       const commitVizResult = await commitViz(vizV3Forked.info.id);

//       //await new Promise((resolve) => setTimeout(resolve, 10000000));
//     } else {
//       //await play(soundHiHat);
//       logDetail(
//         '  Op history is valid! Reconstructing history from ' +
//           ops.length +
//           ' ops...'
//       );

//       // We have a valid revision history.
//       // Let's compress all ops into commits
//       // that fall into 15 minute intervals.

//       // data will track the V2 content document.
//       let data = {};

//       //let previousCommitTimestamp = vizV3.info.created;

//       let previousCommitTimestampFloored = dateToTimestamp(
//         every15Min.floor(timestampToDate(vizV3.info.created))
//       );
//       let uncommittedChanges = 0;
//       let previousOpTimestamp;
//       let previousContentV3 = (await getContent(forkedFrom)).value.data;
//       let opTimestamp;

//       const commitChanges = async ({ goodFiles, commitTimestamp }) => {
//         //await play(soundHiHatTiny);
//         //await new Promise((resolve) =>
//         //  setTimeout(resolve, uncommittedChanges)
//         //);

//         logDetail(
//           `    Aggregating changes from ${uncommittedChanges} ops to a commit at ${timestampToDate(
//             commitTimestamp
//           )}`
//         );
//         vizV3.content.files = computeV3Files(goodFiles, previousContentV3);
//         vizV3.info.committed = false;
//         vizV3.info.commitAuthors = [vizV2.info.owner];
//         vizV3Forked.info = { ...vizV3Forked.info, ...vizV3.info };
//         vizV3Forked.content = { ...vizV3Forked.content, ...vizV3.content };

//         // Kludge: special case fix for strange emoji-related unicode diff error.
//         vizV3Forked = removeEmoji(vizV3Forked);

//         await saveViz(vizV3Forked);
//         const commitVizResult = await commitViz(vizV3Forked.info.id);

//         previousContentV3 = vizV3.content;
//         uncommittedChanges = 0;
//         vizV3Forked = (await getViz(vizV2.info.id)).value;
//       };

//       for (const op of ops) {
//         // Initialize data from the create op.
//         if (op.v === 0) {
//           if (!op.create) {
//             console.log("ERROR: First op should have op.create but it doesn't");
//             process.exit();
//           }
//           data = op.create;
//           continue;
//         }

//         // Round down to the nearest 15min interval
//         const opDate = new Date(op.m.ts);
//         const opDateFloored = every15Min.floor(opDate);
//         const opTimestampFloored = dateToTimestamp(opDateFloored);
//         opTimestamp = dateToTimestamp(opDate);

//         // If we're moving on from the 15min interval of the previous commit...
//         // AND there are uncommitted changes,
//         // then make a commit now.
//         if (
//           opTimestampFloored !== previousCommitTimestampFloored &&
//           uncommittedChanges
//         ) {
//           await commitChanges({
//             goodFiles: getGoodFiles(data.data.files),

//             // Use the actual timestamp from the op,
//             // not the floored one,
//             // to avoid cases where the commit timestamp
//             // is before the creation timestamp.
//             commitTimestamp: previousOpTimestamp,
//           });
//           previousCommitTimestampFloored = opTimestampFloored;
//         } else {
//           //console.log(
//           //  `      Ops in same 15m interval ${opDateFloored}, not committing yet...`
//           //);
//         }

//         data = json0.type.apply(data, op);
//         uncommittedChanges++;
//         previousOpTimestamp = opTimestamp;

//         //await new Promise((resolve) => setTimeout(resolve, 1000));
//       }
//       // If we're done with all the ops,
//       // AND there are uncommitted changes,
//       // then make a commit now.
//       if (uncommittedChanges) {
//         logDetail('    Committing changes from final ops...');
//         await commitChanges({
//           goodFiles: getGoodFiles(data.data.files),
//           commitTimestamp: opTimestamp,
//         });
//       }
//       logDetail('  Done reconstructing history!');
//       //await new Promise((resolve) => setTimeout(resolve, 1000));
//     }
//   }

//   // Migrate upvotes
//   if (vizV2.info.upvotes && vizV2.info.upvotes.length > 0) {
//     logDetail(`Migrating ${vizV2.info.upvotes.length} upvotes`);
//     for (const upvote of vizV2.info.upvotes) {
//       const { userId, timestamp } = upvote;
//       await upvoteViz({
//         viz: id,
//         user: userId,
//         timestamp,
//       });
//     }
//   }
// };
