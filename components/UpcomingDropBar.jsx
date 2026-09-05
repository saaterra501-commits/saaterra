'use client';

import { useState } from 'react';
import { Zap, Bell, ArrowRight, X, Check, Clock, Flame, ChevronRight, Database, MessageSquare, Search, Video, Mail, Layers } from 'lucide-react';

const UPCOMING_CATEGORIES = [
  { id: 'whatsapp-bots', name: 'WhatsApp Bots', count: '6 Software', eta: '5-10d', icon: MessageSquare },
  { id: 'ai-geo-seo', name: 'AI & GEO SEO', count: '7 Software', eta: '7-14d', icon: Search },
  { id: 'lead-scrapers', name: 'B2B Scrapers', count: '5 Software', eta: '10-18d', icon: Database },
  { id: 'crm-cold-email', name: 'Sales & CRM', count: '4 Software', eta: '14-21d', icon: Mail },
  { id: 'video-productivity', name: 'Video AI', count: '3 Software', eta: '18-25d', icon: Video },
];

export default function UpcomingDropBar() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [dismissed, setDismissed] = useState(false);
  const [activeCat, setActiveCat] = useState(0);

  if (dismissed) return null;

  const scrollToUpcoming = () => {
    const el = document.getElementById('upcoming-deals');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Valid email required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/upcoming-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'topbar_pipeline' }),
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data?.success) setSubmitted(true);
      else setError(data?.message || 'Try again');
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full bg-gradient-to-r from-[#0A0F1E] via-[#0F172A] to-[#0A0F1E] border-b border-white/10 overflow-hidden text-xs">

      {/* Animated subtle shimmer accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#2475FF] via-[#FF6B35] to-amber-400" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {submitted ? (
          /* ── Success State (slim) ── */
          <div className="flex items-center justify-between py-2.5 gap-3">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-emerald-400" />
              </div>
              <span className="text-xs font-bold text-white">
                🎉 You're on the VIP list! 25+ software launch alerts will be sent to{' '}
                <span className="text-amber-300 font-mono">{email}</span>.
              </span>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 text-slate-500 hover:text-white transition-colors shrink-0 cursor-pointer"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* ── Main Bar ── */
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-4 py-2">

            {/* Left: Upcoming 25+ Software Categories Ticker */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-x-auto scrollbar-hide py-0.5">
              {/* Pulsing Next Drop badge */}
              <button
                onClick={scrollToUpcoming}
                className="flex items-center gap-1.5 bg-[#FF6B35]/20 hover:bg-[#FF6B35]/30 border border-[#FF6B35]/40 text-[#FF6B35] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider whitespace-nowrap cursor-pointer transition-all shrink-0"
              >
                <Flame className="w-3 h-3 fill-[#FF6B35] animate-pulse" />
                <span>25+ Software Dropping</span>
              </button>

              {/* Category pills with vector icons */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
                {UPCOMING_CATEGORIES.map((cat, i) => {
                  const Icon = cat.icon;
                  const isSelected = activeCat === i;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setActiveCat(i);
                        scrollToUpcoming();
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all border cursor-pointer shrink-0 ${
                        isSelected
                          ? 'bg-white/15 border-white/30 text-white shadow-xs'
                          : 'bg-transparent border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      <Icon className="w-3 h-3 text-[#FF6B35]" />
                      <span className="font-medium">{cat.name}</span>
                      <span className="text-[10px] text-amber-300 font-bold bg-white/10 px-1.5 py-0.2 rounded-full">
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Jump to section arrow */}
              <button
                onClick={scrollToUpcoming}
                className="hidden xl:flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-amber-400 transition-colors shrink-0 cursor-pointer ml-1"
              >
                <span>View Roadmap</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Right: Quick Email Bar */}
            <div className="flex items-center gap-2 shrink-0">
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-1.5"
              >
                <div className="relative flex items-center">
                  <Bell className="absolute left-2.5 w-3 h-3 text-slate-500 pointer-events-none" />
                  <input
                    id="topbar-alert-email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="Work email for VIP alerts"
                    className={`bg-white/10 border ${error ? 'border-red-500' : 'border-white/15'} hover:border-white/25 focus:border-amber-400 rounded-xl pl-8 pr-2.5 py-1.5 text-[11px] font-medium text-white placeholder-slate-400 outline-none transition-all w-44 sm:w-48`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  id="topbar-alert-submit"
                  className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-[#FF6B35] to-amber-500 hover:from-[#E85A24] hover:to-amber-400 text-white font-black text-[11px] rounded-xl shadow-sm transition-all whitespace-nowrap disabled:opacity-60 cursor-pointer shrink-0"
                >
                  {loading ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Zap className="w-3 h-3" />
                      <span>VIP Access</span>
                      <ArrowRight className="w-3 h-3 ml-0.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Dismiss button */}
              <button
                onClick={() => setDismissed(true)}
                className="p-1 text-slate-500 hover:text-white transition-colors cursor-pointer shrink-0"
                aria-label="Dismiss upcoming drops bar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
