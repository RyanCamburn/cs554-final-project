import * as admin from "firebase-admin";
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import serviceAccountJson from '@/service-account.json'

const serviceAccount = serviceAccountJson as admin.ServiceAccount;

const firebaseAdminConfig = {
    credential: cert(serviceAccount)
}

export function customInitApp() {
  if (getApps().length <= 0) {
    return initializeApp({
      credential: applicationDefault(),
    });
  } else {
    return getApps()[0];
  }
}
export const adminAuth = customInitApp();