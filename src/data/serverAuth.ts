import { NextApiRequest } from 'next';
import { getApiRequestTokens } from 'next-firebase-auth-edge';
import { serverConfig, clientConfig } from '@/auth-config';

// This function should be used in each API route that requires authentication

export default async function getUIDandRole(req: NextApiRequest) {
  // This is a helper function that retrieves the user's UID and role from a JWT Cookie
  const tokens = await getApiRequestTokens(req, {
    ...serverConfig,
    apiKey: clientConfig.apiKey,
  });

  if (!tokens) {
    throw new Error('Not authorized');
  }
  const { decodedToken } = tokens;

  if (!decodedToken) {
    throw new Error('Not authorized');
  }

  if (!decodedToken.uid || !decodedToken.role) {
    throw new Error('Not authorized');
  }

  const uid: string = decodedToken.uid;
  const role: string = decodedToken.role as string; // 'role' is a Firebase custom claim
  return { uid, role };
}
