'use client';

import { Center, Title, Button, Card } from '@mantine/core';
import { CreateAnnouncement } from '@/components/CreateAnnouncement';
import DeleteUserForm from '@/components/DeleteUserForm';
import ClaimsForm from '@/components/ClaimsForm';
import { useRouter } from 'next/navigation';
import { ExternalLinkIcon } from '@radix-ui/react-icons';

export default function AdminPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen p-16 bg-gray-900">
      <Center>
        <Title className="text-4xl font-bold mb-8 text-white">
          Admin Dashboard
        </Title>
      </Center>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Announcements Section */}
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          className="bg-gray-800 text-white col-span-1"
        >
          <Title order={3} className="mb-4">
            Communication
          </Title>
          <CreateAnnouncement />
          <Button
            variant="default"
            onClick={() => router.push('/events')}
            className="mt-4"
          >
            Manage Events
            <ExternalLinkIcon className="inline-block w-4 h-4 ml-2" />
          </Button>
        </Card>

        {/* User Management Section */}
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          className="bg-gray-800 text-white col-span-2"
        >
          <Title order={3} className="mb-4">
            Promote User Role
          </Title>
          <ClaimsForm />
          <div className="my-8 border-b-2 border-white"></div>
          <Title order={3} className="mb-4">
            Delete User
          </Title>
          <DeleteUserForm />
        </Card>
      </div>
    </div>
  );
}
