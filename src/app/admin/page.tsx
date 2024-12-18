'use client';

import { isNotEmpty, useForm } from '@mantine/form';
import { Button, TextInput } from '@mantine/core';
import ClaimsForm from '@/components/ClaimsForm';

export default function AdminPage() {
  const deleteUserForm = useForm({
    initialValues: {
      id: '',
    },
    validate: {
      id: isNotEmpty('ID is required'),
    },
  });

  const handleDeleteCookie = async (values: { id: string }) => {
    // This will send a request with an http-only JWT cookie which is used to verify if the user is allowed to delete the user
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
      <ClaimsForm />
    </div>
  );
}
