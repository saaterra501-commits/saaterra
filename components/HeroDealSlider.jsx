'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronRight, ChevronLeft, MessageSquare, Search, Users,
  BarChart3, ShoppingBag, Mail, Sparkles, Zap, ShieldCheck,
  TrendingUp, Award, Flame, CheckCircle2
} from 'lucide-react';

const CASHKARO_BANNERS = [
  {
    id: 'banner-chat-chacha',
    brand: 'Chat Chacha',
    brandBadge: 'Meta Cloud API',
    brandLogoText: 'Chat Chacha 💬',
    discount: '50-92% Off',
    subtitle: 'Across WhatsApp AI & Bots',
    cashbackText: 'Upto ₹22,000 Lifetime Savings',
    cashbackTag: 'SD',
    badgeColor: 'bg-[#002f7a]',
    gradient: 'from-[#0056D2] via-[#0066FF] to-[#0047BA]',
    accentColor: '#00D2FF',
    href: '/deals/chat-chacha',
    dealPrice: 1999,
    originalPrice: 24000,
    features: ['Auto Cart Recovery', 'Official Meta API', '18% GST Invoice'],
    category: 'WhatsApp Bots',
  },
  {
    id: 'banner-seo-radar',
    brand: 'AI SEO Radar',
    brandBadge: 'Google & Perplexity',
    brandLogoText: 'SEO Radar 🎯',
    discount: 'Upto 80% Off',
    subtitle: 'Across AI Keywords & Rankings',
    cashbackText: 'Upto ₹29,500 Lifetime Savings',
    cashbackTag: 'SD',
    badgeColor: 'bg-[#b33c00]',
    gradient: 'from-[#FF6600] via-[#FF7700] to-[#E65100]',
    accentColor: '#FFD000',
    href: '/deals/seo-rocket',
    dealPrice: 2499,
    originalPrice: 32000,
    features: ['Track Realtime SERPs', 'White-label Client PDF', '60-Day Refund'],
    category: 'AI & GEO SEO',
  },
  {
    id: 'banner-geo-citation',
    brand: 'GEO AI Suite',
    brandBadge: 'Generative Search',
    brandLogoText: 'GEO Suite ✨',
    discount: 'Upto 90% Off',
    subtitle: 'On LLM Brand Citations & Audits',
    cashbackText: '18% GST Input Tax Credit',
    cashbackTag: 'SD',
    badgeColor: 'bg-[#005f73]',
    gradient: 'from-[#00B4D8] via-[#0096C7] to-[#0077B6]',
    accentColor: '#80FFDB',
    href: '/deals/geo-citation',
    dealPrice: 3499,
    originalPrice: 42000,
    features: ['Audit ChatGPT & Gemini', 'Citation Scorecard', '5-Year Updates'],
    category: 'AI & GEO SEO',
  },
  {
    id: 'banner-lead-scraper',
    brand: 'LeadPilot Pro',
    brandBadge: 'B2B Growth Engine',
    brandLogoText: 'LeadPilot 🚀',
    discount: 'Flat 85% Off',
    subtitle: 'On Verified B2B Lead Scrapers',
    cashbackText: 'Instant UPI Key Activation',
    cashbackTag: 'SD',
    badgeColor: 'bg-[#4c1d95]',
    gradient: 'from-[#7C3AED] via-[#8B5CF6] to-[#6D28D9]',
    accentColor: '#E9D5FF',
    href: '/deals',
    dealPrice: 1499,
    originalPrice: 9999,
    features: ['Verified Mobile & Email', 'LinkedIn Sales Sync', 'Export to CSV'],
    category: 'Lead Scrapers',
  },
  {
    id: 'banner-mega-clearance',
    brand: 'StackDeal Mega',
    brandBadge: 'Limited Time Drops',
    brandLogoText: 'Mega Drop 🔥',
    discount: 'Min 90% Off',
    subtitle: 'Across All 5-Year SaaS Passes',
    cashbackText: 'Zero Monthly Dollar Bills',
    cashbackTag: 'SD',
    badgeColor: 'bg-[#7f1d1d]',
    gradient: 'from-[#DC2626] via-[#EF4444] to-[#B91C1C]',
    accentColor: '#FEE2E2',
    href: '/deals',
    dealPrice: 999,
    originalPrice: 15000,
    features: ['100% Indian Founders', 'Instant License Key', 'Money Back Guarantee'],
    category: 'All',
  },
];

