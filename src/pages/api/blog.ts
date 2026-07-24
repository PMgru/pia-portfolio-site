import type { NextApiRequest, NextApiResponse } from 'next';
import { JsonDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { sanitizeHtml } from '@/lib/sanitize';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, slug } = req.query;

  if (req.method === 'GET') {
    const blogPosts = JsonDb.getCollection('blog_posts');
    if (slug) {
      const post = blogPosts.find(b => b.slug === slug);
      if (!post) return res.status(404).json({ message: 'Post not found' });
      // Increment views count
      post.views = (post.views || 0) + 1;
      JsonDb.update('blog_posts', post.id, { views: post.views });
      return res.status(200).json(post);
    }
    if (id) {
      const post = blogPosts.find(b => b.id === id);
      if (!post) return res.status(404).json({ message: 'Post not found' });
      return res.status(200).json(post);
    }
    return res.status(200).json(blogPosts);
  }

  // All mutations below require an admin session.
  if (req.method !== 'POST' && req.method !== 'PUT' && req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  if (!requireAdmin(req, res)) return;

  if (req.method === 'POST') {
    const { title, excerpt, content, category, tags, focus_keyword, meta_title, meta_description, featured_image } = req.body;

    // Create friendly slug from title
    const generatedSlug = (title || 'blog-post')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newPost = JsonDb.insert('blog_posts', {
      title,
      slug: generatedSlug,
      excerpt,
      // Sanitize authored HTML before persisting to prevent stored XSS.
      content: content ? sanitizeHtml(content) : '',
      category,
      tags: tags || [],
      focus_keyword: focus_keyword || '',
      meta_title: meta_title || '',
      meta_description: meta_description || '',
      featured_image: featured_image || '',
      seo_score: 80, // Baseline default
      views: 0,
      is_published: true
    });
    return res.status(201).json(newPost);
  }

  if (req.method === 'PUT') {
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Missing ID' });
    }
    // Sanitize incoming content if present.
    const payload = { ...req.body };
    if (typeof payload.content === 'string') payload.content = sanitizeHtml(payload.content);
    const success = JsonDb.update('blog_posts', id, payload);
    if (!success) return res.status(404).json({ message: 'Blog post not found' });
    return res.status(200).json({ message: 'Blog updated successfully' });
  }

  if (req.method === 'DELETE') {
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Missing ID' });
    }
    const success = JsonDb.delete('blog_posts', id);
    if (!success) return res.status(404).json({ message: 'Blog post not found' });
    return res.status(200).json({ message: 'Blog deleted successfully' });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
