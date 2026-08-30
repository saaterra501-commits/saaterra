'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Gift, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export default function ReferralPage() {
  return (
    <div className="min-h-screen bg-[#F6F7FB] flex flex-col font-sans text-slate-900">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-20 flex-1 flex items-center justify-center w-full">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm max-w-xl w-full">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600">
            <Gift className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 bg-[#0A0F1E] text-amber-300 text-[11px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Opening Soon
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
              Agency Partner & Referral Program
            </h1>
            <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-md mx-auto">
              We are currently upgrading our affiliate and partner payout infrastructure. In the meantime, explore our verified 5-Year SaaS Passes with lifetime agency discounts.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/deals"
              className="inline-flex items-center gap-2 btn-primary px-6 py-3 text-xs font-black rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <span>Explore 5-Year SaaS Deals</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
