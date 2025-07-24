// Set up the database connection for:
//  * The API server
//  * Tests
//  * Migration
//
// See:
//   https://share.github.io/sharedb/getting-started
//   https://github.com/share/sharedb-mongo

export const initializeMongoDB = async ({
  isProd,
  env,
  mongoLocalURI = 'mongodb://localhost:27017/vizhub3',
}) => {
  const { MongoClient, ServerApiVersion } = await import(
    'mongodb-legacy'
  );

  const timeout = setTimeout(() => {
    console.log(
      '\nHaving trouble connecting to the MongoDB database...',
    );
    console.log(
      '  Ensure that the database is running. Try:',
    );
    console.log('  sudo systemctl start mongod');
  }, 5000);

  let mongoClient;
  if (env.VIZHUB3_MONGO_LOCAL === 'true') {
    console.log('Connecting to local MongoDB...');
    mongoClient = new MongoClient(mongoLocalURI);
  } else {
    console.log('  Connecting to production MongoDB...');

    const username = env.VIZHUB3_MONGO_USERNAME;
    const password = env.VIZHUB3_MONGO_PASSWORD;
    const database = env.VIZHUB3_MONGO_DATABASE;
    const domain = env.VIZHUB3_MONGO_DOMAIN;

    // Validate environment variables.
    if (!username || !password || !database || !domain) {
      console.log(
        'Check your VizHub environment variables.',
      );
      console.log(
        'Either set VIZHUB3_MONGO_LOCAL=true for local development, or',
      );
      console.log(
        'Set VIZHUB3_MONGO_USERNAME,VIZHUB3_MONGO_PASSWORD, and VIZHUB3_MONGO_DATABASE for production deployment.',
      );
      console.log('Current values:');
      console.log(
        'VIZHUB3_MONGO_LOCAL:',
        env.VIZHUB3_MONGO_LOCAL,
      );
      console.log(
        'VIZHUB3_MONGO_USERNAME:',
        env.VIZHUB3_MONGO_USERNAME,
      );
      console.log(
        'VIZHUB3_MONGO_PASSWORD:',
        env.VIZHUB3_MONGO_PASSWORD,
      );
      console.log(
        'VIZHUB3_MONGO_DATABASE:',
        env.VIZHUB3_MONGO_DATABASE,
      );
      console.log(
        'VIZHUB3_MONGO_DOMAIN:',
        env.VIZHUB3_MONGO_DOMAIN,
      );
      process.exit(1);
    }

    const uri = `mongodb+srv://${username}:${password}@${domain}/${database}?retryWrites=true&w=majority`;
    // console.log('uri:');
    // console.log(uri);

    mongoClient = new MongoClient(uri, {
      useNewUrlParser: true,
      serverApi: ServerApiVersion.v1,
    });
  }

  const mongoDBConnection = await mongoClient.connect();
  const mongoDBDatabase = mongoClient.db();

  await mongoDBDatabase.command({ ping: 1 });
  clearTimeout(timeout);

  return { mongoDBConnection, mongoDBDatabase };
};
