"use client";

import { useState } from "react";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { TextInput, Group, Button, PasswordInput } from "@mantine/core";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase"; // FIXME: Get rid of relative imports

interface LoginFormValues {
  email: string;
  password: string;
}

export default function Login() {
  const [error, setError] = useState("");
  const router = useRouter();

  const loginForm = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: isEmail("Invalid email"),
      password: isNotEmpty("Password is required"),
    },
  });

  async function handleSubmit(values: LoginFormValues) {
    setError("");
    try {
      const { email, password } = values;
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const idToken = await credential.user.getIdToken();

      await fetch("/api/login", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      router.push("/");
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <form onSubmit={loginForm.onSubmit((values) => handleSubmit(values))}>
      <TextInput
        label="Email"
        placeholder="knguyen@gmail.com"
        {...loginForm.getInputProps("email")}
      />
      <PasswordInput
        label="Password"
        placeholder="password"
        {...loginForm.getInputProps("password")}
      />
      <Group mt="md">
        <Button type="submit">Submit</Button>
      </Group>
      {error && <div>{error}</div>}
    </form>
  );
}
