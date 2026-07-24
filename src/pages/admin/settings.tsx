'use client';
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Settings, Save, Key, MessageSquare, ShieldAlert,
  Image as ImageIcon, Plus, X, Upload, Globe, Type,
  Building2, BarChart2, User, Award, Trash2, Briefcase, FileText
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import AdminLayout from '@/components/AdminLayout';
import { hasAuthCookie } from '@/lib/auth-client';

const tabs = [
  { id: 'text', label: 'Home Text', icon: Type },
  { id: 'about', label: 'About Page', icon: User },
  { id: 'services', label: 'Services', icon: Award },
  { id: 'workdata', label: 'Work Data', icon: BarChart2 },
  { id: 'projects_redirect', label: 'Case Studies', icon: Briefcase },
  { id: 'blog_redirect', label: 'Blog CMS', icon: FileText },
  { id: 'contact', label: 'Contact Info', icon: MessageSquare },
  { id: 'logos', label: 'Company Logos', icon: Building2 },
  { id: 'images', label: 'Photo Upload', icon: ImageIcon },
  { id: 'seo', label: 'SEO Metadata', icon: Globe },
  { id: 'keys', label: 'API Keys', icon: Key },
];

interface Logo {
  id: string;
  name: string;
  url: string;
}

export default function SiteSettings() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('text');
  const [loading, setLoading] = useState(true);

  // ─── Text Tab ───────────────────────────────
  const [heroTitle, setHeroTitle] = useState('Engineering Digital Growth Beyond the Algorithm.');
  const [heroSubtitle, setHeroSubtitle] = useState('AI-Powered Digital Marketing & SEO Expert');
  const [yearsExp, setYearsExp] = useState('5');
  const [projectsCount, setProjectsCount] = useState('50+');
  const [satisfiedClients, setSatisfiedClients] = useState('98%');
  const [ctaText, setCtaText] = useState('Start Your Project');

  // ─── Logos Tab ──────────────────────────────
  const [logos, setLogos] = useState<Logo[]>([]);
  const [newLogoName, setNewLogoName] = useState('');
  const logoFileRef = useRef<HTMLInputElement>(null);

  // ─── Image Tab ──────────────────────────────
  const [profileImageUrl, setProfileImageUrl] = useState('/images/pial-photo.jpg');
  const [logoImageUrl, setLogoImageUrl] = useState('');
  const profileFileRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, boolean>>({});

  // ─── SEO Tab ────────────────────────────────
  const [seoPages, setSeoPages] = useState<any[]>([]);

  // ─── Contact Tab ────────────────────────────
  const [email, setEmail] = useState('pial@pialmahmud.com');
  const [phone, setPhone] = useState('+8801718223748');
  const [location, setLocation] = useState('Dhaka, Bangladesh');
  const [availability, setAvailability] = useState('Mon–Fri, 9am–6pm (BST)');
  const [contactServicesText, setContactServicesText] = useState(
    'Technical SEO Optimization\nFull Digital Marketing Strategy\nAI Marketing Setup\nContent Strategy\nGoogle Ads / PPC\nSocial Media Management\nLink Building\nOther / Not Sure'
  );
  const [budgetOptionsText, setBudgetOptionsText] = useState(
    'Under $500\n$500 – $1,000\n$1,000 – $2,500\n$2,500 – $5,000\n$5,000+'
  );

  // ─── Keys Tab ───────────────────────────────
  const [openRouterKey, setOpenRouterKey] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('+8801718223748');
  const [linkedinUrl, setLinkedinUrl] = useState('https://www.linkedin.com/in/pial-mahmud-');

  // ─── About Page Tab ───────────────────────────
  const [aboutTitle, setAboutTitle] = useState('Turning Digital Presence into | Measurable Growth');
  const [aboutIntro, setAboutIntro] = useState("I'm Pial Mahmud, an AI-powered Digital Marketing & SEO Expert based in Bangladesh...");
  const [aboutDesc, setAboutDesc] = useState("I combine deep technical SEO expertise...");
  const [skillsList, setSkillsList] = useState<any[]>([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(90);
  const [experiencesList, setExperiencesList] = useState<any[]>([]);
  const [newExpRole, setNewExpRole] = useState('');
  const [newExpCompany, setNewExpCompany] = useState('');
  const [newExpStart, setNewExpStart] = useState('');
  const [newExpEnd, setNewExpEnd] = useState('');
  const [newExpIsCurrent, setNewExpIsCurrent] = useState(false);
  const [newExpDesc, setNewExpDesc] = useState('');

  // ─── Services Tab ─────────────────────────────
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [newServTitle, setNewServTitle] = useState('');
  const [newServDesc, setNewServDesc] = useState('');
  const [newServIcon, setNewServIcon] = useState('🎯');
  const [newServPrice, setNewServPrice] = useState('$999/mo');
  const [newServFeatures, setNewServFeatures] = useState('');

  // ─── Work Data Tab ────────────────────────────
  const [workItemsList, setWorkItemsList] = useState<any[]>([]);
  const [newWorkTitle, setNewWorkTitle] = useState('');
  const [newWorkDesc, setNewWorkDesc] = useState('');
  const [newWorkCat, setNewWorkCat] = useState('analytics');
  const [newWorkType, setNewWorkType] = useState<'image' | 'link' | 'video'>('image');
  const [newWorkLink, setNewWorkLink] = useState('');
  const [newWorkUploadProgress, setNewWorkUploadProgress] = useState(false);
  const workFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!hasAuthCookie()) { router.push('/admin'); return; }
    const storedKey = localStorage.getItem('NEXT_PUBLIC_OPENROUTER_API_KEY') || '';
    setOpenRouterKey(storedKey);

    // Load server-side settings
    (async () => {
      try {
        const settingsRes = await fetch('/api/settings?home=1');
        if (settingsRes.ok) {
          const { settings, home } = await settingsRes.json();
          if (settings.profile_image) setProfileImageUrl(settings.profile_image);
          if (settings.logo_image) setLogoImageUrl(settings.logo_image);
          if (settings.hero_title) setHeroTitle(settings.hero_title);
          if (settings.hero_subtitle) setHeroSubtitle(settings.hero_subtitle);
          if (settings.years_exp) setYearsExp(settings.years_exp);
          if (settings.projects_count) setProjectsCount(settings.projects_count);
          if (settings.satisfied_clients) setSatisfiedClients(settings.satisfied_clients);
          if (settings.cta_text) setCtaText(settings.cta_text);
          if (settings.whatsapp_url) setWhatsappUrl(String(settings.whatsapp_url).replace('https://wa.me/', ''));
          if (settings.linkedin_url) setLinkedinUrl(settings.linkedin_url);
          if (settings.email) setEmail(settings.email);
          if (settings.phone) setPhone(settings.phone);
          if (settings.location) setLocation(settings.location);
          if (settings.availability) setAvailability(settings.availability);
          if (settings.about_title) setAboutTitle(settings.about_title);
          if (settings.about_intro) setAboutIntro(settings.about_intro);
          if (settings.about_desc) setAboutDesc(settings.about_desc);
          if (settings.contact_services) {
            try {
              const arr = typeof settings.contact_services === 'string' ? JSON.parse(settings.contact_services) : settings.contact_services;
              if (Array.isArray(arr)) setContactServicesText(arr.join('\n'));
            } catch { /* keep default */ }
          }
          if (settings.budget_options) {
            try {
              const arr = typeof settings.budget_options === 'string' ? JSON.parse(settings.budget_options) : settings.budget_options;
              if (Array.isArray(arr)) setBudgetOptionsText(arr.join('\n'));
            } catch { /* keep default */ }
          }

          if (home?.clients && Array.isArray(home.clients)) {
            setLogos(home.clients.map((c: any, index: number) => ({
              id: String(index),
              name: c.name,
              url: c.logo
            })));
          }
        }

        const [pagesRes, skillsRes, expRes, servRes, workRes] = await Promise.all([
          fetch('/api/pages'),
          fetch('/api/skills'),
          fetch('/api/experiences'),
          fetch('/api/services'),
          fetch('/api/work-data')
        ]);
        if (pagesRes.ok) {
          const data = await pagesRes.json();
          if (Array.isArray(data)) {
            setSeoPages(data.map(p => ({
              slug: p.slug,
              title: p.meta_title || p.title || '',
              desc: p.meta_description || ''
            })));
          }
        }
        if (skillsRes.ok) setSkillsList(await skillsRes.json());
        if (expRes.ok) setExperiencesList(await expRes.json());
        if (servRes.ok) setServicesList(await servRes.json());
        if (workRes.ok) setWorkItemsList(await workRes.json());
      } catch {
        /* Keep initial state on error */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ─── File Upload Helper ──────────────────────
  const uploadFile = async (file: File, key: string): Promise<string | null> => {
    setUploadProgress(p => ({ ...p, [key]: true }));
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64 = e.target?.result as string;
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: file.name,
              fileType: file.type,
              data: base64,
            }),
          });
          const data = await res.json();
          resolve(data.url || null);
        } catch {
          resolve(null);
        } finally {
          setUploadProgress(p => ({ ...p, [key]: false }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // ─── About Tab Helpers ───────────────────────────
  const saveAboutPageText = async () => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          about_title: aboutTitle.trim(),
          about_intro: aboutIntro.trim(),
          about_desc: aboutDesc.trim(),
        })
      });
      if (res.ok) {
        toast.success('About page texts saved!', { style: { background: '#121218', color: '#fff' } });
      } else {
        toast.error('Failed to save About page texts');
      }
    } catch {
      toast.error('Failed to save About page texts');
    }
  };

  const addSkill = async () => {
    if (!newSkillName.trim()) return;
    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill_name: newSkillName.trim(),
          proficiency_level: Number(newSkillLevel),
          display_order: skillsList.length + 1
        })
      });
      if (res.ok) {
        const added = await res.json();
        setSkillsList(prev => [...prev, added]);
        setNewSkillName('');
        toast.success('Skill added!');
      }
    } catch {
      toast.error('Failed to add skill');
    }
  };

  const deleteSkill = async (id: string) => {
    if (!confirm('Delete this skill?')) return;
    try {
      const res = await fetch(`/api/skills?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSkillsList(prev => prev.filter(s => s.id !== id));
        toast.success('Skill deleted');
      }
    } catch {
      toast.error('Failed to delete skill');
    }
  };

  const addExperience = async () => {
    if (!newExpRole.trim() || !newExpCompany.trim()) return;
    try {
      const res = await fetch('/api/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_title: newExpRole.trim(),
          company_name: newExpCompany.trim(),
          start_date: newExpStart || new Date().toISOString().split('T')[0],
          end_date: newExpIsCurrent ? '' : newExpEnd,
          is_current: newExpIsCurrent,
          description: newExpDesc.trim(),
          display_order: experiencesList.length + 1
        })
      });
      if (res.ok) {
        const added = await res.json();
        setExperiencesList(prev => [...prev, added]);
        setNewExpRole('');
        setNewExpCompany('');
        setNewExpStart('');
        setNewExpEnd('');
        setNewExpIsCurrent(false);
        setNewExpDesc('');
        toast.success('Experience added!');
      }
    } catch {
      toast.error('Failed to add experience');
    }
  };

  const deleteExperience = async (id: string) => {
    if (!confirm('Delete this experience?')) return;
    try {
      const res = await fetch(`/api/experiences?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setExperiencesList(prev => prev.filter(e => e.id !== id));
        toast.success('Experience deleted');
      }
    } catch {
      toast.error('Failed to delete experience');
    }
  };

  // ─── Services Tab Helpers ────────────────────────
  const addService = async () => {
    if (!newServTitle.trim() || !newServDesc.trim()) return;
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newServTitle.trim(),
          description: newServDesc.trim(),
          icon: newServIcon.trim(),
          price: newServPrice.trim(),
          features: newServFeatures.split('\n').map(f => f.trim()).filter(Boolean),
          display_order: servicesList.length + 1
        })
      });
      if (res.ok) {
        const added = await res.json();
        setServicesList(prev => [...prev, added]);
        setNewServTitle('');
        setNewServDesc('');
        setNewServIcon('🎯');
        setNewServPrice('$999/mo');
        setNewServFeatures('');
        toast.success('Service added!');
      }
    } catch {
      toast.error('Failed to add service');
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    try {
      const res = await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setServicesList(prev => prev.filter(s => s.id !== id));
        toast.success('Service deleted');
      }
    } catch {
      toast.error('Failed to delete service');
    }
  };

  // ─── Work Data Tab Helpers ───────────────────────
  const addWorkItem = async () => {
    if (!newWorkTitle.trim()) return;
    setNewWorkUploadProgress(true);
    let imageUrl = '';
    
    if (newWorkType === 'image' && workFileRef.current?.files?.[0]) {
      toast.loading('Uploading screenshot...', { id: 'work-upload' });
      const url = await uploadFile(workFileRef.current.files[0], 'new-work-item');
      if (url) {
        imageUrl = url;
        toast.success('Screenshot uploaded!', { id: 'work-upload' });
      } else {
        toast.error('Upload failed', { id: 'work-upload' });
        setNewWorkUploadProgress(false);
        return;
      }
    }
    
    try {
      const res = await fetch('/api/work-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: newWorkCat,
          title: newWorkTitle.trim(),
          description: newWorkDesc.trim(),
          type: newWorkType,
          imageUrl: newWorkType === 'image' ? imageUrl : undefined,
          linkUrl: newWorkType === 'link' ? newWorkLink.trim() : undefined,
        })
      });
      if (res.ok) {
        const added = await res.json();
        setWorkItemsList(prev => [added, ...prev]);
        setNewWorkTitle('');
        setNewWorkDesc('');
        setNewWorkLink('');
        if (workFileRef.current) workFileRef.current.value = '';
        toast.success('Work data item added!');
      }
    } catch {
      toast.error('Failed to add work data item');
    } finally {
      toast.dismiss('work-upload');
      setNewWorkUploadProgress(false);
    }
  };

  const deleteWorkItem = async (id: string) => {
    if (!confirm('Delete this work item?')) return;
    try {
      const res = await fetch(`/api/work-data?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setWorkItemsList(prev => prev.filter(w => w.id !== id));
        toast.success('Work item deleted');
      }
    } catch {
      toast.error('Failed to delete work item');
    }
  };

  // ─── Save Handlers ───────────────────────────
  const saveText = async () => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hero_title: heroTitle,
          hero_subtitle: heroSubtitle,
          years_exp: yearsExp,
          projects_count: projectsCount,
          satisfied_clients: satisfiedClients,
          cta_text: ctaText
        })
      });
      if (res.ok) {
        toast.success('Site text saved to database!', { style: { background: '#121218', color: '#fff' } });
      } else {
        toast.error('Failed to save settings');
      }
    } catch {
      toast.error('Failed to save settings');
    }
  };

  const saveLogos = async () => {
    try {
      const payload = logos.map(l => ({
        name: l.name,
        logo: l.url || '',
        tag: 'Partner'
      }));
      const res = await fetch('/api/settings?section=clients', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: payload })
      });
      if (res.ok) {
        toast.success('Client logos saved to server and live on site!', { style: { background: '#121218', color: '#fff' } });
      } else {
        toast.error('Failed to save logos');
      }
    } catch {
      toast.error('Failed to save logos');
    }
  };

  const saveKeys = async () => {
    localStorage.setItem('NEXT_PUBLIC_OPENROUTER_API_KEY', openRouterKey);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whatsapp_url: `https://wa.me/${whatsappUrl.trim()}`,
          linkedin_url: linkedinUrl.trim()
        })
      });
      if (res.ok) {
        toast.success('API & redirect settings saved!', { style: { background: '#121218', color: '#fff' } });
      } else {
        toast.error('Failed to save settings');
      }
    } catch {
      toast.error('Failed to save settings');
    }
  };

  const saveContact = async () => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          phone: phone.trim(),
          location: location.trim(),
          availability: availability.trim(),
          contact_services: JSON.stringify(contactServicesText.split('\n').map(s => s.trim()).filter(Boolean)),
          budget_options: JSON.stringify(budgetOptionsText.split('\n').map(s => s.trim()).filter(Boolean)),
        })
      });
      if (res.ok) {
        toast.success('Contact info saved!', { style: { background: '#121218', color: '#fff' } });
      } else {
        toast.error('Failed to save contact info');
      }
    } catch {
      toast.error('Failed to save contact info');
    }
  };

  const saveSeo = async () => {
    try {
      const savePromises = seoPages.map(page => {
        return fetch(`/api/pages?slug=${page.slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            meta_title: page.title,
            meta_description: page.desc
          })
        });
      });
      await Promise.all(savePromises);
      toast.success('SEO metadata saved and live on site!', { style: { background: '#121218', color: '#fff' } });
    } catch {
      toast.error('Failed to save SEO metadata');
    }
  };

  const addLogo = () => {
    if (!newLogoName.trim()) return;
    setLogos(prev => [...prev, { id: Date.now().toString(), name: newLogoName.trim(), url: '' }]);
    setNewLogoName('');
  };

  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, logoId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    toast.loading('Uploading logo...', { id: 'logo-upload' });
    const url = await uploadFile(file, `logo-${logoId}`);
    if (url) {
      setLogos(prev => prev.map(l => l.id === logoId ? { ...l, url } : l));
      toast.success('Logo uploaded!', { id: 'logo-upload' });
    } else {
      toast.error('Upload failed', { id: 'logo-upload' });
    }
  };

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    toast.loading('Uploading photo...', { id: 'profile-upload' });
    const url = await uploadFile(file, 'profile');
    if (url) {
      try {
        await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile_image: url }),
        });
        setProfileImageUrl(url);
        toast.success('Profile photo updated — live on the site!', { id: 'profile-upload' });
      } catch {
        toast.error('Failed to save profile picture on server', { id: 'profile-upload' });
      }
    } else {
      toast.error('Upload failed', { id: 'profile-upload' });
    }
  };

  const handleLogoImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    toast.loading('Uploading site logo...', { id: 'logo-img-upload' });
    const url = await uploadFile(file, 'sitelogo');
    if (url) {
      try {
        await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ logo_image: url }),
        });
        setLogoImageUrl(url);
        toast.success('Site logo updated!', { id: 'logo-img-upload' });
      } catch {
        toast.error('Failed to save logo on server', { id: 'logo-img-upload' });
      }
    } else {
      toast.error('Upload failed', { id: 'logo-img-upload' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] text-white flex items-center justify-center font-body">
        <div className="w-8 h-8 rounded-full border-2 border-[#B76E79] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <Head><title>Site Settings | PM Admin Suite</title></Head>
      <Toaster position="top-right" />

      <div className="flex flex-col gap-6 text-left">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#B76E79]/15 pb-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl md:text-3xl font-bold font-headings text-white">Site Configuration</h1>
            <p className="text-xs text-textSecondary">Customize site text, logos, photos, SEO tags, and API keys.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap border-b border-white/5 pb-4">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#B76E79]/20 to-[#E63946]/10 text-[#B76E79] border border-[#B76E79]/30'
                    : 'text-[#9A8F95] hover:text-white bg-white/[0.02] border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── TEXT TAB ─────────────────────── */}
        {activeTab === 'text' && (
          <div className="flex flex-col gap-5 p-6 rounded-2xl bg-white/[0.01] border border-white/5">
            <h2 className="text-sm font-bold font-headings text-white uppercase tracking-wider border-b border-white/5 pb-3">Homepage Text Customizer</h2>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Hero Main Headline</label>
              <input value={heroTitle} onChange={e => setHeroTitle(e.target.value)}
                className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79]"
                placeholder="Engineering Digital Growth..."
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Hero Subtitle / Tagline</label>
              <input value={heroSubtitle} onChange={e => setHeroSubtitle(e.target.value)}
                className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79]"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Years Experience</label>
                <input value={yearsExp} onChange={e => setYearsExp(e.target.value)}
                  className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Projects Completed</label>
                <input value={projectsCount} onChange={e => setProjectsCount(e.target.value)}
                  className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Client Satisfaction</label>
                <input value={satisfiedClients} onChange={e => setSatisfiedClients(e.target.value)}
                  className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Primary CTA Button Text</label>
              <input value={ctaText} onChange={e => setCtaText(e.target.value)}
                className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79]"
              />
            </div>

            <button onClick={saveText}
              className="mt-2 py-3 px-6 rounded-xl text-white font-bold bg-gradient-to-r from-[#B76E79] to-[#E63946] flex items-center gap-2 self-start hover:scale-[1.02] transition-all"
            >
              <Save className="w-4 h-4" /> Save Text Settings
            </button>
          </div>
        )}

        {/* ── ABOUT TAB ───────────────────────── */}
        {activeTab === 'about' && (
          <div className="flex flex-col gap-8">
            {/* General About Text */}
            <div className="flex flex-col gap-5 p-6 rounded-2xl bg-white/[0.01] border border-white/5">
              <h2 className="text-sm font-bold font-headings text-white uppercase tracking-wider border-b border-white/5 pb-3">About Page Text</h2>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">About Hero Title (Use | for new line/gradient)</label>
                <input value={aboutTitle} onChange={e => setAboutTitle(e.target.value)}
                  className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79]"
                  placeholder="Turning Digital Presence into | Measurable Growth"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Intro Bio Text</label>
                <textarea value={aboutIntro} onChange={e => setAboutIntro(e.target.value)} rows={3}
                  className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79] resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Secondary Description Text</label>
                <textarea value={aboutDesc} onChange={e => setAboutDesc(e.target.value)} rows={3}
                  className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79] resize-none"
                />
              </div>

              <button onClick={saveAboutPageText}
                className="py-3 px-6 rounded-xl text-white font-bold bg-gradient-to-r from-[#B76E79] to-[#E63946] flex items-center gap-2 self-start hover:scale-[1.02] transition-all text-xs"
              >
                <Save className="w-4 h-4" /> Save About Texts
              </button>
            </div>

            {/* Skills CRUD */}
            <div className="flex flex-col gap-5 p-6 rounded-2xl bg-white/[0.01] border border-white/5">
              <h2 className="text-sm font-bold font-headings text-white uppercase tracking-wider border-b border-white/5 pb-3">Professional Skills</h2>
              
              <div className="flex gap-3 items-end">
                <div className="flex-grow flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Skill Name</label>
                  <input value={newSkillName} onChange={e => setNewSkillName(e.target.value)}
                    placeholder="e.g. Technical SEO Optimization"
                    className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79]"
                  />
                </div>
                <div className="w-32 flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Level (%)</label>
                  <input type="number" min="0" max="100" value={newSkillLevel} onChange={e => setNewSkillLevel(Number(e.target.value))}
                    className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79]"
                  />
                </div>
                <button onClick={addSkill}
                  className="px-5 py-3.5 rounded-xl bg-[#B76E79]/20 border border-[#B76E79]/30 text-[#B76E79] font-bold flex items-center gap-1.5 text-xs hover:bg-[#B76E79]/30 transition-all shrink-0"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                {skillsList.map(skill => (
                  <div key={skill.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-semibold text-white">{skill.skill_name}</span>
                      <span className="text-xs text-[#9A8F95]">Proficiency: {skill.proficiency_level}%</span>
                    </div>
                    <button onClick={() => deleteSkill(skill.id)}
                      className="p-2 rounded-lg text-[#E63946] hover:bg-[#E63946]/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Experiences CRUD */}
            <div className="flex flex-col gap-5 p-6 rounded-2xl bg-white/[0.01] border border-white/5">
              <h2 className="text-sm font-bold font-headings text-white uppercase tracking-wider border-b border-white/5 pb-3">Work Experiences</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Job Title</label>
                  <input value={newExpRole} onChange={e => setNewExpRole(e.target.value)} placeholder="e.g. SEO & Growth Lead"
                    className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Company Name</label>
                  <input value={newExpCompany} onChange={e => setNewExpCompany(e.target.value)} placeholder="e.g. Gloria Tech Ltd"
                    className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Start Date</label>
                  <input type="date" value={newExpStart} onChange={e => setNewExpStart(e.target.value)}
                    className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">End Date (Leave empty if current)</label>
                  <input type="date" value={newExpEnd} onChange={e => setNewExpEnd(e.target.value)} disabled={newExpIsCurrent}
                    className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79] disabled:opacity-30"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="isCurrentCheckbox" checked={newExpIsCurrent} onChange={e => setNewExpIsCurrent(e.target.checked)} className="rounded bg-[#121218] border-white/10 accent-[#B76E79]" />
                <label htmlFor="isCurrentCheckbox" className="text-xs text-white cursor-pointer select-none">I currently work in this role</label>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Description / Accomplishments</label>
                <textarea value={newExpDesc} onChange={e => setNewExpDesc(e.target.value)} rows={3} placeholder="Leading organic search, schema setup, metrics delivered..."
                  className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79] resize-none"
                />
              </div>

              <button onClick={addExperience}
                className="px-5 py-3 rounded-xl bg-[#B76E79]/20 border border-[#B76E79]/30 text-[#B76E79] font-bold flex items-center gap-1.5 text-xs hover:bg-[#B76E79]/30 transition-all self-start"
              >
                <Plus className="w-4 h-4" /> Add Experience Entry
              </button>

              <div className="flex flex-col gap-3 mt-2 max-h-[300px] overflow-y-auto pr-1">
                {experiencesList.map(exp => (
                  <div key={exp.id} className="flex items-start justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 text-left">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-white">{exp.job_title} at <span className="text-[#B76E79]">{exp.company_name}</span></span>
                      <span className="text-xs text-[#9A8F95]">{exp.start_date} — {exp.is_current ? 'Present' : exp.end_date}</span>
                      <p className="text-xs text-textSecondary mt-1 line-clamp-2">{exp.description}</p>
                    </div>
                    <button onClick={() => deleteExperience(exp.id)}
                      className="p-2 rounded-lg text-[#E63946] hover:bg-[#E63946]/10 transition-all shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SERVICES TAB ────────────────────── */}
        {activeTab === 'services' && (
          <div className="flex flex-col gap-6 p-6 rounded-2xl bg-white/[0.01] border border-white/5">
            <h2 className="text-sm font-bold font-headings text-white uppercase tracking-wider border-b border-white/5 pb-3">Services Packages</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Service Title</label>
                <input value={newServTitle} onChange={e => setNewServTitle(e.target.value)} placeholder="e.g. AI-Powered SEO Strategy"
                  className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Emoji Icon</label>
                  <input value={newServIcon} onChange={e => setNewServIcon(e.target.value)} placeholder="🤖, 📈, 🚀"
                    className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Price Label</label>
                  <input value={newServPrice} onChange={e => setNewServPrice(e.target.value)} placeholder="e.g. $999/mo or Custom"
                    className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79]"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Service Description</label>
              <textarea value={newServDesc} onChange={e => setNewServDesc(e.target.value)} rows={2}
                placeholder="Brief summary of the marketing or SEO service deliverables..."
                className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79] resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Key Features (one per line)</label>
              <textarea value={newServFeatures} onChange={e => setNewServFeatures(e.target.value)} rows={4}
                placeholder="Competitor Entity Audits&#10;Structured Schema Implementation&#10;Weekly reports"
                className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79] resize-none font-mono"
              />
            </div>

            <button onClick={addService}
              className="px-5 py-3 rounded-xl bg-[#B76E79]/20 border border-[#B76E79]/30 text-[#B76E79] font-bold flex items-center gap-1.5 text-xs hover:bg-[#B76E79]/30 transition-all self-start"
            >
              <Plus className="w-4 h-4" /> Add Service Package
            </button>

            <div className="flex flex-col gap-3 mt-4 max-h-[400px] overflow-y-auto pr-1">
              {servicesList.map(serv => (
                <div key={serv.id} className="flex items-start justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 text-left">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-1">{serv.icon}</span>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-white">{serv.title} <span className="text-xs text-[#B76E79] ml-2">({serv.price})</span></span>
                      <p className="text-xs text-textSecondary">{serv.description}</p>
                      {serv.features && Array.isArray(serv.features) && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {serv.features.map((f: string, idx: number) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#9A8F95]">{f}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <button onClick={() => deleteService(serv.id)}
                    className="p-2 rounded-lg text-[#E63946] hover:bg-[#E63946]/10 transition-all shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── WORK DATA TAB ──────────────────── */}
        {activeTab === 'workdata' && (
          <div className="flex flex-col gap-6 p-6 rounded-2xl bg-white/[0.01] border border-white/5">
            <h2 className="text-sm font-bold font-headings text-white uppercase tracking-wider border-b border-white/5 pb-3">Work Data Portfolio</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Entry Title</label>
                <input value={newWorkTitle} onChange={e => setNewWorkTitle(e.target.value)} placeholder="e.g. TutorsPlan — 412% Traffic Growth"
                  className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Category</label>
                  <select value={newWorkCat} onChange={e => setNewWorkCat(e.target.value)}
                    className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79]"
                  >
                    <option value="analytics">Google Analytics</option>
                    <option value="search_console">Search Console</option>
                    <option value="meta_ads">Meta Ads</option>
                    <option value="google_ads">Google Ads</option>
                    <option value="ai_projects">AI Projects</option>
                    <option value="videos">Video/Media</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Type</label>
                  <select value={newWorkType} onChange={e => setNewWorkType(e.target.value as any)}
                    className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79]"
                  >
                    <option value="image">Screenshot / Image</option>
                    <option value="link">Website Link</option>
                    <option value="video">Video Placeholder</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Brief Description</label>
              <textarea value={newWorkDesc} onChange={e => setNewWorkDesc(e.target.value)} rows={2}
                placeholder="Explain the metric, ROI, or ad screenshot shown..."
                className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79] resize-none"
              />
            </div>

            {newWorkType === 'image' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Screenshot File</label>
                <input type="file" ref={workFileRef} accept="image/*"
                  className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#B76E79]"
                />
              </div>
            )}

            {newWorkType === 'link' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Project URL Link</label>
                <input value={newWorkLink} onChange={e => setNewWorkLink(e.target.value)} placeholder="https://..."
                  className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79]"
                />
              </div>
            )}

            <button onClick={addWorkItem} disabled={newWorkUploadProgress}
              className="px-5 py-3 rounded-xl bg-[#B76E79]/20 border border-[#B76E79]/30 text-[#B76E79] font-bold flex items-center gap-1.5 text-xs hover:bg-[#B76E79]/30 transition-all self-start disabled:opacity-50"
            >
              {newWorkUploadProgress ? 'Adding...' : '+ Add Work Item'}
            </button>

            <div className="flex flex-col gap-3 mt-4 max-h-[400px] overflow-y-auto pr-1">
              {workItemsList.map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 text-left">
                  <div className="flex items-center gap-4">
                    {item.imageUrl && (
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 bg-black/40">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold text-white">{item.title}</span>
                      <span className="text-[10px] text-[#B76E79] uppercase tracking-wide">{item.category} · {item.type}</span>
                      <p className="text-xs text-textSecondary line-clamp-1">{item.description}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteWorkItem(item.id)}
                    className="p-2 rounded-lg text-[#E63946] hover:bg-[#E63946]/10 transition-all shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CASE STUDIES REDIRECT TAB ──────── */}
        {activeTab === 'projects_redirect' && (
          <div className="flex flex-col gap-5 p-12 rounded-2xl bg-white/[0.01] border border-white/5 text-center items-center">
            <Briefcase className="w-12 h-12 text-[#B76E79] mb-2" />
            <h2 className="text-lg font-bold text-white">Manage Case Studies &amp; Projects</h2>
            <p className="text-sm text-[#9A8F95] max-w-sm mb-6">
              Case studies and portfolio projects are managed through their own dedicated CMS interface for rich detail editing (impact metrics, challenge, solution).
            </p>
            <button onClick={() => router.push('/admin/projects')} className="py-3 px-6 rounded-xl text-white font-bold bg-gradient-to-r from-[#B76E79] to-[#E63946] hover:scale-[1.02] transition-all text-xs">
              Go to Case Studies Manager
            </button>
          </div>
        )}

        {/* ── BLOG REDIRECT TAB ──────── */}
        {activeTab === 'blog_redirect' && (
          <div className="flex flex-col gap-5 p-12 rounded-2xl bg-white/[0.01] border border-white/5 text-center items-center">
            <FileText className="w-12 h-12 text-[#B76E79] mb-2" />
            <h2 className="text-lg font-bold text-white">Manage Blog Posts</h2>
            <p className="text-sm text-[#9A8F95] max-w-sm mb-6">
              Blog posts, tags, and semantic articles are managed through their own dedicated CMS interface for rich text editing and publishing control.
            </p>
            <button onClick={() => router.push('/admin/blog')} className="py-3 px-6 rounded-xl text-white font-bold bg-gradient-to-r from-[#B76E79] to-[#E63946] hover:scale-[1.02] transition-all text-xs">
              Go to Blog Posts CMS
            </button>
          </div>
        )}

        {/* ── CONTACT TAB ────────────────────── */}
        {activeTab === 'contact' && (
          <div className="flex flex-col gap-5 p-6 rounded-2xl bg-white/[0.01] border border-white/5">
            <h2 className="text-sm font-bold font-headings text-white uppercase tracking-wider border-b border-white/5 pb-3">Contact Information</h2>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Email Address</label>
              <input value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Phone / WhatsApp Number</label>
              <input value={phone} onChange={e => setPhone(e.target.value)}
                className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Location</label>
              <input value={location} onChange={e => setLocation(e.target.value)}
                className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Availability</label>
              <input value={availability} onChange={e => setAvailability(e.target.value)}
                className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79]"
                placeholder="Mon–Fri, 9am–6pm (BST)"
              />
            </div>

            <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
              <p className="text-[11px] text-yellow-400/80 font-bold mb-1">💡 Contact Form Services &amp; Budget</p>
              <p className="text-[11px] text-[#9A8F95]">Enter one option per line. These appear in the contact form dropdowns.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Service Options (one per line)</label>
              <textarea
                value={contactServicesText}
                onChange={e => setContactServicesText(e.target.value)}
                rows={8}
                className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79] resize-none font-mono"
                placeholder="Technical SEO Optimization&#10;Full Digital Marketing Strategy&#10;..."
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Budget Options (one per line)</label>
              <textarea
                value={budgetOptionsText}
                onChange={e => setBudgetOptionsText(e.target.value)}
                rows={5}
                className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79] resize-none font-mono"
                placeholder="Under $500&#10;$500 – $1,000&#10;..."
              />
            </div>

            <button onClick={saveContact}
              className="mt-2 py-3 px-6 rounded-xl text-white font-bold bg-gradient-to-r from-[#B76E79] to-[#E63946] flex items-center gap-2 self-start hover:scale-[1.02] transition-all"
            >
              <Save className="w-4 h-4" /> Save Contact Info
            </button>
          </div>
        )}

        {/* ── LOGOS TAB ────────────────────── */}
        {activeTab === 'logos' && (
          <div className="flex flex-col gap-5 p-6 rounded-2xl bg-white/[0.01] border border-white/5">
            <h2 className="text-sm font-bold font-headings text-white uppercase tracking-wider border-b border-white/5 pb-3">Client / Partner Logos</h2>

            <div className="flex gap-3">
              <input
                type="text"
                value={newLogoName}
                onChange={e => setNewLogoName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addLogo()}
                placeholder="Company name..."
                className="flex-grow bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79]"
              />
              <button onClick={addLogo}
                className="px-4 py-3 rounded-xl bg-[#B76E79]/20 border border-[#B76E79]/30 text-[#B76E79] font-bold flex items-center gap-2 text-xs hover:bg-[#B76E79]/30 transition-all"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {logos.map(logo => (
                <div key={logo.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div style={{
                    width: 52, height: 52, borderRadius: 8, overflow: 'hidden',
                    background: 'rgba(255,255,255,0.05)', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}>
                    {logo.url ? (
                      <img src={logo.url} alt={logo.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      <Building2 className="w-5 h-5 text-[#9A8F95]" />
                    )}
                  </div>
                  <span className="flex-grow text-sm text-white font-medium">{logo.name}</span>

                  <label className="cursor-pointer px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold uppercase text-[#9A8F95] hover:text-white flex items-center gap-1.5 transition-all">
                    <Upload className="w-3 h-3" /> Upload
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleLogoFileUpload(e, logo.id)} />
                  </label>

                  <button onClick={() => setLogos(prev => prev.filter(l => l.id !== logo.id))}
                    className="p-2 rounded-lg text-[#E63946] hover:bg-[#E63946]/10 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button onClick={saveLogos}
              className="mt-2 py-3 px-6 rounded-xl text-white font-bold bg-gradient-to-r from-[#B76E79] to-[#E63946] flex items-center gap-2 self-start hover:scale-[1.02] transition-all"
            >
              <Save className="w-4 h-4" /> Save Logos
            </button>
          </div>
        )}

        {/* ── IMAGES TAB ───────────────────── */}
        {activeTab === 'images' && (
          <div className="flex flex-col gap-6 p-6 rounded-2xl bg-white/[0.01] border border-white/5">
            <h2 className="text-sm font-bold font-headings text-white uppercase tracking-wider border-b border-white/5 pb-3">Upload Photos & Brand Assets</h2>

            {/* Profile Photo */}
            <div className="flex flex-col gap-3">
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Profile / Hero Photo</label>
              <div className="flex items-center gap-5">
                <div style={{
                  width: 100, height: 120, borderRadius: 12, overflow: 'hidden',
                  border: '2px solid rgba(201,168,76,0.2)',
                  background: 'rgba(255,255,255,0.03)',
                  flexShrink: 0,
                }}>
                  {profileImageUrl ? (
                    <img src={profileImageUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ImageIcon className="w-8 h-8 text-[#9A8F95]" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-xs text-[#9A8F95] leading-relaxed">Upload a high-quality photo (JPG/PNG, recommended 400×500px). This replaces the profile image across all pages.</p>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#B76E79]/10 border border-[#B76E79]/30 text-xs font-bold text-[#B76E79] hover:bg-[#B76E79]/20 transition-all self-start">
                    <Upload className="w-3.5 h-3.5" /> Upload Profile Photo
                    <input ref={profileFileRef} type="file" accept="image/*" className="hidden" onChange={handleProfileUpload} />
                  </label>
                  {profileImageUrl && (
                    <span className="text-[10px] text-emerald-400">✓ Image saved: {profileImageUrl}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Site Logo */}
            <div className="flex flex-col gap-3">
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Brand / Site Logo</label>
              <div className="flex items-center gap-5">
                <div style={{
                  width: 80, height: 80, borderRadius: 12, overflow: 'hidden',
                  border: '2px solid rgba(201,168,76,0.2)',
                  background: 'rgba(255,255,255,0.03)',
                  flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {logoImageUrl ? (
                    <img src={logoImageUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: '#C9A84C' }}>P</span>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-xs text-[#9A8F95] leading-relaxed">Upload a square logo image (SVG/PNG, recommended 200×200px).</p>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#B76E79]/10 border border-[#B76E79]/30 text-xs font-bold text-[#B76E79] hover:bg-[#B76E79]/20 transition-all self-start">
                    <Upload className="w-3.5 h-3.5" /> Upload Logo
                    <input ref={logoFileInputRef} type="file" accept="image/*,image/svg+xml" className="hidden" onChange={handleLogoImageUpload} />
                  </label>
                </div>
              </div>
            </div>

            {/* General media upload */}
            <div className="flex flex-col gap-3">
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Upload Any Asset (Analytics / Campaign Screenshots)</label>
              <label className="cursor-pointer flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed border-white/10 hover:border-[#B76E79]/40 bg-white/[0.01] transition-all">
                <Upload className="w-8 h-8 text-[#9A8F95]" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-white">Drop image here or click to browse</p>
                  <p className="text-xs text-[#9A8F95] mt-1">PNG, JPG, GIF, WebP — Max 10MB</p>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  toast.loading('Uploading...', { id: 'gen-upload' });
                  const url = await uploadFile(file, `asset-${Date.now()}`);
                  if (url) {
                    toast.success(`Uploaded! URL: ${url}`, { id: 'gen-upload', duration: 6000 });
                  } else {
                    toast.error('Upload failed', { id: 'gen-upload' });
                  }
                }} />
              </label>
            </div>
          </div>
        )}

        {/* ── SEO TAB ──────────────────────── */}
        {activeTab === 'seo' && (
          <div className="flex flex-col gap-5 p-6 rounded-2xl bg-white/[0.01] border border-white/5">
            <h2 className="text-sm font-bold font-headings text-white uppercase tracking-wider border-b border-white/5 pb-3">Page SEO Metadata</h2>

            {seoPages.map((page, idx) => (
              <div key={page.slug} className="flex flex-col gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-[#B76E79]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#B76E79]">/{page.slug === 'home' ? '' : page.slug}</span>
                </div>
                <input
                  value={page.title}
                  onChange={e => setSeoPages(prev => prev.map((p, i) => i === idx ? { ...p, title: e.target.value } : p))}
                  placeholder="Page Title (30-60 chars)"
                  className="w-full bg-[#121218] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#B76E79]"
                />
                <textarea
                  value={page.desc}
                  onChange={e => setSeoPages(prev => prev.map((p, i) => i === idx ? { ...p, desc: e.target.value } : p))}
                  placeholder="Meta Description (120-160 chars)"
                  rows={2}
                  className="w-full bg-[#121218] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#B76E79] resize-none"
                />
                <div className="flex gap-4">
                  <span className={`text-[10px] font-bold ${page.title.length >= 30 && page.title.length <= 60 ? 'text-emerald-400' : 'text-amber-500'}`}>
                    Title: {page.title.length} chars
                  </span>
                  <span className={`text-[10px] font-bold ${page.desc.length >= 120 && page.desc.length <= 160 ? 'text-emerald-400' : 'text-amber-500'}`}>
                    Desc: {page.desc.length} chars
                  </span>
                </div>
              </div>
            ))}

            <button onClick={saveSeo}
              className="mt-2 py-3 px-6 rounded-xl text-white font-bold bg-gradient-to-r from-[#B76E79] to-[#E63946] flex items-center gap-2 self-start hover:scale-[1.02] transition-all"
            >
              <Save className="w-4 h-4" /> Save SEO Metadata
            </button>
          </div>
        )}

        {/* ── KEYS TAB ─────────────────────── */}
        {activeTab === 'keys' && (
          <div className="flex flex-col gap-5">
            <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Key className="w-4 h-4 text-[#F4C27F]" />
                <h3 className="text-sm font-bold font-headings text-[#F4C27F] uppercase tracking-wider">AI Integrations</h3>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">OpenRouter API Key</label>
                <input type="password" value={openRouterKey} onChange={e => setOpenRouterKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79]"
                />
                <span className="text-[10px] text-[#9A8F95] italic mt-1">
                  Powers AI blog writer & SEO meta generator. Leave empty for smart local fallback mode.
                </span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <MessageSquare className="w-4 h-4 text-[#B76E79]" />
                <h3 className="text-sm font-bold font-headings text-[#B76E79] uppercase tracking-wider">Contact Redirects</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">WhatsApp Number</label>
                  <input type="text" value={whatsappUrl} onChange={e => setWhatsappUrl(e.target.value)}
                    className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">LinkedIn Profile URL</label>
                  <input type="text" value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)}
                    className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79]"
                  />
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#E63946]/5 border border-[#E63946]/20 flex items-start gap-4">
              <ShieldAlert className="w-5 h-5 text-[#E63946] shrink-0 mt-0.5" />
              <p className="text-xs text-[#9A8F95] leading-relaxed">
                API keys are stored in browser localStorage. They are never sent to any third-party server directly. The OpenRouter key is used only when you trigger AI generation from the Admin panel.
              </p>
            </div>

            <button onClick={saveKeys}
              className="py-3 px-6 rounded-xl text-white font-bold bg-gradient-to-r from-[#B76E79] to-[#E63946] flex items-center gap-2 self-start hover:scale-[1.02] transition-all"
            >
              <Save className="w-4 h-4" /> Save API Settings
            </button>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
