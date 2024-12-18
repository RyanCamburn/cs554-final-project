'use client';

import { useState } from 'react';
import { Modal, Button, Group, TextInput, Select } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';

type AnnouncementType = 'info' | 'warning' | 'error';

interface AnnouncementFormValues {
  type: AnnouncementType;
  message: string;
  startDate: Date | null;
  expirationDate: Date | null;
}

export function CreateAnnouncement() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState('');

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
      expirationDate: (value, values) => {
        if (!value) return 'Expiration date is required';
        if (values.startDate && value < values.startDate) {
          return 'Expiration date cannot be before the start date.';
        }
        return null;
      },
    },
  });

  const handleSubmit = async (values: AnnouncementFormValues) => {
    try {
      const response = await fetch('/api/announcements/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: values.type,
          message: values.message,
          scheduleDate: values.startDate,
          expirationDate: values.expirationDate,
          active: true,
        }),
      });
      const data = await response.json();
      console.log('Create response:', data);
      setModalOpen(false);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <>
      <Button variant="default" onClick={() => setModalOpen(true)}>
        Create Announcement
      </Button>
      <Modal
        opened={isModalOpen}
        onClose={() => setModalOpen(false)}
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
            classNames={{
              dropdown: 'w-fit min-w-[250px]' /* Fit content width */,
              calendarHeader: 'mb-1' /* Compact header margin */,
              calendarHeaderControl:
                'w-6 h-6 text-sm p-1' /* Smaller arrow buttons */,
              calendar: 'text-sm p-2' /* Compact calendar */,
            }}
            {...form.getInputProps('startDate')}
          />
          <DateInput
            withAsterisk
            label="Schedule Expiration Date"
            placeholder="YYYY-MM-DD"
            classNames={{
              dropdown: 'w-fit min-w-[250px]' /* Fit content width */,
              calendarHeader: 'mb-1' /* Compact header margin */,
              calendarHeaderControl:
                'w-6 h-6 text-sm p-1' /* Smaller arrow buttons */,
              calendar: 'text-sm p-2' /* Compact calendar */,
            }}
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
    </>
  );
}
