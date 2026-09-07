'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronRight, ChevronLeft, MessageSquare, Search, Sparkles,
  Users, BarChart3, CheckCircle2, Zap, ShieldCheck, ArrowRight
} from 'lucide-react';

const SOFTWARE_BANNERS = [
  {
    id: 'chat-chacha',
    softwareName: 'Chat Chacha',
    badgeText: 'META CLOUD API',
    badgeBg: 'bg-[#25D366] text-slate-950',
    iconColor: 'text-[#25D366]',
    icon: MessageSquare,
    discount: '50-92% Off',
    subtitle: 'WhatsApp AI Cart Recovery & Broadcasts',
    dealTag: 'SD',
    dealText: '₹1,999 / 5-Year Access Pass',
    pillBg: 'bg-[#002B7A]',
    gradient: 'from-[#0070F3] via-[#0056D2] to-[#003DB3]',
    href: '/deals/chat-chacha',
    techMockup: {
      type: 'chat',
      badge: '98% Open Rate',
      metric: 'Auto Recovery',
      image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=350&q=80',
    },
  },
  {
    id: 'seo-rocket',
    softwareName: 'AI SEO Radar',
    badgeText: 'GOOGLE & PERPLEXITY',
    badgeBg: 'bg-[#FFD000] text-slate-950',
    iconColor: 'text-[#FF7A00]',
    icon: Search,
    discount: 'Upto 80% Off',
    subtitle: 'Agency Keyword Tracking & SERP Audits',
    dealTag: 'SD',
    dealText: '18% GST Input Tax Credit',
    pillBg: 'bg-[#004080]',
    gradient: 'from-[#FF7A00] via-[#FF6600] to-[#E65100]',
    href: '/deals/seo-rocket',
    techMockup: {
      type: 'seo',
      badge: '#1 Indian Agency',
      metric: 'Realtime SERPs',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=350&q=80',
    },
  },
  {
    id: 'nuwatomic-geo',
    softwareName: 'Nuwatomic GEO',
    badgeText: 'CHATGPT & CLAUDE',
    badgeBg: 'bg-[#00897B] text-white',
    iconColor: 'text-white',
    icon: Sparkles,
    discount: 'Upto 90% Off',
    subtitle: 'Generative Engine (GEO) Brand Citations',
    dealTag: 'SD',
    dealText: '60-Day Money-Back Guarantee',
    pillBg: 'bg-[#003B6F]',
    gradient: 'from-[#D8FAF4] via-[#86E7D8] to-[#20C997]',
    textColor: 'text-slate-900',
    href: '/deals/nuwatomic-geo-seo',
    techMockup: {
      type: 'geo',
      badge: 'LLM Citations',
      metric: 'AI Audit Suite',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=350&q=80',
    },
  },
  {
    id: 'emailextractor-pro',
    softwareName: 'EmailExtractor Pro',
    badgeText: 'B2B LEAD FINDER',
    badgeBg: 'bg-[#E9D5FF] text-[#4C1D95]',
    iconColor: 'text-[#7C3AED]',
    icon: Users,
    discount: 'Flat 85% Off',
    subtitle: 'Google Maps & LinkedIn Verified Leads',
    dealTag: 'SD',
    dealText: 'Instant UPI Key Activation',
    pillBg: 'bg-[#4A0033]',
    gradient: 'from-[#7C3AED] via-[#6D28D9] to-[#4C1D95]',
    href: '/deals/emailextractor-pro-ai',
    techMockup: {
      type: 'leads',
      badge: '99% Deliverability',
      metric: 'B2B Verified',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=350&q=80',
    },
  },
  {
    id: 'omnisales-crm',
    softwareName: 'OmniSales CRM',
    badgeText: 'SALES PIPELINE',
    badgeBg: 'bg-[#004D40] text-white',
    iconColor: 'text-[#009688]',
    icon: BarChart3,
    discount: 'Upto 75% Off',
    subtitle: 'Omnichannel B2B CRM & WhatsApp Pipeline',
    dealTag: 'SD',
    dealText: 'Zero Monthly Subscriptions',
    pillBg: 'bg-[#002D33]',
    gradient: 'from-[#009688] via-[#00796B] to-[#004D40]',
    href: '/deals',
    techMockup: {
      type: 'crm',
      badge: 'Deal Closer',
      metric: 'Automation',
      image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=350&q=80',
    },
  },
];

