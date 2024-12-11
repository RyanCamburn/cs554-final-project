import { NextApiRequest, NextApiResponse } from 'next';
import { updateAnnouncement } from '@/data/annoucementData';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, ...updatedFields } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  try {
    await updateAnnouncement(id, updatedFields);
    res.status(200).json({ message: 'Announcement updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update announcement' });
  }
}
