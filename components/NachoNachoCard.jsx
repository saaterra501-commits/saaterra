'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Tag, Star, Scale, Check, Plus } from 'lucide-react';

export default function NachoNachoCard({ deal, onBuyClick }) {
  const [isCompared, setIsCompared] = useState(false);

  const starterTier = deal.pricingTiers && deal.pricingTiers.length > 0 ? deal.pricingTiers[0] : null;
  const starterTierName = starterTier?.tierName || 'Starter Pass';
  const price = Number(deal.tier1Price ?? starterTier?.price ?? deal.price ?? 1999);
  const originalPrice = Number(deal.originalPrice ?? starterTier?.originalPrice ?? (price * 10));
  const usdPrice = Math.round(price / 83);
  const usdOriginal = Math.round(originalPrice / 83);
  const discountPct = Math.round(((originalPrice - price) / (originalPrice || 1)) * 100);

  // Real Stock claimed calculation: (soldCount / totalCodes) * 100
  const totalCodes = Number(deal.totalCodes || 100);
  const soldCount = Number(deal.soldCount ?? (deal.claimedPercent ? Math.round((deal.claimedPercent / 100) * totalCodes) : 72));
  const claimed = Math.min(100, Math.max(10, Math.round((soldCount / totalCodes) * 100)));

  const hasWhiteLabel = deal.whiteLabel || deal.tags?.includes('white-label');
  const hasReseller = deal.reseller || deal.tags?.includes('reseller');

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('stackdeal_compare_items') || '[]');
      setIsCompared(saved.some((item) => item.slug === deal.slug));
    } catch (e) {}

    const handleUpdate = () => {
      try {
        const saved = JSON.parse(localStorage.getItem('stackdeal_compare_items') || '[]');
        setIsCompared(saved.some((item) => item.slug === deal.slug));
      } catch (e) {}
    };

    window.addEventListener('stackdeal_compare_updated', handleUpdate);
    return () => window.removeEventListener('stackdeal_compare_updated', handleUpdate);
  }, [deal.slug]);

  const toggleCompare = (e) => {
    e.stopPropagation();
    try {
      let saved = JSON.parse(localStorage.getItem('stackdeal_compare_items') || '[]');
      if (isCompared) {
        saved = saved.filter((item) => item.slug !== deal.slug);
      } else {
        if (saved.length >= 4) {
          alert('You can compare up to 4 software at a time.');
          return;
        }
        saved.push({
          slug: deal.slug,
          title: deal.title,
          vendorName: deal.vendorName,
          vendorLogo: deal.vendorLogo,
        });
      }
      localStorage.setItem('stackdeal_compare_items', JSON.stringify(saved));
      window.dispatchEvent(new Event('stackdeal_compare_updated'));
    } catch (err) {}
  };

  const handleCardClick = () => {
    window.location.href = `/deals/${deal.slug || 'chat-chacha'}`;
  };

  // Real-time Live Ticking Countdown
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: Number(deal.campaignDurationDays || 14),
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setMounted(true);
    const updateCountdown = () => {
      const launchTime = deal.launchDate ? new Date(deal.launchDate).getTime() : (deal.createdAt ? new Date(deal.createdAt).getTime() : Date.now());
      const durationDays = Number(deal.campaignDurationDays || 14);
      const targetEnd = deal.campaignEndDate ? new Date(deal.campaignEndDate).getTime() : (launchTime + durationDays * 24 * 60 * 60 * 1000);
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
  }, [deal.campaignEndDate, deal.launchDate, deal.campaignDurationDays, deal.createdAt]);

  const isUnder7Days = mounted ? timeLeft.days <= 7 : (Number(deal.campaignDurationDays || 14) <= 7);

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col cursor-pointer group h-full relative"
    >
      {/* ── 1. TOP: Dark Product Screenshot Banner ── */}
      <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 overflow-hidden shrink-0">

        {/* Product Screenshot Image */}
        <img
          src={deal.screenshot || deal.heroImage || `https://picsum.photos/seed/${deal.slug || deal.id || 'saas'}/400/300`}
          alt={deal.title}
          className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
        />

        {/* Overlay gradient at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Transparent '+' / '✔' Compare Icon on Corner (#FF6B35, No Background) */}
        <button
          onClick={toggleCompare}
          title={isCompared ? 'Remove from compare' : 'Add to compare'}
          className="absolute top-2 right-2.5 z-20 p-1 text-[#FF6B35] hover:scale-125 transition-transform cursor-pointer drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        >
          {isCompared ? (
            <Check className="w-6 h-6 stroke-[3.5] text-[#FF6B35]" />
          ) : (
            <Plus className="w-6 h-6 stroke-[3.5] text-[#FF6B35]" />
          )}
        </button>

        {/* Discount % ribbon top-left */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow">
            {discountPct}% OFF
          </span>
          {hasWhiteLabel && (
            <span className="bg-white text-slate-950 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider border border-slate-300 shadow">
              WHITE LABEL
            </span>
          )}
          {hasReseller && (
            <span className="bg-white text-slate-950 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider border border-slate-300 shadow">
              RESELLER
            </span>
          )}
        </div>

        {/* Ice Cream Rating + Urgent 7-Day Real-Time Live Countdown */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-1.5" suppressHydrationWarning>
          <span className="flex items-center gap-1 bg-black/75 backdrop-blur-sm text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-lg shadow shrink-0">
            🍦 {deal.rating ? Number(deal.rating).toFixed(1) : (deal.tacoRating ? Number(deal.tacoRating).toFixed(1) : '5.0')}
          </span>
          
          {mounted && isUnder7Days ? (
            <span className="flex items-center gap-1 bg-red-600/95 backdrop-blur-sm text-white text-[9px] font-black px-2 py-0.5 rounded-lg shadow font-mono border border-red-400/60 animate-pulse" suppressHydrationWarning>
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span>⏳ {timeLeft.days}d {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-lg shadow uppercase tracking-wider" suppressHydrationWarning>
              ⏳ {mounted ? timeLeft.days : (deal.campaignDurationDays || 14)}d left
            </span>
          )}
        </div>
      </div>

      {/* ── 2. BOTTOM: White Content Section ── */}
      <div className="flex flex-col flex-1 p-4 gap-2 bg-white">

        {/* Product Title */}
        <h3 className="font-bold text-slate-950 text-sm leading-snug line-clamp-3 group-hover:text-[#FF6B35] transition-colors">
          {deal.title || `${deal.vendorName}: ${deal.tagline}`}
        </h3>

        {/* ── Stock Progress Bar: "84% Claimed" ── */}
        <div className="mt-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wide">
              {claimed}% Claimed
            </span>
            <span className="text-[10px] font-medium text-slate-400">
              {100 - claimed}% left
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all"
              style={{ width: `${claimed}%` }}
            />
          </div>
        </div>

        {/* ── Starter Plan Label & Real Pricing Row ── */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-slate-400 text-xs font-medium line-through">
              ₹{originalPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-[#FF6B35] text-lg font-black">
              ₹{price.toLocaleString('en-IN')}
            </span>
          </div>

          <span className="text-[10px] font-black text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded uppercase tracking-wider">
            {starterTierName}
          </span>
        </div>

        {/* CTA Row */}
        <div className="flex items-center gap-2 mt-1 pt-2 border-t border-slate-100">
          <Link
            href={`/deals/${deal.slug || 'chat-chacha'}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 text-center px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg transition-all"
          >
            Details
          </Link>

          <Link
            href={`/cart?deal=${deal.slug || deal.id || 'chat-chacha'}&tier=Starter Pass&price=${price}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 px-3 py-1.5 bg-[#FF6B35] hover:bg-[#e06000] text-white font-black text-[11px] rounded-lg shadow transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            <Tag className="w-3 h-3" />
            Get Pass
          </Link>
        </div>

      </div>
    </div>
  );
}
