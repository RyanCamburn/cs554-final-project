import { getAllUsers } from '@/data/userData';
import { createAnnouncement, type Announcement } from '@/data/annoucementData';
import type { UserRegisterFormValues } from './auth/register';
import { faker } from '@faker-js/faker';
import { NextApiRequest, NextApiResponse } from 'next';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { type User, createUserWithUid, updateUser } from '@/data/userData';
import { auth, db } from '@/firebase';
import { adminAuth } from '@/firebase-admin';
import { logError } from '@/util';
import { INDUSTRIES } from '@/app/settings/page';
import { type Event, createEvent } from '@/data/eventData';
import { addDoc, collection, Timestamp } from 'firebase/firestore';

type CompleteUser = UserRegisterFormValues &
  Pick<User, 'industry' | 'jobTitle' | 'company'>;

const MENTOR_AMOUNT = 100;
const MENTEE_AMOUNT = 200;
const MS_IN_DAY = 86400000;

const generateEventName = () => {
  const verb1 = faker.word.verb();
  const adjective = faker.word.adjective();
  const noun1 = faker.word.noun();
  const verb2 = faker.word.verb();
  const noun2 = faker.word.noun();
  return `${verb1.charAt(0).toUpperCase() + verb1.slice(1)} ${adjective} ${noun1} ${verb2} ${noun2}`;
};

