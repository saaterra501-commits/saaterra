'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Tag, Zap, Star, Check, Sparkles, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

const DEFAULT_SLIDES = [
  {
    id: 'chat-chacha',
    slug: 'chat-chacha',
    badge: '🔥 Bestseller Deal',
    category: 'WhatsApp Bots',
    rating: 4.9,
    reviewsCount: 42,
    title: 'Chat Chacha — WhatsApp AI Marketing & Automation',
    description: 'Recover abandoned carts, broadcast bulk offers, and automate 24/7 customer support with Meta Cloud API. Pay once in INR, zero monthly dollar bills.',
    highlights: [
      'Official Meta Cloud API verified setup & template approvals',
      'Automate cart recovery messages with 98% open rates',
      'Official 18% GST tax invoice & 60-day refund guarantee',
    ],
    price: 1999,
    originalPrice: 24000,
    discountPct: 92,
    accessText: '/ 5-Year Access',
    buttonText: 'Get This Deal',
    href: '/deals/chat-chacha',
    image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'seo-rocket',
    slug: 'seo-rocket',
    badge: '⚡ Hot Deal',
    category: 'AI & GEO SEO',
    rating: 4.8,
    reviewsCount: 38,
    title: 'AI Keyword & Competitor Radar',
    description: 'Track local Indian agency rankings, discover high-intent keywords, and automate client SEO audits without expensive monthly recurring subscriptions.',
    highlights: [
      'Track Google & AI engine rankings in real time',
      'Automated white-label client PDF audit reports',
      'Full API webhook integrations with WordPress & Webflow',
    ],
    price: 2499,
    originalPrice: 32000,
    discountPct: 92,
    accessText: '/ 5-Year Access',
    buttonText: 'Explore Deal',
    href: '/deals/seo-rocket',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'geo-citation',
    slug: 'geo-citation',
    badge: '⭐ Most Popular',
    category: 'Generative Search',
    rating: 4.9,
    reviewsCount: 51,
    title: 'Generative Engine Optimization (GEO) Suite',
    description: 'Audit AI search presence across ChatGPT, Perplexity and Gemini. Generate white-label client reports and dominate conversational search results.',
    highlights: [
      'Generative Engine Optimization (GEO) auditing suite',
      'Monitor brand sentiment across all major LLMs',
      '5-Year Pass including all future model updates',
    ],
    price: 3499,
    originalPrice: 42000,
    discountPct: 91,
    accessText: '/ 5-Year Access',
    buttonText: 'View Deal',
    href: '/deals/geo-citation',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
  },
];

