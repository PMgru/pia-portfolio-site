'use client';
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  FileText, Plus, Trash2, Edit3, Save, BookOpen,
  Sparkles, Eye, Code, CheckCircle2, AlertTriangle,
  ImagePlus, Upload, X
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import AdminLayout from '@/components/AdminLayout';
import { sanitizeHtml } from '@/lib/sanitize';

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  focus_keyword: string;
  meta_title: string;
  meta_description: string;
  seo_score: number;
}

export default function BlogCms() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Form Editor fields
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('SEO');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [tagsString, setTagsString] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [contentTab, setContentTab] = useState<'write' | 'preview'>('write');
  const [seoScore, setSeoScore] = useState(0);
  const [seoIssues, setSeoIssues] = useState<string[]>([]);
  const [featuredImage, setFeaturedImage] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Image upload handler
  const handleImageUpload = async (file: File) => {
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowed.includes(file.type)) {
      toast.error('Only image files (JPEG, PNG, GIF, WebP, SVG) are allowed.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Max 10MB.');
      return;
    }
    setImageUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: `blog-${Date.now()}-${file.name}`,
            fileType: file.type,
            data: base64,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setFeaturedImage(data.url);
          toast.success('Featured image uploaded!', { style: { background: '#121218', color: '#F4F4F9' } });
        } else {
          toast.error(data.message || 'Upload failed');
        }
        setImageUploading(false);
      };
      reader.onerror = () => {
        toast.error('Failed to read file');
        setImageUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error('Upload failed');
      setImageUploading(false);
    }
  };

  const loadPosts = async () => {
    try {
      const res = await fetch('/api/blog');
      if (res.status === 401) {
        router.push('/admin');
        return;
      }
      const data = await res.json();
      setPosts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // Live SEO score calculator
  useEffect(() => {
    let score = 0;
    const issues: string[] = [];

    const tLen = title.length;
    if (tLen === 0) issues.push('Add a title (Critical)');
    else if (tLen < 30 || tLen > 60) { score += 8; issues.push(`Title length (${tLen} chars): aim for 30–60`); }
    else score += 15;

    const dLen = excerpt.length;
    if (dLen === 0) issues.push('Add an excerpt (Critical)');
    else if (dLen < 80) { score += 5; issues.push('Excerpt too short (aim for 80+ chars)'); }
    else score += 10;

    if (!focusKeyword.trim()) {
      issues.push('Set a focus keyword');
    } else {
      score += 8;
      if (title.toLowerCase().includes(focusKeyword.toLowerCase())) score += 5;
      else issues.push('Include focus keyword in title (+5)');
      const occ = (content.toLowerCase().match(new RegExp(focusKeyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
      if (occ >= 2) score += 10;
      else issues.push(`Keyword used ${occ}x — aim for 2+ mentions`);
    }

    const words = content.trim().split(/\s+/).filter(Boolean).length;
    if (words > 600) score += 15;
    else if (words > 300) { score += 8; issues.push(`Content: ${words} words — expand to 600+`); }
    else { score += 3; issues.push(`Content only ${words} words — aim for 600+`); }

    const h2s = (content.match(/<h2/g) || []).length;
    if (h2s >= 2) score += 12;
    else { score += 4; issues.push(`Add at least 2 H2 headings (found ${h2s})`); }

    setSeoScore(Math.min(score, 100));
    setSeoIssues(issues);
  }, [title, excerpt, content, focusKeyword]);

  const generateAiBlog = async () => {
    if (!title.trim()) {
      toast.error('Enter a blog title first!', { style: { background: '#121218', color: '#E63946' } });
      return;
    }
    setIsAiLoading(true);
    toast.loading('AI is writing your article...', { id: 'ai-blog' });
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'generate_blog', content: title, context: focusKeyword || title }),
      });
      const data = await res.json();
      setContent(data.result);
      toast.success('Article generated! Review & edit before publishing.', { id: 'ai-blog' });
    } catch {
      toast.error('AI generation failed', { id: 'ai-blog' });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleEdit = (p: Post) => {
    setEditingId(p.id);
    setTitle(p.title || '');
    setExcerpt(p.excerpt || '');
    setContent(p.content || '');
    setCategory(p.category || 'SEO');
    setFocusKeyword(p.focus_keyword || '');
    setMetaTitle(p.meta_title || '');
    setMetaDesc(p.meta_description || '');
    setTagsString(p.tags?.join(', ') || '');
    setFeaturedImage((p as any).featured_image || '');
    setShowEditor(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsString.split(',').map(t => t.trim()).filter(Boolean);

    const payload = {
      title,
      excerpt,
      content,
      category,
      focus_keyword: focusKeyword,
      meta_title: metaTitle || title,
      meta_description: metaDesc || excerpt,
      tags,
      featured_image: featuredImage
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/blog?id=${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          toast.success('Strategy Log updated successfully!', { style: { background: '#121218', color: '#F4F4F9' } });
        }
      } else {
        const res = await fetch('/api/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          toast.success('Strategy Log published live!', { style: { background: '#121218', color: '#F4F4F9' } });
        }
      }
      resetForm();
      loadPosts();
    } catch (e) {
      toast.error('CMS save failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      const res = await fetch(`/api/blog?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        toast.success('Blog deleted');
        loadPosts();
      }
    } catch (e) {
      toast.error('Delete failed');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setExcerpt('');
    setContent('');
    setCategory('SEO');
    setFocusKeyword('');
    setMetaTitle('');
    setMetaDesc('');
    setTagsString('');
    setFeaturedImage('');
    setShowEditor(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] text-white flex items-center justify-center font-body">
        <div className="w-8 h-8 rounded-full border-2 border-[#B76E79] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Blog Strategy CMS | PM Admin Suite</title>
      </Head>
      <Toaster position="top-right" />

      <div className="flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#B76E79]/15 pb-6">
          <div className="flex flex-col gap-1 text-left">
            <h1 className="text-2xl md:text-3xl font-bold font-headings text-white">Strategy logs CMS</h1>
            <p className="text-xs text-textSecondary">Publish and manage semantic blog copy articles.</p>
          </div>
          {!showEditor && (
            <button 
              onClick={() => setShowEditor(true)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-gradient-to-r from-[#B76E79] to-[#E63946] text-white transition-all"
            >
              <Plus className="w-4 h-4" /> Create Article
            </button>
          )}
        </div>

        {showEditor ? (
          <form onSubmit={handleSave} className="grid lg:grid-cols-12 gap-8 text-left">
            
            {/* Editor Block (8 cols) */}
            <div className="lg:col-span-8 p-6 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col gap-5">
              <h3 className="text-sm font-bold uppercase tracking-wider font-headings text-white mb-2 pb-3 border-b border-white/5">
                {editingId ? 'Modify Strategy' : 'New Strategy Post'}
              </h3>

              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Article Title</label>
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master Search Intent Clusters"
                  className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79]"
                  required
                />
              </div>

              {/* Excerpt */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Short Excerpt summary</label>
                <textarea 
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Insert short summary..."
                  rows={2}
                  className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79] resize-none"
                  required
                />
              </div>

              {/* Content with Write/Preview tabs */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Article Body (HTML)</label>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => setContentTab('write')}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                        contentTab === 'write' ? 'bg-[#B76E79]/20 text-[#B76E79] border border-[#B76E79]/30' : 'text-[#9A8F95] hover:text-white'
                      }`}
                    >
                      <Code className="w-3 h-3" /> Write
                    </button>
                    <button type="button" onClick={() => setContentTab('preview')}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                        contentTab === 'preview' ? 'bg-[#B76E79]/20 text-[#B76E79] border border-[#B76E79]/30' : 'text-[#9A8F95] hover:text-white'
                      }`}
                    >
                      <Eye className="w-3 h-3" /> Preview
                    </button>
                  </div>
                </div>

                {contentTab === 'write' ? (
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="<h2>Subheading</h2><p>Write your detailed guide here...</p>"
                    rows={12}
                    className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#B76E79] font-mono"
                    required
                  />
                ) : (
                  <div
                    className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-4 py-4 min-h-[250px] text-sm text-white leading-relaxed prose-headings"
                    style={{ lineHeight: 1.8 }}
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) || '<p style="color:#6B7A99">Nothing to preview yet...</p>' }}
                  />
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 border-t border-white/5 pt-4 flex-wrap">
                <button type="button" onClick={generateAiBlog} disabled={isAiLoading}
                  className="flex-grow py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-[#F4C27F] border border-[#F4C27F]/30 bg-[#F4C27F]/5 hover:bg-[#F4C27F]/10 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" /> {isAiLoading ? 'AI Writing...' : 'AI Write Article'}
                </button>
                <button type="button" onClick={resetForm}
                  className="py-3 px-5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#9A8F95] bg-white/5 border border-white/10"
                >
                  Cancel
                </button>
                <button type="submit"
                  className="flex-grow py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#B76E79] to-[#E63946] flex items-center justify-center gap-1.5"
                >
                  Publish <Save className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Live SEO Score Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-4">

              {/* Score gauge */}
              <div className="p-5 rounded-2xl bg-[#121218] border border-[#B76E79]/20 flex flex-col items-center text-center">
                <span className="text-[9px] uppercase font-bold text-[#9A8F95] tracking-widest mb-3">Live SEO Score</span>
                <div className="relative w-28 h-28 flex items-center justify-center border-4 border-white/5 rounded-full mb-2">
                  <div className="absolute inset-2 bg-[#0A0A0F] rounded-full flex flex-col items-center justify-center">
                    <span className={`text-3xl font-bold font-headings ${
                      seoScore >= 80 ? 'text-emerald-400' : seoScore >= 50 ? 'text-[#F4C27F]' : 'text-amber-500'
                    }`}>{seoScore}</span>
                    <span className="text-[8px] uppercase font-bold text-[#9A8F95]">Score</span>
                  </div>
                </div>
                <p className="text-xs text-[#9A8F95] italic">
                  {seoScore >= 80 ? '🎉 Well optimized!' : 'Fix issues below'}
                </p>
              </div>

              {/* Issues */}
              <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col gap-3">
                <h4 className="text-[10px] uppercase font-bold tracking-wider text-white">SEO Checklist</h4>
                <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto scrollbar-none">
                  {seoIssues.length > 0 ? seoIssues.map((issue, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#9A8F95]">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      {issue}
                    </div>
                  )) : (
                    <div className="flex items-center gap-2 text-xs text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> All checks passed!
                    </div>
                  )}
                </div>
              </div>
              {/* Attributes */}
              <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold tracking-wider text-[#9A8F95]">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white"
                  >
                    <option value="SEO">SEO</option>
                    <option value="Growth Hacking">Growth Hacking</option>
                    <option value="Digital Strategy">Digital Strategy</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold tracking-wider text-[#9A8F95]">Focus Keyword</label>
                  <input 
                    type="text"
                    value={focusKeyword}
                    onChange={(e) => setFocusKeyword(e.target.value)}
                    placeholder="e.g. SEO strategy"
                    className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold tracking-wider text-[#9A8F95]">Tags (comma separated)</label>
                  <input 
                    type="text"
                    value={tagsString}
                    onChange={(e) => setTagsString(e.target.value)}
                    placeholder="e.g. SEO, AI, Growth"
                    className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white"
                  />
                </div>

              </div>

              {/* Featured Image Upload */}
              <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col gap-3">
                <h4 className="text-[10px] uppercase font-bold tracking-wider text-[#B76E79] flex items-center gap-2">
                  <ImagePlus className="w-3.5 h-3.5" /> Featured Image
                </h4>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                />
                {featuredImage ? (
                  <div className="relative group">
                    <img
                      src={featuredImage}
                      alt="Featured"
                      className="w-full h-32 object-cover rounded-xl border border-white/10"
                    />
                    <button
                      type="button"
                      onClick={() => setFeaturedImage('')}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 border border-white/10 text-white/60 hover:text-[#E63946] hover:border-[#E63946]/30 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={imageUploading}
                    className="w-full py-6 rounded-xl border-2 border-dashed border-white/10 hover:border-[#B76E79]/40 bg-white/[0.01] text-center transition-colors flex flex-col items-center gap-2 disabled:opacity-50"
                  >
                    {imageUploading ? (
                      <>
                        <div className="w-5 h-5 rounded-full border-2 border-[#B76E79] border-t-transparent animate-spin" />
                        <span className="text-xs text-[#9A8F95]">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-[#9A8F95]" />
                        <span className="text-xs text-[#9A8F95]">Upload featured image</span>
                        <span className="text-[9px] text-[#6B7A99]">JPEG, PNG, WebP • Max 10MB</span>
                      </>
                    )}
                  </button>
                )}
              </div>

            </div>

          </form>
        ) : (
          /* List View */
          <div className="flex flex-col gap-4">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider font-headings text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#B76E79]" /> Active Articles list
              </h3>
              <span className="text-[10px] font-bold text-textSecondary uppercase tracking-widest">{posts.length} published logs</span>
            </div>

            <div className="flex flex-col gap-4">
              {posts.map((post) => (
                <div 
                  key={post.id} 
                  className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-[#B76E79]/20 transition-all text-left"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase font-bold text-[#F4C27F] px-2.5 py-0.5 rounded bg-[#F4C27F]/10 border border-[#F4C27F]/20 self-start">
                      {post.category}
                    </span>
                    <span className="text-base font-bold font-headings text-white mt-1.5">{post.title}</span>
                    <p className="text-xs text-textSecondary max-w-xl leading-relaxed mt-0.5">{post.excerpt}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={() => handleEdit(post)}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#F4C27F] text-[#F4C27F] flex items-center justify-center transition-colors"
                      aria-label="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#E63946] text-[#E63946] flex items-center justify-center transition-colors"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </AdminLayout>
  );
}
