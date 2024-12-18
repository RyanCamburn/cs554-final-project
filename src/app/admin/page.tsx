'use client';

import { isNotEmpty, useForm } from '@mantine/form';
import { Button, TextInput } from '@mantine/core';
import { useAuth } from '@/sessions/AuthContext';

export default function AdminPage() {
  const { user } = useAuth();

  const deleteUserForm = useForm({
    initialValues: {
      id: '',
    },
    validate: {
      id: isNotEmpty('ID is required'),
    },
  });

  const handleDelete = async (values: { id: string }) => {
    const response = await fetch('/api/users/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      console.log('User deleted successfully');
    } else {
      console.error('Failed to delete user');
    }
  };

  const handleDeleteCookie = async (values: { id: string }) => {
    const response = await fetch('/api/users/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      console.log('User deleted successfully');
    } else {
      console.error('Failed to delete user');
    }
  };

  return (
    <div>
      <h1 className="text-white">Admin Page</h1>
      <form
        onSubmit={deleteUserForm.onSubmit((values) =>
          handleDeleteCookie(values),
        )}
      >
        <TextInput
          withAsterisk
          label="User ID"
          placeholder="Enter user ID"
          required
          {...deleteUserForm.getInputProps('id')}
        />
        <Button type="submit" color="red">
          Delete User
        </Button>
      </form>
    </div>
  );
}
