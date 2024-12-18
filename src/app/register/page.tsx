'use client';

import { useState } from 'react';
import {
  isEmail,
  isNotEmpty,
  matches,
  matchesField,
  useForm,
  UseFormReturnType,
} from '@mantine/form';
import {
  Anchor,
  TextInput,
  Group,
  Button,
  PasswordInput,
  Select,
} from '@mantine/core';
import { useRouter } from 'next/navigation';

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  role: string;
  password: string;
  confirmation: string;
}

export default function Register() {
  const [error, setError] = useState('');
  const router = useRouter();

  const registrationForm: UseFormReturnType<RegisterFormValues> = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      gender: '',
      role: '',
      password: '',
      confirmation: '',
    },
    validate: {
      firstName: isNotEmpty('First Name is required'),
      lastName: isNotEmpty('Last Name is required'),
      email: isEmail('Invalid email'),
      gender: isNotEmpty('Gender is required'),
      role: isNotEmpty('Role is required'),
      password: matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        'Password must be at least 8 characters long and contain 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
      ), // Regex Credit: https://uibakery.io/regex-library/password
      confirmation: matchesField('password', "Passwords don't match"),
    },
  });

  async function handleRegistration(values: RegisterFormValues) {
    setError('');
    try {
      const { firstName, lastName, email, gender, role, password } = values;
      await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          gender,
          role,
          password,
        }),
      });
      router.push('/login');
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-white">Register</h2>
        <form
          className="mt-6"
          onSubmit={registrationForm.onSubmit((values) =>
            handleRegistration(values),
          )}
        >
          <div className="mb-4">
            <TextInput
              withAsterisk
              label="First Name"
              placeholder="John"
              {...registrationForm.getInputProps('firstName')}
              classNames={{
                input: 'custom-form-input',
                label: 'custom-form-label',
              }}
            />
          </div>
          <div className="mb-4">
            <TextInput
              withAsterisk
              label="Last Name"
              placeholder="Smith"
              {...registrationForm.getInputProps('lastName')}
              classNames={{
                input: 'custom-form-input',
                label: 'custom-form-label',
              }}
            />
          </div>
          <div className="mb-4">
            <Select
              withAsterisk
              label="Gender"
              placeholder="Male"
              data={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'non-binary', label: 'Non-binary' },
              ]}
              {...registrationForm.getInputProps('gender')}
              classNames={{
                input: 'custom-form-input',
                label: 'custom-form-label',
              }}
            />
          </div>
          <div className="mb-4">
            <Select
              withAsterisk
              label="Role"
              placeholder="Mentor"
              data={[
                { value: 'mentor', label: 'Mentor' },
                { value: 'mentee', label: 'Mentee' },
              ]}
              {...registrationForm.getInputProps('role')}
              classNames={{
                input: 'custom-form-input',
                label: 'custom-form-label',
              }}
            />
          </div>
          <div className="mb-4">
            <TextInput
              withAsterisk
              label="Email"
              placeholder="jsmith@gmail.com"
              {...registrationForm.getInputProps('email')}
              classNames={{
                input: 'custom-form-input',
                label: 'custom-form-label',
              }}
            />
          </div>
          <div className="mb-4">
            <PasswordInput
              withAsterisk
              label="Password"
              placeholder="********"
              {...registrationForm.getInputProps('password')}
              classNames={{
                input: 'custom-form-input',
                label: 'custom-form-label',
              }}
            />
          </div>
          <div className="mb-4">
            <PasswordInput
              withAsterisk
              label="Confirm Password"
              placeholder="********"
              {...registrationForm.getInputProps('confirmation')}
              classNames={{
                input: 'custom-form-input',
                label: 'custom-form-label',
              }}
            />
          </div>
          <div className="flex justify-between items-center text-sm">
            <Anchor href="/login" className="text-blue-400 hover:underline">
              Already have an account? Login here.
            </Anchor>
          </div>
          <Group mt="md">
            <Button
              type="submit"
              fullWidth
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
            >
              Submit
            </Button>
          </Group>
          {error && (
            <div className="mt-4 bg-red-200 text-red-800 p-2 rounded border border-red-400">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
