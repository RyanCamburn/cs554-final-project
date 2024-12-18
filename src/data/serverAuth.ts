import { adminAuth } from '@/firebase-admin';

export async function authenticateToken(
  token: string,
): Promise<{ uid: string; role?: string }> {
  const decodedToken = await adminAuth.verifyIdToken(token);
  const { uid, role } = decodedToken;
  return { uid, role };
}
