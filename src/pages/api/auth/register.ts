import { NextApiRequest, NextApiResponse } from 'next';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { createUserWithUid } from '@/data/userData';
import { adminAuth } from '@/firebase-admin';
import { auth } from '@/firebase';

export interface UserRegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  role: string;
  password: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { firstName, lastName, email, gender, role, password } =
      req.body as UserRegisterFormValues;
    // Create a user in firebase auth
    const authUserObject = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    // Create a user document in firestore with the same uid
    const uid = authUserObject.user.uid;
    await createUserWithUid({ firstName, lastName, email, gender, role }, uid);

    // Set custom claims - admin accounts should be created in the Firebase console or by another admin, not set in registration
    if (
      role.toLocaleLowerCase() !== 'mentor' &&
      role.toLocaleLowerCase() !== 'mentee'
    ) {
      // Prevent registering users from creating admin accounts
      return res.status(400).json({ error: 'Invalid role' });
    } else {
      await adminAuth.setCustomUserClaims(uid, { role });
    }
    return res.status(201).json({ message: 'User created successfully' });
  } catch (e) {
    // TODO: unwind changes
    return res.status(500).json({ error: (e as Error).message });
  }
}
