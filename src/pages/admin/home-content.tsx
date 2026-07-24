'use client';
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Plus, Trash2, Save, Star, X, Upload, LayoutDashboard, Users } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import AdminLayout from '@/components/AdminLayout';
import { hasAuthCookie } from '@/lib/auth-client';

interface StatItem { num: number; suffix: string; label: string; icon: string }
interface ClientItem { name: string; logo: string; tag: string }
interface TestimonialItem { name: string; title: string; text: string; rating: number }

export default function HomeContentEditor() {
  const router = useRouter();

  const [stats, setStats] = useState<StatItem[]>([]);
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [saving, setSaving] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Defaults (mirror db.json seed) used if the DB has nothing yet.
  const DEFAULT_STATS: StatItem[] = [
    { num: 50, suffix: '+', label: 'Projects Delivered', icon: '🚀' },
    { num: 7, suffix: '', label: 'Brand Clients', icon: '🏢' },
    { num: 412, suffix: '%', label: 'Max Traffic Growth', icon: '📈' },
    { num: 5, suffix: '.0★', label: 'Client Rating', icon: '⭐' },
  ];
  const DEFAULT_CLIENTS: ClientItem[] = [
    { name: 'TutorsPlan', logo: '/images/clients/tutorsplan.svg', tag: 'EdTech' },
    { name: 'KDGTAL', logo: '/images/clients/kdgtal.svg', tag: 'Digital Agency' },
  ];
  const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
    { name: 'Sarah Thompson', title: 'CEO, TutorsPlan UK', text: 'Pial transformed our online presence completely.', rating: 5 },
  ];

  useEffect(() => {
    if (!hasAuthCookie()) { router.push('/admin'); return; }
    (async () => {
      try {
        const res = await fetch('/api/settings?home=1');
        if (res.ok) {
          const { home } = await res.json();
          setStats(Array.isArray(home?.stats) && home.stats.length ? home.stats : DEFAULT_STATS);
          setClients(Array.isArray(home?.clients) && home.clients.length ? home.clients : DEFAULT_CLIENTS);
          setTestimonials(Array.isArray(home?.testimonials) && home.testimonials.length ? home.testimonials : DEFAULT_TESTIMONIALS);
        } else {
          setStats(DEFAULT_STATS); setClients(DEFAULT_CLIENTS); setTestimonials(DEFAULT_TESTIMONIALS);
        }
      } catch {
        setStats(DEFAULT_STATS); setClients(DEFAULT_CLIENTS); setTestimonials(DEFAULT_TESTIMONIALS);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveSection = async (section: string, data: any) => {
    setSaving(section);
    try {
      const res = await fetch(`/api/settings?section=${section}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      });
      if (res.ok) toast.success(`${section} saved — live on homepage!`, { style: { background: '#121218', color: '#F4F4F9' } });
      else toast.error('Save failed');
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving('');
    }
  };

  const handleClientLogoUpload = async (index: number, file: File) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo file is too large (max 2MB)');
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      try {
        const uploadToast = toast.loading('Uploading logo...', { style: { background: '#121218', color: '#F4F4F9' } });
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: `client_${Date.now()}_${file.name}`,
            data: base64Data
          })
        });
        toast.dismiss(uploadToast);
        if (res.ok) {
          const data = await res.json();
          setClients(prev => prev.map((c, idx) => idx === index ? { ...c, logo: data.url } : c));
          toast.success('Logo uploaded successfully!');
        } else {
          const errData = await res.json();
          toast.error(errData.message || 'Upload failed');
        }
      } catch (err) {
        toast.error('Upload failed');
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] text-white flex items-center justify-center font-body">
        <div className="w-8 h-8 rounded-full border-2 border-[#C9A84C] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <Head><title>Homepage Content | PM Admin Suite</title></Head>
      <Toaster position="top-right" />

      <div className="flex flex-col gap-8 text-left">
        {/* Header */}
        <div className="border-b border-[#C9A84C]/15 pb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>Homepage Content</h1>
          <p className="text-xs text-[#9A8F95] mt-1">Edit the stats, client logos, and testimonials shown on the live homepage. Changes take effect instantly.</p>
        </div>

        {/* ── STATS ───────────────────────────────────────────── */}
        <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4 text-[#C9A84C]" /> Stats Bar
            </h3>
            <button onClick={() => setStats([...stats, { num: 0, suffix: '', label: 'New Stat', icon: '✨' }])}
              className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[#9A8F95] hover:text-white flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Add Stat
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <input value={s.icon} onChange={e => setStats(stats.map((x, j) => j === i ? { ...x, icon: e.target.value } : x))}
                  className="w-12 text-center bg-[#121218] border border-white/10 rounded-lg px-2 py-2 text-sm text-white" />
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="flex gap-2">
                    <input type="number" value={s.num} onChange={e => setStats(stats.map((x, j) => j === i ? { ...x, num: Number(e.target.value) } : x))}
                      placeholder="Number" className="w-24 bg-[#121218] border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
                    <input value={s.suffix} onChange={e => setStats(stats.map((x, j) => j === i ? { ...x, suffix: e.target.value } : x))}
                      placeholder="Suffix" className="w-16 bg-[#121218] border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
                  </div>
                  <input value={s.label} onChange={e => setStats(stats.map((x, j) => j === i ? { ...x, label: e.target.value } : x))}
                    placeholder="Label" className="bg-[#121218] border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
                </div>
                <button onClick={() => setStats(stats.filter((_, j) => j !== i))} className="p-2 text-[#E63946] hover:bg-[#E63946]/10 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button onClick={() => saveSection('stats', stats)} disabled={saving === 'stats'}
            className="mt-4 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#080B14] bg-gradient-to-r from-[#C9A84C] to-[#A07830] flex items-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50">
            <Save className="w-4 h-4" /> {saving === 'stats' ? 'Saving...' : 'Save Stats'}
          </button>
        </div>

        {/* ── CLIENTS ──────────────────────────────────────────── */}
        <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-[#C9A84C]" /> Trusted-By Clients
            </h3>
            <button onClick={() => setClients([...clients, { name: 'New Client', logo: '', tag: 'Industry' }])}
              className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[#9A8F95] hover:text-white flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Add Client
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {clients.map((c, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 items-start">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-lg bg-[#121218] border border-white/10 flex items-center justify-center overflow-hidden relative">
                    {c.logo ? (
                      <img src={c.logo} alt="Preview" className="w-full h-full object-contain p-1" />
                    ) : (
                      <span className="text-[10px] text-[#9A8F95]">No logo</span>
                    )}
                  </div>
                  <label className="cursor-pointer text-[10px] px-2 py-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-[#9A8F95] hover:text-white flex items-center gap-1">
                    <Upload className="w-2.5 h-2.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleClientLogoUpload(i, file);
                      }}
                    />
                  </label>
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <input value={c.name} onChange={e => setClients(clients.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                    placeholder="Client name" className="bg-[#121218] border border-white/10 rounded-lg px-3 py-2 text-sm text-white w-full" />
                  <input value={c.tag} onChange={e => setClients(clients.map((x, j) => j === i ? { ...x, tag: e.target.value } : x))}
                    placeholder="Tag (e.g. EdTech)" className="bg-[#121218] border border-white/10 rounded-lg px-3 py-2 text-xs text-white w-full" />
                  <input value={c.logo} onChange={e => setClients(clients.map((x, j) => j === i ? { ...x, logo: e.target.value } : x))}
                    placeholder="Logo path" className="bg-[#121218] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#9A8F95] w-full" />
                </div>
                <button onClick={() => setClients(clients.filter((_, j) => j !== i))} className="p-2 text-[#E63946] hover:bg-[#E63946]/10 rounded-lg self-center">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button onClick={() => saveSection('clients', clients)} disabled={saving === 'clients'}
            className="mt-4 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#080B14] bg-gradient-to-r from-[#C9A84C] to-[#A07830] flex items-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50">
            <Save className="w-4 h-4" /> {saving === 'clients' ? 'Saving...' : 'Save Clients'}
          </button>
        </div>

        {/* ── TESTIMONIALS ─────────────────────────────────────── */}
        <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-[#C9A84C]" /> Testimonials
            </h3>
            <button onClick={() => setTestimonials([...testimonials, { name: 'Client Name', title: 'Title, Company', text: 'Their feedback...', rating: 5 }])}
              className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[#9A8F95] hover:text-white flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Add Testimonial
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {testimonials.map((t, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex gap-3 mb-3">
                  <input value={t.name} onChange={e => setTestimonials(testimonials.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                    placeholder="Name" className="flex-1 bg-[#121218] border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
                  <select value={t.rating} onChange={e => setTestimonials(testimonials.map((x, j) => j === i ? { ...x, rating: Number(e.target.value) } : x))}
                    className="w-24 bg-[#121218] border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
                    {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} ★</option>)}
                  </select>
                  <button onClick={() => setTestimonials(testimonials.filter((_, j) => j !== i))} className="p-2 text-[#E63946] hover:bg-[#E63946]/10 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <input value={t.title} onChange={e => setTestimonials(testimonials.map((x, j) => j === i ? { ...x, title: e.target.value } : x))}
                  placeholder="Title, Company" className="w-full mb-2 bg-[#121218] border border-white/10 rounded-lg px-3 py-2 text-xs text-white" />
                <textarea value={t.text} onChange={e => setTestimonials(testimonials.map((x, j) => j === i ? { ...x, text: e.target.value } : x))}
                  placeholder="Testimonial text" rows={2} className="w-full bg-[#121218] border border-white/10 rounded-lg px-3 py-2 text-xs text-white resize-none" />
              </div>
            ))}
          </div>
          <button onClick={() => saveSection('testimonials', testimonials)} disabled={saving === 'testimonials'}
            className="mt-4 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#080B14] bg-gradient-to-r from-[#C9A84C] to-[#A07830] flex items-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50">
            <Save className="w-4 h-4" /> {saving === 'testimonials' ? 'Saving...' : 'Save Testimonials'}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
