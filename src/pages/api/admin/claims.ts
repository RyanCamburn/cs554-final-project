import { NextApiRequest, NextApiResponse } from 'next';
import { updateUser } from '@/data/userData';
import { adminAuth } from '@/firebase-admin';
import getUIDandRole from '@/data/serverAuth';

/**
 * This endpoint uses the Firebase Admin SDK to set custom claims for a user.
 * Every mentor and mentee should be able to modify their own profile in the users collection
 * Mentors and Mentees should not be able to Create, Edit, or Delete announcments or events
 * Admin should have permission to do all data functions
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { uid, claims } = req.body;
  if (!uid || typeof uid !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing "uid".' });
  }

  if (!claims || typeof claims !== 'object') {
    return res.status(400).json({ error: 'Invalid or missing "claims".' });
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
    await adminAuth.setCustomUserClaims(uid, claims);
    await updateUser(uid, { role: claims.role });
    return res.status(201).json({ message: 'User Claims Set Successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to set claims' });
  }
}
