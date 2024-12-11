'use client';

import React from 'react';
import { Button } from '@mantine/core';

const UserActions: React.FC = () => {
  const handleCreate = async () => {
    const response = await fetch('/api/users/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role: 'Mentee',
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@edu.com',
        gender: 'Male',
        permissions: 'all',
      }),
    });
    const data = await response.json();
    console.log('Create response:', data);
  };

  const handleRead = async () => {
    const response = await fetch('/api/users');
    const data = await response.json();
    console.log('Read response:', data);
  };

  const handleUpdate = async () => {
    const response = await fetch('/api/users/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: '',
        firstName: 'pingus',
      }),
    });
    const data = await response.json();
    console.log('Update response:', data);
  };

  const handleDelete = async () => {
    const response = await fetch('/api/users/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 'n24ss1MKu3matdu0cdYS', //put real user id here to test
      }),
    });
    const data = await response.json();
    console.log('Delete response:', data);
  };

  return (
    <div>
      <Button onClick={handleCreate}>Create User</Button>
      <Button onClick={handleRead}>Read Users</Button>
      <Button onClick={handleUpdate}>Update User</Button>
      <Button onClick={handleDelete}>Delete User</Button>
    </div>
  );
};

export default UserActions;