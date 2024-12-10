"use client";

import { useState } from "react";
import { isEmail, isNotEmpty, matchesField, useForm } from "@mantine/form";
import { TextInput, Group, Button, PasswordInput } from "@mantine/core";
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
    <form
      onSubmit={registrationForm.onSubmit((values) =>
        handleRegistration(values)
      )}
    >
      <TextInput
        label="Email"
        placeholder="jsmith@gmail.com"
        {...registrationForm.getInputProps("email")}
      />
      <PasswordInput
        label="Password"
        placeholder="********"
        {...registrationForm.getInputProps("password")}
      />
      <PasswordInput
        label="Confirm Password"
        placeholder="********"
        {...registrationForm.getInputProps("confirmation")}
      />
      <Group mt="md">
        <Button type="submit">Submit</Button>
      </Group>
      {error && <div>{error}</div>}
    </form>
  );
}
