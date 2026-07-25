import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import CustomCursor from '@/components/CustomCursor';
import Chatbot from '@/components/Chatbot';
import GalaxyBackground from '@/components/GalaxyBackground';

const GA_ID = 'G-L69Q08KSR9';
const isProduction = process.env.NODE_ENV === 'production';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdmin = router.pathname.startsWith('/admin');
  const sessionRef = useRef<string>('');
  const [navProgress, setNavProgress] = useState<number | null>(null);

  // Listen to route changes to show non-blocking sleek top progress bar
  useEffect(() => {
    let progressTimer: NodeJS.Timeout;
    
    const handleStart = (url: string, { shallow }: { shallow: boolean }) => {
      // Don't show progress bar for admin changes or shallow changes
      if (shallow || url.startsWith('/admin')) return;
      setNavProgress(10);
      
      clearInterval(progressTimer);
      progressTimer = setInterval(() => {
        setNavProgress(prev => {
          if (prev === null) return null;
          if (prev >= 90) return 90;
          return prev + Math.floor(Math.random() * 8) + 2;
        });
      }, 150);
    };
    
    const handleDone = () => {
      clearInterval(progressTimer);
      setNavProgress(100);
      setTimeout(() => {
        setNavProgress(null);
      }, 300);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleDone);
    router.events.on('routeChangeError', handleDone);
    return () => {
      clearInterval(progressTimer);
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleDone);
      router.events.off('routeChangeError', handleDone);
    };
  }, [router]);

  useEffect(() => {
    // Generate or retrieve session ID
    if (typeof window !== 'undefined') {
      let sid = sessionStorage.getItem('pm_sid');
      if (!sid) {
        sid = 'sess_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now();
        sessionStorage.setItem('pm_sid', sid);
      }
      sessionRef.current = sid;
    }
  }, []);

  useEffect(() => {
    const trackPage = async () => {
      if (router.pathname.startsWith('/admin')) return;
      if (!sessionRef.current) return;

      try {
        const getDeviceType = () => {
          if (typeof window === 'undefined') return 'Desktop';
          const ua = navigator.userAgent;
          if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'Tablet';
          if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return 'Mobile';
          return 'Desktop';
        };

        const getBrowser = () => {
          if (typeof window === 'undefined') return 'Chrome';
          const ua = navigator.userAgent;
          if (ua.includes("Firefox")) return "Firefox";
          if (ua.includes("Chrome")) return "Chrome";
          if (ua.includes("Safari")) return "Safari";
          return "Chrome";
        };

        const getOS = () => {
          if (typeof window === 'undefined') return 'Windows';
          const ua = navigator.userAgent;
          if (ua.includes("Windows")) return "Windows";
          if (ua.includes("Mac")) return "macOS";
          if (ua.includes("Android")) return "Android";
          if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
          return "Linux";
        };

        await fetch('/api/analytics?action=track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionRef.current,
            page_path: router.pathname,
            referrer: typeof document !== 'undefined' ? document.referrer || 'Direct' : 'Direct',
            device_type: getDeviceType(),
            browser: getBrowser(),
            os: getOS(),
            country: 'Bangladesh', // Local fallback
          })
        });
      } catch (e) {
        console.error('Failed to log analytics event:', e);
      }
    };

    // Track on initial load and route changes
    if (sessionRef.current) {
      trackPage();
    } else {
      // Wait for session storage initialization
      const timer = setTimeout(trackPage, 100);
      return () => clearTimeout(timer);
    }
  }, [router.pathname]);

  useEffect(() => {
    if (!isProduction) return;

    const handleGtagPageView = (url: string) => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'page_view', {
          page_path: url,
          page_location: window.location.href,
        });
      }
    };

    router.events.on('routeChangeComplete', handleGtagPageView);
    return () => {
      router.events.off('routeChangeComplete', handleGtagPageView);
    };
  }, [router.events]);

  // Heartbeat ping to calculate session duration and live page activity
  useEffect(() => {
    if (router.pathname.startsWith('/admin')) return;

    const sendPing = async () => {
      if (!sessionRef.current) return;
      try {
        await fetch('/api/analytics?action=ping', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionRef.current,
            page_path: router.pathname
          })
        });
      } catch {}
    };

    const interval = setInterval(sendPing, 10000); // Ping every 10 seconds
    return () => clearInterval(interval);
  }, [router.pathname]);

  return (
    <>
      <LoadingScreen />
      {navProgress !== null && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '3px',
            width: `${navProgress}%`,
            background: 'linear-gradient(90deg, #C9A84C, #A07830)',
            zIndex: 99999,
            transition: 'width 0.15s ease, opacity 0.3s ease',
            boxShadow: '0 0 10px rgba(201,168,76,0.6)',
            opacity: navProgress === 100 ? 0 : 1,
          }}
        />
      )}
      {!isAdmin && <GalaxyBackground />}
      {!isAdmin && <CustomCursor />}
      {!isAdmin && <Chatbot />}
      <Component {...pageProps} />
    </>
  );
}
