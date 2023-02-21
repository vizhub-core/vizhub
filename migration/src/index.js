import { mongoDBSetup } from './mongoDBSetup';
import { redisSetup } from './redisSetup';
import { v2Vizzes } from './v2Vizzes';
import { vizCount } from './vizCount';
import { processViz } from './processViz';
import { reportProgress } from './reportProgress';

const migrate = async () => {
  const { v2MongoDBDatabase, v3MongoDBDatabase, databaseGateways } =
    await mongoDBSetup();

  const redisClient = await redisSetup();

  const n = await vizCount(v2MongoDBDatabase);

  v2Vizzes(v2MongoDBDatabase, async (vizV2, i) => {
    processViz({ vizV2, databaseGateways, i, redisClient });
    reportProgress({ i, n });
  });
};

migrate();
