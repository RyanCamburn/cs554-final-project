'use client';

import { Container, Paper, Skeleton } from '@mantine/core';

export function LoadingState() {
  return (
    <Container size="md" className="min-h-screen p-16">
      <Paper shadow="sm" radius="md" className="p-8">
        <Skeleton height={340} className="mb-8" />
        <Skeleton height={200} className="mb-2" />
      </Paper>
    </Container>
  );
}
