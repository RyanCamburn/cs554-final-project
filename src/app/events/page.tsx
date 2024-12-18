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
} from '@mantine/core';
import { useForm, isNotEmpty } from '@mantine/form';

interface EventFormValues {
  eventName: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
}

interface Event extends EventFormValues {
  id: number;
  date: Date;
}

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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        const events = await response.json();
        setEvents(events);
      } catch (e) {
        console.error(e);
      }
    };
    fetchEvents();
    console.log(fetchEvents());
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
          id: editingEventId,
          date: selectedDate.toISOString(),
          ...values,
        }),
      });

      if (response.ok) {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === editingEventId
              ? { ...event, date: new Date(selectedDate), ...values }
              : event,
          ),
        );
        setEditingEventId(null);
      } else {
        console.error('Failed to update event');
      }
    } else {
      // Create a new event
      const response = await fetch('/api/events/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate.toISOString(),
          ...values,
        }),
      });

      if (response.ok) {
        const { id } = await response.json();
        const newEvent: Event = {
          id,
          date: new Date(selectedDate),
          ...values,
        };
        setEvents((prevEvents) => [...prevEvents, newEvent]);
      } else {
        console.error('Failed to create event');
      }
    }

    form.reset();
  };

  const deleteEvent = async (eventId: number) => {
    const response = await fetch('/api/events/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: eventId }),
    });

    if (response.ok) {
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId),
      );
    } else {
      console.error('Failed to delete event');
    }
  };

  const editEvent = (event: Event) => {
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
    <div className="min-h-screen p-16">
      <Container size="lg" mt="lg">
        <Title className="text-center" my="md" style={{ color: 'white' }}>
          Events
        </Title>

        {/* Flexbox for Calendar/Event Form Layout */}
        <Box style={{ display: 'flex', gap: '20px', alignItems: 'stretch' }}>
          {/* Calendar */}
          <Card
            shadow="sm"
            padding="0"
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
                padding: '20px',
                boxSizing: 'border-box',
              }}
            >
              <Calendar
                value={selectedDate}
                onClickDay={setSelectedDate}
                tileClassName={({ date }) =>
                  selectedDate && date.toString() === selectedDate.toString()
                    ? 'selected'
                    : events.some(
                          (event) => event.date.toString() === date.toString(),
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
            <form onSubmit={form.onSubmit(createOrUpdateEvent)}>
              <Text my="sm">
                {selectedDate instanceof Date
                  ? selectedDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : selectedDate
                    ? new Date(selectedDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'None'}
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
              <Group mt="md">
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
                  <strong>Date:</strong> {event.date.toString()}
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
                    onClick={() => deleteEvent(event.id)}
                  >
                    Delete
                  </Button>
                </Group>
              </Card>
            ))
          )}
        </Card>
      </Container>
    </div>
  );
}
