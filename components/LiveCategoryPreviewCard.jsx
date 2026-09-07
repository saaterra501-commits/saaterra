'use client';

import { useState, useEffect } from 'react';
import { Tag, Star, Plus, Check, ShoppingCart, Clock, Sparkles } from 'lucide-react';
import { getCategoryTheme } from '@/lib/categoryThemes';

export default function LiveCategoryPreviewCard({
  category = 'WhatsApp Bots',
  title = 'Chat Chacha — WhatsApp AI Marketing & Automation',
  tagline = 'Automate WhatsApp marketing broadcasts, AI chatbot cart recovery, and lead conversion.',
  vendorLogo = 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png',
  vendorName = 'Chat Chacha Tech Private Limited',
  heroImage = 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?q=80&w=1000&auto=format&fit=crop',
  campaignDurationDays = 14,
  price = 1999,
  originalPrice = 24000,
  tierName = 'Starter Pass',
  totalCodes = 180,
  soldCount = 22,
}) {
  const theme = getCategoryTheme(category);
  const CategoryIcon = theme.icon;

  const numPrice = Number(price) || 1999;
  const numOriginal = Number(originalPrice) || (numPrice * 10);
  const discountPct = Math.max(1, Math.min(99, Math.round(((numOriginal - numPrice) / (numOriginal || 1)) * 100)));

  const total = Number(totalCodes) || 100;
  const sold = Number(soldCount) || 18;
  const claimedPercent = Math.min(100, Math.max(5, Math.round((sold / total) * 100)));

  const displayLogo = vendorLogo?.trim() || 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png';
  const displayImage = heroImage?.trim() || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop';
  const daysLeft = Number(campaignDurationDays) || 14;

  return (
    <div className="w-full max-w-sm mx-auto select-none">
      {/* ── Card Container with Category Theme Accent Border ── */}
      <div className={`bg-white rounded-2xl overflow-hidden border-2 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col relative ${theme.borderClass}`}>
        
        {/* ── 1. TOP: Product Screenshot Banner with Category Glow ── */}
        <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 overflow-hidden shrink-0">
          
          {/* Screenshot Image */}
          <img
            src={displayImage}
            alt={title || 'Software Screenshot'}
            className="w-full h-full object-cover opacity-90 transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop';
            }}
          />

          {/* Ambient Category Color Lighting Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-t ${theme.headerGlow} pointer-events-none`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Top-Left: Vendor/Software Logo Badge + Discount Pill */}
          <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white p-1 shadow-md border border-white/90 ring-2 ring-black/10 flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src={displayLogo}
                alt={vendorName || 'Logo'}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png';
                }}
              />
            </div>

            <span className={`${theme.ribbonBg} text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-md`}>
              {discountPct}% OFF
            </span>
          </div>

          {/* Top-Right: Compare '+' Icon */}
          <div className="absolute top-2.5 right-2.5 z-20 p-1 text-[#FF6B35] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            <Plus className="w-6 h-6 stroke-[3.5] text-[#FF6B35]" />
          </div>

          {/* Bottom Bar: Rating + Real-Time Live Expiry Timestamp */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-1.5 z-10">
            <span className="flex items-center gap-1 bg-black/75 backdrop-blur-sm text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-lg shadow shrink-0">
              🍦 5.0
            </span>

            <span className="flex items-center gap-1 bg-black/80 backdrop-blur-md text-white text-[9px] font-black px-2.5 py-1 rounded-lg shadow border border-white/20 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#63f477] animate-pulse" />
              <span>⏳ {daysLeft}d left • Active Drop</span>
            </span>
          </div>
        </div>

        {/* ── 2. BOTTOM: Content Section ── */}
        <div className="flex flex-col flex-1 p-4 gap-2.5 bg-white">
          
          {/* Category Pill Tag & Vendor Badge */}
          <div className="flex items-center justify-between gap-1 text-[10px]">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md font-black uppercase tracking-wider border shadow-2xs ${theme.pillBg}`}>
              <CategoryIcon className="w-3 h-3" />
              <span>{category || theme.shortLabel}</span>
            </span>

            <span className="text-slate-400 font-bold truncate max-w-[130px] text-[10px]">
              {vendorName || 'Verified Vendor'}
            </span>
          </div>

          {/* Software Title */}
          <h3 className="font-extrabold text-slate-950 text-sm leading-snug line-clamp-2">
            {title || 'Software Title'}
          </h3>

          {/* Tagline */}
          <p className="text-slate-500 text-xs font-medium line-clamp-2 leading-relaxed">
            {tagline || theme.taglinePlaceholder}
          </p>

          {/* ── Stock Progress Bar: "Claimed" ── */}
          <div className="mt-1">
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[10px] font-black uppercase tracking-wide ${theme.priceColor}`}>
                {claimedPercent}% Claimed
              </span>
              <span className="text-[10px] font-medium text-slate-400">
                {total - sold} passes left
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${theme.progressGradient} rounded-full transition-all`}
                style={{ width: `${claimedPercent}%` }}
              />
            </div>
          </div>

          {/* ── Pricing Row ── */}
          <div className="flex items-center justify-between mt-1 pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-slate-400 text-xs font-medium line-through">
                ₹{numOriginal.toLocaleString('en-IN')}
              </span>
              <span className={`text-lg font-black ${theme.priceColor}`}>
                ₹{numPrice.toLocaleString('en-IN')}
              </span>
            </div>

            <span className="text-[10px] font-black text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded uppercase tracking-wider">
              {tierName || 'Starter Pass'}
            </span>
          </div>

          {/* ── CTA Row with Category Themed Button ── */}
          <div className="flex items-center gap-1.5 mt-1 pt-2 border-t border-slate-100">
            <span className="flex-1 text-center px-2.5 py-1.5 bg-slate-100 text-slate-700 font-bold text-[11px] rounded-lg">
              Details
            </span>

            <span className="px-2 py-1.5 rounded-lg border border-slate-200 text-slate-600 bg-slate-50 flex items-center justify-center shrink-0">
              <ShoppingCart className="w-3.5 h-3.5" />
            </span>

            <span className={`flex-1 px-2.5 py-1.5 ${theme.btnBg} font-black text-[11px] rounded-lg shadow-sm flex items-center justify-center gap-1`}>
              <Tag className="w-3 h-3" />
              <span>Get Pass</span>
            </span>
          </div>

        </div>

      </div>

      {/* Helper Banner below preview */}
      <div className="mt-3 text-center px-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-2xs">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.themeColor }} />
          <span>Homepage preview for: <strong className="text-slate-900">{category}</strong></span>
        </span>
      </div>
    </div>
  );
}
