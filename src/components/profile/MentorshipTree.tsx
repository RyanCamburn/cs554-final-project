'use client';

import { useState, useMemo } from 'react';
import { Paper } from '@mantine/core';
import { User } from '@/data/userData';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import UserNode from './UserNode';
import { ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// This file is a WIP implementation of the tree diagram for the mentorship relations
interface MentorshipTreeProps {
  user: User;
  assignees?: string[];
}

export const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Mentor' },
    position: { x: 0, y: 0 },
  },
  {
    id: '2',
    data: { label: 'Mentee 1' },
    position: { x: -100, y: 100 },
  },
  {
    id: '3',
    data: { label: 'Mentee 2' },
    position: { x: 100, y: 100 },
  },
];

export const initialEdges = [
  { id: 'e12', source: '1', target: '2' },
  { id: 'e13', source: '1', target: '3' },
];

export default function MentorshipTree({
  user,
  assignees,
}: MentorshipTreeProps) {
  const [mentees, setMentees] = useState<User[] | null>(null);
  const router = useRouter();
  const nodeTypes = useMemo(() => ({ userNode: UserNode }), []);

  useEffect(() => {
    if (!assignees) return;

    const fetchMentees = async () => {
      const assigneeData: User[] = await Promise.all(
        assignees.map(async (id) => {
          const response = await fetch(`/api/users/${id}`);
          return response.json();
        }),
      );
      setMentees(assigneeData);
    };

    fetchMentees();
  }, [assignees]);

  if (!assignees) {
    return (
      <Paper shadow="sm" className="p-8 text-center">
        No mentees or mentor to share.
      </Paper>
    );
  }
  const handleUserClick = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  return (
    <div className="p-16 relative">
      {/* Attempt 1 : Using React Flow */}
      <div className="h-64 border-2 border-gray-300 rounded-lg">
        <ReactFlow
          nodes={initialNodes}
          edges={initialEdges}
          fitView
          nodeTypes={nodeTypes}
        />
      </div>

      {/* Attemp 2 : Manually displaying tree-like diagram*/}
      {/* Mentor Node */}
      <div className="flex justify-center mb-8">
        <Paper
          className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${
            user._id ? 'border-2 border-blue-500' : ''
          }`}
          onClick={() => handleUserClick(user._id || '')}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="text-xs uppercase text-gray-500">Mentor</div>
            <div className="text-sm font-medium">
              {user.firstName} {user.lastName}
            </div>
          </div>
        </Paper>
      </div>

      {assignees.length > 0 && (
        <>
          {/* Mentees */}
          <div className="flex justify-center gap-8 mt-8">
            {mentees &&
              mentees.map((mentee) => (
                <Paper
                  key={mentee._id}
                  className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${
                    mentee._id ? 'border-2 border-blue-500' : ''
                  }`}
                  onClick={() => handleUserClick(mentee._id || 'Error')}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-xs uppercase text-gray-500">
                      Mentee
                    </div>
                    <div className="text-sm font-medium">
                      {mentee.firstName} {mentee.lastName}
                    </div>
                  </div>
                </Paper>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
