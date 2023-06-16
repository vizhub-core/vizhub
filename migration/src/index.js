import { timeMonth } from 'd3-time';
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
  const { v2MongoDBDatabase } = await initializeV2MongoDBDatabase();

  // V2 collections
  const infoCollection = v2MongoDBDatabase.collection('documentInfo');
  const contentCollection = v2MongoDBDatabase.collection('documentContent');
  const infoOpCollection = v2MongoDBDatabase.collection('o_documentInfo');
  const contentOpCollection = v2MongoDBDatabase.collection('o_documentContent');

  const n = await infoCollection.countDocuments();
  console.log('  Ready to migrate ' + n + ' V2 vizzes.');

  // The target database
  const { gateways, mongoDBDatabase } = await initializeGateways({
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
  const startTimeDate = timeMonth.floor(firstVizCreationDate);
  const endTimeDate = timeMonth.offset(startTimeDate, 1);
  const startTime = dateToTimestamp(startTimeDate);
  const endTime = dateToTimestamp(endTimeDate);

  v2Vizzes(
    {
      infoCollection,
      startTime,
      endTime,
    },
    async (info, i) => {
      // #1432 is the first the needs forkedFrom computed.
      // #15358 fails with emoji (viz id b091d7e3133748368c4999ecac1f3569)
      //
      //
      //if (i < 15357) {
      //  return;
      //}

      // True if this viz has already been migrated.
      // const alreadyMigrated =
      //   (await gateways.getInfo(info.id)).outcome === 'success';
      // if (alreadyMigrated) {
      //   // TODO add commits for any fresh changes
      //   // for incremental migration
      //   console.log('skipping already migrated #' + i);
      //   return;
      // }

      const vizV2 = await getVizV2({
        info,
        contentCollection,
        infoOpCollection,
        contentOpCollection,
      });

      console.log('info', JSON.stringify(info, null, 2));

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
};

migrate();
