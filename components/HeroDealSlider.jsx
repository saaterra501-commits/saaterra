'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Tag, Clock, ShieldCheck, Star } from 'lucide-react';

const DEFAULT_SLIDES = [
  {
    id: 'slide-1',
    badge: '🔥 Featured Deal',
    title: 'Run Your Ecommerce Store Without Plugins',
    description: 'Powerful tools for businesses, startups and agencies. Get long-term SaaS access with a simple one-time payment.',
    price: 999,
    originalPrice: 4999,
    discountPct: 80,
    accessText: '/ 5-Year Access',
    buttonText: 'Get This Deal',
    href: '/deals/run-your-ecommerce-store-without-plugins',
    image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'slide-2',
    badge: '🚀 New Drop',
    title: 'Powerful SaaS Tools For Your Business',
    description: 'Discover useful software for marketing, automation, sales, AI and productivity without recurring bills.',
    price: 1499,
    originalPrice: 6999,
    discountPct: 79,
    accessText: '/ 5-Year Access',
    buttonText: 'Explore Deal',
    href: '/deals',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'slide-3',
    badge: '⭐ Most Popular',
    title: 'One Payment. 5 Years of SaaS Access.',
    description: 'Find the software your business needs without expensive recurring dollar subscriptions.',
    price: 799,
    originalPrice: 3999,
    discountPct: 80,
    accessText: '/ 5-Year Access',
    buttonText: 'View All Deals',
    href: '/deals',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
  },
];

