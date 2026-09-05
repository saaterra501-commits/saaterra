'use client';

import { useState, useEffect } from 'react';
import { Bell, Zap, Check, Clock, ChevronUp, MessageSquare, Search, Database, Mail, Video, Sparkles, AlertCircle, Layers, ShieldCheck } from 'lucide-react';

const UPCOMING_CATEGORIES = [
  {
    id: 'whatsapp-bots',
    name: 'WhatsApp Bots & Meta Automation',
    toolCount: 6,
    eta: 'Dropping in 5–10 Days',
    priceRange: 'From ₹1,999',
    replaces: 'WATI & Interakt (₹3,500/mo)',
    highlights: 'Cart recovery bots, official Meta Cloud API & multi-agent shared inboxes.',
    icon: MessageSquare,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50 border-emerald-200',
    upvotes: 412,
  },
  {
    id: 'ai-geo-seo',
    name: 'AI & Generative SEO (GEO)',
    toolCount: 7,
    eta: 'Dropping in 7–14 Days',
    priceRange: 'From ₹2,499',
    replaces: 'Ahrefs & Semrush ($129/mo)',
    highlights: 'ChatGPT & Perplexity citation tracking, client white-label audit reports.',
    icon: Search,
    iconColor: 'text-[#2475FF]',
    iconBg: 'bg-blue-50 border-blue-200',
    upvotes: 358,
  },
  {
    id: 'lead-scrapers',
    name: 'B2B Lead Scrapers & Data Finders',
    toolCount: 5,
    eta: 'Dropping in 10–18 Days',
    priceRange: 'From ₹2,499',
    replaces: 'Apollo.io ($99/mo) & Lusha',
    highlights: 'Google Maps lead extractors, 99% SMTP verified emails & phone finders.',
    icon: Database,
    iconColor: 'text-[#FF6B35]',
    iconBg: 'bg-orange-50 border-orange-200',
    upvotes: 284,
  },
  {
    id: 'crm-cold-email',
    name: 'CRM & Cold Email Automation',
    toolCount: 4,
    eta: 'Dropping in 14–21 Days',
    priceRange: 'From ₹1,999',
    replaces: 'Lemlist & Instantly ($79/mo)',
    highlights: 'Outbound sequences, inbox warmups, agency pipelines & GST invoices.',
    icon: Mail,
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-50 border-indigo-200',
    upvotes: 219,
  },
  {
    id: 'video-productivity',
    name: 'Video AI & Creator Productivity',
    toolCount: 3,
    eta: 'Dropping in 18–25 Days',
    priceRange: 'From ₹1,499',
    replaces: 'Syllaby & Jasper Video ($49/mo)',
    highlights: 'Viral retention hooks for Shorts/Reels, teleprompter & audio exports.',
    icon: Video,
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50 border-purple-200',
    upvotes: 187,
  },
];

const TOTAL_TOOLS = UPCOMING_CATEGORIES.reduce((acc, c) => acc + c.toolCount, 0); // 25

