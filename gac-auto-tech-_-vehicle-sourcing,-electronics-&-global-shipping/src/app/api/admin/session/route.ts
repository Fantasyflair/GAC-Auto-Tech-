import { NextResponse } from 'next/server';
import {
  SESSION_COOKIE,
  createSessionToken,
  isAdminRequest,
  passwordMatches,
  sessionCookieOptions,
} from '../../../../lib/adminSession';

export async function GET() {
  return NextResponse.json({ authenticated: await isAdminRequest() });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { password?: unknown } | null;
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!passwordMatches(password)) {
    // A short pause on every miss slows down password guessing.
    await new Promise((resolve) => setTimeout(resolve, 800));
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
  }

  const response = NextResponse.json({ authenticated: true });
  response.cookies.set(SESSION_COOKIE, createSessionToken(), sessionCookieOptions);
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(SESSION_COOKIE, '', { ...sessionCookieOptions, maxAge: 0 });
  return response;
}
