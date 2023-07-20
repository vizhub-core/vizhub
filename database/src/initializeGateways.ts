import { initializeMongoDB } from './initializeMongoDB';
import { initializeShareDB } from './initializeShareDB';
import { DatabaseGateways } from './DatabaseGateways';
import { Gateways } from 'gateways';

export const initializeGateways = async ({ isProd, env }) => {
  const { mongoDBConnection, mongoDBDatabase } = await initializeMongoDB({
    isProd,
    env,
  });

  const { shareDBBackend, shareDBConnection } = await initializeShareDB({
    mongoDBConnection,
  });

  // For ease of development, the DatabaseGateways are implemented in JavaScript.
  // @ts-ignore
  const gateways: Gateways = DatabaseGateways({
    shareDBConnection,
    mongoDBDatabase,
  }) as Gateways;

  return { gateways, shareDBBackend, mongoDBDatabase, mongoDBConnection };
};
