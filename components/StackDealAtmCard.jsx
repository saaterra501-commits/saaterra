'use client';

import { Crown, Check, Plus, Wifi, Sparkles } from 'lucide-react';
import StackDealLogo from './StackDealLogo';

export default function StackDealAtmCard({
  rawSubtotal = 7500,
  plusAdded = false,
  onTogglePlus,
  price = 999
}) {
  const savingsAmount = Math.round(rawSubtotal * 0.10) || 750;

  return (
    <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 shadow-xl transition-all duration-300 border border-amber-500/30 bg-gradient-to-br from-[#0c0d14] via-[#141726] to-[#08090f] text-white">
      
      {/* ── Metallic Glow Sheen Layers ── */}
      <div className="absolute -top-16 -right-16 w-44 h-44 bg-gradient-to-br from-amber-400/20 via-orange-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-gradient-to-tr from-[#FF6B35]/20 via-amber-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none" />

      <div className="relative z-10 space-y-3">
        
        {/* ── Top Header Row: Logo + Chip + Card No + VIP Badge ── */}
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
          
          {/* Logo + Chip + NFC Wave */}
          <div className="flex items-center gap-2.5">
            <div className="bg-white/95 px-2.5 py-1 rounded-lg shadow-xs border border-white/20 shrink-0">
              <StackDealLogo className="w-[100px] h-[26px]" />
            </div>

            {/* Gold EMV Micro Chip */}
            <div className="w-8 h-6 rounded bg-gradient-to-br from-[#FFE58F] via-[#D48806] to-[#874D00] p-0.5 border border-amber-300/40 relative overflow-hidden flex flex-col justify-between shrink-0">
              <div className="w-full h-[1px] bg-black/40 mt-1.5" />
              <div className="w-full h-[1px] bg-black/40 mb-1.5" />
              <div className="absolute inset-y-0 left-2 w-[1px] bg-black/40" />
              <div className="absolute inset-y-0 right-2 w-[1px] bg-black/40" />
            </div>

            {/* Contactless Wifi Icon */}
            <Wifi className="w-3.5 h-3.5 rotate-90 text-amber-400/80 shrink-0 hidden sm:block" />

            {/* Embossed Card Number */}
            <span className="font-mono text-xs font-bold tracking-widest text-slate-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] hidden md:inline">
              5019 •••• 2026
            </span>
          </div>

          {/* Golden VIP Pill Badge */}
          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#FFC700] to-[#FF9500] text-slate-950 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm shrink-0">
            <Crown className="w-3 h-3 fill-slate-950" />
            <span>PLUS VIP</span>
          </span>
        </div>

        {/* ── Middle Row: Savings Headline & Short Description ── */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm sm:text-base font-black text-white leading-snug">
              Save ₹{savingsAmount.toLocaleString('en-IN')} with StackDeal Pass!
            </h3>
            <span className="text-[11px] font-black text-amber-400 flex items-center gap-1 shrink-0">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Save Extra 10%
            </span>
          </div>
          <p className="text-[11px] text-slate-300 font-medium leading-relaxed line-clamp-1 sm:line-clamp-none">
            Get automatic 10% OFF all passes, 90-day refund window, and VIP early access.
          </p>
        </div>

        {/* ── Bottom Row: Pricing & Compact CTA Button ── */}
        <div className="flex items-center justify-between gap-3 pt-1 border-t border-white/10">
          <div className="flex items-baseline gap-1">
            <span className="text-base font-black text-[#FFC700]">₹{price}</span>
            <span className="text-[10px] text-slate-400 font-bold">/ year</span>
          </div>

          <button
            onClick={onTogglePlus}
            className={`px-4 py-2 rounded-xl font-black text-[11px] transition-all cursor-pointer shadow-md flex items-center gap-1.5 ${
              plusAdded
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                : 'bg-[#FF6B35] hover:bg-[#E85A24] text-white'
            }`}
          >
            {plusAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{plusAdded ? 'Pass Active (10% OFF)' : `+ Add Pass (₹${price}/yr)`}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