const TOP_CATEGORIES = [
  {
    id: 'most-popular',
    name: 'Most Popular',
    categoryKey: 'All',
    isMostPopular: true,
  },
  {
    id: 'whatsapp-bots',
    name: 'WhatsApp Bots',
    categoryKey: 'WhatsApp Bots',
    image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=300&h=300&q=80',
  },
  {
    id: 'ai-geo-seo',
    name: 'AI & GEO SEO',
    categoryKey: 'AI & GEO SEO',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&h=300&q=80',
  },
  {
    id: 'lead-scrapers',
    name: 'Lead Scrapers',
    categoryKey: 'Lead Scrapers',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=300&h=300&q=80',
  },
  {
    id: 'crm-sales',
    name: 'CRM & Sales',
    categoryKey: 'CRM & Sales',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=300&h=300&q=80',
  },
  {
    id: 'video-design',
    name: 'Video & Design',
    categoryKey: 'Video & Design',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=300&h=300&q=80',
  },
  {
    id: 'email-marketing',
    name: 'Email Marketing',
    categoryKey: 'Email Marketing',
    image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&w=300&h=300&q=80',
  },
  {
    id: 'developer-tools',
    name: 'Developer Tools',
    categoryKey: 'Developer Tools',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=300&h=300&q=80',
  },
  {
    id: 'analytics',
    name: 'Analytics',
    categoryKey: 'Analytics',
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=300&h=300&q=80',
  },
];

