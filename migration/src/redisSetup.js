import { createClient } from 'redis';

export const idx = 'idx:vizhub-migration-3';

// This function accepts as input an array of numbers
// and returns as output a byte representation that Redis accepts.
export const tobytes = (array) => Buffer.from(new Float32Array(array).buffer);

export const redisSetup = async (startFresh) => {
  const redisClient = createClient();
  await redisClient.connect();
  if (startFresh) {
    await redisClient.sendCommand(['FLUSHALL']);
  }

  // Create an index...
  try {
    // Documentation: https://redis.io/docs/stack/search/reference/vectors/
    await redisClient.sendCommand([
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
  return redisClient;
};
