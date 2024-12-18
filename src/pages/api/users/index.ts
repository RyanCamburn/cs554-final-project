import { NextApiRequest, NextApiResponse } from 'next';
import { getAllUsers } from '@/data/userData';
import getUIDandRole from '@/data/serverAuth';
import redisClient from '@/cache';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let uid: string;
  let role: string;

  try {
    const data = await getUIDandRole(req);
    uid = data.uid;
    role = data.role;
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Not authorized' });
  }

  // Everyone who has an account should be able to read the users for directory feature
  if (!role || !uid) {
    return res.status(403).json({
      error: 'Forbidden: You do not have permission to perform this action.',
    });
  }

  let users;
  try {
    const cachedUsers = await redisClient.get('users');
    if (cachedUsers) {
      console.log('User Cache Hit!');
      users = JSON.parse(cachedUsers);
      return res.status(200).json(users);
    }
  } catch (error) {
    console.error('Error parsing cached data:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
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
