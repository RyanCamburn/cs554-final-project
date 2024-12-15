'use client';

import { useAuth } from '../../sessions/AuthContext';

export default function Profile() {
  const user = useAuth();
  console.log(user);

  return <h1>This is my profile page</h1>;
}
