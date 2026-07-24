import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, ChevronDown, Sun, Moon } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Blog', href: '/blog' },
  { label: 'Work Data', href: '/work-data' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme === 'light') {
      setTheme('light');
      document.documentElement.classList.add('light-theme');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.add('light-theme');
    } else {
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.remove('light-theme');
    }
  };

  return (
    <nav
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(8,11,20,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(201,168,76,0.12)' : 'none',
        padding: scrolled ? '14px 0' : '20px 0',
      }}
    >
      <div className="container-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'linear-gradient(135deg, #C9A84C, #A07830)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Playfair Display, serif', fontWeight: 700,
            color: '#080B14', fontSize: 18,
          }}>P</div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 20, color: '#F0F2F8', letterSpacing: '-0.02em' }}>
            Pial<span style={{ color: '#C9A84C' }}>.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden-mobile">
          {navLinks.map((link) => {
            const isActive = router.pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                  color: isActive ? '#C9A84C' : '#6B7A99',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  background: isActive ? 'rgba(201,168,76,0.08)' : 'transparent',
                  border: isActive ? '1px solid rgba(201,168,76,0.15)' : '1px solid transparent',
                }}
                onMouseEnter={e => { if (!isActive) { (e.target as HTMLElement).style.color = '#F0F2F8'; } }}
                onMouseLeave={e => { if (!isActive) { (e.target as HTMLElement).style.color = '#6B7A99'; } }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }} className="hidden-mobile">
          <button
            onClick={toggleTheme}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 8,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.05)',
              transition: 'all 0.2s',
            }}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link
            href="/contact"
            style={{
              padding: '10px 24px',
              borderRadius: 8,
              background: 'linear-gradient(135deg, #C9A84C, #A07830)',
              color: '#080B14',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}
          >
            Hire Me
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ 
            display: 'none', background: 'none', border: 'none',
            color: 'var(--text-primary)', cursor: 'pointer', padding: 8
          }}
          className="show-mobile"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'var(--bg-primary)',
          borderBottom: '1px solid rgba(201,168,76,0.12)',
          padding: '16px 24px 24px',
          animation: 'slideInDown 0.3s ease forwards',
        }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block', padding: '12px 16px',
                color: router.pathname === link.href ? '#C9A84C' : 'var(--text-muted)',
                fontSize: 14, fontWeight: 500,
                textDecoration: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, gap: 12 }}>
            <button
              onClick={toggleTheme}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 12,
                borderRadius: 8,
                backgroundColor: 'rgba(255,255,255,0.05)',
                flex: 1,
              }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 500 }}>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block', padding: '12px 24px',
                background: 'linear-gradient(135deg, #C9A84C, #A07830)',
                color: '#080B14', fontSize: 13, fontWeight: 700,
                letterSpacing: '0.05em', textTransform: 'uppercase',
                textDecoration: 'none', borderRadius: 8, textAlign: 'center',
                flex: 2,
              }}
            >
              Hire Me
            </Link>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
