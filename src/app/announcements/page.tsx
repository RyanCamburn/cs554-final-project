'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  Text,
  Center,
  Loader,
  Badge,
  Group,
  Modal,
  Button,
  Select,
  TextInput,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm, isNotEmpty } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '@/sessions/AuthContext';

interface Announcement {
  _id: string;
  type: 'info' | 'warning' | 'error';
  message: string;
  scheduleDate: Date;
  expirationDate: Date;
  active: boolean;
}

function timestampToDate(timestamp: { seconds: number; nanoseconds: number }) {
  const milliseconds = timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6;
  return new Date(milliseconds);
}

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [isModalOpen, { open: openModal, close: closeModal }] =
    useDisclosure(false);

  const form = useForm<Announcement>({
    initialValues: {
      id: '',
      type: 'info',
      message: '',
      scheduleDate: new Date(),
      expirationDate: new Date(),
      active: true,
    },
    validate: {
      type: isNotEmpty('Type is required'),
      message: isNotEmpty('Message is required'),
      scheduleDate: isNotEmpty('Schedule date is required'),
      expirationDate: (expirationDate, values) => {
        if (!expirationDate) return 'Expiration date is required';
        if (values.scheduleDate && expirationDate < values.scheduleDate) {
          return 'Expiration date cannot be before the schedule date.';
        }
        return null;
      },
    },
  });

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('/api/announcements');
        const data = await response.json();

        const normalizedData = data.map((announcement: any) => ({
          ...announcement,
          id: announcement._id,
          scheduleDate: timestampToDate(announcement.scheduleDate),
          expirationDate: timestampToDate(announcement.expirationDate),
          active: announcement.active === true,
        }));

        setAnnouncements(normalizedData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const openEditModal = (announcement: Announcement) => {
    const normalizedAnnouncement = {
      ...announcement,
      id: announcement._id,
    };

    form.setValues(normalizedAnnouncement);
    openModal();
  };

  const handleEditSubmit = async (values: Announcement) => {
    try {
      if (!values._id) {
        throw new Error('Announcement ID is required.');
      }

      // Ensure `active` is a boolean before sending to the backend
      const payload = {
        id: values._id,
        type: values.type,
        message: values.message,
        scheduleDate: values.scheduleDate,
        expirationDate: values.expirationDate,
        active: values.active === true, // Convert to boolean
      };

      const response = await fetch('/api/announcements/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      // Refresh announcements after update
      const updatedAnnouncementsResponse = await fetch('/api/announcements');
      const updatedAnnouncements = await updatedAnnouncementsResponse.json();

      setAnnouncements(
        updatedAnnouncements.map((announcement: Announcement) => ({
          ...announcement,
          id: announcement._id, // Normalize `_id` to `id`
          scheduleDate: new Date(announcement.scheduleDate),
          expirationDate: new Date(announcement.expirationDate),
          active: announcement.active === true, // Convert string to boolean
        })),
      );

      closeModal();
    } catch (err) {
      console.error('Failed to update announcement:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch('/api/announcements/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      console.log('Delete response:', data);

      if (data.error) {
        throw new Error(data.error);
      }

      // Refresh announcements after deletion
      const updatedAnnouncementsResponse = await fetch('/api/announcements');
      const updatedAnnouncements = await updatedAnnouncementsResponse.json();

      setAnnouncements(
        updatedAnnouncements.map((announcement: Announcement) => ({
          ...announcement,
          id: announcement._id, // Normalize `_id` to `id`
          scheduleDate: announcement.scheduleDate,
          expirationDate: announcement.expirationDate,
          active: announcement.active === true, // Convert string to boolean
        })),
      );

      closeModal();
    } catch (err) {
      console.error('Failed to delete announcement:', err);
    }
  };

  if (loading) {
    return (
      <Center className="min-h-screen p-16">
        <Loader size="lg" />
      </Center>
    );
  }

  if (!announcements || announcements.length === 0) {
    return (
      <Center>
        <Text size="xl" color="dimmed">
          No announcements to display.
        </Text>
      </Center>
    );
  }

  const currentDate = new Date();
  const filteredAnnouncements = announcements.filter((announcement) => {
    if (user?.customClaims?.role === 'admin') {
      return true;
    }

    const isActive =
      announcement.active &&
      announcement.scheduleDate <= currentDate &&
      announcement.expirationDate >= currentDate;

    return isActive;
  });

  if (filteredAnnouncements.length === 0) {
    return (
      <Center className="min-h-screen p-16 text-white">
        <Text size="xl" color="dimmed">
          No announcements to display.
        </Text>
      </Center>
    );
  }

  return (
    <Center>
      <div style={{ width: '80%' }} className="min-h-screen p-16 text-white">
        <Center>
          <Title className="text-4xl font-bold mb-2 justify-center pb-8">
            Announcements
          </Title>
        </Center>
        {filteredAnnouncements.map((announcement) => (
          <Card
            key={announcement._id}
            shadow="sm"
            p="lg"
            radius="md"
            withBorder
            mb="md"
          >
            <Group justify="space-between" mb="sm">
              <Badge color={getColorForType(announcement.type)}>
                {announcement.type.toUpperCase()}
              </Badge>
              <Text size="sm" color="dimmed">
                {announcement.active ? 'Active' : 'Inactive'}
              </Text>
            </Group>
            {user?.customClaims?.role === 'admin' && (
              <div>
                <Text size="sm" color="dimmed" mb="sm">
                  <strong>Schedule Date:</strong>{' '}
                  {announcement.scheduleDate.toISOString()}
                </Text>
                <Text size="sm" color="dimmed" mb="sm">
                  <strong>Expiration Date:</strong>{' '}
                  {announcement.expirationDate.toISOString()}
                </Text>
              </div>
            )}
            <div className="p-4 rounded-lg bg-slate-200">
              <Text size="sm">{announcement.message}</Text>
            </div>
            {user?.customClaims?.role === 'admin' && (
              <div className="flex justify-start space-x-4 mt-4">
                <Button
                  variant="light"
                  color="blue"
                  onClick={() => openEditModal(announcement)}
                >
                  Edit
                </Button>
                <Button
                  color="red"
                  onClick={() => handleDelete(announcement._id)}
                >
                  Delete
                </Button>
              </div>
            )}
          </Card>
        ))}

        <Modal
          opened={isModalOpen}
          onClose={closeModal}
          withCloseButton
          title="Edit Announcement"
          centered
        >
          <form
            onSubmit={form.onSubmit((values) => {
              handleEditSubmit(values);
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
              label="Schedule Date"
              placeholder="YYYY-MM-DD"
              classNames={{
                dropdown: 'w-fit min-w-[250px]' /* Fit content width */,
                calendarHeader: 'mb-1' /* Compact header margin */,
                calendarHeaderControl:
                  'w-6 h-6 text-sm p-1' /* Smaller arrow buttons */,
                calendar: 'text-sm p-2' /* Compact calendar */,
              }}
              {...form.getInputProps('scheduleDate')}
            />
            <DateInput
              withAsterisk
              label="Expiration Date"
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
            <Select
              label="Active"
              placeholder="True"
              data={[
                { value: 'true', label: 'True' },
                { value: 'false', label: 'False' },
              ]}
              {...form.getInputProps('active', {
                // Convert string to boolean for the form
                parse: (value) => value === 'true',
                // Convert boolean back to string for the Select component
                format: (value) => (value ? 'true' : 'false'),
              })}
            />
            <Group mt="md">
              <Button type="submit">Save Changes</Button>
            </Group>
          </form>
        </Modal>
      </div>
    </Center>
  );
}

function getColorForType(type: Announcement['type']) {
  switch (type) {
    case 'info':
      return 'blue';
    case 'warning':
      return 'yellow';
    case 'error':
      return 'red';
    default:
      return 'gray';
  }
}
