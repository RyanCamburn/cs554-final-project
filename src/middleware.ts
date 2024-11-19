import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuth } from "firebase/auth";

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get('token');

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
  matcher: ['/protected']
};

// TODO: is a library like next-firebase-auth-edge necessary?