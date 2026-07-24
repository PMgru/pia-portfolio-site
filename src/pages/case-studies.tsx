import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, TrendingUp } from 'lucide-react';

const DEFAULT_CASE_STUDIES = [
  {
    slug: 'tutorsplan-seo-growth',
    client: 'TutorsPlan',
    tag: 'EdTech · SEO & Content',
    logo: '/images/clients/tutorsplan.svg',
    title: '412% Organic Traffic Growth in 8 Months',
    excerpt: 'A UK-based tutoring platform was struggling to rank. Through a complete technical SEO overhaul, strategic content architecture, and targeted link building, I achieved top 3 rankings for 200+ keywords.',
    metrics: [
      { label: 'Traffic Growth', value: '+412%' },
      { label: 'Keywords in Top 3', value: '200+' },
      { label: 'Organic Revenue', value: '+$185K' },
      { label: 'Timeline', value: '8 Months' },
    ],
    accent: '#4F8EF7',
    result: 'From page 5 to #1 position across all primary keywords',
  },
  {
    slug: 'bashundhara-digital-campaign',
    client: 'Bashundhara Housing',
    tag: 'Real Estate · Full Digital Campaign',
    logo: '/images/clients/bashundhara.svg',
    title: 'Generated 1,400+ Qualified Leads in Q1 2024',
    excerpt: 'Bangladesh\'s leading housing brand needed high-quality leads for premium properties. I designed a full-funnel digital strategy combining Google Ads, Meta, and SEO targeting high-net-worth individuals.',
    metrics: [
      { label: 'Qualified Leads', value: '1,400+' },
      { label: 'Cost Per Lead', value: '-68%' },
      { label: 'Revenue Attributed', value: '৳2.1M' },
      { label: 'ROAS', value: '11.4x' },
    ],
    accent: '#E8C96A',
    result: 'Highest-ever lead volume in a single quarter',
  },
  {
    slug: 'tvhut-content-strategy',
    client: 'TVHUT',
    tag: 'Media · Content & SEO',
    logo: '/images/clients/tvhut.svg',
    title: '2.8M Monthly Impressions via Content Marketing',
    excerpt: 'Built a complete content marketing engine for a growing media platform. Focused on entertainment SEO, trending topic capture, and structured content clusters to dominate Bangladesh\'s digital media space.',
    metrics: [
      { label: 'Monthly Impressions', value: '2.8M' },
      { label: 'Subscriber Growth', value: '+180%' },
      { label: 'Avg. Session Time', value: '+4m 20s' },
      { label: 'Engagement Rate', value: '5x' },
    ],
    accent: '#00D4FF',
    result: 'Became a top-5 entertainment SEO destination in Bangladesh',
  },
  {
    slug: 'kdgtal-brand-strategy',
    client: 'KDGTAL',
    tag: 'Digital Agency · Brand Strategy',
    logo: '/images/clients/kdgtal.svg',
    title: 'Rebranding & Digital Positioning for a Growing Agency',
    excerpt: 'KDGTAL needed a stronger digital presence to compete in a crowded agency market. I revamped their SEO strategy, content positioning, and LinkedIn outreach to attract enterprise clients.',
    metrics: [
      { label: 'Website Traffic', value: '+290%' },
      { label: 'LinkedIn Leads', value: '+85/mo' },
      { label: 'Enterprise Inquiries', value: '+3x' },
      { label: 'DA Score', value: 'DA 38→52' },
    ],
    accent: '#F59E0B',
    result: 'Secured 3 enterprise contracts within 6 months',
  },
  {
    slug: 'hena-tech-seo',
    client: 'Hena Technology',
    tag: 'Technology · SEO Strategy',
    logo: '/images/clients/hena.svg',
    title: 'Reduced Customer Acquisition Cost by 45% with Organic SEO',
    excerpt: 'A tech company was over-reliant on paid ads. I shifted their strategy toward organic growth — optimizing their product pages, building authority content, and targeting long-tail commercial keywords.',
    metrics: [
      { label: 'CAC Reduction', value: '-45%' },
      { label: 'Organic Share', value: '18%→67%' },
      { label: 'Blog Traffic', value: '+320%' },
      { label: 'Demo Requests', value: '+2.4x' },
    ],
    accent: '#10B981',
    result: 'Reduced paid ad spend by $8,000/month while maintaining growth',
  },
  {
    slug: 'misterberry-social-growth',
    client: 'Mister Berry',
    tag: 'F&B Brand · Social & Local SEO',
    logo: '/images/clients/misterberry.svg',
    title: 'Built a 50K+ Local Following from Zero for an F&B Brand',
    excerpt: 'Helped a Dhaka-based bakery brand build a loyal digital community. Combined Instagram content strategy, local SEO optimization, and Google Business Profile management to drive foot traffic.',
    metrics: [
      { label: 'Social Followers', value: '50K+' },
      { label: 'Foot Traffic', value: '+140%' },
      { label: 'Google Reviews', value: '4.9★ (800+)' },
      { label: 'Monthly Reach', value: '1.2M' },
    ],
    accent: '#F97316',
    result: 'Featured in 3 food publications and doubled store revenue',
  },
];

