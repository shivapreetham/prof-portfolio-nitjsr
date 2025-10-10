import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const response = NextResponse.next();

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  if (request.nextUrl.pathname.startsWith('/api/')) {
    const protectedRoutes = [
      '/api/user/update',
      '/api/posts',
      '/api/research-papers',
      '/api/conferences',
      '/api/awards',
      '/api/students',
      '/api/teaching-experiences',
      '/api/videos',
      '/api/photos',
      '/api/opinion-pieces',
      '/api/meeting-requests',
      '/api/cloudFlare'
    ];

    const isProtected = protectedRoutes.some(route =>
      request.nextUrl.pathname.startsWith(route)
    );

    if (isProtected && request.method !== 'GET') {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
      });

      if (!token) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }
  }

  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/admin/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
