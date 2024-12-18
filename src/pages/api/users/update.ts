import { NextApiRequest, NextApiResponse } from 'next';
import { updateUser } from '@/data/userData';

function validateUpdateUserFields(user: any): string | null {
  if (!user) return 'Request body is missing.';

  if (
    user.firstName &&
    (typeof user.firstName !== 'string' || user.firstName.trim() === '')
  ) {
    return 'If provided, the firstName field must not be empty and should be a string.';
  }
  if (
    user.lastName &&
    (typeof user.lastName !== 'string' || user.lastName.trim() === '')
  ) {
    return 'If provided, the lastName field must not be empty and should be a string.';
  }
  if (
    user.email &&
    (typeof user.email !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email))
  ) {
    return 'If provided, the email field must be a valid email address.';
  }
  if (user.role && !['admin', 'mentor', 'mentee'].includes(user.role)) {
    return 'If provided, the role field must be one of the following: admin, mentor, mentee.';
  }
  if (user.gender && typeof user.gender !== 'string') {
    return 'If provided, the gender field must be a string.';
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
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, ...updatedFields } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  const validationError = validateUpdateUserFields(updatedFields);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    await updateUser(id, updatedFields);
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user' });
  }
}
