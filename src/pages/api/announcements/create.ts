import { NextApiRequest, NextApiResponse } from 'next';
import { createAnnouncement } from '@/data/annoucementData';

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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const validationError = validateAnnouncementFields(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    let { type, message, scheduleDate, expirationDate, active } = req.body;
    scheduleDate = new Date(scheduleDate);
    expirationDate = new Date(expirationDate);
    const id = await createAnnouncement({
      type,
      message,
      scheduleDate,
      expirationDate,
      active,
    });
    res.status(201).json({ id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create announcement' });
  }
}
