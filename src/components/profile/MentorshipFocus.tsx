'use client';

import { Title, Badge, Group } from '@mantine/core';

interface MentorshipFocusProps {
  assignees: string[];
}

export function MentorshipFocus({ assignees }: MentorshipFocusProps) {
  if (!assignees?.length) return null;

  return (
    <div>
      <Title order={3} className="text-lg font-semibold mb-3">
        Mentorship Focus
      </Title>
      <Group gap="xs">
        {assignees.map((assignee) => (
          <Badge key={assignee} variant="outline">
            {assignee}
          </Badge>
        ))}
      </Group>
    </div>
  );
}
