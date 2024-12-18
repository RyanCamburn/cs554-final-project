'use client';

import { Title, Group, Badge } from '@mantine/core';
import type { User } from '@/data/userData';

interface BasicInfoProps {
  firstName: string;
  lastName: string;
  role: User['role'];
  industry?: string;
}

export function BasicInfo({
  firstName,
  lastName,
  role,
  industry,
}: BasicInfoProps) {
  return (
    <div>
      <Title order={1} className="text-2xl font-bold capitalize">
        {firstName} {lastName}
      </Title>
      <Group gap="xs" className="mt-2">
        <Badge size="lg" className="bg-blue-600 capitalize">
          {role}
        </Badge>
        {industry && (
          <Badge size="lg" variant="outline">
            {industry}
          </Badge>
        )}
      </Group>
    </div>
  );
}
