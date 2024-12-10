'use client';

import { createContext, useContext } from 'react';
import { UserInfo } from 'firebase/auth';
import { Claims } from 'next-firebase-auth-edge/lib/auth/claims';

export interface User extends UserInfo {
  emailVerified: boolean;
  customClaims: Claims;
}

export interface AuthContextValue {
  user: User | null;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
});

// TODO: How can we connect this to firestore to get profile information? What should be stored in the session and what should be fetched from the database?
// FIXME: user object is leaking plaintext password in emulator, is this expected behavior?

export const useAuth = () => useContext(AuthContext);
