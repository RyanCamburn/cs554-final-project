'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Burger, Group, Paper, Transition } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { GearIcon } from '@radix-ui/react-icons';
import LogoutButton from './LogoutButton';
import { useAuth } from '@/sessions/AuthContext';

export const links = [
  { link: '/about', label: 'About' },
  { link: '/directory', label: 'Directory' },
  { link: '/profile', label: 'Profile' },
  { link: '/announcements', label: 'Announcements' },
];

// reference: https://ui.mantine.dev/category/headers/#header-simple
function Navbar() {
  const pathname = usePathname();
  const [opened, { toggle }] = useDisclosure(false);
  const { user } = useAuth();

  return (
    <header className="h-20 fixed w-full bg-gray-700 z-50 text-white shadow-md flex items-center justify-between px-10">
      <Link href="/" className="text-2xl font-bold">
        MentorMatch
      </Link>

      {/* Desktop Navigation */}
      <Group gap={10} className="hidden md:flex">
        {links.map((link) => (
          <Link
            key={link.link}
            href={link.link}
            className="px-2 py-1 rounded-md transition-colors text-white hover:bg-gray-100 hover:text-gray-800"
          >
            {link.label}
          </Link>
        ))}
        {user?.customClaims?.role === 'admin' && (
          <Link
            href={'/admin'}
            className="px-2 py-1 rounded-md transition-colors text-white hover:bg-gray-100 hover:text-gray-800"
          >
            Admin
          </Link>
        )}
        <Link
          href={'/settings'}
          className="px-2 py-2 rounded-full transition-colors text-white hover:bg-gray-100 hover:text-gray-800"
        >
          <GearIcon className="w-6 h-6" />
        </Link>
        <LogoutButton />
      </Group>

      {/* Mobile Navigation */}
      <Burger
        opened={opened}
        onClick={toggle}
        color="white"
        className="md:hidden"
      />

      {/* Mobile Menu */}
      <Transition transition="pop-top-right" duration={200} mounted={opened}>
        {(styles) => (
          <Paper
            className="absolute top-full left-0 right-0 border-b border-gray-200 md:hidden"
            style={styles}
          >
            <div className="p-4 space-y-2">
              {links.map((link) => (
                <Link
                  key={link.link}
                  href={link.link}
                  className={`block px-3 py-2 rounded-md transition-colors ${
                    pathname === link.link
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => toggle()}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </Paper>
        )}
      </Transition>
    </header>
  );
}

export default Navbar;
