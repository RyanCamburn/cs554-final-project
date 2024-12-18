import { useEffect, useState } from 'react';
import { User } from '@/data/userData';
import { isNotEmpty, useForm, UseFormReturnType } from '@mantine/form';
import { Button, Select } from '@mantine/core';
import { notifications } from '@mantine/notifications';

// This component allows admins to elevate a user's role by setting custom claims
interface ClaimFormValues {
  uid: string,
  role: string,
}

export default function ClaimsForm() {
  const [users, setUsers] = useState<User[]>([]);

  // Retrieve and than map over users for seleciton
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/users');
        const users = await response.json();
        setUsers(users);
      } catch (e) {
        console.error(e);
      }
    };
    fetchUser();
  }, []);

  // Since user data is constrained to the Select Component minimal validaiton is needed
  const claimForm: UseFormReturnType<ClaimFormValues> = useForm({
    initialValues: {
      uid: '',
      role: '',
    },
    validate: {
      uid: isNotEmpty('User ID is required'),
      role: isNotEmpty('Role is required'),
    }
  });

  const handleClaimSubmit = async (values: { uid: string, role: string }) => {
    const response = await fetch('/api/admin/claims', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "uid": values.uid,
        "claims": { role: values.role },
      }),
    });

    if (response.ok) {
      notifications.show({
        message: 'User Claims Set Successfully',
        color: 'green',
      });
    } else {
      notifications.show({
        message: 'Failed to set user claims',
        color: 'red',
      });
    }
  };

  return (
    <form onSubmit={claimForm.onSubmit((values) =>
      handleClaimSubmit(values),
    )}>
      <Select
        label="User"
        placeholder="Select a user"
        required
        searchable
        {...claimForm.getInputProps('uid')}
        data={users
          .filter((user) => user._id)
          .map((user) => ({
            value: user._id as string,
            label: `${user.firstName} ${user.lastName} (${user.role})`, // i.e "John Smith (mentor)"
          }))}
      />
      <Select
        label="Role"
        placeholder="Select a role"
        required
        data={[{ value: 'admin', label: 'Admin' }, { value: 'mentor', label: 'Mentor' }, { value: 'mentee', label: 'Mentee' }]}
        {...claimForm.getInputProps('role')}
      />
      <Button type="submit" color="blue">
        Set User Claims
      </Button>
    </form>
  )
}