import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { hasAuthCookie } from '@/lib/auth-client';
import { Upload, Plus, X, ExternalLink, BarChart2, Search, Megaphone, TrendingUp, Brain, Video, Trash2, Lock } from 'lucide-react';

interface WorkItem {
  id: string;
  category: string;
  title: string;
  description: string;
  imageUrl?: string;
  linkUrl?: string;
  type: 'image' | 'link' | 'video';
}

const categories = [
  { id: 'all', label: 'All Work', icon: TrendingUp },
  { id: 'analytics', label: 'Google Analytics', icon: BarChart2 },
  { id: 'search_console', label: 'Search Console', icon: Search },
  { id: 'meta_ads', label: 'Meta Ads', icon: Megaphone },
  { id: 'google_ads', label: 'Google Ads', icon: TrendingUp },
  { id: 'ai_projects', label: 'AI Projects', icon: Brain },
  { id: 'videos', label: 'Video/Media', icon: Video },
];

const defaultItems: WorkItem[] = [
  {
    id: '1',
    category: 'analytics',
    title: 'TutorsPlan UK — 412% Traffic Growth',
    description: 'Google Analytics dashboard showing 412% organic traffic increase over 12 months for a UK EdTech platform.',
    type: 'image',
  },
  {
    id: '2',
    category: 'search_console',
    title: '#1 Rankings — 200+ Keywords',
    description: 'Search Console data showing top 3 positions achieved for 200+ target keywords in the tutoring niche.',
    type: 'image',
  },
  {
    id: '3',
    category: 'meta_ads',
    title: 'E-commerce ROAS 4.8x',
    description: 'Meta Ads Manager results for a fashion brand achieving 4.8x ROAS with a £15,000 monthly ad spend.',
    type: 'image',
  },
  {
    id: '4',
    category: 'google_ads',
    title: 'Lead Gen — 62% Cost Reduction',
    description: 'Google Ads campaign optimization reducing cost-per-lead by 62% while maintaining conversion volume.',
    type: 'image',
  },
  {
    id: '5',
    category: 'ai_projects',
    title: 'AI SEO Portfolio Platform',
    description: 'This AI-powered portfolio was built using Next.js + Gemini AI assistant with live SEO auditing capabilities.',
    linkUrl: '/',
    type: 'link',
  },
];

