'use client';

import { useState } from 'react';
import { Bell, Zap, ArrowRight, Check, Clock, Lock, Flame, Sparkles, Users } from 'lucide-react';

const CATEGORIES = ['All', 'WhatsApp Bots', 'AI & SEO', 'Lead Scrapers', 'CRM & Sales', 'Productivity'];

const UPCOMING_TEASER = [
  {
    id: 1,
    name: 'AI Cold Email Automator',
    tagline: 'Generate hyper-personalized cold emails for B2B leads at scale.',
    category: 'Lead Scrapers',
    eta: 'Dropping in ~5 days',
    etaDays: 5,
    badge: '🔥 Most Wanted',
    interests: 412,
    icon: '✉️',
    gradient: 'from-orange-500 to-red-500',
    accentBg: 'bg-orange-50',
    accentBorder: 'border-orange-200',
    accentText: 'text-orange-600',
    price: '₹2,499',
    originalPrice: '₹28,000',
  },
  {
    id: 2,
    name: 'WhatsApp CRM for Agencies',
    tagline: 'Manage 100+ client WhatsApp threads in one agency dashboard.',
    category: 'WhatsApp Bots',
    eta: 'Dropping in ~10 days',
    etaDays: 10,
    badge: '⚡ High Demand',
    interests: 289,
    icon: '💬',
    gradient: 'from-emerald-500 to-teal-600',
    accentBg: 'bg-emerald-50',
    accentBorder: 'border-emerald-200',
    accentText: 'text-emerald-600',
    price: '₹1,999',
    originalPrice: '₹24,000',
  },
  {
    id: 3,
    name: 'AI Video Script Generator',
    tagline: 'Turn blog posts and briefs into viral short-form video scripts instantly.',
    category: 'Productivity',
    eta: 'Dropping in ~14 days',
    etaDays: 14,
    badge: '🚀 Launching Soon',
    interests: 198,
    icon: '🎬',
    gradient: 'from-violet-500 to-purple-600',
    accentBg: 'bg-violet-50',
    accentBorder: 'border-violet-200',
    accentText: 'text-violet-600',
    price: '₹3,299',
    originalPrice: '₹36,000',
  },
];

