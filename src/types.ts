export interface User {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
    industry?: string;
    permissions: 'all' | 'announcements' | 'matching';
    role: 'Admin' | 'Mentor' | 'Mentee';
    createdAt?: Date;
    updatedAt?: Date;
  }