import { commandOptions, createClient } from 'redis';

import { embeddingSize } from './generateEmbeddingOpenAI';

const v3RedisURI = process.env.VIZHUB_V3_REDIS_URI;
const v3RedisPassword =
  process.env.VIZHUB_V3_REDIS_PASSWORD;

// The name of the index we'll use for our search.
export const idx = 'idx:vizhub';

export const redisSetup = async (startFresh) => {
  console.log(`  Connecting to v3 Redis`);
  console.log(`    Using v3 Redis URI "${v3RedisURI}".`);
  console.log(
    `    Check VIZHUB_V3_REDIS_URI and VIZHUB_V3_REDIS_PASSWORD.`,
  );
  console.log(`    For example, in .bashrc, add:`);
  console.log(
    `    export VIZHUB_V3_REDIS_URI=redis://redis-39227.c10.us-east-9-4.ec2.cloud.redislabs.com`,
  );
  console.log(`    export VIZHUB_V3_REDIS_PASSWORD=...`);

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
      console.log(
        'Index exists already, skipped creation.',
      );
    } else {
      // Something went wrong, perhaps RediSearch isn't installed...
      console.error(e);
      process.exit(1);
    }
  }
  return redisClient;
};

// This function accepts as input an array of numbers
// and returns as output a byte representation that Redis accepts.
export const tobytes = (array) =>
  Buffer.from(new Float32Array(array).buffer);

// The inverse of tobytes, for parsing results out of hget.
const frombytes = (buffer) => {
  const array = new Float32Array(buffer.length / 4);
  for (let i = 0; i < array.length; i++) {
    array[i] = buffer.readFloatLE(i * 4);
  }
  return array;
};

// Stores an embedding in Redis.
// See also: https://redis.io/commands/hset
export const storeEmbedding = async ({
  redisClient,
  id,
  embedding,
  timestamp,
}) => {
  await redisClient.sendCommand([
    'HSET',
    id,
    'v',
    tobytes(embedding),
    'timestamp',
    '' + timestamp,
  ]);
};

// Gets an embedding from Redis.
export const getEmbedding = async ({
  redisClient,
  id,
}): Promise<Float32Array | null> => {
  const redisResult = await redisClient.hGet(
    commandOptions({ returnBuffers: true }),
    id,
    'v',
  );
  if (redisResult === null) {
    return null;
  }
  return frombytes(redisResult);
};
