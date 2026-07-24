import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, CheckCircle, ChevronRight, Zap } from 'lucide-react';

// services loaded from API

const additionalServices = [
  { icon: '📊', title: 'Analytics & Reporting', desc: 'Deep-dive analytics setup with custom dashboards and monthly performance reports.' },
  { icon: '✍️', title: 'Content Strategy & Creation', desc: 'Blog posts, landing pages, and social content that rank and convert.' },
  { icon: '🔗', title: 'Link Building Campaigns', desc: 'White-hat outreach to build high-DA backlinks that boost your authority.' },
  { icon: '🛒', title: 'E-commerce SEO', desc: 'Product page optimization, category SEO, and shopping campaigns for online stores.' },
  { icon: '📱', title: 'Social Media Management', desc: 'Content calendars, posting schedules, and engagement strategies for all platforms.' },
  { icon: '💌', title: 'Email Marketing', desc: 'List building, automation sequences, and campaign design that drives revenue.' },
];

const defaultServices = [
  {
    icon: '🚀',
    title: 'AI-Powered SEO Strategy',
    subtitle: 'Dominate Search Rankings',
    desc: 'Advanced technical SEO, entity-based optimization, and programmatic content scaling engineered to beat search algorithms.',
    features: ['Technical & Structural Audits', 'Entity & Semantic Keyword Mapping', 'Programmatic SEO Scaling', 'Backlink Outreach & Authority Building'],
    price: '$999 / mo',
    popular: true
  },
  {
    icon: '🎯',
    title: 'Growth Marketing & Paid Ads',
    subtitle: 'High-ROAS Ad Campaigns',
    desc: 'Data-backed Google Ads, Meta Ads, and multi-channel performance marketing optimized for maximum conversion rate and lowest CAC.',
    features: ['Google & Meta Ads Management', 'Conversion Rate Optimization (CRO)', 'A/B Testing & Funnel Building', 'Retargeting & Audience Segmentation'],
    price: '$799 / mo',
    popular: false
  },
  {
    icon: '🤖',
    title: 'AI Marketing & Automation',
    subtitle: 'Leverage Next-Gen AI',
    desc: 'Custom AI workflows, automated lead nurturing, chatbot integrations, and predictive analytics to scale your operations effortlessly.',
    features: ['Custom AI Chatbot Deployment', 'Marketing Automation Workflows', 'Predictive Customer Analytics', 'AI Content Engine Setup'],
    price: '$1,200 / mo',
    popular: false
  }
];

