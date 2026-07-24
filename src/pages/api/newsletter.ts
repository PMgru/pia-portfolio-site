import type { NextApiRequest, NextApiResponse } from 'next';
import { JsonDb } from '@/lib/db';

const RATE_LIMIT_MS = 60 * 1000;
const lastByIp = new Map<string, number>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email } = req.body || {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
    return res.status(400).json({ message: 'A valid email is required' });
  }

  const fwd = req.headers['x-forwarded-for'];
  const ip = (typeof fwd === 'string' ? fwd.split(',')[0].trim() : req.socket.remoteAddress) || 'anonymous';
  const now = Date.now();
  const last = lastByIp.get(ip) || 0;
  if (now - last < RATE_LIMIT_MS) {
    return res.status(429).json({ message: 'Too many requests. Please wait a moment.' });
  }
  lastByIp.set(ip, now);

  // Avoid duplicate subscriptions.
  const subs = JsonDb.getCollection('newsletter_subs');
  const exists = subs.some((s: any) => s.email.toLowerCase() === String(email).toLowerCase());
  if (exists) {
    return res.status(200).json({ success: true, message: 'Already subscribed' });
  }

  JsonDb.insert('newsletter_subs', { email: String(email).slice(0, 160).toLowerCase(), source: 'footer' });
  return res.status(201).json({ success: true, message: 'Subscribed successfully' });
}
