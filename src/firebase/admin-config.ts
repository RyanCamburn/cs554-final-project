import admin from "firebase-admin";

const config = {
  credential: admin.credential.cert({
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    clientEmail: process.env.NEXT_PUBLIC_CLIENT_EMAIL,
    privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY 
    ? process.env.NEXT_PUBLIC_PRIVATE_KEY.replace(/\\n/gm, "\n")
    : undefined,
  }),
};

export const firebase = admin.apps.length ? admin.app() : admin.initializeApp(config);