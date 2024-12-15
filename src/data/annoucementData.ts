import {
  addDoc,
  collection,
  Timestamp,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

type AnnouncementType = 'info' | 'warning' | 'error';

export interface Announcement {
  _id?: string;
  type: AnnouncementType;
  message: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  scheduleDate: Timestamp;
  expirationDate: Timestamp;
  active: boolean;
}

export async function createAnnouncement(
  announcement: Omit<Announcement, '_id' | 'createdAt' | 'updatedAt'>,
): Promise<string> {
  if (!announcement.message || announcement.message.trim() === '') {
    throw new Error('The message field must not be empty.');
  }

  const newAnnouncement = {
    ...announcement,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  try {
    const docRef = await addDoc(
      collection(db, 'announcements'),
      newAnnouncement,
    );
    return docRef.id;
  } catch (error) {
    throw new Error(`Couldn't create announcement: ${error}`);
  }
}

export async function getAllAnnouncements(): Promise<Announcement[]> {
  try {
    const snapshot = await getDocs(collection(db, 'announcements'));
    return snapshot.docs.map(
      (doc) => ({ _id: doc.id, ...doc.data() }) as Announcement,
    );
  } catch (error) {
    throw new Error(`Couldn't retrieve announcements: ${error}`);
  }
}

export async function getAnnouncementById(
  id: string,
): Promise<Announcement | null> {
  try {
    const docRef = doc(db, 'announcements', id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return { _id: snapshot.id, ...snapshot.data() } as Announcement;
  } catch (error) {
    throw new Error(`Couldn't retrieve announcement: ${error}`);
  }
}

export async function updateAnnouncement(
  id: string,
  updatedFields: Partial<Omit<Announcement, '_id' | 'createdAt'>>,
): Promise<void> {
  if (!updatedFields.message || updatedFields.message.trim() === '') {
    throw new Error('The message field must not be empty.');
  }
  try {
    const docRef = doc(db, 'announcements', id);
    await updateDoc(docRef, { ...updatedFields, updatedAt: Timestamp.now() });
  } catch (error) {
    throw new Error(`Failed to update announcement: ${error}`);
  }
}

export async function deleteAnnouncement(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'announcements', id);
    await deleteDoc(docRef);
  } catch (error) {
    throw new Error(`Failed to delete announcement: ${error}`);
  }
}
