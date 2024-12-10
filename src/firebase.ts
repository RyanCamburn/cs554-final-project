import { initializeApp, getApps, getApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import {connectFirestoreEmulator, getFirestore} from "firebase/firestore";
import { clientConfig } from "./auth-config";
import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// This style prevents the firestore services from being initialized mutliple times with the emulators
if (!getApps().length) {
  app = initializeApp(clientConfig);
  auth = getAuth(app);
  db = getFirestore(app);

  if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
    connectAuthEmulator(auth, "http://localhost:9099");
    connectFirestoreEmulator(db, "localhost", 8080);
  }
} else {
  app = getApp();
  auth = getAuth(app);
  db = getFirestore(app);
}

const db = getFirestore(app);
if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
  connectFirestoreEmulator(db, "localhost", 8080);
}

export { app, auth, db };
