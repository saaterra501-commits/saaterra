'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import LTDCheckoutModal from '../../components/LTDCheckoutModal';
import StackDealAtmCard from '../../components/StackDealAtmCard';
import { Crown, Sparkles, ShieldCheck, Zap, ArrowRight, Check, Star, Gift, Heart, Clock } from 'lucide-react';

export default function PlusPage() {
  const [showCheckout, setShowCheckout] = useState(false);

  const plusDealObj = {
    id: 'plus-vip',
    slug: 'plus-vip-membership',
    title: 'StackDeal Plus VIP Membership — 1 Year',
    tagline: 'Get extra 10% OFF all 5-Year Passes, 90-day extended refund guarantee, and 24-hr early access to limited launches.',
    tier1Price: 999,
    tier1Title: '1 Year VIP Access',
    tier1Credits: 'Unlimited 10% Discounts on All Passes',
    originalPrice: 2999,
    vendorName: 'StackDeal VIP',
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
                <span className="flex items-center gap-2"><span className="text-base">👑</span> Extra 10% OFF on All 5-Year Passes</span>
                <span className="flex items-center gap-2"><span className="text-base">⚡</span> VIP Priority Support & Fast Track</span>
                <span className="flex items-center gap-2"><span className="text-base">🎁</span> Exclusive Member-Only Drops</span>
                <span className="flex items-center gap-2"><span className="text-base">🛡️</span> Extended 60-Day Money-Back Guarantee</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Mint Hero Banner */}
      <section className="bg-[#E6F9EE] text-slate-900 py-14 px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <span className="inline-flex items-center gap-1.5 bg-[#FF6B35] text-white text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-wider">
            👑 StackDeal Plus VIP Membership
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 leading-tight">
            Save Extra 10% On Every Single Pass
          </h1>
          <p className="text-slate-700 text-sm sm:text-base font-medium max-w-xl mx-auto leading-relaxed">
            Join 450+ Indian agency founders enjoying 90-day extended refunds, 10% extra discounts, and priority access to hot limited-stock deals.
          </p>

          {/* ATM Card Visual */}
          <div className="max-w-md mx-auto pt-4 text-left">
            <StackDealAtmCard
              rawSubtotal={9990}
              plusAdded={true}
              onTogglePlus={() => setShowCheckout(true)}
              price={999}
            />
          </div>

          <div className="pt-2">
            <button
              onClick={() => setShowCheckout(true)}
              className="px-10 py-4 bg-[#FF6B35] hover:bg-[#E85A24] text-white font-black text-base rounded-2xl shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer inline-flex items-center gap-2"
            >
              <Crown className="w-5 h-5 text-white" />
              <span>Join StackDeal Plus — ₹999/yr</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* VIP Perks Grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0A0F1E]">Exclusive VIP Benefits</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Why top Indian agency owners upgrade to Plus</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: '🏷️',
              title: 'Extra 10% OFF Every Deal',
              desc: 'Stack Deal Plus gives you an additional 10% discount on all 5-Year Access Passes on top of existing discounts.',
              highlight: 'Saves ~₹200 per pass',
            },
            {
              icon: '🛡️',
              title: '90-Day Extended Refund',
              desc: 'Instead of the standard 60-day refund, Plus members get a full 90-day window to test any software risk-free.',
              highlight: '3 Months Guarantee',
            },
            {
              icon: '🚀',
              title: '24-Hour Early Access',
              desc: 'Get exclusive 24-hour head start on limited-stock SaaS launches before deals open to the public.',
              highlight: 'Never miss out',
            },
          ].map((perk) => (
            <div key={perk.title} className="bg-white border border-[#E8EBF3] rounded-2xl p-6 space-y-3 hover:shadow-lg transition-shadow">
              <span className="text-3xl">{perk.icon}</span>
              <span className="inline-block bg-amber-50 text-amber-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border border-amber-200">
                {perk.highlight}
              </span>
              <h3 className="text-lg font-black text-[#0A0F1E] pt-1">{perk.title}</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{perk.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />

      {showCheckout && (
        <LTDCheckoutModal
          deal={plusDealObj}
          selectedTier="Tier 1"
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
}