export default function WorkDataPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [items, setItems] = useState<WorkItem[]>([]);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Add item form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCat, setNewCat] = useState('analytics');
  const [newType, setNewType] = useState<'image' | 'link' | 'video'>('image');
  const [newLink, setNewLink] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load saved items from database API
    fetch('/api/work-data')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        } else {
          setItems(defaultItems);
        }
      })
      .catch(() => {
        setItems(defaultItems);
      });
    setIsAdmin(hasAuthCookie());
  }, []);

  const handleFileUpload = async (file: File): Promise<string | null> => {
    setUploading(true);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64 = e.target?.result as string;
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileName: file.name, fileType: file.type, data: base64 }),
          });
          const data = await res.json();
          resolve(data.url || null);
        } catch {
          resolve(null);
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let imageUrl: string | undefined;

    if (newType === 'image' && fileRef.current?.files?.[0]) {
      const url = await handleFileUpload(fileRef.current.files[0]);
      if (url) imageUrl = url;
    }

    const newItem: Omit<WorkItem, 'id'> = {
      category: newCat,
      title: newTitle,
      description: newDesc,
      type: newType,
      imageUrl,
      linkUrl: newType === 'link' ? newLink : undefined,
    };

    try {
      const res = await fetch('/api/work-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (res.ok) {
        const savedItem = await res.json();
        setItems(prev => [savedItem, ...prev]);
        setNewTitle('');
        setNewDesc('');
        setNewLink('');
        setNewCat('analytics');
        setNewType('image');
        if (fileRef.current) fileRef.current.value = '';
        setShowAddForm(false);
      }
    } catch (err) {
      alert('Failed to save item. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    try {
      const res = await fetch(`/api/work-data?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setItems(prev => prev.filter(i => i.id !== id));
      } else {
        alert('Failed to delete item.');
      }
    } catch {
      alert('Failed to delete item.');
    }
  };

  const filtered = activeCategory === 'all' ? items : items.filter(i => i.category === activeCategory);

  return (
    <>
      <Head>
        <title>Work Data & Results | Pial Mahmud — Digital Marketing Expert</title>
        <meta name="description" content="Real campaign data, analytics screenshots, and AI project results from Pial Mahmud's digital marketing work." />
      </Head>

      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
        <div className="grid-overlay" />
        <Navbar />

        <main style={{ position: 'relative', zIndex: 1, paddingTop: 100 }}>

          {/* Hero */}
          <section style={{ padding: '80px 0 60px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="container-main" style={{ textAlign: 'center' }}>
              <div className="section-label" style={{ justifyContent: 'center' }}>Real Results</div>
              <h1 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(36px, 5vw, 56px)',
                fontWeight: 800, color: 'var(--text-primary)',
                marginBottom: 20, lineHeight: 1.1,
              }}>
                Campaign Data &<br />
                <span className="text-gradient-gold">Proof of Results</span>
              </h1>
              <p style={{ fontSize: 16, color: 'var(--text-muted)', maxWidth: 560, margin: '0 auto', lineHeight: 1.8 }}>
                Real analytics data, ad campaign screenshots, AI-built projects, and measurable outcomes from my digital marketing work with global brands.
              </p>

              {isAdmin && (
                <button
                  onClick={() => setShowAddForm(v => !v)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    marginTop: 28, padding: '12px 28px',
                    background: 'linear-gradient(135deg, #C9A84C, #A07830)',
                    color: '#080B14', borderRadius: 10,
                    fontWeight: 700, fontSize: 13, border: 'none',
                    cursor: 'pointer', letterSpacing: '0.04em', textTransform: 'uppercase',
                  }}
                >
                  <Plus size={16} />
                  {showAddForm ? 'Close Form' : 'Add New Work Item'}
                </button>
              )}
            </div>
          </section>

          {/* Admin Add Item Form */}
          {isAdmin && showAddForm && (
            <section style={{ padding: '40px 0 0' }}>
              <div className="container-main">
                <form
                  onSubmit={handleAddItem}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    borderRadius: 20, padding: 28,
                    display: 'flex', flexDirection: 'column', gap: 18,
                    maxWidth: 700, margin: '0 auto',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Lock size={14} style={{ color: '#C9A84C' }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin — Add Work Data Entry</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 10, fontWeight: 700, color: '#6B7A99', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Title</label>
                      <input
                        value={newTitle} onChange={e => setNewTitle(e.target.value)}
                        placeholder="e.g. TutorsPlan — 412% Traffic Growth"
                        required
                        style={{
                          background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 10, padding: '10px 14px', color: '#F0F2F8', fontSize: 13, outline: 'none',
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 10, fontWeight: 700, color: '#6B7A99', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Category</label>
                      <select
                        value={newCat} onChange={e => setNewCat(e.target.value)}
                        style={{
                          background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 10, padding: '10px 14px', color: '#F0F2F8', fontSize: 13, outline: 'none',
                        }}
                      >
                        {categories.filter(c => c.id !== 'all').map(c => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 10, fontWeight: 700, color: '#6B7A99', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Description</label>
                    <textarea
                      value={newDesc} onChange={e => setNewDesc(e.target.value)}
                      rows={2} placeholder="Describe what this data shows..."
                      style={{
                        background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 10, padding: '10px 14px', color: '#F0F2F8', fontSize: 13,
                        outline: 'none', resize: 'none',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: 12 }}>
                    {(['image', 'link', 'video'] as const).map(t => (
                      <button
                        key={t} type="button"
                        onClick={() => setNewType(t)}
                        style={{
                          padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                          cursor: 'pointer', border: newType === t ? '1px solid #C9A84C' : '1px solid rgba(255,255,255,0.1)',
                          background: newType === t ? 'rgba(201,168,76,0.12)' : 'transparent',
                          color: newType === t ? '#C9A84C' : '#6B7A99',
                          textTransform: 'uppercase', letterSpacing: '0.06em',
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {newType === 'image' && (
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 700, color: '#6B7A99', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
                        Upload Screenshot / Image
                      </label>
                      <label style={{
                        display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                        padding: '12px 18px', border: '1px dashed rgba(201,168,76,0.3)',
                        borderRadius: 10, background: 'rgba(201,168,76,0.04)',
                      }}>
                        <Upload size={18} style={{ color: '#C9A84C' }} />
                        <span style={{ fontSize: 13, color: '#6B7A99' }}>
                          {fileRef.current?.files?.[0]?.name || 'Click to choose file'}
                        </span>
                        <input ref={fileRef} type="file" accept="image/*,video/*" style={{ display: 'none' }} />
                      </label>
                    </div>
                  )}

                  {newType === 'link' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 10, fontWeight: 700, color: '#6B7A99', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Project / AI Tool URL</label>
                      <input
                        value={newLink} onChange={e => setNewLink(e.target.value)}
                        placeholder="https://..."
                        style={{
                          background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 10, padding: '10px 14px', color: '#F0F2F8', fontSize: 13, outline: 'none',
                        }}
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={uploading}
                    style={{
                      padding: '14px', borderRadius: 12,
                      background: 'linear-gradient(135deg, #B76E79, #E63946)',
                      color: '#fff', fontWeight: 700, fontSize: 13,
                      border: 'none', cursor: 'pointer',
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                      opacity: uploading ? 0.6 : 1,
                    }}
                  >
                    {uploading ? 'Uploading...' : '+ Save Work Item'}
                  </button>
                </form>
              </div>
            </section>
          )}

          {/* Category Filters */}
          <section style={{ padding: '40px 0 0' }}>
            <div className="container-main">
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '8px 18px', borderRadius: 100,
                        fontSize: 12, fontWeight: 600,
                        cursor: 'pointer', transition: 'all 0.2s',
                        border: isActive ? '1px solid #C9A84C' : '1px solid rgba(255,255,255,0.1)',
                        background: isActive ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.03)',
                        color: isActive ? '#C9A84C' : 'var(--text-muted)',
                      }}
                    >
                      <Icon size={13} />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Grid */}
          <section className="section">
            <div className="container-main">
              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
                  No data items in this category yet.
                  {isAdmin && <div style={{ marginTop: 16, fontSize: 13 }}>Use the "Add New Work Item" button above to add one.</div>}
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: 24,
                }}>
                  {filtered.map((item) => (
                    <div key={item.id} className="card" style={{ position: 'relative' }}>

                      {/* Admin delete button */}
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(item.id)}
                          title="Delete"
                          style={{
                            position: 'absolute', top: 12, right: 12,
                            background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.3)',
                            borderRadius: 8, padding: 6, cursor: 'pointer', zIndex: 2,
                            display: 'flex', alignItems: 'center', color: '#E63946',
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}

                      {/* Category Badge */}
                      <div style={{ marginBottom: 14 }}>
                        <span className="badge badge-gold">
                          {categories.find(c => c.id === item.category)?.label || item.category}
                        </span>
                      </div>

                      {/* Image */}
                      {item.type === 'image' && (
                        <div
                          onClick={() => item.imageUrl && setLightboxImg(item.imageUrl)}
                          style={{
                            width: '100%', height: 200, borderRadius: 12,
                            background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(0,212,255,0.05))',
                            border: '1px dashed rgba(201,168,76,0.2)',
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                            marginBottom: 16, overflow: 'hidden',
                            cursor: item.imageUrl ? 'zoom-in' : 'default',
                          }}
                        >
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <>
                              <BarChart2 size={36} style={{ color: 'rgba(201,168,76,0.3)', marginBottom: 8 }} />
                              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Screenshot / Data Image</span>
                            </>
                          )}
                        </div>
                      )}

                      {item.type === 'link' && (
                        <div style={{
                          width: '100%', height: 140, borderRadius: 12,
                          background: 'linear-gradient(135deg, rgba(0,212,255,0.08), rgba(91,33,182,0.08))',
                          border: '1px solid rgba(0,212,255,0.15)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          marginBottom: 16,
                        }}>
                          <Brain size={40} style={{ color: 'rgba(0,212,255,0.5)' }} />
                        </div>
                      )}

                      {item.type === 'video' && (
                        <div style={{
                          width: '100%', height: 140, borderRadius: 12,
                          background: 'linear-gradient(135deg, rgba(183,110,121,0.1), rgba(230,57,70,0.08))',
                          border: '1px solid rgba(183,110,121,0.2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          marginBottom: 16,
                        }}>
                          <Video size={40} style={{ color: 'rgba(183,110,121,0.5)' }} />
                        </div>
                      )}

                      <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                        {item.title}
                      </h3>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 14 }}>
                        {item.description}
                      </p>

                      {item.linkUrl && (
                        <a
                          href={item.linkUrl}
                          target={item.linkUrl.startsWith('http') ? '_blank' : undefined}
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            fontSize: 12, fontWeight: 600, color: '#00D4FF',
                            textDecoration: 'none',
                          }}
                        >
                          <ExternalLink size={13} /> View Project
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* CTA */}
          <section style={{ padding: '60px 0', borderTop: '1px solid rgba(255,255,255,0.04)', textAlign: 'center' }}>
            <div className="container-main">
              <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 20 }}>
                Want results like these for your business?
              </p>
              <Link href="/contact" className="btn-primary">
                <span>Get Your Free Strategy Call</span>
                <ExternalLink size={15} />
              </Link>
            </div>
          </section>

        </main>

        {/* Lightbox */}
        {lightboxImg && (
          <div
            onClick={() => setLightboxImg(null)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.92)',
              zIndex: 9000,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 20, cursor: 'zoom-out',
            }}
          >
            <img
              src={lightboxImg}
              alt="Preview"
              style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: 12, boxShadow: '0 40px 80px rgba(0,0,0,0.8)' }}
            />
            <button
              onClick={() => setLightboxImg(null)}
              style={{
                position: 'absolute', top: 20, right: 20,
                background: 'rgba(255,255,255,0.1)', border: 'none',
                color: '#fff', borderRadius: '50%', width: 44, height: 44,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
}
