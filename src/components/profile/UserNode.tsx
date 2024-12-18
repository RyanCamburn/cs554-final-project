import { Group, Text } from '@mantine/core';
import { User } from '@/data/userData';
import Avvvatars from 'avvvatars-react';

interface UserNodeProps {
  user: User;
}

export default function UserNode({ user }: UserNodeProps) {
  if (!user) {
    return null;
  }

  return (
    <Group gap="sm">
      <div className="shadow-xl rounded-full">
        <Avvvatars size={40} style="shape" value={user._id || 'default'} />
      </div>
      <div>
        <Text fw={500}>{`${user.firstName} ${user.lastName}`}</Text>
        <Text c="dimmed">{user.email}</Text>
      </div>
    </Group>
  );
}
