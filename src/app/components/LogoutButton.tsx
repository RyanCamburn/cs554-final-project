"use client";

import { Button } from "@mantine/core";
import { useRouter } from "next/navigation";
import React from "react";

export default function LogoutButton() {
  const router = useRouter();
  const handleLogout = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      await fetch("/api/logout", {
        method: "GET",
      });
      console.log("Logged out");
      router.push("/login");
    } catch (e) {
      console.error(e);
    }
  };
  return <Button onClick={handleLogout}>Logout</Button>;
}
