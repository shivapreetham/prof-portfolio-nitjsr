import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function requireAuth(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized - Authentication required' },
      { status: 401 }
    );
  }

  return null;
}

export function createAuthenticatedRoute(handler) {
  return async (request, context) => {
    const authError = await requireAuth(request);
    if (authError) return authError;

    return handler(request, context);
  };
}
