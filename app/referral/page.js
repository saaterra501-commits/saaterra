'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Gift, Copy, Check, Share2, Users, DollarSign, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function ReferralPage() {
  const [copied, setCopied] = useState(false);
  const referralLink = 'https://stackdeal.in/r/agency9901';

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex flex-col font-sans">
      <Navbar />

      {/* StackDeal Ticker Ribbon (#FF6B35) */}
      <div className="w-full bg-[#FF6B35] text-white py-2.5 overflow-hidden shadow-sm relative z-20">
        <div className="ticker-wrapper flex whitespace-nowrap">
          <div className="ticker-inner flex items-center gap-8 animate-ticker text-xs font-black uppercase tracking-wider">
            {[1, 2, 3, 4].map((_, i) => (
              <span key={i} className="inline-flex items-center gap-8">
                <span className="flex items-center gap-2"><span className="text-base">🎁</span> Refer & Earn ₹100 ST Credits</span>
                <span className="flex items-center gap-2"><span className="text-base">💳</span> Use Credits for 100% Free 5-Year Passes</span>
                <span className="flex items-center gap-2"><span className="text-base">⚡</span> Instant Wallet Balance Deposit</span>
                <span className="flex items-center gap-2"><span className="text-base">👥</span> Unlimited Referrals for Agency Partners</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Mint Hero Banner */}
      <section className="bg-[#E6F9EE] text-slate-900 py-14 px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 bg-[#FF6B35] text-white text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-wider">
            🎁 StackDeal Referral & Earn Program
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 leading-tight">
            Invite Agency Friends, Earn ₹200 Cash
          </h1>
          <p className="text-slate-700 text-sm sm:text-base font-medium max-w-xl mx-auto leading-relaxed">
            Give your agency friends 10% OFF their first 5-Year Pass, and get ₹200 credited instantly to your StackDeal wallet when they buy!
          </p>

          {/* Referral Box */}
          <div className="pt-4 max-w-md mx-auto">
            <div className="bg-white border border-slate-300 p-2 rounded-2xl flex items-center gap-2 shadow-md">
              <span className="font-mono text-xs text-slate-700 font-bold pl-3 truncate flex-1 text-left">
                {referralLink}
              </span>
              <button
                onClick={copyLink}
                className="px-5 py-2.5 bg-[#FFC700] hover:bg-[#E6B800] text-slate-950 text-xs rounded-xl font-black shrink-0 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Summary */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-6 relative z-20 w-full">
        <div className="bg-white border border-[#E8EBF3] rounded-3xl p-6 shadow-xl grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#E8EBF3]">
          
          <div className="flex items-center gap-4 px-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2475FF] flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#0A0F1E]">14</div>
              <div className="text-xs text-slate-500 font-bold">Total Clicks</div>
            </div>
          </div>

          <div className="flex items-center gap-4 px-2 pt-4 sm:pt-0">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#0A0F1E]">3</div>
              <div className="text-xs text-slate-500 font-bold">Successful Buyers</div>
            </div>
          </div>

          <div className="flex items-center gap-4 px-2 pt-4 sm:pt-0">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#0A0F1E]">₹600</div>
              <div className="text-xs text-slate-500 font-bold">Wallet Earnings</div>
            </div>
          </div>

        </div>
      </section>

      {/* 3 Step How It Works */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0A0F1E]">How It Works</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Start earning in 3 simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Share Your Link', desc: 'Copy your unique referral link and share with digital agency founders, freelancers, or WhatsApp groups.' },
            { step: '02', title: 'Friend Gets 10% OFF', desc: 'Your friend gets an extra 10% discount on any 5-Year Pass they buy on StackDeal.' },
            { step: '03', title: 'You Get ₹200 Cash', desc: '₹200 instantly credits to your wallet on every successful purchase, redeemable on future passes.' },
          ].map((item) => (
            <div key={item.step} className="bg-white border border-[#E8EBF3] rounded-2xl p-6 space-y-3 relative hover:shadow-lg transition-shadow">
              <span className="text-xs font-black text-[#2475FF] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase">
                Step {item.step}
              </span>
              <h3 className="text-lg font-black text-[#0A0F1E] pt-1">{item.title}</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
