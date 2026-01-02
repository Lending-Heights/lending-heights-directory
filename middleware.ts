import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// Routes that require authentication
const protectedRoutes = [
  '/closings',
  '/admin',
  // Add more protected routes as needed
];

// Routes that should redirect to home if already authenticated
const authRoutes = ['/login'];

// Routes that are always public
const publicRoutes = [
  '/',
  '/directory',
  '/calendar',
  '/talentflow',
  '/crm',
  '/checklists',
  '/marketing',
  '/profile',
  '/notifications',
  '/auth/callback',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // Files with extensions (images, etc.)
  ) {
    return NextResponse.next();
  }

  // Update session and get user
  const { supabaseResponse, user } = await updateSession(request);

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname === route);

  // If trying to access protected route without auth, redirect to login
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If authenticated user tries to access login page, redirect to home
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
