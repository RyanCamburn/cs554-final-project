import Redis from 'ioredis'; // https://github.com/redis/ioredis

// Default connects to localhost:6379
export const redis = new Redis();