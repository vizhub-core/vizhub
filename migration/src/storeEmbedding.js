import { tobytes } from './redisSetup';

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
