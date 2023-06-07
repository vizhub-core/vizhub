import { initializeMongoDB } from './initializeMongoDB';
import { initializeShareDB } from './initializeShareDB';
import { DatabaseGateways } from './DatabaseGateways';

export const initializeGateways = async ({ isProd, env }) => {
  const { mongoDBConnection, mongoDBDatabase } = await initializeMongoDB({
    isProd,
    env,
  });

  const { shareDBBackend, shareDBConnection } = await initializeShareDB({
    mongoDBConnection,
  });

  const gateways = DatabaseGateways({ shareDBConnection, mongoDBDatabase });
  return { gateways, shareDBBackend };
};
