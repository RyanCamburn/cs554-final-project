import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { industry } = req.query;

  if (req.method === 'GET') {
    try {
      const q = query(
        collection(db, 'messages'),
        where('industry', '==', industry),
      );
      const querySnapshot = await getDocs(q);
      const messages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      res.status(200).json(messages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      res
        .status(500)
        .json({ error: 'Failed to fetch messages', details: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { userId, userName, content, role } = req.body;
      const newMessage = {
        userId,
        userName,
        content,
        role,
        industry,
        timestamp: Timestamp.now().toDate().toString(),
      };
      const docRef = await addDoc(collection(db, 'messages'), newMessage);
      res.status(201).json({ id: docRef.id, ...newMessage });
    } catch (error) {
      console.error('Failed to send message:', error);
      res
        .status(500)
        .json({ error: 'Failed to send message', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
