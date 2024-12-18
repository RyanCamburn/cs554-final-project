import { NextApiRequest, NextApiResponse } from 'next';
import { updateAnnouncement } from '@/data/annoucementData';

function validateAnnouncementFields(announcement: any): string | null {
  if (!announcement) return 'Request body is missing.';
  if (
    !announcement.message ||
    typeof announcement.message !== 'string' ||
    announcement.message.trim() === ''
  ) {
    return 'The message field must not be empty and should be a string.';
  }
  if (
    !announcement.scheduleDate ||
    isNaN(Date.parse(announcement.scheduleDate))
  ) {
    return 'The scheduleDate field is required and must be a valid date.';
  }
  if (
    !announcement.expirationDate ||
    isNaN(Date.parse(announcement.expirationDate))
  ) {
    return 'The expirationDate field is required and must be a valid date.';
  }
  if (typeof announcement.active !== 'boolean') {
    return 'The active field is required and must be a boolean.';
  }
  if (!['info', 'warning', 'error'].includes(announcement.type)) {
    return 'The type field must be one of the following: info, warning, or error.';
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
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'A valid ID is required.' });
  }

  const validationError = validateAnnouncementFields(updatedFields);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    await updateAnnouncement(id, updatedFields);
    res.status(200).json({ message: 'Announcement updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update announcement' });
  }
}
