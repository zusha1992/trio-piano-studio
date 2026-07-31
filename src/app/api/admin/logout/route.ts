import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  cookies().set(SESSION_COOKIE, '', { path: '/', maxAge: 0 });
  return NextResponse.json({ ok: true });
}
