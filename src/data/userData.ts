import { getFirestore, collection, addDoc, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { User } from '../types';
import { db } from '../firebase';

/**
 * Create a new user.
 * @param userData The data of the user to be created.
 * @returns The newly created user.
 */
export const createUser = async (userData: User): Promise<User> => {
  try {
    const newUser: User = {
      ...userData,
      createdAt: new Date(),
    };

    const docRef = await addDoc(collection(db, 'users'), newUser);

    return { _id: docRef.id, ...newUser };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

/**
 * Get a user by ID.
 * @param id The ID of the user.
 * @returns The user data.
 */
export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const docRef = doc(db, 'users', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    const user: User = {
      _id: docSnap.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      gender: data.gender,
      permissions: data.permissions,
      role: data.role,
      createdAt: data.createdAt?.toDate(), 
      updatedAt: data.updatedAt?.toDate()
    };

    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

/**
 * Update a user's data.
 * @param id The ID of the user to be updated.
 * @param userData The data to update the user with.
 * @returns The updated user data.
 */
export const updateUser = async (id: string, userData: User): Promise<User> => {
    try {
      const updatedUser: Partial<User> = {
        ...userData,
        updatedAt: new Date(),
      };
  
      const docRef = doc(db, 'users', id);
      await updateDoc(docRef, updatedUser);
  
      return { _id: id, ...userData, updatedAt: updatedUser.updatedAt };
    } catch (error: any) {
      throw new Error(error.message);
    }
  };
  

/**
 * Delete a user by ID.
 * @param id The ID of the user to delete.
 * @returns A message indicating that the user was deleted.
 */
export const deleteUser = async (id: string): Promise<string> => {
  try {
    const docRef = doc(db, 'users', id);
    await deleteDoc(docRef);
    return 'User deleted successfully';
  } catch (error: any) {
    throw new Error(error.message);
  }
};
