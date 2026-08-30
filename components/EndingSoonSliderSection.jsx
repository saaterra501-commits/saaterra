'use client';

import { useRef } from 'react';
import Link from 'next/link';
import NachoNachoCard from './NachoNachoCard';
import { ChevronLeft, ChevronRight, Clock, Flame, ArrowRight } from 'lucide-react';

export default function EndingSoonSliderSection({ deals, onBuyClick }) {
  const scrollRef = useRef(null);

  if (!deals || deals.length === 0) return null;

  // Filter deals ending in 7 days or less
  const isDealEndingSoon = (deal) => {
    const launchTime = deal.launchDate ? new Date(deal.launchDate).getTime() : (deal.createdAt ? new Date(deal.createdAt).getTime() : Date.now());
    const durationDays = Number(deal.campaignDurationDays || 14);
    const targetEnd = deal.campaignEndDate ? new Date(deal.campaignEndDate).getTime() : (launchTime + durationDays * 24 * 60 * 60 * 1000);
    const diffDays = Math.ceil((targetEnd - Date.now()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  // If deals ending in <=7 days exist, use them. Otherwise, sort by shortest remaining campaign time!
  let endingDeals = deals.filter(isDealEndingSoon);
  if (endingDeals.length === 0) {
    endingDeals = [...deals].sort((a, b) => {
      const endA = a.campaignEndDate ? new Date(a.campaignEndDate).getTime() : Date.now();
      const endB = b.campaignEndDate ? new Date(b.campaignEndDate).getTime() : Date.now();
      return endA - endB;
    }).slice(0, 6);
  }

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6 my-12 relative">
      
      {/* ── Section Header & Carousel Navigation Controls ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-red-100 pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-2 shadow-sm animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            ⏳ FINAL 7 DAYS • LAST CHANCE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight flex items-center gap-2">
            <span>Ending Soon Software Passes</span>
            <span className="text-sm font-black text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full font-mono">
              {endingDeals.length} Tools
            </span>
          </h2>
        </div>

        {/* Controls & View All Link */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/deals"
            className="text-xs font-black text-red-600 hover:text-red-700 hover:underline flex items-center gap-1 mr-2"
          >
            <span>View All Deals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={scrollLeft}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-800 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all cursor-pointer group"
            aria-label="Previous Deal"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={scrollRight}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-800 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all cursor-pointer group"
            aria-label="Next Deal"
          >
            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* ── Horizontal Scrollable Carousel Track ── */}
      <div className="relative group">
        
        {/* Floating Left Scroll Button Overlay */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 backdrop-blur border border-slate-200 shadow-xl flex items-center justify-center text-slate-800 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all cursor-pointer opacity-90 group-hover:opacity-100 hidden sm:flex"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Floating Right Scroll Button Overlay */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 backdrop-blur border border-slate-200 shadow-xl flex items-center justify-center text-slate-800 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all cursor-pointer opacity-90 group-hover:opacity-100 hidden sm:flex"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div
          ref={scrollRef}
          className="flex items-stretch gap-6 overflow-x-auto scrollbar-hide py-3 px-1 scroll-smooth"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {endingDeals.map((deal) => (
            <div
              key={deal.id || deal.slug}
              className="w-[260px] sm:w-[295px] shrink-0"
              style={{ scrollSnapAlign: 'start' }}
            >
              <NachoNachoCard deal={deal} onBuyClick={onBuyClick} />
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
