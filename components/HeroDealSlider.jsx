'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Tag, Zap, Star, Sparkles, ChevronRight } from 'lucide-react';

const DEFAULT_SLIDES = [
  {
    id: 'chat-chacha',
    slug: 'chat-chacha',
    badge: '🔥 Bestseller Deal',
    title: 'Chat Chacha — WhatsApp AI Marketing & Automation',
    description: 'Recover abandoned carts, broadcast bulk offers, and automate 24/7 customer support with Meta Cloud API. One-time payment, zero recurring bills.',
    price: 1999,
    originalPrice: 24000,
    discountPct: 92,
    accessText: '/ 5-Year Access',
    buttonText: 'Get This Deal',
    href: '/deals/chat-chacha',
    image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'seo-rocket',
    slug: 'seo-rocket',
    badge: '⚡ Hot Deal',
    title: 'AI Keyword & Competitor Radar',
    description: 'Track local Indian agency rankings, discover high-intent keywords, and automate client SEO audits without monthly subscription costs.',
    price: 2499,
    originalPrice: 32000,
    discountPct: 92,
    accessText: '/ 5-Year Access',
    buttonText: 'Explore Deal',
    href: '/deals/seo-rocket',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'geo-citation',
    slug: 'geo-citation',
    badge: '⭐ Most Popular',
    title: 'Generative Engine Optimization (GEO) Suite',
    description: 'Audit AI search presence across ChatGPT, Perplexity and Gemini. Generate white-label client reports and dominate conversational search.',
    price: 3499,
    originalPrice: 42000,
    discountPct: 91,
    accessText: '/ 5-Year Access',
    buttonText: 'View Deal',
    href: '/deals/geo-citation',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop',
  },
];

