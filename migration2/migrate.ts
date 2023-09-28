import { Gateways, Result } from 'gateways';
import { setupConnections } from './setupConnections/setupConnections';
import {
  MigrationStatus,
  Snapshot,
  timestampToDate,
} from 'entities';
import Prompt from 'prompt-sync';
import { getBatchTimestamps } from './getBatchTimestamps';
export type MigrateResult = {
  isTestRun: boolean;
  migrationStatus: MigrationStatus;
  gateways: Gateways;
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
      // TODO implement this path - roll back batch
      // Each entity needs to be handled differently, possibly
      // Commits need to be rolled back carefully, including
      //  - Reset the viz to the state it was in before the migration
      //    regarding the last updated date and the end commit id.
    } else {
      console.log(
        `Previous batch was successful. Starting batch number ${migrationStatus.currentBatchNumber}`,
      );

      // Update migration status for new batch
      migrationStatus.currentBatchNumber += 1;
      migrationStatus.currentBatchCompleted = false;
      await gateways.saveMigrationStatus(migrationStatus);
    }
  }

  // This is the batch number of the batch we are doing now.
  const batchNumber = migrationStatus.currentBatchNumber;

  // This window of time determines which window of time
  // we'll simulate for this migration batch.
  // The migration batch is only scoped to changes that happened
  // during this window of time. This means that any events outside this
  // time frame will be ignored, including:
  //  - Upvotes that happened outside this time frame
  const { batchStartTimestamp, batchEndTimestamp } =
    getBatchTimestamps(batchNumber);

  console.log(
    '  batch start date: ',
    timestampToDate(batchStartTimestamp).toLocaleString(),
  );
  console.log(
    '  batch end date: ',
    timestampToDate(batchEndTimestamp).toLocaleString(),
  );

  return {
    isTestRun: isTest,
    migrationStatus,

    // Gateways is returned only for testing purposes
    gateways,
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
