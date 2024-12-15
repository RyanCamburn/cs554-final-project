import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './globals.css';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { User } from './sessions/AuthContext';
import { AuthProvider } from './sessions/AuthProvider';
import { filterStandardClaims } from 'next-firebase-auth-edge/lib/auth/claims';
import { Tokens, getTokens } from 'next-firebase-auth-edge';
import { cookies } from 'next/headers';
import { serverConfig } from '../auth-config';

const getUserSession = ({ decodedToken }: Tokens): User => {
  const {
    uid,
    email,
    picture: photoURL,
    email_verified: emailVerified,
    phone_number: phoneNumber,
    name: displayName,
    source_sign_in_provider: signInProvider, // FIXME: this exposes the password in the emulator
  } = decodedToken;

  // This abstracts all of the custom claims into a single object
  const customClaims = filterStandardClaims(decodedToken);

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
import ProtectedLayout from '@/components/ProtectedLayout';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Mentor Match',
  description: 'Find your perfect mentor match',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This will be passed into the AuthProvider to allow session management
  // TODO: Claims should be put into the session as well to manage page access with middleware, the tokens themselves will be used to authenticate with the server
  const tokens = await getTokens(await cookies(), {
    apiKey: process.env.NEXT_PUBLIC_API_KEY!,
    ...serverConfig,
  });
  const user = tokens ? getUserSession(tokens) : null;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider user={user}>
          <MantineProvider>
            <Notifications />
            <ProtectedLayout>{children}</ProtectedLayout>
          </MantineProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