export default function HeroDealSlider({ deals = [], onBuyClick }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [fadeActive, setFadeActive] = useState(true);
  const fadeTimeoutRef = useRef(null);

  // Map dynamic deals from MongoDB/API with graceful fallback
  const slides = (deals && deals.length > 0)
    ? deals.slice(0, 6).map((d, idx) => {
        const starterTier = d.pricingTiers && d.pricingTiers.length > 0 ? d.pricingTiers[0] : null;
        const price = Number(d.tier1Price ?? starterTier?.price ?? d.price ?? 1999);
        const originalPrice = Number(d.originalPrice ?? starterTier?.originalPrice ?? (price * 8));
        const discountPct = Number(d.discountPct ?? Math.round(((originalPrice - price) / (originalPrice || 1)) * 100));
        const defaultSlide = DEFAULT_SLIDES[idx % DEFAULT_SLIDES.length];

        const highlights = Array.isArray(d.tldr) && d.tldr.length > 0
          ? d.tldr.slice(0, 3)
          : defaultSlide.highlights;

        return {
          id: d.slug || d.id || `deal-${idx}`,
          slug: d.slug || d.id,
          badge: d.badge || (idx === 0 ? '🔥 Bestseller Deal' : idx === 1 ? '⚡ Hot Deal' : '⭐ Popular Deal'),
          category: d.category || defaultSlide.category,
          rating: d.rating || 4.9,
          reviewsCount: d.reviewsCount || 40 + (idx * 5),
          title: d.title || defaultSlide.title,
          description: d.tagline || defaultSlide.description,
          highlights,
          price,
          originalPrice,
          discountPct,
          accessText: '/ 5-Year Access',
          buttonText: idx === 0 ? 'Get This Deal' : 'Explore Deal',
          href: `/deals/${d.slug || d.id}`,
          image: d.heroImage || d.screenshot || defaultSlide.image,
          rawDeal: d,
        };
      })
    : DEFAULT_SLIDES;

  // Slim green strip ticker configuration
  const [stripConfig, setStripConfig] = useState({
    enabled: true,
    isSlim: true,
    items: [
      { text: '5-Year SaaS Passes', icon: '✓' },
      { text: 'One-Time Payment', icon: '⚡' },
      { text: 'Official 18% GST Invoices', icon: '★' },
      { text: '60-Day Money-Back Guarantee', icon: '🛡️' },
      { text: 'No Monthly Subscriptions', icon: '%' },
    ],
  });

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch('/api/site-config');
        if (!res.ok) return;
        const data = await res.json();
        if (data?.success && data?.config?.greenStrip) {
          setStripConfig((prev) => ({ ...prev, ...data.config.greenStrip }));
        }
      } catch (e) {}
    }
    loadConfig();
  }, []);

  // Smooth Full Screen Fade transition helper
  const triggerFadeTo = (nextIdx) => {
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    setFadeActive(false);
    fadeTimeoutRef.current = setTimeout(() => {
      setCurrentSlide(nextIdx);
      setFadeActive(true);
    }, 280);
  };

  const showSlide = (idx) => {
    if (idx === currentSlide) return;
    let target = idx;
    if (target >= slides.length) target = 0;
    if (target < 0) target = slides.length - 1;
    triggerFadeTo(target);
  };

  const nextSlide = () => showSlide(currentSlide + 1);
  const previousSlide = () => showSlide(currentSlide - 1);

  // Auto-advance interval set to 8 seconds (8000ms) with silent hover-pause
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const interval = setInterval(() => {
      triggerFadeTo((currentSlide + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [isPaused, currentSlide, slides.length]);

  const active = slides[currentSlide] || slides[0];

  return (
    <section
      className="stackdeal-fullscreen-slider relative w-full overflow-hidden select-none"
      style={{
        background: 'radial-gradient(120% 120% at 50% 0%, #ffffff 0%, #f7faff 45%, #eefcf5 100%)',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── 1. SLIM ROTATED GREEN TICKER STRIP ── */}
      {stripConfig.enabled !== false && (
        <div
          className={`deal-strip w-[112%] -ml-[6%] ${
            stripConfig.isSlim !== false ? 'h-[20px] sm:h-[22px]' : 'h-[30px]'
          } bg-[#63f477] flex items-center overflow-hidden relative z-20 mt-[10px] sm:mt-[14px] shadow-xs border-y border-emerald-400/40`}
          style={{ transform: 'rotate(-2deg)' }}
        >
          <div className="strip-content flex items-center gap-[28px] sm:gap-[36px] whitespace-nowrap text-[10px] sm:text-[11px] font-extrabold text-slate-950 animate-marquee tracking-wide">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="flex items-center gap-[28px] sm:gap-[36px] shrink-0">
                {(stripConfig.items || []).map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-center gap-[6px] sm:gap-[8px]">
                    <span>{item.text}</span>
                    <span className="w-[14px] h-[14px] rounded-full bg-slate-950 text-white flex items-center justify-center text-[8px] font-black shrink-0">
                      {item.icon || '✓'}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 2. FULL SCREEN FADING HERO WRAPPER ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-10 sm:pb-14 relative">
        
        <div
          className="transition-all duration-300 ease-out"
          style={{
            opacity: fadeActive ? 1 : 0,
            transform: fadeActive ? 'scale(1) translateY(0)' : 'scale(0.99) translateY(8px)',
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* ── LEFT COLUMN: DEAL HEADLINE & PURCHASE CONTROLS (7 Cols) ── */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
              
              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 bg-slate-950 text-white px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide shadow-xs">
                  {active.badge}
                </span>

                <span className="inline-flex items-center gap-1 bg-white border border-slate-200/90 text-slate-800 px-3 py-1 rounded-full text-xs font-bold shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {active.category}
                </span>

                <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200/70 text-amber-900 px-2.5 py-1 rounded-full text-xs font-extrabold">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  {active.rating} ({active.reviewsCount} verified reviews)
                </span>
              </div>

              {/* Main Title */}
              <Link href={active.href} className="group block">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-[-1.5px] leading-[1.08] group-hover:text-blue-600 transition-colors">
                  {active.title}
                </h1>
              </Link>

              {/* Tagline / Value Proposition */}
              <p className="text-base sm:text-lg text-slate-600 leading-[1.6] max-w-2xl font-normal">
                {active.description}
              </p>

              {/* 3 Key Benefit Bullets */}
              <div className="space-y-2 py-1">
                {active.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-slate-800">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>

              {/* Price & Savings Display */}
              <div className="pt-2">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
                    ₹{Number(active.price).toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-slate-500">
                    {active.accessText}
                  </span>
                  <span className="text-base sm:text-lg text-slate-400 line-through font-semibold">
                    ₹{Number(active.originalPrice).toLocaleString('en-IN')}
                  </span>
                  <span className="bg-red-50 text-red-600 border border-red-200/80 text-xs font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
                    {active.discountPct}% OFF
                  </span>
                </div>
                <p className="text-[11px] font-bold text-emerald-700 mt-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  Instant saving of ₹{Number(active.originalPrice - active.price).toLocaleString('en-IN')} vs recurring monthly bills
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <Link
                  href={active.href}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FFC700] hover:bg-[#e6b300] text-slate-950 font-black text-base rounded-xl transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(255,199,0,0.4)] active:translate-y-0 cursor-pointer"
                >
                  <span>{active.buttonText}</span>
                  <ArrowRight className="w-4 h-4 font-black" />
                </Link>

                <Link
                  href={active.href}
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200/90 hover:border-slate-400 text-slate-800 font-bold text-sm rounded-xl transition-all hover:bg-slate-50 cursor-pointer shadow-xs"
                >
                  <span>View Details & Tiers</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </div>

              {/* Trust Features Strip */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs font-bold text-slate-500">
                <span className="inline-flex items-center gap-1.5 text-emerald-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  60-Day Money-Back Guarantee
                </span>
                <span className="inline-flex items-center gap-1.5 text-blue-700">
                  <Tag className="w-4 h-4 text-blue-600" />
                  B2B 18% GST Invoice
                </span>
                <span className="inline-flex items-center gap-1.5 text-slate-700">
                  <Zap className="w-4 h-4 text-amber-500" />
                  UPI, Cards & NetBanking
                </span>
              </div>

            </div>

            {/* ── RIGHT COLUMN: FULL-SCREEN SOFTWARE MOCKUP (5 Cols) ── */}
            <div className="lg:col-span-5 relative">
              <Link href={active.href} className="group block relative">
                {/* Glow Backdrop */}
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-amber-500/10 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity"></div>

                {/* Device/Browser Window Container */}
                <div className="relative bg-white rounded-2xl border border-slate-200/90 shadow-2xl overflow-hidden group-hover:border-slate-300 transition-all duration-300 group-hover:-translate-y-1">
                  
                  {/* Browser Bar */}
                  <div className="bg-slate-100/90 px-4 py-2.5 border-b border-slate-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                    </div>
                    <span className="text-[11px] font-mono font-medium text-slate-400 truncate max-w-[200px]">
                      stackdeal.in/deals/{active.slug}
                    </span>
                    <div className="w-3"></div>
                  </div>

                  {/* Software Graphic Preview */}
                  <div className="h-[280px] sm:h-[350px] w-full bg-slate-900/5 overflow-hidden flex items-center justify-center p-2">
                    <img
                      src={active.image}
                      alt={active.title}
                      className="w-full h-full object-cover rounded-lg group-hover:scale-102 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop';
                      }}
                    />
                  </div>

                  {/* Bottom Ribbon */}
                  <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#FFC700]" />
                      Verified Indian Founder Pass
                    </span>
                    <span className="text-blue-600 group-hover:underline flex items-center gap-1">
                      See Live Demo →
                    </span>
                  </div>

                </div>
              </Link>
            </div>

          </div>
        </div>

        {/* ── 3. BOTTOM CONTROLS & DEAL PILLS ── */}
        <div className="mt-8 sm:mt-12 pt-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Slide Pill Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 scrollbar-none">
            {slides.map((s, idx) => (
              <button
                key={s.id || idx}
                onClick={() => showSlide(idx)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 border shrink-0 ${
                  idx === currentSlide
                    ? 'bg-slate-950 text-white border-slate-950 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${idx === currentSlide ? 'bg-[#FFC700]' : 'bg-slate-300'}`} />
                <span className="truncate max-w-[140px] sm:max-w-[180px]">{s.title.split('—')[0].trim()}</span>
                <span className={`text-[10px] font-black ${idx === currentSlide ? 'text-amber-300' : 'text-slate-400'}`}>
                  ₹{Number(s.price).toLocaleString('en-IN')}
                </span>
              </button>
            ))}
          </div>

          {/* Navigation Arrows & Counter */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-bold text-slate-400">
              Deal <span className="text-slate-900 font-black">{currentSlide + 1}</span> of {slides.length}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={previousSlide}
                className="w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-slate-950 hover:text-white text-slate-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                aria-label="Previous Deal"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={nextSlide}
                className="w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-slate-950 hover:text-white text-slate-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                aria-label="Next Deal"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>

      <style jsx>{`
        @keyframes scrollStrip {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: scrollStrip 22s linear infinite;
        }
      `}</style>
    </section>
  );
}
