import { filterStandardClaims } from 'next-firebase-auth-edge/lib/auth/claims';
import { Tokens } from 'next-firebase-auth-edge';
import { User } from './AuthContext';

export const getUserSession = ({ decodedToken }: Tokens): User => {
  const {
    uid,
    email,
    picture: photoURL,
    email_verified: emailVerified,
    phone_number: phoneNumber,
    name: displayName,
    source_sign_in_provider: signInProvider,
  } = decodedToken;

  // This abstracts all of the custom claims into a single object
  const customClaims = filterStandardClaims(decodedToken);

  // Return all session information
  return {
    uid,
    email: email ?? null,
    displayName: displayName ?? null,
    photoURL: photoURL ?? null,
    phoneNumber: phoneNumber ?? null,
    emailVerified: emailVerified ?? false,
    providerId: signInProvider,
    customClaims,
  };
};
