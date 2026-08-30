'use client';

import { useState } from 'react';
import { Check, X, ShieldCheck, Crown, ArrowRight, Sparkles } from 'lucide-react';

export default function AppSumoTierMatrix({ deal, onBuyTier }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 my-10 font-sans">
      
      {/* ── Header ── */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
          Choose the plan that's right for you
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Feel secure in your purchase with SaaTerra's 60-day unconditional money-back guarantee.
        </p>
      </div>

      {/* ── AppSumo 3-Column Feature Comparison Table ── */}
      <div className="overflow-x-auto scrollbar-hide border border-slate-200 rounded-2xl shadow-xs">
        <table className="w-full text-left text-xs border-collapse min-w-[700px]">
          
          {/* Table Header */}
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="p-4 w-1/4 font-extrabold text-slate-500 uppercase text-[10px] tracking-wider align-bottom">
                Features &amp; Limits
              </th>

              {/* Starter Pass */}
              <th className="p-4 text-center border-l border-slate-200 space-y-2 w-1/4">
                <span className="font-black text-slate-950 text-sm block">{deal?.tier1Title || 'Starter Pass'}</span>
                <div className="text-xl font-black text-slate-950">₹{(deal?.tier1Price || 1999).toLocaleString('en-IN')}</div>
                <button
                  onClick={() => onBuyTier('Tier 1')}
                  className="w-full py-2.5 px-3 bg-[#2475FF] hover:bg-[#1a5ecc] text-white font-black text-xs rounded-xl shadow transition-colors"
                >
                  Buy Starter Pass
                </button>
                <span className="text-[10px] text-slate-400 font-bold block">5-Year Access</span>
              </th>

              {/* Pro Pass */}
              <th className="p-4 text-center border-2 border-[#2475FF] bg-blue-50/50 relative space-y-2 w-1/4">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#2475FF] text-white text-[9px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" /> Recommended
                </div>
                <span className="font-black text-slate-950 text-sm block pt-1">{deal?.tier2Title || 'Pro Pass'}</span>
                <div className="text-xl font-black text-[#2475FF]">₹{(deal?.tier2Price || 3999).toLocaleString('en-IN')}</div>
                <button
                  onClick={() => onBuyTier('Tier 2')}
                  className="w-full py-2.5 px-3 bg-[#2475FF] hover:bg-[#1a5ecc] text-white font-black text-xs rounded-xl shadow transition-colors"
                >
                  Buy Pro Pass
                </button>
                <span className="text-[10px] text-[#2475FF] font-bold block">5-Year Access</span>
              </th>

              {/* Agency Lifetime Pass (LTD) */}
              <th className="p-4 text-center border-l border-slate-200 space-y-2 w-1/4 bg-amber-50/40">
                <span className="font-black text-amber-950 text-sm block">{deal?.tier3Title || 'Agency Lifetime Pass (LTD)'}</span>
                <div className="text-xl font-black text-amber-900">₹{(deal?.tier3Price || 7999).toLocaleString('en-IN')}</div>
                <button
                  onClick={() => onBuyTier('Tier 3')}
                  className="w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow transition-colors"
                >
                  Buy Lifetime Pass
                </button>
                <span className="text-[10px] text-amber-700 font-extrabold block uppercase tracking-wider">∞ Lifetime Access (LTD)</span>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-200 font-medium">
            <tr>
              <td className="p-4 font-bold text-slate-900 bg-slate-50/50">Monthly Broadcasts / Credits</td>
              <td className="p-4 text-center font-bold text-slate-700">2,500</td>
              <td className="p-4 text-center font-black text-[#2475FF] bg-blue-50/30">10,000</td>
              <td className="p-4 text-center font-bold text-slate-700">50,000</td>
            </tr>

            <tr>
              <td className="p-4 font-bold text-slate-900 bg-slate-50/50">Team Members / Users</td>
              <td className="p-4 text-center font-bold text-slate-700">1 Member</td>
              <td className="p-4 text-center font-black text-[#2475FF] bg-blue-50/30">3 Members</td>
              <td className="p-4 text-center font-bold text-slate-700">10 Members</td>
            </tr>

            <tr>
              <td className="p-4 font-bold text-slate-900 bg-slate-50/50">AI Chatbot Workflows</td>
              <td className="p-4 text-center font-bold text-slate-700">Standard</td>
              <td className="p-4 text-center font-black text-[#2475FF] bg-blue-50/30">Advanced AI</td>
              <td className="p-4 text-center font-bold text-slate-700">Pro AI & Workflows</td>
            </tr>

            <tr>
              <td className="p-4 font-bold text-slate-900 bg-slate-50/50">Official WhatsApp API</td>
              <td className="p-4 text-center text-emerald-600"><Check className="w-5 h-5 mx-auto font-black" /></td>
              <td className="p-4 text-center text-emerald-600 bg-blue-50/30"><Check className="w-5 h-5 mx-auto font-black" /></td>
              <td className="p-4 text-center text-emerald-600"><Check className="w-5 h-5 mx-auto font-black" /></td>
            </tr>

            <tr>
              <td className="p-4 font-bold text-slate-900 bg-slate-50/50">White-Label Branding</td>
              <td className="p-4 text-center text-red-400"><X className="w-4 h-4 mx-auto text-red-400 opacity-60" /></td>
              <td className="p-4 text-center text-emerald-600 bg-blue-50/30"><Check className="w-5 h-5 mx-auto font-black" /></td>
              <td className="p-4 text-center text-emerald-600"><Check className="w-5 h-5 mx-auto font-black" /></td>
            </tr>

            <tr>
              <td className="p-4 font-bold text-slate-900 bg-slate-50/50">API &amp; Webhook Access</td>
              <td className="p-4 text-center text-red-400"><X className="w-4 h-4 mx-auto text-red-400 opacity-60" /></td>
              <td className="p-4 text-center text-emerald-600 bg-blue-50/30"><Check className="w-5 h-5 mx-auto font-black" /></td>
              <td className="p-4 text-center text-emerald-600"><Check className="w-5 h-5 mx-auto font-black" /></td>
            </tr>

          </tbody>
        </table>
      </div>

      {/* Footer Trust Bar */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-black text-slate-600 pt-2 border-t border-slate-100">
        <span className="flex items-center gap-1.5 text-emerald-700">
          <Check className="w-4 h-4 text-emerald-600" /> Refundable up to 60 days
        </span>
        <span className="flex items-center gap-1.5 text-[#2475FF]">
          <Crown className="w-4 h-4 text-[#2475FF] fill-[#2475FF]" /> Plus members get extra 10% OFF
        </span>
        <span className="flex items-center gap-1.5 text-slate-900">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> 60-Day Money Back Guarantee
        </span>
      </div>

    </div>
  );
}
