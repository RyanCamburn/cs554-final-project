export const serverConfig = {
  cookieName: process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME!,
  cookieSignatureKeys: [
    process.env.NEXT_PUBLIC_AUTH_COOKIE_SIGNATURE_KEY_CURRENT!,
    process.env.NEXT_PUBLIC_AUTH_COOKIE_SIGNATURE_KEY_PREVIOUS!,
  ],
  cookieSerializeOptions: {
    path: "/",
    httpOnly: true,
    secure: process.env.NEXT_PUBLIC_USE_SECURE_COOKIES === "true",
    sameSite: "lax" as const,
    maxAge: 12 * 60 * 60 * 24,
  },
  serviceAccount: {
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
    clientEmail: process.env.NEXT_PUBLIC_CLIENT_EMAIL!,
    privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY?.replace(/\\n/g, "\n")!,
  },
};

export const clientConfig = {
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  apiKey: process.env.NEXT_PUBLIC_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  // databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
};

export const emulatorConfig = {
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  apiKey: process.env.NEXT_PUBLIC_API_KEY!, // FIXME: Emulators says not to use production credentials
};
