import type { NextApiRequest, NextApiResponse } from 'next';
import { JsonDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const testimonials = JsonDb.getCollection('testimonials');
    return res.status(200).json(testimonials);
  }

  // Mutations require an admin session.
  if (req.method !== 'POST' && req.method !== 'PUT' && req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  if (!requireAdmin(req, res)) return;

  if (req.method === 'POST') {
    const newTestimonial = JsonDb.insert('testimonials', req.body);
    return res.status(201).json(newTestimonial);
  }

  if (req.method === 'PUT') {
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Missing ID' });
    }
    const success = JsonDb.update('testimonials', id, req.body);
    if (!success) return res.status(404).json({ message: 'Testimonial not found' });
    return res.status(200).json({ message: 'Testimonial updated successfully' });
  }

  if (req.method === 'DELETE') {
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Missing ID' });
    }
    const success = JsonDb.delete('testimonials', id);
    if (!success) return res.status(404).json({ message: 'Testimonial not found' });
    return res.status(200).json({ message: 'Testimonial deleted' });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
