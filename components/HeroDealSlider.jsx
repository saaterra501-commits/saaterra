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
    shortTitle: 'Chat Chacha AI',
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
    shortTitle: 'AI SEO Radar',
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
    shortTitle: 'GEO AI Suite',
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

const DURATION_MS = 8000; // 8 seconds per slide

export default function HeroDealSlider({ deals = [], onBuyClick }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fadeActive, setFadeActive] = useState(true);

  // Map dynamic deals from MongoDB/API with fallback
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

        const shortTitle = (d.title || defaultSlide.title).split('—')[0].split('-')[0].trim();

        return {
          id: d.slug || d.id || `deal-${idx}`,
          slug: d.slug || d.id,
          badge: d.badge || (idx === 0 ? '🔥 Bestseller Deal' : idx === 1 ? '⚡ Hot Deal' : '⭐ Popular Deal'),
          category: d.category || defaultSlide.category,
          rating: d.rating || 4.9,
          reviewsCount: d.reviewsCount || 40 + (idx * 5),
          shortTitle: shortTitle.length > 20 ? shortTitle.substring(0, 18) + '...' : shortTitle,
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
      { text: 'Instant PhonePe & UPI Activation', icon: '₹' },
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

  // Smooth slide transition
  const switchSlide = (nextIdx) => {
    setFadeActive(false);
    setProgress(0);
    setTimeout(() => {
      setCurrentSlide(nextIdx);
      setFadeActive(true);
    }, 220);
  };

  const showSlide = (idx) => {
    if (idx === currentSlide) return;
    let target = idx;
    if (target >= slides.length) target = 0;
    if (target < 0) target = slides.length - 1;
    switchSlide(target);
  };

  const nextSlide = () => showSlide((currentSlide + 1) % slides.length);
  const previousSlide = () => showSlide((currentSlide - 1 + slides.length) % slides.length);

  // PhonePe-style Progress Timer (fills continuously across duration, pauses on hover)
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    const intervalStep = 50; // update every 50ms
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (intervalStep / DURATION_MS) * 100;
        if (next >= 100) {
          switchSlide((currentSlide + 1) % slides.length);
          return 0;
        }
        return next;
      });
    }, intervalStep);

    return () => clearInterval(timer);
  }, [isPaused, currentSlide, slides.length]);

  const active = slides[currentSlide] || slides[0];

  return (
    <section
      className="phonepe-style-slider relative w-full overflow-hidden select-none"
      style={{
        background: 'radial-gradient(130% 130% at 80% 15%, #601fa8 0%, #3e1273 45%, #210745 80%, #120326 100%)',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── 1. SLIM ROTATED GREEN TICKER STRIP ── */}
      {stripConfig.enabled !== false && (
        <div
          className={`deal-strip w-[112%] -ml-[6%] ${
            stripConfig.isSlim !== false ? 'h-[20px] sm:h-[22px]' : 'h-[30px]'
          } bg-[#63f477] flex items-center overflow-hidden relative z-20 mt-[10px] sm:mt-[14px] shadow-xs border-y border-emerald-400/50`}
          style={{ transform: 'rotate(-2deg)' }}
        >
          <div className="strip-content flex items-center gap-[28px] sm:gap-[36px] whitespace-nowrap text-[10px] sm:text-[11px] font-black text-slate-950 animate-marquee tracking-wide">
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

      {/* ── Ambient Radial Glow ── */}
      <div className="absolute top-1/4 right-10 w-[500px] h-[500px] bg-gradient-to-br from-[#2ebbd1]/20 via-[#a855f7]/25 to-[#ffc700]/15 rounded-full blur-3xl pointer-events-none" />

      {/* ── 2. MAIN HERO SECTION ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-8 sm:pb-12 relative z-10">
        
        <div
          className="transition-all duration-300 ease-out"
          style={{
            opacity: fadeActive ? 1 : 0,
            transform: fadeActive ? 'scale(1) translateY(0)' : 'scale(0.99) translateY(6px)',
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* ── LEFT COLUMN: PHONEPE-STYLE VALUE PROP ── */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-5 text-white">
              
              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 bg-[#FFC700] text-slate-950 px-3.5 py-1 rounded-full text-xs font-black tracking-wide shadow-sm">
                  {active.badge}
                </span>

                <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-purple-100 px-3 py-1 rounded-full text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#2ebbd1] animate-pulse"></span>
                  {active.category}
                </span>

                <span className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/15 text-amber-300 px-2.5 py-1 rounded-full text-xs font-bold">
                  <Star className="w-3.5 h-3.5 text-[#FFC700] fill-[#FFC700]" />
                  {active.rating} ({active.reviewsCount} reviews)
                </span>
              </div>

              {/* Title */}
              <Link href={active.href} className="group block">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-[-1.5px] leading-[1.1] group-hover:text-amber-300 transition-colors">
                  {active.title}
                </h1>
              </Link>

              {/* Tagline */}
              <p className="text-base sm:text-lg text-purple-100/85 leading-[1.6] max-w-2xl font-normal">
                {active.description}
              </p>

              {/* Highlights */}
              <div className="space-y-2.5 py-1">
                {active.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-purple-50">
                    <div className="w-4 h-4 rounded-full bg-[#2ebbd1]/20 border border-[#2ebbd1] text-[#2ebbd1] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>

              {/* Price & Savings Display (PhonePe Gold & White) */}
              <div className="pt-2">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                    ₹{Number(active.price).toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-purple-200">
                    {active.accessText}
                  </span>
                  <span className="text-base sm:text-lg text-purple-300/60 line-through font-semibold">
                    ₹{Number(active.originalPrice).toLocaleString('en-IN')}
                  </span>
                  <span className="bg-[#FFC700] text-slate-950 text-xs font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                    {active.discountPct}% OFF
                  </span>
                </div>
                <p className="text-xs font-bold text-[#63f477] mt-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#63f477]" />
                  Instant lifetime savings of ₹{Number(active.originalPrice - active.price).toLocaleString('en-IN')} vs recurring billing
                </p>
              </div>

              {/* Action Buttons (PhonePe Capsule Style) */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <Link
                  href={active.href}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#FFC700] hover:bg-[#ffd700] active:scale-98 text-slate-950 font-black text-base rounded-full transition-all duration-150 shadow-[0_10px_25px_rgba(255,199,0,0.35)] cursor-pointer"
                >
                  <span>{active.buttonText}</span>
                  <ArrowRight className="w-4 h-4 font-black" />
                </Link>

                <Link
                  href={active.href}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 active:scale-98 border border-white/25 text-white font-bold text-sm rounded-full transition-all cursor-pointer backdrop-blur-sm"
                >
                  <span>View Details</span>
                  <ExternalLink className="w-3.5 h-3.5 text-purple-200" />
                </Link>
              </div>

              {/* Trust Features Strip */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs font-bold text-purple-200/80">
                <span className="inline-flex items-center gap-1.5 text-[#63f477]">
                  <ShieldCheck className="w-4 h-4 text-[#63f477]" />
                  60-Day Money-Back Guarantee
                </span>
                <span className="inline-flex items-center gap-1.5 text-[#2ebbd1]">
                  <Tag className="w-4 h-4 text-[#2ebbd1]" />
                  18% GST Input Tax Credit
                </span>
                <span className="inline-flex items-center gap-1.5 text-amber-300">
                  <Zap className="w-4 h-4 text-[#FFC700]" />
                  PhonePe / UPI 1-Click Buy
                </span>
              </div>

            </div>

            {/* ── RIGHT COLUMN: PHONEPE APP / MOCKUP SHOWCASE ── */}
            <div className="lg:col-span-5 relative">
              <Link href={active.href} className="group block relative">
                
                {/* Outer Glass Card */}
                <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden group-hover:border-white/40 transition-all duration-300 group-hover:-translate-y-1">
                  
                  {/* Floating Pill: Instant UPI Verified */}
                  <div className="absolute top-6 right-6 z-20 bg-slate-950/90 text-white text-[11px] font-black px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-[#63f477]"></span>
                    Instant UPI Key Delivery
                  </div>

                  {/* Window Bar */}
                  <div className="bg-slate-950/40 backdrop-blur-md rounded-t-2xl px-4 py-2 border-b border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                    </div>
                    <span className="text-[10px] font-mono text-purple-200/70 truncate max-w-[180px]">
                      stackdeal.in/deals/{active.slug}
                    </span>
                    <div className="w-3"></div>
                  </div>

                  {/* Main Product Image */}
                  <div className="h-[270px] sm:h-[340px] w-full rounded-b-2xl overflow-hidden relative bg-slate-950/50">
                    <img
                      src={active.image}
                      alt={active.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop';
                      }}
                    />

                    {/* Bottom Gradient Overlay on Image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                      <div className="flex items-center justify-between w-full text-xs font-bold text-white">
                        <span className="flex items-center gap-1.5 text-amber-300">
                          <Sparkles className="w-3.5 h-3.5 text-[#FFC700]" />
                          Verified 5-Year Pass
                        </span>
                        <span className="text-[#2ebbd1] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                          Explore Deal →
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </Link>
            </div>

          </div>
        </div>

        {/* ── 3. PHONEPE-STYLE PROGRESS TABS & CONTROLS (Bottom) ── */}
        <div className="mt-8 sm:mt-12 pt-6 border-t border-white/15 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Segmented Progress Tabs */}
          <div className="flex items-center gap-3 overflow-x-auto max-w-full pb-1 scrollbar-none w-full md:w-auto">
            {slides.map((s, idx) => {
              const isActive = idx === currentSlide;

              return (
                <button
                  key={s.id || idx}
                  onClick={() => showSlide(idx)}
                  className={`relative flex flex-col text-left py-2 px-3.5 rounded-2xl transition-all duration-200 cursor-pointer overflow-hidden border shrink-0 ${
                    isActive
                      ? 'bg-white/15 border-white/30 text-white shadow-md'
                      : 'bg-white/5 border-white/10 text-purple-200/70 hover:bg-white/10 hover:text-white'
                  }`}
                  style={{ minWidth: '160px' }}
                >
                  <div className="flex items-center justify-between gap-2 w-full mb-1.5">
                    <span className="text-[11px] font-black uppercase tracking-wider">
                      {`0${idx + 1}`} {s.shortTitle}
                    </span>
                    <span className={`text-[10px] font-extrabold ${isActive ? 'text-[#FFC700]' : 'text-purple-300/60'}`}>
                      ₹{Number(s.price).toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Progress Line Bar */}
                  <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-[#FFC700] rounded-full transition-all"
                      style={{
                        width: isActive ? `${progress}%` : idx < currentSlide ? '100%' : '0%',
                        transition: isActive ? 'width 50ms linear' : 'none',
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Arrows & Counter */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-bold text-purple-200/70">
              Deal <span className="text-white font-black">{currentSlide + 1}</span> of {slides.length}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={previousSlide}
                className="w-9 h-9 rounded-full border border-white/20 bg-white/10 hover:bg-white hover:text-slate-950 text-white flex items-center justify-center transition-colors cursor-pointer backdrop-blur-sm shadow-xs"
                aria-label="Previous Deal"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={nextSlide}
                className="w-9 h-9 rounded-full border border-white/20 bg-white/10 hover:bg-white hover:text-slate-950 text-white flex items-center justify-center transition-colors cursor-pointer backdrop-blur-sm shadow-xs"
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
