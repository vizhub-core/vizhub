import { createClient } from 'redis';

export const redisSetup = async (idx = 'idx:vizhub-migration-3') => {
  const client = createClient();
  await client.connect();
  // Create an index...
  try {
    // Delete everything.
    //await client.sendCommand(['FLUSHALL']);

    // Documentation: https://redis.io/docs/stack/search/reference/vectors/
    await client.sendCommand([
      'FT.CREATE',
      idx,
      'SCHEMA',
      'v',
      'VECTOR',
      'HNSW',
      '6',
      'TYPE',
      'FLOAT32',
      'DIM',
      '512',
      'DISTANCE_METRIC',
      'COSINE',
      // Track timestamps here to allow
      // hybrid KNN + timestamp range queries.
      'timestamp',
      'NUMERIC',
    ]);
  } catch (e) {
    if (e.message === 'Index already exists') {
      console.log('Index exists already, skipped creation.');
    } else {
      // Something went wrong, perhaps RediSearch isn't installed...
      console.error(e);
      process.exit(1);
    }
  }
  return client;
};
