'use client';

import { Container, Paper, Title, Text } from '@mantine/core';

export function ErrorState() {
  return (
    <Container size="md" className="min-h-screen py-16">
      <Paper shadow="sm" radius="md" className="p-8 text-center">
        <Title order={2} className="text-gray-800 mb-2">
          User Not Found
        </Title>
        <Text c="dimmed">The requested profile could not be found.</Text>
      </Paper>
    </Container>
  );
}
