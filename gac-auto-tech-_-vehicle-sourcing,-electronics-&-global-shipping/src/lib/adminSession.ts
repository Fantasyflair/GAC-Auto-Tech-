import { createHash, createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'gac_admin';
const SESSION_SECONDS = 60 * 60 * 12;

const secret = () => {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error('ADMIN_SESSION_SECRET must be at least 32 characters');
  return value;
};

const sign = (value: string) => createHmac('sha256', secret()).update(value).digest('base64url');

// Hashing first gives equal-length buffers, which timingSafeEqual requires.
const safeEqual = (a: string, b: string) =>
  timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest());

/** Token is "<expiry ms>.<signature>", so it can be checked without storing sessions anywhere. */
export const createSessionToken = () => {
  const expires = String(Date.now() + SESSION_SECONDS * 1000);
  return `${expires}.${sign(expires)}`;
};

const isValidToken = (token: string | undefined) => {
  if (!token) return false;
  const [expires, signature] = token.split('.');
  if (!expires || !signature || !safeEqual(signature, sign(expires))) return false;
  return Number(expires) > Date.now();
};

export const passwordMatches = (input: string) => {
  const expected = process.env.ADMIN_PASSWORD;
  return !!expected && safeEqual(input, expected);
};

export const isAdminRequest = async () => isValidToken((await cookies()).get(SESSION_COOKIE)?.value);

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: SESSION_SECONDS,
};
