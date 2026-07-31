import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  createSessionToken,
  verifyCredentials,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let email = '';
  let password = '';
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    email = String(body.email ?? '');
    password = String(body.password ?? '');
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  if (!verifyCredentials(email, password)) {
    return NextResponse.json({ ok: false, error: 'Invalid email or password.' }, { status: 401 });
  }

  cookies().set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });

  return NextResponse.json({ ok: true });
}
