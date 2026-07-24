import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, Zap } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Login failed');

      // The server sets a signed JWT in an HttpOnly cookie — we never touch
      // the token from JavaScript, so it cannot be stolen via XSS.
      toast.success('Access Granted!', {
        style: { background: '#111827', color: '#F0F2F8', border: '1px solid rgba(201,168,76,0.3)' },
        icon: '🔓',
      });

      setTimeout(() => router.push('/admin/dashboard'), 800);

    } catch (err: any) {
      toast.error(err.message || 'Invalid credentials', {
        style: { background: '#111827', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Access — PM Admin Suite</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <Toaster position="top-right" />

      <div style={{
        minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr',
        background: '#080B14',
      }}>

        {/* ── LEFT — Photo Panel ───────────────────────────────────── */}
        <div style={{
          position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(135deg, #0A0F1E, #080B14)',
        }}>
          {/* Background glow */}
          <div style={{
            position: 'absolute', top: '30%', left: '30%',
            width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Grid */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }} />

          {/* Photo */}
          <div style={{
            position: 'absolute', bottom: 0, left: '50%',
            transform: 'translateX(-50%)',
            width: '80%', maxWidth: 340,
          }}>
            <img
              src="/images/pial-photo.jpg"
              alt="Pial Mahmud"
              style={{
                width: '100%', height: 'auto',
                objectFit: 'contain', objectPosition: 'bottom',
                filter: 'drop-shadow(0 -20px 60px rgba(201,168,76,0.15))',
              }}
              onError={(e) => {
                const el = e.target as HTMLImageElement;
                el.style.display = 'none';
              }}
            />
          </div>

          {/* Text overlay bottom */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            padding: '48px 40px',
          }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'linear-gradient(135deg, #C9A84C, #A07830)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Playfair Display, serif', fontWeight: 700, color: '#080B14', fontSize: 18,
              }}>P</div>
              <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 22, color: '#F0F2F8' }}>
                Pial<span style={{ color: '#C9A84C' }}>.</span>
              </span>
            </Link>

            <div style={{ marginTop: 48 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>
                ✦ Admin Suite
              </div>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px, 3vw, 44px)', fontWeight: 800, color: '#F0F2F8', lineHeight: 1.2, marginBottom: 16 }}>
                Your Digital<br />Command Center
              </h1>
              <p style={{ fontSize: 14, color: '#6B7A99', lineHeight: 1.8 }}>
                Manage content, track analytics, optimize your SEO engine, 
                and train your AI chatbot — all in one premium dashboard.
              </p>
            </div>

            <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Real-time Analytics Dashboard', 'Content & Blog Management', 'SEO Performance Engine', 'AI Chatbot Training'].map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C9A84C' }} />
                  <span style={{ fontSize: 13, color: '#9CA3AF' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT — Login Form ────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '48px 60px',
          background: '#080B14',
        }}>
          <div style={{ width: '100%', maxWidth: 400 }}>

            {/* Icon */}
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))',
              border: '1px solid rgba(201,168,76,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 28,
            }}>
              <ShieldCheck size={24} color="#C9A84C" />
            </div>

            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 800, color: '#F0F2F8', marginBottom: 8 }}>
              Sign In
            </h2>
            <p style={{ fontSize: 14, color: '#6B7A99', marginBottom: 36 }}>
              Enter your credentials to access the admin suite.
            </p>

            {/* Demo Credentials Notice */}
            <div style={{
              padding: '12px 16px', borderRadius: 10, marginBottom: 28,
              background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)',
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#C9A84C', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                💡 Demo Credentials
              </div>
              <div style={{ fontSize: 12, color: '#9CA3AF' }}>
                Email: <strong style={{ color: '#F0F2F8' }}>pial@pialmahmud.com</strong>
              </div>
              <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
                Password: <strong style={{ color: '#F0F2F8' }}>admin123</strong>
              </div>
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#6B7A99', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#6B7A99" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="pial@pialmahmud.com"
                    className="form-input"
                    style={{ paddingLeft: 44 }}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#6B7A99', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#6B7A99" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="form-input"
                    style={{ paddingLeft: 44, paddingRight: 44 }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6B7A99', cursor: 'pointer' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                id="admin-login-btn"
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '15px 24px', borderRadius: 8, marginTop: 8,
                  background: loading ? 'rgba(201,168,76,0.5)' : 'linear-gradient(135deg, #C9A84C, #A07830)',
                  color: '#080B14', fontWeight: 800, fontSize: 14,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  border: 'none', cursor: loading ? 'wait' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  transition: 'all 0.3s', boxShadow: '0 10px 30px rgba(201,168,76,0.2)',
                }}
              >
                {loading ? (
                  <span style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #080B14', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                ) : (
                  <>Unlock Admin Suite <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            <div style={{ marginTop: 28, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24, textAlign: 'center' }}>
              <Link href="/" style={{ fontSize: 13, color: '#6B7A99', textDecoration: 'none' }}>
                ← Return to Portfolio
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: '1fr 1fr'"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
