import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { clientConfig } from './auth-config';

const app = initializeApp(clientConfig);
const auth = getAuth(app);

if (process.env.NEXT_PUBLIC_NODE_ENV === 'development') {
  connectAuthEmulator(auth, 'http://localhost:9099');
}

export { app, auth };
