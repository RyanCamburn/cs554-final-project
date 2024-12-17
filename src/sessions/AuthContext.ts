'use client';

import { createContext, useContext } from 'react';
import { UserInfo } from 'firebase/auth';
import { Claims } from 'next-firebase-auth-edge/lib/auth/claims';

export interface User extends UserInfo {
  token: string;
  emailVerified: boolean;
  customClaims: Claims;
}

export interface AuthContextValue {
  user: User | null;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
});

export const useAuth = () => useContext(AuthContext);

/** Example Usage in a component:
 * 'use client'; // IMPORTANT useAuth() can only be called in client components
 *
 * import { useAuth } from '@/sessions/AuthContext';
 * function Example() {
 *  const { user } = useAuth();
 *  const role = user?.customClaims.role;
 *  return <div>{role}</div>;
 * }
 */
