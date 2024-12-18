'use client';

import DeleteUserForm from '@/components/DeleteUserForm';
import ClaimsForm from '@/components/ClaimsForm';

export default function AdminPage() {
  return (
    <div>
      <DeleteUserForm />
      <ClaimsForm />
    </div>
  );
}
