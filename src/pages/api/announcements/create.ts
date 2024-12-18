import { NextApiRequest, NextApiResponse } from 'next';
import { createAnnouncement } from '@/data/annoucementData';
import getUIDandRole from '@/data/serverAuth';
import { RedisClientType } from 'redis';
import redisClient, { deleteCacheKey } from '@/cache';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
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

  try {
    let { type, message, scheduleDate, expirationDate, active } = req.body;
    scheduleDate = new Date(scheduleDate);
    expirationDate = new Date(expirationDate);
    const id = await createAnnouncement({
      type,
      message,
      scheduleDate,
      expirationDate,
      active,
    });
    await deleteCacheKey(redisClient as RedisClientType, 'announcements');
    res.status(201).json({ id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create announcement' });
  }
}
