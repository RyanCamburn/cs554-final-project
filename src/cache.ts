import { createClient } from 'redis';

const redisClient = createClient();
redisClient.on('error', (err: Error) => console.log('Redis Client Error', err));
await redisClient.connect();

export default redisClient;
