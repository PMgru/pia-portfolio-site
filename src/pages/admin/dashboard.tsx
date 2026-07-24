'use client';
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { 
  Users, 
  Activity, 
  Clock, 
  TrendingDown, 
  RefreshCw, 
  Globe, 
  Monitor, 
  Smartphone,
  Eye,
  ChevronRight,
  TrendingUp,
  Wifi
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { hasAuthCookie } from '@/lib/auth-client';

interface SessionDetail {
  session_id: string;
  ip: string;
  location: string;
  device: string;
  browser: string;
  os: string;
  current_page: string;
  is_live: boolean;
  last_active: string;
  time_spent: string;
  history: { path: string; duration: string; timestamp: string }[];
}

interface Stats {
  total_views: number;
  unique_visitors: number;
  live_visitors: number;
  bounce_rate: string;
  average_duration: string;
  top_pages: { path: string; count: number }[];
  countries: { name: string; count: number }[];
  os: { name: string; count: number }[];
  devices: { name: string; count: number }[];
  traffic_chart: { day: string; views: number }[];
  live_sessions: SessionDetail[];
}

function timeAgo(timestamp: string): string {
  if (!timestamp) return 'unknown';
  const diff = Date.now() - new Date(timestamp).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 10) return 'just now';
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  return `${hours}h ago`;
}

