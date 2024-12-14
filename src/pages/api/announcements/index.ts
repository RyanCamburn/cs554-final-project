import { NextApiRequest, NextApiResponse } from 'next';
import { getAllAnnouncements } from '@/data/annoucementData';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const announcements = await getAllAnnouncements();
    res.status(200).json(announcements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
}
