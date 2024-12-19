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

export interface Event {
  _id: string;
  eventName: string;
  date: Timestamp;
  startTime: Timestamp;
  endTime: Timestamp;
  location: string;
  description: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export async function createEvent(
  event: Omit<Event, '_id' | 'createdAt' | 'updatedAt'>,
): Promise<string> {
  const newEvent = {
    ...event,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, 'events'), newEvent);
  return docRef.id;
}

export async function getAllEvents(): Promise<Event[]> {
  try {
    const snapshot = await getDocs(collection(db, 'events'));
    return snapshot.docs.map(
      (doc) => ({ _id: doc.id, ...doc.data() }) as Event,
    );
  } catch (error) {
    throw new Error(`Failed to get all events: ${error}`);
  }
}

export async function getEventById(id: string): Promise<Event | null> {
  try {
    const docRef = doc(db, 'events', id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return { _id: snapshot.id, ...snapshot.data() } as Event;
  } catch (error) {
    throw new Error(`Failed to get event by id: ${error}`);
  }
}

export async function updateEvent(
  id: string,
  updatedFields: Partial<Omit<Event, '_id' | 'createdAt'>>,
): Promise<void> {
  try {
    const docRef = doc(db, 'events', id);
    await updateDoc(docRef, { ...updatedFields, updatedAt: Timestamp.now() });
  } catch (error) {
    throw new Error(`Failed to update event: ${error}`);
  }
}

export async function deleteEvent(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'events', id);
    await deleteDoc(docRef);
  } catch (error) {
    throw new Error(`Failed to get all events: ${error}`);
  }
}
