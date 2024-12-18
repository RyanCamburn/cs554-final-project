'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Container, Paper } from '@mantine/core';
import { User } from '@/data/userData';
import MentorshipTree from '@/components/profile/MentorshipTree';
import { LoadingState } from '@/components/profile/LoadingState';
import { ErrorState } from '@/components/profile/ErrorState';
import UserInfoIcon from '@/components/profile/UserInfoIcon';

export default function UserProfilePage() {
  const { id } = useParams() as { id: string };
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Simulated user data
        const response = await fetch(`/api/users/${id}`);
        const userData: User = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <LoadingState />;
  if (!user) return <ErrorState />;

  return (
    <div className="min-h-screen p-16">
      <Container size="md">
        <Paper shadow="sm" radius="md" className="overflow-hidden">
          <UserInfoIcon user={user} />
          <MentorshipTree user={user} groupMembers={user.groupMembers} />
        </Paper>
      </Container>
    </div>
  );
}
