import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, ArrowRight, Target, Lightbulb, TrendingUp, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { sanitizeHtml } from '@/lib/sanitize';

interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  client: string;
  tag: string;
  description: string;
  challenge: string;
  solution: string;
  results: string;
  impact_metrics: Record<string, string>;
  image: string;
  technologies: string[];
  meta_title?: string;
  meta_description?: string;
  focus_keyword?: string;
  accent?: string;
}

// Fallback dataset used only if the project is not in the database. The DB is
// the source of truth (managed from the admin Case Studies CMS), but this keeps
// the page resilient for legacy hard-coded links.
const FALLBACK_CASE_STUDIES: Record<string, Partial<CaseStudy>> = {
  'tutorsplan-seo-growth': {
    client: 'TutorsPlan', tag: 'EdTech · SEO', title: '412% Organic Traffic Growth in 8 Months',
    accent: '#4F8EF7',
    description: 'A UK-based tutoring platform was struggling to rank. Through a complete technical SEO overhaul, strategic content architecture, and targeted link building, I achieved top 3 rankings for 200+ keywords.',
    challenge: 'TutorsPlan had a content-rich site that simply was not ranking. Most of their traffic came from paid channels, organic visibility was stuck on page 3-5 for every commercially valuable keyword, and their technical foundation had years of accumulated debt.',
    solution: 'I executed a full technical SEO overhaul: rebuilt the site architecture around intent clusters, rewrote every primary landing page for semantic relevance, implemented structured data, and ran a 6-month authority link-building campaign.',
    results: 'Within 8 months organic traffic grew 412%, the site reached the top 3 for 200+ target keywords, and organic search became their #1 acquisition channel — adding an estimated $185K in attributed revenue.',
    impact_metrics: { 'Traffic Growth': '+412%', 'Top-3 Keywords': '200+', 'Organic Revenue': '+$185K', 'Timeline': '8 Months' },
    technologies: ['Technical SEO', 'Content Strategy', 'Link Building', 'Schema Markup', 'Google Search Console'],
  },
  'bashundhara-digital-campaign': {
    client: 'Bashundhara Housing', tag: 'Real Estate · Digital Marketing', title: 'Generated 1,400+ Qualified Leads in Q1',
    accent: '#E8C96A',
    description: 'Bangladesh\'s leading housing brand needed high-quality leads for premium properties. I designed a full-funnel digital strategy combining Google Ads, Meta, and SEO targeting high-net-worth individuals.',
    challenge: 'Bashundhara Housing needed qualified, high-intent leads for premium property projects. Previous campaigns burned budget on low-quality clicks, and cost-per-lead was too high to scale profitably.',
    solution: 'A full-funnel strategy: intent-targeted Google Search Ads, lookalike + retargeting Meta campaigns, conversion-optimized landing pages, and lead-scoring automation so sales reps only followed up on qualified prospects.',
    results: '1,400+ qualified leads in a single quarter, a 68% reduction in cost-per-lead, ৳2.1M in attributed revenue, and an 11.4x return on ad spend — their highest lead volume ever.',
    impact_metrics: { 'Qualified Leads': '1,400+', 'Cost Per Lead': '-68%', 'Revenue Attributed': '৳2.1M', 'ROAS': '11.4x' },
    technologies: ['Google Ads', 'Meta Ads', 'Landing Page CRO', 'Lead Scoring', 'Analytics'],
  },
  'tvhut-content-strategy': {
    client: 'TVHUT', tag: 'Media · Content & SEO', title: '2.8M Monthly Impressions via Content Marketing',
    accent: '#00D4FF',
    description: 'Built a complete content marketing engine for a growing media platform. Focused on entertainment SEO, trending topic capture, and structured content clusters to dominate Bangladesh\'s digital media space.',
    challenge: 'TVHUT wanted to dominate Bangladesh\'s competitive entertainment media space, but had no systematic content engine and was losing traffic to faster-moving competitors.',
    solution: 'I built a content marketing engine: trending-topic capture workflows, structured topical clusters, schema for news/articles, and an editorial calendar tuned for search demand and recency.',
    results: 'Monthly impressions climbed to 2.8M, subscribers grew 180%, average session time increased by over 4 minutes, and engagement rate rose 5x — making TVHUT a top-5 entertainment SEO destination in Bangladesh.',
    impact_metrics: { 'Monthly Impressions': '2.8M', 'Subscriber Growth': '+180%', 'Avg. Session Time': '+4m 20s', 'Engagement Rate': '5x' },
    technologies: ['Content Strategy', 'Editorial SEO', 'Schema Markup', 'Trend Analysis', 'Analytics'],
  },
};

