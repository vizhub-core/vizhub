import ShareDB from 'sharedb';
import ShareDBMongo from 'sharedb-mongo';

// We need to use mongodb-legacy because
// ShareDB uses the callback-based API.
// See https://github.com/mongodb/node-mongodb-native/blob/HEAD/etc/notes/CHANGES_5.0.0.md#optional-callback-support-migrated-to-mongodb-legacy
import mongodb from 'mongodb-legacy';
import * as json1 from 'ot-json1';
import { describe, it, expect } from 'vitest';
import { setInitGateways, gatewaysTests } from 'gateways/test';
import { DatabaseGateways } from '../src';

// VizHub uses json1, not json0, for OT.
ShareDB.types.register(json1.type);

// The URI for our MongoDB connection.
// See:
//   https://share.github.io/sharedb/getting-started
//   https://github.com/share/sharedb-mongo
const mongoURIDefault = 'mongodb://localhost:27017/vizhub-testing';
const mongoURI = mongoURIDefault;
//const mongoURI = import.meta.env.VIZHUB_MONGO_URI || mongoURIDefault;

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

const mongoClient = new mongodb.MongoClient(mongoURI, {
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

describe('DatabaseGateways', () => {
  // Swap out the initGateways function used by gatewaysTests
  // so that it uses an instance of DatabaseGateways
  // (not an instance of MemoryGateways, which it does by default).
  setInitGateways(async () => {
    // Drop the database each time, so each test starts fresh
    // and we don't have any interference between tests.
    await mongoDBDatabase.dropDatabase();

    const databaseGateways = DatabaseGateways({
      shareDBConnection: new ShareDB({ db }).connect(),
      mongoDBDatabase,
    });

    return databaseGateways;
  });

  gatewaysTests();
});
