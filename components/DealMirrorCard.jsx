'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function DealMirrorCard({ deal, onBuyClick }) {
  const price = deal.tier1Price || deal.price || 1999;
  const originalPrice = deal.originalPrice || price * 10;
  const usdPrice = Math.round(price / 83);
  const usdOriginalPrice = Math.round(originalPrice / 83);
  const rating = deal.rating || 5.0;
  const reviewsCount = deal.reviewsCount || 38;

  // Screenshot image fallback
  const heroImage =
    deal.screenshots?.[0] ||
    deal.imageUrl ||
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative h-full">
      
      {/* ── 1. Slim Top Hero Banner Screenshot Container ── */}
      <div className="relative h-36 sm:h-40 w-full bg-slate-950 overflow-hidden">
        {/* Background Screenshot Image */}
        <img
          src={heroImage}
          alt={deal.title}
          className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

        {/* Top-Right Deal Ribbon Badge */}
        <div className="absolute top-0 right-0 bg-[#FF6B35] text-white text-[8px] sm:text-[9px] font-black px-2 py-0.5 uppercase tracking-widest shadow-xs rounded-bl-lg z-10 flex items-center gap-1">
          <span>DEAL</span>
          <span className="text-amber-300">SAATERRA</span>
        </div>

        {/* Top-Left Badges (WHITE LABEL / RESELLER) */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {deal.isWhiteLabel !== false && (
            <span className="bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shadow-xs">
              WHITE LABEL
            </span>
          )}
          {deal.isReseller !== false && (
            <span className="bg-white text-slate-950 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shadow-xs border border-slate-200">
              RESELLER
            </span>
          )}
        </div>

        {/* Software Vendor Logo & Name Overlay on Banner */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/90 backdrop-blur-md p-1 border border-white/40 shrink-0 shadow-xs">
            <img
              src={deal.vendorLogo || 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png'}
              alt={deal.vendorName || 'Vendor'}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <div className="text-white font-black text-[11px] sm:text-xs truncate drop-shadow-xs">
              {deal.vendorName || 'SaaS Tool'}
            </div>
            <div className="text-[9px] sm:text-[10px] text-amber-300 font-bold flex items-center gap-1">
              <span>🌮 {rating}</span>
              <span className="text-slate-300">({reviewsCount})</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── 2. Slim Card Content Body ── */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3 text-center">
        
        {/* Deal Title & Tagline */}
        <div className="space-y-1">
          <h3 className="font-black text-slate-950 text-xs sm:text-sm leading-snug line-clamp-2 group-hover:text-[#2475FF] transition-colors">
            <Link href={`/deals/${deal.slug || 'chat-chacha'}`}>
              {deal.title}
            </Link>
          </h3>

          <p className="text-[11px] text-slate-500 font-medium line-clamp-2 leading-tight">
            {deal.tagline}
          </p>
        </div>

        {/* ── 3. Striking Price Row & Action Buttons ── */}
        <div className="pt-2 border-t border-slate-100 space-y-2.5">
          
          {/* Striking Price Display */}
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 line-through">
              ₹{originalPrice.toLocaleString('en-IN')} (${usdOriginalPrice})
            </span>

            <span className="text-base sm:text-lg font-black text-[#E6A100] tracking-tight">
              ₹{price.toLocaleString('en-IN')} <span className="text-xs font-bold text-amber-600">(${usdPrice})</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            <Link
              href={`/deals/${deal.slug || 'chat-chacha'}`}
              className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-950 text-[11px] font-black rounded-lg transition-all text-center"
            >
              Details
            </Link>

            <Link
              href={`/cart?deal=${deal.slug || deal.id || 'chat-chacha'}`}
              className="flex-1 py-1.5 px-2 bg-[#FFC700] hover:bg-[#E6B800] text-slate-950 text-[11px] font-black rounded-lg shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <span>Get Pass</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
