'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { 
  MessageSquare, 
  Plus, 
  Trash2, 
  Edit3, 
  Sparkles,
  HelpCircle,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import AdminLayout from '@/components/AdminLayout';

interface KnowledgeItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  ai_trained?: boolean;
}

export default function ChatbotTraining() {
  const router = useRouter();
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [category, setCategory] = useState('services');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadKnowledge = async () => {
    try {
      const res = await fetch('/api/chatbot');
      if (res.status === 401) {
        router.push('/admin');
        return;
      }
      const data = await res.json();
      setKnowledge(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKnowledge();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    try {
      if (editingId) {
        // Update
        const res = await fetch(`/api/chatbot?id=${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category, question, answer })
        });
        if (res.ok) {
          toast.success('Knowledge item updated', { style: { background: '#121218', color: '#F4F4F9' } });
          setEditingId(null);
        }
      } else {
        // Insert
        const res = await fetch('/api/chatbot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category, question, answer })
        });
        if (res.ok) {
          toast.success('Knowledge item trained successfully!', { style: { background: '#121218', color: '#F4F4F9' } });
        }
      }
      
      setQuestion('');
      setAnswer('');
      loadKnowledge();
    } catch (e) {
      toast.error('Save failed');
    }
  };

  const handleEdit = (item: KnowledgeItem) => {
    setEditingId(item.id);
    setCategory(item.category);
    setQuestion(item.question);
    setAnswer(item.answer);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this chatbot response?')) return;
    try {
      const res = await fetch(`/api/chatbot?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        toast.success('Knowledge item deleted', { style: { background: '#121218', color: '#F4F4F9' } });
        loadKnowledge();
      }
    } catch (e) {
      toast.error('Delete failed');
    }
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
        <title>Train Concierge Chatbot | PM Admin Suite</title>
      </Head>
      <Toaster position="top-right" />

      <div className="flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#B76E79]/15 pb-6">
          <div className="flex flex-col gap-1 text-left">
            <h1 className="text-2xl md:text-3xl font-bold font-headings text-white">Concierge Training Desk</h1>
            <p className="text-xs text-textSecondary">Manage QA dataset matches queried by public portfolio visitors.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Training Form Card (5 columns) */}
          <form 
            onSubmit={handleSave}
            className="lg:col-span-5 p-6 rounded-2xl bg-white/[0.01] border border-[#B76E79]/15 backdrop-blur-md flex flex-col gap-5 text-left"
          >
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Sparkles className="w-4 h-4 text-[#F4C27F]" />
              <h3 className="text-sm font-bold font-headings text-[#F4C27F] uppercase tracking-wider">
                {editingId ? 'Modify Response' : 'Train New Intent'}
              </h3>
            </div>

            {/* Category selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Knowledge Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79]"
              >
                <option value="about">Background & Biography</option>
                <option value="services">Services Details</option>
                <option value="rates">Rates & Consulting budgets</option>
                <option value="contact">Contact & Schedules</option>
              </select>
            </div>

            {/* Question */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Visitor Inquiry / Intent Phrase</label>
              <input 
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. Do you offer Meta Ads audits?"
                className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79]"
                required
              />
            </div>

            {/* Answer */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A8F95]">Trained Bot Response</label>
              <textarea 
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Insert clean context-rich response..."
                rows={4}
                className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B76E79] resize-none"
                required
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-2">
              {editingId && (
                <button
                  type="button"
                  onClick={() => { setEditingId(null); setQuestion(''); setAnswer(''); }}
                  className="flex-grow py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-textSecondary bg-white/5 border border-white/10"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="flex-grow py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#B76E79] to-[#E63946]"
              >
                {editingId ? 'Apply Update' : 'Inject Knowledge 🚀'}
              </button>
            </div>

          </form>

          {/* Dataset Table List (7 columns) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider font-headings text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#B76E79]" /> Active Training Matrix
              </h3>
              <span className="text-[10px] font-bold text-textSecondary uppercase tracking-widest">{knowledge.length} items trained</span>
            </div>

            {/* Data items */}
            <div className="flex flex-col gap-4 max-h-[480px] overflow-y-auto scrollbar-none pr-1">
              {knowledge.map((item) => (
                <div 
                  key={item.id} 
                  className="p-4 rounded-xl bg-white/[0.01] border border-white/5 flex flex-col gap-2 relative overflow-hidden group text-left"
                >
                  {/* Category marker */}
                  <span className="text-[9px] uppercase font-bold text-[#F4C27F] px-2 py-0.5 rounded-md bg-[#F4C27F]/10 border border-[#F4C27F]/20 self-start">
                    {item.category}
                  </span>

                  <span className="text-sm font-bold font-headings text-white mt-1">Q: {item.question}</span>
                  <p className="text-xs text-textSecondary leading-relaxed bg-[#121218]/45 p-2.5 rounded-lg border border-white/5">
                    A: {item.answer}
                  </p>

                  {/* Actions hover area */}
                  <div className="flex justify-end gap-2 mt-2 opacity-65 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-[#F4C27F] transition-colors"
                      aria-label="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-[#E63946] transition-colors"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </AdminLayout>
  );
}
