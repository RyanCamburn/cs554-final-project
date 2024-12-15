## Overview

We are using Firebase Auth for authentication. We are using the `next-firebase-auth-edge` library since the Firebase Admin SDK depends
on the crypto library which is not supported in Next.js Edge Runtime. The library creates custom tokens that lets us implement
server side authentication for certain actions such as creating a new user, updating a user, and deleting a user.

- [Firebase Auth](https://firebase.google.com/docs/auth)
- [next-firebase-auth-edge library](https://github.com/awinogrodzki/next-firebase-auth-edge/tree/main)

## Client Side Authentication

We manage sessions the Context API see the @sessions folder. TBD what information we will store in the finalized session, but for now we store basic information like the user's email, name, and their role set in custom claims (see section below).

## Server Side Authentication

There will be a single Admin user seeded at the start of the application. This should be created in the emulator UI itself with the custom claim: {"role": "admin"} This user will have the role of `admin`. This user will be able to CRUD all users, announcements, and events. The Admin can also elevate other users to the role of `admin` by calling the `admin/claims` endpoint.

- [Control Access with Custom Claim and Security Roles](https://firebase.google.com/docs/auth/admin/custom-claims)
