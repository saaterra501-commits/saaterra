'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function DeelStyleCard({ deal, onBuyClick }) {
  const price = deal.tier1Price || deal.price || 1999;
  const originalPrice = deal.originalPrice || price * 10;
  const usdPrice = Math.round(price / 83);
  const savingsYr = Math.round((originalPrice - price) / 5);

  return (
    <div
      onClick={() => onBuyClick && onBuyClick(deal)}
      className="bg-[#F5F3ED] border border-[#E8E5DC] rounded-[36px] p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 font-sans cursor-pointer group h-full relative"
    >
      {/* ── 1. Top Header: Circular Outlined Logo & Title ── */}
      <div className="flex items-center gap-3.5">
        <div className="w-14 h-14 rounded-full border border-slate-900 bg-white p-2.5 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
          <img
            src={deal.vendorLogo || 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png'}
            alt={deal.vendorName || deal.title}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="min-w-0">
          <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight truncate group-hover:text-[#2475FF] transition-colors">
            {deal.vendorName || deal.title.split('—')[0]}
          </h3>
          <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block">
            {deal.category || 'SaaS Pass'}
          </span>
        </div>
      </div>

      {/* ── 2. Bright Yellow Full Pill Offer Badge ── */}
      <div className="w-full bg-[#FFE500] text-slate-950 text-xs sm:text-sm font-black py-2.5 px-4 rounded-full text-center shadow-xs flex items-center justify-center gap-1">
        <span className="font-extrabold uppercase tracking-tight">100% B2B GST</span>
        <span className="font-medium text-slate-800">Input Tax Credit.</span>
      </div>

      {/* ── 3. Green Savings Highlight Text ── */}
      <div className="text-[#008A1E] font-black text-xs sm:text-sm tracking-tight flex items-center gap-1">
        <span>Save up to ₹{savingsYr.toLocaleString('en-IN')}/year</span>
        <span className="text-emerald-600 font-bold text-xs">(${Math.round(savingsYr / 83)})</span>
      </div>

      {/* ── 4. Main Description Paragraph ── */}
      <p className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed line-clamp-3">
        {deal.tagline || deal.description}
      </p>

      {/* ── 5. Bottom Pricing & CTA Row ── */}
      <div className="pt-3 border-t border-[#E8E5DC]/80 flex items-center justify-between gap-3 mt-auto">
        <div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">5-Year Access</div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl font-black text-slate-950">₹{price.toLocaleString('en-IN')}</span>
            <span className="text-xs font-bold text-slate-500">(${usdPrice})</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/deals/${deal.slug || 'chat-chacha'}`}
            onClick={(e) => e.stopPropagation()}
            className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-950 font-black text-xs rounded-full border border-slate-300 transition-all"
          >
            Details
          </Link>

          <Link
            href={`/cart?deal=${deal.slug || 'chat-chacha'}`}
            onClick={(e) => e.stopPropagation()}
            className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white font-black text-xs rounded-full shadow-md transition-all cursor-pointer flex items-center gap-1"
          >
            <span>Get Pass</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

    </div>
  );
}
