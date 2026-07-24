'use client';
import { useState, useEffect } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';

export default function Hero() {
  const [initText, setInitText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  // Initialize terminal code typing simulation
  useEffect(() => {
    const fullText = `$ initializing pial_mahmud.ai ...\n✓ SEO Engine Loaded\n✓ AI Growth Module Active\n✓ Ready to Transform Your Business`;
    let i = 0;
    const interval = setInterval(() => {
      setInitText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(interval);
      }
    }, 45);

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(cursorInterval);
    };
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden bg-[#0A0A0F]">
      
      {/* Floating Particles Background (Pure CSS animations) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="floating-particle w-2 h-2" style={{ top: '20%', left: '15%', animationDelay: '0s', animationDuration: '14s' }}></div>
        <div className="floating-particle w-3.5 h-3.5" style={{ top: '50%', left: '80%', animationDelay: '2s', animationDuration: '18s' }}></div>
        <div className="floating-particle w-2.5 h-2.5" style={{ top: '80%', left: '30%', animationDelay: '4s', animationDuration: '16s' }}></div>
        <div className="floating-particle w-3 h-3" style={{ top: '30%', left: '70%', animationDelay: '6s', animationDuration: '12s' }}></div>
        <div className="floating-particle w-2 h-2" style={{ top: '70%', left: '60%', animationDelay: '1s', animationDuration: '15s' }}></div>
      </div>

      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#B76E79] opacity-[0.06] rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[#F4C27F] opacity-[0.03] rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-6 z-10 text-center">
        
        {/* Main Hero Glassmorphic Card */}
        <div className="relative p-8 md:p-14 rounded-3xl backdrop-blur-md bg-white/[0.02] border border-[#B76E79]/15 shadow-2xl rose-gold-glow overflow-hidden">
          
          {/* Subtle gradient animated outline border */}
          <div className="absolute inset-0 -z-10 rounded-3xl p-[1px] bg-gradient-to-r from-[#B76E79] via-[#E63946] to-[#F4C27F] opacity-30 animate-pulse-glow"></div>

          {/* Spark Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-[#B76E79]/20 text-[#B76E79] text-xs font-semibold uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} /> Available for Projects 2026
          </div>

          {/* Main Title Heading */}
          <h1 className="text-4xl md:text-6xl font-bold font-headings tracking-tight leading-[1.1] text-[#F4F4F9] mb-6">
            Engineering Digital Growth <br className="hidden md:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#B76E79] via-[#E63946] to-[#F4C27F]">
              Beyond the Algorithm.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-textSecondary dark:text-[#9A8F95] text-lg md:text-xl font-medium max-w-2xl mx-auto mb-8 tracking-wide">
            AI Specialist | Data-Driven Digital Marketer | SEO Growth Hacker
          </p>

          {/* Call To Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-10">
            <a 
              href="/#projects" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-white font-bold tracking-wide bg-gradient-to-r from-[#B76E79] to-[#E63946] shadow-lg shadow-[#B76E79]/20 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Explore My Universe →
            </a>
            <a 
              href="/#calculator" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-[#F4F4F9] font-bold border border-[#B76E79]/30 bg-white/5 hover:bg-white/10 hover:border-[#B76E79]/60 active:scale-95 transition-all duration-300"
            >
              Calculate Your ROI 🚀
            </a>
          </div>

          {/* Typing Terminal status console */}
          <div className="bg-[#0A0A0F]/90 rounded-xl p-5 border border-[#B76E79]/10 text-left font-mono text-sm max-w-lg mx-auto shadow-inner">
            <pre className="text-textSecondary leading-relaxed whitespace-pre-wrap">
              {initText}
              <span className={`inline-block w-2 h-4 ml-1 bg-[#B76E79] ${showCursor ? 'opacity-100' : 'opacity-0'}`}></span>
            </pre>
          </div>

        </div>

        {/* Scroll Chevron Down Indicator */}
        <div className="mt-12 flex flex-col items-center gap-2 text-textSecondary dark:text-[#9A8F95] opacity-60 hover:opacity-100 transition-opacity">
          <span className="text-xs uppercase tracking-widest">Scroll to Deploy</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </div>

      </div>

    </section>
  );
}
