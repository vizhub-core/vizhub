import { mongoDBSetup } from './mongoDBSetup';
import { redisSetup } from './redisSetup';
import { v2Vizzes } from './v2Vizzes';
import { getVizV2 } from './getVizV2';
import { processViz } from './processViz';
import { reportProgress } from './reportProgress';

const migrate = async () => {
  const { v2MongoDBDatabase, v3MongoDBDatabase, databaseGateways } =
    await mongoDBSetup();

  // V2 collections
  const infoCollection = v2MongoDBDatabase.collection('documentInfo');
  const contentCollection = v2MongoDBDatabase.collection('documentContent');
  const infoOpCollection = v2MongoDBDatabase.collection('o_documentInfo');
  const contentOpCollection = v2MongoDBDatabase.collection('o_documentContent');

  const redisClient = await redisSetup();

  const n = await infoCollection.count();

  v2Vizzes(
    {
      infoCollection,
    },
    async (info, i) => {
      // #1432 is the first the needs forkedFrom computed.
      if (i < 1432) {
        console.log('skipping ' + i);
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
        databaseGateways,
        i,
        redisClient,
        contentCollection,
      });

      reportProgress({ i, n });
    }
  );
};

migrate();