export default function HeroDealSlider({ deals = [], onBuyClick }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);

  // Map live deals to slides
  const slides = (deals && deals.length > 0)
    ? deals.slice(0, 6).map((d, idx) => {
        const starterTier = d.pricingTiers && d.pricingTiers.length > 0 ? d.pricingTiers[0] : null;
        const price = Number(d.tier1Price ?? starterTier?.price ?? d.price ?? 999);
        const originalPrice = Number(d.originalPrice ?? starterTier?.originalPrice ?? (price * 5));
        const discountPct = Math.round(((originalPrice - price) / (originalPrice || 1)) * 100);
        const defaultSlide = DEFAULT_SLIDES[idx % DEFAULT_SLIDES.length];

        return {
          id: d.slug || d.id || `slide-${idx}`,
          badge: idx === 0 ? '🔥 Featured Deal' : idx === 1 ? '🚀 New Drop' : '⭐ Most Popular',
          title: d.title || defaultSlide.title,
          description: d.tagline || defaultSlide.description,
          price,
          originalPrice,
          discountPct,
          accessText: '/ 5-Year Access',
          buttonText: idx === 0 ? 'Get This Deal' : 'Explore Deal',
          href: `/deals/${d.slug}`,
          image: d.screenshot || d.heroImage || defaultSlide.image,
          slug: d.slug,
          dealObj: d,
        };
      })
    : DEFAULT_SLIDES;

  // Right side: show up to 3 OTHER deals (not the active one)
  const sideDeals = slides.filter((_, i) => i !== currentSlide).slice(0, 3);

  const [stripConfig, setStripConfig] = useState({
    enabled: true,
    isSlim: true,
    items: [
      { text: '5-Year Access', icon: '✓' },
      { text: 'One-Time Payment', icon: '⚡' },
      { text: 'Business Deals', icon: '★' },
      { text: 'Save More', icon: '%' },
    ],
  });

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch('/api/site-config');
        if (!res.ok) return;
        const data = await res.json();
        if (data?.success && data?.config?.greenStrip) {
          setStripConfig(data.config.greenStrip);
        }
      } catch (e) {}
    }
    loadConfig();
  }, []);

  // Auto advance with fade
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const interval = setInterval(() => {
      triggerFadeSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const triggerFadeSlide = (getNext) => {
    setFadeIn(false);
    setTimeout(() => {
      setCurrentSlide((prev) => {
        const next = typeof getNext === 'function' ? getNext(prev) : getNext;
        return next;
      });
      setFadeIn(true);
    }, 300);
  };

  const showSlide = (index) => {
    if (index === currentSlide) return;
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;
    triggerFadeSlide(() => index);
  };

  const nextSlide = () => showSlide(currentSlide + 1);
  const previousSlide = () => showSlide(currentSlide - 1);

  const slide = slides[currentSlide];

  return (
    <section
      className="stackdeal-slider relative w-full overflow-hidden select-none"
      style={{
        minHeight: '580px',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 45%, #d9ffe8 100%)',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── GREEN TOP STRIP ── */}
      {stripConfig.enabled !== false && (
        <div
          className={`deal-strip w-[110%] -ml-[5%] ${
            stripConfig.isSlim !== false ? 'h-[20px] sm:h-[22px]' : 'h-[32px] sm:h-[36px]'
          } bg-[#63f477] flex items-center overflow-hidden relative z-20 mt-[12px] sm:mt-[15px] shadow-xs`}
          style={{ transform: 'rotate(-3deg)' }}
        >
          <div className="strip-content flex items-center gap-[32px] sm:gap-[40px] whitespace-nowrap text-[10px] sm:text-[11px] font-bold text-[#111] animate-marquee tracking-wide">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="flex items-center gap-[32px] sm:gap-[40px] shrink-0">
                {(stripConfig.items || []).map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-center gap-[8px] sm:gap-[10px]">
                    <span>{item.text}</span>
                    <span className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] rounded-full bg-[#111] text-white flex items-center justify-center text-[8px] font-bold shrink-0">
                      {item.icon || '✓'}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT: LEFT FADE + RIGHT STATIC ── */}
      <div className="max-w-[1250px] mx-auto pt-[30px] sm:pt-[40px] px-[20px] sm:px-[30px] pb-[60px] sm:pb-[70px] grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-[30px] lg:gap-[50px] items-start">

        {/* ════ LEFT: FADING FEATURED DEAL ════ */}
        <div
          className="flex flex-col gap-5 transition-all duration-300"
          style={{ opacity: fadeIn ? 1 : 0, transform: fadeIn ? 'translateY(0)' : 'translateY(8px)' }}
        >
          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-[#111] text-white px-4 py-2 rounded-full text-[12px] font-bold w-fit">
            {slide.badge}
          </span>

          {/* Title */}
          <Link href={slide.href} className="group block">
            <h1 className="text-[30px] sm:text-[42px] leading-[1.1] font-extrabold tracking-[-1.2px] text-[#111] group-hover:text-slate-700 transition-colors">
              {slide.title}
            </h1>
          </Link>

          {/* Description */}
          <p className="text-[15px] sm:text-[17px] leading-[1.6] text-[#444] max-w-[560px]">
            {slide.description}
          </p>

          {/* Price Row */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[32px] sm:text-[36px] font-extrabold text-[#111]">
              ₹{Number(slide.price).toLocaleString('en-IN')}
            </span>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-[#555]">{slide.accessText}</span>
              <span className="text-[13px] text-[#999] line-through">
                ₹{Number(slide.originalPrice).toLocaleString('en-IN')}
              </span>
            </div>
            <span className="bg-red-100 text-red-600 text-[11px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
              {slide.discountPct}% OFF
            </span>
          </div>

          {/* Trust bullets */}
          <div className="flex flex-wrap gap-x-5 gap-y-1.5">
            {[
              { icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />, text: '60-Day Refund Guarantee' },
              { icon: <Tag className="w-3.5 h-3.5 text-blue-500 shrink-0" />, text: '18% GST Invoice' },
              { icon: <Star className="w-3.5 h-3.5 text-amber-500 shrink-0" />, text: 'UPI / Cards Accepted' },
            ].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 text-[12px] text-[#555] font-medium">
                {item.icon}
                {item.text}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3 flex-wrap pt-1">
            <Link
              href={slide.href}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#ffb900] hover:bg-[#e6a700] text-[#111] font-extrabold text-[14px] rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,184,0,0.4)] active:translate-y-0"
            >
              {slide.buttonText}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={slide.href}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 hover:border-slate-400 text-[#333] font-bold text-[14px] rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0"
            >
              View Details
            </Link>
          </div>

          {/* Slide Dots + Arrows */}
          <div className="flex items-center gap-2.5 pt-3">
            <button
              onClick={previousSlide}
              className="w-[34px] h-[34px] border border-[#ddd] bg-white hover:bg-[#111] hover:text-white rounded-full cursor-pointer text-[16px] flex items-center justify-center transition-colors shadow-xs"
              aria-label="Previous"
            >
              ←
            </button>

            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => showSlide(i)}
                className={`transition-all duration-300 cursor-pointer border-0 ${
                  i === currentSlide
                    ? 'w-[28px] h-[8px] rounded-[20px] bg-[#111]'
                    : 'w-[8px] h-[8px] rounded-full bg-[#ccc] hover:bg-[#888]'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}

            <button
              onClick={nextSlide}
              className="w-[34px] h-[34px] border border-[#ddd] bg-white hover:bg-[#111] hover:text-white rounded-full cursor-pointer text-[16px] flex items-center justify-center transition-colors shadow-xs"
              aria-label="Next"
            >
              →
            </button>

            <span className="text-[11px] text-[#bbb] font-medium ml-1">
              {currentSlide + 1} / {slides.length}
            </span>
          </div>
        </div>

        {/* ════ RIGHT: STATIC DEAL CARDS ════ */}
        <div className="flex flex-col gap-3 lg:pt-2">
          <p className="text-[11px] font-black text-[#999] uppercase tracking-widest mb-1">
            More Deals →
          </p>
          {sideDeals.map((d, i) => {
            const pct = Math.round(((d.originalPrice - d.price) / (d.originalPrice || 1)) * 100);
            return (
              <Link
                key={d.id || i}
                href={d.href || `/deals/${d.id}`}
                className="group flex gap-3 bg-white rounded-2xl border border-slate-100 hover:border-slate-300 p-3 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="w-[80px] h-[64px] rounded-xl overflow-hidden shrink-0 bg-slate-100">
                  <img
                    src={d.image}
                    alt={d.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 opacity-90"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?q=80&w=400&auto=format&fit=crop'; }}
                  />
                </div>

                {/* Info */}
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <span className="text-[10px] font-black text-[#FF6B35] uppercase tracking-wider">{d.badge}</span>
                    <p className="text-[12px] font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-[#FF6B35] transition-colors mt-0.5">
                      {d.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[14px] font-extrabold text-[#111]">
                      ₹{Number(d.price).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 line-through">
                      ₹{Number(d.originalPrice).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[9px] font-black bg-red-50 text-red-500 px-1.5 py-0.5 rounded">
                      {pct}% OFF
                    </span>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#FF6B35] transition-colors shrink-0 self-center" />
              </Link>
            );
          })}

          {/* View All Deals CTA */}
          <Link
            href="/deals"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[12px] font-black text-slate-600 hover:text-slate-900 transition-all mt-1"
          >
            View All Deals
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

      <style>{`
        @keyframes scrollStrip {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: scrollStrip 20s linear infinite;
        }
      `}</style>
    </section>
  );
}
