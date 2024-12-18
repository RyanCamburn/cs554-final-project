import { NextApiRequest, NextApiResponse } from 'next';
import { createAnnouncement } from '@/data/annoucementData';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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
    res.status(201).json({ id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create announcement' });
  }
}
