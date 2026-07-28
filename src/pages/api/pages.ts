import type { NextApiRequest, NextApiResponse } from 'next';
import { JsonDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { sanitizeHtml } from '@/lib/sanitize';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;

  if (req.method === 'GET') {
    const pages = JsonDb.getCollection('pages');
    if (slug) {
      const page = pages.find(p => p.slug === slug);
      if (!page) return res.status(404).json({ message: 'Page not found' });
      return res.status(200).json(page);
    }
    return res.status(200).json(pages);
  }

  // All mutations require an admin session.
  if (req.method !== 'PUT' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  if (!requireAdmin(req, res)) return;

  if (req.method === 'PUT' || req.method === 'POST') {
    const { id, title, meta_title, meta_description, focus_keyword, content } = req.body;
    const payloadSlug = req.body?.slug;
    if (!id && !slug && !payloadSlug) return res.status(400).json({ message: 'Missing page identifiers' });

    const pages = JsonDb.getCollection('pages');
    const pageId = id || pages.find(p => p.slug === slug)?.id;

    if (!pageId) {
      // Insert new page
      const insertPayload = { ...req.body };
      if (!insertPayload.slug && insertPayload.title) {
        insertPayload.slug = sanitizeSlug(insertPayload.title);
      }
      if (typeof insertPayload.content === 'string') insertPayload.content = sanitizeHtml(insertPayload.content);
      const newPage = JsonDb.insert('pages', insertPayload);
      return res.status(201).json(newPage);
    }

    const existingPage = pages.find(p => p.id === pageId);

    // Sanitize authored HTML content if provided.
    const safeContent = typeof content === 'string' ? sanitizeHtml(content) : content;

    // Build the updated page fields, preserving existing values for unspecified fields
    const updatedFields = {
      title: title !== undefined ? title : existingPage?.title,
      slug: typeof payloadSlug === 'string'
        ? (payloadSlug.trim() ? sanitizeSlug(payloadSlug) : existingPage?.slug)
        : existingPage?.slug,
      meta_title: meta_title !== undefined ? meta_title : existingPage?.meta_title,
      meta_description: meta_description !== undefined ? meta_description : existingPage?.meta_description,
      focus_keyword: focus_keyword !== undefined ? focus_keyword : existingPage?.focus_keyword,
      content: safeContent !== undefined ? safeContent : existingPage?.content,
    };

    // Calculate dynamic SEO score
    const score = calculateSEOScore({
      ...updatedFields,
      content: updatedFields.content || ''
    });

    JsonDb.update('pages', pageId, {
      ...updatedFields,
      seo_score: score
    });

    return res.status(200).json({ message: 'Page updated successfully', seo_score: score });
  }

  return res.status(455).json({ message: 'Method Not Allowed' });
}

function sanitizeSlug(slug: unknown) {
  if (typeof slug !== 'string') return '';
  return slug.trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
function calculateSEOScore(page: any): number {
  let score = 0;

  // 1. Meta Title (Max 15 pts)
  if (page.meta_title) {
    const len = page.meta_title.length;
    if (len >= 30 && len <= 60) score += 15;
    else score += 8; // length warning
  }

  // 2. Meta Description (Max 15 pts)
  if (page.meta_description) {
    const len = page.meta_description.length;
    if (len >= 120 && len <= 160) score += 15;
    else score += 8; // length warning
  }

  // 3. Focus Keyword check (Max 25 pts)
  if (page.focus_keyword) {
    score += 10; // Exists
    const bodyText = (page.content || '').toLowerCase();
    const keyword = page.focus_keyword.toLowerCase();
    
    // Check keyword in title
    if (page.meta_title?.toLowerCase().includes(keyword)) {
      score += 5;
    }
    
    // Check keyword occurrences in content
    if (bodyText && keyword) {
      const occurrences = (bodyText.match(new RegExp(escapeRegExp(keyword), 'g')) || []).length;
      if (occurrences >= 2 && occurrences <= 6) {
        score += 10; // Good keyword density
      } else if (occurrences > 0) {
        score += 5; // Poor density
      }
    }
  }

  // 4. Content Depth (Max 15 pts)
  const wordCount = (page.content || '').trim().split(/\s+/).filter(Boolean).length;
  if (wordCount > 600) score += 15;
  else if (wordCount > 300) score += 10;
  else if (wordCount > 50) score += 5;

  // 5. Headings (Max 15 pts)
  const body = page.content || '';
  const h2Count = (body.match(/<h2/g) || []).length;
  const h3Count = (body.match(/<h3/g) || []).length;
  if (h2Count >= 2 && h3Count >= 1) score += 15;
  else if (h2Count > 0) score += 10;

  // 6. Media and links (Max 15 pts)
  if (body.includes('<img')) score += 8;
  if (body.includes('<a') || body.includes('href')) score += 7;

  return Math.min(score, 100);
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
