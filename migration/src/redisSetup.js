import { createClient } from 'redis';
import { embeddingSize } from './generateEmbeddingOpenAI';

const v3RedisURI = process.env.VIZHUB_V3_REDIS_URI;
const v3RedisPassword = process.env.VIZHUB_V3_REDIS_PASSWORD;

// The name of the index we'll use for our search.
export const idx = 'idx:vizhub';

// This function accepts as input an array of numbers
// and returns as output a byte representation that Redis accepts.
export const tobytes = (array) => Buffer.from(new Float32Array(array).buffer);

export const redisSetup = async (startFresh) => {
  console.log(`Connecting to v3 Redis`);
  console.log(`  Using v3 Redis URI "${v3RedisURI}".`);

  const redisClient = createClient({
    password: v3RedisPassword,
    socket: {
      host: v3RedisURI,
      port: 15027,
    },
  });

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
      '' + embeddingSize,
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
