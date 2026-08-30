'use client';

import { useRef } from 'react';
import NachoNachoCard from './NachoNachoCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DealMirrorSliderSection({ deals, onBuyClick }) {
  const scrollRef = useRef(null);

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

  if (!deals || deals.length === 0) return null;

  return (
    <div className="space-y-6 my-10 relative">
      
      {/* ── Section Header & Carousel Navigation Controls ── */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1 bg-[#FF6B35] text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider mb-1">
            🔥 Trending Flash Pass Deals
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Top Rated Software Passes
          </h2>
        </div>

        {/* Carousel Navigation Arrow Controls (< and >) */}
        <div className="flex items-center gap-2">
          <button
            onClick={scrollLeft}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-800 hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all cursor-pointer group"
            aria-label="Previous Deal"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={scrollRight}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-800 hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all cursor-pointer group"
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
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 backdrop-blur border border-slate-200 shadow-xl flex items-center justify-center text-slate-800 hover:bg-[#2475FF] hover:text-white hover:border-[#2475FF] transition-all cursor-pointer opacity-90 group-hover:opacity-100 hidden sm:flex"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Floating Right Scroll Button Overlay */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 backdrop-blur border border-slate-200 shadow-xl flex items-center justify-center text-slate-800 hover:bg-[#2475FF] hover:text-white hover:border-[#2475FF] transition-all cursor-pointer opacity-90 group-hover:opacity-100 hidden sm:flex"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div
          ref={scrollRef}
          className="flex items-stretch gap-6 overflow-x-auto scrollbar-hide py-3 px-1 scroll-smooth"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {deals.map((deal) => (
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