const TOP_CATEGORIES = [
  {
    id: 'most-popular',
    name: 'Most Popular',
    categoryKey: 'All',
    isSpecialBadge: true,
    badgeType: 'most-popular',
  },
  {
    id: 'whatsapp-bots',
    name: 'WhatsApp Bots',
    categoryKey: 'WhatsApp Bots',
    icon: MessageSquare,
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    iconColor: 'text-emerald-600',
    accentBg: 'from-emerald-400 to-green-500',
    badge: 'Hot 🔥',
  },
  {
    id: 'ai-geo-seo',
    name: 'AI & GEO SEO',
    categoryKey: 'AI & GEO SEO',
    icon: Search,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
    accentBg: 'from-blue-400 to-indigo-500',
    badge: 'AI ✨',
  },
  {
    id: 'lead-scrapers',
    name: 'Lead Scrapers',
    categoryKey: 'Lead Scrapers',
    icon: Users,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    iconColor: 'text-amber-600',
    accentBg: 'from-amber-400 to-orange-500',
    badge: 'B2B',
  },
  {
    id: 'crm-sales',
    name: 'CRM & Sales',
    categoryKey: 'CRM & Sales',
    icon: BarChart3,
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    iconColor: 'text-purple-600',
    accentBg: 'from-purple-400 to-violet-500',
    badge: 'Scale',
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce',
    categoryKey: 'E-Commerce',
    icon: ShoppingBag,
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    iconColor: 'text-rose-600',
    accentBg: 'from-rose-400 to-pink-500',
    badge: 'Store',
  },
  {
    id: 'email-sms',
    name: 'Email & SMS',
    categoryKey: 'Email & SMS',
    icon: Mail,
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    iconColor: 'text-cyan-600',
    accentBg: 'from-cyan-400 to-teal-500',
    badge: 'Send',
  },
  {
    id: 'min-90-off',
    name: 'Min 90% Off',
    categoryKey: 'All',
    isSpecialBadge: true,
    badgeType: 'min-90',
  },
];

