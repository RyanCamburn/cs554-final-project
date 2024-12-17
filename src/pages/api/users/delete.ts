import { NextApiRequest, NextApiResponse } from 'next';
import { deleteUser } from '@/data/userData';
import { adminAuth } from '@/firebase-admin';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Extract the token from the Authorization header: "Bearer <token>"
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  // Verify the token and extract uid and role
  let uid: string;
  let role: string | undefined; // Assuming 'role' is a custom claim

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    uid = decodedToken.uid;
    role = decodedToken.role;
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  // Authorization: Check if the requester is deleting their own account or is an admin
  if (uid !== id && role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: You do not have permission to perform this action.' });
  }

  try {
    await deleteUser(id);
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete user' });
  }
}
