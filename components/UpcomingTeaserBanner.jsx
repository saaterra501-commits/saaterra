'use client';

import { useState } from 'react';
import { Flame, ArrowDown, Sparkles, Bell, ArrowRight, Zap, Check, Users } from 'lucide-react';

export default function UpcomingTeaserBanner() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const scrollToUpcoming = () => {
    const el = document.getElementById('upcoming-deals');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      // Add a temporary highlight pulse
      el.classList.add('ring-4', 'ring-[#FF6B35]/40', 'transition-all', 'duration-500');
      setTimeout(() => {
        el.classList.remove('ring-4', 'ring-[#FF6B35]/40');
      }, 2000);
    }
  };

  const handleQuickSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setLoading(true);
    try {
      const res = await fetch('/api/upcoming-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          source: 'hero_teaser_banner',
          preferredCategory: 'All'
        })
      });
      const data = await res.json();
      if (data?.success) {
        setSubscribed(true);
      } else {
        // If already subscribed or error, scroll down to show status
        scrollToUpcoming();
      }
    } catch {
      scrollToUpcoming();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden group">
      
      {/* Subtle background glow effect */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-[#2475FF]/20 via-[#FF6B35]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#FF6B35]/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left: Attention-Grabbing Hook */}
        <div className="space-y-2.5 max-w-2xl">
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
              <Users className="w-3 h-3 text-slate-400" />
              3,200+ founders on VIP list
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
            Don't Miss Upcoming 5-Year Deals: WhatsApp Bots, AI SEO, B2B Scrapers & CRMs
          </h3>

          <p className="text-xs text-slate-300 font-medium leading-relaxed">
            We negotiate exclusive 5-Year software licenses. VIP members receive private early-bird links{' '}
            <span className="text-amber-300 font-bold">24 hours before public release</span> with extra launch discounts.
          </p>

          {/* Category Preview Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {[
              { name: '💬 WhatsApp Bots', count: '6 Tools' },
              { name: '🤖 AI & GEO SEO', count: '7 Tools' },
              { name: '🎯 B2B Scrapers', count: '5 Tools' },
              { name: '📈 CRM & Sales', count: '4 Tools' },
              { name: '⚡ Video AI', count: '3 Tools' },
            ].map((cat) => (
              <button
                key={cat.name}
                onClick={scrollToUpcoming}
                className="text-[11px] font-bold bg-white/10 hover:bg-white/20 border border-white/15 px-2.5 py-1 rounded-xl text-slate-200 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>{cat.name}</span>
                <span className="text-[10px] text-amber-300 font-mono font-bold bg-white/10 px-1 rounded">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Magnetic Call-to-Action to Scroll Down & Subscribe */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-3 shrink-0 lg:w-72">
          
          {/* Primary CTA: Big Bouncing Button to Scroll to Section */}
          <button
            onClick={scrollToUpcoming}
            className="w-full py-3.5 px-5 bg-gradient-to-r from-[#FF6B35] to-amber-500 hover:from-[#E85A24] hover:to-amber-400 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2.5 cursor-pointer group/btn"
          >
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
            </div>
            <span>See 25+ Drops & Subscribe</span>
          </button>

          {/* Quick 1-Click Email Capture or Success Message */}
          {subscribed ? (
            <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold p-2.5 rounded-xl text-center flex items-center justify-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>You're on the VIP list!</span>
            </div>
          ) : (
            <form onSubmit={handleQuickSubscribe} className="flex items-center gap-1.5">
              <input
                type="email"
                placeholder="Or enter work email here..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/10 border border-white/20 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 outline-none transition-all"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white text-xs font-black rounded-xl transition-all flex items-center gap-1 cursor-pointer shrink-0 disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Join</span>
                    <ArrowRight className="w-3 h-3" />
                  </>
                )}
              </button>
            </form>
          )}

          <p className="text-[10px] text-slate-400 text-center font-medium">
            🔒 100% Free. Zero spam. Unsubscribe anytime.
          </p>
        </div>

      </div>
    </div>
  );
}
