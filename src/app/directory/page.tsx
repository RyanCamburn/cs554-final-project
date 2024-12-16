'use client';
import { useEffect, useState } from 'react';
import { User } from '@/data/userData';
import { Title, Paper, Text, Box, LoadingOverlay } from '@mantine/core';
import DirectoryTable from '@/components/DirectoryTable';

const Directory = () => {
  const [users, setUsers] = useState<User[]>([]);

  // Get all users from the database
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/users');
        const users = await response.json();
        setUsers(users);
      } catch (e) {
        console.error(e);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center text-white p-16">
      <div className="text-white mb-8 max-w-6xl w-full">
        <Title order={1} className="text-2xl font-bold mb-2">
          Directory
        </Title>
        <Text c="dimmed">View other mentees and mentors in our community!</Text>
      </div>

      <Paper
        shadow="sm"
        p="xl"
        className="max-w-6xl w-full rounded-xl text-black"
      >
        <Box pos="relative">
          <LoadingOverlay
            visible={!users || users.length === 0}
            zIndex={1000}
            overlayProps={{ radius: 'sm', blur: 2 }}
          />
          {users && users.length !== 0 && <DirectoryTable data={users} />}
        </Box>
      </Paper>
    </div>
  );
};

export default Directory;
