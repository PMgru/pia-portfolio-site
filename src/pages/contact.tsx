import { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Mail, Phone, MapPin, Send, Clock, MessageSquare, Linkedin, Twitter, Instagram } from 'lucide-react';

// services and budgets loaded dynamically from admin settings

export default function ContactPage({ ssrMeta }: { ssrMeta?: any }) {
  const [form, setForm] = useState({ name: '', email: '', company: '', service: '', budget: '', message: '', website: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [contactServices, setContactServices] = useState<string[]>([
    'Technical SEO Optimization',
    'Full Digital Marketing Strategy',
    'AI Marketing Setup',
    'Content Strategy',
    'Google Ads / PPC',
    'Social Media Management',
    'Link Building',
    'Other / Not Sure',
  ]);
  const [budgetOptions, setBudgetOptions] = useState<string[]>([
    'Under $500',
    '$500 â€“ $1,000',
    '$1,000 â€“ $2,500',
    '$2,500 â€“ $5,000',
    '$5,000+',
  ]);

  const [info, setInfo] = useState({
    email: 'pial@pialmahmud.com',
    phone: '+880 1XXX-XXXXXX',
    whatsappUrl: 'https://wa.me/8801XXXXXXXXX',
    location: 'Dhaka, Bangladesh',
    availability: 'Monâ€“Fri, 9amâ€“6pm (BST)',
    linkedin: 'https://linkedin.com/in/pialmahmud',
  });

  useEffect(() => {
    fetch('/api/settings?home=1').then(res => res.json()).then(data => {
      const s = data.settings || data;
      setInfo({
        email: s.email || 'pial@pialmahmud.com',
        phone: s.phone || '+880 1XXX-XXXXXX',
        whatsappUrl: s.whatsapp_url || 'https://wa.me/8801XXXXXXXXX',
        location: s.location || 'Dhaka, Bangladesh',
        availability: s.availability || 'Monâ€“Fri, 9amâ€“6pm (BST)',
        linkedin: s.linkedin_url || 'https://linkedin.com/in/pialmahmud',
      });
      // Load dynamic services from admin
      if (s.contact_services) {
        try {
          const parsed = typeof s.contact_services === 'string' ? JSON.parse(s.contact_services) : s.contact_services;
          if (Array.isArray(parsed) && parsed.length > 0) setContactServices(parsed);
        } catch { /* use default */ }
      }
      // Load dynamic budget options from admin
      if (s.budget_options) {
        try {
          const parsed = typeof s.budget_options === 'string' ? JSON.parse(s.budget_options) : s.budget_options;
          if (Array.isArray(parsed) && parsed.length > 0) setBudgetOptions(parsed);
        } catch { /* use default */ }
      }
    }).catch(console.error);
  }, []);

  const contactInfo = [
    { icon: Mail, label: 'Email', value: info.email, href: `mailto:${info.email}` },
    { icon: Phone, label: 'WhatsApp', value: info.phone, href: info.whatsappUrl },
    { icon: MapPin, label: 'Location', value: info.location, href: null },
    { icon: Clock, label: 'Availability', value: info.availability, href: null },
  ];

  const socialLinks = [
    { icon: Linkedin, label: 'LinkedIn', href: info.linkedin, color: '#0A66C2' },
    { icon: Twitter, label: 'Twitter/X', href: 'https://twitter.com/pialmahmud', color: '#1DA1F2' },
    { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/pialmahmud', color: '#E1306C' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again or email directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        slug="contact"
        fallbackTitle="Contact Pial Mahmud â€” Start Your Growth Journey Today"
        fallbackDescription="Get in touch with Pial Mahmud for digital marketing, SEO, and AI-powered growth strategies. Free consultation, 24-hour response time."
        fallbackKeywords="Hire SEO Expert, Digital Marketing Consultation, Technical SEO Audit Request, Contact Pial Mahmud"
              ssrMeta={ssrMeta}
      />

      <div style={{ background: '#080B14', minHeight: '100vh' }}>
        <div className="grid-overlay" />
        <Navbar />

        <main style={{ position: 'relative', zIndex: 1, paddingTop: 100 }}>

          {/* â”€â”€ PAGE HERO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <section style={{ padding: '80px 0 60px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="container-main">
              <div className="section-label" style={{ justifyContent: 'center' }}>Let's Connect</div>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 800, color: '#F0F2F8', marginBottom: 20, lineHeight: 1.1 }}>
                Start Your Growth<br />
                <span className="text-gradient-gold">Journey Today</span>
              </h1>
              <p style={{ fontSize: 17, color: '#6B7A99', maxWidth: 480, margin: '0 auto', lineHeight: 1.8 }}>
                Tell me about your project and goals. I'll get back to you within 24 hours 
                with a tailored strategy and clear next steps.
              </p>
            </div>
          </section>

          {/* â”€â”€ CONTACT MAIN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <section className="section">
            <div className="container-main">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 60, alignItems: 'start' }}>

                {/* Left â€” Info */}
                <div>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: '#F0F2F8', marginBottom: 16 }}>
                    Get In Touch
                  </h2>
                  <p style={{ fontSize: 14, color: '#6B7A99', lineHeight: 1.8, marginBottom: 36 }}>
                    Whether you're looking to scale your SEO, launch a campaign, or discuss an AI marketing strategy â€” 
                    I'm here to help. Let's talk.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 40 }}>
                    {contactInfo.map((c, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                          background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <c.icon size={18} color="#C9A84C" />
                        </div>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7A99', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{c.label}</div>
                          {c.href ? (
                            <a href={c.href} style={{ fontSize: 14, fontWeight: 600, color: '#F0F2F8', textDecoration: 'none' }}
                              onMouseEnter={e => (e.target as HTMLElement).style.color = '#C9A84C'}
                              onMouseLeave={e => (e.target as HTMLElement).style.color = '#F0F2F8'}
                            >{c.value}</a>
                          ) : (
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#F0F2F8' }}>{c.value}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Social */}
                  <div className="divider" style={{ marginBottom: 28 }} />
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#6B7A99', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Follow Me</div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {socialLinks.map((s, i) => (
                      <a
                        key={i}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          width: 44, height: 44, borderRadius: 10,
                          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#6B7A99', textDecoration: 'none', transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = s.color; (e.currentTarget as HTMLElement).style.color = s.color; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.color = '#6B7A99'; }}
                      >
                        <s.icon size={18} />
                      </a>
                    ))}
                  </div>

                  {/* Response time */}
                  <div style={{
                    marginTop: 32, padding: '16px 20px', borderRadius: 12,
                    background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)',
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px rgba(16,185,129,0.6)' }} />
                    <span style={{ fontSize: 13, color: '#10B981', fontWeight: 600 }}>
                      Typically responds within 24 hours
                    </span>
                  </div>
                </div>

                {/* Right â€” Form */}
                <div className="card" style={{ padding: 40 }}>
                  {submitted ? (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                      <div style={{ fontSize: 60, marginBottom: 20 }}>ðŸŽ‰</div>
                      <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: '#F0F2F8', marginBottom: 12 }}>
                        Message Received!
                      </h3>
                      <p style={{ color: '#6B7A99', lineHeight: 1.8 }}>
                        Thank you for reaching out. I'll review your project details and 
                        get back to you within 24 hours with a custom strategy proposal.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: '#F0F2F8', marginBottom: 28 }}>
                        Send a Message
                      </h3>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#6B7A99', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Your Name *</label>
                          <input
                            type="text"
                            placeholder="John Smith"
                            className="form-input"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#6B7A99', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Email Address *</label>
                          <input
                            type="email"
                            placeholder="john@company.com"
                            className="form-input"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#6B7A99', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Company / Website</label>
                        <input
                          type="text"
                          placeholder="Your Company Name"
                          className="form-input"
                          value={form.company}
                          onChange={e => setForm({ ...form, company: e.target.value })}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#6B7A99', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Service Needed</label>
                          <select
                            className="form-input"
                            value={form.service}
                            onChange={e => setForm({ ...form, service: e.target.value })}
                            style={{ cursor: 'pointer', appearance: 'none' }}
                          >
                            <option value="" style={{ background: '#0E1420', color: '#F0F2F8' }}>Select a service...</option>
                            {contactServices.map(s => <option key={s} value={s} style={{ background: '#0E1420', color: '#F0F2F8' }}>{s}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#6B7A99', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Monthly Budget</label>
                          <select
                            className="form-input"
                            value={form.budget}
                            onChange={e => setForm({ ...form, budget: e.target.value })}
                            style={{ cursor: 'pointer', appearance: 'none' }}
                          >
                            <option value="" style={{ background: '#0E1420', color: '#F0F2F8' }}>Select budget...</option>
                            {budgetOptions.map(b => <option key={b} value={b} style={{ background: '#0E1420', color: '#F0F2F8' }}>{b}</option>)}
                          </select>
                        </div>
                      </div>

                      <div style={{ marginBottom: 24 }}>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#6B7A99', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Message *</label>
                        <textarea
                          placeholder="Tell me about your project, goals, and what results you're hoping to achieve..."
                          className="form-input"
                          rows={5}
                          value={form.message}
                          onChange={e => setForm({ ...form, message: e.target.value })}
                          required
                          style={{ resize: 'none' }}
                        />
                      </div>

                      {/* Honeypot field â€” hidden from real users, catches bots. */}
                      <input
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={form.website}
                        onChange={e => setForm({ ...form, website: e.target.value })}
                        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
                        aria-hidden="true"
                      />

                      {error && (
                        <div style={{
                          marginBottom: 16, padding: '12px 16px', borderRadius: 10,
                          background: 'rgba(230,57,70,0.08)', border: '1px solid rgba(230,57,70,0.2)',
                          color: '#E63946', fontSize: 13,
                        }}>
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        style={{
                          width: '100%', padding: '14px 24px', borderRadius: 8,
                          background: 'linear-gradient(135deg, #C9A84C, #A07830)',
                          color: '#080B14', fontWeight: 800, fontSize: 14,
                          letterSpacing: '0.05em', textTransform: 'uppercase',
                          border: 'none', cursor: loading ? 'wait' : 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                          opacity: loading ? 0.7 : 1, transition: 'all 0.3s',
                        }}
                      >
                        {loading ? (
                          <span style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #080B14', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                        ) : (
                          <>Send Message <Send size={16} /></>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </section>

        </main>
        <Footer />
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        select option {
          background: #0E1420;
          color: #F0F2F8;
        }
        select {
          color-scheme: dark;
        }
      `}</style>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(baseUrl + '/api/pages?slug=contact');
    if (res.ok) {
      const page = await res.json();
      return { props: { ssrMeta: { meta_title: page.meta_title || null, meta_description: page.meta_description || null, focus_keyword: page.focus_keyword || null } } };
    }
  } catch {}
  return { props: { ssrMeta: null } };
}