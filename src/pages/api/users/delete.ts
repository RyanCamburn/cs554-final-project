import { NextApiRequest, NextApiResponse } from 'next';
import { getApiRequestTokens } from 'next-firebase-auth-edge';
import { deleteUser } from '@/data/userData';
import { serverConfig, clientConfig } from '@/auth-config';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const tokens = await getApiRequestTokens(req, {
    ...serverConfig,
    apiKey: clientConfig.apiKey,
  });

  if (!tokens) {
    return res.status(401).json({ error: 'Not authorized' });
  }

  const { decodedToken } = tokens;

  // Verify the token and extract uid and role
  let uid: string;
  let role: string; // Assuming 'role' is a custom claim

  try {
    uid = decodedToken.uid;
    role = decodedToken.role as string;
  } catch (error) {
    return res.status(401).json({ error: error });
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
