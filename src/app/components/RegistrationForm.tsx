import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
} from '@mantine/core';

export function RegistrationForm() {
  return (
    <Container size={420} my={40}>
      <Title ta="center" className="font-greycliff font-extrabold">
        Create an account
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md" className="bg-gray-800 border-black">
        <TextInput label="Email" placeholder="you@mantine.dev" required />
        <PasswordInput label="Password" placeholder="Your password" required mt="md" />
        <Button fullWidth mt="xl">
          Register
        </Button>
      </Paper>
    </Container>
  );
}