export default function HeroDealSlider({ deals = [], onBuyClick }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [fadeActive, setFadeActive] = useState(true);
  const fadeTimeoutRef = useRef(null);

  // Map dynamic deals from MongoDB/API with fallback
  const slides = (deals && deals.length > 0)
    ? deals.slice(0, 6).map((d, idx) => {
        const starterTier = d.pricingTiers && d.pricingTiers.length > 0 ? d.pricingTiers[0] : null;
        const price = Number(d.tier1Price ?? starterTier?.price ?? d.price ?? 1999);
        const originalPrice = Number(d.originalPrice ?? starterTier?.originalPrice ?? (price * 8));
        const discountPct = Number(d.discountPct ?? Math.round(((originalPrice - price) / (originalPrice || 1)) * 100));
        const defaultSlide = DEFAULT_SLIDES[idx % DEFAULT_SLIDES.length];

        return {
          id: d.slug || d.id || `deal-${idx}`,
          slug: d.slug || d.id,
          badge: d.badge || (idx === 0 ? '🔥 Featured Deal' : idx === 1 ? '🚀 New Drop' : '⭐ Popular Deal'),
          title: d.title || defaultSlide.title,
          description: d.tagline || defaultSlide.description,
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

  // Right side: show up to 3 OTHER deals from the list
  const sideDeals = slides.filter((_, i) => i !== currentSlide).slice(0, 3);

  // Slim green strip configuration
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

  // Smooth fade transition helper
  const triggerFadeTo = (nextIdx) => {
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    setFadeActive(false);
    fadeTimeoutRef.current = setTimeout(() => {
      setCurrentSlide(nextIdx);
      setFadeActive(true);
    }, 250);
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

  // Auto-advance interval set to 8 seconds (8000ms) for comfortable reading
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
      className="stackdeal-slider relative w-full overflow-hidden select-none"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f9fbfe 45%, #ecfdf5 100%)',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── 1. SLIM ROTATED GREEN STRIP ── */}
      {stripConfig.enabled !== false && (
        <div
          className={`deal-strip w-[112%] -ml-[6%] ${
            stripConfig.isSlim !== false ? 'h-[20px] sm:h-[22px]' : 'h-[30px]'
          } bg-[#63f477] flex items-center overflow-hidden relative z-20 mt-[10px] sm:mt-[14px] shadow-xs border-y border-emerald-400/40`}
          style={{ transform: 'rotate(-2.5deg)' }}
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

      {/* ── 2. MAIN HERO SECTION (Split Layout: Fade Left + Static Right) ── */}
      <div className="max-w-[1280px] mx-auto pt-[28px] sm:pt-[42px] px-4 sm:px-6 lg:px-8 pb-[45px] sm:pb-[55px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_390px] gap-8 lg:gap-12 items-start">
          
          {/* ── LEFT COLUMN: FADING FEATURED DEAL ── */}
          <div
            className="flex flex-col justify-between transition-all duration-300 ease-out"
            style={{
              opacity: fadeActive ? 1 : 0,
              transform: fadeActive ? 'translateY(0)' : 'translateY(6px)',
            }}
          >
            <div>
              {/* Badge & Rating Row */}
              <div className="flex items-center gap-3 flex-wrap mb-3.5">
                <span className="inline-flex items-center gap-1.5 bg-slate-950 text-white px-3.5 py-1.5 rounded-full text-[12px] font-black tracking-wide shadow-sm">
                  {active.badge}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  Verified Indian Vendor
                </span>
              </div>

              {/* Title */}
              <Link href={active.href} className="group block">
                <h1 className="text-[30px] sm:text-[44px] font-black text-slate-950 tracking-[-1.2px] leading-[1.12] mb-3 group-hover:text-blue-600 transition-colors">
                  {active.title}
                </h1>
              </Link>

              {/* Tagline / Description */}
              <p className="text-[15px] sm:text-[17px] text-slate-600 leading-[1.6] max-w-[620px] mb-5 font-normal">
                {active.description}
              </p>

              {/* Price & Savings Block */}
              <div className="flex items-center gap-3.5 flex-wrap mb-5">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[32px] sm:text-[40px] font-black text-slate-950 tracking-tight">
                    ₹{Number(active.price).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[13px] sm:text-[14px] font-extrabold text-slate-500">
                    {active.accessText}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[15px] text-slate-400 line-through font-semibold">
                    ₹{Number(active.originalPrice).toLocaleString('en-IN')}
                  </span>
                  <span className="bg-red-50 text-red-600 border border-red-200/80 text-[11px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {active.discountPct}% OFF
                  </span>
                </div>
              </div>

              {/* Trust & Guarantee Badges */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-6 text-[12px] text-slate-600 font-semibold border-t border-slate-200/60 pt-3.5">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  60-Day Money-Back Guarantee
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-blue-600 shrink-0" />
                  B2B 18% GST Tax Invoice
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                  Instant UPI Activation
                </span>
              </div>

              {/* CTA Action Buttons */}
              <div className="flex items-center gap-3.5 flex-wrap">
                <Link
                  href={active.href}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#FFC700] hover:bg-[#e6b300] text-slate-950 font-black text-[15px] rounded-xl transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(255,199,0,0.35)] active:translate-y-0 cursor-pointer"
                >
                  <span>{active.buttonText}</span>
                  <ArrowRight className="w-4 h-4 font-black" />
                </Link>

                <Link
                  href={active.href}
                  className="inline-flex items-center justify-center gap-1.5 px-6 py-3.5 bg-white border border-slate-200 hover:border-slate-400 text-slate-800 font-bold text-[14px] rounded-xl transition-all hover:bg-slate-50 cursor-pointer shadow-xs"
                >
                  <span>View Details</span>
                </Link>
              </div>
            </div>

            {/* Slider Navigation Dots & Arrows */}
            <div className="flex items-center gap-3 pt-6 mt-4">
              <button
                onClick={previousSlide}
                className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-950 hover:text-white text-slate-700 flex items-center justify-center transition-colors cursor-pointer text-sm font-black shadow-2xs"
                aria-label="Previous Slide"
              >
                ←
              </button>

              <div className="flex items-center gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => showSlide(i)}
                    className={`transition-all duration-300 cursor-pointer border-0 ${
                      i === currentSlide
                        ? 'w-7 h-2 rounded-full bg-slate-950'
                        : 'w-2 h-2 rounded-full bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-950 hover:text-white text-slate-700 flex items-center justify-center transition-colors cursor-pointer text-sm font-black shadow-2xs"
                aria-label="Next Slide"
              >
                →
              </button>

              <span className="text-[11px] font-bold text-slate-400 ml-1">
                {currentSlide + 1} / {slides.length}
              </span>
            </div>
          </div>

          {/* ── RIGHT COLUMN: STATIC DEAL CARDS (Always visible) ── */}
          <div className="flex flex-col gap-3 lg:border-l lg:border-slate-200/70 lg:pl-8">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                More Live Deals
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {slides.length} Available
              </span>
            </div>

            {/* Static Deal Mini Cards */}
            <div className="space-y-3">
              {sideDeals.map((deal, idx) => (
                <Link
                  key={deal.id || idx}
                  href={deal.href}
                  className="group flex items-center gap-3.5 bg-white border border-slate-200/80 hover:border-slate-400/80 rounded-2xl p-3 shadow-2xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                >
                  {/* Thumbnail Image */}
                  <div className="w-[74px] h-[64px] rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                    <img
                      src={deal.image}
                      alt={deal.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=300&auto=format&fit=crop';
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-wide">
                      {deal.badge}
                    </span>
                    <h3 className="text-[13px] font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mt-0.5">
                      {deal.title}
                    </h3>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[14px] font-black text-slate-950">
                        ₹{Number(deal.price).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] text-slate-400 line-through">
                        ₹{Number(deal.originalPrice).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[9px] font-black bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">
                        {deal.discountPct}% OFF
                      </span>
                    </div>
                  </div>

                  {/* Arrow Indicator */}
                  <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-slate-950 text-slate-400 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>

            {/* View All Deals Button */}
            <Link
              href="/deals"
              className="mt-1 w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-dashed border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-950 font-black text-[12px] rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Explore All 5-Year Passes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
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
