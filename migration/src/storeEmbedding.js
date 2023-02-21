import { tobytes } from './redisSetup';

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
