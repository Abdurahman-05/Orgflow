import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for protected routes.
 * Logic for checking JWT and redirecting to login will go here.
 */
export function middleware(request: NextRequest) {
  // TODO: Add auth check logic
  return NextResponse.next();
}

// Config to match dashboard and other protected routes
export const config = {
  matcher: ['/dashboard/:path*', '/tasks/:path*', '/notifications/:path*'],
};
