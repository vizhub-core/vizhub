import { timeWeek } from 'd3-time';
import { initializeGateways } from 'database';
import { initializeV2MongoDBDatabase } from './initializeV2MongoDBDatabase';
import { redisSetup } from './redisSetup';
import { v2Vizzes } from './v2Vizzes';
import { getVizV2 } from './getVizV2';
import { dateToTimestamp, timestampToDate } from 'entities';
// import { processViz } from './processViz';
// import { reportProgress } from './reportProgress';

// Delete everything in V3 Mongo and Redis when starting.
const startFresh = true;

// Hardcoded earliest timestamp.
// This is the lowest value for `vizInfo.createdTimestamp` in the V2 database.
const firstVizCreationDate = timestampToDate(1534246611);

// console.log('firstVizCreationMonthMin', firstVizCreationMonthMin);
// console.log('firstVizCreationMonthMax', firstVizCreationMonthMax);
// process.exit(0);

const migrate = async () => {
  // The source database
  const { v2MongoDBDatabase, v2MongoClient } =
    await initializeV2MongoDBDatabase();

  // V2 collections
  const infoCollection = v2MongoDBDatabase.collection('documentInfo');
  const contentCollection = v2MongoDBDatabase.collection('documentContent');
  const infoOpCollection = v2MongoDBDatabase.collection('o_documentInfo');
  const contentOpCollection = v2MongoDBDatabase.collection('o_documentContent');

  const n = await infoCollection.countDocuments();
  console.log('  Ready to migrate ' + n + ' V2 vizzes.');

  // The target database
  const { gateways, mongoDBDatabase, mongoDBConnection } =
    await initializeGateways({
      isProd: true,
      env: process.env,
    });

  await mongoDBDatabase.command({ ping: 1 });

  console.log('  Connected successfully to v3 MongoDB!');

  // Redis client! Used for storing embeddings and doing vector similarity search.
  const redisClient = await redisSetup(startFresh);

  // Ping Redis to make sure it's working.

  await redisClient.ping();

  console.log('  Connected successfully to v3 Redis!');

  // Floor the month using d3-time
  const firstVizCreationDateFloored = timeWeek.floor(firstVizCreationDate);

  // TODO persist this in Redis, so that we can resume from where we left off.
  const batchNumber = 0;

  // Define a one-week batch of vizzes to migrate.
  const startTimeDate = timeWeek.offset(
    firstVizCreationDateFloored,
    batchNumber
  );
  const endTimeDate = timeWeek.offset(startTimeDate, 1);

  const startTime = dateToTimestamp(startTimeDate);
  const endTime = dateToTimestamp(endTimeDate);

  console.log('\nbatchNumber', batchNumber);
  console.log('startTime', startTimeDate.toLocaleString());
  console.log('endTime  ', endTimeDate.toLocaleString());

  const numVizzesProcessed = await v2Vizzes(
    {
      infoCollection,
      startTime,
      endTime,
    },
    async (info, i) => {
      const vizV2 = await getVizV2({
        info,
        contentCollection,
        infoOpCollection,
        contentOpCollection,
      });

      // console.log('info', JSON.stringify(info, null, 2));

      console.log('processing viz #' + i + ' ' + info.id);
      // await processViz({
      //   vizV2,
      //   gateways,
      //   i,
      //   redisClient,
      //   contentCollection,
      // });

      // await reportProgress({ i, n });
    }
  );

  console.log(`\n\nFinished iterating ${numVizzesProcessed} vizzes!`);

  // Close the connection to the v2 database
  await v2MongoClient.close();

  // Close the connection to the v3 database
  await mongoDBConnection.close();

  // Close the connection to Redis
  await redisClient.quit();
};

migrate();
