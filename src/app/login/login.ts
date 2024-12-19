import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';

export async function loginUser(
  email: string,
  password: string,
): Promise<void> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await credential.user.getIdToken();
    // Call the auth endpoint created by the next-firebase-auth-edge library
    await fetch('/api/login', {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
  } catch (e) {
    throw new Error('Failed to login.');
  }
}
