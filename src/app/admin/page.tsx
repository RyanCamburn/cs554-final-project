'use client';

import { isNotEmpty, useForm } from '@mantine/form';
import { Button, TextInput, Center, Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useAuth } from '@/sessions/AuthContext';
import { CreateAnnouncement } from '@/components/CreateAnnouncement';

export default function AdminPage() {
  const { user } = useAuth();

  const isAdmin = user && user.customClaims.role === 'admin';
  if (!user || !isAdmin) {
    return (
      <div>
        <Center>
          <Text size="xl" ta="center">
            You are not an admin!
          </Text>
        </Center>
      </div>
    );
  }

  const deleteUserForm = useForm({
    initialValues: {
      id: '',
    },
    validate: {
      id: isNotEmpty('ID is required'),
    },
  });

  const handleDeleteCookie = async (values: { id: string }) => {
    const response = await fetch('/api/users/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      notifications.show({
        message: 'User deleted successfully',
        color: 'green',
      });
    } else if (response.status === 404) {
      notifications.show({
        message: 'User not found',
        color: 'red',
      });
    } else if (response.status === 500) {
      notifications.show({
        message: 'Failed to delete user',
        color: 'red',
      });
    } else {
      notifications.show({
        message: 'Error deleting user. Try again.',
        color: 'red',
      });
    }
  };

  return (
    <div className="min-h-screen p-16">
      <Center>
        <Title className="text-4xl font-bold mb-2 justify-center pb-8 text-white">
          Admin Dashboard
        </Title>
      </Center>

      <Center>
        <CreateAnnouncement />
      </Center>

      <div className="mt-8">
        <h2 className="text-white text-xl mb-4">Delete User</h2>
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
          <Button type="submit" color="red" className="mt-4">
            Delete User
          </Button>
        </form>
      </div>
    </div>
  );
}
