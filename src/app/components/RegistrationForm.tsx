import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
} from '@mantine/core';
import React, { useState }from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";

export function RegistrationForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);

  const handleRegister = async () => {
    try {
      const res = await createUserWithEmailAndPassword(email, password);
      console.log(res);
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Container size={420} my={40}>
      <Title ta="center" className="font-greycliff font-extrabold">
        Create an account
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md" className="bg-gray-800 border-black">
        <TextInput label="Email" placeholder="you@mantine.dev" required onChange={(event) => setEmail(event.currentTarget.value)}/>
        <PasswordInput label="Password" placeholder="Your password" required mt="md" onChange={(event) => setPassword(event.currentTarget.value)} />
        <Button fullWidth mt="xl" onClick={() => handleRegister()}>
          Register
        </Button>
      </Paper>
    </Container>
  );
}