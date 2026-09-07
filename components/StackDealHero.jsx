'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, ShieldCheck, Star, ArrowRight, Tag, Clock, TrendingUp } from 'lucide-react';

const DEFAULT_FEATURED = {
  slug: 'chat-chacha',
  title: 'Chat Chacha — WhatsApp AI Marketing & Automation',
  tagline: 'Recover abandoned carts, broadcast offers, and automate agency support with WhatsApp Cloud API.',
  badge: '🔥 Bestseller',
  tier1Price: 1999,
  originalPrice: 24000,
  discountPct: 92,
  rating: 4.9,
  reviewsCount: 42,
  heroImage: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?q=80&w=1000&auto=format&fit=crop',
};

const TICKER_ITEMS = [
  { name: 'Rahul', city: 'Delhi', deal: 'Chat Chacha 5-Yr Pass', time: '2 min ago' },
  { name: 'Priya', city: 'Mumbai', deal: 'AI Keyword Radar', time: '5 min ago' },
  { name: 'Arjun', city: 'Bangalore', deal: 'EmailExtractor Pro', time: '8 min ago' },
  { name: 'Sneha', city: 'Pune', deal: 'Chat Chacha Agency Pass', time: '12 min ago' },
  { name: 'Vikram', city: 'Hyderabad', deal: 'Nuwatomic GEO SEO', time: '15 min ago' },
  { name: 'Ananya', city: 'Chennai', deal: 'Chat Chacha Starter Pass', time: '19 min ago' },
  { name: 'Rohit', city: 'Kolkata', deal: 'AI Keyword Radar Pro', time: '23 min ago' },
];

const TRUST_STATS = [
  { icon: '🛡️', value: '₹50L+', label: 'Saved by founders' },
  { icon: '🚀', value: '500+', label: 'Deals sold' },
  { icon: '⭐', value: '4.9/5', label: 'Avg rating' },
  { icon: '🔒', value: '60-Day', label: 'Refund guarantee' },
];

