import { NextApiRequest, NextApiResponse } from 'next';
import { deleteUser } from '@/data/userData';
import getUIDandRole from '@/data/serverAuth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'DELETE') {
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

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  // Authorization: Check if the requester is deleting their own account or is an admin
  if (uid !== id && role !== 'admin') {
    return res.status(403).json({
      error: 'Forbidden: You do not have permission to perform this action.',
    });
  }

  try {
    await deleteUser(id);
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete user' });
  }
}