export default function HeroDealSlider({
  deals = [],
  onBuyClick,
  activeCat = 'All',
  onSelectCategory,
}) {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const updateScrollButtons = () => {
    if (!trackRef.current) return;
    setCanScrollLeft(trackRef.current.scrollLeft > 30);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (el) {
      el.addEventListener('scroll', updateScrollButtons);
      return () => el.removeEventListener('scroll', updateScrollButtons);
    }
  }, []);

  const handleScroll = (distance) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: distance, behavior: 'smooth' });
  };

  // Auto-scroll banners smoothly every 5.5s
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      if (!trackRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 40) {
        trackRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        trackRef.current.scrollBy({ left: 450, behavior: 'smooth' });
      }
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleCategoryClick = (catKey) => {
    if (onSelectCategory) {
      onSelectCategory(catKey);
    }
    const dealsGrid = document.getElementById('deals-grid');
    if (dealsGrid) {
      dealsGrid.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="cashkaro-exact-hero w-full bg-white pt-6 pb-8 select-none overflow-hidden">
      
      {/* ── 1. FULL SCREEN MULTI-CARD BANNER CAROUSEL (CashKaro Card Layout With StackDeal Software) ── */}
      <div
        className="relative w-full px-4 sm:px-8 lg:px-12 xl:px-16"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left Arrow Button */}
        {canScrollLeft && (
          <button
            onClick={() => handleScroll(-460)}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-slate-800 shadow-xl border border-slate-200/90 flex items-center justify-center hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all z-30 cursor-pointer absolute left-6 sm:left-10 xl:left-14 top-1/2 -translate-y-1/2"
            aria-label="Previous Deals"
          >
            <ChevronLeft className="w-5 h-5 font-black text-slate-700" />
          </button>
        )}

        {/* Right Arrow Button (Floating circular white button with chevron) */}
        <button
          onClick={() => handleScroll(460)}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-slate-800 shadow-xl border border-slate-200/90 flex items-center justify-center hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all z-30 cursor-pointer absolute right-6 sm:right-10 xl:right-14 top-1/2 -translate-y-1/2"
          aria-label="Next Deals"
        >
          <ChevronRight className="w-5 h-5 font-black text-slate-700" />
        </button>

        {/* Full Screen Width Horizontal Scroll Track */}
        <div
          ref={trackRef}
          className="flex items-center gap-4 sm:gap-6 overflow-x-auto scroll-smooth scrollbar-none py-2 px-1 w-full"
        >
          {SOFTWARE_BANNERS.map((banner) => {
            const IconComponent = banner.icon;

            return (
              <Link
                key={banner.id}
                href={banner.href}
                className={`relative flex-shrink-0 w-[340px] sm:w-[410px] lg:w-[450px] xl:w-[480px] h-[195px] sm:h-[220px] lg:h-[235px] rounded-[22px] bg-gradient-to-r ${banner.gradient} p-5 sm:p-7 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 overflow-hidden flex flex-col justify-between cursor-pointer group`}
              >
                {/* Subtle ambient lighting */}
                <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />

                {/* ── Card Header (Software Logo & Verified Tag) ── */}
                <div className="z-10 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white shadow-xs flex items-center justify-center shrink-0">
                    <IconComponent className={`w-4 h-4 ${banner.iconColor}`} />
                  </div>

                  <span className={`text-xl sm:text-2xl font-black italic tracking-tight drop-shadow-xs ${banner.textColor || 'text-white'}`}>
                    {banner.softwareName}
                  </span>

                  <span className={`text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded shadow-xs uppercase tracking-wider ${banner.badgeBg}`}>
                    {banner.badgeText}
                  </span>
                </div>

                {/* ── Card Body (Discount & Subtitle) ── */}
                <div className="z-10 my-auto">
                  <h3 className={`text-2xl sm:text-3xl lg:text-[36px] font-black tracking-tight leading-none drop-shadow-xs ${banner.textColor || 'text-white'}`}>
                    {banner.discount}
                  </h3>
                  <p className={`text-xs sm:text-sm font-semibold mt-2 line-clamp-1 ${banner.textColor ? 'text-slate-800' : 'text-white/90'}`}>
                    {banner.subtitle}
                  </p>
                </div>

                {/* ── Card Footer (Exact [SD] Pill Badge from Screenshot Layout) ── */}
                <div className="z-10 flex items-center justify-between">
                  <div className={`inline-flex items-center gap-2 ${banner.pillBg} text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs border border-white/15`}>
                    <span className="w-5 h-5 rounded bg-[#0066FF] text-white flex items-center justify-center text-[10px] font-black shrink-0 shadow-xs">
                      {banner.dealTag}
                    </span>
                    <span className="font-extrabold text-[11px] sm:text-xs tracking-tight">
                      {banner.dealText}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-white/90 underline group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    View Deal →
                  </span>
                </div>

                {/* ── Right Side Cutout Product Photography Collage (SaaS Dashboard & UI Mockups) ── */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-[150px] sm:w-[185px] h-[150px] sm:h-[175px] pointer-events-none flex items-center justify-end">
                  {/* Outer Frame Mockup */}
                  <div className="relative w-full h-full flex items-center justify-end">
                    {/* Background Software Screenshot */}
                    <div className="absolute right-12 top-2 w-24 sm:w-28 h-28 sm:h-32 rounded-xl overflow-hidden shadow-2xl border border-white/30 transform rotate-3">
                      <img
                        src={banner.techMockup.image}
                        alt={banner.softwareName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Floating Feature Glass Pill */}
                    <div className="absolute right-1 bottom-3 z-10 bg-slate-950/90 text-white border border-white/30 backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-xl transform -rotate-3 group-hover:rotate-0 transition-transform">
                      <span className="text-[10px] font-black flex items-center gap-1 text-[#63f477]">
                        <CheckCircle2 className="w-3 h-3 text-[#63f477]" />
                        {banner.techMockup.badge}
                      </span>
                      <span className="text-[9px] text-slate-300 font-semibold block mt-0.5">
                        {banner.techMockup.metric}
                      </span>
                    </div>

                    {/* Top Sparkle Circle */}
                    <div className="absolute right-16 -top-1 w-9 h-9 rounded-full bg-white/25 backdrop-blur-md border border-white flex items-center justify-center text-white text-sm shadow-md">
                      ⚡
                    </div>
                  </div>
                </div>

              </Link>
            );
          })}
        </div>
      </div>

      {/* ── 2. TOP CATEGORIES SECTION (TRUE FULL SCREEN WIDTH) ── */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 pt-9 pb-4">
        
        {/* Section Heading */}
        <h2 className="text-xl sm:text-2xl lg:text-[26px] font-black text-slate-900 tracking-tight mb-6">
          Top Categories
        </h2>

        {/* Circular Category Items Row (Full Screen Even Spread on Desktop) */}
        <div className="w-full flex items-start justify-between gap-3 sm:gap-4 lg:gap-5 overflow-x-auto scrollbar-none pb-3 pt-1">
          {TOP_CATEGORIES.map((cat) => {
            const isSelected = activeCat === cat.categoryKey;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.categoryKey)}
                className="flex flex-col items-center flex-shrink-0 group cursor-pointer text-center focus:outline-hidden"
              >
                {/* ── 2A. "MOST POPULAR" Blue Circular Badge (Exact match to screenshot) ── */}
                {cat.isMostPopular && (
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 lg:w-26 lg:h-26 xl:w-28 xl:h-28 rounded-full bg-[#0052cc] border-2 border-blue-400 text-yellow-300 font-black text-center flex flex-col items-center justify-center shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all duration-200 ${
                    activeCat === 'All' ? 'ring-4 ring-blue-300 scale-105' : ''
                  }`}>
                    <span className="text-[12px] sm:text-[14px] lg:text-[15px] leading-tight font-black tracking-tight text-yellow-300">
                      MOST
                    </span>
                    <span className="text-[12px] sm:text-[14px] lg:text-[15px] leading-tight font-black tracking-tight text-yellow-300">
                      POPULAR
                    </span>
                  </div>
                )}

                {/* ── 2B. Software Circular Categories ── */}
                {!cat.isMostPopular && (
                  <div className={`relative w-20 h-20 sm:w-24 sm:h-24 lg:w-26 lg:h-26 xl:w-28 xl:h-28 rounded-full bg-slate-100 border border-slate-200/90 shadow-2xs overflow-hidden aspect-square shrink-0 group-hover:scale-105 group-hover:shadow-md transition-all duration-200 ${
                    isSelected ? 'ring-4 ring-blue-400/40 border-blue-500 scale-105' : ''
                  }`}>
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover aspect-square block group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Category Label Below */}
                <span className={`text-xs sm:text-[13px] lg:text-sm font-bold mt-2.5 max-w-[85px] sm:max-w-[105px] leading-tight transition-colors ${
                  isSelected ? 'text-blue-600 font-black' : 'text-slate-700 group-hover:text-slate-950'
                }`}>
                  {cat.name}
                </span>

              </button>
            );
          })}
        </div>

      </div>

    </section>
  );
}
