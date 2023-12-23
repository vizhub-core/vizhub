import Client from 'ioredis';
import Redlock from 'redlock';
import { redisURL } from './initializeRedis';

export const initializeRedlock = async () => {
  const ioRedisClient = new Client(redisURL);

  console.log(
    '  Connecting to Redis for redlock via ioredis...',
  );

  // Perform a ping check to ensure Redis connection is active
  try {
    const pingResponse = await ioRedisClient.ping();
    console.log('    Redis ping response:', pingResponse); // Should log "PONG" if successful
  } catch (error) {
    console.error('    Failed to ping Redis:', error);
    throw error; // Optionally re-throw the error to handle it outside this function
  }

  // See https://github.com/mike-marcacci/node-redlock?tab=readme-ov-file#configuration
  const redlock = new Redlock([ioRedisClient], {
    // The expected clock drift; for more details see:
    // http://redis.io/topics/distlock
    driftFactor: 0.01, // multiplied by lock ttl to determine drift time

    // The max number of times Redlock will attempt to lock a resource
    // before erroring.
    retryCount: 10,

    // the time in ms between attempts
    retryDelay: 200, // time in ms

    // the max time in ms randomly added to retries
    // to improve performance under high contention
    // see https://www.awsarchitectureblog.com/2015/03/backoff.html
    retryJitter: 200, // time in ms

    // The minimum remaining time on a lock before an extension is automatically
    // attempted with the `using` API.
    automaticExtensionThreshold: 500, // time in ms
  });

  return redlock;
};
