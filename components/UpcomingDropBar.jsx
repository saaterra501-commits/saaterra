'use client';

import { useState } from 'react';
import { Zap, Bell, ArrowRight, X, Check, Clock, Lock, Flame } from 'lucide-react';

const UPCOMING_DEALS = [
  { name: 'AI Cold Email Automator', eta: '5 days', category: 'Lead Scrapers', icon: '✉️', interested: 412 },
  { name: 'WhatsApp CRM for Agencies', eta: '10 days', category: 'WhatsApp Bots', icon: '💬', interested: 289 },
  { name: 'AI Video Script Generator', eta: '14 days', category: 'Productivity', icon: '🎬', interested: 198 },
];

export default function UpcomingDropBar() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [dismissed, setDismissed] = useState(false);
  const [activeDeal, setActiveDeal] = useState(0);

  if (dismissed) return null;

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
        body: JSON.stringify({ email, source: 'topbar' }),
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
    <div className="relative w-full bg-gradient-to-r from-[#0A0F1E] via-[#0F172A] to-[#0A0F1E] border-b border-white/10 overflow-hidden">

      {/* Animated background shimmer */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,107,53,0.04)_50%,transparent_100%)] animate-pulse pointer-events-none" />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF6B35] to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {submitted ? (
          /* ── Success State (slim) ── */
          <div className="flex items-center justify-between py-2.5 gap-3">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-emerald-400" />
              </div>
              <span className="text-xs font-bold text-white">
                🎉 You're on the VIP list! First-access alert will be sent to{' '}
                <span className="text-amber-300">{email}</span> when the next deal drops.
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-0 sm:gap-4 py-0">

            {/* Left: Upcoming deals rotating pills */}
            <div className="flex items-center gap-3 py-2.5 sm:py-2 min-w-0 flex-1">
              {/* Fire badge */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="flex items-center gap-1 bg-[#FF6B35]/20 border border-[#FF6B35]/30 text-[#FF6B35] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                  <Flame className="w-3 h-3 fill-[#FF6B35]" />
                  Next Drop
                </span>
              </div>

              {/* Deal pills — scrollable on mobile */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                {UPCOMING_DEALS.map((deal, i) => (
                  <button
                    key={deal.name}
                    onClick={() => setActiveDeal(i)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all border cursor-pointer shrink-0 ${
                      activeDeal === i
                        ? 'bg-white/10 border-white/20 text-white'
                        : 'bg-transparent border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <span>{deal.icon}</span>
                    <span className="hidden sm:inline">{deal.name}</span>
                    <span className="sm:hidden">{deal.name.split(' ').slice(0, 2).join(' ')}</span>
                    <span className="flex items-center gap-0.5 text-amber-400">
                      <Clock className="w-2.5 h-2.5" />
                      {deal.eta}
                    </span>
                    <span className="flex items-center gap-0.5 text-slate-500">
                      <Lock className="w-2.5 h-2.5" />
                    </span>
                  </button>
                ))}
              </div>

              {/* Interest count */}
              <span className="hidden lg:flex items-center gap-1 text-[10px] text-slate-500 shrink-0 font-medium">
                <Bell className="w-3 h-3 text-amber-400" />
                <span className="text-amber-300 font-black">{UPCOMING_DEALS[activeDeal].interested}</span> interested
              </span>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-8 bg-white/10 shrink-0" />

            {/* Right: Email form */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 py-2 sm:py-1.5 shrink-0"
            >
              <div className="relative flex items-center">
                <Bell className="absolute left-3 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                <input
                  id="topbar-alert-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="Enter email for first access"
                  className={`bg-white/8 border ${error ? 'border-red-500/50' : 'border-white/15'} hover:border-white/25 focus:border-[#FF6B35] rounded-xl pl-9 pr-3 py-2 text-[11px] font-medium text-white placeholder-slate-500 outline-none transition-all w-52 sm:w-44 md:w-52`}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                id="topbar-alert-submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#FF6B35] to-amber-500 hover:from-[#E85A24] hover:to-amber-400 text-white font-black text-[11px] rounded-xl shadow-md shadow-orange-500/20 transition-all whitespace-nowrap disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed shrink-0"
              >
                {loading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Zap className="w-3 h-3" />
                    <span className="hidden sm:inline">Get First Access</span>
                    <span className="sm:hidden">Alert Me</span>
                    <ArrowRight className="w-3 h-3" />
                  </>
                )}
              </button>

              {error && (
                <span className="text-[10px] text-red-400 font-bold whitespace-nowrap">{error}</span>
              )}
            </form>

            {/* Dismiss button */}
            <button
              onClick={() => setDismissed(true)}
              className="hidden sm:flex items-center p-1.5 text-slate-600 hover:text-slate-400 transition-colors cursor-pointer shrink-0"
              aria-label="Dismiss upcoming drops bar"
            >
              <X className="w-3.5 h-3.5" />
            </button>

          </div>
        )}
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </div>
  );
}
