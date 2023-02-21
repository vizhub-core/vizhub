// This function accepts as input an array of numbers
// and returns as output a byte representation that Redis accepts.
const tobytes = (array) => Buffer.from(new Float32Array(array).buffer);

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
