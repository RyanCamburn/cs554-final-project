"use client";

import { getRedirectResult, signInWithPopup } from "firebase/auth";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth,provider } from "@/lib/firebase-config";
import React from "react";

export default function SignIn() {
  const router = useRouter();

  useEffect(() => {
    getRedirectResult(auth).then(async (userCred) => {
      if (!userCred) {
        return;
      }

      try {
        await fetch("/api/auth", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${await userCred.user.getIdToken()}`,
          },
        });
      } catch (error) {
        console.error(error);
      }

      // fetch("/api/auth", {
      //   method: "POST",
      //   headers: {
      //     Authorization: `Bearer ${await userCred.user.getIdToken()}`,
      //   },
      // }).then((response) => {
      //   if (response.status === 200) {
      //     router.push("/app");
      //   }
      // });
    });
  }, []); // FIXME: Do we need to add router to the dependency array?

  function signIn() {
    signInWithPopup(auth, provider);
  }

  return (
    <>
      <h2 className="text-3xl uppercase mb-8">Login page</h2>
      <button className="p-4 rounded-lg bg-green-200" onClick={() => signIn()}>Sign In With Google</button>
    </>
  );
}