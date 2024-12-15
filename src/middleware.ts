import { NextResponse, NextRequest } from 'next/server';
import {
  authMiddleware,
  redirectToHome,
  redirectToLogin,
} from 'next-firebase-auth-edge';
import { clientConfig, serverConfig } from './auth-config';
import { get } from 'http';

// Credit: Next-Firebase-Edge-Auth Minimal Starter Example
const PUBLIC_PATHS = ['/register', '/login'];
const AUTH_ENABLED = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true';

// TODO: Credit the library, what is allowed?
export async function middleware(request: NextRequest) {
  return authMiddleware(request, {
    loginPath: '/api/login',
    logoutPath: '/api/logout',
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    cookieSerializeOptions: serverConfig.cookieSerializeOptions,
    serviceAccount: serverConfig.serviceAccount,
    handleValidToken: async ({ token, decodedToken, customToken }, headers) => {
      // TODO: IN PRODUCTION THIS SHOULD BE REMOVED
      if (!AUTH_ENABLED) {
        return NextResponse.next();
      }

      // Authenticated user should not be able to access /login, /register and /reset-password routes
      if (PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
        return redirectToHome(request);
      }

      console.log(token, decodedToken, customToken);

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
