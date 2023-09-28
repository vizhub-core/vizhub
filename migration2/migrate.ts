import { Gateways, Result } from 'gateways';
import { setupConnections } from './setupConnections/setupConnections';
import { MigrationStatus, Snapshot } from 'entities';
import Prompt from 'prompt-sync';
export type MigrateResult = {
  isTestRun: boolean;
  migrationStatus: MigrationStatus;
};

export const migrate = async ({
  isTest,
  loadTestFixtures,
}: {
  isTest: boolean;
  loadTestFixtures?: (gateways: Gateways) => Promise<void>;
}): Promise<MigrateResult> => {
  if (!isTest) {
    console.log('migrating for real');
    // Prompt user to make sure they want to do this
    const prompt = Prompt();

    const yes = prompt(
      'Are you sure you want to migrate the database? (y/n) ',
    );
    if (yes !== 'y') {
      console.log('Aborting migration.');
      process.exit(0);
    }
  }

  const {
    v2MongoDBDatabase,
    v2MongoClient,
    v2InfoCollection,
    v2ContentCollection,
    v2ContentOpCollection,
    v2UserCollection,
    gateways,
    mongoDBDatabase,
    mongoDBConnection,
  } = await setupConnections({
    isTest,
    loadTestFixtures,
  });

  const migrationStatusResult: Result<
    Snapshot<MigrationStatus>
  > = await gateways.getMigrationStatus('v2');

  let migrationStatus: MigrationStatus;

  // Check if we're starting a new migration, first batch
  if (migrationStatusResult.outcome === 'failure') {
    console.log(
      'No existing migration status found. Starting first migration batch!',
    );
    migrationStatus = {
      id: 'v2',
      currentBatchNumber: 0,
      currentBatchCompleted: false,
    };
    gateways.saveMigrationStatus(migrationStatus);
  } else {
    migrationStatus = migrationStatusResult.value.data;
    console.log(
      `Found existing migration status. Starting from batch ${migrationStatus.currentBatchNumber}`,
    );

    // If previous batch was unsuccessful, roll back to previous batch
    if (migrationStatus.currentBatchCompleted === false) {
      console.log(
        `Previous batch was unsuccessful. Rolling back batch number ${migrationStatus.currentBatchNumber}`,
      );
      // TODO test this path
    } else {
      console.log(
        `Previous batch was successful. Starting batch number ${migrationStatus.currentBatchNumber}`,
      );
      // Update migration status for new batch
      migrationStatus.currentBatchCompleted = false;
      migrationStatus.currentBatchNumber += 1;
      await gateways.saveMigrationStatus(migrationStatus);
    }
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
