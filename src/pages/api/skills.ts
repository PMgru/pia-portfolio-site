import type { NextApiRequest, NextApiResponse } from 'next';
import { JsonDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const skills = JsonDb.getCollection('skills');
    return res.status(200).json(skills.sort((a, b) => (a.display_order || 0) - (b.display_order || 0)));
  }

  // Mutations require an admin session.
  if (req.method !== 'POST' && req.method !== 'PUT' && req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  if (!requireAdmin(req, res)) return;

  if (req.method === 'POST') {
    const newSkill = JsonDb.insert('skills', req.body);
    return res.status(201).json(newSkill);
  }

  if (req.method === 'PUT') {
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Missing ID' });
    }
    const success = JsonDb.update('skills', id, req.body);
    if (!success) return res.status(404).json({ message: 'Skill not found' });
    return res.status(200).json({ message: 'Skill updated successfully' });
  }

  if (req.method === 'DELETE') {
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Missing ID' });
    }
    const success = JsonDb.delete('skills', id);
    if (!success) return res.status(404).json({ message: 'Skill not found' });
    return res.status(200).json({ message: 'Skill deleted' });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
