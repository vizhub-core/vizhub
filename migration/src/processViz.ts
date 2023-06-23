import { Info } from 'entities';
import { logDetail } from './logDetail';
import { generateEmbeddingOpenAI } from './generateEmbeddingOpenAI';
import { storeEmbedding } from './storeEmbedding';
import { computeForkedFrom } from './computeForkedFrom';
import { isolateGoodFiles } from './isolateGoodFiles';
import { Gateways } from 'gateways';
import { Collection } from 'mongodb-legacy';
import { updateMigratedViz } from './updateMigratedViz';
import { migratePrimordialViz } from './migratePrimordialViz';
import { createMigratedViz } from './createMigratedViz';

// Hardcoded ID of the primordial viz (actually in the V2 database)
const primordialVizId = '86a75dc8bdbe4965ba353a79d4bd44c8';

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
}): Promise<boolean> => {
  // Setup

  const { id, createdTimestamp } = vizV2.info;
  const isPrimordialViz = id === primordialVizId;

  // Sometimes titles have leading or trailing spaces, so trim that.
  const title = vizV2.info.title.trim();

  // Figure out if the viz has already been migrated.
  const infoMigratedResult = await gateways.getInfo(id);
  const isAlreadyMigrated = infoMigratedResult.outcome === 'success';
  logDetail(`  Already migrated: ${isAlreadyMigrated}`);
  let infoMigrated: Info | undefined;
  if (isAlreadyMigrated) {
    infoMigrated = infoMigratedResult.value.data;
  }

  // If the viz has already been migrated, figure out if it has been updated since then.
  let updatedSinceLastMigration: boolean = false;
  if (isAlreadyMigrated) {
    const infoMigrated: Info = infoMigratedResult.value.data;
    updatedSinceLastMigration =
      vizV2.info.lastUpdatedTimestamp > infoMigrated.updated;
  }
  logDetail(`  Updated since last migration: ${updatedSinceLastMigration}`);

  // If the viz has already been migrated and has not been updated since,
  // then skip it.
  if (isAlreadyMigrated && !updatedSinceLastMigration) {
    logDetail('  Already migrated and not updated since, skipping this viz.');
    return false;
  }

  // Isolate the "good files" that we want to use for embedding.
  // This excludes invalid files and `bundle.js` (since it's auto-generated).
  const goodFiles = isolateGoodFiles(vizV2.content);

  // If there are no good files, skip this viz! It's not worth migrating.
  if (!goodFiles) {
    console.log('  No good files, skipping this viz.');
    return false;
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

  if (!isAlreadyMigrated) {
    console.log(
      '   This viz has not been migrated yet. Migrating viz for the first time...'
    ); // Handle the primordial viz.
    if (isPrimordialViz) {
      console.log('   This is the primordial viz first migration!');
      await migratePrimordialViz({
        vizV2,
        title,
        forkedFrom,
        forkedFromIsBackfilled,
        goodFiles,
        gateways,
      });
      // After this operation, we are done with this viz.
      return true;
    } else {
      console.log(
        '    This viz has already been migrated. Updating migrated viz...'
      );
      // This viz has not been migrated yet.
      // So we need to create the viz in V3 by forking, then update it.
      const creationResult = await createMigratedViz({
        vizV2,
        // title,
        forkedFrom,
        // forkedFromIsBackfilled,
        // goodFiles,
        gateways,
      });
      if (creationResult.outcome === 'failure') {
        console.log('    Failed to create migrated viz!');
        return false;
      }
      infoMigrated = creationResult.value;
    }
  }

  // This gets called in all cases:
  // - if the viz has not been migrated yet, it gets called after the viz is created.
  // - if the viz has already been migrated, it gets called after the viz is updated.
  // - the viz may even be the primordial viz, in which case it gets called after the viz is created.
  updateMigratedViz({
    vizV2,
    gateways,
    infoMigrated,
  });

  return true;
};
