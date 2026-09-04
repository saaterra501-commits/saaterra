'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Zap, Sparkles, Check,
  TrendingUp, BarChart3, Users, Layers, Activity
} from 'lucide-react';

const FALLBACK_SLIDES = [
  {
    id: 1,
    slug: 'mailmunch',
    title: 'Grow your audience and boost your sales',
    tagline: 'Capture leads with forms and popups, then send campaigns and automations from one platform.',
    price: 1999,
    originalPrice: 14000,
    vendorName: 'Mailmunch',
    vendorLogo: 'https://cdn-icons-png.flaticon.com/512/5968/5968534.png',
    graphicUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    themeColor: '#0B5CFF',
    accentColor: '#1A6BFF',
    stat1: '18.6% Conversion',
    stat2: 'Automations: Active',
  },
  {
    id: 2,
    slug: 'chat-chacha',
    title: 'Automate WhatsApp AI Marketing & Conversions',
    tagline: 'Send official WhatsApp broadcasts, recover abandoned carts with AI chatbots, and collect UPI payments directly inside WhatsApp chats.',
    price: 1999,
    originalPrice: 24000,
    vendorName: 'Chat Chacha',
    vendorLogo: 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png',
    graphicUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
    themeColor: '#06A77D',
    accentColor: '#00C875',
    stat1: '98% Open Rate',
    stat2: '10k Broadcasts/mo',
  },
  {
    id: 3,
    slug: 'nuwatomic-geo-seo',
    title: 'Rank Your Agency on ChatGPT & Perplexity AI Search',
    tagline: 'Track, optimize, and rank agency clients on ChatGPT, Gemini, and Perplexity AI search engines with automated GEO audits.',
    price: 2499,
    originalPrice: 32000,
    vendorName: 'Nuwatomic',
    vendorLogo: 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png',
    graphicUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
    themeColor: '#7928CA',
    accentColor: '#9E00FF',
    stat1: '#1 Rank in Perplexity',
    stat2: 'AI Citations: +450%',
  },
  {
    id: 4,
    slug: 'manage-hr-projects-payroll-crm-from-one',
    title: 'Manage HR, Projects, Payroll & CRM From One Platform',
    tagline: 'All-in-one operations suite to handle employees, client projects, automated payroll, and sales pipelines without monthly fees.',
    price: 3899,
    originalPrice: 38990,
    vendorName: 'BusinessHRM',
    vendorLogo: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    graphicUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1000&auto=format&fit=crop',
    themeColor: '#FF5A1F',
    accentColor: '#FF7A00',
    stat1: '100% Automated Payroll',
    stat2: '50+ Active Projects',
  },
  {
    id: 5,
    slug: 'webybuilder',
    title: 'Launch High-Converting Landing Pages in 60 Seconds',
    tagline: 'Drag-and-drop website builder with built-in SEO optimization, lightning-fast hosting, and native Razorpay UPI checkout.',
    price: 1999,
    originalPrice: 18000,
    vendorName: 'WebyBuilder',
    vendorLogo: 'https://cdn-icons-png.flaticon.com/512/1006/1006771.png',
    graphicUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000&auto=format&fit=crop',
    themeColor: '#2475FF',
    accentColor: '#0055FF',
    stat1: '0.4s Load Time',
    stat2: '1-Click UPI Payments',
  }
];

const THEME_PALETTES = [
  { bg: '#0B5CFF', accent: '#1A6BFF' },
  { bg: '#06A77D', accent: '#00C875' },
  { bg: '#7928CA', accent: '#9E00FF' },
  { bg: '#FF5A1F', accent: '#FF7A00' },
  { bg: '#2475FF', accent: '#0055FF' },
  { bg: '#D9381E', accent: '#FF4500' },
];

