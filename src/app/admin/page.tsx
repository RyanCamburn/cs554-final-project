'use client';

import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import {
  Modal,
  Button,
  Group,
  TextInput,
  Text,
  Center,
  Select,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';

import { useAuth } from '@/sessions/AuthContext';

type AnnouncementType = 'info' | 'warning' | 'error';

interface AnnouncementFormValues {
  type: AnnouncementType;
  message: string;
  startDate: Date | null;
  expirationDate: Date | null;
}

export default function AdminPage() {
  const [error, setError] = useState('');
  const [opened, { open, close }] = useDisclosure(false);
  const { user } = useAuth();

  const form = useForm({
    initialValues: {
      type: 'info',
      message: '',
      startDate: null,
      expirationDate: null,
    },

    validate: {
      type: (value) => (value ? null : 'Type is required'),
      message: (value) => (value ? null : 'Message is required'),
      startDate: (value) => (value ? null : 'Start date is required'),
      expirationDate: (value) => (value ? null : 'Expiration date is required'),
    },
  });

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

  const handleSubmit = async (values: AnnouncementFormValues) => {
    console.log('Form values:', values);
    try {
      const response = await fetch('/api/announcements/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'info',
          message: values.message,
          scheduleDate: values.startDate,
          expirationDate: values.expirationDate,
          active: true,
        }),
      });
      const data = await response.json();
      console.log('Create response:', data);
      close();
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <div className="min-h-screen p-16">
      <div>
        <Center>
          <Title className="text-4xl font-bold mb-2 justify-center pb-8 text-white">
            Admin Dashboard
          </Title>
        </Center>
      </div>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        title="Create Announcement"
        centered
      >
        <form
          onSubmit={form.onSubmit((values) => {
            handleSubmit(values);
          })}
        >
          <Select
            withAsterisk
            label="Type"
            placeholder="Select announcement type"
            data={[
              { value: 'info', label: 'Info' },
              { value: 'warning', label: 'Warning' },
              { value: 'error', label: 'Error' },
            ]}
            {...form.getInputProps('type')}
          />
          <TextInput
            withAsterisk
            label="Message"
            placeholder="Type message here"
            {...form.getInputProps('message')}
          />
          <DateInput
            withAsterisk
            label="Schedule Start Date"
            placeholder="YYYY-MM-DD"
            {...form.getInputProps('startDate')}
          />
          <DateInput
            withAsterisk
            label="Schedule Expiration Date"
            placeholder="YYYY-MM-DD"
            {...form.getInputProps('expirationDate')}
          />
          <Group mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
        {error && (
          <div className="mt-4 bg-red-200 text-red-800 p-2 rounded border border-red-400">
            {error}
          </div>
        )}
      </Modal>
      <Center>
        <Button variant="default" onClick={open}>
          Create Announcement
        </Button>
      </Center>
    </div>
  );
}