export default function UpcomingDealsSection() {
  const [upvotes, setUpvotes] = useState(() => {
    const init = {};
    UPCOMING_CATEGORIES.forEach(c => { init[c.id] = c.upvotes; });
    return init;
  });
  const [voted, setVoted] = useState({});

  // Main Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [error, setError] = useState('');

  // Per-Card Inline Notify State
  const [activeNotifyCat, setActiveNotifyCat] = useState(null);
  const [cardName, setCardName] = useState('');
  const [cardEmail, setCardEmail] = useState('');
  const [cardWhatsapp, setCardWhatsapp] = useState('');
  const [cardLoading, setCardLoading] = useState(false);
  const [inlineSuccess, setInlineSuccess] = useState('');
  const [cardError, setCardError] = useState('');

  // Load registered email from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('stackdeal_vip_registered_email');
      if (saved) {
        setRegisteredEmail(saved);
        setSubmitted(true);
      }
    } catch {}
  }, []);

  const toggleUpvote = (id, e) => {
    e.stopPropagation();
    const isVoted = !!voted[id];
    setVoted(prev => ({ ...prev, [id]: !isVoted }));
    setUpvotes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + (isVoted ? -1 : 1)
    }));
  };

  // Main Submit Handler (Strict 1-time per email)
  const handleMainSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Kripya valid work email enter karein.');
      return;
    }

    if (registeredEmail && cleanEmail === registeredEmail.toLowerCase()) {
      setError('Aap is email se pehle se hi registered hain! Ek email se sirf ek baar hi add ho sakte hain.');
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
          email: cleanEmail,
          whatsapp: whatsapp.replace(/\D/g, ''),
          source: 'upcoming_pipeline_25_software',
          preferredCategory: category
        }),
      });
      const data = await res.json();

      if (data?.success) {
        try {
          localStorage.setItem('stackdeal_vip_registered_email', cleanEmail);
        } catch {}
        setRegisteredEmail(cleanEmail);
        setSubmitted(true);
      } else {
        setError(data?.message || 'Ye email pehle se hi VIP list me registered hai!');
      }
    } catch {
      setError('Network error. Kripya dobara koshish karein.');
    } finally {
      setLoading(false);
    }
  };

  // Per-Card Submit Handler (Strict 1-time per email)
  const handleCardSubmit = async (e, cat) => {
    e.preventDefault();
    const cleanEmail = cardEmail.toLowerCase().trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setCardError('Valid email zaroori hai.');
      return;
    }

    if (registeredEmail && cleanEmail === registeredEmail.toLowerCase()) {
      setCardError('Ye email pehle se hi registered hai! Ek email se ek hi baar add ho sakta hai.');
      return;
    }

    setCardLoading(true);
    setCardError('');
    try {
      const res = await fetch('/api/upcoming-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cardName.trim() || `VIP (${cat.name})`,
          email: cleanEmail,
          whatsapp: cardWhatsapp.replace(/\D/g, ''),
          source: `category_${cat.id}`,
          preferredCategory: cat.name
        }),
      });
      const data = await res.json();

      if (data?.success) {
        try {
          localStorage.setItem('stackdeal_vip_registered_email', cleanEmail);
        } catch {}
        setRegisteredEmail(cleanEmail);
        setInlineSuccess(cat.name);
        setTimeout(() => {
          setActiveNotifyCat(null);
          setInlineSuccess('');
          setCardName('');
          setCardEmail('');
          setCardWhatsapp('');
        }, 3500);
      } else {
        setCardError(data?.message || 'Ye email pehle se hi registered hai!');
      }
    } catch {
      setCardError('Network error.');
    } finally {
      setCardLoading(false);
    }
  };

  return (
    <section id="upcoming-deals" className="w-full space-y-4 scroll-mt-24">

      {/* ── Compact Header & Pipeline VIP Form ── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="inline-flex items-center gap-1 bg-[#2475FF] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Launch Pipeline
              </span>
              <span className="text-[11px] font-bold text-slate-500">
                Next 30 Days Launch Roadmap
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight flex items-center gap-2">
              <span>{TOTAL_TOOLS}+ Software 5-Year Passes Dropping Soon</span>
              <span className="text-xs font-black text-[#FF6B35] bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full font-mono">
                5 Categories
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium sm:text-right max-w-sm">
            Exclusive 5-Year Passes. VIP members get <span className="font-bold text-slate-800">24h early access + launch coupon</span> before public drop.
          </p>
        </div>

        {/* Form: Name + Email + WhatsApp Number + Category */}
        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold p-3.5 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                🎉 Aap VIP list me already added hain (<span className="font-mono text-emerald-950 font-black">{registeredEmail || email}</span>).
                Saare 25+ software ke first-access launch alerts aapko sabse pehle milenge!
              </span>
            </div>
            <span className="text-[10px] bg-emerald-200/60 text-emerald-800 px-2.5 py-1 rounded-full font-black uppercase tracking-wider shrink-0">
              ✓ Registered
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
              <div className="sm:col-span-3">
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
              <div className="sm:col-span-2 relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="WhatsApp"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-emerald-500 rounded-xl pl-9 pr-2 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition-all"
                />
              </div>

              {/* Category Select */}
              <div className="sm:col-span-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#2475FF] rounded-xl px-2.5 py-2 text-xs font-medium text-slate-700 outline-none transition-all cursor-pointer"
                >
                  <option value="All">🔔 All {TOTAL_TOOLS}+ Software</option>
                  {UPCOMING_CATEGORIES.map(c => (
                    <option key={c.id} value={c.name}>{c.name} ({c.toolCount})</option>
                  ))}
                </select>
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
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 p-2 rounded-xl">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </form>
        )}
      </div>

      {/* ── Category Cards Grid (25 Software Launch Pipeline) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
        {UPCOMING_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isVoted = !!voted[cat.id];
          const isNotifyActive = activeNotifyCat === cat.id;

          return (
            <div
              key={cat.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between relative group"
            >
              <div>
                {/* Top Row: Icon + Tool Count Badge */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${cat.iconBg} ${cat.iconColor} shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#2475FF] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full font-mono">
                    <Layers className="w-2.5 h-2.5" />
                    {cat.toolCount} Software
                  </span>
                </div>

                {/* Category Name & Highlights */}
                <h3 className="text-sm font-black text-slate-950 leading-snug">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1.5 line-clamp-2">
                  {cat.highlights}
                </p>

                {/* Drop Window Pill */}
                <div className="mt-2.5 inline-flex items-center gap-1 text-[10px] font-bold text-[#FF6B35] bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md">
                  <Clock className="w-3 h-3" />
                  <span>{cat.eta}</span>
                </div>
              </div>

              {/* Price Row + Actions */}
              <div className="mt-3 pt-2.5 border-t border-slate-100">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xs font-black text-slate-900 font-mono">{cat.priceRange}</span>
                  <span className="text-[9px] font-bold text-slate-400">5-Yr Pass</span>
                </div>

                {/* Compact Buttons: Vote + Alert Me */}
                <div className="flex items-center gap-1.5">
                  {/* Micro Upvote Button */}
                  <button
                    onClick={(e) => toggleUpvote(cat.id, e)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                      isVoted
                        ? 'bg-amber-500 border-amber-500 text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-orange-50 border-slate-200 text-slate-700 hover:text-[#FF6B35]'
                    }`}
                    title="Vote for this category to prioritize drops"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                    <span>{upvotes[cat.id] || cat.upvotes}</span>
                  </button>

                  {/* Micro Notify Button */}
                  <button
                    onClick={() => {
                      setActiveNotifyCat(isNotifyActive ? null : cat.id);
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

                {/* Inline 3-Input Alert Drawer for this Category */}
                {isNotifyActive && (
                  <div className="mt-2.5 pt-2.5 border-t border-slate-100 animate-in fade-in duration-150">
                    {inlineSuccess === cat.name ? (
                      <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded-lg text-center">
                        ✓ Alert Set for {cat.toolCount} {cat.name} drops!
                      </div>
                    ) : (
                      <form onSubmit={(e) => handleCardSubmit(e, cat)} className="space-y-1.5">
                        <div className="text-[10px] font-black text-slate-700">
                          Alert for {cat.toolCount} {cat.name.split(' ')[0]} Tools:
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
                          placeholder="Work Email Address *"
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
                          <div className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 p-1.5 rounded-lg">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            <span>{cardError}</span>
                          </div>
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
                              <span>Get Category Alerts</span>
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
