'use client';

import { Container, Paper, Skeleton, Group } from '@mantine/core';

export function LoadingState() {
  return (
    <div className="min-h-screen p-16">
      <Container size="md">
        <Paper shadow="sm" radius="md" className="overflow-hidden">
          <Group className="flex justify-center items-center bg-sky-200 mb-8 p-8">
            <Skeleton height={320} className="rounded-xl" />
          </Group>
          <Group className="flex justify-center items-center bg-white mb-8 p-8">
            <Skeleton height={500} className="rounded-xl" />
          </Group>
        </Paper>
      </Container>
    </div>
  );
}