export default function CaseStudiesPage() {
  // Start with the hard-coded defaults so the page renders instantly; then
  // hydrate from the DB so admin-created case studies appear too.
  const [caseStudies, setCaseStudies] = useState(DEFAULT_CASE_STUDIES);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/projects');
        if (!res.ok) return;
        const dbProjects: any[] = await res.json();
        if (cancelled || !dbProjects.length) return;
        // Merge: DB projects take priority, then any hard-coded ones not in the DB.
        const dbSlugs = new Set(dbProjects.map(p => p.slug));
        const mapped = dbProjects.map(p => ({
          slug: p.slug || p.case_study,
          client: p.client || p.title,
          tag: p.tag || 'Case Study',
          logo: p.image || '/images/placeholder.jpg',
          title: p.title,
          excerpt: p.description || '',
          metrics: Object.entries(p.impact_metrics || {}).map(([label, value]) => ({ label: label.replace(/_/g, ' '), value: String(value) })),
          accent: p.accent || '#C9A84C',
          result: p.results || '',
        }));
        const extras = DEFAULT_CASE_STUDIES.filter(d => !dbSlugs.has(d.slug));
        setCaseStudies([...mapped, ...extras]);
      } catch (e) {
        /* keep defaults on error */
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <Head>
        <title>Case Studies — Pial Mahmud Digital Marketing Results</title>
        <meta name="description" content="Explore real case studies and proven results from Pial Mahmud's digital marketing and SEO campaigns for brands across multiple industries." />
      </Head>

      <div style={{ background: '#080B14', minHeight: '100vh' }}>
        <div className="grid-overlay" />
        <Navbar />

        <main style={{ position: 'relative', zIndex: 1, paddingTop: 100 }}>

          {/* ── HERO ─────────────────────────────────── */}
          <section style={{ padding: '80px 0 60px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="container-main">
              <div className="section-label" style={{ justifyContent: 'center' }}>Proven Results</div>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 800, color: '#F0F2F8', marginBottom: 20, lineHeight: 1.1 }}>
                Real Campaigns.<br />
                <span className="text-gradient-gold">Extraordinary Results.</span>
              </h1>
              <p style={{ fontSize: 17, color: '#6B7A99', maxWidth: 520, margin: '0 auto', lineHeight: 1.8 }}>
                Every case study represents a real client, a real challenge, and a data-backed 
                strategy that delivered measurable ROI.
              </p>
            </div>
          </section>

          {/* ── STATS BAR ──────────────────────────── */}
          <section style={{ padding: '40px 0', background: 'rgba(14,20,32,0.4)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="container-main">
              <div className="grid-4col" style={{ gap: 24, textAlign: 'center' }}>
                {[
                  { val: '50+', label: 'Projects Completed' },
                  { val: '7', label: 'Industries Served' },
                  { val: '412%', label: 'Best Traffic Growth' },
                  { val: '100%', label: 'Client Satisfaction' },
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 36, fontWeight: 800, color: '#C9A84C', fontFamily: 'Playfair Display, serif', lineHeight: 1 }}>{s.val}</div>
                    <div style={{ fontSize: 12, color: '#6B7A99', marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── CASE STUDIES GRID ─────────────────── */}
          <section className="section">
            <div className="container-main">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {caseStudies.map((cs, i) => (
                  <div className="case-study-card grid-2col" style={{ minHeight: 0 }}>
                    
                    {/* Left — Content */}
                    <div style={{ padding: 40 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                        <div style={{
                          width: 56, height: 56, borderRadius: 12,
                          background: '#0E1420', border: '1px solid rgba(255,255,255,0.08)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          overflow: 'hidden',
                        }}>
                          <img
                            src={cs.logo}
                            alt={cs.client}
                            style={{ width: 36, height: 36, objectFit: 'contain' }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              (e.target as HTMLImageElement).parentElement!.innerHTML = `<span style="font-size:22px;font-weight:700;color:#C9A84C">${cs.client[0]}</span>`;
                            }}
                          />
                        </div>
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: '#F0F2F8' }}>{cs.client}</div>
                          <div className="badge badge-gold" style={{ marginTop: 4, fontSize: 10 }}>{cs.tag}</div>
                        </div>
                      </div>

                      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: '#F0F2F8', marginBottom: 12, lineHeight: 1.3 }}>
                        {cs.title}
                      </h2>
                      <p style={{ fontSize: 14, color: '#6B7A99', lineHeight: 1.7, marginBottom: 24 }}>
                        {cs.excerpt}
                      </p>

                      {/* Key result */}
                      <div style={{
                        padding: '12px 16px', borderRadius: 10, marginBottom: 24,
                        background: `rgba(${cs.accent === '#4F8EF7' ? '79,142,247' : cs.accent === '#E8C96A' ? '232,201,106' : cs.accent === '#00D4FF' ? '0,212,255' : cs.accent === '#F59E0B' ? '245,158,11' : cs.accent === '#10B981' ? '16,185,129' : '249,115,22'}, 0.08)`,
                        border: `1px solid ${cs.accent}30`,
                        display: 'flex', alignItems: 'center', gap: 10,
                      }}>
                        <TrendingUp size={14} color={cs.accent} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: cs.accent }}>{cs.result}</span>
                      </div>

                      <Link
                        href={`/case-studies/${cs.slug}`}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 8,
                          padding: '12px 24px', borderRadius: 8,
                          background: 'linear-gradient(135deg, #C9A84C, #A07830)',
                          color: '#080B14', fontWeight: 700, fontSize: 13,
                          letterSpacing: '0.05em', textTransform: 'uppercase',
                          textDecoration: 'none', transition: 'all 0.3s',
                        }}
                      >
                        Read Full Case Study <ArrowRight size={14} />
                      </Link>
                    </div>

                    {/* Right — Metrics */}
                    <div style={{
                      background: 'rgba(8,11,20,0.6)', padding: 40,
                      display: 'flex', flexDirection: 'column', justifyContent: 'center',
                      borderLeft: '1px solid rgba(255,255,255,0.04)',
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7A99', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 24 }}>Key Results</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                        {cs.metrics.map((m, j) => (
                          <div key={j}>
                            <div style={{
                              fontFamily: 'Playfair Display, serif',
                              fontSize: 32, fontWeight: 700,
                              color: cs.accent,
                              lineHeight: 1,
                            }}>{m.value}</div>
                            <div style={{ fontSize: 12, color: '#6B7A99', marginTop: 6, fontWeight: 600 }}>{m.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── CTA ─────────────────────────────────── */}
          <section style={{ padding: '80px 0', textAlign: 'center', background: 'linear-gradient(135deg, rgba(201,168,76,0.06), rgba(0,212,255,0.03))' }}>
            <div className="container-main">
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#F0F2F8', marginBottom: 20 }}>
                Want Results Like These?
              </h2>
              <p style={{ color: '#6B7A99', marginBottom: 32, maxWidth: 420, margin: '0 auto 32px', lineHeight: 1.8 }}>
                Let's discuss your project and create a custom strategy to achieve your growth goals.
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
