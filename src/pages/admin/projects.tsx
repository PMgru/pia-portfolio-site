'use client';
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { 
  Briefcase, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  BookOpen, 
  Sparkles,
  TrendingUp,
  FileCheck,
  ImagePlus,
  Upload,
  X
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import AdminLayout from '@/components/AdminLayout';

interface Project {
  id: string;
  title: string;
  description: string;
  challenge: string;
  solution: string;
  results: string;
  impact_metrics: Record<string, string>;
  image: string;
  technologies: string[];
}

export default function ProjectsCms() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Form Editor Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [challenge, setChallenge] = useState('');
  const [solution, setSolution] = useState('');
  const [results, setResults] = useState('');
  const [techString, setTechString] = useState('');
  const [metricKey1, setMetricKey1] = useState('traffic_growth');
  const [metricVal1, setMetricVal1] = useState('340%');
  const [metricKey2, setMetricKey2] = useState('cac_reduction');
  const [metricVal2, setMetricVal2] = useState('45%');
  const [imageUrl, setImageUrl] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  // Image upload handler
  const handleImageUpload = async (file: File) => {
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowed.includes(file.type)) {
      toast.error('Only image files (JPEG, PNG, GIF, WebP, SVG) are allowed.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Max 10MB.');
      return;
    }
    setImageUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: `project-${Date.now()}-${file.name}`,
            fileType: file.type,
            data: base64,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setImageUrl(data.url);
          toast.success('Image uploaded!', { style: { background: '#121218', color: '#F4F4F9' } });
        } else {
          toast.error(data.message || 'Upload failed');
        }
        setImageUploading(false);
      };
      reader.onerror = () => {
        toast.error('Failed to read file');
        setImageUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error('Upload failed');
      setImageUploading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.status === 401) {
        router.push('/admin');
        return;
      }
      const data = await res.json();
      setProjects(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleEdit = (p: Project) => {
    setEditingId(p.id);
    setTitle(p.title || '');
    setDescription(p.description || '');
    setChallenge(p.challenge || '');
    setSolution(p.solution || '');
    setResults(p.results || '');
    setTechString(p.technologies?.join(', ') || '');
    setImageUrl(p.image || '');
    
    // Impact metrics parse
    const keys = Object.keys(p.impact_metrics || {});
    if (keys[0]) {
      setMetricKey1(keys[0]);
      setMetricVal1(p.impact_metrics[keys[0]]);
    }
    if (keys[1]) {
      setMetricKey2(keys[1]);
      setMetricVal2(p.impact_metrics[keys[1]]);
    }

    setShowEditor(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const technologies = techString.split(',').map(t => t.trim()).filter(Boolean);
    const impact_metrics: Record<string, string> = {};
    if (metricKey1.trim() && metricVal1.trim()) {
      impact_metrics[metricKey1.trim()] = metricVal1.trim();
    }
    if (metricKey2.trim() && metricVal2.trim()) {
      impact_metrics[metricKey2.trim()] = metricVal2.trim();
    }

    const payload = {
      title,
      description,
      challenge,
      solution,
      results,
      technologies,
      impact_metrics,
      image: imageUrl || '/images/placeholder.jpg',
      featured: true,
      case_study: title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/projects?id=${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          toast.success('Case study updated successfully!', { style: { background: '#121218', color: '#F4F4F9' } });
        }
      } else {
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          toast.success('New case study published successfully!', { style: { background: '#121218', color: '#F4F4F9' } });
        }
      }
      resetForm();
      loadProjects();
    } catch (e) {
      toast.error('CMS save failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this case study?')) return;
    try {
      const res = await fetch(`/api/projects?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        toast.success('Case study deleted');
        loadProjects();
      }
    } catch (e) {
      toast.error('Delete failed');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setChallenge('');
    setSolution('');
    setResults('');
    setTechString('');
    setMetricKey1('traffic_growth');
    setMetricVal1('');
    setMetricKey2('cac_reduction');
    setMetricVal2('');
    setImageUrl('');
    setShowEditor(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] text-white flex items-center justify-center font-body">
        <div className="w-8 h-8 rounded-full border-2 border-[#B76E79] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Case Studies CMS | PM Admin Suite</title>
      </Head>
      <Toaster position="top-right" />

      <div className="flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#B76E79]/15 pb-6">
          <div className="flex flex-col gap-1 text-left">
            <h1 className="text-2xl md:text-3xl font-bold font-headings text-white">Case Studies CMS</h1>
            <p className="text-xs text-textSecondary">Manage client growth metrics and campaign narratives.</p>
          </div>
          {!showEditor && (
            <button 
              onClick={() => setShowEditor(true)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-gradient-to-r from-[#B76E79] to-[#E63946] text-white transition-all"
            >
              <Plus className="w-4 h-4" /> Add Case Study
            </button>
          )}
        </div>

        {showEditor ? (
          <form onSubmit={handleSave} className="grid lg:grid-cols-12 gap-8 text-left">
            
            {/* Editor Block (8 cols) */}
            <div className="lg:col-span-8 p-6 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col gap-5">
              <h3 className="text-sm font-bold uppercase tracking-wider font-headings text-white mb-2 pb-3 border-b border-white/5">
                {editingId ? 'Modify Narrative' : 'New Case Study Narrative'}
              </h3>

              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Campaign Title / Headline</label>
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Gloria Tech - 340% Traffic Growth"
                  className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79]"
                  required
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Executive Summary</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Insert short summary..."
                  rows={2}
                  className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79] resize-none"
                  required
                />
              </div>

              {/* Challenge & Solution Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">The Client Challenge</label>
                  <textarea 
                    value={challenge}
                    onChange={(e) => setChallenge(e.target.value)}
                    placeholder="Describe stagnant rankings or conversion drop-offs..."
                    rows={4}
                    className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#B76E79]"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 font-bold">The Strategic Solution</label>
                  <textarea 
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    placeholder="Describe content clustering, audit schema cleanups, or ad layouts..."
                    rows={4}
                    className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#B76E79]"
                    required
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 border-t border-white/5 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-grow py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-textSecondary bg-white/5 border border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-grow py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#B76E79] to-[#E63946] flex items-center justify-center gap-1.5"
                >
                  Publish Narrative <Save className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Sidebar configurations (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Metrics setup */}
              <div className="p-6 rounded-2xl bg-[#121218] border border-white/5 flex flex-col gap-4">
                <h4 className="text-xs font-bold uppercase tracking-wider font-headings text-[#F4C27F]">Impact Key Results</h4>
                
                {/* Metric 1 */}
                <div className="grid grid-cols-2 gap-2 pb-3 border-b border-white/5">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] uppercase font-bold tracking-wider text-[#9A8F95]">Metric Name</label>
                    <input 
                      type="text"
                      value={metricKey1}
                      onChange={(e) => setMetricKey1(e.target.value)}
                      placeholder="e.g. traffic_growth"
                      className="bg-[#0A0A0F] border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] uppercase font-bold tracking-wider text-[#9A8F95]">Metric Value</label>
                    <input 
                      type="text"
                      value={metricVal1}
                      onChange={(e) => setMetricVal1(e.target.value)}
                      placeholder="e.g. 340%"
                      className="bg-[#0A0A0F] border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] uppercase font-bold tracking-wider text-[#9A8F95]">Metric Name</label>
                    <input 
                      type="text"
                      value={metricKey2}
                      onChange={(e) => setMetricKey2(e.target.value)}
                      placeholder="e.g. ROI"
                      className="bg-[#0A0A0F] border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] uppercase font-bold tracking-wider text-[#9A8F95]">Metric Value</label>
                    <input 
                      type="text"
                      value={metricVal2}
                      onChange={(e) => setMetricVal2(e.target.value)}
                      placeholder="e.g. 500%"
                      className="bg-[#0A0A0F] border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white"
                    />
                  </div>
                </div>

              </div>

              {/* Technologies setup */}
              <div className="p-6 rounded-2xl bg-[#121218] border border-white/5 flex flex-col gap-3">
                <h4 className="text-xs font-bold uppercase tracking-wider font-headings text-white">Tags & Technologies</h4>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase font-bold tracking-wider text-[#9A8F95]">Technologies (comma separated)</label>
                  <input 
                    type="text"
                    value={techString}
                    onChange={(e) => setTechString(e.target.value)}
                    placeholder="e.g. Google Search Console, SEM"
                    className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="p-6 rounded-2xl bg-[#121218] border border-white/5 flex flex-col gap-3">
                <h4 className="text-xs font-bold uppercase tracking-wider font-headings text-[#B76E79] flex items-center gap-2">
                  <ImagePlus className="w-4 h-4" /> Project Cover Image
                </h4>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                />
                {imageUrl ? (
                  <div className="relative group">
                    <img
                      src={imageUrl}
                      alt="Project cover"
                      className="w-full h-36 object-cover rounded-xl border border-white/10"
                    />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 border border-white/10 text-white/60 hover:text-[#E63946] hover:border-[#E63946]/30 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={imageUploading}
                    className="w-full py-8 rounded-xl border-2 border-dashed border-white/10 hover:border-[#B76E79]/40 bg-white/[0.01] text-center transition-colors flex flex-col items-center gap-2 disabled:opacity-50"
                  >
                    {imageUploading ? (
                      <>
                        <div className="w-5 h-5 rounded-full border-2 border-[#B76E79] border-t-transparent animate-spin" />
                        <span className="text-xs text-[#9A8F95]">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-[#9A8F95]" />
                        <span className="text-xs text-[#9A8F95]">Click to upload cover image</span>
                        <span className="text-[9px] text-[#6B7A99]">JPEG, PNG, WebP • Max 10MB</span>
                      </>
                    )}
                  </button>
                )}
              </div>

            </div>

          </form>
        ) : (
          /* List View */
          <div className="flex flex-col gap-4">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider font-headings text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#B76E79]" /> Active Case Studies
              </h3>
              <span className="text-[10px] font-bold text-textSecondary uppercase tracking-widest">{projects.length} narratives live</span>
            </div>

            <div className="flex flex-col gap-4">
              {projects.map((proj) => (
                <div 
                  key={proj.id} 
                  className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-[#B76E79]/20 transition-all text-left"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      {Object.entries(proj.impact_metrics || {}).map(([k, v], i) => (
                        <span key={i} className="text-[10px] uppercase font-bold text-[#F4C27F] px-2 py-0.5 rounded bg-[#F4C27F]/10 border border-[#F4C27F]/20">
                          {k}: {v}
                        </span>
                      ))}
                    </div>
                    <span className="text-base font-bold font-headings text-white mt-2">{proj.title}</span>
                    <p className="text-xs text-textSecondary max-w-xl leading-relaxed mt-0.5">{proj.description}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={() => handleEdit(proj)}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#F4C27F] text-[#F4C27F] flex items-center justify-center transition-colors"
                      aria-label="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(proj.id)}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#E63946] text-[#E63946] flex items-center justify-center transition-colors"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </AdminLayout>
  );
}
