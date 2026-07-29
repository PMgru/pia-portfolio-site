import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import {
  ArrowRight, TrendingUp, Search, BarChart2, Globe,
  Star, CheckCircle, ChevronRight, Play, Zap, Target,
  Award, Users, MessageSquare, Loader2, AlertCircle
} from 'lucide-react';



// ── COUNTER ANIMATION ────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
          start += increment;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 25);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// We'll load services and caseStudies from API instead of hardcoding

const defaultTestimonials = [
  {
    name: 'Sarah Thompson',
    title: 'CEO, TutorsPlan UK',
    text: 'Pial transformed our online presence completely. The SEO results exceeded every expectation — we went from page 5 to position 1 for our core keywords.',
    rating: 5,
  },
  {
    name: 'David Chen',
    title: 'Marketing Director, Outbuild',
    text: 'Working with Pial was the best marketing investment we made. His AI-powered strategies gave us a competitive edge that our competitors are still catching up to.',
    rating: 5,
  },
  {
    name: 'Rashida Khanam',
    title: 'Brand Head, Bashundhara Housing',
    text: 'Exceptional results, professional execution, and always ahead of deadlines. Pial is not just a marketer — he is a strategic growth partner.',
    rating: 5,
  },
];

interface HomePageProps {
  ssrMeta?: {
    meta_title?: string;
    meta_description?: string;
    focus_keyword?: string;
    og_image?: string;
  };
}

