import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

export default function LoadingScreen() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw mini galaxy in background of loader
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars: { x: number; y: number; r: number; a: number; sp: number }[] = [];
    for (let i = 0; i < 160; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        a: Math.random(),
        sp: Math.random() * 0.005 + 0.002,
      });
    }

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.a += s.sp;
        if (s.a > 1) s.a = 0;
        const opacity = Math.abs(Math.sin(s.a * Math.PI));
        ctx.globalAlpha = opacity * 0.8;
        ctx.fillStyle = '#C9A84C';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, [visible]);

  useEffect(() => {
    setProgress(0);
    setVisible(true);
    setFading(false);

    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 12) + 4;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
          setFading(true);
          setTimeout(() => setVisible(false), 600);
        }, 300);
      }
      setProgress(current);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Route change indicator (thin bar at top, no full-screen)
  useEffect(() => {
    const handleStart = () => setProgress(20);
    const handleComplete = () => {
      setProgress(100);
    };
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#080B14',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.6s ease',
      }}
    >
      {/* Twinkling star canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      />

      {/* Central logo ring */}
      <div style={{ position: 'relative', width: 120, height: 120, zIndex: 1 }}>
        {/* Outer spinning conic ring */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'conic-gradient(from 0deg, #C9A84C, #00D4FF, #5B21B6, #C9A84C)',
          animation: 'ls-spin 2s linear infinite',
          padding: 2,
        }}>
          <div style={{
            width: '100%', height: '100%', borderRadius: '50%',
            backgroundColor: '#080B14',
          }} />
        </div>
        {/* Inner glow */}
        <div style={{
          position: 'absolute', inset: 8,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 36, fontWeight: 800,
            background: 'linear-gradient(135deg, #C9A84C, #E8C96A)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>P</span>
        </div>
      </div>

      {/* Brand Name */}
      <div style={{ zIndex: 1, textAlign: 'center' }}>
        <div style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 22, fontWeight: 700, color: '#F0F2F8',
          letterSpacing: '-0.02em', marginBottom: 6,
        }}>
          Pial <span style={{ color: '#C9A84C' }}>Mahmud</span>
        </div>
        <div style={{
          fontSize: 11, fontWeight: 600,
          color: '#6B7A99',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          animation: 'ls-pulse 2s ease infinite',
        }}>
          Initializing Growth Engine
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        width: 200, height: 2,
        background: 'rgba(255,255,255,0.06)',
        borderRadius: 4, overflow: 'hidden',
        zIndex: 1,
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #C9A84C, #00D4FF)',
          borderRadius: 4,
          transition: 'width 0.2s ease',
          boxShadow: '0 0 12px rgba(201,168,76,0.6)',
        }} />
      </div>

      <style jsx global>{`
        @keyframes ls-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes ls-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
