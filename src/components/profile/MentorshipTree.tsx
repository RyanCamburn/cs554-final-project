'use client';

import { useState } from 'react';
import { Paper, Title } from '@mantine/core';
import { User } from '@/data/userData';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ArcherContainer, ArcherElement } from 'react-archer';
import UserNode from './UserNode';

interface MentorshipTreeProps {
  user: User;
  groupMembers?: string[];
}

export default function MentorshipTree({
  user,
  groupMembers,
}: MentorshipTreeProps) {
  const [mentor, setMentor] = useState<User | null | undefined>(null);
  const [mentees, setMentees] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!groupMembers) return;

    const fetchUsersInPool = async () => {
      const userPoolData: User[] = await Promise.all(
        groupMembers.map(async (id: string) => {
          const response = await fetch(`/api/users/${id}`);
          return response.json();
        }),
      );

      // Check if user already exists in the pool - edge case this would mean we messed up updating groupMembers
      const userExists = userPoolData.some((u) => u._id === user._id);
      if (!userExists) {
        userPoolData.push(user);
      }

      const mentor: User | undefined =
        user.role === 'mentor'
          ? user
          : userPoolData.find((a) => a.role === 'mentor');
      const mentees = userPoolData.filter((a) => a.role === 'mentee');

      setMentor(mentor);
      setMentees(mentees);
    };

    fetchUsersInPool();
  }, [groupMembers, user]);

  const handleUserClick = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  if (!groupMembers || groupMembers.length === 0) {
    return (
      <Paper shadow="sm" className="p-8 text-center">
        No mentees or mentor to share.
      </Paper>
    );
  }

  return (
    <div className="px-16 pb-16 pt-8 relative">
      <Title className="text-center pb-8">Mentorship Group</Title>
      <ArcherContainer strokeColor="red">
        {/* Mentor Node */}
        {mentor && (
          <div className="flex justify-center mb-24">
            <ArcherElement
              id="mentor"
              relations={mentees.map((mentee) => ({
                targetId: mentee._id || 'mentor_id',
                targetAnchor: 'top',
                sourceAnchor: 'bottom',
                style: {
                  strokeColor: 'black',
                  strokeDasharray: 'none',
                  endShape: {
                    circle: {
                      radius: 2,
                      strokeColor: 'black',
                      fillColor: 'black',
                    },
                  },
                },
              }))}
            >
              <div
                className={`p-4 rounded-xl border-2 ${
                  mentor._id === user._id
                    ? 'border-blue-300'
                    : 'border-gray-300 cursor-pointer hover:shadow-md transition-shadow'
                }`}
                onClick={() => handleUserClick(mentor._id || '')}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="uppercase text-gray-500">Mentor</div>
                  <UserNode user={mentor} />
                </div>
              </div>
            </ArcherElement>
          </div>
        )}

        {/* Mentees */}
        <div className="flex justify-center gap-8 mt-8">
          {mentees.map((mentee, i) => (
            <ArcherElement key={mentee._id} id={mentee._id || `mentee_${i}`}>
              <div
                className={`p-4 rounded-xl border-2 ${
                  mentee._id === user._id
                    ? 'border-blue-300'
                    : 'border-gray-300 cursor-pointer hover:shadow-md transition-shadow'
                }`}
                onClick={() => handleUserClick(mentee._id || '')}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="uppercase text-gray-500">Mentee</div>
                  <UserNode user={mentee} />
                </div>
              </div>
            </ArcherElement>
          ))}
        </div>
      </ArcherContainer>
    </div>
  );
}