export default function HomePage({ ssrMeta }: HomePageProps) {
  const [testimonials, setTestimonials] = useState(defaultTestimonials);
  const [typedText, setTypedText] = useState('');
  const [typingTexts, setTypingTexts] = useState(['SEO Expert', 'Growth Hacker', 'AI Strategist', 'Digital Marketer']);
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  // Dynamic content loaded from the admin-managed settings + home_content.
  // Use empty string as initial — prevents broken local-path onError before API responds
  const [profileImage, setProfileImage] = useState('');
  const [profileImageAlt, setProfileImageAlt] = useState('Pial Mahmud — Digital Marketing & SEO Expert');
  const [imageError, setImageError] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    if (profileImage) setImageError(false);
  }, [profileImage]);
  const [stats, setStats] = useState([
    { num: 50, suffix: '+', label: 'Projects Delivered', icon: '🚀' },
    { num: 7, suffix: '', label: 'Brand Clients', icon: '🏢' },
    { num: 412, suffix: '%', label: 'Max Traffic Growth', icon: '📈' },
    { num: 5, suffix: '.0★', label: 'Client Rating', icon: '⭐' },
  ]);
  
  const [heroDesc, setHeroDesc] = useState('I help ambitious brands achieve 10x growth through AI-powered SEO strategies, data-driven campaigns, and cutting-edge digital marketing that delivers measurable ROI.');
  
  const [services, setServices] = useState<{title: string, desc: string, icon: string}[]>([]);
  const [caseStudies, setCaseStudies] = useState<any[]>([]);
  const [ctaText, setCtaText] = useState("Let's Talk");
  const [experienceYears, setExperienceYears] = useState('5+');
  const [projectsCount, setProjectsCount] = useState('50+');

  useEffect(() => {
    const current = typingTexts[textIdx];
    if (!current) return;
    const timeout = setTimeout(() => {
      if (!deleting) {
        setTypedText(current.slice(0, charIdx + 1));
        setCharIdx(c => c + 1);
        if (charIdx === current.length - 1) {
          setTimeout(() => setDeleting(true), 2000);
        }
      } else {
        setTypedText(current.slice(0, charIdx - 1));
        setCharIdx(c => c - 1);
        if (charIdx === 0) {
          setDeleting(false);
          setTextIdx(i => (i + 1) % typingTexts.length);
        }
      }
    }, deleting ? 50 : 100);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, textIdx, typingTexts]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/settings?home=1');
        if (!res.ok) return;
        const { settings, home } = await res.json();
        if (cancelled) return;
        if (settings?.profile_image) {
          setProfileImage(settings.profile_image);
          setImageError(false);
        }
        if (settings?.profile_image_alt_text) {
          setProfileImageAlt(settings.profile_image_alt_text);
        }
        setSettingsLoaded(true);
        if (settings?.hero_title) setHeroDesc(settings.hero_title);
        if (settings?.hero_subtitle) {
          if (settings.hero_subtitle.includes('|')) {
            setTypingTexts(settings.hero_subtitle.split('|').map((s: string) => s.trim()));
          } else {
            setTypingTexts([settings.hero_subtitle]);
          }
        }
        if (settings?.cta_text) setCtaText(settings.cta_text);
        if (settings?.years_exp) setExperienceYears(settings.years_exp);
        if (settings?.projects_count) setProjectsCount(settings.projects_count);
        if (home?.stats && Array.isArray(home.stats) && home.stats.length) setStats(home.stats);
        if (home?.clients && Array.isArray(home.clients) && home.clients.length) setClients(home.clients);
        if (home?.testimonials && Array.isArray(home.testimonials) && home.testimonials.length) setTestimonials(home.testimonials);
      } catch {
        /* keep defaults */
      }
      
      const [projRes, servRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/services')
      ]);
      
      if (projRes.ok) {
        const projData = await projRes.json();
        if (Array.isArray(projData)) {
          // Map to caseStudies format
          const formatted = projData.filter(p => p.featured).slice(0, 3).map(p => ({
            slug: p.slug || p.case_study || '',
            client: p.client || '',
            tag: p.tag || '',
            title: p.title || '',
            desc: p.description || '',
            metrics: p.impact_metrics ? Object.values(p.impact_metrics).slice(0, 3) : [],
            color: '#4F8EF7',
            logo: p.image || ''
          }));
          if (formatted.length > 0) setCaseStudies(formatted);
        }
      }
      
      if (servRes.ok) {
        const servData = await servRes.json();
        if (Array.isArray(servData)) {
          setServices(servData.sort((a,b) => (a.display_order || 0) - (b.display_order || 0)).slice(0, 6).map(s => ({
            title: s.title,
            desc: s.description,
            icon: s.icon || '🎯'
          })));
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  
  // Audit tool state
  const [auditUrl, setAuditUrl] = useState('');
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);
  const [auditError, setAuditError] = useState('');

  const runAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditUrl.trim()) return;
    setAuditLoading(true);
    setAuditResult(null);
    setAuditError('');
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: auditUrl }),
      });
      const data = await res.json();
      setAuditResult(data);
    } catch {
      setAuditError('Audit failed. Please check the URL and try again.');
    } finally {
      setAuditLoading(false);
    }
  };

  // GEO & AEO Optimized Schema Definition
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://pialmahmud.com/#person",
        "name": "Pial Mahmud",
        "alternateName": ["Pial Mahmud SEO", "Pial Mahmud Digital Marketing"],
        "url": "https://pialmahmud.com",
        "image": {
          "@type": "ImageObject",
          "@id": "https://pialmahmud.com/#profileImage",
          "url": "https://pialmahmud.com/uploads/profile-photo.png",
          "caption": "Pial Mahmud - Digital Marketing & SEO Expert"
        },
        "jobTitle": "Digital Marketing & SEO Expert",
        "description": "Pial Mahmud is a professional Digital Marketing & SEO Expert specializing in Technical SEO, Generative Engine Optimization (GEO), Answer Engine Optimization (AEO), AI Automation, Meta Ads, and Next.js Web Development.",
        "sameAs": [
          "https://github.com/PMgru",
          "https://www.linkedin.com/in/pial-mahmud-",
          "https://twitter.com/pialmahmud",
          "https://www.facebook.com/pialmahmud",
          "https://www.youtube.com/@pialmahmud"
        ],
        "knowsAbout": [
          "Search Engine Optimization (SEO)",
          "Generative Engine Optimization (GEO)",
          "Answer Engine Optimization (AEO)",
          "Technical SEO & Core Web Vitals",
          "Programmatic SEO",
          "AI Search Optimization (ChatGPT, Perplexity, Gemini, Google AI Overviews)",
          "Digital Marketing Strategy",
          "Meta Ads & Performance Marketing",
          "Next.js & React Web Development",
          "Conversion Rate Optimization (CRO)",
          "AI Chatbot Training & Integration"
        ],
        "knowsLanguage": ["English", "Bengali"],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "email": "contact@pialmahmud.com",
          "availableLanguage": ["English", "Bengali"]
        }
      },
      {
        "@type": "ProfessionalService",
        "@id": "https://pialmahmud.com/#service",
        "name": "Pial Mahmud - Digital Marketing & SEO Services",
        "url": "https://pialmahmud.com",
        "logo": "https://pialmahmud.com/uploads/logo.png",
        "image": "https://pialmahmud.com/uploads/profile-photo.png",
        "description": "Premium Digital Marketing, Technical SEO, GEO & AEO Optimization, and Next.js Development services engineered for maximum organic visibility and AI search engine ranking.",
        "provider": {
          "@id": "https://pialmahmud.com/#person"
        },
        "areaServed": {
          "@type": "AdministrativeArea",
          "name": "Global"
        },
        "priceRange": "$$",
        "currenciesAccepted": "USD",
        "paymentAccepted": "Credit Card, Wire Transfer, PayPal",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "5.0",
          "reviewCount": "50",
          "bestRating": "5",
          "worstRating": "1"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "SEO & Growth Marketing Services",
          "itemListElement": [
            {
              "@type": "OfferCatalog",
              "name": "Generative Engine Optimization (GEO)",
              "itemListElement": [
                {
                  "@type": "Service",
                  "name": "GEO & AI Search Engine Ranking",
                  "description": "Optimizing entity signals, citations, and semantic structured data for ChatGPT Search, Perplexity AI, Google AI Overviews, and Gemini."
                }
              ]
            },
            {
              "@type": "OfferCatalog",
              "name": "Technical & Programmatic SEO",
              "itemListElement": [
                {
                  "@type": "Service",
                  "name": "Technical SEO & Speed Audit",
                  "description": "Core Web Vitals optimization, site architecture refinement, indexing fixes, and programmatic page scaling."
                }
              ]
            },
            {
              "@type": "OfferCatalog",
              "name": "Next.js Web Development",
              "itemListElement": [
                {
                  "@type": "Service",
                  "name": "High-Performance Web Applications",
                  "description": "Custom Next.js web application design optimized for lightning-fast loading speeds, accessibility, and SEO."
                }
              ]
            }
          ]
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://pialmahmud.com/#website",
        "url": "https://pialmahmud.com",
        "name": "Pial Mahmud | Digital Marketing & SEO Expert",
        "description": "Official Portfolio & Strategic Growth Hub of Pial Mahmud",
        "publisher": {
          "@id": "https://pialmahmud.com/#person"
        },
        "inLanguage": "en-US",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://pialmahmud.com/blog?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "ProfilePage",
        "@id": "https://pialmahmud.com/#profilepage",
        "url": "https://pialmahmud.com",
        "name": "Pial Mahmud Official Profile",
        "mainEntity": {
          "@id": "https://pialmahmud.com/#person"
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://pialmahmud.com/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Who is Pial Mahmud?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Pial Mahmud is a professional Digital Marketing & SEO Expert specializing in Technical SEO, Generative Engine Optimization (GEO), Answer Engine Optimization (AEO), AI Automation, Meta Ads performance marketing, and modern Next.js web development."
            }
          },
          {
            "@type": "Question",
            "name": "What is Generative Engine Optimization (GEO) and Answer Engine Optimization (AEO)?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Generative Engine Optimization (GEO) and Answer Engine Optimization (AEO) are modern search optimization frameworks designed to ensure brands and websites rank, get cited, and appear as authoritative sources in AI search engines such as ChatGPT Search, Perplexity AI, Google AI Overviews (SGE), and Claude."
            }
          },
          {
            "@type": "Question",
            "name": "What digital marketing and SEO services does Pial Mahmud offer?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Pial Mahmud provides end-to-end digital growth services including: 1) Technical & Core Web Vitals SEO, 2) GEO & AEO AI Search Optimization, 3) Programmatic SEO & Content Strategy, 4) High-ROI Meta Ads & Performance Marketing, 5) Custom Next.js Web Development, and 6) AI Chatbot Training & Marketing Automation."
            }
          },
          {
            "@type": "Question",
            "name": "How does Pial Mahmud help websites rank on AI search engines like ChatGPT and Perplexity?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Pial Mahmud utilizes advanced entity mapping, JSON-LD structured schema graphs, semantic content structuring, authoritative citation building, and direct answer formatting tailored to LLM retrieval algorithms and RAG (Retrieval-Augmented Generation) systems."
            }
          },
          {
            "@type": "Question",
            "name": "Why is Next.js development important for modern Technical SEO?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Next.js enables Server-Side Rendering (SSR) and Static Site Generation (SSG), ensuring search engine crawlers and AI bots can instantly parse pre-rendered HTML, achieve top Core Web Vitals scores, and maximize crawl budget efficiency."
            }
          },
          {
            "@type": "Question",
            "name": "What results can clients expect when working with Pial Mahmud?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Clients typically experience dramatic organic traffic growth (up to 400%+), improved search engine rankings for competitive commercial terms, appearance in AI search overviews, reduced cost-per-acquisition (CPA) on ads, and higher conversion rates."
            }
          },
          {
            "@type": "Question",
            "name": "How can I hire Pial Mahmud for a project or consult with him?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can contact Pial Mahmud directly through his official portfolio website at https://pialmahmud.com/contact or send an inquiry via email to schedule a discovery call and free initial SEO/Marketing audit."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <SEO
        slug="home"
        fallbackTitle="Pial Mahmud — AI-Powered Digital Marketing & SEO Expert"
        fallbackDescription="Pial Mahmud is a top-tier Digital Marketing & SEO Expert helping brands grow with AI-powered strategies, organic traffic, and high-converting campaigns."
        fallbackKeywords="Pial Mahmud, Digital Marketing Expert, SEO Expert, GEO, AEO, Technical SEO, Next.js Development, Meta Ads"
        schema={schemaData}
        ssrMeta={ssrMeta}
      />

      {/* Background */}

      {/* Hero glow blobs */}
      <div style={{
        position: 'fixed', top: '10%', right: '5%',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', bottom: '10%', left: '5%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <Navbar />

      <main style={{ position: 'relative', zIndex: 1 }}>

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center',
          padding: '120px 0 80px',
          background: 'radial-gradient(ellipse 100% 80% at 60% 40%, rgba(201,168,76,0.05) 0%, transparent 60%)',
        }}>
          <div className="container-main">
            <div className="grid-2col" style={{ gap: 60, alignItems: 'center' }}>
              
              {/* Left — Text */}
              <div style={{ animation: 'fadeInLeft 1s ease forwards' }}>
                <div className="section-label" style={{ marginBottom: 20 }}>
                  ✦ Available for Projects
                </div>
                
                <h1 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 'clamp(44px, 5vw, 72px)',
                  fontWeight: 800, lineHeight: 1.05,
                  color: '#F0F2F8', marginBottom: 8,
                  letterSpacing: '-0.02em',
                }}>
                  Pial Mahmud
                </h1>
                
                <div style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 700, marginBottom: 24, minHeight: 48 }}>
                  <span className="text-gradient-gold">{typedText}</span>
                  <span style={{ color: '#C9A84C', animation: 'blink 1s infinite' }}>|</span>
                </div>
                
                <p style={{
                  fontSize: 17, color: '#6B7A99', lineHeight: 1.8,
                  marginBottom: 36, maxWidth: 480,
                }}>
                  {heroDesc}
                </p>

                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 48 }}>
                  <Link href="/contact" className="btn-primary">
                    <span>{ctaText}</span>
                    <ArrowRight size={16} />
                  </Link>
                  <Link href="/case-studies" className="btn-outline">
                    <span>View Case Studies</span>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                  {[
                    { icon: '⭐', text: '5.0 Rating on Upwork' },
                    { icon: '🏆', text: 'Top Rated Plus' },
                    { icon: '✅', text: '100% Job Success' },
                  ].map((b, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      fontSize: 12, color: '#6B7A99', fontWeight: 500,
                    }}>
                      <span>{b.icon}</span> {b.text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — Photo */}
              <div style={{ display: 'flex', justifyContent: 'center', animation: 'fadeInRight 1s ease 0.3s both' }}>
                <div style={{ position: 'relative' }}>
                  {/* Decorative ring */}
                  <div style={{
                    position: 'absolute', inset: -20, borderRadius: '50%',
                    background: 'conic-gradient(from 0deg, #C9A84C, transparent, #00D4FF, transparent, #C9A84C)',
                    animation: 'spin-slow 8s linear infinite', opacity: 0.4,
                  }} />
                  <div style={{
                    position: 'absolute', inset: -12, borderRadius: '50%',
                    background: 'var(--bg-primary)',
                  }} />
                  
                  {/* Photo */}
                  <div style={{
                    width: 340, height: 400, borderRadius: 24,
                    overflow: 'hidden', position: 'relative',
                    border: '2px solid rgba(201,168,76,0.2)',
                    boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(201,168,76,0.1)',
                  }}>
                    {!settingsLoaded ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'linear-gradient(135deg, #111827, #0E1420)' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid rgba(201,168,76,0.4)', borderTopColor: '#C9A84C', animation: 'spin 1s linear infinite' }} />
                      </div>
                    ) : imageError || !profileImage ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, background: 'linear-gradient(135deg, #111827, #0E1420)' }}>
                        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #C9A84C, #A07830)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 700, color: '#080B14' }}>P</div>
                        <span style={{ color: '#6B7A99', fontSize: 13 }}>Pial Mahmud</span>
                      </div>
                    ) : (
                      <img
                        key={profileImage}
                        src={profileImage}
                        alt={profileImageAlt}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                        onError={() => setImageError(true)}
                      />
                    )}
                    {/* Gradient overlay */}
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
                      background: 'linear-gradient(to top, #080B14, transparent)',
                    }} />
                    {/* Name badge */}
                    <div style={{
                      position: 'absolute', bottom: 20, left: 20, right: 20,
                      background: 'rgba(8,11,20,0.85)', backdropFilter: 'blur(12px)',
                      borderRadius: 12, padding: '12px 16px',
                      border: '1px solid rgba(201,168,76,0.2)',
                    }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#F0F2F8' }}>Pial Mahmud</div>
                      <div style={{ fontSize: 12, color: '#C9A84C', marginTop: 2 }}>AI-Powered SEO & Digital Marketing Expert</div>
                    </div>
                  </div>

                  {/* Floating stat cards */}
                  <div className="hero-float-badge" style={{
                    position: 'absolute', top: 40, left: -80,
                    background: 'rgba(14,20,32,0.9)', backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    borderRadius: 14, padding: '14px 18px',
                    animation: 'float 3s ease-in-out infinite',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                  }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#C9A84C', fontFamily: 'Playfair Display, serif' }}>{experienceYears}</div>
                    <div style={{ fontSize: 11, color: '#6B7A99', marginTop: 2 }}>Years Experience</div>
                  </div>

                  <div className="hero-float-badge" style={{
                    position: 'absolute', bottom: 100, right: -80,
                    background: 'rgba(14,20,32,0.9)', backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(0,212,255,0.2)',
                    borderRadius: 14, padding: '14px 18px',
                    animation: 'float 3.5s ease-in-out 1s infinite',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                  }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#00D4FF', fontFamily: 'Playfair Display, serif' }}>{projectsCount}</div>
                    <div style={{ fontSize: 11, color: '#6B7A99', marginTop: 2 }}>Projects Done</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS BAR ──────────────────────────────────────────────── */}
        <section style={{ padding: '60px 0', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(14,20,32,0.5)' }}>
          <div className="container-main">
            <div className="grid-4col" style={{ gap: 24 }}>
              {stats.map((s, i) => (
                <div key={i} style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
                  <div className="stat-number">
                    <AnimatedCounter target={s.num} suffix={s.suffix} />
                  </div>
                  <div style={{ fontSize: 12, color: '#6B7A99', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CLIENTS / LOGOS ─────────────────────────────────────────── */}
        <section className="section">
          <div className="container-main">
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <div className="section-label">Trusted By</div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: '#F0F2F8' }}>
                Brands That Trust My Expertise
              </h2>
            </div>

            <div className="grid-4col" style={{ gap: 16 }}>
              {clients.map((c, i) => (
                <div key={i} className="client-logo-card">
                  <div style={{
                    width: 80, height: 50, position: 'relative',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <img
                      src={c.logo}
                      alt={c.name}
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      onError={(e) => {
                        const el = e.target as HTMLImageElement;
                        el.style.display = 'none';
                        const parent = el.parentElement!;
                        parent.innerHTML = `<div style="width:48px;height:48px;border-radius:10px;background:linear-gradient(135deg,#C9A84C,#A07830);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:18px;color:#080B14">${c.name[0]}</div>`;
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#F0F2F8', textAlign: 'center' }}>{c.name}</div>
                  <div style={{ fontSize: 10, color: '#6B7A99', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{c.tag}</div>
                </div>
              ))}
              {/* Add 8th slot — CTA */}
              <div className="client-logo-card" style={{ borderStyle: 'dashed', borderColor: 'rgba(201,168,76,0.2)' }}>
                <div style={{ fontSize: 28 }}>🤝</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#C9A84C', textAlign: 'center' }}>Your Brand Next?</div>
                <div style={{ fontSize: 10, color: '#6B7A99' }}>Let's collaborate</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SERVICES ────────────────────────────────────────────────── */}
        <section className="section" style={{ background: 'rgba(14,20,32,0.3)' }}>
          <div className="container-main">
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <div className="section-label">What I Do</div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: '#F0F2F8', marginBottom: 16 }}>
                Services That Drive Real Growth
              </h2>
              <p style={{ color: '#6B7A99', maxWidth: 500, margin: '0 auto' }}>
                From SEO to AI-powered campaigns — every service is tailored for maximum ROI.
              </p>
            </div>

            <div className="grid-3col" style={{ gap: 20 }}>
              {services.map((s, i) => (
                <div key={i} className="card">
                  <div className="service-icon-wrap">{s.icon}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#F0F2F8', marginBottom: 10 }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: '#6B7A99', lineHeight: 1.7 }}>{s.desc}</p>
                  <Link href="/services" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 16, fontSize: 12, fontWeight: 700, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: '0.08em', textDecoration: 'none' }}>
                    Learn More <ChevronRight size={14} />
                  </Link>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <Link href="/services" className="btn-outline">View All Services</Link>
            </div>
          </div>
        </section>

        {/* ── CASE STUDIES ────────────────────────────────────────────── */}
        <section className="section">
          <div className="container-main">
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <div className="section-label">Proven Results</div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: '#F0F2F8', marginBottom: 16 }}>
                Case Studies & Results
              </h2>
              <p style={{ color: '#6B7A99', maxWidth: 500, margin: '0 auto' }}>
                Real campaigns. Real results. See how I've helped brands achieve extraordinary growth.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {caseStudies.map((cs, i) => (
                <Link key={i} href={`/case-studies/${cs.slug}`} style={{ textDecoration: 'none' }}>
                  <div className="case-study-card">
                    {/* Header bar */}
                    <div style={{
                      height: 4,
                      background: `linear-gradient(90deg, ${cs.color}, transparent)`,
                    }} />
                    <div style={{ padding: 28 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                        <div style={{
                          width: 48, height: 48, borderRadius: 10,
                          background: '#0E1420', border: '1px solid rgba(255,255,255,0.08)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <img
                            src={cs.logo}
                            alt={cs.client}
                            style={{ width: 32, height: 32, objectFit: 'contain' }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).outerHTML = `<span style="font-size:20px;font-weight:700;color:#C9A84C">${cs.client[0]}</span>`;
                            }}
                          />
                        </div>
                        <span className="badge badge-gold" style={{ fontSize: 10 }}>{cs.tag}</span>
                      </div>
                      
                      <h3 style={{ fontSize: 17, fontWeight: 700, color: '#F0F2F8', lineHeight: 1.4, marginBottom: 10 }}>
                        {cs.title}
                      </h3>
                      <p style={{ fontSize: 13, color: '#6B7A99', lineHeight: 1.6, marginBottom: 20 }}>
                        {cs.desc}
                      </p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {cs.metrics.map((m: string, j: number) => (
                          <div key={j} style={{
                            padding: '5px 12px', borderRadius: 6,
                            background: 'rgba(201,168,76,0.08)',
                            border: '1px solid rgba(201,168,76,0.15)',
                            fontSize: 11, fontWeight: 700, color: '#C9A84C',
                          }}>{m}</div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 20, fontSize: 12, fontWeight: 700, color: '#C9A84C' }}>
                        Read Full Case Study <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <Link href="/case-studies" className="btn-outline">View All Case Studies</Link>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ────────────────────────────────────────────── */}
        <section className="section" style={{ background: 'rgba(14,20,32,0.3)' }}>
          <div className="container-main">
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <div className="section-label">Client Voices</div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: '#F0F2F8' }}>
                What My Clients Say
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {testimonials.map((t, i) => (
                <div key={i} className="card">
                  <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={14} fill="#C9A84C" color="#C9A84C" />
                    ))}
                  </div>
                  <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.8, fontStyle: 'italic', marginBottom: 20 }}>
                    "{t.text}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #C9A84C, #A07830)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 16, color: '#080B14',
                    }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#F0F2F8' }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: '#6B7A99' }}>{t.title}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ──────────────────────────────────────────────── */}
        <section style={{
          padding: '100px 0',
          background: 'linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(0,212,255,0.04) 100%)',
          borderTop: '1px solid rgba(201,168,76,0.1)',
          borderBottom: '1px solid rgba(201,168,76,0.1)',
        }}>
          <div className="container-main" style={{ textAlign: 'center' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Ready to Scale?</div>
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 800, color: '#F0F2F8',
              marginBottom: 20, lineHeight: 1.1,
            }}>
              Let's Build Something<br />
              <span className="text-gradient-gold">Extraordinary Together</span>
            </h2>
            <p style={{ color: '#6B7A99', maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.8 }}>
              Whether you need SEO, a full digital strategy, or AI integration — 
              I deliver results that transform businesses.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn-primary">
                <span>Start Your Project</span>
                <ArrowRight size={16} />
              </Link>
              <Link href="/case-studies" className="btn-outline">See My Work</Link>
            </div>
          </div>
        </section>

      {/* ── SEO AUDIT SECTION ───────────────────────────────────────────── */}
      <section id="seo-audit" className="section" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="container-main">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Free Tool</div>
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 800, color: '#F0F2F8',
              marginBottom: 14, lineHeight: 1.2,
            }}>
              Live Website
              <span className="text-gradient-gold"> SEO Audit</span>
            </h2>
            <p style={{ color: '#6B7A99', maxWidth: 500, margin: '0 auto', lineHeight: 1.8, fontSize: 15 }}>
              Get an instant on-page SEO score for any website. Checks 9 critical factors that impact your search rankings.
            </p>
          </div>

          {/* Input form */}
          <form onSubmit={runAudit} style={{
            maxWidth: 640, margin: '0 auto 40px',
            display: 'flex', gap: 12, flexWrap: 'wrap',
          }}>
            <input
              id="audit-url-input"
              type="text"
              value={auditUrl}
              onChange={e => setAuditUrl(e.target.value)}
              placeholder="https://yourwebsite.com"
              style={{
                flex: 1, minWidth: 220,
                padding: '14px 20px', borderRadius: 14,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#F0F2F8', fontSize: 14,
                outline: 'none',
              }}
            />
            <button
              id="run-audit-btn"
              type="submit"
              disabled={auditLoading}
              className="btn-primary"
              style={{ gap: 8 }}
            >
              {auditLoading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={16} />}
              {auditLoading ? 'Scanning...' : 'Run Audit'}
            </button>
          </form>

          {/* Error */}
          {auditError && (
            <div style={{
              maxWidth: 640, margin: '0 auto 24px',
              background: 'rgba(230,57,70,0.08)', borderRadius: 12,
              border: '1px solid rgba(230,57,70,0.2)', padding: '12px 20px',
              color: '#E63946', fontSize: 13,
            }}>
              <AlertCircle size={14} style={{ display: 'inline', marginRight: 8 }} />
              {auditError}
            </div>
          )}

          {/* Results */}
          {auditResult && (
            <div style={{ maxWidth: 760, margin: '0 auto' }}>
              {/* Score card */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 24,
                padding: '24px 28px', borderRadius: 20,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                marginBottom: 24, flexWrap: 'wrap',
              }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
                  border: `4px solid ${
                    auditResult.score >= 80 ? '#4ade80' : auditResult.score >= 60 ? '#F4C27F' : '#E63946'
                  }`,
                }}>
                  <span style={{
                    fontSize: 22, fontWeight: 800,
                    color: auditResult.score >= 80 ? '#4ade80' : auditResult.score >= 60 ? '#F4C27F' : '#E63946',
                    fontFamily: 'Playfair Display, serif',
                  }}>{auditResult.score}</span>
                  <span style={{ fontSize: 9, color: '#6B7A99', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Score</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, color: '#9AA5B4', wordBreak: 'break-all', marginBottom: 6 }}>{auditResult.url}</p>
                  <p style={{ fontSize: 14, color: '#F0F2F8', fontWeight: 600 }}>{auditResult.summary}</p>
                </div>
              </div>

              {/* Checks list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {auditResult.checks?.map((check: any, i: number) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 14,
                    padding: '14px 18px', borderRadius: 12,
                    background: check.pass ? 'rgba(74,222,128,0.04)' : 'rgba(230,57,70,0.04)',
                    border: `1px solid ${ check.pass ? 'rgba(74,222,128,0.15)' : 'rgba(230,57,70,0.15)' }`,
                  }}>
                    <span style={{ flexShrink: 0, marginTop: 1 }}>
                      {check.pass
                        ? <CheckCircle size={16} style={{ color: '#4ade80' }} />
                        : <AlertCircle size={16} style={{ color: '#E63946' }} />
                      }
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#F0F2F8' }}>{check.label}</span>
                        <span style={{
                          fontSize: 10, fontWeight: 700,
                          color: check.pass ? '#4ade80' : '#E63946',
                          background: check.pass ? 'rgba(74,222,128,0.1)' : 'rgba(230,57,70,0.1)',
                          padding: '2px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: 1,
                        }}>{check.pass ? 'Pass' : 'Fail'}</span>
                      </div>
                      <p style={{ fontSize: 12, color: '#6B7A99', marginTop: 3 }}>{check.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div style={{ textAlign: 'center', marginTop: 36 }}>
                <p style={{ color: '#9AA5B4', fontSize: 14, marginBottom: 20 }}>
                  Need help improving your score? Let&apos;s fix it together.
                </p>
                <Link href="/contact" className="btn-primary">
                  <span>Get a Free SEO Consultation</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      </main>

      {/* ── BOTTOM CTA SECTION ────────────────────────────────── */}
      <section style={{
        position: 'relative',
        padding: '100px 24px',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        {/* Gradient glow background */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, rgba(0,212,255,0.06) 40%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            borderRadius: 100,
            background: 'rgba(201,168,76,0.08)',
            border: '1px solid rgba(201,168,76,0.18)',
            marginBottom: 28,
          }}>
            <Zap size={13} style={{ color: '#C9A84C' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: 1.5 }}>
              Ready to Grow?
            </span>
          </div>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 46px)',
            fontWeight: 800,
            lineHeight: 1.15,
            color: '#F0F2F8',
            marginBottom: 20,
            fontFamily: "'Space Grotesk', sans-serif",
          }}>
            Let&apos;s Build Something{' '}
            <span style={{
              background: 'linear-gradient(135deg, #C9A84C, #00D4FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Extraordinary
            </span>
          </h2>
          <p style={{
            fontSize: 16,
            color: '#6B7A99',
            lineHeight: 1.8,
            maxWidth: 520,
            margin: '0 auto 40px',
          }}>
            Whether you need SEO dominance, conversion-focused funnels, or a complete digital transformation — I&apos;m here to make it happen.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
            <Link href="/contact" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '16px 36px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, #C9A84C, #E8C96A)',
              color: '#0A0E1A',
              fontWeight: 700,
              fontSize: 14,
              textTransform: 'uppercase',
              letterSpacing: 1,
              textDecoration: 'none',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              boxShadow: '0 4px 30px rgba(201,168,76,0.25)',
            }}>
              Start Your Project <ArrowRight size={16} />
            </Link>
            <Link href="/case-studies" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '16px 36px',
              borderRadius: 14,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#9AA5B4',
              fontWeight: 600,
              fontSize: 14,
              textDecoration: 'none',
              transition: 'border-color 0.2s ease, color 0.2s ease',
            }}>
              View Case Studies <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        /* ── Mobile Responsive Home ── */
        @media (max-width: 768px) {
          /* Hero floating stat badges – hide on mobile to avoid overflow */
          .hero-float-badge { display: none !important; }

          /* Hero grid collapses to column, image first on mobile actually stays below */
          .hero-photo-wrap { margin-top: 40px; }

          /* CTA buttons full-width on mobile */
          .hero-cta-group { flex-direction: column !important; align-items: stretch !important; }
          .hero-cta-group a { text-align: center; justify-content: center; width: 100%; }

          /* ROI calculator responsive */
          .roi-grid { grid-template-columns: 1fr !important; }

          /* Testimonials */
          .testimonials-grid { grid-template-columns: 1fr !important; }
        }

        @media (max-width: 480px) {
          /* Trust badges wrap on very small screens */
          .trust-badges { flex-direction: column; gap: 8px !important; }
        }
      `}</style>
    </>
  );
}

// Server-side render SEO metadata from admin panel on every request
// This ensures search engines and social crawlers always see the latest meta tags
export async function getServerSideProps() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/pages?slug=home`);
    if (res.ok) {
      const page = await res.json();
      return {
        props: {
          ssrMeta: {
            meta_title: page.meta_title || null,
            meta_description: page.meta_description || null,
            focus_keyword: page.focus_keyword || null,
            og_image: page.og_image || null,
          },
        },
      };
    }
  } catch {
    // Fall back to client-side fetch if server request fails
  }
  return { props: { ssrMeta: null } };
}
