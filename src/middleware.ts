import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuth } from "firebase/auth";
// import { firebase } from "@/firebase/admin-config";
// FIXME: Middleware does not like importing the above server node code
// Solutions online point towards using firebase-next-auth-edge
// https://github.com/vercel/next.js/issues/67260

// I considered creating an endpoint and then calling that endpoint in the middleware
// however that is bad for peformance so the auth-edge library may be the best way to go

// Supabase seems like the better alternative for Next.js
// Or maybe just need to understand session management better:
// https://firebase.google.com/docs/auth/admin/manage-cookies
// https://www.reddit.com/r/nextjs/comments/1cmn7ow/how_to_firebase_auth_next_auth_any_sugggestions/

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get('token')?.value;

  // Similar to the login, we are going to call an api endpoint to verify the token

  if (!authToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  try {
    await getAuth().verifyIdToken(authToken);
    return NextResponse.next();
  } catch (error) {
    console.error("Error verifying token", error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/protected'] // Whatever route you want to be protected by the above middleware, add here
};
