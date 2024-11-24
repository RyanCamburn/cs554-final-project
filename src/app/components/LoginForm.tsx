import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from '@mantine/core';
import { useState } from 'react';
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/client-config";

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loginWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

  const handleLogin = async () => {
    try {
      // FIXME: is react-firebase-hooks safe?
      const response = await loginWithEmailAndPassword(email, password);
      if (response?.user) {
        const token = await response.user.getIdToken();
        await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: token }),
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  return (
    <Container size={420} my={40}>
      <Title ta="center" className="font-greycliff font-extrabold">
        Welcome back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{' '}
        <Anchor size="sm" component="button">
          Create account
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md" className="bg-gray-800 border-black">
        <TextInput label="Email" placeholder="you@mantine.dev" onChange={(event) => setEmail(event.currentTarget.value)} required />
        <PasswordInput label="Password" placeholder="Your password" onChange={(event) => setPassword(event.currentTarget.value)}required mt="md" />
        <Group justify="space-between" mt="lg">
          <Checkbox label="Remember me" />
          <Anchor component="button" size="sm">
            Forgot password?
          </Anchor>
        </Group>
        <Button fullWidth mt="xl" onClick={() => handleLogin()}>
          Sign in
        </Button>
      </Paper>
    </Container>
  );
}