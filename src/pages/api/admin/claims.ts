import { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth } from '@/firebase-admin';

/**
 * // FIXME: This endpoint needs to be secured, a request should contain a token with a valid admin claim
 * // FIXME: If authenticated/authorized, the admin can elevate claims for a sepcific user
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

  try {
    await adminAuth.setCustomUserClaims(req.body.uid, req.body.claims);
    return res.status(201).json({ message: 'User Claims Set Successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
}
