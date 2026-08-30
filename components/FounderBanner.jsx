'use client';

import Link from 'next/link';
import { Rocket, BadgePercent, Globe, Users } from 'lucide-react';

const BENEFITS = [
  { icon: '💰', text: '70/30 Revenue Split — Keep 70% of every sale' },
  { icon: '🚀', text: '14-Day Flash Campaign — Maximum launch visibility' },
  { icon: '🇮🇳', text: 'Instant Razorpay UPI Payouts — No forex delays' },
  { icon: '📊', text: 'Real-Time Sales Dashboard with GST Invoices' },
];

export default function FounderBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#1A1828] via-[#0f1535] to-[#1a0b35] rounded-3xl p-8 sm:p-12">

      {/* Decorative blobs */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#2475FF]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#FF6B00]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

        {/* Left: Text */}
        <div className="flex-1 text-center lg:text-left">
          <span className="inline-flex items-center gap-1.5 bg-[#FF6B00]/20 border border-[#FF6B00]/30 text-[#FF6B00] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            <Rocket className="w-3 h-3" />
            Vendor Partner Programme
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3 leading-tight">
            List Your SaaS Tool on<br />
            <span className="text-[#FF6B35]">StackDeal</span> — India's #1 B2B Software Platform
          </h2>

          <p className="text-slate-400 text-sm font-medium mb-6 max-w-lg">
            Run a 14-day flash campaign and get instant access to 50,000+ Indian agency owners and founders. Zero upfront cost — we earn only when you earn.
          </p>

          {/* Benefits List */}
          <ul className="space-y-2 mb-8 text-left inline-block">
            {BENEFITS.map((b, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                <span className="text-lg">{b.icon}</span>
                <span>{b.text}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <Link
              href="/submit"
              className="px-6 py-3.5 bg-[#FF6B35] hover:bg-[#E85A24] text-white font-black text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Rocket className="w-4 h-4" />
              Submit Your Product
            </Link>
            <Link
              href="/submit"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Globe className="w-4 h-4" />
              See Revenue Split Calculator
            </Link>
          </div>
        </div>

        {/* Right: Stats Box */}
        <div className="shrink-0 bg-white/5 border border-white/10 rounded-2xl p-6 text-center min-w-[220px] space-y-5">
          <div>
            <div className="text-3xl font-black text-[#FFE500]">50K+</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Active B2B Buyers</div>
          </div>
          <div className="border-t border-white/10" />
          <div>
            <div className="text-3xl font-black text-emerald-400">70%</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Revenue You Keep</div>
          </div>
          <div className="border-t border-white/10" />
          <div>
            <div className="text-3xl font-black text-[#2475FF]">14 Days</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Flash Campaign Window</div>
          </div>
        </div>

      </div>
    </div>
  );
}
