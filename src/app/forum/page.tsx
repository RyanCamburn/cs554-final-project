'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Paper,
  Title,
  Select,
  TextInput,
  Button,
  Text,
  Loader,
  Group,
  Pill,
} from '@mantine/core';
import { useAuth } from '@/sessions/AuthContext';
import { notifications } from '@mantine/notifications';
import Avvvatars from 'avvvatars-react';
import { capitalize } from '@/util';

const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Consulting',
  'Manufacturing',
  'Retail',
  'Other',
] as const;

type Message = {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  role: string;
};

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  industry: string;
  role: string;
};

export default function ForumPage() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [industry, setIndustry] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (authUser) {
      fetch(`/api/users/${authUser.uid}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Fetched user data:', data); // Debugging log
          setUser(data);
          setIndustry(data.industry);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          notifications.show({
            message: 'Error fetching user data. Try again.',
            color: 'red',
          });
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [authUser]);

  useEffect(() => {
    if (industry) {
      fetch(`/api/forum/${industry}`)
        .then((response) => response.json())
        .then((data) => setMessages(data))
        .catch((error) => {
          console.error('Error fetching messages:', error);
          notifications.show({
            message: 'Error fetching messages. Try again.',
            color: 'red',
          });
        });
    }
  }, [industry]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    if (!user) {
      notifications.show({
        message: 'User not authenticated. Please log in.',
        color: 'red',
      });
      return;
    }

    console.log('User object:', user); // Debugging log

    try {
      const response = await fetch(`/api/forum/${industry}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          userName: `${user.firstName} ${user.lastName}`,
          content: newMessage,
          role: user.role,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const message: Message = await response.json();
        setMessages((prevMessages) => [...prevMessages, message]);
        setNewMessage('');
        notifications.show({
          message: 'Message sent successfully',
          color: 'green',
        });
      } else {
        const errorData = await response.json();
        console.error('Error sending message:', errorData);
        notifications.show({
          message: `Error sending message: ${errorData.error}`,
          color: 'red',
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      notifications.show({
        message: 'Error sending message. Try again.',
        color: 'red',
      });
    }
  };

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <Loader color="white" size="lg" />
      </div>
    );
  }

  // Sort messages by timestamp
  const sortedMessages = messages.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  return (
    <div className="min-h-screen p-16 bg-gray-900 flex flex-col">
      <Container size="md" className="flex-grow min-h-screen">
        <Paper
          shadow="sm"
          radius="md"
          className="overflow-hidden p-8 bg-gray-800 flex flex-col h-full"
        >
          <Title className="text-2xl font-bold text-white mb-4">Forum</Title>
          <Select
            label="Select Industry"
            placeholder="Choose an industry"
            data={INDUSTRIES.map((industry) => ({
              value: industry,
              label: industry,
            }))}
            value={industry}
            onChange={setIndustry}
            classNames={{
              input: 'custom-form-input',
              label: 'custom-form-label',
            }}
          />
          {industry && (
            <div className="flex flex-col flex-grow mt-8">
              <div className="flex-grow overflow-y-auto space-y-4">
                {sortedMessages.map((message) => (
                  <div key={message.id} className="flex items-start space-x-4">
                    <Avvvatars
                      size={40}
                      style="shape"
                      value={message.userId || 'default'}
                    />
                    <div>
                      <Group>
                        <Text className="text-white font-bold">
                          {message.userName}
                        </Text>
                        {message.role === 'admin' && (
                          <Pill size="md" className="bg-red-700 text-white">
                            Staff
                          </Pill>
                        )}
                        {message.role === 'mentor' && (
                          <Pill size="md" className="bg-blue-700 text-white">
                            {capitalize(message.role)}
                          </Pill>
                        )}
                        {message.role === 'mentee' && (
                          <Pill size="md" className="bg-sky-600 text-white">
                            {capitalize(message.role)}
                          </Pill>
                        )}
                      </Group>
                      <Text className="text-gray-400">{message.content}</Text>
                      <Text className="text-gray-500 text-sm">
                        {message.timestamp}
                      </Text>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="mt-4">
                <TextInput
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(event) => setNewMessage(event.currentTarget.value)}
                  classNames={{
                    input: 'custom-form-input',
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  className="mt-2 bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Send
                </Button>
              </div>
            </div>
          )}
        </Paper>
      </Container>
    </div>
  );
}
