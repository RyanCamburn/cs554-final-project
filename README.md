# CS 554 Final Project - Mentor-Mentee CRM

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Running the container in Docker:

```
docker build -t aad-admin . 
docker run -p 3000:3000 aad-admin
```

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

The Mentor-Mentee CRM project aims to develop a Customer Relationship Manager (CRM) to enhance communication between participants and streamline the tracking of jobs, internships, and volunteer outcomes for mentees. This project is in collaboration with Asian American Dream (AAD), a non-profit organization running a mentorship program that connects students with industry professionals. We are creating this web application as our final project for CS 554 - Web Programming II. 

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
- **Docker**: Containerizes the application for consistent development, testing, and production environments.

## Core Features
- **Authentication**: Users (mentors, mentees, and admins) will register and log in through Firebase Authentication, gaining access based on their role.
- **Announcements Page**: This page will allow admins to post important updates, announcements, and notifications, which will be visible to both mentors and mentees.
- **Chat Feature**: Mentors and mentees can message each other directly though the application
- **Mentor/Mentee Directory**: We will implement a searchable directory for users to view profiles of all mentors and mentees, enhancing communication and networking within the program.
- **Profile Pages**: Each user will have a personalized profile page displaying their information, including contact details, progress, and key achievements.
- **Settings Page**: This feature will allow users to adjust their account settings and preferences, such as profile visibility and notification preferences.
- **Export Data**: We will build functionality to export directory and form data (mentee/mentor information and responses) as CSV files for easy reporting and offline management.
- **Dockerization**: Containerizing the application using Docker will help with consistent development environments and streamlined deployment processes.

## Extra/Reach Features
- **Growth Visualization**: A potential additional feature is a visual component, such as a growth graph or collage of companies that mentors work at, enhancing user engagement and program appeal.
- **Form Builder**: Admins will have the ability to create and manage custom forms for mentees and mentors to submit feedback, event attendance, and track outcomes such as job placements.
- **Mobile Responsiveness**: Ensuring the platform is fully responsive on mobile devices will be critical for mentees and mentors accessing the platform on the go.

## ## Branch Naming Conventions:

| Category       | Team's Branch Pattern              |
|----------------|------------------------------------|
| Main Branch    | `marcus`                           |
| Features       | `marcusNew/[feature-name]`         |
| Bug Fixes      | `mets/[bug-name]`                  |
| Documentation  | `sanAntonio/[documentation-topic]` |

*For reference of conventional branch patterns vs. what our team is using:*

| Category       | Convential Branch Pattern          |
|----------------|------------------------------------|
| Main Branch    | `main`                             |
| Features       | `feature/[feature-name]`           |
| Bug Fixes      | `bugfix/[bug-name]`                |
| Documentation  | `docs/[documentation-topic]`       |
