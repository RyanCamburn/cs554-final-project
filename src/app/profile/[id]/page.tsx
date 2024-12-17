'use client';
import React from 'react';
import { useParams } from 'next/navigation';

const PublicProfile = () => {
  const { id } = useParams() as { id: string };

  return (
    <div className="min-h-screen text-white p-12">
      PublicProfile for user with id: {id}
    </div>
  );
};

export default PublicProfile;
