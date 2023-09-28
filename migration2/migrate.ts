import { Result } from 'gateways';
import { setupConnections } from './setupConnections/setupConnections';
import { MigrationStatus, Snapshot } from 'entities';

export type MigrateResult = {
  isTestRun: boolean;
  migrationStatus: MigrationStatus;
};

export const migrate = async ({
  isTest,
}: {
  isTest: boolean;
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
  } = await setupConnections({
    isTest,
  });

  const migrationStatusResult: Result<
    Snapshot<MigrationStatus>
  > = await gateways.getMigrationStatus('v2');

  let migrationStatus: MigrationStatus;

  if (migrationStatusResult.outcome === 'failure') {
    console.log(
      'No existing migration status found. Starting first migration batch!',
    );
    migrationStatus = {
      id: 'v2',
      currentBatchNumber: 0,
    };
    gateways.saveMigrationStatus(migrationStatus);
  }

  // const { batchStartTimestamp, batchEndTimestamp } =
  //   getBatchTimestamps(batchNumber);

  return {
    isTestRun: isTest,
    migrationStatus,
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
