import type { User } from '@/data/userData';
import { createUser } from '@/data/userData';
import { faker } from '@faker-js/faker';

const USER_SEED_AMOUNT = 100;

const seed = async (count: number) => {
  for (let i = 0; i < count; i++) {
    const user: Omit<User, '_id' | 'createdAt' | 'updatedAt'> = {
      role: faker.helpers.arrayElement(['Mentee', 'Mentor']),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phoneNumber: faker.phone.number({ style: 'national' }),
      gender: faker.person.sex(),
    };
    await createUser(user);
  }
};

seed(USER_SEED_AMOUNT).then(() => {
  console.log('🚀 Seeding complete');
});

export default seed;
