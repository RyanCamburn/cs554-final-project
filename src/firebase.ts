import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import {connectFirestoreEmulator, getFirestore} from "firebase/firestore";
import { clientConfig } from "./auth-config";

const app = initializeApp(clientConfig);
const auth = getAuth(app);

if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
  connectAuthEmulator(auth, "http://localhost:9099");
}

const db = getFirestore(app);
if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
  connectFirestoreEmulator(db, "localhost", 8080);
}

export { app, auth, db };
