'use client';

import { useState } from 'react';
import { Bell, Zap, Check, Clock, ChevronUp, Database, MessageSquare, Search, Video, Sparkles, X, ShieldCheck } from 'lucide-react';

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

  // Main Top Bar Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Per-Card Inline Notify State
  const [activeNotifyDeal, setActiveNotifyDeal] = useState(null);
  const [cardName, setCardName] = useState('');
  const [cardEmail, setCardEmail] = useState('');
  const [cardWhatsapp, setCardWhatsapp] = useState('');
  const [cardLoading, setCardLoading] = useState(false);
  const [inlineSuccess, setInlineSuccess] = useState('');
  const [cardError, setCardError] = useState('');

  const toggleUpvote = (id, e) => {
    e.stopPropagation();
    const isVoted = !!voted[id];
    setVoted(prev => ({ ...prev, [id]: !isVoted }));
    setUpvotes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + (isVoted ? -1 : 1)
    }));
  };

  // Main Submit Handler
  const handleMainSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid work email.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/upcoming-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          whatsapp: whatsapp.replace(/\D/g, ''),
          source: 'upcoming_section_header',
          preferredCategory: 'All'
        }),
      });
      const data = await res.json();
      if (data?.success) {
        setSubmitted(true);
      } else {
        setError(data?.message || 'Something went wrong.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Per-Card Submit Handler
  const handleCardSubmit = async (e, deal) => {
    e.preventDefault();
    if (!cardEmail || !cardEmail.includes('@')) {
      setCardError('Valid email is required.');
      return;
    }
    setCardLoading(true);
    setCardError('');
    try {
      const res = await fetch('/api/upcoming-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cardName.trim() || `VIP Buyer (${deal.name})`,
          email: cardEmail.trim(),
          whatsapp: cardWhatsapp.replace(/\D/g, ''),
          source: `card_${deal.id}`,
          preferredCategory: deal.category
        }),
      });
      const data = await res.json();
      if (data?.success) {
        setInlineSuccess(deal.name);
        setTimeout(() => {
          setActiveNotifyDeal(null);
          setInlineSuccess('');
          setCardName('');
          setCardEmail('');
          setCardWhatsapp('');
        }, 3500);
      } else {
        setCardError(data?.message || 'Failed to register alert.');
      }
    } catch {
      setCardError('Network error.');
    } finally {
      setCardLoading(false);
    }
  };

  return (
    <section id="upcoming-deals" className="w-full space-y-4 scroll-mt-24">

      {/* ── Compact Header & Name + Email + Number Form ── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="inline-flex items-center gap-1 bg-[#2475FF] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Dropping Soon
              </span>
              <span className="text-[11px] font-bold text-slate-500">
                5-Year SaaS Passes • VIP Early-Bird
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              Upcoming Drops <span className="text-sm font-bold text-slate-400 font-mono">({UPCOMING_DROPS.length})</span>
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium sm:text-right">
            VIP members get private drop link + coupon <span className="font-bold text-slate-800">24h before public release</span>.
          </p>
        </div>

        {/* Form: Name + Email + WhatsApp Number */}
        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold p-3.5 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                🎉 Awesome{name ? ` ${name}` : ''}! You're on the VIP list. We'll send first-access drops to{' '}
                <span className="font-mono text-emerald-950">{email}</span>
                {whatsapp ? ` & WhatsApp (+91 ${whatsapp})` : ''}!
              </span>
            </div>
            <span className="text-[10px] bg-emerald-200/60 text-emerald-800 px-2.5 py-1 rounded-full font-black uppercase tracking-wider shrink-0">
              VIP Active
            </span>
          </div>
        ) : (
          <form onSubmit={handleMainSubmit} className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              {/* Name input */}
              <div className="sm:col-span-3">
                <input
                  type="text"
                  placeholder="Your Name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#2475FF] rounded-xl px-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition-all"
                />
              </div>

              {/* Email input */}
              <div className="sm:col-span-4">
                <input
                  type="email"
                  required
                  placeholder="Work Email Address *"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#2475FF] rounded-xl px-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition-all"
                />
              </div>

              {/* WhatsApp Number input */}
              <div className="sm:col-span-3 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="WhatsApp (optional)"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-emerald-500 rounded-xl pl-10 pr-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition-all"
                />
              </div>

              {/* Submit button */}
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-full py-2 px-3 bg-slate-950 hover:bg-slate-800 text-white text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap disabled:opacity-60"
                >
                  {loading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Join VIP List</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-[11px] font-bold text-red-500 px-1">{error}</p>
            )}
          </form>
        )}
      </div>

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
                    onClick={() => {
                      setActiveNotifyDeal(isNotifyActive ? null : deal.id);
                      setCardError('');
                    }}
                    className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                      isNotifyActive
                        ? 'bg-slate-950 text-white'
                        : 'bg-[#FF6B35] hover:bg-[#E85A24] text-white shadow-xs'
                    }`}
                  >
                    <Bell className="w-3 h-3" />
                    <span>{isNotifyActive ? 'Cancel' : 'Notify Me'}</span>
                  </button>
                </div>

                {/* Inline 3-Input Alert Drawer (Name, Email, Number) */}
                {isNotifyActive && (
                  <div className="mt-2.5 pt-2.5 border-t border-slate-100 animate-in fade-in duration-150">
                    {inlineSuccess === deal.name ? (
                      <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded-lg text-center">
                        ✓ VIP Early Access Alert Locked for {deal.name}!
                      </div>
                    ) : (
                      <form onSubmit={(e) => handleCardSubmit(e, deal)} className="space-y-1.5">
                        <div className="text-[10px] font-black text-slate-700">
                          Get Alert for {deal.name.split(' ')[0]}:
                        </div>
                        <input
                          type="text"
                          placeholder="Your Name (optional)"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[11px] text-slate-800 placeholder-slate-400 outline-none focus:border-[#2475FF]"
                        />
                        <input
                          type="email"
                          required
                          placeholder="Email Address *"
                          value={cardEmail}
                          onChange={(e) => { setCardEmail(e.target.value); setCardError(''); }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[11px] text-slate-800 placeholder-slate-400 outline-none focus:border-[#2475FF]"
                        />
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">+91</span>
                          <input
                            type="tel"
                            maxLength={10}
                            placeholder="WhatsApp Number"
                            value={cardWhatsapp}
                            onChange={(e) => setCardWhatsapp(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-2 py-1 text-[11px] text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-500"
                          />
                        </div>

                        {cardError && (
                          <p className="text-[10px] font-bold text-red-500">{cardError}</p>
                        )}

                        <button
                          type="submit"
                          disabled={cardLoading}
                          className="w-full py-1.5 bg-[#FF6B35] hover:bg-orange-600 text-white text-[11px] font-black rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 disabled:opacity-60"
                        >
                          {cardLoading ? (
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <Bell className="w-3 h-3" />
                              <span>Confirm VIP Alert</span>
                            </>
                          )}
                        </button>
                      </form>
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
