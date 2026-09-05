'use client';

import { useState } from 'react';
import { Bell, Zap, ArrowRight, Check, Clock, ChevronUp, Database, MessageSquare, Search, Video, Sparkles, X } from 'lucide-react';

const UPCOMING_DROPS = [
  {
    id: 'lead-scrape',
    name: 'LeadScrape AI',
    tagline: 'Unlimited B2B leads & verified founder emails.',
    category: 'Lead Scrapers',
    eta: '4 Days',
    price: '₹2,499',
    originalPrice: '₹28,000',
    icon: Database,
    iconColor: 'text-[#FF6B35]',
    iconBg: 'bg-orange-50 border-orange-200',
    upvotes: 412,
  },
  {
    id: 'whatsapp-crm',
    name: 'WhatsAuto CRM',
    tagline: '100+ WhatsApp inboxes with official Meta Cloud API.',
    category: 'WhatsApp Bots',
    eta: '8 Days',
    price: '₹1,999',
    originalPrice: '₹24,000',
    icon: MessageSquare,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50 border-emerald-200',
    upvotes: 358,
  },
  {
    id: 'geo-seo',
    name: 'RankPerplex GEO',
    tagline: 'Rank clients on ChatGPT & Perplexity AI answers.',
    category: 'AI & SEO',
    eta: '12 Days',
    price: '₹2,999',
    originalPrice: '₹35,000',
    icon: Search,
    iconColor: 'text-[#2475FF]',
    iconBg: 'bg-blue-50 border-blue-200',
    upvotes: 284,
  },
  {
    id: 'viral-script',
    name: 'ShortsViral AI',
    tagline: 'Viral hooks & teleprompter scripts for Shorts/Reels.',
    category: 'Productivity',
    eta: '16 Days',
    price: '₹2,199',
    originalPrice: '₹22,000',
    icon: Video,
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50 border-purple-200',
    upvotes: 219,
  },
];

