import { mongoDBSetup } from './mongoDBSetup';
import { redisSetup } from './redisSetup';
import { v2Vizzes } from './v2Vizzes';
import { getVizV2 } from './getVizV2';
import { processViz } from './processViz';
import { reportProgress } from './reportProgress';

// Delete everything in V3 Mongo and Redis when starting.
const startFresh = true;

const migrate = async () => {
  const { v2MongoDBDatabase, databaseGateways } = await mongoDBSetup(
    startFresh
  );

  // V2 collections
  const infoCollection = v2MongoDBDatabase.collection('documentInfo');
  const contentCollection = v2MongoDBDatabase.collection('documentContent');
  const infoOpCollection = v2MongoDBDatabase.collection('o_documentInfo');
  const contentOpCollection = v2MongoDBDatabase.collection('o_documentContent');

  const redisClient = await redisSetup(startFresh);

  const n = await infoCollection.count();

  v2Vizzes(
    {
      infoCollection,
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
      const alreadyMigrated =
        (await databaseGateways.getInfo(info.id)).outcome === 'success';
      if (alreadyMigrated) {
	      // TODO add commits for any fresh changes
	      // for incremental migration
        console.log('skipping already migrated #' + i);
        return;
      }

      const vizV2 = await getVizV2({
        info,
        contentCollection,
        infoOpCollection,
        contentOpCollection,
      });

      await processViz({
        vizV2,
        gateways: databaseGateways,
        i,
        redisClient,
        contentCollection,
      });

      await reportProgress({ i, n });
    }
  );
};

migrate();
