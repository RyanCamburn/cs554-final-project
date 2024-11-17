'use client'

import React, { useState }from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";

export default function Register() {
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
    <div>
      <h1>Register</h1>
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
      <button onClick={handleRegister}>Register</button>
    </div>
  )
}