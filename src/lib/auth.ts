import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// ─── JWT (HMAC-SHA256, zero-dependency) ──────────────────────────────────────

const SECRET = process.env.JWT_SECRET || 'dev-fallback-secret-change-me-in-prod';
const COOKIE_NAME = 'pm_auth_token';
const TOKEN_TTL_SECONDS = 60 * 60 * 24; // 24 hours

function b64url(input: string | Buffer) {
  return Buffer.from(input as any)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function b64urlDecode(input: string): string {
  const padded = input + '='.repeat((4 - (input.length % 4)) % 4);
  return Buffer.from(padded.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
}

export function signToken(payload: Record<string, any>): string {
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64url(
    JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS })
  );
  const data = `${header}.${body}`;
  const signature = b64url(crypto.createHmac('sha256', SECRET).update(data).digest());
  return `${data}.${signature}`;
}

export function verifyToken(token: string): { id: string; email: string; role: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const data = `${header}.${body}`;
    const expectedSig = b64url(crypto.createHmac('sha256', SECRET).update(data).digest());
    // Timing-safe compare
    if (expectedSig.length !== signature.length) return null;
    if (!crypto.timingSafeEqual(Buffer.from(expectedSig), Buffer.from(signature))) return null;
    const decoded = JSON.parse(b64urlDecode(body));
    if (decoded.exp && Math.floor(Date.now() / 1000) > decoded.exp) return null;
    return decoded;
  } catch {
    return null;
  }
}

// ─── Password hashing (bcryptjs, pure-JS) ────────────────────────────────────

const SALT_ROUNDS = 10;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plain, hash);
  } catch {
    return false;
  }
}

// ─── Cookie helpers ──────────────────────────────────────────────────────────

export const AUTH_COOKIE = COOKIE_NAME;

export function setAuthCookie(res: NextApiResponse, token: string) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', [
    `${COOKIE_NAME}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${TOKEN_TTL_SECONDS}${secure}`,
    `pm_logged_in=true; SameSite=Strict; Path=/; Max-Age=${TOKEN_TTL_SECONDS}${secure}`
  ]);
}

export function clearAuthCookie(res: NextApiResponse) {
  res.setHeader('Set-Cookie', [
    `${COOKIE_NAME}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`,
    `pm_logged_in=; SameSite=Strict; Path=/; Max-Age=0`
  ]);
}

export function readAuthToken(req: NextApiRequest): string | null {
  const cookieHeader = req.headers.cookie || '';
  const match = cookieHeader.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]+)`));
  return match ? match[1] : null;
}

// ─── Middleware-style guard for API routes ───────────────────────────────────

export interface AuthedUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Returns the authenticated admin user, or null.
 * Call this at the top of any API handler that mutates data.
 */
export function getAuthedUser(req: NextApiRequest): AuthedUser | null {
  const token = readAuthToken(req);
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== 'admin') return null;
  return decoded as AuthedUser;
}

/**
 * Require an admin session. If not authenticated, responds 401 and returns false
 * (so the caller can `return`). Otherwise returns the authenticated user.
 *
 * Usage:
 *   const user = await requireAdmin(req, res);
 *   if (!user) return;
 */
export function requireAdmin(req: NextApiRequest, res: NextApiResponse): AuthedUser | null {
  const user = getAuthedUser(req);
  if (!user) {
    res.status(401).json({ message: 'Unauthorized — admin login required' });
    return null;
  }
  return user;
}
