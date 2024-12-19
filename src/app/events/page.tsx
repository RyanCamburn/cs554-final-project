'use client';

import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar.css';
import {
  TextInput,
  Button,
  Card,
  Text,
  Group,
  Container,
  Title,
  Box,
  Loader,
} from '@mantine/core';
import { useForm, isNotEmpty } from '@mantine/form';
import { useAuth } from '@/sessions/AuthContext';
import type { Event } from '@/data/eventData';
import {
  stringToFirebaseTimestamp,
  timestampToDate,
  timeToMilitary,
} from '@/util';
import { Timestamp } from 'firebase/firestore';
import { notifications } from '@mantine/notifications';

interface EventFormValues {
  selectedDate: string;
  eventName: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
}

const timeStringFormatting: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
};

export default function EventsPage() {
  const [selectedDate, setSelectedDate] = useState<Timestamp | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const { user } = useAuth();
  const isAdmin = user && user.customClaims.role === 'admin';

  const handleDateSelection = (date: Date) => {
    form.setFieldValue('selectedDate', date.toDateString());
    setSelectedDate(stringToFirebaseTimestamp(date));
  };

  const form = useForm<EventFormValues>({
    initialValues: {
      selectedDate: '',
      eventName: '',
      startTime: '',
      endTime: '',
      location: '',
      description: '',
    },
    validate: {
      selectedDate: isNotEmpty(
        'A date must be selected. Choose one on the calendar.',
      ),
      eventName: isNotEmpty('Event name must not be empty'),
      startTime: isNotEmpty('Start time must not be empty'),
      endTime: isNotEmpty('End time must not be empty'),
      location: isNotEmpty('Location must not be empty'),
      description: isNotEmpty('Description must not be empty'),
    },
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/events');
        const events: Event[] = await response.json();
        // convert date, startTime, and endTime to Timestamp objects
        events.forEach((event) => {
          event.date = Timestamp.fromDate(timestampToDate(event.date));
          event.startTime = Timestamp.fromDate(
            timestampToDate(event.startTime),
          );
          event.endTime = Timestamp.fromDate(timestampToDate(event.endTime));
          // can include createdAt and updatedAt if needed
        });

        console.log(events);
        setLoading(false);
        setEvents(events);
      } catch (e) {
        console.error(e);
        setLoading(false);
        setError('Failed to fetch events');
        notifications.show({
          title: 'Failed to Fetch Events',
          message: 'Error fetching events. Please try again later.',
          color: 'red',
        });
      }
    };
    fetchEvents();
  }, []);

  const createOrUpdateEvent = async (values: EventFormValues) => {
    if (!selectedDate) {
      form.setFieldError('eventName', 'Please select a date first.');
      return;
    }

    if (values.startTime > values.endTime) {
      form.setFieldError(
        'startTime',
        'Start time must be earlier than end time.',
      );
      return;
    }

    if (editingEventId !== null) {
      // Update an existing event
      const response = await fetch('/api/events/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          id: editingEventId,
          date: selectedDate,
          startTime: stringToFirebaseTimestamp(
            `${selectedDate.toDate().toLocaleDateString()} ${values.startTime}`,
          ),
          endTime: stringToFirebaseTimestamp(
            `${selectedDate.toDate().toLocaleDateString()} ${values.endTime}`,
          ),
        }),
      });

      if (response.ok) {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._id === editingEventId
              ? {
                  ...event,
                  date: stringToFirebaseTimestamp(selectedDate),
                  startTime: stringToFirebaseTimestamp(
                    `${event.date.toDate().toLocaleDateString()} ${values.startTime}`,
                  ),
                  endTime: stringToFirebaseTimestamp(
                    `${event.date.toDate().toLocaleDateString()} ${values.endTime}`,
                  ),
                  eventName: values.eventName
                    ? values.eventName
                    : event.eventName,
                  location: values.location ? values.location : event.location,
                  description: values.description
                    ? values.description
                    : event.description,
                  selectedDate: undefined,
                }
              : event,
          ),
        );
        setEditingEventId(null);
        notifications.show({
          title: 'Update Sucessful',
          message: 'Event has been updated successfully',
          color: 'green',
        });
      } else {
        notifications.show({
          title: 'Updated Failed',
          message: 'Error updating event. Please try again.',
          color: 'red',
        });
        console.error('Failed to update event');
      }
    } else {
      // Create a new event
      const newEvent: Omit<Event, '_id'> = {
        date: selectedDate,
        startTime: stringToFirebaseTimestamp(
          `${selectedDate.toDate().toDateString()} ${values.startTime}`,
        ),
        endTime: stringToFirebaseTimestamp(
          `${selectedDate.toDate().toDateString()} ${values.endTime}`,
        ),
        eventName: values.eventName,
        location: values.location,
        description: values.description,
      };

      const response = await fetch('/api/events/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        const { id } = await response.json();
        // queriedEvent.date = stringToFirebaseTimestamp(queriedEvent.date);
        const completeNewEvent: Event = {
          ...newEvent,
          _id: id,
        };
        setEvents((prevEvents) => [...prevEvents, completeNewEvent]);
        notifications.show({
          title: 'Sucessful Creation',
          message: 'Event has been created successfully',
          color: 'green',
        });
      } else {
        console.error('Failed to create event');
        notifications.show({
          title: 'Failed Creation',
          message: 'Error creating Event. Please try again.',
          color: 'red',
        });
      }
    }

    form.reset();
  };

  const deleteEvent = async (eventId: string) => {
    const response = await fetch('/api/events/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: eventId }),
    });

    if (response.ok) {
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event._id !== eventId),
      );
      notifications.show({
        title: 'Event Deleted',
        message: 'Event has been deleted successfully',
        color: 'green',
      });
    } else {
      console.error('Failed to delete event');
      notifications.show({
        title: 'Failed to Delete',
        message: 'Error deleting Event. Please try again.',
        color: 'red',
      });
    }
  };

  const editEvent = (event: Event) => {
    setEditingEventId(event._id);
    setSelectedDate(event.date);
    form.setValues({
      selectedDate: event.date.toDate().toLocaleDateString(),
      eventName: event.eventName,
      startTime: timeToMilitary(
        event.startTime.toDate().toLocaleTimeString([], timeStringFormatting),
      ),
      endTime: timeToMilitary(
        event.endTime.toDate().toLocaleTimeString([], timeStringFormatting),
      ),
      location: event.location,
      description: event.description,
    });
  };

  const sortedEvents = events.sort((a, b) => {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    return a.startTime < b.startTime ? -1 : a.startTime > b.startTime ? 1 : 0;
  });

  // if error is not null, display error message
  if (error) {
    return (
      <div className="min-h-screen p-16">
        <Container size="lg" mt="lg">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text>{error}</Text>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-16">
      <Container size="lg" mt="lg">
        <Title className="text-center" my="md" style={{ color: 'white' }}>
          Events
        </Title>

        {/* Flexbox for Calendar/Event Form Layout */}
        <Box className="flex flex-col md:flex-row gap-4 justify-center items-center">
          {/* Calendar */}
          <Card
            shadow="sm"
            padding="0"
            radius="md"
            withBorder
            className="w-[400px]"
            // style={{ flex: '1', display: 'flex', alignItems: 'stretch' }}
          >
            {isAdmin && (
              <div
                style={{ padding: '16px', borderBottom: '1px solid #e0e0e0' }}
              >
                <Title
                  order={3}
                  style={{ fontSize: '1.2rem', textAlign: 'center' }}
                >
                  Select a Date:
                </Title>
              </div>
            )}
            <div className="flex-1 !w-full !h-full p-4 box-border">
              <Calendar
                calendarType="gregory"
                value={selectedDate?.toDate().toDateString()}
                onClickDay={handleDateSelection}
                tileClassName={({ date }) =>
                  selectedDate &&
                  date.toString() === selectedDate.toDate().toString()
                    ? 'selected'
                    : events.some(
                          (event) =>
                            event.date.toDate().toString() === date.toString(),
                        )
                      ? 'event-marked'
                      : ''
                }
                className="block !w-full !h-full !border-none !box-border"
                minDate={new Date()}
              />
            </div>
          </Card>

          {/* Event Form - Only visible to admins */}
          {isAdmin && (
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{ flex: '1', width: '50%' }}
            >
              <Title order={3}>
                {editingEventId ? 'Update Event' : 'Create Event'}
              </Title>
              <form onSubmit={form.onSubmit(createOrUpdateEvent)}>
                <TextInput
                  my="sm"
                  readOnly
                  required
                  label="Selected Date"
                  placeholder="Select a date from the Calendar on the left!"
                  value={
                    selectedDate
                      ? selectedDate.toDate().toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : ''
                  }
                  className="disabled pointer-events-none"
                  {...form.getInputProps('selectedDate')}
                />

                <TextInput
                  label="Event Name"
                  placeholder="Enter Event Name"
                  {...form.getInputProps('eventName')}
                  required
                />

                <TextInput
                  label="Start Time"
                  placeholder="HH:MM"
                  type="time"
                  {...form.getInputProps('startTime')}
                  required
                />

                <TextInput
                  label="End Time"
                  placeholder="HH:MM"
                  type="time"
                  {...form.getInputProps('endTime')}
                  required
                />

                <TextInput
                  label="Location"
                  placeholder="Enter Event Location"
                  {...form.getInputProps('location')}
                  required
                />

                <TextInput
                  label="Description"
                  placeholder="Enter Event Description"
                  {...form.getInputProps('description')}
                  required
                />

                <Group mt="md">
                  <Button type="submit" color="blue">
                    {editingEventId ? 'Update Event' : 'Create Event'}
                  </Button>
                </Group>
              </form>
            </Card>
          )}
        </Box>
        {/* Event List */}
        <Card shadow="sm" className="p-8" radius="md" mt="lg" withBorder>
          <Title order={3} className="mb-4">
            Event List
          </Title>
          {error ? (
            <Text className="mt-6">{error}</Text>
          ) : loading ? (
            <div className="mt-6 flex justify-center items-center h-12">
              <Loader />
            </div>
          ) : sortedEvents.length === 0 ? (
            <Text className="mt-6">
              No events available.{' '}
              {user?.customClaims.role === 'admin'
                ? 'Create an event to see it listed here.'
                : ''}
            </Text>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {sortedEvents.map((event) => (
                <Card
                  key={event._id}
                  padding="sm"
                  radius="sm"
                  className="border-2 border-sky-300 shadow-xl my-2"
                >
                  <Text>
                    <strong>Title:</strong> {event.eventName}
                  </Text>
                  <Text>
                    <strong>Date:</strong>{' '}
                    {event.date
                      ? event.date.toDate().toLocaleDateString()
                      : 'Unknown Date'}
                  </Text>
                  <Text>
                    <strong>Start Time:</strong>{' '}
                    {event.startTime
                      ? event.startTime
                          .toDate()
                          .toLocaleTimeString([], timeStringFormatting)
                      : 'Unknown Start Time'}
                  </Text>
                  <Text>
                    <strong>End Time:</strong>{' '}
                    {event.endTime
                      ? event.endTime
                          .toDate()
                          .toLocaleTimeString([], timeStringFormatting)
                      : 'Unknown End Time'}
                  </Text>
                  <Text>
                    <strong>Location:</strong> {event.location}
                  </Text>
                  <Text>
                    <strong>Description:</strong> {event.description}
                  </Text>
                  {isAdmin && (
                    <Group mt="sm">
                      <Button
                        size="xs"
                        color="yellow"
                        onClick={() => editEvent(event)}
                      >
                        Update
                      </Button>
                      <Button
                        size="xs"
                        color="red"
                        onClick={() => deleteEvent(event._id)}
                      >
                        Delete
                      </Button>
                    </Group>
                  )}
                </Card>
              ))}
            </div>
          )}
        </Card>
      </Container>
    </div>
  );
}
