import { useState } from "react";
import { useForm } from "@mantine/form";
import { TextInput, Group, Button } from "@mantine/core";
import { useRouter } from "next/navigation";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
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
    validate: {},
  });

  async function handleSubmit(values: LoginFormValues) {
    setError("");
    try {
      const { email, password } = values;
      const credential = await signInWithEmailAndPassword(
        getAuth(app),
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
      <TextInput
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
