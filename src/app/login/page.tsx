"use client";

import { useState } from "react";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { Anchor, TextInput, Group, Button, PasswordInput } from "@mantine/core";
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
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-white">Login</h2>
        <form
          className="mt-6"
          onSubmit={loginForm.onSubmit((values) => handleSubmit(values))}
        >
          <div className="mb-4">
            <TextInput
              withAsterisk
              label="Email"
              placeholder="knguyen@gmail.com"
              {...loginForm.getInputProps("email")}
              classNames={{
                input:
                  "border-gray-700 bg-gray-700 text-gray-300 rounded-md placeholder-gray-500",
                label: "text-gray-400 font-medium mb-2",
              }}
            />
          </div>
          <div className="mb-4">
            <PasswordInput
              withAsterisk
              label="Password"
              placeholder="password"
              {...loginForm.getInputProps("password")}
              classNames={{
                input:
                  "border-gray-700 bg-gray-700 text-gray-300 rounded-md placeholder-gray-500",
                label: "text-gray-400 font-medium mb-2",
              }}
            />
          </div>
          <div className="flex justify-between items-center text-sm">
            <Anchor href="/register" className="text-blue-400 hover:underline">
              Don&apos;t have an account? Create one here.
            </Anchor>
          </div>
          <Group mt="md">
            <Button
              type="submit"
              fullWidth
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
            >
              Submit
            </Button>
          </Group>
          {error && (
            <div className="mt-4 bg-red-200 text-red-800 p-2 rounded border border-red-400">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
