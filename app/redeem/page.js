'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { Key, ArrowRight, CheckCircle2, ShieldCheck, Zap, Sparkles, ExternalLink, AlertCircle } from 'lucide-react';

function RedeemContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code') || '';

  const [code, setCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [redeemResult, setRedeemResult] = useState(null);

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode.toUpperCase());
    }
  }, [initialCode]);

  const handleRedeem = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'License code verification failed');
      }

      setRedeemResult(data);
    } catch (err) {
      setErrorMessage(err.message || 'Invalid license code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#E8EBF3] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      {redeemResult ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4">
          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-black text-emerald-950">
              {redeemResult.isAlreadyRedeemed ? 'Pass Already Active! 🎉' : 'License Activated! 🎉'}
            </h3>
            <p className="text-xs text-emerald-700 font-medium mt-1">
              Your 5-Year Pass for <strong>{redeemResult.dealTitle}</strong> ({redeemResult.tier}) is verified in the system.
            </p>
          </div>

          <div className="bg-white p-3 rounded-xl border border-emerald-200 text-xs font-mono font-bold text-emerald-800 tracking-wider">
            {redeemResult.licenseCode}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            {redeemResult.vendorWebsite && (
              <a
                href={redeemResult.vendorWebsite}
                target="_blank"
                rel="noreferrer"
                className="btn-primary justify-center text-xs py-3 px-5 rounded-xl inline-flex w-full sm:w-auto items-center gap-2"
              >
                <span>Go to Vendor Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <Link
              href="/profile"
              className="py-3 px-5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl inline-flex w-full sm:w-auto items-center justify-center gap-2"
            >
              <span>View in Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
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
              placeholder="e.g. SD-WATOOL-7F90B1"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="input-premium font-mono tracking-wider text-center text-base"
            />
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <div>{errorMessage}</div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFC700] hover:bg-[#E6B800] text-slate-950 font-black text-sm py-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <span>Verifying Code...</span>
            ) : (
              <>
                <span>Redeem & Activate Pass</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="pt-2 text-center text-xs font-medium text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            60-Day Money-Back Guarantee Protection Active
          </div>
        </form>
      )}
    </div>
  );
}

export default function RedeemPage() {
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

      {/* Main Content Form with Suspense Boundary */}
      <main className="max-w-xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        <Suspense fallback={
          <div className="bg-white border border-[#E8EBF3] rounded-3xl p-8 text-center text-xs text-slate-400">
            Loading redemption portal...
          </div>
        }>
          <RedeemContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
