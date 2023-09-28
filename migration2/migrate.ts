import { setupConnections } from './setupConnections/setupConnections';

export type MigrateResult = {
  isTestRun: boolean;
};

export const migrate = async ({
  isTest,
}): Promise<MigrateResult> => {
  if (!isTest) {
    ('migrating for real');
  }

  const {
    v2MongoDBDatabase,
    v2MongoClient,
    infoCollection,
    contentCollection,
    // infoOpCollection,
    contentOpCollection,
    userCollection,
    gateways,
    mongoDBDatabase,
    mongoDBConnection,
  } = await setupConnections();

  const  = await gateways.getMigrationStatus();

  const { batchStartTimestamp, batchEndTimestamp } =
    getBatchTimestamps(batchNumber);

  return {
    isTestRun: isTest,
  };

  // TODO
  //
  // Viz Iteration Layer
  // - Connect to layer that iterates vizzes
  // - Develop a mock iteration layer for testing
  // - Use a scrape of data that we commit to the repo
  //
  // Embeddings
  // - Develop an interface for computing embeddings
  // - Mock that interface to run locally - random vectors
  // - Add tests for it
  // - Develop an interface for storing and querying embeddings
  // - Mock that interface to run in-memory
  //
  // Entity Migration
  // - Add tests for migrating a viz
  // - Migrate viz op history
  // - Migrate upvotes
  // - Migrate collaborators
  // - Migrate users (owner, upvoters, collaborators)
  //
  // Full Migration
  // - Add tests for completely migrating partially migrated viz
  // - Add tests for rolling back a migration batch
};
