'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calculator, TrendingDown, Zap, CheckCircle2, XCircle, Sparkles, ArrowRight } from 'lucide-react';

const PRESETS = [
  { name: 'Solo Founder', tools: 3, price: 1500, label: '3 Tools • ₹1.5k/mo' },
  { name: 'Growing Agency', tools: 6, price: 2500, label: '6 Tools • ₹2.5k/mo' },
  { name: 'Power Agency', tools: 12, price: 4000, label: '12 Tools • ₹4k/mo' },
];

export default function SavingsCalculator() {
  const [tools, setTools] = useState(6);
  const [pricePerTool, setPricePerTool] = useState(2500);

  const monthlyTotal = tools * pricePerTool;
  const yearlyTotal = monthlyTotal * 12;
  const fiveYearTotal = yearlyTotal * 5;
  const saaterraPass = tools * 1999;
  const totalSaved = Math.max(0, fiveYearTotal - saaterraPass);
  const savedPct = fiveYearTotal > 0 ? Math.round((totalSaved / fiveYearTotal) * 100) : 92;

  const applyPreset = (p) => {
    setTools(p.tools);
    setPricePerTool(p.price);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm text-slate-950 my-8">
      
      {/* ── 1. HEADER SECTION ── */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
        <span className="inline-flex items-center gap-1.5 bg-[#FF6B35]/10 border border-[#FF6B35]/25 text-[#FF6B35] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
          <Calculator className="w-3.5 h-3.5" />
          5-Year Lifetime ROI Calculator
        </span>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight">
          See How Much You Save 💸
        </h2>

        <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed">
          Stop bleeding cash on recurring monthly SaaS bills. Switch to <strong className="text-slate-950 font-black">StackDeal 5-Year Access Passes</strong> and retain 100% of your operational profits.
        </p>

        {/* Quick Presets */}
        <div className="pt-3 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-1">Quick Scenarios:</span>
          {PRESETS.map((p) => {
            const isSelected = tools === p.tools && pricePerTool === p.price;
            return (
              <button
                key={p.name}
                onClick={() => applyPreset(p)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#FF6B35] text-white border-[#FF6B35] shadow-md shadow-orange-500/20 scale-105'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                {p.name} ({p.label})
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2. CALCULATOR INTERACTIVE BODY ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

        {/* ── LEFT: DYNAMIC SLIDERS (7 COLS) ── */}
        <div className="lg:col-span-7 bg-slate-50/80 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-8">
          
          {/* Slider 1: Number of SaaS Tools */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                  Number of SaaS Tools Needed
                </label>
                <span className="text-[11px] text-slate-500 font-medium">WhatsApp, CRM, GEO SEO, Lead Scrapers, etc.</span>
              </div>
              <div className="bg-[#FF6B35]/15 border border-[#FF6B35]/30 text-[#FF6B35] px-4 py-1.5 rounded-2xl text-lg font-black font-mono">
                {tools} {tools === 1 ? 'Tool' : 'Tools'}
              </div>
            </div>

            <input
              type="range"
              min={1}
              max={20}
              value={tools}
              onChange={(e) => setTools(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#FF6B35]"
            />

            <div className="flex justify-between text-[11px] font-bold text-slate-400">
              <span>1 Tool</span>
              <span>10 Tools</span>
              <span>20 Tools</span>
            </div>
          </div>

          {/* Slider 2: Average Monthly Price per Tool */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                  Average Monthly Price / Tool
                </label>
                <span className="text-[11px] text-slate-500 font-medium">Standard Indian SaaS subscription billing</span>
              </div>
              <div className="bg-emerald-100 border border-emerald-300 text-emerald-800 px-4 py-1.5 rounded-2xl text-lg font-black font-mono">
                ₹{pricePerTool.toLocaleString('en-IN')}<span className="text-xs text-emerald-700 font-normal">/mo</span>
              </div>
            </div>

            <input
              type="range"
              min={500}
              max={10000}
              step={500}
              value={pricePerTool}
              onChange={(e) => setPricePerTool(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />

            <div className="flex justify-between text-[11px] font-bold text-slate-400">
              <span>₹500/mo</span>
              <span>₹5,000/mo</span>
              <span>₹10,000/mo</span>
            </div>
          </div>

          {/* Live Mini Summary Pill */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between text-xs shadow-xs">
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Current monthly burn rate:</span>
            </div>
            <span className="font-black text-red-600 text-sm font-mono">
              ₹{monthlyTotal.toLocaleString('en-IN')} / month
            </span>
          </div>

        </div>

        {/* ── RIGHT: SAVINGS COMPARISON CARD (5 COLS) ── */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-gradient-to-b from-[#F0FDF4] to-[#DCFCE7]/60 border-2 border-emerald-400/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            
            {/* Top Badge */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-emerald-800 bg-white border border-emerald-300 px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs">
                🎉 {savedPct}% Direct Savings
              </span>
              <span className="text-xs font-bold text-slate-500">
                5-Year Window
              </span>
            </div>

            {/* Side-by-Side Breakdown */}
            <div className="space-y-3.5 pt-1">
              
              {/* Old Monthly Subscription Way */}
              <div className="bg-white border border-red-200 rounded-2xl p-3.5 flex items-center justify-between text-xs shadow-2xs">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>5-Yr Monthly Subscriptions</span>
                </div>
                <span className="font-black text-red-600 line-through text-sm font-mono">
                  ₹{fiveYearTotal.toLocaleString('en-IN')}
                </span>
              </div>

              {/* StackDeal 5-Year Pass Way */}
              <div className="bg-white border border-emerald-300 rounded-2xl p-3.5 flex items-center justify-between text-xs shadow-2xs">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>StackDeal 5-Year Passes</span>
                </div>
                <span className="font-black text-emerald-700 text-base font-mono">
                  ₹{saaterraPass.toLocaleString('en-IN')}
                </span>
              </div>

            </div>

            {/* Highlighted Total Savings Counter */}
            <div className="border-t border-emerald-200/80 pt-4 text-center space-y-1">
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                Your Total Net Profits Saved
              </span>
              <div className="text-4xl sm:text-5xl font-black text-emerald-700 tracking-tight font-mono">
                ₹{totalSaved.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-emerald-800 font-bold">
                Keep this money in your business to hire talent & scale faster!
              </p>
            </div>

            {/* CTA Button */}
            <Link
              href="/deals"
              className="w-full py-4 bg-[#FF6B35] hover:bg-[#E85A24] text-white font-black text-sm rounded-2xl transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Explore 5-Year Passes ({tools} Tools)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}
