'use client';

import { isEmail, isNotEmpty, useForm } from '@mantine/form';
import {
  TextInput,
  Select,
  Button,
  Paper,
  Title,
  Text,
  Grid,
  Input,
} from '@mantine/core';
import { IMaskInput } from 'react-imask';
import { notifications } from '@mantine/notifications';

// const ROLES = ["Admin", "Mentor", "Mentee"] as const;
// const PERMISSIONS = ["all", "announcements", "matching"] as const;
const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'] as const;
const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Consulting',
  'Manufacturing',
  'Retail',
  'Other',
] as const;

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: (typeof GENDERS)[number];
  industry: (typeof INDUSTRIES)[number] | '';
  // role: (typeof ROLES)[number];
  // permissions: (typeof PERMISSIONS)[number];
};

export default function ProfilePage() {
  // TODO: get user information from the session - using example data for now
  const currentUser: FormValues = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@email.com',
    phoneNumber: '+1 (123) 456-7890',
    gender: 'Male',
    industry: 'Technology',
  };

  const form = useForm<FormValues>({
    initialValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      phoneNumber: currentUser.phoneNumber,
      gender: currentUser.gender,
      industry: currentUser.industry,
      // role: "Mentee",
      // permissions: "announcements",
    },
    validate: {
      firstName: isNotEmpty('First name must not be empty'),
      lastName: isNotEmpty('Last name must not be empty'),
      email: isEmail('Invalid email'),
      phoneNumber: (value) =>
        value.length < 10 ? 'Phone number must have at least 10 digits' : null,
      industry: isNotEmpty('Industry must not be empty'),
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      console.log('Form values:', values);
      const response = await fetch('/api/users/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: '', //TODO: get user id from session
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          gender: values.gender,
          industry: values.industry,
        }),
      });
      const data = await response.json();
      console.log('Update response:', data);
      if (response.ok) {
        notifications.show({
          message: 'Successfully updated profile',
          color: 'green',
        });
      } else {
        notifications.show({
          message: 'Error updating profile. Try again.',
          color: 'red',
        });
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      notifications.show({
        message: 'Error updating profile. Try again.',
        color: 'red',
      });
    }
  };

  return (
    <div className="min-h-screen py-12 flex flex-col justify-center items-center">
      {/* Header Section */}
      <div className="text-white px-8 mb-8 max-w-3xl w-full">
        <Title order={1} className="text-2xl font-bold mb-2">
          Profile Settings
        </Title>
        <Text c="dimmed">Manage your account information and preferences</Text>
      </div>

      {/* Form Section */}
      <div className="w-full flex justify-center items-center px-4">
        <Paper shadow="sm" p="xl" className="max-w-3xl w-full rounded-xl">
          <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-8">
            {/* Personal Information */}
            <div>
              <Title order={3} className="text-lg font-semibold mb-4">
                Personal Information
              </Title>
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="First Name"
                    placeholder="Enter your first name"
                    {...form.getInputProps('firstName')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Last Name"
                    placeholder="Enter your last name"
                    {...form.getInputProps('lastName')}
                  />
                </Grid.Col>
              </Grid>
            </div>

            {/* Contact Information */}
            <div>
              <Title order={3} className="text-lg font-semibold mb-4">
                Contact Information
              </Title>
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Email"
                    placeholder="username@domain.edu"
                    {...form.getInputProps('email')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Input.Wrapper label="Phone Number">
                    <Input
                      component={IMaskInput}
                      mask="+1 (000) 000-0000"
                      type="tel"
                      placeholder="Phone number"
                      {...form.getInputProps('phoneNumber')}
                    />
                  </Input.Wrapper>
                </Grid.Col>
              </Grid>
            </div>

            {/* Profile Details */}
            <div>
              <Title order={3} className="text-lg font-semibold mb-4">
                Profile Details
              </Title>
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Gender"
                    data={GENDERS}
                    {...form.getInputProps('gender')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Industry"
                    data={INDUSTRIES}
                    placeholder="Select your industry"
                    {...form.getInputProps('industry')}
                    searchable
                  />
                </Grid.Col>
              </Grid>
            </div>

            {/* TODO: Role & Permissions Section - used by admin? */}
            {/* <div>
							<Title order={3} className="text-lg font-semibold mb-4">
								Role & Permissions
							</Title>
							<Grid>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Select
										label="Role"
										data={ROLES}
										{...form.getInputProps("role")}
									/>
								</Grid.Col>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Select
										label="Permissions"
										data={PERMISSIONS}
										{...form.getInputProps("permissions")}
									/>
								</Grid.Col>
							</Grid>
						</div> */}

            <Button
              type="submit"
              fullWidth
              size="md"
              className="bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Update Profile
            </Button>
          </form>
        </Paper>
      </div>
    </div>
  );
}
