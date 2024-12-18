import { NextApiRequest, NextApiResponse } from 'next';
import { getAllAnnouncements } from '@/data/annoucementData';
import getUIDandRole from '@/data/serverAuth';

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

  // Everyone who has an
  if (!role || !uid) {
    return res.status(403).json({ error: 'Forbidden: You do not have permission to perform this action.' });
  }

  try {
    const announcements = await getAllAnnouncements();
    res.status(200).json(announcements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
}
