// Set up the database connection for:
//  * The API server
//  * Tests
//  * Migration
//
// See:
//   https://share.github.io/sharedb/getting-started
//   https://github.com/share/sharedb-mongo
import { MongoClient } from 'mongodb-legacy';

export const mongoDBSetup = async ({ mongoURI }) => {
  const timeout = setTimeout(() => {
    console.log('\nHaving trouble connecting to the database...');
    console.log('  Ensure that the database is running.');
    //console.log(
    //  `  VIZHUB_MONGO_URI environment variable is "${env('VIZHUB_MONGO_URI')}"`
    //);
    console.log(`  Using Mongo URI "${mongoURI}".`);
    console.log('  See README for setup details.');
    console.log('  In dev on Linux, start MongoDB with:\n');
    console.log('    sudo service mongod start\n');
  }, 4000);

  const mongoClient = new MongoClient(mongoURI, {
    useUnifiedTopology: true,
  });
  const mongoDBConnection = await mongoClient.connect();
  const mongoDBDatabase = await mongoDBConnection.db();

  return { mongoDBConnection, mongoDBDatabase };
};
