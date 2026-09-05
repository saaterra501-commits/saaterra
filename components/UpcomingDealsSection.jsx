'use client';

import { useState, useEffect } from 'react';
import {
  Bell, Zap, ArrowRight, Check, Clock, Lock, Flame,
  Users, Eye, TrendingUp, ChevronRight, Sparkles,
} from 'lucide-react';

const CATEGORIES_FILTER = ['All', 'WhatsApp Bots', 'AI & SEO', 'Lead Scrapers', 'CRM & Sales'];

const UPCOMING_TEASER = [
  {
    id: 1,
    name: 'AI Cold Email Automator',
    tagline: 'Generate hyper-personalized cold emails for B2B leads at scale — in 30 seconds.',
    category: 'Lead Scrapers',
    eta: '~5 days',
    etaDays: 5,
    badge: 'Most Wanted',
    interests: 412,
    spotsLeft: 23,
    totalSpots: 100,
    icon: '✉️',
    color: '#FF6B35',
    lightBg: '#FFF4EF',
    bullet1: 'Integrates with LinkedIn + Apollo',
    bullet2: 'Auto-personalization per lead',
    bullet3: 'Sends via Gmail / SMTP',
  },
  {
    id: 2,
    name: 'WhatsApp CRM for Agencies',
    tagline: 'Manage 100+ client WhatsApp conversations in one unified agency dashboard.',
    category: 'WhatsApp Bots',
    eta: '~10 days',
    etaDays: 10,
    badge: 'High Demand',
    interests: 289,
    spotsLeft: 47,
    totalSpots: 100,
    icon: '💬',
    color: '#00C875',
    lightBg: '#EDFFF7',
    bullet1: 'Bulk messaging with personalisation',
    bullet2: 'Team inbox + assignment',
    bullet3: 'Analytics & open rate tracking',
  },
  {
    id: 3,
    name: 'AI Video Script Generator',
    tagline: 'Turn any blog post or topic into a viral short-form video script instantly.',
    category: 'AI & SEO',
    eta: '~14 days',
    etaDays: 14,
    badge: 'Launching Soon',
    interests: 198,
    spotsLeft: 67,
    totalSpots: 100,
    icon: '🎬',
    color: '#7C3AED',
    lightBg: '#F5F0FF',
    bullet1: 'YouTube Shorts & Reels scripts',
    bullet2: 'B2B + D2C tone variants',
    bullet3: 'Hook + CTA optimisation',
  },
];

// ── Animated live interest counter ──
function LiveCounter({ value }) {
  const [display, setDisplay] = useState(value - 3);
  useEffect(() => {
    const id = setInterval(() => {
      setDisplay((prev) => {
        if (prev >= value) { clearInterval(id); return value; }
        return prev + 1;
      });
    }, 120);
    return () => clearInterval(id);
  }, [value]);
  return <span>{display}</span>;
}