function HeroSlideCountdown({ deal }) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: Number(deal?.campaignDurationDays || 14),
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setMounted(true);
    const updateCountdown = () => {
      const launchTime = deal?.launchDate ? new Date(deal.launchDate).getTime() : Date.now();
      const durationDays = Number(deal?.campaignDurationDays || 14);
      const targetEnd = deal?.campaignEndDate ? new Date(deal.campaignEndDate).getTime() : (launchTime + durationDays * 24 * 60 * 60 * 1000);
      const diff = Math.max(0, targetEnd - Date.now());
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [deal]);

  const displayDays = mounted ? String(timeLeft.days).padStart(2, '0') : String(deal?.campaignDurationDays || 14).padStart(2, '0');
  const displayHours = mounted ? String(timeLeft.hours).padStart(2, '0') : '00';
  const displayMins = mounted ? String(timeLeft.minutes).padStart(2, '0') : '00';
  const displaySecs = mounted ? String(timeLeft.seconds).padStart(2, '0') : '00';

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border-2 border-emerald-300/80 shadow-md shadow-emerald-950/5 max-w-sm space-y-2.5" suppressHydrationWarning>
      <div className="flex items-center justify-between">
        <span className="font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 text-[10px]">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          🔥 14-Day Flash Launch Window
        </span>
        <span className="text-[10px] font-black text-emerald-800 bg-emerald-100/90 border border-emerald-200 px-2 py-0.5 rounded-full uppercase">
          {deal?.campaignDurationDays || 14}d Campaign
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center" suppressHydrationWarning>
        <div className="bg-[#F0FDF4] border border-emerald-200/90 rounded-xl py-2 shadow-2xs">
          <div className="text-xl font-black font-mono text-slate-950 leading-none" suppressHydrationWarning>
            {displayDays}
          </div>
          <div className="text-[9px] font-extrabold text-emerald-800 uppercase mt-1 tracking-wider">Days</div>
        </div>
        <div className="bg-[#F0FDF4] border border-emerald-200/90 rounded-xl py-2 shadow-2xs">
          <div className="text-xl font-black font-mono text-slate-950 leading-none" suppressHydrationWarning>
            {displayHours}
          </div>
          <div className="text-[9px] font-extrabold text-emerald-800 uppercase mt-1 tracking-wider">Hours</div>
        </div>
        <div className="bg-[#F0FDF4] border border-emerald-200/90 rounded-xl py-2 shadow-2xs">
          <div className="text-xl font-black font-mono text-slate-950 leading-none" suppressHydrationWarning>
            {displayMins}
          </div>
          <div className="text-[9px] font-extrabold text-emerald-800 uppercase mt-1 tracking-wider">Mins</div>
        </div>
        <div className="bg-[#F0FDF4] border border-emerald-200/90 rounded-xl py-2 shadow-2xs">
          <div className="text-xl font-black font-mono text-[#FF6B35] leading-none" suppressHydrationWarning>
            {displaySecs}
          </div>
          <div className="text-[9px] font-extrabold text-[#FF6B35] uppercase mt-1 tracking-wider">Secs</div>
        </div>
      </div>
    </div>
  );
}

