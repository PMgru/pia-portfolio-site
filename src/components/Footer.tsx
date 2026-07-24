import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Mail, MapPin, Linkedin, Twitter, Instagram, Youtube, ArrowUpRight, Send, CheckCircle } from 'lucide-react';

const footerLinks = {
  Pages: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
  Services: [
    { label: 'Technical SEO', href: '/services' },
    { label: 'Digital Marketing', href: '/services' },
    { label: 'AI Marketing', href: '/services' },
    { label: 'Content Strategy', href: '/services' },
    { label: 'Google Ads', href: '/services' },
    { label: 'Link Building', href: '/services' },
  ],
};

const defaultSocials = [
  { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn', color: '#0A66C2' },
  { href: 'https://twitter.com', icon: Twitter, label: 'Twitter', color: '#1DA1F2' },
  { href: 'https://instagram.com', icon: Instagram, label: 'Instagram', color: '#E1306C' },
  { href: 'https://youtube.com', icon: Youtube, label: 'YouTube', color: '#FF0000' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [info, setInfo] = useState({
    contactEmail: 'pial@pialmahmud.com',
    location: 'Dhaka, Bangladesh',
    linkedin: 'https://linkedin.com',
  });

  useEffect(() => {
    fetch('/api/settings?home=1').then(res => res.json()).then(data => {
      const s = data.settings || data;
      setInfo({
        contactEmail: s.email || 'pial@pialmahmud.com',
        location: s.location || 'Dhaka, Bangladesh',
        linkedin: s.linkedin_url || 'https://linkedin.com',
      });
    }).catch(console.error);
  }, []);

  const socials = [
    { href: info.linkedin, icon: Linkedin, label: 'LinkedIn', color: '#0A66C2' },
    { href: 'https://twitter.com', icon: Twitter, label: 'Twitter', color: '#1DA1F2' },
    { href: 'https://instagram.com', icon: Instagram, label: 'Instagram', color: '#E1306C' },
    { href: 'https://youtube.com', icon: Youtube, label: 'YouTube', color: '#FF0000' },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="site-footer">

      {/* ── CTA BAND ─────────────────────────────────────────── */}
      <div className="footer-cta-band">
        <div className="container-main">
          <div className="footer-cta-inner">
            <div className="footer-cta-text">
              <h2 className="footer-cta-heading">
                Ready to <span className="footer-gold">10× Your Growth?</span>
              </h2>
              <p className="footer-cta-sub">
                Book a free 30-minute strategy call — no commitment, just clarity.
              </p>
            </div>
            <Link href="/contact" className="footer-cta-btn">
              Start Free Consultation <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── MAIN BODY ─────────────────────────────────────────── */}
      <div className="footer-body">
        <div className="container-main">
          <div className="footer-grid">

            {/* Brand Column */}
            <div className="footer-brand">
              <Link href="/" className="footer-logo">
                <div className="footer-logo-icon">P</div>
                <span className="footer-logo-name">Pial<span className="footer-gold">.</span></span>
              </Link>

              <p className="footer-desc">
                AI-Powered Digital Marketing &amp; SEO Expert helping ambitious brands achieve
                extraordinary growth through data-driven strategies.
              </p>

              <div className="footer-contact-list">
                <a href={`mailto:${info.contactEmail}`} className="footer-contact-item">
                  <Mail size={14} className="footer-contact-icon" />
                  {info.contactEmail}
                </a>
                <div className="footer-contact-item">
                  <MapPin size={14} className="footer-contact-icon" />
                  {info.location}
                </div>
              </div>

              {/* Social icons */}
              <div className="footer-socials">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-icon"
                    aria-label={s.label}
                    title={s.label}
                  >
                    <s.icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Nav Columns */}
            {Object.entries(footerLinks).map(([group, links]) => (
              <div key={group} className="footer-link-col">
                <h4 className="footer-col-heading">{group}</h4>
                <ul className="footer-link-list">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="footer-link">
                        <span className="footer-link-dot" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Newsletter Column */}
            <div className="footer-newsletter">
              <h4 className="footer-col-heading">Stay Updated</h4>
              <p className="footer-newsletter-desc">
                Get weekly SEO &amp; marketing tips delivered to your inbox. No spam, ever.
              </p>

              {subscribed ? (
                <div className="footer-subscribed">
                  <CheckCircle size={18} />
                  <span>You're subscribed! 🎉</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="footer-form">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="footer-input"
                    required
                  />
                  <button type="submit" className="footer-submit" aria-label="Subscribe">
                    <Send size={14} />
                  </button>
                </form>
              )}

              <p className="footer-trust-badge">
                🔒 No spam · Unsubscribe anytime
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ──────────────────────────────────────── */}
      <div className="footer-bottom">
        <div className="container-main">
          <div className="footer-bottom-inner">
            <p className="footer-copyright">
              © {new Date().getFullYear()} <strong>Pial Mahmud</strong>. All rights reserved.
              Built with ❤️ for results.
            </p>
          </div>
        </div>
      </div>

      {/* ── STYLES ──────────────────────────────────────────── */}
      <style jsx>{`
        /* ─── Footer Wrapper ─── */
        .site-footer {
          position: relative;
          z-index: 2;
        }

        /* ─── CTA Band ─── */
        .footer-cta-band {
          background: linear-gradient(135deg, rgba(201,168,76,0.10) 0%, rgba(0,212,255,0.04) 100%);
          border-top: 1px solid rgba(201,168,76,0.15);
          border-bottom: 1px solid rgba(201,168,76,0.08);
          padding: 56px 0;
        }
        .footer-cta-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          flex-wrap: wrap;
        }
        .footer-cta-text { flex: 1; min-width: 240px; }
        .footer-cta-heading {
          font-family: 'Playfair Display', serif;
          font-size: clamp(22px, 3.5vw, 36px);
          font-weight: 800;
          color: #F0F2F8;
          margin-bottom: 8px;
          line-height: 1.2;
        }
        .footer-cta-sub {
          font-size: 15px;
          color: #6B7A99;
          line-height: 1.6;
        }
        .footer-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          border-radius: 8px;
          background: linear-gradient(135deg, #C9A84C, #A07830);
          color: #080B14;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          text-decoration: none;
          white-space: nowrap;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }
        .footer-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 40px rgba(201,168,76,0.35);
        }

        /* ─── Body ─── */
        .footer-body {
          background: #070A12;
          padding: 72px 0 56px;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.6fr;
          gap: 48px;
        }

        /* ─── Brand ─── */
        .footer-brand { display: flex; flex-direction: column; gap: 0; }
        .footer-logo {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          margin-bottom: 20px;
        }
        .footer-logo-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, #C9A84C, #A07830);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          color: #080B14;
          font-size: 18px;
          flex-shrink: 0;
        }
        .footer-logo-name {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 20px;
          color: #F0F2F8;
        }
        .footer-gold { color: #C9A84C; }
        .footer-desc {
          font-size: 13.5px;
          color: #6B7A99;
          line-height: 1.8;
          max-width: 300px;
          margin-bottom: 20px;
        }
        .footer-contact-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
        .footer-contact-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #6B7A99;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-contact-item:hover { color: #C9A84C; }
        .footer-contact-icon { color: #C9A84C; flex-shrink: 0; }

        /* ─── Socials ─── */
        .footer-socials { display: flex; gap: 10px; flex-wrap: wrap; }
        .footer-social-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6B7A99;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          text-decoration: none;
          transition: all 0.3s;
        }
        .footer-social-icon:hover {
          color: #C9A84C;
          border-color: rgba(201,168,76,0.35);
          background: rgba(201,168,76,0.08);
          transform: translateY(-2px);
        }

        /* ─── Link Columns ─── */
        .footer-link-col { display: flex; flex-direction: column; }
        .footer-col-heading {
          font-size: 11px;
          font-weight: 700;
          color: #F0F2F8;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 20px;
        }
        .footer-link-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .footer-link {
          font-size: 13px;
          color: #6B7A99;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: color 0.2s, gap 0.2s;
        }
        .footer-link:hover { color: #C9A84C; gap: 12px; }
        .footer-link-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(201,168,76,0.5);
          flex-shrink: 0;
          transition: background 0.2s;
        }
        .footer-link:hover .footer-link-dot { background: #C9A84C; }

        /* ─── Newsletter ─── */
        .footer-newsletter { display: flex; flex-direction: column; }
        .footer-newsletter-desc {
          font-size: 13px;
          color: #6B7A99;
          line-height: 1.7;
          margin-bottom: 18px;
        }
        .footer-form {
          display: flex;
          gap: 0;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          transition: border-color 0.3s;
          margin-bottom: 12px;
        }
        .footer-form:focus-within { border-color: rgba(201,168,76,0.4); }
        .footer-input {
          flex: 1;
          padding: 11px 14px;
          background: transparent;
          border: none;
          outline: none;
          color: #F0F2F8;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          min-width: 0;
        }
        .footer-input::placeholder { color: #3D4A66; }
        .footer-submit {
          padding: 11px 14px;
          background: linear-gradient(135deg, #C9A84C, #A07830);
          border: none;
          color: #080B14;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s;
          flex-shrink: 0;
        }
        .footer-submit:hover { opacity: 0.85; }
        .footer-trust-badge { font-size: 11px; color: #3D4A66; }
        .footer-subscribed {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #10B981;
          font-weight: 600;
          padding: 12px 0;
          margin-bottom: 12px;
        }

        /* ─── Bottom Bar ─── */
        .footer-bottom {
          background: #040609;
          border-top: 1px solid rgba(255,255,255,0.04);
          padding: 20px 0;
        }
        .footer-bottom-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .footer-copyright {
          font-size: 12.5px;
          color: #3D4A66;
          line-height: 1.5;
        }
        .footer-copyright strong { color: #6B7A99; }
        .footer-bottom-links { display: flex; gap: 20px; align-items: center; }
        .footer-admin-link {
          font-size: 11px;
          color: #3D4A66;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: color 0.2s;
        }
        .footer-admin-link:hover { color: #C9A84C; }

        /* ─── TABLET ─── */
        @media (max-width: 960px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 36px;
          }
          .footer-brand { grid-column: 1 / -1; }
          .footer-newsletter { grid-column: 1 / -1; }
        }

        /* ─── MOBILE ─── */
        @media (max-width: 640px) {
          .footer-cta-band { padding: 40px 0; }
          .footer-cta-inner { flex-direction: column; text-align: center; align-items: stretch; }
          .footer-cta-btn { text-align: center; justify-content: center; }
          .footer-body { padding: 48px 0 40px; }
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .footer-brand { grid-column: auto; }
          .footer-newsletter { grid-column: auto; }
          .footer-desc { max-width: 100%; }
          .footer-bottom-inner { flex-direction: column; text-align: center; align-items: center; }
        }
      `}</style>
    </footer>
  );
}
