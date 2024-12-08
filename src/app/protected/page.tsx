"use client";

import { Button } from "@mantine/core";

export default function Protected() {
  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      await fetch("/api/logout", {
        method: "GET",
      });
      console.log("Logged out");
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div>
      <h1>Protected Page</h1>
      <p>This page is protected.</p>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}
