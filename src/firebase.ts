import { initializeApp, getApps, getApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { clientConfig } from "./auth-config";

let app;
let auth;
let db;

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

export { app, auth, db };
