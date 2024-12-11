import { NextApiRequest, NextApiResponse } from 'next';
import { deleteAnnouncement } from '@/data/annoucementData';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  res: NextApiResponse,
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
    return res.status(400).json({ error: 'ID is required' });
  }

  try {
    await deleteAnnouncement(id);
    res.status(200).json({ message: 'Announcement deleted successfully' });
    res.status(200).json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete announcement' });
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
}
