// import { Info, FilesV2 } from 'entities';
// import { logDetail } from './logDetail';
// import { generateEmbeddingOpenAI } from './generateEmbeddingOpenAI';
// import { computeForkedFrom } from './computeForkedFrom';
import { isolateGoodFiles } from './isolateGoodFiles';
import { FilesV2, VizV2 } from 'entities';
import { Gateways } from 'gateways';
import { Collection } from 'mongodb-legacy';
// import { updateMigratedViz } from './updateMigratedViz';
// import { migratePrimordialViz } from './migratePrimordialViz';
// import { createMigratedViz } from './createMigratedViz';
// import { getEmbedding, storeEmbedding } from './redisSetup';
// import { VizV2 } from './VizV2';
// import { ScoreViz } from 'interactors';
// import { storeVizEmbedding } from './embeddings';

// Hardcoded ID of the primordial viz (actually in the V2 database)
const primordialVizId = '86a75dc8bdbe4965ba353a79d4bd44c8';

// Feature flag
const enableEmbedding = false;

// Processes a single viz.
// Returns true if the viz is valid (worthy of migration), false if not.
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
  vizV2: VizV2;
  gateways: Gateways;
  i: number;
  redisClient: any;
  contentCollection: Collection;
}): Promise<boolean> => {
  // Setup

  const { id, createdTimestamp, privacy } = vizV2.info;

  console.log('checking privacy', privacy);

  const skipPrivateVizzes = true;
  // If the viz is private, skip it for now.
  // TODO test this path
  if (skipPrivateVizzes && privacy === 'private') {
    console.log('  Private viz, skipping this viz.');
    return false;
  }

  const isPrimordialViz = id === primordialVizId;

  // Sometimes titles have leading or trailing spaces, so trim that.
  const title = vizV2.info.title.trim();

  // // Figure out if the viz has already been migrated.
  // const infoMigratedResult = await gateways.getInfo(id);
  // const isAlreadyMigrated =
  //   infoMigratedResult.outcome === 'success';
  // logDetail(`  Already migrated: ${isAlreadyMigrated}`);
  // let infoMigrated: Info | undefined;
  // if (isAlreadyMigrated) {
  //   infoMigrated = infoMigratedResult.value.data;
  // }

  // // If the viz has already been migrated, figure out if it has been updated since then.
  // let updatedSinceLastMigration: boolean = false;
  // if (isAlreadyMigrated) {
  //   const infoMigrated: Info =
  //     infoMigratedResult.value.data;
  //   updatedSinceLastMigration =
  //     vizV2.info.lastUpdatedTimestamp >
  //     infoMigrated.updated;
  // }
  // logDetail(
  //   `  Updated since last migration: ${updatedSinceLastMigration}`,
  // );

  // // If the viz has already been migrated and has not been updated since,
  // // then do nothing and report that it is valid.
  // if (isAlreadyMigrated && !updatedSinceLastMigration) {
  //   logDetail(
  //     '  Already migrated and not updated since, skipping this viz.',
  //   );
  //   return true;
  // }

  // Isolate the "good files" that we want to use for embedding.
  // This excludes invalid files and `bundle.js` (since it's auto-generated).
  const goodFiles: FilesV2 = isolateGoodFiles(
    vizV2.content,
  );

  // If there are no good files, skip this viz! It's not worth migrating.
  if (!goodFiles) {
    console.log('  No good files, skipping this viz.');
    return false;
  }

  console.log('  goodFiles:', goodFiles);

  // // If we are here, it means we are going to migrate this viz,
  // // either because it has not been migrated yet,
  // // or because it has been updated since the last migration.
  // let embedding = null;

  // if (enableEmbedding) {
  //   // TODO use
  //   // If the embedding is already stored in Redis, don't re-compute it.
  //   // logDetail(
  //   //   '  Checking if embedding is already stored in Redis...',
  //   // );
  //   // const existingEmbedding = await getEmbedding({
  //   //   redisClient,
  //   //   id,
  //   // });
  //   const existingEmbedding = null;
  //   if (existingEmbedding === null) {
  //     // Generate the embedding for the viz (latest version).
  //     logDetail('  Existing embedding not found,');
  //     logDetail('  Generating embedding');
  //     embedding = await generateEmbeddingOpenAI(goodFiles);

  //     // Store the embedding in Redis.
  //     logDetail('    Storing embedding...');

  //     // TODO store embedding in PostgreSQL
  //     console.log(embedding);

  //     process.exit();
  //     await storeEmbedding({
  //       redisClient,
  //       id,
  //       embedding,
  //       timestamp: createdTimestamp,
  //     });
  //     logDetail('    Stored embedding in Redis!');
  //   } else {
  //     logDetail('  Embedding found in Redis!');
  //     embedding = existingEmbedding;
  //   }
  // }

  // // Store the embedding in MongoDB.
  // // logDetail('    Storing embedding in MongoDB...');
  // // await storeVizEmbedding({
  // //   gateways,
  // //   id,
  // //   vector: embedding,
  // // });
  // // logDetail('    Stored embedding in MongoDB!');

  // // Compute the forkedFrom and forkedFromIsBackfilled fields.
  // const { forkedFrom, forkedFromIsBackfilled } =
  //   await computeForkedFrom({
  //     isPrimordialViz,
  //     vizV2,
  //     contentCollection,
  //     embedding,
  //     redisClient,
  //   });

  // console.log('  forkedFrom:', forkedFrom);
  // console.log(
  //   '  forkedFromIsBackfilled:',
  //   forkedFromIsBackfilled,
  // );

  // if (!isAlreadyMigrated) {
  //   console.log(
  //     '   This viz has not been migrated yet. Migrating viz for the first time...',
  //   ); // Handle the primordial viz.
  //   if (isPrimordialViz) {
  //     console.log(
  //       '   This is the primordial viz first migration!',
  //     );
  //     await migratePrimordialViz({
  //       vizV2,
  //       title,
  //       forkedFrom,
  //       forkedFromIsBackfilled,
  //       goodFiles,
  //       gateways,
  //     });
  //     // After this operation, we are done with this viz.
  //     return true;
  //   } else {
  //     console.log(
  //       '   This is the first migration of a non-primordial viz!',
  //     );

  //     // Hold off for now.
  //     process.exit(1);
  //     // This viz has not been migrated yet.
  //     // So we need to create the viz in V3 by forking, then update it.
  //     const creationResult = await createMigratedViz({
  //       vizV2,
  //       forkedFrom,
  //       gateways,
  //     });
  //     if (creationResult.outcome === 'failure') {
  //       console.log('    Failed to create migrated viz!');
  //       return false;
  //     }
  //     infoMigrated = creationResult.value;
  //   }
  // }

  // // This gets called in all cases:
  // // - if the viz has not been migrated yet, it gets called after the viz is created.
  // // - if the viz has already been migrated, it gets called after the viz is updated.
  // // - the viz may even be the primordial viz, in which case it gets called after the viz is created.
  // await updateMigratedViz({
  //   vizV2,
  //   gateways,
  //   infoMigrated,
  //   goodFiles,
  // });

  // // Score the viz
  // const scoreViz = ScoreViz(gateways);
  // console.log('  Scoring viz...');
  // await scoreViz({ viz: id });

  // Compute the embedding for the viz (latest version).
  // const embedding = await generateEmbeddingOpenAI(goodFiles);

  return true;
};
