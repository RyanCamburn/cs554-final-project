import type { RedisClientType } from 'redis';
import { createClient } from 'redis';

const redisClient = createClient();
redisClient.on('error', (err: Error) => console.log('Redis Client Error', err));
await redisClient.connect();

export const deleteCacheKey = async (
  redisClient: RedisClientType,
  key: string,
) => {
  await redisClient.del(key);
};

export default redisClient;
