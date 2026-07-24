import type { NextApiRequest, NextApiResponse } from 'next';
import { JsonDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const experiences = JsonDb.getCollection('experiences');
    return res.status(200).json(experiences.sort((a, b) => (a.display_order || 0) - (b.display_order || 0)));
  }

  // Mutations require an admin session.
  if (req.method !== 'POST' && req.method !== 'PUT' && req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  if (!requireAdmin(req, res)) return;

  if (req.method === 'POST') {
    const newExp = JsonDb.insert('experiences', req.body);
    return res.status(201).json(newExp);
  }

  if (req.method === 'PUT') {
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Missing ID' });
    }
    const success = JsonDb.update('experiences', id, req.body);
    if (!success) return res.status(404).json({ message: 'Experience not found' });
    return res.status(200).json({ message: 'Experience updated successfully' });
  }

  if (req.method === 'DELETE') {
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Missing ID' });
    }
    const success = JsonDb.delete('experiences', id);
    if (!success) return res.status(404).json({ message: 'Experience not found' });
    return res.status(200).json({ message: 'Experience deleted' });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
