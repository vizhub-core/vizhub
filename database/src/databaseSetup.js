// Set up the database connection for:
//  * The API server
//  * Tests
//  * Migration
//
// See:
//   https://share.github.io/sharedb/getting-started
//   https://github.com/share/sharedb-mongo
import ShareDB from 'sharedb';
import ShareDBMongo from 'sharedb-mongo';
import { MongoClient } from 'mongodb-legacy';
import json1 from 'ot-json1';

console.log(json1);
console.log(json1.type);

// VizHub uses json1, not json0, for OT.
ShareDB.types.register(json1.type);

export const databaseSetup = async ({ mongoURI }) => {
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

  clearTimeout(timeout);

  const db = ShareDBMongo({
    mongo: (callback) => {
      callback(null, mongoDBConnection);
    },
  });

  // TODO Redis PubSub
  const shareDBConnection = new ShareDB({ db }).connect();

  return { shareDBConnection, mongoDBDatabase };
};
