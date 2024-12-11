import {
  addDoc,
  collection,
  Timestamp,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";

interface User {
  _id?: string;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  gender: string;
  industry?: string;
  permissions: string;
  assignees?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export async function createUser(
  user: Omit<User, "_id" | "createdAt" | "updatedAt">
): Promise<string> {
  const newUser = {
    ...user,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, "users"), newUser);
  return docRef.id;
}

export async function getAllUsers(): Promise<User[]> {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((doc) => ({ _id: doc.id, ...doc.data() } as User));
}

export async function getUserById(id: string): Promise<User | null> {
  const docRef = doc(db, "users", id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { _id: snapshot.id, ...snapshot.data() } as User;
}

export async function updateUser(
  id: string,
  updatedFields: Partial<Omit<User, "_id" | "createdAt">>
): Promise<void> {
  const docRef = doc(db, "users", id);
  await updateDoc(docRef, { ...updatedFields, updatedAt: Timestamp.now() });
}

export async function deleteUser(id: string): Promise<void> {
  const docRef = doc(db, "users", id);
  await deleteDoc(docRef);
}