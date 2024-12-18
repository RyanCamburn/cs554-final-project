import { NextApiRequest, NextApiResponse } from 'next';
import { getAllUsers } from '@/data/userData';
import redisClient from '@/cache';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const cachedUsers = await redisClient.get('users');
  if (cachedUsers) {
    console.log('User Cache Hit!');
    return res.status(200).json(JSON.parse(cachedUsers));
  }

  try {
    const users = await getAllUsers();
    await redisClient.set('users', JSON.stringify(users), { EX: 3600 });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}
