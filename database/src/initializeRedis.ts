import redis from 'redis';

export const redisURL =
  process.env.VIZHUB3_REDIS_URL || 'redis://localhost:6379';

export const initializeRedis = async ({
  legacyMode = false,
}) => {
  console.log(
    '  Connecting to Redis for ShareDB pub sub...',
  );
  const redisClient = redis.createClient({
    url: redisURL,

    // This makes it work with ShareDB
    // See https://github.com/share/sharedb-redis-pubsub/issues/19
    legacyMode,
  });

  await redisClient.connect();

  redisClient.on('error', (err) => {
    console.error('    Redis error:', err);
  });

  // Validate the connection
  if (legacyMode) {
    await new Promise((resolve, reject) => {
      // @ts-ignore
      redisClient.ping((err, result) => {
        if (err) {
          reject(err);
        } else {
          console.log('    Redis ping result:', result);
          if (result !== 'PONG') {
            reject(
              new Error('Redis ping result was not PONG'),
            );
          }
          resolve(result);
        }
      });
    });
  } else {
    // TODO use the new promise-based API
  }

  // Patch the client to support `evalsha`
  // see https://github.com/mike-marcacci/node-redlock/issues/286

  if (!(redisClient as any).evalsha) {
    (redisClient as any).evalsha =
      redisClient.evalSha.bind(redisClient);
  }

  return redisClient;
};
