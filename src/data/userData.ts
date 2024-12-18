import {
  addDoc,
  collection,
  Timestamp,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  setDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { adminAuth } from '../firebase-admin';
import { logError } from '../util';

export interface User {
  _id: string;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  gender: string;
  industry?: string;
  jobTitle?: string;
  company?: string;
  groupMembers?: string[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export async function createUser(
  user: Omit<User, '_id' | 'createdAt' | 'updatedAt'>,
): Promise<string> {
  const newUser = {
    ...user,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, 'users'), newUser);
  return docRef.id;
}

// This function is called in the registration process to create a user in firestore with the same uid as the user in firebase auth
export async function createUserWithUid(
  user: Omit<User, '_id' | 'createdAt' | 'updatedAt'>,
  uid: string,
): Promise<void> {
  const docRef = await setDoc(doc(db, 'users', uid), {
    ...user,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef;
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const snapshot = await getDocs(collection(db, 'users'));
    return snapshot.docs.map((doc) => ({ _id: doc.id, ...doc.data() }) as User);
  } catch (error) {
    logError(error, 'Failed to get all users');
    throw new Error('Failed to get all users');
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const docRef = doc(db, 'users', id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return { _id: snapshot.id, ...snapshot.data() } as User;
  } catch (error) {
    logError(error, 'Failed to get user by id');
    throw new Error('Failed to get user by id');
  }
}

export async function updateUser(
  id: string,
  updatedFields: Partial<Omit<User, '_id' | 'createdAt'>>,
): Promise<void> {
  try {
    const docRef = doc(db, 'users', id);
    await updateDoc(docRef, { ...updatedFields, updatedAt: Timestamp.now() });

    if (updatedFields.email) {
      await adminAuth.updateUser(id, { email: updatedFields.email });
    }
  } catch (error) {
    logError(error, 'Failed to update user');
    throw new Error('Failed to update user');
  }
}

export async function deleteUser(id: string): Promise<string> {
  try {
    console.log("im here")
    const docRef = doc(db, 'users', id);
    const snapshot = await getDoc(docRef);
    console.log(snapshot);
    if (!snapshot.exists()) {
      return 'dne';
    }
    await deleteDoc(docRef);
    await adminAuth.deleteUser(id);
    return 'success';
  } catch (error) {
    logError(error, 'Failed to delete user');
    return 'error';
    }
}