export default function UpcomingDealsSection() {
  const [upvotes, setUpvotes] = useState(() => {
    const init = {};
    UPCOMING_DROPS.forEach(d => { init[d.id] = d.upvotes; });
    return init;
  });
  const [voted, setVoted] = useState({});
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeNotifyDeal, setActiveNotifyDeal] = useState(null);
  const [inlineEmail, setInlineEmail] = useState('');
  const [inlineSuccess, setInlineSuccess] = useState('');
  const [error, setError] = useState('');

  const toggleUpvote = (id, e) => {
    e.stopPropagation();
    const isVoted = !!voted[id];
    setVoted(prev => ({ ...prev, [id]: !isVoted }));
    setUpvotes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + (isVoted ? -1 : 1)
    }));
  };

  const handleSubscribe = async (e, customEmail = null, dealName = '') => {
    if (e) e.preventDefault();
    const targetEmail = customEmail || email;
    if (!targetEmail || !targetEmail.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/upcoming-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail.trim(),
          source: dealName ? `card_${dealName}` : 'upcoming_section_compact',
          name: dealName ? `Early-bird for ${dealName}` : 'VIP Buyer'
        }),
      });
      const data = await res.json();
      if (data?.success) {
        if (dealName) {
          setInlineSuccess(dealName);
          setTimeout(() => {
            setActiveNotifyDeal(null);
            setInlineSuccess('');
            setInlineEmail('');
          }, 3000);
        } else {
          setSubmitted(true);
        }
      } else {
        setError(data?.message || 'Something went wrong.');
      }
    } catch {
      setError('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="upcoming-deals" className="w-full space-y-4 scroll-mt-24">

      {/* ── Compact Header & Inline Subscribe Bar ── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 bg-[#2475FF] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Dropping Soon
            </span>
            <span className="text-[11px] font-bold text-slate-500">
              5-Year SaaS Passes
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
            Upcoming Drops <span className="text-sm font-bold text-slate-400 font-mono">({UPCOMING_DROPS.length})</span>
          </h2>
        </div>

        {/* Compact 1-line Subscribe Input */}
        {submitted ? (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-4 py-2 rounded-xl">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>You're on the VIP list! First drop alerts locked in.</span>
          </div>
        ) : (
          <form onSubmit={(e) => handleSubscribe(e)} className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Bell className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <input
                type="email"
                placeholder="Enter email for VIP early-bird..."
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#2475FF] rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap disabled:opacity-60 shrink-0"
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Notify Me</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {error && (
        <p className="text-xs font-bold text-red-500 px-1">{error}</p>
      )}

      {/* ── Compact 4-Card Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {UPCOMING_DROPS.map((deal) => {
          const Icon = deal.icon;
          const isVoted = !!voted[deal.id];
          const isNotifyActive = activeNotifyDeal === deal.id;

          return (
            <div
              key={deal.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between relative group"
            >
              <div>
                {/* Top Row: Icon + Category + ETA */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${deal.iconBg} ${deal.iconColor} shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {deal.category}
                    </span>
                    <span className="flex items-center gap-0.5 text-[10px] font-black text-[#FF6B35] bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded-md font-mono">
                      <Clock className="w-2.5 h-2.5" />
                      {deal.eta}
                    </span>
                  </div>
                </div>

                {/* Title & Tagline */}
                <h3 className="text-sm font-black text-slate-950 leading-tight">
                  {deal.name}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium leading-normal mt-1 line-clamp-2">
                  {deal.tagline}
                </p>
              </div>

              {/* Price Row + Actions */}
              <div className="mt-3 pt-2.5 border-t border-slate-100">
                <div className="flex items-baseline justify-between mb-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-black text-slate-950 font-mono">{deal.price}</span>
                    <span className="text-[10px] text-slate-400 line-through font-mono">{deal.originalPrice}</span>
                  </div>
                  <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                    5-Yr Pass
                  </span>
                </div>

                {/* Compact Interactive Buttons: Upvote + Alert Me */}
                <div className="flex items-center gap-1.5">
                  {/* Micro Upvote Button */}
                  <button
                    onClick={(e) => toggleUpvote(deal.id, e)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                      isVoted
                        ? 'bg-amber-500 border-amber-500 text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-orange-50 border-slate-200 text-slate-700 hover:text-[#FF6B35]'
                    }`}
                    title="Upvote this deal"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                    <span>{upvotes[deal.id] || deal.upvotes}</span>
                  </button>

                  {/* Micro Notify Button */}
                  <button
                    onClick={() => setActiveNotifyDeal(isNotifyActive ? null : deal.id)}
                    className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                      isNotifyActive
                        ? 'bg-slate-950 text-white'
                        : 'bg-[#FF6B35] hover:bg-[#E85A24] text-white shadow-xs'
                    }`}
                  >
                    <Bell className="w-3 h-3" />
                    <span>{isNotifyActive ? 'Cancel' : 'Notify'}</span>
                  </button>
                </div>

                {/* Inline 1-line Alert Popout */}
                {isNotifyActive && (
                  <div className="mt-2 pt-2 border-t border-slate-100 animate-in fade-in duration-150">
                    {inlineSuccess === deal.name ? (
                      <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 p-1.5 rounded-lg text-center">
                        ✓ VIP Alert Set for {deal.name}!
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <input
                          type="email"
                          placeholder="Your email..."
                          value={inlineEmail}
                          onChange={(e) => setInlineEmail(e.target.value)}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[11px] text-slate-800 placeholder-slate-400 outline-none focus:border-[#FF6B35]"
                        />
                        <button
                          onClick={() => handleSubscribe(null, inlineEmail, deal.name)}
                          className="px-2.5 py-1 bg-slate-950 text-white text-[10px] font-black rounded-lg hover:bg-slate-800 cursor-pointer shrink-0"
                        >
                          OK
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
