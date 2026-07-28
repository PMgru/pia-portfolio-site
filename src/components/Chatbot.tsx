'use client';
import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, User, Bot, Sparkles } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'bot', text: 'Welcome! I am Pial\'s AI Concierge. Ask me anything about Pial\'s achievements, services, rates, or availability!' }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const presetQuestions = [
    "Who is Pial Mahmud?",
    "What services are offered?",
    "Show Gloria Tech results",
    "How can I contact Pial?"
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: ChatMessage = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/chatbot?action=ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: textToSend, history: messages.slice(-6), openrouter_api_key: localStorage.getItem('NEXT_PUBLIC_OPENROUTER_API_KEY') || undefined })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'bot', text: data.answer }]);
    } catch (e) {
      setMessages(prev => [...prev, { sender: 'bot', text: "Apologies, I encountered a brief sync issue. You can contact Pial directly via email hello@pialmahmud.com." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-body">
      
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full flex items-center justify-center text-[#080B14] shadow-2xl hover:scale-105 transition-transform duration-300 relative group"
          style={{ background: 'linear-gradient(135deg, #C9A84C, #A07830)', boxShadow: '0 8px 32px rgba(201,168,76,0.35)' }}
          aria-label="Open Chatbot"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="absolute right-full mr-3 py-1.5 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#F0F2F8] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none" style={{ background: '#0E1420', border: '1px solid rgba(201,168,76,0.2)' }}>
            Chat with AI Concierge
          </span>
          {/* Pulse dot */}
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 border-2 border-[#0A0A0F] rounded-full animate-ping" style={{ background: '#C9A84C' }}></span>
        </button>
      )}

      {/* Main Chat Box Container */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[500px] rounded-2xl bg-[#0A0A0F] flex flex-col shadow-2xl overflow-hidden animate-float-slow" style={{ border: '1px solid rgba(201,168,76,0.25)', boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(201,168,76,0.06)' }}>
          
          {/* Header */}
          <div className="bg-[#121218] px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#080B14] font-bold text-sm" style={{ background: 'linear-gradient(135deg, #C9A84C, #A07830)' }}>PM</div>
              <div className="flex flex-col">
                <span className="text-white text-sm font-bold font-headings leading-none">AI Concierge</span>
                <span className="text-[#9AA5B4] text-[10px] uppercase font-semibold tracking-wider flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-textSecondary hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Output Area */}
          <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto flex flex-col gap-3.5 bg-gradient-to-b from-[#0A0A0F] to-[#121218]">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex items-start gap-2.5 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${m.sender === 'user' ? 'text-[#080B14]' : 'bg-white/5 text-[#C9A84C]'}`} style={m.sender === 'user' ? { background: 'linear-gradient(135deg, #C9A84C, #A07830)' } : { border: '1px solid rgba(201,168,76,0.2)' }}>
                  {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                  m.sender === 'user' 
                    ? 'text-[#080B14] rounded-tr-none' 
                    : 'bg-white/[0.03] text-[#F0F2F8] rounded-tl-none'
                }`} style={m.sender === 'user' ? { background: 'linear-gradient(135deg, #C9A84C, #A07830)' } : { border: '1px solid rgba(201,168,76,0.1)' }}>
                  {m.text}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex items-start gap-2.5 max-w-[85%]">
                <div className="w-7 h-7 rounded-lg bg-white/5 text-[#C9A84C] flex items-center justify-center" style={{ border: '1px solid rgba(201,168,76,0.2)' }}>
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3 rounded-2xl text-sm bg-white/[0.03] text-textSecondary flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Suggestions presets */}
          <div className="p-2 border-t border-white/5 bg-[#121218]/50 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
            {presetQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-[#9AA5B4] hover:text-[#C9A84C] transition-all"
                style={{ ['--tw-border-opacity' as any]: 1 }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '')}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Text Form */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }}
            className="p-3.5 bg-[#121218] flex items-center gap-2"
            style={{ borderTop: '1px solid rgba(201,168,76,0.12)' }}
          >
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask a question..."
              className="flex-grow bg-[#0A0A0F] rounded-xl px-4 py-2.5 text-sm text-[#F0F2F8] placeholder-[#6B7A99] focus:outline-none"
              style={{ border: '1px solid rgba(201,168,76,0.18)' }}
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.18)')}
              required
            />
            <button 
              type="submit"
              disabled={loading}
              className="p-2.5 rounded-xl text-[#080B14] hover:shadow-lg disabled:opacity-50 transition-all"
              style={{ background: 'linear-gradient(135deg, #C9A84C, #A07830)' }}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
