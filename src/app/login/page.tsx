'use client'

import React, { useState }from "react";
import { LoginForm } from "../components/LoginForm";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

  // TODO: Refactor all auth functions to a single file
  const handleLogin = async () => {
    try {
      const res = await loginWithEmailAndPassword(email, password);
      console.log(res);
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="px-64">
      <LoginForm />
      {/* <h1>Login</h1>
      <input 
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input 
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button> */}
    </div>
  )
}