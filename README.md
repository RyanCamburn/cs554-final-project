# CS 554 Final Project - Mentor-Mentee CRM

The Mentor-Mentee CRM project aims to develop a Customer Relationship Manager (CRM) to enhance communication between participants and streamline the tracking of jobs, internships, and volunteer outcomes for mentees. This project is in collaboration with Asian American Dream (AAD), a non-profit organization running a mentorship program that connects students with industry professionals. We are creating this web application as our final project for CS 554 - Web Programming II.

## Getting Started

### Setup your .env.local file:

Graders do not have to worry about this step as we provided our .env.local in the zip file

1. Make a copy of .env.local.example and rename it to .env.local
2. Follow the instructions to fill in the necessary environment variables

### Running the Firebase Emulators:

IMPORTANT - to run the Firebase Emulators, you must have the following installed:

- Node.js version 16.0 or higher.
- Java JDK version 11 or higher.

We make use of the [Firebase Local Emulator Suite](https://firebase.google.com/docs/emulator-suite) for development to avoid interacting with the production Firebase services. You can change the application's Firebase configuration to point to the local emulators by setting the `NEXT_PUBLIC_NODE_ENV` environment variable to `development` in your `.env.local` file.

To run the emulators:

1. Install the Firebase CLI: `npm install -g firebase-tools`
2. Authenticate with Firebase and list your projects:

```bash
firebase emulators:start
```

The emulators will start running on the following ports:

- Authentication Port: 9099
- Firestore Port: 8080
- Emulator UI: http://localhost:4000
- App URL: http://localhost:3000

### Running the Redis Server:

Install Redis-Stack:
Windows: https://redis.io/docs/latest/operate/oss_and_stack/install/install-stack/windows/
MacOs: https://redis.io/docs/latest/operate/oss_and_stack/install/install-stack/mac-os/

To run to the cache, you can use the following command (make sure to flush your cache to see correct results):

```
redis-server
```

or (depending on what you installed)

```
redis-stack-server
```

### Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result!

### Seeding the Database

To seed development firestore and auth (make sure they are running first of course), run GET request to the following endpoint `/api/seed` using your browser or other tool of choice like [Postman](https://www.postman.com/)

- hit this endpoint: `http://localhost:3000/api/seed`
- should see `Database seeded successfully` message when hitting the endpoint for the first time and more detailed logs in dev server console once it runs
- If you'd like to reset database, manually go to firebase emulators and 'Clear all data' from the Authentication and Firestore tabs

Now that you have seeded your database you can use the provided developement accounts to login and view the application. Each account has a differnet role.

```
# Accounts
Mentee User:
	email: mentee@email.com
	password: Mentee#1

Mentor User:
	email: mentor@email.com
	password: Mentor#1

Admin User:
	email: admin@email.com
	password: Admin#01
```

## Project Description

**Team Members**

- Christian Apostol
- Shawn Aviles
- Ryan Camburn
- Jack Gibson
- Marcus San Antonio

## Technologies

- **Next.js w/ TypeScript**: Core framework for building the full-stack web application.
- **Firebase Authentication**: Handles role-based access control.
- **TailwindCSS**: Used for styling the User Interface.
- **Redis**: Integrated for caching frequently accessed static assets and directory data.
- **Cloud Firestore**: NoSQL database for storing core data.

## Core Features

- **Authentication**: Users (mentors, mentees, and admins) will register and log in through Firebase Authentication, gaining access based on their role.
- **Announcements Page**: This page will allow admins to post important updates, announcements, and notifications, which will be visible to both mentors and mentees.
- **Mentor/Mentee Directory**: We will implement a searchable directory for users to view profiles of all mentors and mentees, enhancing communication and networking within the program.
- **Profile Pages**: Each user will have a personalized profile page displaying their information, including contact details, progress, and key achievements.
- **Settings Page**: This feature will allow users to adjust their account settings and preferences, such as profile visibility and notification preferences.
- **Forum Page**: This feature will allow users to message other users according to their selected industry preference.
- **Events Page**: This feature will allow users to view events created by the admin.

## Branch Naming Conventions:

| Category      | Team's Branch Pattern              |
| ------------- | ---------------------------------- |
| Main Branch   | `marcus`                           |
| Features      | `marcusNew/[feature-name]`         |
| Bug Fixes     | `mets/[bug-name]`                  |
| Documentation | `sanAntonio/[documentation-topic]` |

_For reference of conventional branch patterns vs. what our team is using:_

| Category      | Convential Branch Pattern    |
| ------------- | ---------------------------- |
| Main Branch   | `main`                       |
| Features      | `feature/[feature-name]`     |
| Bug Fixes     | `bugfix/[bug-name]`          |
| Documentation | `docs/[documentation-topic]` |
