'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  MessageSquare,
  Cpu,
  Settings,
  LogOut,
  HelpCircle,
  Bot,
  Send,
  X,
  Sparkles,
  BookOpen,
  Inbox,
  LayoutTemplate,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { sender: 'bot', text: "Hello Pial! I'm your AI Admin Assistant. I can help you interpret traffic trends, guide your content SEO optimization, or explain how to train your client chatbot. What can I do for you today?" }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, assistantOpen]);

  const handleLogout = async () => {
    // Ask the server to clear the HttpOnly auth cookie, then redirect.
    try {
      await fetch('/api/auth?action=logout', { method: 'POST' });
    } catch {
      // Fall back to clearing any client-visible copy of the cookie.
      document.cookie = 'pm_logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    } finally {
      router.push('/admin');
    }
  };

  const askAssistant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputText('');
    setLoading(true);

    try {
      // Simulate intelligent guide answers tailored to admin features
      const q = userText.toLowerCase();
      let answer = '';

      if (q.includes('traffic') || q.includes('visitor') || q.includes('analytics')) {
        answer = "Our Analytics system telemetry aggregates live pageviews, browser agents, operating systems, and country footprints. If bounce rates exceed 40%, I recommend optimizing page loading parameters or placing an attention-grabbing lead magnet in the Services grid.";
      } else if (q.includes('seo') || q.includes('score')) {
        answer = "To score 100% on SEO: (1) Keep Meta Titles between 30-60 characters, (2) Include your Focus Keyword in both the Meta Title and H2 headings, and (3) Exceed 600 words of semantic content containing keyword mentions. Try clicking the 'Optimize' button to auto-generate tags via AI!";
      } else if (q.includes('chatbot') || q.includes('train')) {
        answer = "To train your public concierge chatbot, navigate to the Chatbot Knowledge Base tab. You can add common QA pairs about your consulting retainers, portfolio background, or specialized tools. The chatbot matches client inquiries against these items first.";
      } else if (q.includes('page') || q.includes('section')) {
        answer = "You can customize page content by editing JSON section blocks. Turn sections on or off, edit headlines, and save your drafts. These changes take effect live instantly on the homepage.";
      } else {
        // Route the question through the server-side chatbot API (which itself
        // checks for an OpenRouter key and falls back to a heuristic engine).
        const res = await fetch('/api/chatbot?action=ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: `You are an internal admin onboarding guide. Answer this: ${userText}`, history: messages.slice(-4), openrouter_api_key: localStorage.getItem('NEXT_PUBLIC_OPENROUTER_API_KEY') || undefined })
        });
        const data = await res.json();
        answer = data.answer;
      }

      setMessages(prev => [...prev, { sender: 'bot', text: answer }]);
    } catch (e) {
      setMessages(prev => [...prev, { sender: 'bot', text: "Error syncing with internal AI assistant. Please check your internet connection." }]);
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { label: 'Dashboard Stats', icon: LayoutDashboard, path: '/admin/dashboard' },
    { label: 'SEO Optimizer', icon: Cpu, path: '/admin/seo' },
    { label: 'Chatbot Knowledge', icon: MessageSquare, path: '/admin/chatbot' },
    { label: 'Blog Posts CMS', icon: FileText, path: '/admin/blog' },
    { label: 'Case Studies', icon: Briefcase, path: '/admin/projects' },
    { label: 'Homepage Content', icon: LayoutTemplate, path: '/admin/home-content' },
    { label: 'Site Settings', icon: Settings, path: '/admin/settings' },
    { label: 'Inbox', icon: Inbox, path: '/admin/messages' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex font-body">
      
      {/* Sidebar Panel */}
      <aside className="w-64 bg-[#121218] border-r border-[#B76E79]/15 flex flex-col justify-between shrink-0">
        
        <div className="flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-[#B76E79]/15 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#B76E79] to-[#E63946] flex items-center justify-center font-bold font-headings">
              PM
            </div>
            <span className="font-headings font-bold text-sm uppercase tracking-wider text-white">
              Admin Suite
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 flex flex-col gap-2">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = router.pathname === item.path;
              return (
                <Link 
                  key={idx} 
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#B76E79]/20 to-[#E63946]/10 text-[#B76E79] border border-[#B76E79]/30' 
                      : 'text-[#9A8F95] hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 flex flex-col gap-2 border-t border-[#B76E79]/10">
          <button 
            onClick={() => setAssistantOpen(true)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide text-[#F4C27F] hover:bg-white/5 transition-all border border-dashed border-[#F4C27F]/20 hover:border-[#F4C27F]/50"
          >
            <HelpCircle className="w-4 h-4 text-[#F4C27F]" /> AI Assistant Guide
          </button>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide text-[#E63946] hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

      </aside>

      {/* Main Area Content */}
      <main className="flex-grow p-8 md:p-10 overflow-y-auto relative min-h-screen">
        
        {/* Noise overlay */}
        <div className="noise-overlay"></div>

        {children}
      </main>

      {/* Slide-out Admin Assistant Chatbot Panel */}
      {assistantOpen && (
        <div className="fixed inset-y-0 right-0 w-[420px] bg-[#121218] border-l border-[#B76E79]/20 z-50 shadow-2xl flex flex-col animate-slide-in font-body">
          {/* Header */}
          <div className="bg-[#0A0A0F] p-5 border-b border-[#B76E79]/15 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Bot className="w-5 h-5 text-[#F4C27F]" />
              <div className="flex flex-col">
                <span className="text-[#F4C27F] font-bold font-headings text-sm">AI Onboarding Guide</span>
                <span className="text-textSecondary text-[10px] uppercase font-semibold tracking-wider">Internal Copilot</span>
              </div>
            </div>
            <button 
              onClick={() => setAssistantOpen(false)}
              className="text-textSecondary hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-grow p-5 overflow-y-auto flex flex-col gap-4 bg-gradient-to-b from-[#121218] to-[#0A0A0F]">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex items-start gap-3 max-w-[90%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${m.sender === 'user' ? 'bg-[#B76E79] text-white' : 'bg-[#F4C27F]/10 text-[#F4C27F] border border-[#F4C27F]/20'}`}>
                  {m.sender === 'user' ? <Settings className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                  m.sender === 'user' 
                    ? 'bg-[#B76E79] text-white rounded-tr-none' 
                    : 'bg-white/[0.02] border border-[#B76E79]/10 text-white rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-start gap-3 max-w-[90%]">
                <div className="w-8 h-8 rounded-lg bg-[#F4C27F]/10 text-[#F4C27F] border border-[#F4C27F]/20 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.02] text-textSecondary flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F4C27F] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F4C27F] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F4C27F] animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Guide Links */}
          <div className="p-3 border-t border-white/5 bg-[#0A0A0F]/50 flex flex-col gap-2">
            <span className="text-[10px] uppercase font-bold text-[#9A8F95] tracking-wider pl-1">Suggested Inquiries</span>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setInputText("How do I improve my page's SEO score?")} 
                className="text-xs px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-textSecondary hover:text-white"
              >
                Improve SEO Score
              </button>
              <button 
                onClick={() => setInputText("Explain the visitor analytics trends.")}
                className="text-xs px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-textSecondary hover:text-white"
              >
                Explain Traffic Telemetry
              </button>
              <button 
                onClick={() => setInputText("How do I train the concierge chatbot?")}
                className="text-xs px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-textSecondary hover:text-white"
              >
                Train Public Chatbot
              </button>
            </div>
          </div>

          {/* Chat Form Input */}
          <form 
            onSubmit={askAssistant}
            className="p-4 bg-[#0A0A0F] border-t border-[#B76E79]/15 flex items-center gap-2"
          >
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask assistant..."
              className="flex-grow bg-[#121218] border border-[#B76E79]/20 rounded-xl px-4 py-3 text-sm text-white placeholder-[#9A8F95] focus:outline-none focus:border-[#B76E79]"
              required
            />
            <button 
              type="submit"
              disabled={loading}
              className="p-3 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#E63946] text-white hover:shadow-lg disabled:opacity-50 transition-all"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
