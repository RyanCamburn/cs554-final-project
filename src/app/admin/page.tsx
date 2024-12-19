'use client';

import { Center, Title } from '@mantine/core';
import { CreateAnnouncement } from '@/components/CreateAnnouncement';
import DeleteUserForm from '@/components/DeleteUserForm';
import ClaimsForm from '@/components/ClaimsForm';

export default function AdminPage() {
  return (
    <div className="min-h-screen p-16">
      <Center>
        <Title className="text-4xl font-bold mb-2 justify-center pb-8 text-white">
          Admin Dashboard
        </Title>
      </Center>
      <Center>
        <CreateAnnouncement />
        <ClaimsForm />
        <DeleteUserForm />
      </Center>
    </div>
  );
}
