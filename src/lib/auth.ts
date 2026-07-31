// Minimal single-admin auth.
//
// There's exactly one admin (credentials in env), so instead of a user table we
// verify against `ADMIN_EMAIL` / `ADMIN_PASSWORD` and hand out a stateless,
// HMAC-signed session cookie. Signed with `AUTH_SECRET` via Web Crypto (works
// the same in the Workers runtime and Node). Low-sensitivity by design.

import { getCloudflareContext } from '@opennextjs/cloudflare';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'trio_admin_session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, in seconds

interface AuthEnv {
  ADMIN_EMAIL?: string;
  ADMIN_PASSWORD?: string;
  AUTH_SECRET?: string;
}

function authEnv(): AuthEnv {
  return getCloudflareContext().env as unknown as AuthEnv;
}

const encoder = new TextEncoder();

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = '';
  for (const byte of view) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): ArrayBuffer {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  const binary = atob(padded);
  const buffer = new ArrayBuffer(binary.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) view[i] = binary.charCodeAt(i);
  return buffer;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

/** Issue a signed session token that expires in SESSION_MAX_AGE seconds. */
export async function createSessionToken(): Promise<string> {
  const secret = authEnv().AUTH_SECRET ?? 'dev-insecure-secret';
  const payload = toBase64Url(
    encoder.encode(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE })),
  );
  const signature = await crypto.subtle.sign('HMAC', await hmacKey(secret), encoder.encode(payload));
  return `${payload}.${toBase64Url(signature)}`;
}

/** Validate the signature and expiry of a session token. */
export async function verifySessionToken(token?: string | null): Promise<boolean> {
  if (!token) return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;

  const secret = authEnv().AUTH_SECRET ?? 'dev-insecure-secret';
  const valid = await crypto.subtle.verify(
    'HMAC',
    await hmacKey(secret),
    fromBase64Url(signature),
    encoder.encode(payload),
  );
  if (!valid) return false;

  try {
    const { exp } = JSON.parse(new TextDecoder().decode(fromBase64Url(payload)));
    return typeof exp === 'number' && exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

/** True when the current request carries a valid admin session cookie. */
export async function isAuthenticated(): Promise<boolean> {
  return verifySessionToken(cookies().get(SESSION_COOKIE)?.value);
}

/** Check submitted credentials against the configured admin account. */
export function verifyCredentials(email: string, password: string): boolean {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = authEnv();
  return (
    !!ADMIN_EMAIL &&
    !!ADMIN_PASSWORD &&
    email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
    password === ADMIN_PASSWORD
  );
}