const intakeUser = async (user: CompleteUser) => {
  try {
    const {
      firstName,
      lastName,
      email,
      gender,
      role,
      password,
      industry,
      jobTitle,
      company,
    } = user;
    // 1. Create a user in firebase auth
    const authUserObject = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    // 2. Create a user document in firestore with the same uid
    const uid = authUserObject.user.uid;
    await createUserWithUid(
      { firstName, lastName, email, gender, role, industry, jobTitle, company },
      uid,
    );
    // 3. Set custom claims - this might be OD
    await adminAuth.setCustomUserClaims(uid, { role });
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

// Seed default users for testing
const seed = async () => {
  const mentee: CompleteUser = {
    role: 'mentee',
    firstName: 'Mentee',
    lastName: 'Doe',
    email: 'mentee@email.com',
    gender: 'male',
    password: 'Mentee#1',
    industry: 'Technology',
    jobTitle: 'Student',
    company: 'Stevens Institute of Technology',
  };

  const mentor: CompleteUser = {
    role: 'mentor',
    firstName: 'Mentor',
    lastName: 'Doe',
    email: 'mentor@email.com',
    gender: 'female',
    password: 'Mentor#1',
    industry: 'Technology',
    jobTitle: 'Software Engineer',
    company: 'Google',
  };

  const admin: CompleteUser = {
    role: 'admin',
    firstName: 'Admin',
    lastName: 'Doe',
    email: 'admin@email.com',
    gender: 'male',
    password: 'Admin#01',
    industry: 'Technology',
    jobTitle: 'Mentorship Admin',
    company: 'MentorMatch',
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
    scheduleDate: new Date(),
    expirationDate: new Date(new Date().getTime() + MS_IN_DAY * 2), // +2 day
    active: true,
  };

  try {
    await createAnnouncement(announcement);
    console.log(' - Announcement Seeded');
  } catch (e) {
    logError(e);
  }

  // create 5 sample events
  const eventDates = [2, 6, 10, 14, 21].map((days) => {
    const baseDate = new Date();
    baseDate.setHours(0, 0, 0, 0); // Set the time to midnight
    baseDate.setDate(baseDate.getDate() + days); // Add the specified number of days
    return baseDate.getTime();
  });

  const events: Omit<Event, '_id' | 'createdAt' | 'updatedAt'>[] =
    eventDates.map((dateMillis) => ({
      eventName: generateEventName(),
      description: faker.lorem.sentence(),
      date: Timestamp.fromMillis(dateMillis),
      location: faker.location.city(),
      startTime: Timestamp.fromDate(
        new Date(new Date(dateMillis).toLocaleDateString() + ' 10:00 AM'),
      ),
      endTime: Timestamp.fromDate(
        new Date(new Date(dateMillis).toLocaleDateString() + ' 12:00 PM'),
      ),
    }));

  try {
    for (const event of events) {
      await createEvent(event);
    }
    console.log(' - Events Seeded');
  } catch (e) {
    logError(e);
  }
};

// Populate the database with random users with specific role
const populate = async (count: number, role: User['role']) => {
  for (let i = 0; i < count; i++) {
    const user: CompleteUser = {
      role: role,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      industry: faker.helpers.arrayElement(INDUSTRIES),
      jobTitle: role === 'mentee' ? 'Student' : faker.person.jobTitle(),
      company:
        role === 'mentee'
          ? 'Stevens Institute of Technology'
          : faker.company.name(),
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

const assignMentorsToMentees = async () => {
  // Get all mentees and mentors
  const allUsers = await getAllUsers();
  const mentees = allUsers.filter((user) => user.role === 'mentee');
  const mentors = allUsers.filter((user) => user.role === 'mentor');

  // Split all mentees into groups of 2 so there are a total of 2 mentees per mentor
  const menteeGroups = [];
  for (let i = 0; i < mentees.length; i += 2) {
    menteeGroups.push(mentees.slice(i, i + 2));
  }

  // Assign each group of mentees to a mentor and update groupMembers field
  for (let i = 0; i < menteeGroups.length || i < mentors.length; i++) {
    const mentor = mentors[i];
    const menteeGroup = menteeGroups[i];

    // create list of all ids in group
    const allGroupMembersIds = menteeGroup.map((mentee) => mentee._id);
    allGroupMembersIds.push(mentor._id);

    // update mentor and each mentee with groupMembers
    if (
      !mentor._id ||
      !menteeGroup[0]?._id ||
      !menteeGroup[1]?._id ||
      !allGroupMembersIds
    ) {
      console.log(`Error: missing ids for mentor ${mentor._id} group`);
      return;
    }

    // update mentor
    const mentorGroupMembers = allGroupMembersIds.filter(
      (id) => id !== mentor._id,
    );
    await updateUser(mentor._id, { groupMembers: mentorGroupMembers });

    // update mentees
    for (const mentee of menteeGroup) {
      const menteeGroupMembers = allGroupMembersIds.filter(
        (id) => id !== mentee._id,
      );
      await updateUser(mentee._id, { groupMembers: menteeGroupMembers });
    }
  }
};

const seedForumMessages = async () => {
  const allUsers = await getAllUsers();
  const mentorsAndMentees = allUsers.filter(
    (user) => user.role === 'mentor' || user.role === 'mentee',
  );

  const messages = [];
  for (let i = 0; i < 100; i++) {
    const user = faker.helpers.arrayElement(mentorsAndMentees);
    const industry = faker.helpers.arrayElement(INDUSTRIES);
    const message = {
      userId: user._id,
      userName: `${user.firstName} ${user.lastName}`,
      content: faker.lorem.sentence(),
      role: user.role,
      industry: industry,
      timestamp: Timestamp.now().toDate().toString(),
    };
    messages.push(message);
  }

  try {
    for (const message of messages) {
      await addDoc(collection(db, 'messages'), message);
    }
    console.log(' - Forum Messages Seeded');
  } catch (e) {
    logError(e);
  }
};

const main = async () => {
  // check if in developement mode
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Must run seed in development mode!');
  }

  const allUsers = await getAllUsers();
  if (allUsers.length > MENTEE_AMOUNT + MENTOR_AMOUNT) {
    throw new Error('🌱 Database already been seeded');
  }

  console.log('\n⏳ Attempting seed...');

  // seed default users for dev
  await seed();
  console.log('🌱 Completed Seeding Dev Users');

  // seed mentee and mentor users
  await populate(MENTEE_AMOUNT, 'mentee');
  console.log(`🚀 ${MENTEE_AMOUNT} Mentees Populated`);
  await populate(MENTOR_AMOUNT, 'mentor');
  console.log(`🚀 ${MENTOR_AMOUNT} Mentors Populated`);

  // handle assignees
  assignMentorsToMentees();
  console.log('🚀 Assigned Mentors to Mentees');

  // seed forum messages
  await seedForumMessages();
  console.log('🚀 Forum Messages Seeded');

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
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json(error);
    }
  }
}
