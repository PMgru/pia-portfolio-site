'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, Calendar, Eye, Clock, Tag } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { sanitizeHtml } from '@/lib/sanitize';

interface PostDetail {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  created_at: string;
  meta_title: string;
  meta_description: string;
  views: number;
}

export default function BlogDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blog?slug=${slug}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        // Defense-in-depth: sanitize authored HTML before rendering.
        if (data.content) data.content = sanitizeHtml(data.content);
        setPost(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();

    // Log telemetry hit
    const logTelemetry = async () => {
      try {
        await fetch('/api/analytics?action=track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ page_path: `/blog/${slug}`, device_type: 'Desktop', browser: 'Chrome', os: 'Windows', country: 'Bangladesh' })
        });
      } catch (e) {}
    };
    logTelemetry();

  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] text-white flex items-center justify-center font-body">
        <div className="w-8 h-8 rounded-full border-2 border-[#B76E79] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col items-center justify-center font-body gap-4">
        <h1 className="text-2xl font-bold font-headings">Article Not Found</h1>
        <Link href="/blog" className="text-sm text-[#B76E79] flex items-center gap-1.5"><ArrowLeft className="w-4 h-4" /> Return to Strategy Logs</Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{post.meta_title || post.title}</title>
        <meta name="description" content={post.meta_description || post.excerpt} />
      </Head>

      <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col justify-between overflow-x-hidden font-body">
        
        <Navbar />

        <main className="max-w-3xl w-full mx-auto px-6 pt-32 pb-24 flex-grow flex flex-col gap-6">
          
          {/* Back link */}
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs text-[#B76E79] uppercase tracking-wider font-bold hover:text-[#E63946] transition-colors self-start">
            <ArrowLeft className="w-4 h-4" /> All Strategies
          </Link>

          {/* Title block */}
          <div className="flex flex-col gap-4 border-b border-white/5 pb-6">
            
            {/* Category tag */}
            <span className="text-xs font-bold uppercase tracking-widest text-[#B76E79] bg-[#B76E79]/10 px-3.5 py-1 rounded-full self-start border border-[#B76E79]/20">
              {post.category}
            </span>

            <h1 className="text-3xl md:text-5xl font-bold font-headings leading-tight text-white">
              {post.title}
            </h1>

            {/* Post meta indicators */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#9A8F95] font-semibold uppercase tracking-wider mt-2">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#B76E79]" /> {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-[#B76E79]" /> {post.views} Views</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#B76E79]" /> 5 min read</span>
            </div>

          </div>

          {/* Article HTML Content */}
          <article 
            className="prose prose-invert max-w-none text-textSecondary leading-relaxed text-base flex flex-col gap-5 pt-4"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tag labels */}
          <div className="flex flex-wrap gap-2 border-t border-white/5 pt-6 mt-6">
            {post.tags?.map((t, idx) => (
              <span key={idx} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-textSecondary">
                <Tag className="w-3 h-3 text-[#B76E79]" /> {t}
              </span>
            ))}
          </div>

        </main>

        <Footer />

      </div>
    </>
  );
}
