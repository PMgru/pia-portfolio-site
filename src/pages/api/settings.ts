import type { NextApiRequest, NextApiResponse } from 'next';
import { JsonDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

// GET  /api/settings            → all settings as a { key: value } map (public)
// GET  /api/settings?home=1     → also include home_content sections (public)
// PUT  /api/settings            → set one or many { key: value } pairs (admin)
// PUT  /api/settings?section=stats → replace a home_content section's data (admin)

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const settings = JsonDb.getAllSettings();
    const includeHome = req.query.home !== undefined;
    if (!includeHome) {
      return res.status(200).json(settings);
    }
    const homeSections = JsonDb.getCollection('home_content');
    const home: Record<string, any> = {};
    for (const s of homeSections) home[s.section] = s.data;
    return res.status(200).json({ settings, home });
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  if (!requireAdmin(req, res)) return;

  // Update a whole home_content section.
  if (req.query.section && typeof req.query.section === 'string') {
    const section = req.query.section;
    const data = req.body?.data;
    if (data === undefined) {
      return res.status(400).json({ message: 'Missing "data" for section' });
    }
    const sections = JsonDb.getCollection('home_content');
    const index = sections.findIndex((s: any) => s.section === section);
    if (index === -1) {
      JsonDb.insert('home_content', { section, data });
    } else {
      sections[index] = { ...sections[index], data, updated_at: new Date().toISOString() };
      JsonDb.saveCollection('home_content', sections);
    }
    return res.status(200).json({ message: 'Section updated', section });
  }

  // Update one or many settings.
  const body = req.body || {};
  const entries = Array.isArray(body) ? body : Object.entries(body);
  if (!entries.length && typeof body === 'object' && !Array.isArray(body)) {
    return res.status(400).json({ message: 'No settings provided' });
  }
  for (const [key, value] of Object.entries(body)) {
    JsonDb.setSetting(key, value);
  }
  return res.status(200).json({ message: 'Settings updated' });
}
