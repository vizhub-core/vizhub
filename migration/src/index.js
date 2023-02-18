import { mongoDBSetup } from './mongoDBSetup';
import { v2Vizzes } from './v2Vizzes';

const migrate = async () => {
  const { v2MongoDBDatabase, v3MongoDBDatabase, databaseGateways } =
    await mongoDBSetup();

  v2Vizzes(v2MongoDBDatabase, async (vizV2) => {
    const { info, content, ops } = vizV2;
    const { id } = info;
    // Sometimes titles have leading or trailing spaces.
    const title = info.title.trim();

    console.log('Processing viz ' + id + ' ' + title);
  });
};
migrate();
