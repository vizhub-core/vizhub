import { describe } from 'vitest';
import { setInitGateways, gatewaysTests } from 'gateways/test';
import { interactorsTests } from 'interactors/test';
import { DatabaseGateways, mongoDBSetup, shareDBSetup } from '../src';

describe('DatabaseGateways', async () => {
  // Make the MongoDB connection only once, for all tests,
  // as it takes some time.
  const { mongoDBDatabase, mongoDBConnection } = await mongoDBSetup({
    mongoURI: 'mongodb://localhost:27017/vizhub-testing',
  });

  // Swap out the initGateways function used by gatewaysTests
  // so that it uses an instance of DatabaseGateways
  // (not an instance of MemoryGateways, which it does by default).
  setInitGateways(async () => {
    // Drop the database each time, so each test starts fresh
    // and we don't have any interference between tests.
    await mongoDBDatabase.dropDatabase();

    // Create a new ShareDB instance for each test,
    // otherwise context leaks between them as
    // ShareDB keeps things in memory that are supposed to sync
    // with Mongo.
    const { shareDBConnection } = await shareDBSetup({ mongoDBConnection });

    const databaseGateways = DatabaseGateways({
      shareDBConnection,
      mongoDBDatabase,
    });

    return databaseGateways;
  });

  // These tests use initGateways that we define above.
  gatewaysTests();
  interactorsTests();
});
