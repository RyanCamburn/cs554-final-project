'use client';

import { Container, Text } from '@mantine/core';
import Link from 'next/link';
import { links } from './Navbar';

function Footer() {
  return (
    <footer className="bg-gray-700 text-white">
      <Container size="lg" className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Text size="lg" fw={700} className="mb-4">
              <Link href="/">MentorMatch</Link>
            </Text>
            <Text size="sm">
              Connecting mentors and mentees for meaningful professional
              relationships.
            </Text>
          </div>

          <div>
            <Text size="sm" fw={700} className="mb-4">
              Navigation
            </Text>
            <div className="space-y-2">
              {links.map((link) => {
                return (
                  <Link
                    key={link.link}
                    href={link.link}
                    className="block text-sm text-gray-50 hover:text-blue-400"
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <Text size="sm" fw={700} className="mb-4">
              Legal
            </Text>
            <div className="space-y-2">
              <Link
                href="/privacy"
                className="block text-sm text-gray-50 hover:text-blue-400"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="block text-sm text-gray-50 hover:text-blue-400"
              >
                Terms of Service
              </Link>
            </div>
          </div>

          <div>
            <Text size="sm" fw={700} className="mb-4">
              Contact
            </Text>
            <Text size="sm" className="text-gray-50">
              Email: support@mentormatch.edu
            </Text>
            <Text size="sm" className="text-gray-50">
              Phone: (123) 456-7890
            </Text>
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <Text size="sm" c="dimmed">
            © 2024 MentorMatch. All rights reserved.
          </Text>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
