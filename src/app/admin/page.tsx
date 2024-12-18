'use client';

import { Center, Text, Title } from '@mantine/core';
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
    </div>
  );
}
