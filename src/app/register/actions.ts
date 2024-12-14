'user server';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { createUserWithUid } from '@/data/userData';
import { auth } from '@/firebase';

// TODO: can role be an ENUM?
interface UserRegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  role: string;
  password: string;
}

// This function is called intakeUser to avoid conflict with the createUser data function
// This is because this server action is responsible for multiple things:
// 1. Create a user in firebase auth
// 2. Create a user document in firestore with the same uid
// 3. Set custom claims
// FIXME: What if one of these operations fail? How can we rollback the changes?
// Transactions were also recommended to handle rollbacks: https://firebase.google.com/docs/firestore/manage-data/transactions
// Potential Fix: https://www.reddit.com/r/Firebase/comments/1173v5g/how_to_create_user_with_firebase_auth_and_a/?rdt=46639
export async function intakeUser(user: UserRegisterFormValues): Promise<void> {
  try {
    const { firstName, lastName, email, gender, role, password } = user;
    // 1. Create a user in firebase auth
    const authUserObject = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    // 2. Create a user document in firestore with the same uid
    const uid = authUserObject.user.uid;
    const docRef = await createUserWithUid(
      { firstName, lastName, email, gender, role },
      uid,
    );
    // 3. Set custom claims - this might be OD
    // FIXME: We can just set one admin account in the .env
    // Set admin emails in the .env file or in firebase console
    // TODO: Move claims to a separate API endpoint
    const claimsRef = await fetch('/api/admin/claims', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid,
        claims: { role },
      }),
    });
  } catch (e) {
    throw new Error((e as Error).message); // Pass error message to client caller
  }
}

// TODO: Make a custom hook to handle authorization of using different server actions
