import { NextApiRequest, NextApiResponse } from 'next';
import { createUser } from '@/data/userData';
import { RedisClientType } from 'redis';
import redisClient, { deleteCacheKey } from '@/cache';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // This route is left open since users need to be able to create an account

  try {
    const id = await createUser(req.body);
    await deleteCacheKey(redisClient as RedisClientType, 'users');
    res.status(201).json({ id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
}
