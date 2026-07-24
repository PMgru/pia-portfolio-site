import type { NextApiRequest, NextApiResponse } from 'next';
import { JsonDb } from '@/lib/db';
import { verifyPassword, signToken, setAuthCookie, clearAuthCookie } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const route = req.query.action;

  // ─── LOGOUT ────────────────────────────────────────────────────────────────
  if (route === 'logout') {
    clearAuthCookie(res);
    return res.status(200).json({ message: 'Logged out' });
  }

  // ─── LOGIN ─────────────────────────────────────────────────────────────────
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const users = JsonDb.getCollection('users');
  const user = users.find((u: any) => u.email.toLowerCase() === String(email).toLowerCase());

  // Constant-ish timing: always run a bcrypt compare even when the user is
  // missing, to avoid trivial user-enumeration via response timing.
  const dummyHash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
  const valid = user
    ? await verifyPassword(password, user.password_hash)
    : await verifyPassword(password, dummyHash);

  if (!user || !valid) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Issue a signed JWT in an HttpOnly cookie (never exposed to JS).
  const token = signToken({ id: user.id, email: user.email, name: user.name, role: user.role });
  setAuthCookie(res, token);

  return res.status(200).json({
    message: 'Login successful',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
}
