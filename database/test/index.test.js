import { describe, it, expect } from 'vitest';
import { setInitGateways, gatewaysTests } from 'gateways/test';
import { interactorsTests } from 'interactors/test';
import { DatabaseGateways, databaseSetup } from '../src';

describe('DatabaseGateways', () => {
  // Swap out the initGateways function used by gatewaysTests
  // so that it uses an instance of DatabaseGateways
  // (not an instance of MemoryGateways, which it does by default).
  setInitGateways(async () => {
    const { shareDBConnection, mongoDBDatabase } = await databaseSetup({
      mongoURI: 'mongodb://localhost:27017/vizhub-testing',
    });

    // Drop the database each time, so each test starts fresh
    // and we don't have any interference between tests.
    await mongoDBDatabase.dropDatabase();

    const databaseGateways = DatabaseGateways({
      shareDBConnection,
      mongoDBDatabase,
    });

    return databaseGateways;
  });

  gatewaysTests();
  interactorsTests();
});
