import { getAuth } from 'firebase-admin/auth';
import { initializeApp, cert } from 'firebase-admin/app';
import { serialize } from 'cookie';

// FIXME: [webpack.cache.PackFileCacheStrategy] Serializing big strings (441kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)

// Initialize Firebase Admin SDK if not already initialized
const firebaseConfig = { /* Your Firebase Admin credentials */ };
if (!initializeApp.length) {
  initializeApp({
    credential: cert(firebaseConfig),
  });
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { token } = req.body;

    try {
      const decodedToken = await getAuth().verifyIdToken(token);
      const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

      // Set the cookie
      res.setHeader(
        'Set-Cookie',
        serialize('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: expiresIn / 1000,
          path: '/',
        })
      );

      res.status(200).json({ message: 'Token set in cookies' });
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
