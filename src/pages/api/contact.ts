import type { NextApiRequest, NextApiResponse } from 'next';
import { JsonDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { stripHtml } from '@/lib/sanitize';

// Simple in-memory rate limit: max 1 submission per IP per minute.
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const lastSubmitByIp = new Map<string, number>();

function clientIp(req: NextApiRequest): string {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string') return fwd.split(',')[0].trim();
  return req.socket.remoteAddress || 'anonymous';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ─── PUBLIC: submit a contact message ───────────────────────────────────────
  if (req.method === 'POST') {
    const { name, email, company, service, budget, message, website } = req.body || {};

    // Honeypot: bots fill hidden "website" field; humans never see it.
    if (website && String(website).trim() !== '') {
      // Pretend success so bots don't learn the trap.
      return res.status(200).json({ success: true });
    }

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required' });
    }

    // Basic email format check.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Rate limit.
    const ip = clientIp(req);
    const now = Date.now();
    const last = lastSubmitByIp.get(ip) || 0;
    if (now - last < RATE_LIMIT_WINDOW_MS) {
      return res.status(429).json({ message: 'Too many submissions. Please wait a minute and try again.' });
    }
    lastSubmitByIp.set(ip, now);

    const newMessage = JsonDb.insert('contact_messages', {
      name: String(name).slice(0, 120),
      email: String(email).slice(0, 160),
      company: company ? String(company).slice(0, 160) : '',
      service: service ? String(service).slice(0, 120) : '',
      budget: budget ? String(budget).slice(0, 60) : '',
      // Strip any HTML the user may have pasted.
      message: stripHtml(String(message)).slice(0, 5000),
      is_read: false,
      status: 'new',
    });

    return res.status(201).json({ success: true, id: newMessage.id });
  }

  // Everything below is admin-only.
  if (req.method !== 'GET' && req.method !== 'PUT' && req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  if (!requireAdmin(req, res)) return;

  const { id } = req.query;

  // ─── ADMIN: list messages ───────────────────────────────────────────────────
  if (req.method === 'GET') {
    const messages = JsonDb.getCollection('contact_messages');
    // Newest first.
    messages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const unread = messages.filter(m => !m.is_read).length;
    return res.status(200).json({ messages, unread, total: messages.length });
  }

  // ─── ADMIN: mark read/unread ────────────────────────────────────────────────
  if (req.method === 'PUT') {
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Missing message ID' });
    }
    const is_read = req.body?.is_read === true || req.query.read === 'true';
    const success = JsonDb.update('contact_messages', id, { is_read, status: is_read ? 'read' : 'new' });
    if (!success) return res.status(404).json({ message: 'Message not found' });
    return res.status(200).json({ message: 'Updated' });
  }

  // ─── ADMIN: delete message ──────────────────────────────────────────────────
  if (req.method === 'DELETE') {
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Missing message ID' });
    }
    const success = JsonDb.delete('contact_messages', id);
    if (!success) return res.status(404).json({ message: 'Message not found' });
    return res.status(200).json({ message: 'Message deleted' });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
