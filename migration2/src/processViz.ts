// import { Info, FilesV2 } from 'entities';
// import { logDetail } from './logDetail';
import { generateEmbeddingOpenAI } from './generateEmbeddingOpenAI';
// import { computeForkedFrom } from './computeForkedFrom';
import { isolateGoodFiles } from './isolateGoodFiles';
import {
  FilesV2,
  VizV2,
  Timestamp,
  Info,
  VizEmbedding,
} from 'entities';
import { Gateways } from 'gateways';
import { Collection } from 'mongodb-legacy';
import { migratePrimordialViz } from './migratePrimordialViz';
import { readFileSync, writeFileSync } from 'fs';
// import { updateMigratedViz } from './updateMigratedViz';
// import { migratePrimordialViz } from './migratePrimordialViz';
// import { createMigratedViz } from './createMigratedViz';
// import { getEmbedding, storeEmbedding } from './redisSetup';
// import { VizV2 } from './VizV2';
// import { ScoreViz } from 'interactors';
// import { storeVizEmbedding } from './embeddings';

// Hardcoded ID of the primordial viz (actually in the V2 database)
export const primordialVizId =
  '86a75dc8bdbe4965ba353a79d4bd44c8';

// Feature flag to enable/disable embeddings.
const enableEmbedding = false;

// If the viz is private, skip it for now.
const skipPrivateVizzes = true;

// Processes a single viz.
// Returns true if the viz is valid (worthy of migration), false if not.
// Assumption: the same viz can be processed multiple times without issue.
// e.g. if the process is interrupted, it can be restarted, or
// if the process is run multiple times, it will not cause issues, or
// if an already migrated viz has been updated in V2, it can be re-migrated.
export const processViz = async ({
  vizV2,
  gateways,
  v2ContentCollection,
  batchStartTimestamp,
  batchEndTimestamp,
  useFixtures,
  generateFixtures,
}: {
  vizV2: VizV2;
  gateways: Gateways;
  v2ContentCollection: Collection;
  batchStartTimestamp: Timestamp;
  batchEndTimestamp: Timestamp;
  useFixtures: boolean;
  generateFixtures;
}): Promise<boolean> => {
  // Setup

  const { id, createdTimestamp, privacy } = vizV2.info;

  // console.log('checking privacy', privacy);

  // TODO test this path
  if (skipPrivateVizzes && privacy === 'private') {
    console.log('  Private viz, skipping this viz.');
    return false;
  }

  const isPrimordialViz = id === primordialVizId;

  // Sometimes titles have leading or trailing spaces, so trim that.
  const title = vizV2.info.title.trim();

  // Figure out if the viz has already been migrated.
  const infoMigratedResult = await gateways.getInfo(id);
  const isAlreadyMigrated =
    infoMigratedResult.outcome === 'success';
  console.log(`  Already migrated: ${isAlreadyMigrated}`);
  // let infoMigrated: Info | undefined;
  // if (isAlreadyMigrated) {
  //   infoMigrated = infoMigratedResult.value.data;
  // }

  // If the viz has already been migrated, figure out if it has been updated since then.
  // let updatedSinceLastMigration: boolean = false;
  // if (isAlreadyMigrated) {
  //   const infoMigrated: Info =
  //     infoMigratedResult.value.data;
  //   updatedSinceLastMigration =
  //     vizV2.info.lastUpdatedTimestamp >
  //     infoMigrated.updated;
  // }
  // console.log(
  //   `  Updated since last migration: ${updatedSinceLastMigration}`,
  // );

  // If the viz has already been migrated and has not been updated since,
  // then do nothing and report that it is valid.
  // if (isAlreadyMigrated && !updatedSinceLastMigration) {
  if (isAlreadyMigrated) {
    // TODO catch updates to the viz since it was migrated
    console.log('  Already migrated, skipping this viz.');
    return true;
  }

  // Isolate the "good files" that we want to use for embedding.
  // This excludes invalid files and `bundle.js` (since it's auto-generated).
  const goodFiles: FilesV2 | null = isolateGoodFiles(
    vizV2.content,
  );

  // If there are no good files, skip this viz! It's not worth migrating.
  if (goodFiles === null) {
    console.log('  No good files, skipping this viz.');
    return false;
  }

  if (isPrimordialViz) {
    console.log(
      '   This is the primordial viz first migration!',
    );
    await migratePrimordialViz({
      vizV2,
      title,
      goodFiles,
      gateways,
    });

    // Is this the right place to update the embedding?
    // Imagine a world where ever 15 minutes, we update the embedding for all vizzes.
    // Meaning, we query for the vizzes that need to have their embeddings updated,
    // which is true when the viz has been updated since the last embedding update.
    //
    // This is complex because the embedding is stored in supabase, but the Info
    // documents are stored in MongoDB.
    //
    // Options for implementation:
    //  - For each viz, fetch its embedding from Supabase, check commit id.
    //    If commit id is different, update the embedding.
    //    This is a lot of requests to Supabase.
    //  - For each viz, fetch its Info document from MongoDB, check commit id.
    //    If commit id is different than ____, update the embedding.
    //    We'd need to define a new field in the Info document to store the commit id
    //    of the last computed embedding, which we could potentially do.
    //    This is _not_ a lot of requests to MongoDB because we could isolate the
    //    Info documents that need to be updated with a single MongoDB query.
    //
    //    If we're adding a new field to the Info document, we could also add a field
    //    `embeddingIsUpToDate` which is a boolean. This would allow us to skip
    //    the embedding computation for vizzes that have not been updated since
    //    the last embedding computation.
    //
    //    This is the best option, but would require that the interactor for committing
    //    a viz also updates the `embeddingIsUpToDate` field.
    // await updateEmbeddings();
    // After this operation, we are done with this viz.
    return true;
  }

  // Next steps:
  // - determine if this viz needs to be created or updated
  // - if it needs to be created, create it
  // - if it needs to be updated, update it

  // // Compute the forkedFrom and forkedFromIsBackfilled fields.
  // const { forkedFrom, forkedFromIsBackfilled } =
  //   await computeForkedFrom({
  //     isPrimordialViz,
  //     vizV2,
  //     contentCollection,
  //     embedding,
  //     redisClient,
  //   });

  // // If createdTimestamp is between batchStartTimestamp and batchEndTimestamp,
  // const vizNeedsCreation =
  //   createdTimestamp >= batchStartTimestamp &&
  //   createdTimestamp < batchEndTimestamp;

  //   if(vizNeedsCreation) {

  // // console.log('  goodFiles:', goodFiles);

  // Compute the embedding for the viz (latest version).
  const embedding: Array<number> = useFixtures
    ? JSON.parse(
        readFileSync(
          `./embeddings/${vizV2.info.id}.json`,
          'utf8',
        ),
      )
    : await generateEmbeddingOpenAI(goodFiles);

  if (generateFixtures) {
    writeFileSync(
      `./embeddings/${vizV2.info.id}.json`,
      JSON.stringify(embedding),
    );
  }
  // console.log('  embedding:', embedding);

  const vizEmbedding: VizEmbedding = {
    vizId: id,
    embedding,
  };

  // process.exit();

  // TODO connect to postgresql for embedding storage

  // import { createClient } from '@supabase/supabase-js'

  // const supabaseUrl = 'https://fovknjmalizayekfairw.supabase.co'
  // const supabaseKey = process.env.SUPABASE_KEY
  // const supabase = createClient(supabaseUrl, supabaseKey)

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

  return true;
};
