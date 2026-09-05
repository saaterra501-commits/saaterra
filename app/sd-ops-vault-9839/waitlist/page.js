'use client';

import { useState, useEffect } from 'react';
import {
  Users, Download, Bell, Search, Trash2, RefreshCw,
  Mail, MessageSquare, TrendingUp, Filter, CheckCircle2,
} from 'lucide-react';

export default function WaitlistAdminPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [total, setTotal] = useState(0);
  const [whatsappCount, setWhatsappCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('All');

  const CATEGORIES = ['All', 'WhatsApp Bots', 'AI & SEO', 'Lead Scrapers', 'CRM & Sales', 'Productivity'];

  async function loadSubscribers(p = 1) {
    setLoading(true);
    try {
      const res = await fetch(`/api/upcoming-alerts?page=${p}&limit=50`);
      if (!res.ok) return;
      const data = await res.json();
      if (data?.success) {
        setSubscribers(data.subscribers || []);
        setTotal(data.total || 0);
        setWhatsappCount(data.whatsappCount || 0);
        setPages(data.pages || 1);
        setPage(p);
      }
    } catch (e) {
      console.warn('Failed to load subscribers:', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSubscribers(1);
  }, []);

  const filtered = subscribers.filter((s) => {
    const matchesSearch =
      !search ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.whatsapp || '').includes(search);
    const matchesCat = categoryFilter === 'All' || s.preferredCategory === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'WhatsApp', 'Category', 'Source', 'Joined On'];
    const rows = filtered.map((s) => [
      s.name || '',
      s.email,
      s.whatsapp ? `+91${s.whatsapp}` : '',
      s.preferredCategory || 'All',
      s.source || 'homepage',
      new Date(s.createdAt).toLocaleDateString('en-IN'),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stackdeal-vip-waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-black text-white">VIP Buyer Waitlist</h1>
            <span className="bg-amber-400/20 text-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-400/30 uppercase">
              Rolling Waitlist
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Users who signed up to get first access when new deals drop. Use this list to pitch vendors and send launch notifications.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadSubscribers(page)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total VIP Members', value: total, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
          { label: 'WhatsApp Ready', value: whatsappCount, icon: MessageSquare, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Email Only', value: total - whatsappCount, icon: Mail, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
          { label: 'Vendor Pitch Power', value: total >= 1000 ? '🔥 High' : total >= 500 ? '⚡ Medium' : total >= 100 ? '📈 Growing' : '🌱 Early', icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} border rounded-2xl p-4 space-y-1`}>
            <div className="flex items-center gap-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-[11px] text-slate-400 font-bold">{stat.label}</span>
            </div>
            <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Vendor Pitch Generator Box */}
      <div className="bg-gradient-to-r from-[#0E1528] to-[#111827] border border-white/10 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-black text-white">Your Vendor Pitch Statement (Copy & Use in Cold Emails)</h3>
        </div>
        <div className="bg-black/30 border border-white/10 rounded-xl p-4 text-xs text-slate-300 font-medium leading-relaxed font-mono">
          "Namaste [Founder Name], StackDeal is India's #1 B2B SaaS 5-Year deal marketplace built specifically for Indian agencies and freelancers. We currently have{' '}
          <span className="text-amber-300 font-black">{total.toLocaleString()} active VIP buyers</span> on our waitlist — all Indian digital agencies, solopreneurs, and SaaS buyers who have opted in to receive first-alert notifications when new deals launch.{' '}
          <span className="text-emerald-300 font-black">{whatsappCount} of them have given us their WhatsApp number for instant alerts.</span> If you list your tool with us, we will send a personalised launch notification to our entire VIP list on launch day — giving you immediate exposure to{' '}
          <span className="text-amber-300 font-black">{total.toLocaleString()}+ ready-to-buy Indian founders</span> from Day 1. Would you like to explore this opportunity?"
        </div>
        <p className="text-[10px] text-slate-500 mt-2 font-medium">
          💡 This number updates automatically as more users join the waitlist. Use it in your cold emails to SaaS founders.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, email or WhatsApp..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-white placeholder-slate-500 outline-none focus:border-[#2475FF] transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-300 outline-none cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} style={{ background: '#111827' }}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Subscriber Table */}
      <div className="bg-[#0E1528] border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <span className="text-xs font-black text-white">
            Showing {filtered.length} of {total} subscribers
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            Page {page} / {pages}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-bold">No subscribers yet.</p>
            <p className="text-xs mt-1">When users join the VIP list on the homepage, they'll appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/3">
                  {['#', 'Name', 'Email', 'WhatsApp', 'Category', 'Source', 'Joined'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, idx) => (
                  <tr
                    key={s._id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3 text-slate-500 font-mono">{(page - 1) * 50 + idx + 1}</td>
                    <td className="px-4 py-3 text-white font-bold truncate max-w-[120px]">
                      {s.name || <span className="text-slate-600 italic">Anonymous</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-300 font-medium">{s.email}</td>
                    <td className="px-4 py-3">
                      {s.whatsapp ? (
                        <a
                          href={`https://wa.me/91${s.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 font-bold hover:underline"
                        >
                          +91 {s.whatsapp}
                        </a>
                      ) : (
                        <span className="text-slate-600 text-[10px]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap">
                        {s.preferredCategory || 'All'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 capitalize">{s.source || 'homepage'}</td>
                    <td className="px-4 py-3 text-slate-500 font-mono whitespace-nowrap">
                      {new Date(s.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="p-4 border-t border-white/10 flex items-center justify-center gap-2">
            <button
              onClick={() => loadSubscribers(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 bg-white/5 border border-white/10 text-slate-300 text-xs font-bold rounded-xl disabled:opacity-30 hover:bg-white/10 transition-all cursor-pointer"
            >
              ← Prev
            </button>
            <span className="text-xs text-slate-400 font-mono">
              {page} / {pages}
            </span>
            <button
              onClick={() => loadSubscribers(page + 1)}
              disabled={page >= pages}
              className="px-3 py-1.5 bg-white/5 border border-white/10 text-slate-300 text-xs font-bold rounded-xl disabled:opacity-30 hover:bg-white/10 transition-all cursor-pointer"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
