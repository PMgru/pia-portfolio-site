import type { NextApiRequest, NextApiResponse } from 'next';
import { JsonDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const workItems = JsonDb.getCollection('work_items');
    return res.status(200).json(workItems);
  }

  // Mutations require an admin session.
  if (req.method !== 'POST' && req.method !== 'PUT' && req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  if (!requireAdmin(req, res)) return;

  if (req.method === 'POST') {
    const newItem = JsonDb.insert('work_items', req.body);
    return res.status(201).json(newItem);
  }

  if (req.method === 'PUT') {
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Missing ID' });
    }
    const success = JsonDb.update('work_items', id, req.body);
    if (!success) return res.status(404).json({ message: 'Work item not found' });
    return res.status(200).json({ message: 'Work item updated successfully' });
  }

  if (req.method === 'DELETE') {
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Missing ID' });
    }
    const success = JsonDb.delete('work_items', id);
    if (!success) return res.status(404).json({ message: 'Work item not found' });
    return res.status(200).json({ message: 'Work item deleted' });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