export default function HeroDealSlider({
  deals = [],
  onBuyClick,
  activeCat = 'All',
  onSelectCategory,
}) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Slim green strip ticker configuration
  const [stripConfig, setStripConfig] = useState({
    enabled: true,
    isSlim: true,
    items: [
      { text: '5-Year SaaS Passes', icon: '✓' },
      { text: 'One-Time Payment', icon: '⚡' },
      { text: 'Official 18% GST Invoices', icon: '★' },
      { text: '60-Day Money-Back Guarantee', icon: '🛡️' },
      { text: 'Instant UPI & Card Activation', icon: '₹' },
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

  // Update scroll arrow visibility
  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 20);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      return () => el.removeEventListener('scroll', checkScroll);
    }
  }, []);

  const scrollBy = (offset) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  // Auto scroll banners smoothly every 6 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 50) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
      }
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleCategoryClick = (catKey) => {
    if (onSelectCategory) {
      onSelectCategory(catKey);
    }
    const dealsSection = document.getElementById('deals-grid') || document.querySelector('main');
    if (dealsSection) {
      dealsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="cashkaro-style-hero bg-white border-b border-slate-100 select-none">
      
      {/* ── 1. SLIM ROTATED GREEN TICKER STRIP ── */}
      {stripConfig.enabled !== false && (
        <div
          className={`deal-strip w-[112%] -ml-[6%] ${
            stripConfig.isSlim !== false ? 'h-[20px] sm:h-[22px]' : 'h-[30px]'
          } bg-[#63f477] flex items-center overflow-hidden relative z-20 mt-[8px] sm:mt-[12px] shadow-2xs border-y border-emerald-400/40`}
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

      {/* ── 2. MULTI-CARD BANNER CAROUSEL (CashKaro Style) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-4 relative">
        <div
          className="relative group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          
          {/* Left Arrow Button */}
          {canScrollLeft && (
            <button
              onClick={() => scrollBy(-420)}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-slate-800 shadow-xl border border-slate-200/90 flex items-center justify-center hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all z-30 cursor-pointer absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2"
              aria-label="Previous Offer"
            >
              <ChevronLeft className="w-5 h-5 font-black text-slate-800" />
            </button>
          )}

          {/* Right Arrow Button (Matches the circular white button with chevron in user screenshot) */}
          <button
            onClick={() => scrollBy(420)}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-slate-800 shadow-xl border border-slate-200/90 flex items-center justify-center hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all z-30 cursor-pointer absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2"
            aria-label="Next Offer"
          >
            <ChevronRight className="w-5 h-5 font-black text-slate-800" />
          </button>

          {/* Scrollable Track */}
          <div
            ref={scrollRef}
            className="flex items-center gap-4 sm:gap-5 overflow-x-auto scroll-smooth scrollbar-none py-2 px-1"
          >
            {CASHKARO_BANNERS.map((banner) => (
              <Link
                key={banner.id}
                href={banner.href}
                className={`relative flex-shrink-0 w-[330px] sm:w-[380px] lg:w-[410px] h-[185px] sm:h-[205px] rounded-2xl sm:rounded-[22px] bg-gradient-to-r ${banner.gradient} p-5 sm:p-6 text-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between group/card cursor-pointer`}
              >
                {/* Background Pattern / Glow */}
                <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />

                {/* Top Row: Brand / Vendor Logo Text */}
                <div className="flex items-center justify-between z-10">
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-1.5 drop-shadow-xs">
                      {banner.brandLogoText}
                    </span>
                    <span className="text-[10px] font-extrabold bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full text-white/90">
                      {banner.brandBadge}
                    </span>
                  </div>
                </div>

                {/* Middle Row: Big Discount & Subtitle */}
                <div className="z-10 my-auto">
                  <h3 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-white tracking-tight leading-none drop-shadow-xs">
                    {banner.discount}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-white/90 mt-1.5 line-clamp-1 drop-shadow-2xs">
                    {banner.subtitle}
                  </p>
                </div>

                {/* Bottom Row: CashKaro Style Cashback / Deal Pill Badge */}
                <div className="z-10 flex items-center justify-between">
                  <div className={`inline-flex items-center gap-1.5 ${banner.badgeColor} text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs border border-white/15`}>
                    <span className="w-5 h-5 rounded bg-white text-slate-900 flex items-center justify-center text-[10px] font-black shrink-0">
                      {banner.cashbackTag}
                    </span>
                    <span className="font-extrabold text-[11px] sm:text-xs tracking-tight">
                      {banner.cashbackText}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-white/90 underline group-hover/card:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    View Deal →
                  </span>
                </div>

                {/* Right Side 3D Illustrated Cutout / Graphic (Matches the shoes, box, cosmetics in screenshot) */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-[120px] sm:w-[145px] h-[130px] sm:h-[150px] pointer-events-none flex items-center justify-center">
                  {banner.id === 'banner-chat-chacha' && (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="w-24 h-24 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 shadow-2xl flex flex-col items-center justify-center p-2 text-center transform rotate-6 group-hover/card:rotate-3 transition-transform">
                        <span className="text-3xl">💬</span>
                        <span className="text-[9px] font-black bg-[#25D366] text-white px-2 py-0.5 rounded-full mt-1">98% Open</span>
                      </div>
                      <div className="absolute -top-1 -right-1 w-10 h-10 rounded-full bg-[#25D366] border-2 border-white flex items-center justify-center text-white text-lg shadow-md animate-bounce">
                        ✓
                      </div>
                    </div>
                  )}

                  {banner.id === 'banner-seo-radar' && (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl flex flex-col items-center justify-center p-2 transform -rotate-6 group-hover/card:rotate-0 transition-transform">
                        <span className="text-3xl">🎯</span>
                        <span className="text-[9px] font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full mt-1">#1 Rank</span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-white text-amber-600 flex items-center justify-center text-lg font-black shadow-md">
                        📈
                      </div>
                    </div>
                  )}

                  {banner.id === 'banner-geo-citation' && (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl flex flex-col items-center justify-center p-2 transform rotate-3 group-hover/card:scale-105 transition-transform">
                        <span className="text-3xl">✨</span>
                        <span className="text-[9px] font-black bg-white text-blue-900 px-2 py-0.5 rounded-full mt-1">LLM Citations</span>
                      </div>
                      <div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-cyan-300 text-slate-900 flex items-center justify-center text-sm font-black shadow-md">
                        AI
                      </div>
                    </div>
                  )}

                  {banner.id === 'banner-lead-scraper' && (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl flex flex-col items-center justify-center p-2 transform rotate-6 group-hover/card:rotate-0 transition-transform">
                        <span className="text-3xl">🚀</span>
                        <span className="text-[9px] font-black bg-purple-300 text-purple-950 px-2 py-0.5 rounded-full mt-1">B2B Leads</span>
                      </div>
                    </div>
                  )}

                  {banner.id === 'banner-mega-clearance' && (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl flex flex-col items-center justify-center p-2 transform -rotate-3 group-hover/card:scale-105 transition-transform">
                        <span className="text-3xl">🎁</span>
                        <span className="text-[9px] font-black bg-yellow-300 text-red-950 px-2 py-0.5 rounded-full mt-1">5-Yr VIP</span>
                      </div>
                    </div>
                  )}
                </div>

              </Link>
            ))}
          </div>

        </div>
      </div>

      {/* ── 3. TOP CATEGORIES SECTION (Exact Re-creation of user's screenshot) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
        
        {/* Title */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Top Categories
          </h2>
          <span className="text-xs font-bold text-slate-400">
            Click to explore passes
          </span>
        </div>

        {/* Circular Category Buttons Track */}
        <div className="flex items-start gap-5 sm:gap-7 overflow-x-auto scrollbar-none pb-2 pt-1">
          {TOP_CATEGORIES.map((cat) => {
            const isSelected = activeCat === cat.categoryKey && !cat.badgeType;
            const Icon = cat.icon;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.categoryKey)}
                className="flex flex-col items-center flex-shrink-0 group cursor-pointer text-center focus:outline-hidden"
              >
                {/* ── 3A. Special "MOST POPULAR" Blue Circular Badge (Exact match to screenshot) ── */}
                {cat.badgeType === 'most-popular' && (
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-b from-[#0052cc] to-[#0066FF] border-2 border-blue-400 text-yellow-300 font-black text-center flex flex-col items-center justify-center shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all duration-200 ${
                    activeCat === 'All' ? 'ring-4 ring-blue-400/40 scale-105' : ''
                  }`}>
                    <span className="text-[11px] sm:text-[13px] leading-tight font-black tracking-tight drop-shadow-xs">
                      MOST
                    </span>
                    <span className="text-[12px] sm:text-[14px] leading-tight font-black tracking-tight text-white drop-shadow-xs">
                      POPULAR
                    </span>
                  </div>
                )}

                {/* ── 3B. Special "Min 90% Off" Red Circular Badge (Exact match to "Min 50% Cashback" in screenshot) ── */}
                {cat.badgeType === 'min-90' && (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white border-2 border-red-500 text-center flex flex-col items-center justify-center shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all duration-200">
                    <span className="text-[10px] sm:text-[11px] font-bold text-red-600 leading-tight">
                      Min
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-red-600 leading-none tracking-tighter">
                      90%
                    </span>
                    <span className="text-[9px] font-black uppercase text-red-500 tracking-wider">
                      Pass
                    </span>
                  </div>
                )}

                {/* ── 3C. Standard Category Circular Icons (WhatsApp, AI, SEO, CRM, etc.) ── */}
                {!cat.isSpecialBadge && (
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full ${cat.bgColor} border ${cat.borderColor} flex items-center justify-center shadow-2xs group-hover:scale-105 group-hover:shadow-md transition-all duration-200 relative overflow-hidden ${
                    isSelected ? 'ring-4 ring-blue-500/30 border-blue-600 scale-105' : ''
                  }`}>
                    {/* Subtle Radial Backlight */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-xs flex items-center justify-center group-hover:rotate-6 transition-transform">
                      {Icon && <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${cat.iconColor}`} />}
                    </div>

                    {/* Small category tag chip */}
                    <span className="absolute bottom-1.5 text-[8px] font-black px-1.5 py-0.2 rounded bg-white/90 text-slate-700 shadow-2xs">
                      {cat.badge}
                    </span>
                  </div>
                )}

                {/* Category Name Label */}
                <span className={`text-xs sm:text-[13px] font-bold mt-2.5 max-w-[85px] sm:max-w-[100px] truncate transition-colors ${
                  isSelected ? 'text-blue-600 font-black' : 'text-slate-700 group-hover:text-slate-950'
                }`}>
                  {cat.name}
                </span>

              </button>
            );
          })}
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