export default function CaseStudyDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [cs, setCs] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<CaseStudy[]>([]);

  useEffect(() => {
    if (!slug || typeof slug !== 'string') return;

    const load = async () => {
      try {
        const res = await fetch(`/api/projects?slug=${slug}`);
        let data: CaseStudy | null = null;
        if (res.ok) {
          data = await res.json();
        }
        // Fall back to the legacy hard-coded dataset if the DB has no match.
        if (!data && FALLBACK_CASE_STUDIES[slug]) {
          data = { id: slug, slug, ...FALLBACK_CASE_STUDIES[slug] } as CaseStudy;
        }
        if (data) {
          // Sanitize any authored HTML fields before rendering.
          if (data.results) data.results = sanitizeHtml(data.results);
          if (data.solution) data.solution = sanitizeHtml(data.solution);
          if (data.description) data.description = sanitizeHtml(data.description);
          setCs(data);
          // Load related projects.
          try {
            const allRes = await fetch('/api/projects');
            if (allRes.ok) {
              const all: CaseStudy[] = await allRes.json();
              setRelated(all.filter(p => p.slug !== slug).slice(0, 3));
            }
          } catch {
            /* related is non-critical */
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ background: '#080B14', minHeight: '100vh' }} className="flex items-center justify-center">
        <Loader2 className="animate-spin" size={28} style={{ color: '#C9A84C' }} />
      </div>
    );
  }

  if (!cs) {
    return (
      <div style={{ background: '#080B14', minHeight: '100vh' }} className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>Case Study Not Found</h1>
        <Link href="/case-studies" className="text-sm flex items-center gap-1.5" style={{ color: '#C9A84C' }}>
          <ArrowLeft size={16} /> Back to all case studies
        </Link>
      </div>
    );
  }

  const accent = cs.accent || '#C9A84C';
  const metrics = cs.impact_metrics || {};
  const metricEntries = Object.entries(metrics);

  return (
    <>
      <Head>
        <title>{cs.meta_title || `${cs.title} — Case Study | Pial Mahmud`}</title>
        <meta name="description" content={cs.meta_description || cs.description || `Read the full ${cs.client} case study: ${cs.title}.`} />
        <meta name="keywords" content={cs.focus_keyword || `${cs.client} SEO, Case Study, Organic Growth, Pial Mahmud`} />
        <link rel="canonical" href={`https://pialmahmud.com/case-studies/${cs.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://pialmahmud.com/case-studies/${cs.slug}`} />
        <meta property="og:title" content={cs.meta_title || cs.title} />
        <meta property="og:description" content={cs.meta_description || cs.description} />
        <meta property="og:image" content={cs.image ? (cs.image.startsWith('http') ? cs.image : `https://pialmahmud.com${cs.image}`) : 'https://pialmahmud.com/images/og-home.jpg'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={cs.meta_title || cs.title} />
        <meta name="twitter:description" content={cs.meta_description || cs.description} />
        <meta name="twitter:image" content={cs.image ? (cs.image.startsWith('http') ? cs.image : `https://pialmahmud.com${cs.image}`) : 'https://pialmahmud.com/images/og-home.jpg'} />
      </Head>

      <div style={{ background: '#080B14', minHeight: '100vh' }}>
        <div className="grid-overlay" />
        <Navbar />

        <main style={{ position: 'relative', zIndex: 1, paddingTop: 100 }}>
          {/* ── HERO ─────────────────────────────────────────────────────── */}
          <section style={{ padding: '60px 0 80px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="container-main">
              <Link href="/case-studies" className="inline-flex items-center gap-1.5 mb-8 text-xs uppercase font-bold tracking-wider" style={{ color: accent }}>
                <ArrowLeft size={14} /> All Case Studies
              </Link>

              <div className="grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 40, alignItems: 'center' }}>
                {/* Text */}
                <div>
                  <div className="badge badge-gold mb-5" style={{ fontSize: 11 }}>{cs.tag || cs.client}</div>
                  <h1 style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: 'clamp(32px, 4.5vw, 56px)',
                    fontWeight: 800, color: '#F0F2F8',
                    lineHeight: 1.1, marginBottom: 20, letterSpacing: '-0.02em',
                  }}>
                    {cs.title}
                  </h1>
                  <p style={{ fontSize: 17, color: '#6B7A99', lineHeight: 1.8, maxWidth: 560 }}>
                    {cs.description}
                  </p>

                  {/* Metrics row */}
                  {metricEntries.length > 0 && (
                    <div className="grid-4col" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginTop: 36 }}>
                      {metricEntries.slice(0, 4).map(([label, value]) => (
                        <div key={label} style={{
                          padding: '18px 20px', borderRadius: 14,
                          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                        }}>
                          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: accent, lineHeight: 1 }}>
                            {value}
                          </div>
                          <div style={{ fontSize: 11, color: '#6B7A99', marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                            {label.replace(/_/g, ' ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Client card */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div style={{
                    width: '100%', maxWidth: 340, borderRadius: 24, overflow: 'hidden',
                    background: 'rgba(14,20,32,0.6)', border: `1px solid ${accent}30`,
                    boxShadow: `0 30px 60px rgba(0,0,0,0.5)`,
                  }}>
                    {cs.image && (
                      <div style={{ height: 200, background: `linear-gradient(135deg, ${accent}22, transparent)`, position: 'relative' }}>
                        <img
                          src={cs.image}
                          alt={cs.client}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                    )}
                    <div style={{ padding: 28 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Client</div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: '#F0F2F8', fontFamily: 'Playfair Display, serif' }}>{cs.client}</div>
                      {cs.tag && <div style={{ fontSize: 13, color: '#6B7A99', marginTop: 4 }}>{cs.tag}</div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── CHALLENGE / SOLUTION / RESULTS ─────────────────────────────── */}
          <section className="section">
            <div className="container-main">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 48, maxWidth: 820, margin: '0 auto' }}>

                {/* Challenge */}
                <div>
                  <div className="section-label" style={{ color: '#E63946' }}>
                    <Target size={14} /> The Challenge
                  </div>
                  <p style={{ fontSize: 16, color: '#9CA3AF', lineHeight: 1.9, marginTop: 8 }}>
                    {cs.challenge}
                  </p>
                </div>

                {/* Solution */}
                <div>
                  <div className="section-label" style={{ color: '#00D4FF' }}>
                    <Lightbulb size={14} /> The Solution
                  </div>
                  <p style={{ fontSize: 16, color: '#9CA3AF', lineHeight: 1.9, marginTop: 8 }}>
                    {cs.solution}
                  </p>
                </div>

                {/* Results */}
                <div>
                  <div className="section-label" style={{ color: accent }}>
                    <TrendingUp size={14} /> The Results
                  </div>
                  <p style={{ fontSize: 16, color: '#9CA3AF', lineHeight: 1.9, marginTop: 8 }}>
                    {cs.results}
                  </p>

                  {metricEntries.length > 0 && (
                    <div className="grid-3col" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginTop: 28 }}>
                      {metricEntries.map(([label, value]) => (
                        <div key={label} style={{
                          display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px',
                          borderRadius: 12, background: `${accent}0d`, border: `1px solid ${accent}22`,
                        }}>
                          <CheckCircle2 size={18} color={accent} />
                          <div>
                            <span style={{ fontSize: 16, fontWeight: 700, color: '#F0F2F8' }}>{value}</span>
                            <span style={{ fontSize: 12, color: '#6B7A99', marginLeft: 8 }}>{label.replace(/_/g, ' ')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Technologies */}
                {cs.technologies && cs.technologies.length > 0 && (
                  <div>
                    <div className="section-label" style={{ color: '#C9A84C' }}>
                      <Sparkles size={14} /> Tools & Tactics Used
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
                      {cs.technologies.map((t, i) => (
                        <span key={i} className="badge badge-gold">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ── RELATED ─────────────────────────────────────────────────────── */}
          {related.length > 0 && (
            <section className="section" style={{ paddingTop: 0 }}>
              <div className="container-main">
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: '#F0F2F8', marginBottom: 32 }}>
                  More Case Studies
                </h2>
                <div className="grid-3col" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
                  {related.map((r) => (
                    <Link key={r.id} href={`/case-studies/${r.slug}`} style={{ textDecoration: 'none' }}>
                      <div className="card" style={{ height: '100%' }}>
                        <div className="badge badge-gold mb-3" style={{ fontSize: 10 }}>{r.tag || r.client}</div>
                        <h3 style={{ fontSize: 17, fontWeight: 700, color: '#F0F2F8', marginBottom: 10, lineHeight: 1.4 }}>{r.title}</h3>
                        <p style={{ fontSize: 13, color: '#6B7A99', lineHeight: 1.6 }}>{r.description}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16, fontSize: 12, fontWeight: 700, color: '#C9A84C' }}>
                          Read more <ArrowRight size={14} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── CTA ─────────────────────────────────────────────────────────── */}
          <section style={{
            padding: '80px 0', textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(201,168,76,0.06), rgba(0,212,255,0.03))',
          }}>
            <div className="container-main">
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#F0F2F8', marginBottom: 20 }}>
                Want Results Like These?
              </h2>
              <p style={{ color: '#6B7A99', marginBottom: 32, maxWidth: 440, margin: '0 auto 32px', lineHeight: 1.8 }}>
                Let&apos;s discuss your project and build a custom strategy to hit your growth goals.
              </p>
              <Link href="/contact" className="btn-primary">
                <span>Start Your Project</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
