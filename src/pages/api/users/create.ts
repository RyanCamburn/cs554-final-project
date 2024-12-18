import { NextApiRequest, NextApiResponse } from 'next';
import { createUser } from '@/data/userData';

// Helper function for validating user fields for creation
function validateCreateUserFields(user: any): string | null {
  if (!user) return 'Request body is missing.';

  if (
    !user.firstName ||
    typeof user.firstName !== 'string' ||
    user.firstName.trim() === ''
  ) {
    return 'The firstName field must not be empty and should be a string.';
  }
  if (
    !user.lastName ||
    typeof user.lastName !== 'string' ||
    user.lastName.trim() === ''
  ) {
    return 'The lastName field must not be empty and should be a string.';
  }
  if (
    !user.email ||
    typeof user.email !== 'string' ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)
  ) {
    return 'The email field must be a valid email address.';
  }
  if (!user.role || !['admin', 'mentor', 'mentee'].includes(user.role)) {
    return 'The role field must be one of the following: admin, mentor, mentee.';
  }
  if (!user.gender || typeof user.gender !== 'string') {
    return 'The gender field is required and must be a string.';
  }

  if (user.phoneNumber && typeof user.phoneNumber !== 'string') {
    return 'The phoneNumber field must be a string.';
  }
  if (user.industry && typeof user.industry !== 'string') {
    return 'The industry field must be a string.';
  }
  if (user.jobTitle && typeof user.jobTitle !== 'string') {
    return 'The jobTitle field must be a string.';
  }
  if (user.company && typeof user.company !== 'string') {
    return 'The company field must be a string.';
  }
  if (user.groupMembers && !Array.isArray(user.groupMembers)) {
    return 'The groupMembers field must be an array of strings.';
  }
  return null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const validationError = validateCreateUserFields(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const id = await createUser(req.body);
    res.status(201).json({ id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
}
