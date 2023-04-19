// Set up the database connection for:
//  * The API server
//  * Tests
//  * Migration
//
// See:
//   https://share.github.io/sharedb/getting-started
//   https://github.com/share/sharedb-mongo
import MongoLegacy from 'mongodb-legacy';
const { MongoClient, ServerApiVersion } = MongoLegacy;

export const initializeMongoDB = async ({
  isProd,
  env,
  mongoLocalURI = 'mongodb://localhost:27017/vizhub3',
}) => {
  let mongoClient;
  if (env.VIZHUB3_MONGO_LOCAL) {
    console.log('Connecting to local MongoDB...');
    mongoClient = new MongoClient(mongoLocalURI);
  } else if (isProd) {
    console.log('Connecting to production MongoDB...');

    const username = env.VIZHUB3_MONGO_USERNAME;
    const password = env.VIZHUB3_MONGO_PASSWORD;
    const database = env.VIZHUB3_MONGO_DATABASE;

    const uri = `mongodb+srv://${username}:${password}@vizhub3.6sag6.mongodb.net/${database}?retryWrites=true&w=majority`;
    console.log('uri:');
    console.log(uri);

    mongoClient = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    });
  }

  const mongoDBConnection = await mongoClient.connect();
  const mongoDBDatabase = mongoClient.db();
  return { mongoDBConnection, mongoDBDatabase };
};
