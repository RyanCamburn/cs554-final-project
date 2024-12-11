import { Title, Text, Button, Group } from '@mantine/core';
import Link from 'next/link';

export default function Home() {
  // TODO: Show user information from the session here
  // TODO: Write tests?
  return (
    <div className="min-h-screen p-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-white to-sky-200 text-black py-20 rounded-xl p-4">
        <div className="max-w-2xl px-10">
          <Title order={1} className="text-4xl md:text-5xl font-bold mb-6">
            Find Your Perfect Mentor Match
          </Title>
          <Text size="xl" className="mb-8">
            Connect with experienced professionals who can guide you through
            your career journey.
          </Text>
          <Group>
            <Link href="/register">
              <Button size="lg" variant="filled" color="dark">
                Get Started
              </Button>
            </Link>
          </Group>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-sm border">
            <Title order={3} className="text-xl font-semibold mb-4">
              Seamless Authentication
            </Title>
            <Text c="dimmed">
              Easily register and log in with role-based access for mentors,
              mentees, and admins.
            </Text>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm border">
            <Title order={3} className="text-xl font-semibold mb-4">
              Announcements & Updates
            </Title>
            <Text c="dimmed">
              Stay informed with important updates, announcements, and
              notifications from admins.
            </Text>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm border">
            <Title order={3} className="text-xl font-semibold mb-4">
              Mentor/Mentee Directory
            </Title>
            <Text c="dimmed">
              Search and view profiles of all mentors and mentees to enhance
              communication and networking.
            </Text>
          </div>
        </div>
      </section>
    </div>
  );
}
