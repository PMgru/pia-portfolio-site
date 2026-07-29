import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowRight, Download, CheckCircle, Award, BookOpen, Briefcase } from 'lucide-react';

const values = [
  { icon: 'ðŸŽ¯', title: 'Results-First', desc: 'Every strategy is built around measurable outcomes and real ROI, not vanity metrics.' },
  { icon: 'ðŸ¤–', title: 'AI-Augmented', desc: 'I leverage cutting-edge AI tools to find opportunities others miss and execute faster.' },
  { icon: 'ðŸ“Š', title: 'Data-Driven', desc: 'Every decision is backed by data â€” no guesswork, no shortcuts, no wasted budget.' },
  { icon: 'ðŸ¤', title: 'Client-Centric', desc: 'I treat your business like my own. Your growth is my personal mission.' },
];

export default function AboutPage({ ssrMeta }: { ssrMeta?: any }) {
  // Start with empty string â€” no image is shown until API responds
  // This prevents the wrong/local fallback path from firing onError before we know the real URL
  const [profileImage, setProfileImage] = useState('');
  const [profileImageAlt, setProfileImageAlt] = useState('Pial Mahmud â€” Digital Marketing Expert');
  const [imageError, setImageError] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [skills, setSkills] = useState<{name: string, level: number}[]>([]);
  const [experiences, setExperiences] = useState<{role: string, company: string, period: string, desc: string}[]>([]);
  const [aboutTitle, setAboutTitle] = useState('Turning Digital Presence into | Measurable Growth');
  const [aboutIntro, setAboutIntro] = useState("I'm Pial Mahmud, an AI-powered Digital Marketing & SEO Expert based in Bangladesh, working with brands globally. With 5+ years of hands-on experience, I've helped businesses across EdTech, Real Estate, Media, and Technology achieve transformational results.");
  const [aboutDesc, setAboutDesc] = useState("I combine deep technical SEO expertise with AI tools, creative content strategy, and data-driven campaign management to deliver growth that lasts â€” not just quick wins.");
  const [yearsExp, setYearsExp] = useState('');

  // Reset imageError whenever the URL changes so a fresh load attempt is made
  useEffect(() => {
    if (profileImage) setImageError(false);
  }, [profileImage]);

  const handleCvDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    toast('CV is being prepared. Contact Pial directly at hello@pialmahmud.com to request it.', {
      icon: 'ðŸ“„',
      style: { background: '#0E1420', color: '#F0F2F8', border: '1px solid rgba(201,168,76,0.25)', fontSize: 13 },
      duration: 5000,
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const [settingsRes, expRes, skillRes] = await Promise.all([
          fetch('/api/settings?home=1'),
          fetch('/api/experiences'),
          fetch('/api/skills'),
        ]);

        if (settingsRes.ok) {
          const data = await settingsRes.json();
          // /api/settings?home=1 returns { settings: {...}, home: {...} }
          const s = data.settings || data;
          // Always set profileImage from API â€” even if empty string,
          // so we don't render a broken local path
          setProfileImage(s.profile_image || '');
          if (s.profile_image_alt_text) setProfileImageAlt(s.profile_image_alt_text);
          setImageError(false); // reset on fresh data
          if (s.about_title) setAboutTitle(s.about_title);
          if (s.about_intro) setAboutIntro(s.about_intro);
          if (s.about_desc) setAboutDesc(s.about_desc);
          // Use DB value; fall back to '5+' only if truly absent
          setYearsExp(s.years_exp || '5+');
        }
        setSettingsLoaded(true);

        if (expRes.ok) {
          const expData = await expRes.json();
          if (Array.isArray(expData)) {
            setExperiences(expData.sort((a,b) => (a.display_order || 0) - (b.display_order || 0)).map(e => ({
              role: e.job_title,
              company: e.company_name,
              period: `${e.start_date ? new Date(e.start_date).getFullYear() : ''} â€” ${e.is_current ? 'Present' : (e.end_date ? new Date(e.end_date).getFullYear() : '')}`,
              desc: e.description
            })));
          }
        }
        if (skillRes.ok) {
          const skillData = await skillRes.json();
          if (Array.isArray(skillData)) {
            setSkills(skillData.sort((a,b) => (a.display_order || 0) - (b.display_order || 0)).map(s => ({
              name: s.skill_name,
              level: s.proficiency_level
            })));
          }
        }
      } catch { /* keep defaults */ }
    })();
  }, []);

  return (
    <>
      <SEO
        slug="about"
        fallbackTitle="About Pial Mahmud — AI-Powered Digital Marketing Expert"
        fallbackDescription="Learn about Pial Mahmud — a top-tier digital marketing and SEO expert with 5+ years of experience driving exceptional growth for global brands."
        fallbackKeywords="About Pial Mahmud, Digital Marketing Expert, Technical SEO Specialist, Bangladesh SEO Consultant"
        ssrMeta={ssrMeta}
      />

      <div style={{ background: '#080B14', minHeight: '100vh' }}>
        <Toaster position="top-right" />
        <div className="grid-overlay" />
        <Navbar />

        <main style={{ position: 'relative', zIndex: 1, paddingTop: 100 }}>

          {/* â”€â”€ HERO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <section style={{ padding: '80px 0 60px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="container-main">
              <div className="grid-2col" style={{ gap: 80, alignItems: 'center' }}>
                
                {/* Photo */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      width: 340, height: 420, borderRadius: 24,
                      overflow: 'hidden',
                      border: '2px solid rgba(201,168,76,0.2)',
                      boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
                      background: 'linear-gradient(135deg, #111827, #0E1420)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {/* Show placeholder until settings loaded, then show image or fallback */}
                      {!settingsLoaded ? (
                        // Loading skeleton
                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #111827, #0E1420)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid rgba(201,168,76,0.4)', borderTopColor: '#C9A84C', animation: 'spin 1s linear infinite' }} />
                        </div>
                      ) : imageError || !profileImage ? (
                        <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, #C9A84C, #A07830)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 42, fontWeight: 700, color: '#080B14' }}>P</div>
                      ) : (
                        <img
                          key={profileImage}
                          src={profileImage}
                          alt={profileImageAlt || 'Pial Mahmud'}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                          onError={() => setImageError(true)}
                        />
                      )}
                    </div>
                    
                    {/* Floating badge */}
                    <div style={{
                      position: 'absolute', bottom: -20, right: -20,
                      background: 'linear-gradient(135deg, #C9A84C, #A07830)',
                      borderRadius: 14, padding: '16px 20px',
                      boxShadow: '0 20px 40px rgba(201,168,76,0.3)',
                    }}>
                      <div style={{ fontSize: 24, fontWeight: 800, color: '#080B14', fontFamily: 'Playfair Display, serif' }}>{yearsExp || '5+'}</div>
                      <div style={{ fontSize: 11, color: '#080B14', fontWeight: 700, opacity: 0.7 }}>Years Expert</div>
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div>
                  <div className="section-label">About Me</div>
                  <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 800, color: '#F0F2F8', marginBottom: 20, lineHeight: 1.1 }}>
                    {aboutTitle.includes('|') ? (
                      <>
                        {aboutTitle.split('|')[0]}<br />
                        <span className="text-gradient-gold">{aboutTitle.split('|')[1]}</span>
                      </>
                    ) : (
                      aboutTitle
                    )}
                  </h1>
                  <p style={{ fontSize: 16, color: '#6B7A99', lineHeight: 1.8, marginBottom: 20 }}>
                    {aboutIntro}
                  </p>
                  <p style={{ fontSize: 16, color: '#6B7A99', lineHeight: 1.8, marginBottom: 32 }}>
                    {aboutDesc}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 32 }}>
                    {['SEO Expert', 'AI Strategist', 'Content Architect', 'Growth Hacker'].map((t) => (
                      <span key={t} className="badge badge-gold">{t}</span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 16 }}>
                    <Link href="/contact" className="btn-primary">
                      <span>Work With Me</span>
                      <ArrowRight size={16} />
                    </Link>
                    <a
                      href="/pial-mahmud-cv.pdf"
                      onClick={handleCvDownload}
                      className="btn-outline"
                      style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
                    >
                      <Download size={16} />
                      <span>Download CV</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* â”€â”€ VALUES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <section className="section">
            <div className="container-main">
              <div style={{ textAlign: 'center', marginBottom: 60 }}>
                <div className="section-label">My Philosophy</div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#F0F2F8' }}>
                  How I Work
                </h2>
              </div>
              <div className="grid-4col" style={{ gap: 20 }}>
                {values.map((v, i) => (
                  <div key={i} className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 36, marginBottom: 16 }}>{v.icon}</div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#F0F2F8', marginBottom: 10 }}>{v.title}</h3>
                    <p style={{ fontSize: 13, color: '#6B7A99', lineHeight: 1.7 }}>{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* â”€â”€ SKILLS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <section className="section" style={{ background: 'rgba(14,20,32,0.3)' }}>
            <div className="container-main">
              <div className="grid-2col about-skills-grid" style={{ gap: 'clamp(32px, 6vw, 80px)', alignItems: 'start' }}>
                <div>
                  <div className="section-label">Expertise</div>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#F0F2F8', marginBottom: 40 }}>
                    Skills &amp; Proficiency
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {skills.map((s) => (
                      <div key={s.name}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#F0F2F8' }}>{s.name}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#C9A84C' }}>{s.level}%</span>
                        </div>
                        <div className="skill-bar">
                          <div className="skill-bar-fill" style={{ width: `${s.level}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="section-label">Certifications</div>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#F0F2F8', marginBottom: 30 }}>
                    Tools &amp; Platforms
                  </h2>
                  <div className="grid-3col" style={{ gap: 12 }}>
                    {['Google Analytics', 'Ahrefs', 'SEMrush', 'Screaming Frog', 'Google Ads', 'Meta Ads', 'ChatGPT', 'Midjourney', 'HubSpot', 'Mailchimp', 'Canva Pro', 'Notion'].map((tool) => (
                      <div key={tool} style={{
                        padding: '10px 14px', borderRadius: 8, textAlign: 'center',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        fontSize: 11, fontWeight: 600, color: '#9CA3AF',
                        transition: 'all 0.2s',
                      }}>
                        {tool}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* â”€â”€ EXPERIENCE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <section className="section">
            <div className="container-main">
              <div style={{ textAlign: 'center', marginBottom: 60 }}>
                <div className="section-label">Work History</div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#F0F2F8' }}>
                  Professional Experience
                </h2>
              </div>
              <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 0 }}>
                {experiences.map((exp, i) => (
                  <div key={i} style={{ display: 'flex', gap: 24, paddingBottom: 40 }}>
                    {/* Timeline dot */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                      <div style={{
                        width: 14, height: 14, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #C9A84C, #A07830)',
                        border: '3px solid #080B14',
                        boxShadow: '0 0 0 2px rgba(201,168,76,0.3)',
                        marginTop: 4,
                      }} />
                      {i < experiences.length - 1 && (
                        <div style={{ width: 1, flex: 1, marginTop: 8, background: 'linear-gradient(to bottom, rgba(201,168,76,0.3), transparent)' }} />
                      )}
                    </div>
                    {/* Content */}
                    <div className="card" style={{ flex: 1, marginBottom: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                        <div>
                          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#F0F2F8' }}>{exp.role}</h3>
                          <div style={{ fontSize: 13, color: '#C9A84C', fontWeight: 600, marginTop: 4 }}>{exp.company}</div>
                        </div>
                        <span className="badge badge-gold" style={{ fontSize: 11 }}>{exp.period}</span>
                      </div>
                      <p style={{ fontSize: 13, color: '#6B7A99', lineHeight: 1.7 }}>{exp.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* â”€â”€ CTA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <section style={{ padding: '80px 0', textAlign: 'center', background: 'rgba(14,20,32,0.3)' }}>
            <div className="container-main">
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#F0F2F8', marginBottom: 20 }}>
                Ready to Work Together?
              </h2>
              <p style={{ color: '#6B7A99', marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
                Let's turn your digital presence into your most powerful growth engine.
              </p>
              <Link href="/contact" className="btn-primary">
                <span>Get In Touch</span>
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

export async function getServerSideProps() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(baseUrl + '/api/pages?slug=about');
    if (res.ok) {
      const page = await res.json();
      return {
        props: {
          ssrMeta: {
            meta_title: page.meta_title || null,
            meta_description: page.meta_description || null,
            focus_keyword: page.focus_keyword || null,
          },
        },
      };
    }
  } catch {
    // Fall back to client-side fetch
  }
  return { props: { ssrMeta: null } };
}