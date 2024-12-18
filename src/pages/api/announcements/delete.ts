import { NextApiRequest, NextApiResponse } from 'next';
import { deleteAnnouncement } from '@/data/annoucementData';
import getUIDandRole from '@/data/serverAuth';
import { RedisClientType } from 'redis';
import redisClient, { deleteCacheKey } from '@/cache';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let role: string;

  try {
    const data = await getUIDandRole(req);
    role = data.role;
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Not authorized' });
  }

  if (role !== 'admin') {
    return res.status(403).json({
      error: 'Forbidden: You do not have permission to perform this action.',
    });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  try {
    await deleteAnnouncement(id);
    await deleteCacheKey(redisClient as RedisClientType, 'announcements');
    res.status(200).json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
}
