'use client';

import { useState } from 'react';
import { Bell, Zap, Lock, Star, ArrowRight, Check, Sparkles, Clock } from 'lucide-react';

const CATEGORIES = ['All', 'WhatsApp Bots', 'AI & SEO', 'Lead Scrapers', 'CRM & Sales', 'Productivity'];

const UPCOMING_TEASER = [
  {
    id: 1,
    name: 'AI Cold Email Automator',
    category: 'Lead Scrapers',
    eta: 'Dropping in ~5 days',
    badge: '🔥 Most Wanted',
    interests: 412,
    gradient: 'from-orange-500 to-red-500',
    bg: 'bg-orange-50',
    icon: '✉️',
  },
  {
    id: 2,
    name: 'WhatsApp CRM for Agencies',
    category: 'WhatsApp Bots',
    eta: 'Dropping in ~10 days',
    badge: '⚡ High Demand',
    interests: 289,
    gradient: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50',
    icon: '💬',
  },
  {
    id: 3,
    name: 'AI Video Script Generator',
    category: 'Productivity',
    eta: 'Dropping in ~14 days',
    badge: '🚀 New Drop',
    interests: 198,
    gradient: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    icon: '🎬',
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
      const data = await res.json();
      if (data?.success) {
        setSubmitted(true);
        setAlreadyJoined(data.alreadySubscribed || false);
      } else {
        setError(data?.message || 'Something went wrong.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full py-0" aria-labelledby="upcoming-deals-heading">
      <div className="relative w-full rounded-[28px] overflow-hidden bg-gradient-to-br from-[#0A0F1E] via-[#111827] to-[#0D1B2A] border border-white/10 shadow-2xl">

        {/* Ambient Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-[#2475FF]/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#FF6B35]/10 blur-3xl" />
        </div>

        <div className="relative z-10 p-6 sm:p-10">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  VIP Buyer Network
                </span>
              </div>
              <h2
                id="upcoming-deals-heading"
                className="text-2xl sm:text-3xl font-black text-white leading-tight"
              >
                Upcoming 5-Year Deals
                <span className="block text-[#FF6B35] mt-0.5">Dropping Soon 🔥</span>
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm font-medium mt-2 max-w-md leading-relaxed">
                Join 3,000+ Indian agency founders who get first access to every new deal—before it goes live to the public.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="text-center bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                <div className="text-2xl font-black text-amber-300">3,000+</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">VIP Members</div>
              </div>
              <div className="text-center bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                <div className="text-2xl font-black text-emerald-400">₹0</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">To Join</div>
              </div>
            </div>
          </div>

          {/* Teaser Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {UPCOMING_TEASER.map((deal) => (
              <div
                key={deal.id}
                className="bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-4 transition-all group cursor-default"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${deal.gradient} flex items-center justify-center text-xl shadow-lg`}>
                    {deal.icon}
                  </div>
                  <span className="text-[10px] font-black text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                    {deal.badge}
                  </span>
                </div>
                <h3 className="text-sm font-black text-white leading-snug mb-1">{deal.name}</h3>
                <p className="text-[11px] text-slate-400 font-medium mb-3">{deal.category}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span className="font-bold text-amber-300">{deal.eta}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                    <Star className="w-3 h-3 fill-slate-500 text-slate-500" />
                    {deal.interests} interested
                  </div>
                </div>
                {/* Blurred "Lock" overlay */}
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500 bg-white/5 rounded-xl px-3 py-2">
                  <Lock className="w-3 h-3" />
                  <span>Join the VIP list to unlock price & details</span>
                </div>
              </div>
            ))}
          </div>

          {/* Signup Form */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            {submitted ? (
              /* Success State */
              <div className="text-center py-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white mb-1">
                    {alreadyJoined ? "You're already on the list! 🎉" : "You're IN the VIP List! 🎉"}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
                    {alreadyJoined
                      ? "We already have your details. You'll be notified first when the next deal drops!"
                      : "Every time a new 5-Year SaaS deal goes live, you'll get a WhatsApp/email notification before anyone else."}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-black text-amber-300">Welcome to the StackDeal VIP Buyer Network</span>
                </div>
              </div>
            ) : (
              /* Form State */
              <>
                <div className="flex items-center gap-2 mb-4">
                  <Bell className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-black text-white">Get Instant Alert When Next Deal Drops</h3>
                  <span className="ml-auto text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">FREE</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Your Name (optional)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/8 border border-white/15 hover:border-white/25 focus:border-[#2475FF] rounded-xl px-4 py-3 text-xs font-medium text-white placeholder-slate-500 outline-none transition-all"
                    />
                    <input
                      id="upcoming-alert-email"
                      type="email"
                      placeholder="Email Address *"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      required
                      className="w-full bg-white/8 border border-white/15 hover:border-white/25 focus:border-[#2475FF] rounded-xl px-4 py-3 text-xs font-medium text-white placeholder-slate-500 outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-bold">+91</span>
                      <input
                        id="upcoming-alert-whatsapp"
                        type="tel"
                        placeholder="WhatsApp (optional — for instant alerts)"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        maxLength={10}
                        className="w-full bg-white/8 border border-white/15 hover:border-white/25 focus:border-emerald-500 rounded-xl pl-12 pr-4 py-3 text-xs font-medium text-white placeholder-slate-500 outline-none transition-all"
                      />
                    </div>

                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-white/8 border border-white/15 hover:border-white/25 rounded-xl px-4 py-3 text-xs font-medium text-slate-300 outline-none transition-all cursor-pointer appearance-none"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c} value={c} style={{ background: '#111827', color: '#f1f5f9' }}>{c === 'All' ? '🔔 Alert me for all categories' : c}</option>
                      ))}
                    </select>
                  </div>

                  {error && (
                    <p className="text-xs font-bold text-red-400">{error}</p>
                  )}

                  <button
                    id="upcoming-alert-submit"
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-[#FF6B35] to-amber-500 hover:from-[#E85A24] hover:to-amber-400 text-white font-black text-sm rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Joining VIP List...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Join VIP Buyer Network — Get First Access</span>
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </>
                    )}
                  </button>
                </form>

                <p className="text-[10px] text-slate-500 text-center mt-3 font-medium">
                  🔒 No spam ever. Unsubscribe anytime. We only notify on new deal launches.
                </p>
              </>
            )}
          </div>

          {/* Social Proof Footer Bar */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500 font-medium">
            {[
              { icon: '✅', text: 'Zero spam guarantee' },
              { icon: '⚡', text: 'First access before public' },
              { icon: '💸', text: 'Exclusive early-bird pricing' },
              { icon: '🇮🇳', text: 'Built for Indian agencies & freelancers' },
            ].map((item) => (
              <span key={item.text} className="flex items-center gap-1.5">
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
