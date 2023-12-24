import { describe, afterAll, it, beforeAll } from 'vitest';
import {
  setInitGateways,
  gatewaysTests,
} from 'gateways/test';
import { interactorsTests } from 'interactors/test';
import { DatabaseGateways } from '../src';
import { initializeMongoDB } from '../src/initializeMongoDB';
import { initializeShareDB } from '../src/initializeShareDB';
import { initializeSupabase } from '../src/initializeSupabase';

describe('DatabaseGateways', async () => {
  // Make the MongoDB connection only once, for all tests,
  // as it takes some time.
  const { mongoDBDatabase, mongoDBConnection } =
    await initializeMongoDB({
      env: { VIZHUB3_MONGO_LOCAL: 'true' },
      mongoLocalURI:
        'mongodb://localhost:27017/vizhub-testing',
    });

  beforeAll(() => {
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
      const { shareDBConnection } = await initializeShareDB(
        {
          mongoDBConnection,
        },
      );

      const supabase = initializeSupabase();

      const databaseGateways = DatabaseGateways({
        shareDBConnection,
        mongoDBDatabase,
        supabase,
      });

      return databaseGateways;
    });
  });

  // These tests use initGateways that we define above.
  gatewaysTests();
  interactorsTests();

  // Clean up the database after all tests are done.
  afterAll(async () => {
    await mongoDBDatabase.dropDatabase();
    await mongoDBConnection.close();
  });
});