export default function HeroDealSlider({ deals = [], onBuyClick }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeSlides = (deals && deals.length > 0)
    ? deals.slice(0, 8).map((d, i) => {
        const starterTier = d.pricingTiers && d.pricingTiers.length > 0 ? d.pricingTiers[0] : null;
        const price = Number(d.tier1Price ?? starterTier?.price ?? d.price ?? 1999);
        const originalPrice = Number(d.originalPrice ?? starterTier?.originalPrice ?? (price * 10));
        const palette = THEME_PALETTES[i % THEME_PALETTES.length];

        return {
          id: d.id || d.slug,
          slug: d.slug,
          title: d.title,
          tagline: d.tagline || 'Capture leads, send campaigns, and scale operations with 5-year full access.',
          price: price,
          originalPrice: originalPrice,
          campaignDurationDays: d.campaignDurationDays || 14,
          campaignEndDate: d.campaignEndDate,
          launchDate: d.launchDate,
          vendorName: d.vendorName || 'StackDeal Tool',
          vendorLogo: d.vendorLogo || `https://www.google.com/s2/favicons?domain=${d.slug}.com&sz=128`,
          graphicUrl: d.screenshot || d.heroImage || '/appsumo-hero-graphic.png',
          themeColor: palette.bg,
          accentColor: palette.accent,
          stat1: 'Live Platform Access',
          stat2: '5-Year License Pass',
        };
      })
    : FALLBACK_SLIDES;

  useEffect(() => {
    if (isPaused || activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, activeSlides.length]);

  const deal = activeSlides[currentSlide] || activeSlides[0];

  return (
    <div
      className="relative font-sans overflow-hidden bg-[#D8F5E5] border-b border-emerald-200/60 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      
      {/* ── 1. StackDeal Signature Green Ticker Ribbon ── */}
      <div className="w-full overflow-hidden bg-[#2EE574] text-slate-950 py-2.5 font-black text-xs uppercase tracking-wider relative z-20 shadow-xs">
        <div className="ticker-wrapper flex whitespace-nowrap">
          <div className="ticker-inner flex items-center gap-8 animate-ticker">
            {[1, 2, 3, 4].map((_, i) => (
              <span key={i} className="inline-flex items-center gap-8">
                <span className="flex items-center gap-2">
                  <span className="text-base">💳</span>
                  <span>5-Year Access Passes for Agencies</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-base">⚡</span>
                  <span>Zero Monthly Subscriptions</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-base">🇮🇳</span>
                  <span>Instant Razorpay UPI Checkout</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-base">🛡️</span>
                  <span>60-Day 100% Money-Back Guarantee</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-base">📄</span>
                  <span>B2B GST Tax Invoices Included</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-base">🔑</span>
                  <span>Instant License Key Delivery</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-base">🍦</span>
                  <span>Zero Regrets</span>
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. Main Hero Content Container ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* ── LEFT COLUMN: Title, Tagline, Price, Yellow Button ── */}
          <div className="lg:col-span-6 space-y-6 text-left animate-fadeIn">
            
            {/* Title */}
            <Link href={`/deals/${deal.slug}`} className="block group">
              <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-black text-slate-950 tracking-tight leading-[1.12] group-hover:text-slate-800 transition-colors">
                {deal.title}
              </h1>
            </Link>

            {/* Tagline */}
            <p className="text-slate-800 text-base sm:text-lg font-medium leading-relaxed max-w-lg">
              {deal.tagline}
            </p>

            {/* ── Real-Time 14-Day Flash Countdown Timer ── */}
            <HeroSlideCountdown deal={deal} />

            {/* Pricing Line: 5-Year Pass format (₹1,999/5-year ₹24,000) */}
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                ₹{Number(deal.price).toLocaleString('en-IN')}
              </span>
              <span className="text-slate-700 font-bold text-sm">
                /5-year
              </span>
              <span className="text-slate-500 font-semibold text-base line-through ml-2">
                ₹{Number(deal.originalPrice).toLocaleString('en-IN')}
              </span>
            </div>

            {/* AppSumo Signature Yellow "Buy now" Button */}
            <div className="pt-1 flex items-center gap-3">
              <Link
                href={`/cart?deal=${deal.slug}&tier=Starter Pass&price=${deal.price}`}
                className="px-8 py-3.5 bg-[#FFBA08] hover:bg-[#EAA800] text-slate-950 font-black text-base rounded-lg shadow-sm hover:shadow-md transition-all inline-flex items-center justify-center cursor-pointer"
              >
                Buy now
              </Link>

              <Link
                href={`/deals/${deal.slug}`}
                className="px-6 py-3.5 bg-slate-900/10 hover:bg-slate-900/20 text-slate-900 font-bold text-sm rounded-lg transition-all"
              >
                View Deal Details
              </Link>
            </div>

          </div>

          {/* ── RIGHT COLUMN: Exact 3D AppSumo Software Graphic (Seamless, No Inner Box) ── */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
            
            {/* ── 3D Canvas Card ── */}
            <Link
              href={`/deals/${deal.slug}`}
              className="w-full max-w-xl rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-[1.01] block group"
              style={{
                backgroundColor: deal.themeColor || '#0B5CFF',
                backgroundImage: 'radial-gradient(ellipse at 85% 15%, rgba(255,255,255,0.22), transparent 55%), radial-gradient(ellipse at 15% 85%, rgba(0,0,0,0.15), transparent 50%)',
              }}
            >
              
              {/* ── Top-Left Floating Tilted 3D Logo Badge ── */}
              <div className="absolute top-4 left-4 z-30 w-14 h-14 bg-white rounded-2xl shadow-2xl border-2 border-white flex items-center justify-center transform -rotate-12 group-hover:rotate-0 transition-transform duration-300 p-2.5">
                <img
                  src={deal.vendorLogo}
                  alt={deal.vendorName}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png';
                  }}
                />
              </div>

              {/* ── Header Brand Logo & Name (White Logo + Clean Text) ── */}
              <div className="flex items-center justify-center gap-3 mb-5 relative z-20 pt-1 pl-6">
                <div className="w-8 h-8 rounded-xl bg-white/20 p-1 flex items-center justify-center shrink-0">
                  <img
                    src={deal.vendorLogo}
                    alt={deal.vendorName}
                    className="w-full h-full object-contain filter brightness-200"
                    onError={(e) => {
                      e.target.src = 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png';
                    }}
                  />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-sm">
                  {deal.vendorName.toLowerCase()}
                </h3>
              </div>

              {/* ── Floating 3D Software Mockup Composition (Directly on canvas, NO inner frame box) ── */}
              <div className="relative z-10 w-full flex items-center justify-center py-2">
                
                {/* Left Floating Template / Sidebar Card */}
                <div className="absolute -left-2 sm:left-2 bottom-3 z-20 w-24 sm:w-28 bg-white rounded-xl p-2 shadow-2xl border border-white/40 transform -rotate-6 group-hover:-rotate-2 transition-transform duration-500 hidden sm:block">
                  <div className="w-full h-10 bg-gradient-to-br from-pink-500 to-rose-400 rounded-lg mb-1.5 flex items-center justify-center text-[9px] font-black text-white">
                    25% OFF
                  </div>
                  <div className="w-full h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center text-[9px] font-black text-white">
                    MEGA SALE
                  </div>
                </div>

                {/* Center Dashboard UI Mockup (Seamlessly floating with drop-shadow) */}
                <div className="w-full max-w-[420px] rounded-2xl overflow-hidden shadow-2xl bg-white/95 backdrop-blur border border-white/50 transform group-hover:scale-[1.02] transition-transform duration-500">
                  
                  {/* Browser Mockup Top Bar */}
                  <div className="bg-slate-100/90 px-3 py-2 border-b border-slate-200/80 flex items-center justify-between text-[10px] font-bold text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-rose-400" />
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 truncate max-w-[140px]">
                      app.{deal.slug}.com/campaigns
                    </span>
                    <span className="text-[9px] font-black text-[#0B5CFF]">Active</span>
                  </div>

                  {/* UI Dashboard Content Image / Graphic */}
                  <div className="aspect-[16/9] w-full bg-slate-50 overflow-hidden relative">
                    <img
                      src={deal.graphicUrl}
                      alt={deal.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop';
                      }}
                    />
                  </div>

                </div>

                {/* Right Top Floating Automation Pill */}
                <div className="absolute right-0 sm:right-2 top-2 z-20 bg-white/95 backdrop-blur rounded-xl p-2.5 shadow-2xl border border-white/60 text-slate-900 transform rotate-3 group-hover:rotate-0 transition-transform duration-500 hidden sm:block">
                  <div className="text-[10px] font-black text-slate-800 flex items-center gap-1 mb-1">
                    <Zap className="w-3 h-3 text-amber-500" /> Automation
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-[8px] font-bold text-slate-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> New leads: +120
                    </div>
                    <div className="flex items-center gap-1 text-[8px] font-bold text-slate-600 bg-blue-50 px-1.5 py-0.5 rounded">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> AI Bot active
                    </div>
                  </div>
                </div>

                {/* Right Bottom Floating Analytics Pill */}
                <div className="absolute -right-2 sm:right-4 -bottom-2 z-20 bg-white/95 backdrop-blur rounded-xl p-2.5 shadow-2xl border border-white/60 text-slate-900 transform rotate-2 group-hover:rotate-0 transition-transform duration-500">
                  <div className="text-[10px] font-black text-slate-800 flex items-center gap-1">
                    <Activity className="w-3 h-3 text-[#0B5CFF]" /> Analytics
                  </div>
                  <div className="text-xs font-black text-emerald-600 mt-0.5">18.6% Conversion</div>
                  <div className="w-16 h-1.5 bg-emerald-100 rounded-full mt-1 overflow-hidden">
                    <div className="w-3/4 h-full bg-emerald-500 rounded-full" />
                  </div>
                </div>

              </div>

            </Link>

            {/* ── BOTTOM MINI LOGO DOCK (App Switcher Carousel) ── */}
            {activeSlides.length > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2 flex-wrap max-w-xl">
                {activeSlides.map((s, idx) => {
                  const initialLetter = (s.vendorName || s.title || 'S').slice(0, 2).toUpperCase();
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`w-10 h-10 rounded-xl p-1.5 transition-all cursor-pointer flex items-center justify-center border ${
                        currentSlide === idx
                          ? 'bg-white border-slate-900 shadow-lg scale-110 ring-2 ring-slate-900/20'
                          : 'bg-white/80 border-emerald-300 hover:bg-white hover:scale-105'
                      }`}
                      title={s.vendorName}
                    >
                      <img
                        src={s.vendorLogo}
                        alt={s.vendorName}
                        className="w-full h-full object-contain rounded-md"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          if (e.target.nextSibling) {
                            e.target.nextSibling.style.display = 'flex';
                          }
                        }}
                      />
                      <span
                        className="w-full h-full rounded-md bg-gradient-to-br from-slate-800 to-slate-950 text-white text-[10px] font-black items-center justify-center"
                        style={{ display: 'none' }}
                      >
                        {initialLetter}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  );
}
