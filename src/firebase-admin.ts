import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { serverConfig } from './auth-config';

const adminApp =
  getApps().length > 0
    ? getApp()
    : process.env.NEXT_PUBLIC_NODE_ENV === 'development'
      ? initializeApp({
          projectId: serverConfig.serviceAccount.projectId,
        })
      : initializeApp({
          credential: cert({
            projectId: serverConfig.serviceAccount.projectId,
            clientEmail: serverConfig.serviceAccount.clientEmail,
            privateKey: serverConfig.serviceAccount.privateKey,
          }),
        });

export const adminAuth = getAuth(adminApp);
export const adminDB = getFirestore(adminApp);
