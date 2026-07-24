'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Mail, Trash2, CheckCircle2, MailOpen, Loader2, Inbox } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import AdminLayout from '@/components/AdminLayout';
import { hasAuthCookie } from '@/lib/auth-client';

interface Message {
  id: string;
  name: string;
  email: string;
  company?: string;
  service?: string;
  budget?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function MessagesInbox() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await fetch('/api/contact');
      if (res.status === 401) { router.push('/admin'); return; }
      const data = await res.json();
      setMessages(data.messages || []);
      setUnread(data.unread || 0);
      if ((data.messages || []).length && !activeId) setActiveId(data.messages[0].id);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasAuthCookie()) { router.push('/admin'); return; }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active = messages.find(m => m.id === activeId) || null;

  const markRead = async (m: Message) => {
    setActiveId(m.id);
    if (m.is_read) return;
    try {
      await fetch(`/api/contact?id=${m.id}&read=true`, { method: 'PUT' });
      setMessages(ms => ms.map(x => x.id === m.id ? { ...x, is_read: true } : x));
      setUnread(u => Math.max(0, u - 1));
    } catch { /* ignore */ }
  };

  const del = async (id: string) => {
    if (!confirm('Delete this message permanently?')) return;
    try {
      const res = await fetch(`/api/contact?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        const removed = messages.find(m => m.id === id);
        setMessages(ms => ms.filter(m => m.id !== id));
        if (removed && !removed.is_read) setUnread(u => Math.max(0, u - 1));
        if (activeId === id) setActiveId(messages.find(m => m.id !== id)?.id || null);
        toast.success('Message deleted', { style: { background: '#121218', color: '#F4F4F9' } });
      }
    } catch {
      toast.error('Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] text-white flex items-center justify-center font-body">
        <Loader2 className="animate-spin" size={28} style={{ color: '#C9A84C' }} />
      </div>
    );
  }

  return (
    <AdminLayout>
      <Head><title>Inbox | PM Admin Suite</title></Head>
      <Toaster position="top-right" />

      <div className="flex flex-col gap-6 text-left">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#C9A84C]/15 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              <Inbox className="w-7 h-7 text-[#C9A84C]" /> Inbox
            </h1>
            <p className="text-xs text-[#9A8F95] mt-1">Contact-form leads from your website. {unread > 0 && <span className="text-[#C9A84C] font-bold">{unread} unread</span>}</p>
          </div>
          <span className="text-[10px] font-bold text-[#9A8F95] uppercase tracking-widest">{messages.length} total</span>
        </div>

        {messages.length === 0 ? (
          <div className="p-16 rounded-2xl bg-white/[0.01] border border-white/5 text-center">
            <Mail className="w-12 h-12 text-[#3D4A66] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>No messages yet</h3>
            <p className="text-xs text-[#9A8F95] mt-2">Submissions from the contact form will appear here.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            {/* List */}
            <div className="lg:col-span-4 flex flex-col gap-2 max-h-[640px] overflow-y-auto pr-1">
              {messages.map(m => (
                <button key={m.id} onClick={() => markRead(m)}
                  className={`text-left p-4 rounded-xl border transition-all ${activeId === m.id ? 'bg-[#C9A84C]/10 border-[#C9A84C]/40' : m.is_read ? 'bg-white/[0.02] border-white/5' : 'bg-[#C9A84C]/5 border-[#C9A84C]/20'}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-white truncate">{m.name}</span>
                    {!m.is_read && <span className="w-2 h-2 rounded-full bg-[#C9A84C] shrink-0" />}
                  </div>
                  <div className="text-[10px] text-[#9A8F95] truncate mt-0.5">{m.email}</div>
                  <div className="text-xs text-[#9A8F95] mt-1.5 line-clamp-2 opacity-80">{m.message}</div>
                  <div className="text-[9px] text-[#6B7A99] mt-1.5">
                    {new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    {m.service && <span className="ml-2 px-1.5 py-0.5 rounded bg-white/5">{m.service}</span>}
                  </div>
                </button>
              ))}
            </div>

            {/* Detail */}
            <div className="lg:col-span-8">
              {active ? (
                <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5">
                  <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-4 mb-5">
                    <div>
                      <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>{active.name}</h3>
                      <a href={`mailto:${active.email}`} className="text-sm text-[#C9A84C] hover:underline">{active.email}</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${active.is_read ? 'bg-white/5 text-[#9A8F95]' : 'bg-[#C9A84C]/15 text-[#C9A84C]'}`}>
                        {active.is_read ? 'Read' : 'New'}
                      </span>
                      <button onClick={() => del(active.id)} className="p-2 rounded-lg text-[#E63946] hover:bg-[#E63946]/10">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Meta grid */}
                  <div className="grid sm:grid-cols-2 gap-3 mb-5">
                    {active.company && <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5"><div className="text-[9px] uppercase font-bold text-[#9A8F95] tracking-wider">Company</div><div className="text-sm text-white mt-1">{active.company}</div></div>}
                    {active.service && <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5"><div className="text-[9px] uppercase font-bold text-[#9A8F95] tracking-wider">Service</div><div className="text-sm text-white mt-1">{active.service}</div></div>}
                    {active.budget && <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5"><div className="text-[9px] uppercase font-bold text-[#9A8F95] tracking-wider">Budget</div><div className="text-sm text-white mt-1">{active.budget}</div></div>}
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5"><div className="text-[9px] uppercase font-bold text-[#9A8F95] tracking-wider">Received</div><div className="text-sm text-white mt-1">{new Date(active.created_at).toLocaleString()}</div></div>
                  </div>

                  {/* Message body */}
                  <div>
                    <div className="text-[9px] uppercase font-bold text-[#9A8F95] tracking-wider mb-2">Message</div>
                    <div className="p-4 rounded-xl bg-[#0A0A0F] border border-white/5 text-sm text-[#C9C9D0] leading-relaxed whitespace-pre-wrap">{active.message}</div>
                  </div>

                  {/* Quick reply */}
                  <a href={`mailto:${active.email}?subject=Re: Your project inquiry&body=Hi ${active.name},%0D%0A%0D%0AThanks for reaching out! `}
                    className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#080B14] bg-gradient-to-r from-[#C9A84C] to-[#A07830] hover:scale-[1.02] transition-all">
                    <CheckCircle2 className="w-4 h-4" /> Reply via Email
                  </a>
                </div>
              ) : (
                <div className="p-16 rounded-2xl bg-white/[0.01] border border-white/5 text-center text-[#9A8F95] text-sm">
                  <MailOpen className="w-10 h-10 text-[#3D4A66] mx-auto mb-3" /> Select a message to read.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
