'use client';
import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Sparkles, FileCheck, AlertTriangle, CheckCircle2, FileText, Briefcase, Globe,
  Loader2, Search,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import AdminLayout from '@/components/AdminLayout';
import { hasAuthCookie } from '@/lib/auth-client';
import { sanitizeHtml } from '@/lib/sanitize';

interface SeoTarget {
  kind: 'page' | 'project' | 'blog';
  id: string;
  slug?: string;
  title: string;
  subtitle: string;
  meta_title: string;
  meta_description: string;
  focus_keyword: string;
  content: string;
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Shared live-SEO scoring (title/desc length, keyword presence & density,
// word count, headings, media/links). Returns { score, issues }.
function scoreSeo(t: { meta_title: string; meta_description: string; focus_keyword: string; content: string }) {
  let score = 0;
  const issues: string[] = [];

  const tLen = t.meta_title.length;
  if (tLen === 0) issues.push('Meta Title is missing (Critical)');
  else if (tLen < 30 || tLen > 60) { score += 8; issues.push(`Title length (${tLen} chars): aim for 30–60`); }
  else score += 15;

  const dLen = t.meta_description.length;
  if (dLen === 0) issues.push('Meta Description is missing (Critical)');
  else if (dLen < 120 || dLen > 160) { score += 8; issues.push(`Description length (${dLen} chars): aim for 120–160`); }
  else score += 15;

  if (!t.focus_keyword.trim()) {
    issues.push('Focus keyword is not set (Critical)');
  } else {
    score += 10;
    const kw = t.focus_keyword.toLowerCase();
    if (t.meta_title.toLowerCase().includes(kw)) score += 5;
    else issues.push('Include the focus keyword in the title (+5)');
    const body = t.content.toLowerCase();
    const occ = (body.match(new RegExp(escapeRegExp(kw), 'g')) || []).length;
    if (occ >= 2 && occ <= 6) score += 10;
    else if (occ > 0) { score += 5; issues.push(`Keyword density low (${occ}×) — aim for 2–6`); }
    else issues.push('Focus keyword not found in content (+10)');
  }

  const words = t.content.trim().split(/\s+/).filter(Boolean).length;
  if (words > 600) score += 15;
  else if (words > 300) { score += 10; issues.push(`${words} words — expand past 600 for authority`); }
  else { score += 5; issues.push(`Only ${words} words — aim for 600+`); }

  const h2 = (t.content.match(/<h2/g) || []).length;
  const h3 = (t.content.match(/<h3/g) || []).length;
  if (h2 >= 2 && h3 >= 1) score += 15;
  else { score += 8; issues.push(`Add structured headings (≥2 H2 + 1 H3). Now: ${h2} H2, ${h3} H3`); }

  if (t.content.includes('<img')) score += 8;
  else issues.push('Add descriptive images with alt text');
  if (t.content.includes('<a') || t.content.includes('href')) score += 7;
  else issues.push('Add internal or outbound links');

  return { score: Math.min(score, 100), issues };
}

export default function SeoCenter() {
  const router = useRouter();
  const [targets, setTargets] = useState<SeoTarget[]>([]);
  const [filter, setFilter] = useState<'all' | 'page' | 'project' | 'blog'>('all');
  const [search, setSearch] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');

  const selectTarget = (t: SeoTarget) => {
    setActiveId(t.id);
    setSlug(t.slug || '');
    setMetaTitle(t.meta_title);
    setMetaDesc(t.meta_description);
    setFocusKeyword(t.focus_keyword);
    setContent(t.content);
  };

  const loadAll = async () => {
    try {
      const [pagesRes, projectsRes, blogRes] = await Promise.all([
        fetch('/api/pages').then(r => r.ok ? r.json() : []),
        fetch('/api/projects').then(r => r.ok ? r.json() : []),
        fetch('/api/blog').then(r => r.ok ? r.json() : []),
      ]);

      const mapped: SeoTarget[] = [
        ...pagesRes.map((p: any) => ({ kind: 'page' as const, id: p.id, slug: p.slug, title: p.title || p.slug, subtitle: `/${p.slug === 'home' ? '' : p.slug}`, meta_title: p.meta_title || '', meta_description: p.meta_description || '', focus_keyword: p.focus_keyword || '', content: p.content || '' })),
        ...projectsRes.map((p: any) => ({ kind: 'project' as const, id: p.id, slug: p.slug || p.case_study, title: p.title, subtitle: p.client || 'Case Study', meta_title: p.meta_title || '', meta_description: p.meta_description || '', focus_keyword: p.focus_keyword || '', content: `${p.challenge || ''} ${p.solution || ''} ${p.results || ''}` })),
        ...blogRes.map((b: any) => ({ kind: 'blog' as const, id: b.id, slug: b.slug, title: b.title, subtitle: `/${b.slug}`, meta_title: b.meta_title || '', meta_description: b.meta_description || '', focus_keyword: b.focus_keyword || '', content: b.content || '' })),
      ];
      setTargets(mapped);
      if (mapped.length && !activeId) selectTarget(mapped[0]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasAuthCookie()) { router.push('/admin'); return; }
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active = useMemo(() => targets.find(t => t.id === activeId) || null, [targets, activeId]);

  const { score, issues } = useMemo(() => scoreSeo({ meta_title: metaTitle, meta_description: metaDesc, focus_keyword: focusKeyword, content }),
    [metaTitle, metaDesc, focusKeyword, content]);

  const filtered = useMemo(() => targets.filter(t =>
    (filter === 'all' || t.kind === filter) &&
    (!search || t.title.toLowerCase().includes(search.toLowerCase()) || t.subtitle.toLowerCase().includes(search.toLowerCase()))
  ), [targets, filter, search]);

  const generateAi = async () => {
    if (!focusKeyword.trim()) {
      toast.error('Enter a focus keyword first so the AI knows what to target.', { style: { background: '#121218', color: '#E63946' } });
      return;
    }
    setAiLoading(true);
    toast.loading('AI generating meta tags...', { id: 'ai-seo' });
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'seo_meta', content: content || active?.title || '', context: focusKeyword, openrouter_api_key: localStorage.getItem('NEXT_PUBLIC_OPENROUTER_API_KEY') || undefined }),
      });
      const data = await res.json();
      const meta = JSON.parse(data.result);
      setMetaTitle(meta.meta_title);
      setMetaDesc(meta.meta_description);
      toast.success('Meta tags generated!', { id: 'ai-seo' });
    } catch {
      toast.error('AI generation failed — check your keyword and retry', { id: 'ai-seo' });
    } finally {
      setAiLoading(false);
    }
  };

  const handleSave = async () => {
    if (!active) return;
    setSaving(true);
    const payload = {
      slug: slug,
      meta_title: metaTitle,
      meta_description: metaDesc,
      focus_keyword: focusKeyword,
      // Pages/blogs store authored HTML; sanitize before persisting.
      content: active.kind === 'page' || active.kind === 'blog' ? sanitizeHtml(content) : content,
    };
    try {
      let res: Response;
      if (active.kind === 'page') {
        res = await fetch('/api/pages', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: active.id, ...payload }) });
      } else if (active.kind === 'blog') {
        res = await fetch(`/api/blog?id=${active.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      } else {
        res = await fetch(`/api/projects?id=${active.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: slug, meta_title: metaTitle, meta_description: metaDesc, focus_keyword: focusKeyword }) });
      }
      if (res.ok) {
        toast.success('SEO saved & live!', { style: { background: '#121218', color: '#F4F4F9' } });
        setTargets(ts => ts.map(t => t.id === active.id ? { ...t, ...payload } : t));
      } else {
        toast.error('Save failed');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] text-white flex items-center justify-center font-body">
        <Loader2 className="animate-spin" size={28} style={{ color: '#C9A84C' }} />
      </div>
    );
  }

  const scoreColor = score >= 80 ? '#4ade80' : score >= 50 ? '#F4C27F' : '#f59e0b';

  return (
    <AdminLayout>
      <Head><title>SEO Center | PM Admin Suite</title></Head>
      <Toaster position="top-right" />

      <div className="flex flex-col gap-6 text-left">
        {/* Header */}
        <div className="border-b border-[#C9A84C]/15 pb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>SEO Center</h1>
          <p className="text-xs text-[#9A8F95] mt-1">Optimize meta tags, focus keywords, and content for every page, case study, and blog post — with a live score.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* ── LEFT: target list ─────────────────────────────────── */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              {([['all', 'All', Globe], ['page', 'Pages', FileText], ['project', 'Case Studies', Briefcase], ['blog', 'Blog', FileText]] as const).map(([key, label, Icon]) => (
                <button key={key} onClick={() => setFilter(key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${filter === key ? 'bg-gradient-to-r from-[#C9A84C]/20 to-[#A07830]/10 text-[#C9A84C] border border-[#C9A84C]/30' : 'bg-white/5 text-[#9A8F95] hover:text-white border border-transparent'}`}>
                  <Icon className="w-3.5 h-3.5" /> {label}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-[#9A8F95] absolute left-3 top-3" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search targets..."
                className="w-full bg-[#121218] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A84C]" />
            </div>

            {/* Target cards */}
            <div className="flex flex-col gap-2 max-h-[560px] overflow-y-auto pr-1">
              {filtered.map(t => {
                const s = scoreSeo(t).score;
                return (
                  <button key={t.kind + t.id} onClick={() => selectTarget(t)}
                    className={`text-left p-3.5 rounded-xl border transition-all ${activeId === t.id ? 'bg-[#C9A84C]/10 border-[#C9A84C]/40' : 'bg-white/[0.02] border-white/5 hover:border-white/15'}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ background: t.kind === 'page' ? 'rgba(0,212,255,0.1)' : t.kind === 'project' ? 'rgba(201,168,76,0.1)' : 'rgba(16,185,129,0.1)', color: t.kind === 'page' ? '#00D4FF' : t.kind === 'project' ? '#C9A84C' : '#10B981' }}>
                        {t.kind === 'project' ? 'Case Study' : t.kind}
                      </span>
                      <span className="text-xs font-bold" style={{ color: s >= 80 ? '#4ade80' : s >= 50 ? '#F4C27F' : '#f59e0b' }}>{s}</span>
                    </div>
                    <div className="text-sm font-bold text-white mt-1.5 truncate">{t.title}</div>
                    <div className="text-[10px] text-[#9A8F95] mt-0.5">{t.subtitle}</div>
                  </button>
                );
              })}
              {filtered.length === 0 && <div className="text-xs text-[#9A8F95] text-center py-8">No targets match.</div>}
            </div>
          </div>

          {/* ── RIGHT: editor + score ────────────────────────────── */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {active ? (
              <>
                <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col gap-5">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-wider text-[#C9A84C]">{active.kind === 'project' ? 'Case Study' : active.kind}</div>
                      <h3 className="text-base font-bold text-white">{active.title}</h3>
                    </div>
                    <span className="text-[10px] text-[#9A8F95]">{active.subtitle}</span>
                  </div>

                  {/* Focus keyword */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Focus Keyword</label>
                    <input value={focusKeyword} onChange={e => setFocusKeyword(e.target.value)} placeholder="e.g. SEO Expert Bangladesh"
                      className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C]" />
                  </div>

                  {/* Meta title */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Meta Title</label>
                      <span className={`text-[10px] font-bold ${metaTitle.length >= 30 && metaTitle.length <= 60 ? 'text-emerald-400' : 'text-amber-500'}`}>{metaTitle.length} / 30–60</span>
                    </div>
                    <input value={metaTitle} onChange={e => setMetaTitle(e.target.value)} placeholder="Title tag..."
                      className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C]" />
                  </div>

                  {/* Meta description */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Meta Description</label>
                      <span className={`text-[10px] font-bold ${metaDesc.length >= 120 && metaDesc.length <= 160 ? 'text-emerald-400' : 'text-amber-500'}`}>{metaDesc.length} / 120–160</span>
                    </div>
                    <textarea value={metaDesc} onChange={e => setMetaDesc(e.target.value)} rows={3} placeholder="Description tag..."
                      className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C] resize-none" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Permalink Slug</label>
                    <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="e.g. service-audit"
                      className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C]" />
                    <p className="text-[10px] text-[#6B7A99]">Leave blank to preserve the existing permalink.</p>
                  </div>
                  {/* Content (editable only for pages/blog) */}
                  {(active.kind === 'page' || active.kind === 'blog') && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Content (HTML) — drives keyword density & headings</label>
                      <textarea value={content} onChange={e => setContent(e.target.value)} rows={5} placeholder="<h2>...</h2><p>...</p>"
                        className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-mono focus:outline-none focus:border-[#C9A8C] resize-none" />
                    </div>
                  )}
                  {active.kind === 'project' && (
                    <div className="text-xs text-[#9A8F95] italic p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      Case-study content is read from the Case Studies CMS (challenge/solution/results). Edit it there to update keyword density.
                    </div>
                  )}

                  <div className="flex gap-3 border-t border-white/5 pt-4">
                    <button onClick={generateAi} disabled={aiLoading}
                      className="flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-[#C9A84C] border border-[#C9A84C]/30 bg-[#C9A84C]/5 hover:bg-[#C9A84C]/10 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50">
                      {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} AI Generate Meta
                    </button>
                    <button onClick={handleSave} disabled={saving}
                      className="flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-[#080B14] bg-gradient-to-r from-[#C9A84C] to-[#A07830] flex items-center justify-center gap-1.5 disabled:opacity-50">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileCheck className="w-4 h-4" />} {saving ? 'Saving...' : 'Save & Publish'}
                    </button>
                  </div>
                </div>

                {/* Score gauge + checklist */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-[#121218] border border-[#C9A84C]/20 flex flex-col items-center text-center">
                    <span className="text-[10px] uppercase font-bold text-[#9A8F95] tracking-widest mb-4">Live SEO Score</span>
                    <div className="relative w-32 h-32 flex items-center justify-center rounded-full" style={{ border: `4px solid ${scoreColor}40` }}>
                      <div className="absolute inset-2 bg-[#0A0A0F] rounded-full flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold" style={{ color: scoreColor, fontFamily: 'Playfair Display, serif' }}>{score}</span>
                        <span className="text-[8px] uppercase font-bold text-[#9A8F95] tracking-widest">Score</span>
                      </div>
                    </div>
                    <p className="text-xs text-[#9A8F95] italic mt-4">
                      {score === 100 ? '🎉 Perfect SEO!' : score >= 80 ? 'Well optimized.' : 'Fix items to raise the score.'}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5">
                    <h4 className="text-[10px] uppercase font-bold tracking-wider text-white mb-3">Audit Checklist</h4>
                    <div className="flex flex-col gap-2.5 max-h-[200px] overflow-y-auto pr-1">
                      {issues.length > 0 ? issues.map((iss, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-[#9A8F95]">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span className="leading-tight">{iss}</span>
                        </div>
                      )) : (
                        <div className="flex items-center gap-2 text-xs text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" /> All checks passed — 100% ready!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-10 rounded-2xl bg-white/[0.01] border border-white/5 text-center text-[#9A8F95] text-sm">
                Select a target from the left to start optimizing.
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
