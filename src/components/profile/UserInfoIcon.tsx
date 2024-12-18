import {
  EnvelopeClosedIcon,
  MobileIcon,
  ClipboardCopyIcon,
} from '@radix-ui/react-icons';
import { Group, Text, ActionIcon, Pill } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { User } from '@/data/userData';
import Avvvatars from 'avvvatars-react';

interface UserInfoIconProps {
  user: User;
}

export default function UserInfoIcon({ user }: UserInfoIconProps) {
  return (
    <div>
      <Group wrap="nowrap" className="p-16 space-x-8 bg-sky-200">
        <div className="shadow-xl rounded-full hover:shadow-2xl transition-all hover:animate-soft-bounce">
          <Avvvatars size={200} style="shape" value={user._id || 'default'} />
        </div>
        <div className="flex flex-col justify-center">
          <Text
            tt="uppercase"
            className="text-4xl font-semibold text-gray-600 mb-2"
          >
            {user.role}
          </Text>

          <Text fw={500} className="text-5xl mb-4">
            {user.firstName + ' ' + user.lastName}
          </Text>

          {user.jobTitle && (
            <div className="flex mb-3">
              <Pill size="lg" className="bg-green-600 text-white font-mono">
                {user.jobTitle || 'No Job Provided'}
              </Pill>
            </div>
          )}

          {user.company && (
            <div className="flex mb-3">
              <Pill size="lg" className="bg-red-600 text-white font-mono">
                {user.company || 'No school/company provided'}
              </Pill>
            </div>
          )}

          <div className="flex mb-6">
            <Pill size="lg" className="bg-blue-500 text-white font-mono">
              {user.industry || 'No industry provided'}
            </Pill>
          </div>

          <Group wrap="nowrap" className="mb-2">
            <EnvelopeClosedIcon className="w-10 h-10 p-2" />
            <Text className="text-lg text-gray-600 font-semibold">
              {user.email}
            </Text>
            <ActionIcon
              variant="subtle"
              onClick={() => {
                navigator.clipboard.writeText(user.email);
                notifications.show({
                  message: 'Email copied to clipboard',
                  color: 'blue',
                });
              }}
            >
              <ClipboardCopyIcon className="w-6 h-6 text-purple-700" />
            </ActionIcon>
          </Group>

          {user.phoneNumber && (
            <Group wrap="nowrap">
              <MobileIcon className="w-10 h-10 p-1" />
              <Text className="text-lg text-gray-600 font-semibold">
                {user.phoneNumber || 'No phone number provided'}
              </Text>
              {user.phoneNumber && (
                <ActionIcon
                  variant="subtle"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      user.phoneNumber || 'No phone number provided',
                    );
                    notifications.show({
                      message: 'Phone number copied to clipboard',
                      color: 'blue',
                    });
                  }}
                >
                  <ClipboardCopyIcon className="w-6 h-6 text-purple-700" />
                </ActionIcon>
              )}
            </Group>
          )}
        </div>
      </Group>
    </div>
  );
}
