"use client";

import { useState } from "react";
import { isEmail, isNotEmpty, matchesField, useForm } from "@mantine/form";
import { Anchor, TextInput, Group, Button, PasswordInput } from "@mantine/core";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase"; // FIXME: Get rid of relative imports

interface RegisterFormValues {
  email: string;
  password: string;
  confirmation: string;
}

export default function Register() {
  const [error, setError] = useState("");
  const router = useRouter();

  const registrationForm = useForm({
    initialValues: {
      email: "",
      password: "",
      confirmation: "",
    },
    validate: {
      email: isEmail("Invalid email"),
      password: isNotEmpty("Password is required"), // TODO: Add regex for passsword criteria
      confirmation: matchesField("password", "Passwords don't match"),
    },
  });

  async function handleRegistration(values: RegisterFormValues) {
    setError("");
    try {
      const { email, password } = values;
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/login");
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-white">Register</h2>
        <form
          className="mt-6"
          onSubmit={registrationForm.onSubmit((values) =>
            handleRegistration(values)
          )}
        >
          <div className="mb-4">
            <TextInput
              withAsterisk
              label="Email"
              placeholder="jsmith@gmail.com"
              {...registrationForm.getInputProps("email")}
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
              placeholder="********"
              {...registrationForm.getInputProps("password")}
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
              label="Confirm Password"
              placeholder="********"
              {...registrationForm.getInputProps("confirmation")}
              classNames={{
                input:
                  "border-gray-700 bg-gray-700 text-gray-300 rounded-md placeholder-gray-500",
                label: "text-gray-400 font-medium mb-2",
              }}
            />
          </div>
          <div className="flex justify-between items-center text-sm">
            <Anchor href="/login" className="text-blue-400 hover:underline">
              Already have an account? Login here.
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
