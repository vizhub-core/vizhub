import { timeWeek } from 'd3-time';
import { initializeGateways } from 'database';
import { initializeV2MongoDBDatabase } from './initializeV2MongoDBDatabase';
import { redisSetup } from './redisSetup';
import { v2Vizzes } from './v2Vizzes';
import { getVizV2 } from './getVizV2';
import { dateToTimestamp, timestampToDate } from 'entities';
import { processViz } from './processViz';
import { migrateUserIfNeeded } from './migrateUserIfNeeded';
import { migrateUpvotesIfNeeded } from './migrateUpvotesIfNeeded';
import { logDetail } from './logDetail';
import { validateViz } from './validateViz';

// import { reportProgress } from './reportProgress';

// Delete everything in V3 Mongo and Redis when starting.
const startFresh = false;

// Hardcoded earliest timestamp.
// This is the lowest value for `vizInfo.createdTimestamp` in the V2 database.
const firstVizCreationDate = timestampToDate(1534246611);

// console.log('firstVizCreationMonthMin', firstVizCreationMonthMin);
// console.log('firstVizCreationMonthMax', firstVizCreationMonthMax);
// process.exit(0);

const migrate = async () => {
  console.log(`Initializing connections`);
  // The source database
  const { v2MongoDBDatabase, v2MongoClient } =
    await initializeV2MongoDBDatabase();

  // V2 collections
  const infoCollection = v2MongoDBDatabase.collection('documentInfo');
  const contentCollection = v2MongoDBDatabase.collection('documentContent');
  // const infoOpCollection = v2MongoDBDatabase.collection('o_documentInfo');
  const contentOpCollection = v2MongoDBDatabase.collection('o_documentContent');
  const userCollection = v2MongoDBDatabase.collection('user');

  // The target database
  const { gateways, mongoDBDatabase, mongoDBConnection } =
    await initializeGateways({
      isProd: true,
      env: process.env,
      // env: { ...process.env, VIZHUB3_MONGO_LOCAL: 'true' },
    });

  // Ping MongoDB to make sure it's working.
  await mongoDBDatabase.command({ ping: 1 });

  // Drop everything in V3 Mongo - DANGEROUS!
  // if (startFresh) {
  //   console.log('Dropping everything in V3 Mongo...');
  //   await mongoDBDatabase.dropDatabase();
  // }

  console.log('  Connected successfully to v3 MongoDB!');

  // Redis client! Used for storing embeddings and doing vector similarity search.
  const redisClient = await redisSetup(startFresh);

  // Ping Redis to make sure it's working.
  await redisClient.ping();

  console.log('    Connected successfully to v3 Redis!');

  // Floor the month using d3-time
  const firstVizCreationDateFloored = timeWeek.floor(firstVizCreationDate);

  // TODO persist this in Redis, so that we can resume from where we left off.
  let batchNumber = 0;

  // True to continue multiple batches, false to stop after one batch.
  const keepGoing = true;

  const performBatch = async () => {
    // Define a one-week batch of vizzes to migrate.
    const startTimeDate = timeWeek.offset(
      firstVizCreationDateFloored,
      batchNumber
    );
    const endTimeDate = timeWeek.offset(startTimeDate, 1);

    const startTime = dateToTimestamp(startTimeDate);
    const endTime = dateToTimestamp(endTimeDate);

    console.log('\nStarting migration batch #', batchNumber);
    console.log('  startTime', startTimeDate.toLocaleString());
    console.log('  endTime  ', endTimeDate.toLocaleString());

    console.log('process.argv', process.argv);

    process.exit(0);

    // Iterate over vizzes in the V2 database that may have been created
    // or updated during the time period defined by startTime and endTime.
    const numVizzesProcessed = await v2Vizzes(
      {
        infoCollection,
        startTime,
        endTime,
      },
      async (info, i) => {
        // Get the viz from the V2 database.
        const vizV2 = await getVizV2({
          info,
          contentCollection,
          contentOpCollection,
        });

        // Migrate the viz! Does not includes Upvotes or Users.
        logDetail(`Processing viz #${i}: ${info.id} ${info.title} `);
        const isVizV2Valid: boolean = await processViz({
          vizV2,
          gateways,
          i,
          redisClient,
          contentCollection,
        });

        // If the viz is invalid, skip it.
        if (!isVizV2Valid) {
          console.log(
            `  Skipping invalid V2 viz #${i}: ${info.id} ${info.title} `
          );
          return;
        }

        // Migrate upvotes
        // We do this always, because when an upvote is added to a viz,
        // the viz itself doesn't change (last updated date is not updated),
        // so we need to track the changes to upvotes separately.
        // Note that this migration only adds upvotes, it does not remove them.
        // So if an upvote is removed from a viz in the V2 database,
        // after having been migrated, it will still be in the V3 database.
        logDetail(`  Migrating upvotes`);
        await migrateUpvotesIfNeeded({
          vizV2,
          gateways,
        });

        // Migrate the viz owner if needed.
        logDetail(`  Migrating owner user`);
        process.stdout.write('    ');
        await migrateUserIfNeeded({
          userId: vizV2.info.owner,
          gateways,
          userCollection,
        });
        process.stdout.write('\n');

        // Migrate the users that upvoted this viz.
        if (vizV2.info.upvotes && vizV2.info.upvotes.length > 0) {
          logDetail(`  Migrating upvoter users`);
          process.stdout.write('    ');
          await Promise.all(
            vizV2.info.upvotes.map(({ userId }) =>
              migrateUserIfNeeded({
                userId,
                gateways,
                userCollection,
              })
            )
          );
          process.stdout.write('\n');
        }

        // Migrate the users that are collaborators on this viz.
        if (vizV2.info.collaborators && vizV2.info.collaborators.length > 0) {
          logDetail(`  Migrating collaborator users`);
          process.stdout.write('    ');
          await Promise.all(
            vizV2.info.collaborators.map(({ userId }) =>
              migrateUserIfNeeded({
                userId,
                gateways,
                userCollection,
              })
            )
          );
          process.stdout.write('\n');
        }

        // Check if the viz is valid after migration.
        logDetail(`Validating...`);
        const isVizV3Valid: boolean = await validateViz({
          id: info.id,
          gateways,
        });
        if (!isVizV3Valid) {
          console.log('Migrated viz is invalid! TODO roll back... ');
          process.exit(0);
        }
        logDetail(`Validation passed!`);
        // await reportProgress({ i, n });
      }
    );

    console.log(`\n\nFinished iterating ${numVizzesProcessed} vizzes!`);

    if (keepGoing) {
      batchNumber++;

      console.log(`\n\nPerforming next batch #${batchNumber}...`);

      await performBatch();
    }
  };

  await performBatch();

  // Close the connection to the v2 database
  await v2MongoClient.close();

  // Close the connection to the v3 database
  await mongoDBConnection.close();

  // Close the connection to Redis
  await redisClient.quit();
};

migrate();
