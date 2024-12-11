'use client';

import React from 'react';
import { Button } from '@mantine/core';

// For testing Purposes

const AnnouncementActions: React.FC = () => {
  const handleCreate = async () => {
    const response = await fetch('/api/announcements/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'info',
        message: 'New announcement',
        scheduleDate: new Date().toISOString(),
        expirationDate: new Date(new Date().getTime() + 86400000).toISOString(), // +1 day
        active: true,
      }),
    });
    const data = await response.json();
    console.log('Create response:', data);
  };

  const handleRead = async () => {
    const response = await fetch('/api/announcements');
    const data = await response.json();
    console.log('Read response:', data);
  };

  const handleUpdate = async () => {
    const response = await fetch('/api/announcements/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 'qG8p0aMLffoRIzIf7hAT', // Replace with actual document ID
        message: 'Updated announcement',
      }),
    });
    const data = await response.json();
    console.log('Update response:', data);
  };

  const handleDelete = async () => {
    const response = await fetch('/api/announcements/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 'qG8p0aMLffoRIzIf7hAT', // Replace with actual document ID
      }),
    });
    const data = await response.json();
    console.log('Delete response:', data);
  };

  return (
    <div>
      <Button onClick={handleCreate}>Create Announcement</Button>
      <Button onClick={handleRead}>Read Announcements</Button>
      <Button onClick={handleUpdate}>Update Announcement</Button>
      <Button onClick={handleDelete}>Delete Announcement</Button>
    </div>
  );
};

export default AnnouncementActions;
