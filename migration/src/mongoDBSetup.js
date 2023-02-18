import ShareDB from 'sharedb';
import ShareDBMongo from 'sharedb-mongo';
import { MongoClient } from 'mongodb-legacy';
import { DatabaseGateways } from 'database';

ShareDB.types.register(json1.type);

// TODO consider unifying this logic between
// database tests and this file.
// We'll also need it for the API server.
export const mongoDBSetup = async () => {
  const v2MongoURI = import.meta.env.VIZHUB_MONGO_URI;
  const v3MongoURI = import.meta.env.VIZHUB3_MONGO_URI;

  const timeout = setTimeout(() => {
    console.log('\nHaving trouble connecting to the database...');
    console.log('  Ensure that the database is running.');
    console.log(`  Using v2 Mongo URI "${v2MongoURI}".`);
    console.log(`  Using v3 Mongo URI "${v3MongoURI}".`);
  }, 4000);

  const v2MongoClient = new MongoClient(v2MongoURI);
  const v2MongoDBConnection = await v2MongoClient.connect();
  const v2MongoDBDatabase = await v2MongoDBConnection.db();

  const v3MongoClient = new MongoClient(v3MongoURI);
  const v3MongoDBConnection = await v3MongoClient.connect();
  const v3MongoDBDatabase = await v3MongoDBConnection.db();

  const databaseGateways = DatabaseGateways({
    shareDBConnection: new ShareDB({
      db: ShareDBMongo({
        mongo: (callback) => {
          callback(null, mongoDBConnection);
        },
      }),
    }).connect(),
    mongoDBDatabase,
  });

  clearTimeout(timeout);

  await v2MongoDBDatabase.command({ ping: 1 });
  await v3MongoDBDatabase.command({ ping: 1 });

  console.log('Connected successfully to MongoDB!');
  return { v2MongoDBDatabase, v3MongoDBDatabase, databaseGateways };
};
