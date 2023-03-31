// Set up the database connection for:
//  * The API server
//  * Tests
//  * Migration
//
// See:
//   https://share.github.io/sharedb/getting-started
//   https://github.com/share/sharedb-mongo
import MongoLegacy from 'mongodb-legacy';
const { MongoClient } = MongoLegacy;

export const mongoDBSetup = async ({ mongoURI }) => {
  setTimeout(() => {
    console.log('\nHaving trouble connecting to the database...');
    console.log('  Ensure that the database is running.');
    console.log(`  Using Mongo URI "${mongoURI}".`);
  }, 4000);

  const mongoClient = new MongoClient(mongoURI, {
    useUnifiedTopology: true,
  });
  const mongoDBConnection = await mongoClient.connect();
  const mongoDBDatabase = await mongoDBConnection.db();

  return { mongoDBConnection, mongoDBDatabase };
};
