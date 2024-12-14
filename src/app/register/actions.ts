'user server';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';

// TODO: can permissions and role be an ENUM?
interface User {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  permissions: string;
  role: string;
  password: string;
}

export async function createUser(user: User): Promise<void> {
  try {
    const { firstName, lastName, email, gender, permissions, role, password } =
      user;
    // 1. Create a user in firebase auth
    await createUserWithEmailAndPassword(auth, email, password);
    // 2. Create a user document in firestore with the same uid
  } catch (e) {
    throw new Error((e as Error).message); // Pass error message to client caller
  }
}

// async function handleRegistration(values: RegisterFormValues) {
//   setError('');
//   try {
//     const { email, password } = values;
//     await createUserWithEmailAndPassword(auth, email, password);
//     router.push('/login');
//   } catch (e) {
//     setError((e as Error).message);
//   }
// }

// Here is the approach for creating a user:
// 1. Create a user in firebase auth
// 2. Set custom claims
// 3. Create a user document in firestore with the same uid
// FIXME: What if one of these operations fail? How can we rollback the changes?
// Potential Fix: https://www.reddit.com/r/Firebase/comments/1173v5g/how_to_create_user_with_firebase_auth_and_a/?rdt=46639
