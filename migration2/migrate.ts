import fs from 'fs';
import Prompt from 'prompt-sync';
import { Gateways, Result } from 'gateways';
import { setupConnections } from './setupConnections/setupConnections';
import {
  InfoV2,
  MigrationStatus,
  Snapshot,
  Viz,
  VizV2,
  timestampToDate,
} from 'entities';
import { getBatchTimestamps } from './getBatchTimestamps';
import { v2Vizzes } from './v2Vizzes';
import { getVizV2 } from './getVizV2';
import { processViz } from './processViz';

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
    const prompt = Prompt({});

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

  // Use fixtures if we're in test mode.
  // These are pre-exported V2 vizzes that we can use to test the migration.
  // This lets us test the migration without having to connect to the V2 database.
  const useFixtures = isTest;

  // Iterate over vizzes in the V2 database that may have been created
  // or updated during the time period defined by startTime and endTime.
  const numVizzesProcessed = await v2Vizzes(
    {
      v2InfoCollection,
      startTime: batchStartTimestamp,
      endTime: batchEndTimestamp,
      useFixtures,
    },
    async (info: InfoV2, i: number) => {
      let vizV2: VizV2;

      if (useFixtures) {
        const fileName = `./v2Fixtures/vizV2-${info.id}.json`;
        vizV2 = JSON.parse(
          fs.readFileSync(fileName, 'utf8'),
        );
      } else {
        // Get the viz from the V2 database.
        vizV2 = await getVizV2({
          info,
          v2ContentCollection,
          v2ContentOpCollection,
        });
      }

      // Migrate the viz! Does not includes Upvotes or Users.
      console.log(
        `Processing viz #${i}: ${info.id} ${info.title} `,
      );

      // This code generates fixtures for the first 5 vizzes.
      const generateFixtures = false;
      const fileName = `./v2Fixtures/vizV2-${info.id}.json`;
      if (generateFixtures) {
        fs.writeFileSync(
          fileName,
          JSON.stringify(vizV2, null, 2),
        );
        if (i > 4) {
          process.exit(0);
        }
      }

      const isVizV2Valid: boolean = await processViz({
        vizV2,
        gateways,
        v2ContentCollection,
        batchStartTimestamp,
        batchEndTimestamp,
      });

      // // If the viz is invalid, skip it.
      // if (!isVizV2Valid) {
      //   console.log(
      //     `  Skipping invalid V2 viz #${i}: ${info.id} ${info.title} `,
      //   );
      //   return;
      // }

      // // Migrate upvotes
      // // We do this always, because when an upvote is added to a viz,
      // // the viz itself doesn't change (last updated date is not updated),
      // // so we need to track the changes to upvotes separately.
      // // Note that this migration only adds upvotes, it does not remove them.
      // // So if an upvote is removed from a viz in the V2 database,
      // // after having been migrated, it will still be in the V3 database.
      // logDetail(`  Migrating upvotes`);
      // await migrateUpvotesIfNeeded({
      //   vizV2,
      //   gateways,
      // });

      // // Migrate the viz owner if needed.
      // logDetail(`  Migrating owner user`);
      // process.stdout.write('    ');
      // await migrateUserIfNeeded({
      //   userId: vizV2.info.owner,
      //   gateways,
      //   userCollection,
      // });
      // process.stdout.write('\n');

      // // Migrate the users that upvoted this viz.
      // if (
      //   vizV2.info.upvotes &&
      //   vizV2.info.upvotes.length > 0
      // ) {
      //   logDetail(`  Migrating upvoter users`);
      //   process.stdout.write('    ');
      //   await Promise.all(
      //     vizV2.info.upvotes.map(({ userId }) =>
      //       migrateUserIfNeeded({
      //         userId,
      //         gateways,
      //         userCollection,
      //       }),
      //     ),
      //   );
      //   process.stdout.write('\n');
      // }

      // // Migrate the users that are collaborators on this viz.
      // if (
      //   vizV2.info.collaborators &&
      //   vizV2.info.collaborators.length > 0
      // ) {
      //   logDetail(`  Migrating collaborator users`);
      //   process.stdout.write('    ');
      //   await Promise.all(
      //     vizV2.info.collaborators.map(({ userId }) =>
      //       migrateUserIfNeeded({
      //         userId,
      //         gateways,
      //         userCollection,
      //       }),
      //     ),
      //   );
      //   process.stdout.write('\n');
      // }

      // // Check if the viz is valid after migration.
      // logDetail(`Validating...`);
      // const isVizV3Valid: boolean = await validateViz({
      //   id: info.id,
      //   gateways,
      // });
      // if (!isVizV3Valid) {
      //   console.log(
      //     'Migrated viz is invalid! TODO roll back... ',
      //   );
      //   process.exit(0);
      // }
      // logDetail(`Validation passed!`);
      // // await reportProgress({ i, n });
    },
  );

  return {
    isTestRun: isTest,
    migrationStatus,

    // Gateways is returned only for testing purposes
    gateways,
  };
};
