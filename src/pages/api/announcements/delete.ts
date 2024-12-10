import { NextApiRequest, NextApiResponse } from 'next';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  try {
    const docRef = doc(db, 'announcements', id);
    await deleteDoc(docRef);
    res.status(200).json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
}
