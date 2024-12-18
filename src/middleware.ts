import { NextResponse, NextRequest } from 'next/server';
import {
  authMiddleware,
  redirectToHome,
  redirectToLogin,
  redirectToPath,
} from 'next-firebase-auth-edge';
import { clientConfig, serverConfig } from './auth-config';

// Credit: Next-Firebase-Edge-Auth Minimal Starter Example
const PUBLIC_PATHS = ['/register', '/login'];
const AUTH_ENABLED = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true';

// For middleware, do not use the session information
// Session information is used for server-side authentication
export async function middleware(request: NextRequest) {
  return authMiddleware(request, {
    loginPath: '/api/login',
    logoutPath: '/api/logout',
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    cookieSerializeOptions: serverConfig.cookieSerializeOptions,
    serviceAccount: serverConfig.serviceAccount,
    handleValidToken: async ({ decodedToken }, headers) => {
      // TODO: IN PRODUCTION THIS SHOULD BE REMOVED
      if (!AUTH_ENABLED) {
        return NextResponse.next();
      }

      // Authenticated user should not be able to access /login, /register routes until they logout
      if (PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
        return redirectToHome(request);
      }

      // Only admins should be able to access /admin route
      if (
        request.nextUrl.pathname.startsWith('/admin') &&
        decodedToken.role !== 'admin'
      ) {
        return redirectToHome(request);
      }

      // User should be redirected to their profile page never just /public route
      if (request.nextUrl.pathname === '/profile') {
        return redirectToPath(request, `/profile/${decodedToken.uid}`);
      }

      return NextResponse.next({
        request: {
          headers,
        },
      });
    },
    handleInvalidToken: async (reason) => {
      console.info('Missing or malformed credentials', { reason });

      // TODO: IN PRODUCTION THIS SHOULD BE REMOVED
      if (!AUTH_ENABLED) {
        return NextResponse.next();
      }

      return redirectToLogin(request, {
        path: '/login',
        publicPaths: PUBLIC_PATHS,
      });
    },
    handleError: async (error) => {
      // TODO: IN PRODUCTION THIS SHOULD BE REMOVED
      if (!AUTH_ENABLED) {
        return NextResponse.next();
      }

      console.error('Unhandled authentication error', { error });

      return redirectToLogin(request, {
        path: '/login',
        publicPaths: PUBLIC_PATHS,
      });
    },
  });
}

export const config = {
  matcher: ['/', '/((?!_next|api|.*\\.).*)', '/api/login', '/api/logout'],
};