// ── Spots-left progress bar ──
function SpotsBar({ spotsLeft, totalSpots, color }) {
  const pct = Math.round(((totalSpots - spotsLeft) / totalSpots) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] font-bold">
        <span className="text-slate-500">{totalSpots - spotsLeft} claimed</span>
        <span style={{ color }} className="font-black">{spotsLeft} spots left</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

// ── Individual Deal Card ──
function DealCard({ deal, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden group ${
        isActive
          ? 'border-slate-950 shadow-xl scale-[1.01]'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-md bg-white'
      }`}
      style={isActive ? { borderColor: deal.color, background: deal.lightBg } : { background: '#fff' }}
    >
      {/* Top bar */}
      <div
        className="h-1 w-full transition-all"
        style={{ background: isActive ? deal.color : '#e2e8f0' }}
      />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3 gap-2">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm shrink-0"
              style={{ background: deal.lightBg, border: `1.5px solid ${deal.color}30` }}
            >
              {deal.icon}
            </div>
            <div>
              <div className="text-[13px] font-black text-slate-950 leading-tight">{deal.name}</div>
              <div className="text-[10px] font-bold mt-0.5" style={{ color: deal.color }}>
                ⏱ Drops in {deal.eta}
              </div>
            </div>
          </div>
          <span
            className="text-[9px] font-black px-2 py-1 rounded-full whitespace-nowrap shrink-0"
            style={{ background: `${deal.color}18`, color: deal.color }}
          >
            🔥 {deal.badge}
          </span>
        </div>

        {/* Expandable detail on active */}
        <div className={`overflow-hidden transition-all duration-500 ${isActive ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
          <p className="text-xs text-slate-600 font-medium mb-3 leading-relaxed">{deal.tagline}</p>
          <ul className="space-y-1.5 mb-3">
            {[deal.bullet1, deal.bullet2, deal.bullet3].map((b) => (
              <li key={b} className="flex items-start gap-2 text-[11px] font-medium text-slate-700">
                <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: deal.color }} />
                {b}
              </li>
            ))}
          </ul>
          {/* Blurred price teaser */}
          <div className="flex items-center gap-2 bg-white/60 border border-slate-200 rounded-xl px-3 py-2 mb-3">
            <Lock className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="text-[11px] font-black text-slate-400">Price revealed on launch day to VIP list only</span>
            <span className="ml-auto text-[11px] font-black text-slate-300 blur-sm select-none">₹2,499</span>
          </div>
        </div>

        {/* Stats row (always visible) */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
            <Eye className="w-3 h-3" />
            <LiveCounter value={deal.interests} />
            <span>interested</span>
          </div>
          <ChevronRight
            className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'rotate-90' : ''}`}
            style={{ color: isActive ? deal.color : '#94a3b8' }}
          />
        </div>

        {isActive && (
          <div className="mt-3">
            <SpotsBar spotsLeft={deal.spotsLeft} totalSpots={deal.totalSpots} color={deal.color} />
          </div>
        )}
      </div>
    </button>
  );
}

// ── Main Section ──
export default function UpcomingDealsSection() {
  const [activeCard, setActiveCard] = useState(0);
  const [catFilter, setCatFilter] = useState('All');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyJoined, setAlreadyJoined] = useState(false);
  const [error, setError] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);

  // Auto-rotate active card every 4 s
  useEffect(() => {
    const id = setInterval(() => {
      setActiveCard((p) => (p + 1) % UPCOMING_TEASER.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const filtered = catFilter === 'All'
    ? UPCOMING_TEASER
    : UPCOMING_TEASER.filter((d) => d.category === catFilter);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) { setError('Valid email required.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/upcoming-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, whatsapp, preferredCategory: catFilter, source: 'homepage' }),
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data?.success) { setSubmitted(true); setAlreadyJoined(data.alreadySubscribed || false); }
      else setError(data?.message || 'Something went wrong.');
    } catch { setError('Network error. Try again.'); }
    finally { setLoading(false); }
  };

  return (
    <section className="w-full" aria-labelledby="upcoming-deals-heading">

      {/* ── Section Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4 mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-[#2475FF] text-white text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-2 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            Coming Soon • VIP First Access
          </span>
          <h2
            id="upcoming-deals-heading"
            className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight"
          >
            Upcoming 5-Year Deals
            <span className="ml-2 text-sm font-black text-[#FF6B35] bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full font-mono">
              Dropping Soon 🔥
            </span>
          </h2>
        </div>

        {/* Category filter tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
          {CATEGORIES_FILTER.map((cat) => (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border cursor-pointer ${
                catFilter === cat
                  ? 'bg-slate-950 text-white border-slate-950 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Two-column layout: cards left, form right ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Cards column (3/5 width) */}
        <div className="lg:col-span-3 space-y-3">

          {/* Total interested banner */}
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
            <TrendingUp className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-xs font-bold text-amber-800">
              <span className="font-black">899</span> founders are watching these 3 upcoming deals. Click any card to see full details.
            </p>
          </div>

          {filtered.map((deal, i) => (
            <DealCard
              key={deal.id}
              deal={deal}
              isActive={activeCard === i}
              onClick={() => setActiveCard(i)}
            />
          ))}

          {/* Dots indicator */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            {UPCOMING_TEASER.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveCard(i)}
                className={`rounded-full transition-all cursor-pointer ${
                  activeCard === i ? 'w-5 h-2' : 'w-2 h-2'
                }`}
                style={{ background: activeCard === i ? UPCOMING_TEASER[i].color : '#e2e8f0' }}
              />
            ))}
          </div>
        </div>

        {/* Form column (2/5 width) */}
        <div className="lg:col-span-2">
          <div className="sticky top-20 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(10,15,30,0.09)]">

            {/* Dark form header */}
            <div className="bg-[#0A0F1E] px-5 py-4">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-7 h-7 rounded-lg bg-[#FF6B35]/20 border border-[#FF6B35]/30 flex items-center justify-center">
                  <Bell className="w-3.5 h-3.5 text-[#FF6B35]" />
                </div>
                <span className="text-sm font-black text-white">Get First Access</span>
                <span className="ml-auto text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  FREE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium pl-9">
                Join{' '}<span className="text-amber-300 font-black">3,000+</span> Indian founders already waiting.
              </p>

              {/* 3 mini deal badges */}
              <div className="flex gap-1.5 mt-3 pl-9 flex-wrap">
                {UPCOMING_TEASER.map((d) => (
                  <span
                    key={d.id}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${d.color}20`, color: d.color }}
                  >
                    {d.icon} {d.eta}
                  </span>
                ))}
              </div>
            </div>

            {/* Form body */}
            <div className="p-5">
              {submitted ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto">
                    <Check className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h3 className="text-base font-black text-slate-950">
                    {alreadyJoined ? "Already on the list! 🎉" : "You're IN! 🎉"}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    {alreadyJoined
                      ? "We'll notify you first when the next deal drops!"
                      : `Alert goes to ${email} when the next deal launches.`}
                  </p>
                  <div className="flex items-center justify-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-black px-4 py-2 rounded-full">
                    <Sparkles className="w-3.5 h-3.5" />
                    Welcome to StackDeal VIP Network
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your name (optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#2475FF] rounded-xl px-4 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition-all"
                  />

                  <div className="relative">
                    <input
                      id="upcoming-alert-email"
                      type="email"
                      placeholder="Email address *"
                      value={email}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      required
                      className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition-all ${
                        emailFocused ? 'border-[#2475FF] shadow-[0_0_0_3px_rgba(36,117,255,0.12)]' : 'border-slate-200'
                      }`}
                    />
                  </div>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 font-bold pointer-events-none">+91</span>
                    <input
                      id="upcoming-alert-whatsapp"
                      type="tel"
                      placeholder="WhatsApp (instant alert)"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      maxLength={10}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:shadow-[0_0_0_3px_rgba(0,200,117,0.12)] rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition-all"
                    />
                  </div>

                  {error && <p className="text-[11px] font-bold text-red-500">{error}</p>}

                  <button
                    id="upcoming-alert-submit"
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#FF6B35] hover:bg-[#E85A24] active:scale-[0.98] text-white font-black text-xs rounded-xl shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Joining...</span></>
                    ) : (
                      <><Zap className="w-3.5 h-3.5" /><span>Notify Me First When Deal Drops</span><ArrowRight className="w-3.5 h-3.5 ml-auto" /></>
                    )}
                  </button>

                  {/* Social proof mini row */}
                  <div className="flex items-center justify-center gap-1 pt-1">
                    <div className="flex -space-x-1.5">
                      {['🧑', '👩', '👨', '🧑'].map((face, i) => (
                        <div key={i} className="w-5 h-5 rounded-full bg-slate-100 border border-white flex items-center justify-center text-[10px]">
                          {face}
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium ml-1">+3,000 already waiting</span>
                  </div>

                  <p className="text-[10px] text-slate-400 text-center font-medium">
                    🔒 No spam. Unsubscribe anytime.
                  </p>
                </form>
              )}
            </div>

            {/* Trust footer */}
            <div className="px-5 pb-4 grid grid-cols-2 gap-2">
              {[
                { icon: '⚡', text: 'First access always' },
                { icon: '💸', text: 'Early-bird pricing' },
                { icon: '🇮🇳', text: 'For Indian founders' },
                { icon: '🔒', text: 'Zero spam ever' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1.5 text-[10px] font-bold text-slate-500">
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
