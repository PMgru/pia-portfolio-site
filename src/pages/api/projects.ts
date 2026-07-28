import type { NextApiRequest, NextApiResponse } from 'next';
import { JsonDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { sanitizeHtml } from '@/lib/sanitize';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, slug } = req.query;

  if (req.method === 'GET') {
    const projects = JsonDb.getCollection('projects');
    if (slug) {
      const project = projects.find(p => p.slug === slug || p.case_study === slug);
      if (!project) return res.status(404).json({ message: 'Project not found' });
      return res.status(200).json(project);
    }
    if (id) {
      const project = projects.find(p => p.id === id);
      if (!project) return res.status(404).json({ message: 'Project not found' });
      return res.status(200).json(project);
    }
    return res.status(200).json(projects);
  }

  // All mutations below require an admin session.
  if (req.method !== 'POST' && req.method !== 'PUT' && req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  if (!requireAdmin(req, res)) return;

  if (req.method === 'POST') {
    const payload = { ...req.body };
    const normalizedSlug = payload.slug && typeof payload.slug === 'string' && payload.slug.trim()
      ? normalizeSlug(payload.slug)
      : normalizeSlug(payload.title || payload.case_study || 'case-study');
    payload.slug = normalizedSlug;
    payload.case_study = normalizedSlug;
    if (typeof payload.results === 'string') payload.results = sanitizeHtml(payload.results);
    if (typeof payload.solution === 'string') payload.solution = sanitizeHtml(payload.solution);
    const newProject = JsonDb.insert('projects', payload);
    return res.status(201).json(newProject);
  }

  if (req.method === 'PUT') {
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Missing project ID' });
    }
    const payload = { ...req.body };
    if (typeof payload.results === 'string') payload.results = sanitizeHtml(payload.results);
    if (typeof payload.solution === 'string') payload.solution = sanitizeHtml(payload.solution);
    if (typeof payload.slug === 'string' && payload.slug.trim()) {
      payload.slug = normalizeSlug(payload.slug);
      payload.case_study = payload.slug;
    } else {
      delete payload.slug;
    }
    const success = JsonDb.update('projects', id, payload);
    if (!success) return res.status(404).json({ message: 'Project not found' });
    return res.status(200).json({ message: 'Project updated successfully' });
  }

  if (req.method === 'DELETE') {
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Missing project ID' });
    }
    const success = JsonDb.delete('projects', id);
    if (!success) return res.status(404).json({ message: 'Project not found' });
    return res.status(200).json({ message: 'Project deleted successfully' });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}

function normalizeSlug(value: unknown) {
  if (typeof value !== 'string') return '';
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
