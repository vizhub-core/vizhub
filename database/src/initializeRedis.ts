import redis from 'redis';
export const initializeRedis = async () => {
  const redisClient = redis.createClient({
    // url:
    //   process.env.VIZHUB3_REDIS_URL ||
    //   'redis://localhost:6379',

    // This makes it work with ShareDB
    // See https://github.com/share/sharedb-redis-pubsub/issues/19
    legacyMode: true,
  });

  await redisClient.connect();

  redisClient.on('error', (err) => {
    console.error('Redis error:', err);
  });

  // Validate the connection
  await new Promise((resolve, reject) => {
    redisClient.ping((err, result) => {
      if (err) {
        reject(err);
      } else {
        console.log('Redis ping result:', result);
        resolve(result);
      }
    });
  });

  return {
    redisClient,
  };
};