export default function StackDealHero({ deals = [] }) {
  const [featured, setFeatured] = useState(DEFAULT_FEATURED);
  const [timeLeft, setTimeLeft] = useState({ hours: 11, minutes: 47, seconds: 23 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (deals && deals.length > 0) {
      const first = deals[0];
      setFeatured({
        slug: first.slug || first.id || 'chat-chacha',
        title: first.title || DEFAULT_FEATURED.title,
        tagline: first.tagline || DEFAULT_FEATURED.tagline,
        badge: first.badge || '🔥 Bestseller',
        tier1Price: Number(first.tier1Price ?? first.pricingTiers?.[0]?.price ?? DEFAULT_FEATURED.tier1Price),
        originalPrice: Number(first.originalPrice ?? DEFAULT_FEATURED.originalPrice),
        discountPct: first.discountPct ?? DEFAULT_FEATURED.discountPct,
        rating: first.rating ?? DEFAULT_FEATURED.rating,
        reviewsCount: first.reviewsCount ?? DEFAULT_FEATURED.reviewsCount,
        heroImage: first.screenshot || first.heroImage || DEFAULT_FEATURED.heroImage,
      });
    }
  }, [deals]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        seconds -= 1;
        if (seconds < 0) { seconds = 59; minutes -= 1; }
        if (minutes < 0) { minutes = 59; hours -= 1; }
        if (hours < 0) { hours = 23; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const discountPct = Math.round(((featured.originalPrice - featured.tier1Price) / (featured.originalPrice || 1)) * 100);

  return (
    <section className="w-full overflow-hidden" style={{ background: 'linear-gradient(135deg, #0A0F1E 0%, #0F1F4A 50%, #0A1628 100%)' }}>

      {/* LIVE TICKER BAR */}
      <div className="w-full py-2 overflow-hidden border-b border-orange-500/30" style={{ background: 'rgba(255,107,0,0.85)' }}>
        <div className="flex items-center gap-4 px-4">
          <span className="shrink-0 flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            LIVE
          </span>
          <div className="overflow-hidden flex-1">
            <div className="flex items-center gap-8 whitespace-nowrap" style={{ animation: 'sdTicker 30s linear infinite' }}>
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((p, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 text-[11px] font-medium shrink-0 text-white/90">
                  <span className="text-sm">🛍️</span>
                  <span className="font-black text-white">{p.name}</span>
                  <span className="text-white/70">from {p.city} just bought</span>
                  <span className="font-black text-white bg-white/20 px-2 py-0.5 rounded">{p.deal}</span>
                  <span className="text-white/50 text-[10px]">· {p.time}</span>
                </span>
              ))}
            </div>
          </div>
          <Link href="/plus" className="shrink-0 hidden sm:flex items-center gap-1 bg-white text-orange-600 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider hover:bg-white/90 transition-colors whitespace-nowrap">
            👑 PLUS — 10% OFF
          </Link>
        </div>
      </div>

      {/* HERO CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

        {/* LEFT SIDE */}
        <div className="text-left space-y-6">

          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-orange-500 text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              <Zap className="w-3 h-3" />
              India's #1 SaaS Deal Platform
            </span>
            <span className="inline-flex items-center gap-1.5 text-white/80 text-[11px] font-bold px-3 py-1 rounded-full border border-white/20" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              500+ deals live
            </span>
          </div>

          <div>
            <h1 className="text-[34px] sm:text-[50px] leading-[1.05] font-extrabold tracking-[-1.5px] text-white mb-4">
              Premium SaaS Tools.{' '}
              <span style={{ background: 'linear-gradient(90deg, #FF6B00, #FFB800)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', display: 'inline' }}>
                One-Time INR Pay.
              </span>
            </h1>
            <p className="text-[16px] sm:text-[17px] leading-relaxed max-w-[500px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Stop paying monthly dollar subscriptions. Get 5-Year SaaS access via UPI, with official GST invoice for your agency.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {[
              { icon: <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />, text: '60-day unconditional money-back guarantee' },
              { icon: <Tag className="w-4 h-4 shrink-0" style={{ color: '#FFB800' }} />, text: '18% GST invoice — file ITC for your agency' },
              { icon: <Star className="w-4 h-4 text-orange-400 shrink-0" />, text: 'Pay via UPI, PhonePe, Google Pay, Cards' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                {item.icon}
                <span className="text-[13px] font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>{item.text}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-wrap pt-2">
            <Link
              href="/deals"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-[14px] font-black text-slate-950 transition-all hover:scale-105 active:scale-100"
              style={{ background: 'linear-gradient(135deg, #FFB800, #FF8C00)', boxShadow: '0 8px 30px rgba(255,184,0,0.35)' }}
            >
              Browse All Deals
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#featured-deals"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-[14px] font-black text-white border border-white/20 hover:bg-white/10 transition-all"
            >
              Today's Picks 🔥
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
            {TRUST_STATS.map((stat, i) => (
              <div key={i} className="flex flex-col items-start gap-0.5">
                <span className="text-[18px]">{stat.icon}</span>
                <span className="text-[16px] font-black text-white">{stat.value}</span>
                <span className="text-[10px] font-medium leading-tight" style={{ color: 'rgba(255,255,255,0.45)' }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE — Featured Deal Card */}
        <div className="flex flex-col gap-4">

          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-white/80 text-[11px] font-black px-3 py-1.5 rounded-full border border-white/20 uppercase tracking-widest" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <TrendingUp className="w-3 h-3 text-orange-400" />
              Featured Deal
            </span>
            <span className="inline-flex items-center gap-1.5 text-red-300 text-[11px] font-black px-3 py-1 rounded-full border border-red-500/30" style={{ background: 'rgba(239,68,68,0.15)' }}>
              <Clock className="w-3 h-3" />
              {mounted
                ? `${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')} left`
                : '11:47:23 left'}
            </span>
          </div>

          {/* Glass Deal Card */}
          <Link
            href={`/deals/${featured.slug}`}
            className="group block rounded-2xl overflow-hidden transition-all hover:scale-[1.02] cursor-pointer"
            style={{
              background: 'rgba(255,255,255,0.07)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            <div className="relative w-full overflow-hidden" style={{ height: '200px' }}>
              <img
                src={featured.heroImage}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                style={{ opacity: 0.8 }}
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?q=80&w=1000&auto=format&fit=crop'; }}
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider">{discountPct}% OFF</span>
                <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider">{featured.badge}</span>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className="flex items-center gap-1 text-amber-300 text-[11px] font-black px-2.5 py-1 rounded-lg" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
                  🍦 {featured.rating} <span className="font-normal" style={{ color: 'rgba(255,255,255,0.5)' }}>({featured.reviewsCount} reviews)</span>
                </span>
              </div>
            </div>

            <div className="p-5 space-y-3">
              <h2 className="text-[15px] font-black text-white leading-snug line-clamp-2 group-hover:text-amber-300 transition-colors">
                {featured.title}
              </h2>
              <p className="text-[12px] leading-relaxed line-clamp-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {featured.tagline}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div className="flex items-baseline gap-2">
                  <span className="text-[24px] font-black text-white">₹{Number(featured.tier1Price).toLocaleString('en-IN')}</span>
                  <span className="text-[13px] line-through" style={{ color: 'rgba(255,255,255,0.35)' }}>₹{Number(featured.originalPrice).toLocaleString('en-IN')}</span>
                  <span className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>/ 5-Year</span>
                </div>
                <span
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-[12px] font-black text-slate-950 transition-all group-hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #FFB800, #FF8C00)' }}
                >
                  Get Deal <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </Link>

          {/* Mini deal row */}
          {deals.length > 1 && (
            <div className="grid grid-cols-3 gap-2">
              {deals.slice(1, 4).map((deal, i) => (
                <Link
                  key={deal.slug || i}
                  href={`/deals/${deal.slug}`}
                  className="group flex flex-col gap-1.5 rounded-xl p-3 transition-all hover:scale-105 cursor-pointer"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.10)',
                  }}
                >
                  <img
                    src={deal.screenshot || deal.heroImage || `https://picsum.photos/seed/${deal.slug}/80/50`}
                    alt={deal.title}
                    className="w-full h-10 object-cover rounded-lg transition-opacity"
                    style={{ opacity: 0.75 }}
                  />
                  <p className="text-[10px] font-bold text-white/80 leading-tight line-clamp-2 group-hover:text-white transition-colors">
                    {deal.title}
                  </p>
                  <span className="text-[11px] font-black" style={{ color: '#FFB800' }}>
                    ₹{Number(deal.tier1Price ?? deal.pricingTiers?.[0]?.price ?? 1999).toLocaleString('en-IN')}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes sdTicker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
