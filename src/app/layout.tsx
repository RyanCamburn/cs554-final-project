import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './globals.css';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { AuthProvider } from '@/sessions/AuthProvider';
import { getUserSession } from '@/sessions/getUserSession';
import { getTokens } from 'next-firebase-auth-edge';
import { cookies } from 'next/headers';
import { serverConfig } from '@/auth-config';
import ProtectedLayout from '@/components/ProtectedLayout';

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
  const tokens = await getTokens(await cookies(), {
    apiKey: process.env.NEXT_PUBLIC_API_KEY!,
    ...serverConfig,
  });

  // Create user session based on the tokens and pass into the Context API
  const user = tokens ? getUserSession(tokens) : null;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
        <meta
          name="description"
          content={metadata.description || 'Find your perfect mentor match'}
        />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👥</text></svg>"
        />
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
