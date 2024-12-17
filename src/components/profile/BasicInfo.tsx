'use client';

import { Title, Group, Badge } from '@mantine/core';

interface BasicInfoProps {
  firstName: string;
  lastName: string;
  role: string;
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
