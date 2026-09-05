'use client';

import { useState } from 'react';
import { Flame, ArrowDown, Sparkles, Bell, ArrowRight, Zap, Check, Users, MessageCircle, AlertCircle } from 'lucide-react';

const WHATSAPP_COMMUNITY_URL = 'https://chat.whatsapp.com/GmWT9MGU8LX2PFGEtl1Z7f';

export default function UpcomingTeaserBanner() {
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const scrollToUpcoming = () => {
    const el = document.getElementById('upcoming-deals');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      el.classList.add('ring-4', 'ring-[#FF6B35]/40', 'transition-all', 'duration-500');
      setTimeout(() => {
        el.classList.remove('ring-4', 'ring-[#FF6B35]/40');
      }, 2000);
    }
  };

  const handleQuickSubscribe = async (e) => {
    e.preventDefault();
    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setIsError(true);
      setStatusMessage('Please enter a valid work email address.');
      return;
    }

    setLoading(true);
    setStatusMessage('');
    setIsError(false);

    try {
      const res = await fetch('/api/upcoming-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          whatsapp: whatsapp.replace(/\D/g, ''),
          source: 'hero_teaser_banner',
          preferredCategory: 'All'
        })
      });
      const data = await res.json();

      if (data?.success) {
        setSubscribed(true);
        setStatusMessage('You have been added to the VIP list! First-access drop alerts will be sent to you.');
        try {
          localStorage.setItem('stackdeal_vip_registered_email', cleanEmail);
        } catch {}
      } else {
        setIsError(true);
        setStatusMessage(data?.message || 'This email is already registered on the VIP list.');
      }
    } catch {
      setIsError(true);
      setStatusMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden group">
      
      {/* Subtle background glow effect */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-[#2475FF]/20 via-[#FF6B35]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#FF6B35]/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left: Attention-Grabbing Hook & Categories */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-[#FF6B35] text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              <Flame className="w-3 h-3 fill-white animate-pulse" />
              Pipeline Alert
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3 text-amber-300" />
              25+ Software Dropping in Next 30 Days
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
              <Sparkles className="w-3 h-3 text-amber-400" />
              100% Free VIP Access
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-snug">
            Upcoming 5-Year Passes: WhatsApp Bots, AI SEO, B2B Scrapers & CRMs
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Join the VIP Network to receive private early-bird links{' '}
            <span className="text-amber-300 font-bold">24 hours before public release</span> with exclusive launch coupons. Join below or tap into our WhatsApp community!
          </p>

          {/* Category Preview Chips & Explore Below trigger */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {[
              { name: '💬 WhatsApp Bots', count: '6' },
              { name: '🤖 AI & GEO SEO', count: '7' },
              { name: '🎯 B2B Scrapers', count: '5' },
              { name: '📈 CRM & Sales', count: '4' },
              { name: '⚡ Video AI', count: '3' },
            ].map((cat) => (
              <span
                key={cat.name}
                className="text-[11px] font-bold bg-white/10 border border-white/15 px-2.5 py-1 rounded-xl text-slate-200 flex items-center gap-1.5"
              >
                <span>{cat.name}</span>
                <span className="text-[10px] text-amber-300 font-mono font-bold bg-white/10 px-1 rounded">
                  {cat.count}
                </span>
              </span>
            ))}

            {/* Scroll Down Button for users who want to see full breakdown */}
            <button
              onClick={scrollToUpcoming}
              className="text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer ml-1 py-1"
            >
              <span>Explore 25+ Details Below</span>
              <ArrowDown className="w-3 h-3 animate-bounce" />
            </button>
          </div>
        </div>

        {/* Right: Direct Join Form + WhatsApp Community Button */}
        <div className="flex flex-col gap-3 shrink-0 lg:w-80">
          
          {/* Join VIP Directly Here Form */}
          {subscribed ? (
            <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold p-4 rounded-2xl space-y-1 text-center">
              <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-black">
                <Check className="w-4 h-4 shrink-0" />
                <span>You're Enrolled in VIP Network!</span>
              </div>
              <p className="text-[11px] text-slate-300 font-normal">
                You will receive first-access alerts for all 25+ software drops.
              </p>
            </div>
          ) : (
            <form onSubmit={handleQuickSubscribe} className="bg-white/5 border border-white/15 rounded-2xl p-3.5 space-y-2.5">
              <div className="text-xs font-black text-white flex items-center justify-between">
                <span>Join VIP Early-Access Radar</span>
                <span className="text-[10px] text-amber-400 font-bold">100% Free</span>
              </div>

              <input
                type="email"
                required
                placeholder="Work Email Address *"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setStatusMessage(''); }}
                className="w-full bg-white/10 border border-white/15 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 outline-none transition-all"
              />

              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="WhatsApp (optional)"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full bg-white/10 border border-white/15 focus:border-emerald-400 rounded-xl pl-9 pr-2 py-2 text-xs text-white placeholder-slate-400 outline-none transition-all"
                />
              </div>

              {statusMessage && (
                <div className={`text-[11px] font-bold p-2 rounded-xl flex items-center gap-1.5 ${
                  isError ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-[#FF6B35] to-amber-500 hover:from-[#E85A24] hover:to-amber-400 text-white font-black text-xs rounded-xl shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Join VIP List (Get Alerts)</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Secondary Direct Action: Join WhatsApp VIP Community */}
          <a
            href={WHATSAPP_COMMUNITY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Join VIP WhatsApp Community</span>
          </a>

        </div>

      </div>
    </div>
  );
}
