import { getAllUsers } from '@/data/userData';
import { createAnnouncement, type Announcement } from '@/data/annoucementData';
import type { UserRegisterFormValues } from '@/app/register/register';
import { faker } from '@faker-js/faker';
import { NextApiRequest, NextApiResponse } from 'next';
import { Timestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { createUserWithUid } from '@/data/userData';
import { auth } from '@/firebase';
import { adminAuth } from '@/firebase-admin';

const USER_AMOUNT = 100;
const MS_IN_DAY = 86400000;

const logError = (e: unknown, message: string = '') => {
  if (e instanceof Error) {
    console.error(`❌ ${message}`, e.message);
  } else {
    console.error(`❌ ${message}`, e);
  }
};

// This function is server-side implementation of intakeUser function from register.ts
const intakeUser = async (user: UserRegisterFormValues) => {
  try {
    const { firstName, lastName, email, gender, role, password } = user;
    // 1. Create a user in firebase auth
    const authUserObject = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    // 2. Create a user document in firestore with the same uid
    const uid = authUserObject.user.uid;
    await createUserWithUid({ firstName, lastName, email, gender, role }, uid);
    // 3. Set custom claims - this might be OD
    await adminAuth.setCustomUserClaims(uid, { role });
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

// Seed default users for testing
const seed = async () => {
  const mentee: UserRegisterFormValues = {
    role: 'mentee',
    firstName: 'Mentee',
    lastName: 'Doe',
    email: 'mentee@email.com',
    gender: 'male',
    password: 'Mentee#1',
  };

  const mentor: UserRegisterFormValues = {
    role: 'mentor',
    firstName: 'Mentor',
    lastName: 'Doe',
    email: 'mentor@email.com',
    gender: 'female',
    password: 'Mentor#1',
  };

  const admin: UserRegisterFormValues = {
    role: 'admin',
    firstName: 'Admin',
    lastName: 'Doe',
    email: 'admin@email.com',
    gender: 'male',
    password: 'Admin#01',
  };

  try {
    await intakeUser(mentee);
    console.log(' - Mentee Seeded');
  } catch (e) {
    logError(e);
  }

  try {
    await intakeUser(mentor);
    console.log(' - Mentor Seeded');
  } catch (e) {
    logError(e);
  }

  try {
    await intakeUser(admin);
    console.log(' - Admin Seeded');
  } catch (e) {
    logError(e);
  }

  const announcement: Omit<Announcement, '_id' | 'createdAt' | 'updatedAt'> = {
    type: 'info',
    message: 'New Announcement!',
    scheduleDate: Timestamp.fromDate(new Date()),
    expirationDate: Timestamp.fromDate(
      new Date(new Date().getTime() + MS_IN_DAY * 2),
    ), // +2 day
    active: true,
  };

  try {
    await createAnnouncement(announcement);
    console.log(' - Announcement Seeded');
  } catch (e) {
    logError(e);
  }
};

// Populate the database with random users
const populate = async (count: number) => {
  for (let i = 0; i < count; i++) {
    const user: UserRegisterFormValues = {
      role: faker.helpers.arrayElement(['mentee', 'mentor']),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      gender: faker.person.sex(),
      password: faker.internet.password(),
    };
    try {
      await intakeUser(user);
    } catch (e) {
      logError(e, `Error seeding user`);
    }
  }
};

const main = async () => {
  // check if in developement mode
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Must run seed in development mode!');
  }

  const allUsers = await getAllUsers();
  if (allUsers.length > USER_AMOUNT) {
    throw new Error('🌱 Database already been seeded');
  }

  console.log('\n⏳ Attempting seed...');

  // seed default users for dev
  await seed();
  console.log('🌱 Completed Seeding Dev Users');

  // seed random users
  await populate(USER_AMOUNT);
  console.log(`🚀 ${USER_AMOUNT} Users Populated`);

  console.log('\n✅ Seed Complete!\n');
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await main();
    res.status(200).json({ message: 'Database seeded successfully' });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json(error);
    }
  }
}
