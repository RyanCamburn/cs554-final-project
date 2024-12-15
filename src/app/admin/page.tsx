'use client';

// TODO: Only let admins access this page
import { useAuth } from '@/sessions/AuthContext';

export default function AdminPage() {
  const { user } = useAuth();
  const isAdmin = user && user.customClaims.role === 'admin';
  if (!user || !isAdmin) {
    return (
      <div>
        <h1 className="text-white">You are not an admin</h1>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-white">Admin Page</h1>
    </div>
  );
}
