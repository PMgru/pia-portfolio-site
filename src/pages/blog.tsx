'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Search, Calendar, Clock, User, ArrowRight, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  created_at: string;
  tags: string[];
}

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const r = await fetch('/api/blog');
        const data = await r.json();
        setPosts(data);
      } catch (e) {
        console.error('Error fetching blog posts', e);
      }
    };
    fetchPosts();

    // Log telemetry hit
    const logTelemetry = async () => {
      try {
        await fetch('/api/analytics?action=track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ page_path: '/blog', device_type: 'Desktop', browser: 'Chrome', os: 'Windows', country: 'Bangladesh' })
        });
      } catch (e) {}
    };
    logTelemetry();
  }, []);

  const categories = ['All', 'SEO', 'Growth Hacking', 'Digital Strategy'];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <SEO
        slug="blog"
        fallbackTitle="Insights & SEO Strategies | Pial Mahmud Blog"
        fallbackDescription="Discover semantic search tricks, GEO & AEO optimization, conversion psychology hacks, and AI workflows written by SEO expert Pial Mahmud."
        fallbackKeywords="SEO Blog, GEO Guide, AEO Strategies, Technical SEO Insights, Digital Marketing Articles"
      />

      <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col justify-between overflow-x-hidden">
        
        <Navbar />

        {/* Hero Section */}
        <header className="pt-32 pb-16 relative overflow-hidden text-center bg-[#0E1420]/60 border-b border-white/10 backdrop-blur-md">
          <div className="absolute inset-0 bg-[#C9A84C]/[0.02] pointer-events-none"></div>
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[#C9A84C] uppercase tracking-wider font-bold mb-4 hover:text-[#E8C96A] transition-colors bg-[#C9A84C]/10 px-3 py-1 rounded-full border border-[#C9A84C]/20">
              <ArrowLeft className="w-3.5 h-3.5" /> Return Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold font-headings text-white mb-4">
              Growth Logs & Strategies
            </h1>
            <p className="text-slate-300 max-w-md mx-auto text-sm leading-relaxed">
              Practical guides on conversion design, entity indexing, and server-side tracking analytics.
            </p>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-grow max-w-6xl w-full mx-auto px-6 py-12">
          
          {/* Controls bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 mb-12 pb-6 border-b border-white/10">
            
            {/* Categories filter */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-4 py-2 rounded-xl font-bold uppercase tracking-wider transition-all ${
                    selectedCategory === cat 
                      ? 'bg-gradient-to-r from-[#C9A84C] to-[#A07830] text-[#080B14] shadow-[0_4px_15px_rgba(201,168,76,0.3)]' 
                      : 'bg-[#121824] text-slate-300 border border-white/10 hover:border-[#C9A84C]/40 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-80 shrink-0">
              <input 
                type="text" 
                placeholder="Search strategies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#121824] border border-white/15 rounded-xl px-4 py-2.5 pl-10 text-sm text-white focus:outline-none focus:border-[#C9A84C] transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>

          </div>

          {/* Posts Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, idx) => (
                <article key={idx} className="p-6 md:p-8 rounded-3xl bg-[#0E1420]/90 backdrop-blur-xl border border-white/10 hover:border-[#C9A84C]/60 hover:-translate-y-1.5 transition-all duration-300 flex flex-col gap-4 shadow-2xl hover:shadow-[0_12px_40px_rgba(201,168,76,0.15)] relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  {/* Category & Date */}
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
                    <span className="text-[#E8C96A] font-bold bg-[#C9A84C]/15 px-3 py-1 rounded-full border border-[#C9A84C]/30">{post.category}</span>
                    <span className="flex items-center gap-1.5 text-slate-400"><Calendar className="w-3.5 h-3.5 text-[#C9A84C]" /> {post.created_at ? new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span>
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold font-headings text-white group-hover:text-[#E8C96A] transition-colors leading-tight">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>

                  <p className="text-sm text-slate-300 leading-relaxed flex-grow font-normal">
                    {post.excerpt}
                  </p>

                  <div className="border-t border-white/10 pt-4 flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <div className="w-6 h-6 rounded-full bg-[#C9A84C]/25 flex items-center justify-center font-bold text-white text-[10px] border border-[#C9A84C]/40">PM</div>
                      <span className="font-medium text-slate-300">Pial Mahmud</span>
                    </div>
                    <Link href={`/blog/${post.slug}`} className="text-xs font-bold text-[#C9A84C] uppercase tracking-wider flex items-center gap-1.5 hover:text-[#E8C96A] transition-colors bg-[#C9A84C]/10 px-3.5 py-2 rounded-lg border border-[#C9A84C]/25 hover:bg-[#C9A84C]/20">
                      Read Strategy <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </article>
              ))
            ) : (
              <div className="col-span-2 text-center py-16 text-textSecondary">
                No matching growth strategies discovered. Try refining your keyword criteria!
              </div>
            )}
          </div>

        </main>

        <Footer />

      </div>
    </>
  );
}