export default function UpcomingDealsSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyJoined, setAlreadyJoined] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Valid email required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/upcoming-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, whatsapp, preferredCategory: category, source: 'homepage' }),
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data?.success) {
        setSubmitted(true);
        setAlreadyJoined(data.alreadySubscribed || false);
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
    <section className="w-full space-y-6" aria-labelledby="upcoming-deals-heading">

      {/* ── Section Header (matches site style exactly) ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-[#2475FF] text-white text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-2 shadow-sm">
            <Bell className="w-3 h-3" />
            Coming Soon • VIP First Access
          </span>
          <h2
            id="upcoming-deals-heading"
            className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight flex items-center gap-2"
          >
            Upcoming 5-Year Deals
            <span className="text-sm font-black text-[#FF6B35] bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full font-mono">
              {UPCOMING_TEASER.length} Dropping Soon
            </span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1 max-w-lg leading-relaxed">
            Secured your spot before these deals go live to the public. VIP subscribers get
            {' '}<span className="font-bold text-slate-700">first access + early-bird pricing.</span>
          </p>
        </div>

        {/* Stats pill (matches site's badge style) */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm">
            <Users className="w-4 h-4 text-[#2475FF]" />
            <div>
              <div className="text-base font-black text-slate-950">3,000+</div>
              <div className="text-[10px] text-slate-500 font-bold leading-none">VIP Members</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <div>
              <div className="text-base font-black text-[#FF6B35]">Free</div>
              <div className="text-[10px] text-slate-500 font-bold leading-none">To Join</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Upcoming Deal Cards (matches NachoNachoCard light style) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {UPCOMING_TEASER.map((deal) => (
          <div
            key={deal.id}
            className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-[0_2px_12px_rgba(10,15,30,0.07)] hover:shadow-[0_14px_40px_rgba(10,15,30,0.13)] hover:-translate-y-1 transition-all duration-300 group cursor-default flex flex-col"
          >
            {/* Top accent bar */}
            <div className={`h-[4px] w-full bg-gradient-to-r ${deal.gradient}`} />

            <div className="p-5 flex flex-col flex-1">
              {/* Card Header */}
              <div className="flex items-start justify-between mb-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${deal.gradient} flex items-center justify-center text-2xl shadow-md`}>
                  {deal.icon}
                </div>
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${deal.accentBg} ${deal.accentBorder} ${deal.accentText}`}>
                  {deal.badge}
                </span>
              </div>

              {/* Deal name & tagline */}
              <h3 className="text-[15px] font-black text-slate-950 leading-snug mb-1">{deal.name}</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-3 flex-1">{deal.tagline}</p>

              {/* Category tag */}
              <span className="inline-flex w-fit items-center gap-1 bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-black px-2 py-0.5 rounded-full mb-3">
                {deal.category}
              </span>

              {/* Pricing — blurred/teaser */}
              <div className="flex items-baseline gap-2 mb-3">
                <div className="relative">
                  <span className="text-xl font-black text-slate-950 blur-sm select-none">{deal.price}</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="flex items-center gap-1 text-[11px] font-black text-slate-400">
                      <Lock className="w-3 h-3" />
                      Join to reveal price
                    </span>
                  </div>
                </div>
                <span className="text-xs text-slate-400 line-through blur-sm select-none">{deal.originalPrice}</span>
              </div>

              {/* ETA + Interest row */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <Clock className="w-3.5 h-3.5 text-[#FF6B35]" />
                  <span className="text-[#FF6B35]">{deal.eta}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                  <Bell className="w-3 h-3" />
                  {deal.interests} interested
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Subscribe Form (matches site's white card style) ── */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-[0_2px_12px_rgba(10,15,30,0.07)] overflow-hidden">

        {/* Form header strip */}
        <div className="bg-gradient-to-r from-[#0A0F1E] to-[#1A2035] px-6 py-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FF6B35]/20 border border-[#FF6B35]/30 flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#FF6B35]" />
            </div>
            <div>
              <div className="text-sm font-black text-white">Get First Access When Next Deal Drops</div>
              <div className="text-[11px] text-slate-400 font-medium">Join 3,000+ Indian founders already on the VIP list</div>
            </div>
          </div>
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-3 py-1 rounded-full uppercase">
            Free Forever
          </span>
        </div>

        <div className="p-6">
          {submitted ? (
            /* Success */
            <div className="text-center py-8 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-black text-slate-950">
                {alreadyJoined ? "You're already on the VIP list! 🎉" : "You're IN! Welcome to VIP Buyer Network 🎉"}
              </h3>
              <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                {alreadyJoined
                  ? "We already have your details. You'll be notified first when the next deal launches!"
                  : "Every time a new deal goes live, you'll get an alert before the public. Next drop is in 5 days!"}
              </p>
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-black px-4 py-2 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                Welcome to StackDeal VIP Network
              </div>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Your Name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#2475FF] rounded-xl px-4 py-3 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition-all"
                />
                <input
                  id="upcoming-alert-email"
                  type="email"
                  placeholder="Email Address *"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  required
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#2475FF] rounded-xl px-4 py-3 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">+91</span>
                  <input
                    id="upcoming-alert-whatsapp"
                    type="tel"
                    placeholder="WhatsApp (optional — instant alerts)"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    maxLength={10}
                    className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-emerald-500 rounded-xl pl-12 pr-4 py-3 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition-all"
                  />
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3 text-xs font-medium text-slate-600 outline-none transition-all cursor-pointer appearance-none"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c === 'All' ? '🔔 Alert me for all categories' : c}</option>
                  ))}
                </select>
              </div>

              {error && <p className="text-xs font-bold text-red-500">{error}</p>}

              <button
                id="upcoming-alert-submit"
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-[#FF6B35] to-amber-500 hover:from-[#E85A24] hover:to-amber-400 text-white font-black text-sm rounded-2xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Joining VIP List...</span></>
                ) : (
                  <><Zap className="w-4 h-4" /><span>Join VIP Buyer Network — Get First Access</span><ArrowRight className="w-4 h-4 ml-auto" /></>
                )}
              </button>
            </form>
          )}

          {/* Trust signals row (matches site's guarantee badges) */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
            {[
              { icon: '🔒', text: 'Zero spam — ever' },
              { icon: '⚡', text: 'First access before public' },
              { icon: '💸', text: 'Early-bird pricing exclusive' },
              { icon: '🇮🇳', text: 'Built for Indian founders' },
            ].map((item) => (
              <span key={item.text} className="flex items-center gap-1">
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
