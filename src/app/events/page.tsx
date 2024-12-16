'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
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
  Alert,
  Box,
} from '@mantine/core';
import { useForm, isNotEmpty } from '@mantine/form';

type EventFormValues = {
  eventName: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
};

type Event = EventFormValues & {
  id: number;
  date: Date;
};

export default function EventsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);

  const form = useForm<EventFormValues>({
    initialValues: {
      eventName: '',
      startTime: '',
      endTime: '',
      location: '',
      description: '',
    },
    validate: {
      eventName: isNotEmpty('Event name must not be empty'),
      startTime: isNotEmpty('Start time must not be empty'),
      endTime: isNotEmpty('End time must not be empty'),
      location: isNotEmpty('Location must not be empty'),
      description: isNotEmpty('Description must not be empty'),
    },
  });

  //   useEffect(() => {
  //     const fetchEvents = async () => {
  //       try {
  //         const querySnapshot = await getDocs(collection(db, "events"));
  //         const fetchedEvents = querySnapshot.docs.map((doc) => ({
  //           id: doc.id,
  //           ...doc.data(),
  //           date: new Date(doc.data().date), // Convert ISO string to Date
  //         }));
  //         setEvents(fetchedEvents);
  //       } catch (error) {
  //         console.error("Error fetching events: ", error);
  //       }
  //     };

  //     fetchEvents();
  //   }, []);

  const CreateOrUpdateEvent = (values: EventFormValues) => {
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
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === editingEventId
            ? { ...event, ...values, date: selectedDate }
            : event,
        ),
      );
      setEditingEventId(null);
    } else {
      // Create a new event
      const newEvent: Event = {
        id: new Date().getTime(),
        date: selectedDate,
        ...values,
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    }

    form.reset();
  };

  const DeleteEvent = (eventId: number) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== eventId),
    );
  };

  const EditEvent = (event: Event) => {
    setEditingEventId(event.id);
    setSelectedDate(event.date);
    form.setValues({
      eventName: event.eventName,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      description: event.description,
    });
  };

  const sortedEvents = events.sort((a, b) => {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    return a.startTime.localeCompare(b.startTime);
  });

  return (
    <Container size="lg" mt="lg">
      <Title align="center" my="md" style={{ color: 'white' }}>
        Events
      </Title>

      {/* Flexbox for Side-by-Side Layout */}
      <Box style={{ display: 'flex', gap: '20px', alignItems: 'stretch' }}>
        {/* Calendar */}
        <Card
          shadow="sm"
          padding="0" /* Keep padding at 0 to control it explicitly */
          radius="md"
          withBorder
          style={{ flex: '1', display: 'flex', alignItems: 'stretch' }}
        >
          <div style={{ padding: '16px', borderBottom: '1px solid #e0e0e0' }}>
            <Title
              order={3}
              style={{ fontSize: '1.2rem', textAlign: 'center' }}
            >
              Select a Date:
            </Title>
          </div>
          <div
            style={{
              flex: '1',
              width: '100%',
              height: '100%',
              padding:
                '20px' /* Add padding to create space around the calendar */,
              boxSizing: 'border-box',
            }}
          >
            <Calendar
              value={selectedDate}
              onClickDay={setSelectedDate}
              tileClassName={({ date }) =>
                selectedDate &&
                date.toDateString() === selectedDate.toDateString()
                  ? 'selected'
                  : events.some(
                        (event) =>
                          event.date.toDateString() === date.toDateString(),
                      )
                    ? 'event-marked'
                    : ''
              }
              className="full-calendar"
            />
          </div>
        </Card>

        {/* Event Form */}
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
          <form onSubmit={form.onSubmit(CreateOrUpdateEvent)}>
            <Text my="sm">
              Selected Date:{' '}
              {selectedDate ? selectedDate.toDateString() : 'None'}
            </Text>

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

            <Group position="right" mt="md">
              <Button type="submit" color="blue">
                {editingEventId ? 'Update Event' : 'Create Event'}
              </Button>
            </Group>
          </form>
        </Card>
      </Box>

      {/* Event List */}
      <Card shadow="sm" padding="lg" radius="md" mt="lg" withBorder>
        <Title order={3}>Event List</Title>
        {sortedEvents.length === 0 ? (
          <Text>
            No events available. Create an event to see it listed here.
          </Text>
        ) : (
          sortedEvents.map((event) => (
            <Card
              shadow="xs"
              key={event.id}
              my="md"
              padding="sm"
              radius="sm"
              withBorder
            >
              <Text>
                <strong>Title:</strong> {event.eventName}
              </Text>
              <Text>
                <strong>Date:</strong> {event.date.toDateString()}
              </Text>
              <Text>
                <strong>Start Time:</strong> {event.startTime}
              </Text>
              <Text>
                <strong>End Time:</strong> {event.endTime}
              </Text>
              <Text>
                <strong>Location:</strong> {event.location}
              </Text>
              <Text>
                <strong>Description:</strong> {event.description}
              </Text>
              <Group position="right" mt="sm">
                <Button
                  size="xs"
                  color="yellow"
                  onClick={() => EditEvent(event)}
                >
                  Update
                </Button>
                <Button
                  size="xs"
                  color="red"
                  onClick={() => DeleteEvent(event.id)}
                >
                  Delete
                </Button>
              </Group>
            </Card>
          ))
        )}
      </Card>
    </Container>
  );
}
