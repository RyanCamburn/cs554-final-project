'use client'

import React, { useState }from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

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
    <div>
      <h1>Login</h1>
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
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}