const processSteps = [
  { step: '01', title: 'Discovery Call', desc: 'We start with a free 30-minute call to understand your goals, challenges, and budget.' },
  { step: '02', title: 'Audit & Research', desc: 'Deep analysis of your current digital presence, competitors, and market opportunities.' },
  { step: '03', title: 'Strategy Proposal', desc: 'A custom roadmap with clear goals, timelines, and expected outcomes — no fluff.' },
  { step: '04', title: 'Execution', desc: 'I execute the strategy with full transparency, weekly updates, and real-time reporting.' },
  { step: '05', title: 'Optimize & Scale', desc: 'Continuous optimization based on data — refining what works and doubling down on wins.' },
];

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>(defaultServices);

  useEffect(() => {
    fetch('/api/services').then(res => res.json()).then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setServices(data.sort((a,b) => (a.display_order || 0) - (b.display_order || 0)).map((s, i) => ({
          icon: s.icon || '🎯',
          title: s.title,
          subtitle: '',
          desc: s.description,
          features: s.features || [],
          price: s.price || 'Custom',
          popular: i === 1
        })));
      }
    }).catch(console.error);
  }, []);

  return (
    <>
      <Head>
        <title>Services — Pial Mahmud Digital Marketing & SEO</title>
        <meta name="description" content="Explore Pial Mahmud's premium digital marketing services including SEO, AI marketing, content strategy, and full-funnel campaign management." />
      </Head>

      <div style={{ background: '#080B14', minHeight: '100vh' }}>
        <div className="grid-overlay" />
        <Navbar />

        <main style={{ position: 'relative', zIndex: 1, paddingTop: 100 }}>

          {/* ── PAGE HERO ─────────────────── */}
          <section style={{ padding: '80px 0 60px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="container-main">
              <div className="section-label" style={{ justifyContent: 'center' }}>What I Offer</div>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 800, color: '#F0F2F8', marginBottom: 20, lineHeight: 1.1 }}>
                Services Designed for<br />
                <span className="text-gradient-gold">Exceptional Results</span>
              </h1>
              <p style={{ fontSize: 17, color: '#6B7A99', maxWidth: 520, margin: '0 auto 32px', lineHeight: 1.8 }}>
                Every service I offer is built around one principle: <strong style={{ color: '#F0F2F8' }}>measurable growth</strong>.
                No vanity metrics — only strategies that move your business forward.
              </p>
              <Link href="/contact" className="btn-primary">
                <span>Get a Free Consultation</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </section>

          {/* ── MAIN SERVICE PACKAGES ──────── */}
          <section className="section">
            <div className="container-main">
              <div style={{ textAlign: 'center', marginBottom: 60 }}>
                <div className="section-label">Packages</div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: '#F0F2F8' }}>
                  Choose Your Growth Path
                </h2>
              </div>

              <div className="grid-3col" style={{ gap: 24 }}>
                {services.map((s, i) => (
                  <div key={i} className="card" style={{
                    position: 'relative',
                    border: s.popular ? '1px solid rgba(201,168,76,0.4)' : undefined,
                    boxShadow: s.popular ? '0 0 60px rgba(201,168,76,0.08)' : undefined,
                  }}>
                    {s.popular && (
                      <div style={{
                        position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                        background: 'linear-gradient(135deg, #C9A84C, #A07830)',
                        padding: '4px 20px', borderRadius: 100,
                        fontSize: 11, fontWeight: 700, color: '#080B14',
                        letterSpacing: '0.08em', textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                      }}>
                        Most Popular
                      </div>
                    )}
                    <div style={{ fontSize: 40, marginBottom: 16 }}>{s.icon}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{s.subtitle}</div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#F0F2F8', marginBottom: 12 }}>{s.title}</h3>
                    <p style={{ fontSize: 14, color: '#6B7A99', lineHeight: 1.7, marginBottom: 24 }}>{s.desc}</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                      {s.features.map((f: string) => (
                        <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <CheckCircle size={14} color="#C9A84C" fill="rgba(201,168,76,0.1)" />
                          <span style={{ fontSize: 13, color: '#9CA3AF' }}>{f}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#C9A84C', marginBottom: 20, fontFamily: 'Playfair Display, serif' }}>
                      {s.price}
                      <span style={{ fontSize: 12, fontWeight: 400, color: '#6B7A99', fontFamily: 'Inter, sans-serif' }}>/month</span>
                    </div>
                    
                    <Link
                      href="/contact"
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        padding: '12px 24px', borderRadius: 8, textDecoration: 'none',
                        background: s.popular ? 'linear-gradient(135deg, #C9A84C, #A07830)' : 'transparent',
                        color: s.popular ? '#080B14' : '#C9A84C',
                        border: s.popular ? 'none' : '1.5px solid rgba(201,168,76,0.4)',
                        fontWeight: 700, fontSize: 13, letterSpacing: '0.05em', textTransform: 'uppercase',
                        transition: 'all 0.3s',
                      }}
                    >
                      Get Started <ArrowRight size={14} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── ADDITIONAL SERVICES ────────── */}
          <section className="section" style={{ background: 'rgba(14,20,32,0.3)' }}>
            <div className="container-main">
              <div style={{ textAlign: 'center', marginBottom: 60 }}>
                <div className="section-label">More Services</div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: '#F0F2F8' }}>
                  Additional Capabilities
                </h2>
              </div>
              <div className="grid-3col" style={{ gap: 20 }}>
                {additionalServices.map((s, i) => (
                  <div key={i} className="card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{ fontSize: 28, flexShrink: 0 }}>{s.icon}</div>
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#F0F2F8', marginBottom: 8 }}>{s.title}</h3>
                      <p style={{ fontSize: 13, color: '#6B7A99', lineHeight: 1.6 }}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── PROCESS ───────────────────── */}
          <section className="section">
            <div className="container-main">
              <div style={{ textAlign: 'center', marginBottom: 60 }}>
                <div className="section-label">How It Works</div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: '#F0F2F8' }}>
                  My Working Process
                </h2>
              </div>
              <div className="grid-5col" style={{ gap: 16 }}>
                {processSteps.map((p, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: '50%', margin: '0 auto 16px',
                      background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))',
                      border: '1px solid rgba(201,168,76,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
                      fontSize: 14, color: '#C9A84C',
                    }}>
                      {p.step}
                    </div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#F0F2F8', marginBottom: 8 }}>{p.title}</h3>
                    <p style={{ fontSize: 12, color: '#6B7A99', lineHeight: 1.6 }}>{p.desc}</p>
                    {i < processSteps.length - 1 && (
                      <div style={{ display: 'none' }}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── CTA ──────────────────────── */}
          <section style={{ padding: '80px 0', textAlign: 'center', background: 'linear-gradient(135deg, rgba(201,168,76,0.06), rgba(0,212,255,0.03))' }}>
            <div className="container-main">
              <Zap size={40} color="#C9A84C" style={{ margin: '0 auto 20px' }} />
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#F0F2F8', marginBottom: 20 }}>
                Not Sure Which Service You Need?
              </h2>
              <p style={{ color: '#6B7A99', marginBottom: 32, maxWidth: 440, margin: '0 auto 32px', lineHeight: 1.8 }}>
                Book a free 30-minute strategy call. I'll analyze your business and recommend 
                the exact services that will drive the most growth.
              </p>
              <Link href="/contact" className="btn-primary">
                <span>Book Free Strategy Call</span>
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