function pageName(path: string): string {
  if (path === '/') return 'Home';
  return path.replace(/^\//, '').split('/').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' › ');
}

export default function AnalyticsDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/analytics?action=stats');
      if (res.status === 401) { router.push('/admin'); return; }
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasAuthCookie()) { router.push('/admin'); return; }
    fetchStats();
    pollRef.current = setInterval(fetchStats, 10000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] text-white flex items-center justify-center font-body">
        <div className="w-8 h-8 rounded-full border-2 border-[#B76E79] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  const maxTrafficVal = Math.max(...stats.traffic_chart.map(t => t.views), 1);

  const liveSessions = (stats.live_sessions || []).filter(s => s.is_live);
  const recentSessions = (stats.live_sessions || []).slice(0, 20);

  return (
    <AdminLayout>
      <Head>
        <title>Live Analytics Dashboard | PM Admin Suite</title>
      </Head>

      <div className="flex flex-col gap-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#B76E79]/15 pb-6">
          <div className="flex flex-col gap-1 text-left">
            <h1 className="text-2xl md:text-3xl font-bold font-headings text-white">Visitor Analytics</h1>
            <p className="text-xs text-textSecondary">100% real data — refreshes every 10 seconds automatically.</p>
          </div>
          <button
            onClick={() => { setLoading(true); fetchStats(); }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-white/5 border border-white/10 hover:border-[#B76E79] text-textSecondary hover:text-white transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Now
          </button>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">

          {/* Active Visitors */}
          <div className="p-6 rounded-2xl bg-white/[0.01] border border-emerald-500/20 flex flex-col gap-2">
            <div className="flex items-center justify-between text-textSecondary uppercase tracking-widest text-[10px] font-bold">
              <span>Live Now</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block"></span>
                <Activity className="w-4 h-4 text-emerald-400" />
              </span>
            </div>
            <span className="text-4xl font-bold font-headings text-emerald-400">{stats.live_visitors}</span>
            <span className="text-[10px] text-emerald-400 font-semibold">
              {stats.live_visitors === 0 ? 'No visitors right now' : `${stats.live_visitors} active session${stats.live_visitors > 1 ? 's' : ''}`}
            </span>
          </div>

          {/* Total Pageviews */}
          <div className="p-6 rounded-2xl bg-white/[0.01] border border-[#B76E79]/15 flex flex-col gap-2">
            <div className="flex items-center justify-between text-textSecondary uppercase tracking-widest text-[10px] font-bold">
              <span>Total Pageviews</span>
              <Eye className="w-4 h-4 text-[#B76E79]" />
            </div>
            <span className="text-4xl font-bold font-headings text-white">{stats.total_views}</span>
            <span className="text-[10px] text-textSecondary">{stats.unique_visitors} unique sessions</span>
          </div>

          {/* Bounce Rate */}
          <div className="p-6 rounded-2xl bg-white/[0.01] border border-[#B76E79]/15 flex flex-col gap-2">
            <div className="flex items-center justify-between text-textSecondary uppercase tracking-widest text-[10px] font-bold">
              <span>Bounce Rate</span>
              <TrendingDown className="w-4 h-4 text-[#F4C27F]" />
            </div>
            <span className="text-4xl font-bold font-headings text-white">{stats.bounce_rate}</span>
            <span className="text-[10px] text-textSecondary">Single-page sessions</span>
          </div>

          {/* Average Duration */}
          <div className="p-6 rounded-2xl bg-white/[0.01] border border-[#B76E79]/15 flex flex-col gap-2">
            <div className="flex items-center justify-between text-textSecondary uppercase tracking-widest text-[10px] font-bold">
              <span>Avg. Session Time</span>
              <Clock className="w-4 h-4 text-[#F4C27F]" />
            </div>
            <span className="text-4xl font-bold font-headings text-white">{stats.average_duration}</span>
            <span className="text-[10px] text-textSecondary">Average time per visitor</span>
          </div>

        </div>

        {/* CHART + LIVE PAGE TRACKER */}
        <div className="grid lg:grid-cols-12 gap-6 items-stretch">

          {/* Traffic Chart */}
          <div className="lg:col-span-8 p-6 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider font-headings text-white">Daily Traffic Trend</h3>
              <span className="text-[10px] text-textSecondary uppercase tracking-widest">Last 7 Days</span>
            </div>
            {stats.total_views === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center h-48 text-center gap-2">
                <TrendingUp className="w-10 h-10 text-white/10" />
                <p className="text-sm text-textSecondary">No traffic data yet.</p>
                <p className="text-[10px] text-white/20">Visit a page on the site to start recording data.</p>
              </div>
            ) : (
              <div className="flex-grow flex items-end justify-between h-48 pt-4 border-b border-white/10 pb-2">
                {stats.traffic_chart.map((t, idx) => {
                  const heightPct = Math.max(6, (t.views / maxTrafficVal) * 100);
                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 flex-grow">
                      <div className="w-full flex justify-center relative group">
                        <div
                          style={{ height: `${heightPct * 1.6}px` }}
                          className="w-10 rounded-t-lg bg-gradient-to-t from-[#B76E79]/10 to-[#B76E79]/70 border border-[#B76E79]/30 hover:to-[#E63946] hover:border-[#E63946] transition-all relative flex justify-center"
                        >
                          <span className="absolute -top-7 px-2 py-0.5 rounded bg-[#121218] border border-[#B76E79]/40 text-[10px] text-[#F4C27F] font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {t.views} view{t.views !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-[#9A8F95] font-semibold">{t.day}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Top Pages */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-[#121218] border border-[#B76E79]/20 flex flex-col gap-4 text-left">
            <h3 className="text-sm font-bold uppercase tracking-wider font-headings text-white flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#B76E79]" /> Top Pages
            </h3>
            {stats.top_pages.length === 0 ? (
              <div className="flex-grow flex items-center justify-center">
                <p className="text-xs text-textSecondary text-center">No page view data yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {stats.top_pages.slice(0, 6).map((p, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-white truncate max-w-[140px]">{pageName(p.path)}</span>
                      <span className="text-[#9A8F95] ml-2 shrink-0">{p.count}</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#B76E79] to-[#E63946] rounded-full" style={{ width: `${(p.count / stats.total_views) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── LIVE SESSION TRACKER ─────────────────────────────────── */}
        <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider font-headings text-white flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${liveSessions.length > 0 ? 'bg-emerald-500 animate-ping' : 'bg-white/20'}`}></span>
              Live Visitor Activity
              {liveSessions.length > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                  {liveSessions.length} LIVE
                </span>
              )}
            </h3>
            <span className="text-[10px] text-textSecondary">Showing last 20 sessions</span>
          </div>

          {recentSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <Wifi className="w-10 h-10 text-white/10" />
              <p className="text-sm text-textSecondary">No visitor sessions recorded yet.</p>
              <p className="text-[11px] text-white/20">Visitors will appear here the moment they open your site.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {/* Header row */}
              <div className="hidden md:grid grid-cols-12 gap-2 px-3 pb-2 border-b border-white/5 text-[10px] text-textSecondary uppercase tracking-wider font-bold">
                <div className="col-span-1">Status</div>
                <div className="col-span-2">Location</div>
                <div className="col-span-3">Current / Last Page</div>
                <div className="col-span-2">Device / OS</div>
                <div className="col-span-2">Time Spent</div>
                <div className="col-span-1">Last Active</div>
                <div className="col-span-1">Pages</div>
              </div>

              {recentSessions.map((session) => (
                <div key={session.session_id} className="flex flex-col">
                  <div
                    className={`grid grid-cols-12 gap-2 items-center px-3 py-3 rounded-xl cursor-pointer transition-all border ${
                      session.is_live
                        ? 'bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10'
                        : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.03]'
                    }`}
                    onClick={() => setExpandedSession(expandedSession === session.session_id ? null : session.session_id)}
                  >
                    {/* Status dot */}
                    <div className="col-span-1 flex items-center">
                      <span className={`w-2.5 h-2.5 rounded-full ${session.is_live ? 'bg-emerald-500 animate-pulse' : 'bg-white/20'}`}></span>
                    </div>

                    {/* Location */}
                    <div className="col-span-2 text-xs text-white font-semibold truncate">
                      {session.location}
                    </div>

                    {/* Current Page */}
                    <div className="col-span-3 text-xs text-[#B76E79] font-mono truncate">
                      {session.current_page}
                    </div>

                    {/* Device / OS */}
                    <div className="col-span-2 text-[10px] text-textSecondary truncate">
                      {session.device} · {session.os}
                    </div>

                    {/* Time Spent */}
                    <div className="col-span-2 text-xs text-[#F4C27F] font-bold font-mono">
                      {session.time_spent}
                    </div>

                    {/* Last Active */}
                    <div className="col-span-1 text-[10px] text-textSecondary whitespace-nowrap">
                      {timeAgo(session.last_active)}
                    </div>

                    {/* Pages visited count */}
                    <div className="col-span-1 flex items-center justify-end gap-1 text-[10px] text-textSecondary">
                      <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                        {session.history.length}p
                      </span>
                      <ChevronRight className={`w-3 h-3 transition-transform ${expandedSession === session.session_id ? 'rotate-90' : ''}`} />
                    </div>
                  </div>

                  {/* Expanded page history */}
                  {expandedSession === session.session_id && session.history.length > 0 && (
                    <div className="ml-4 mt-1 mb-2 flex flex-col gap-1 border-l-2 border-[#B76E79]/20 pl-4">
                      {session.history.map((h, hIdx) => (
                        <div key={hIdx} className="flex items-center gap-3 py-1.5 px-3 rounded-lg bg-white/[0.02] text-[11px]">
                          <span className="text-white/30 font-mono w-4 shrink-0">{hIdx + 1}.</span>
                          <span className="text-[#B76E79] font-mono flex-1 truncate">{h.path}</span>
                          <span className="text-[#F4C27F] font-bold shrink-0">{h.duration}</span>
                          <span className="text-textSecondary text-[10px] shrink-0">
                            {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DEMOGRAPHICS ROW */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* Countries */}
          <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col gap-4 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider font-headings text-white flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#B76E79]" /> Countries
            </h4>
            {stats.countries.length === 0 ? (
              <p className="text-xs text-textSecondary">No data yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {stats.countries.slice(0, 5).map((c, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-white">{c.name}</span>
                      <span className="text-[#9A8F95]">{c.count} views</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#B76E79] rounded-full" style={{ width: `${(c.count / stats.total_views) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* OS */}
          <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col gap-4 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider font-headings text-white flex items-center gap-1.5">
              <Monitor className="w-4 h-4 text-[#F4C27F]" /> Operating Systems
            </h4>
            {stats.os.length === 0 ? (
              <p className="text-xs text-textSecondary">No data yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {stats.os.slice(0, 5).map((os, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-white">{os.name}</span>
                      <span className="text-[#9A8F95]">{os.count} views</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#F4C27F] rounded-full" style={{ width: `${(os.count / stats.total_views) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Devices */}
          <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col gap-4 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider font-headings text-white flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-emerald-400" /> Devices
            </h4>
            {stats.devices.length === 0 ? (
              <p className="text-xs text-textSecondary">No data yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {stats.devices.slice(0, 5).map((d, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-white">{d.name}</span>
                      <span className="text-[#9A8F95]">{d.count} views</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${(d.count / stats.total_views) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </AdminLayout>
  );
}
