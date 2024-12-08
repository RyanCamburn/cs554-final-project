"use client";

import { useState } from "react";
import { isEmail, useForm } from "@mantine/form";
import { TextInput, Group, Button, PasswordInput } from "@mantine/core";
import { useRouter } from "next/navigation";
import {
  getAuth,
  signInWithEmailAndPassword,
  connectAuthEmulator,
} from "firebase/auth";
import { app } from "../../firebase";

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
    },
  });

  async function handleSubmit(values: LoginFormValues) {
    setError("");
    try {
      const { email, password } = values;
      // TODO: The emulator enablement should be moved to a separate file like in the starter example
      // FIXME: Getting internal server error when trying to login with emulators
      const auth = getAuth(app);
      if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
        connectAuthEmulator(auth, "http://localhost:9099");
      }
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
        withAsterisk
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
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}
    </form>
  );
}
