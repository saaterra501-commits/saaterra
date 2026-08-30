'use client';

import { useEffect, useRef } from 'react';

const LIVE_PURCHASES = [
  { name: 'Rahul', city: 'Delhi', deal: 'Chat Chacha 5-Yr Pass', time: '2 min ago' },
  { name: 'Priya', city: 'Mumbai', deal: 'Bitvoiper Pro Pass', time: '5 min ago' },
  { name: 'Arjun', city: 'Bangalore', deal: 'Agency Lifetime Pass', time: '8 min ago' },
  { name: 'Sneha', city: 'Pune', deal: 'ViralClippr Pass', time: '11 min ago' },
  { name: 'Vikram', city: 'Hyderabad', deal: 'KadeEmail 5-Yr Pass', time: '14 min ago' },
  { name: 'Ananya', city: 'Chennai', deal: 'Duprun White-Label Pass', time: '18 min ago' },
  { name: 'Rohit', city: 'Kolkata', deal: 'Chat Chacha Starter Pass', time: '21 min ago' },
  { name: 'Kavya', city: 'Ahmedabad', deal: 'Agency Lifetime Pass', time: '25 min ago' },
  { name: 'Aditya', city: 'Jaipur', deal: 'Bitvoiper Agency Pass', time: '28 min ago' },
  { name: 'Meera', city: 'Surat', deal: 'ViralClippr Pro Pass', time: '31 min ago' },
];

export default function SalesTicker() {
  return (
    <div className="w-full bg-slate-950 text-white overflow-hidden py-2 border-b border-slate-800">
      <div className="flex items-center gap-3 px-4">
        {/* Static Live Badge */}
        <span className="shrink-0 flex items-center gap-1.5 bg-[#FF6B00] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          LIVE
        </span>

        {/* Scrolling Ticker Track */}
        <div className="overflow-hidden flex-1 relative">
          <div className="flex items-center gap-10 animate-ticker whitespace-nowrap">
            {/* Render twice for seamless loop */}
            {[...LIVE_PURCHASES, ...LIVE_PURCHASES].map((p, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 text-[11px] font-medium shrink-0 text-slate-200">
                <span className="text-base">🛍️</span>
                <span className="font-black text-white">{p.name}</span>
                <span className="text-slate-400">from</span>
                <span className="text-slate-300 font-semibold">{p.city}</span>
                <span className="text-slate-400">bought</span>
                <span className="text-[#FFE500] font-black">{p.deal}</span>
                <span className="text-slate-500 text-[10px]">· {p.time}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right: SaaTerra Plus VIP pill */}
        <a
          href="/plus"
          className="shrink-0 hidden sm:flex items-center gap-1 bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider hover:bg-amber-300 transition-colors whitespace-nowrap"
        >
          👑 PLUS VIP — 10% OFF
        </a>
      </div>
    </div>
  );
}
