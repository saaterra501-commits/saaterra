'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { Key, ArrowRight, CheckCircle2, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export default function RedeemPage() {
  const [code, setCode] = useState('');
  const [redeemed, setRedeemed] = useState(false);

  const handleRedeem = (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setRedeemed(true);
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
                <span className="flex items-center gap-2"><span className="text-base">🔑</span> Instant License Code Activation</span>
                <span className="flex items-center gap-2"><span className="text-base">⚡</span> 5-Year Full Software Access</span>
                <span className="flex items-center gap-2"><span className="text-base">🛡️</span> 60-Day Money-Back Guarantee</span>
                <span className="flex items-center gap-2"><span className="text-base">💬</span> Direct Vendor WhatsApp Support</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Mint Hero Banner */}
      <section className="bg-[#E6F9EE] text-slate-900 py-12 px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mx-auto space-y-4 text-center">
          <span className="inline-flex items-center gap-1.5 bg-[#FF6B35] text-white text-[11px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
            🔑 Code Redemption Portal
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950">
            Redeem Your 5-Year Pass Code
          </h1>
          <p className="text-slate-700 text-sm sm:text-base font-medium max-w-xl mx-auto">
            Enter your StackDeal license code below to activate your 5-year software access or upgrade existing tiers.
          </p>
        </div>
      </section>

      {/* Main Content Form */}
      <main className="max-w-xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        <div className="bg-white border border-[#E8EBF3] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          
          {redeemed ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-black text-emerald-900">License Activated! 🎉</h3>
              <p className="text-xs text-emerald-700 font-medium">
                Your code <strong>{code.toUpperCase()}</strong> has been activated for 5 years. You can manage your pass anytime from your dashboard.
              </p>
              <Link href="/profile" className="btn-primary justify-center text-xs py-3 rounded-xl inline-flex mt-2">
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleRedeem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Enter License Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ST-CHATCHA-99018A"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="input-premium font-mono tracking-wider text-center text-base"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#FFC700] hover:bg-[#E6B800] text-slate-950 font-black text-sm py-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Redeem & Activate Pass</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center text-xs font-medium text-slate-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                60-Day Money-Back Guarantee Protection Active
              </div>
            </form>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
