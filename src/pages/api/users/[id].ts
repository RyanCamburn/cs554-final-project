import { NextApiRequest, NextApiResponse } from 'next';
import { getUserById } from '@/data/userData';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const user = await getUserById(id as string);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Failed to get user by id:', error);
    res.status(500).json({ error: 'Failed to get user by id' });
  }
}
