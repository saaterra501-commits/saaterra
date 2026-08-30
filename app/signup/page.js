'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { User, Mail, Lock, Gift, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import StackDealLogo from '../../components/StackDealLogo';

function SignupForm() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get('ref') || '';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [refCode, setRefCode] = useState(initialRef);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, refCode }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || 'Failed to create account');
        return;
      }

      setSuccess('Account created successfully! Welcome to SaaTerra 🎉');
      setTimeout(() => {
        window.location.href = '/profile';
      }, 800);
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-1">
          <StackDealLogo className="w-[150px] h-[45px]" />
        </div>
        <h1 className="text-2xl font-black text-slate-950">Join SaaTerra</h1>
        <p className="text-xs text-slate-500 font-medium">
          Get ₹250 instant welcome credits & access 5-Year software pass deals
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block mb-1">
            Full Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="e.g. Ujjawal Tiwari"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#2475FF] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block mb-1">
            Work Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#2475FF] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block mb-1">
            Password (Min 8 Chars, 1 Upper, 1 Special)
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#2475FF] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block mb-1">
            Referral Code (Optional)
          </label>
          <div className="relative">
            <Gift className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. ST-A9B8C"
              value={refCode}
              onChange={(e) => setRefCode(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#2475FF] focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#FF6B35] hover:bg-[#E85A24] disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="text-center text-xs font-bold text-slate-600 pt-2 border-t border-slate-100">
        Already have an account?{' '}
        <Link href="/login" className="text-[#2475FF] hover:underline font-black">
          Log In
        </Link>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#F6F7FB] flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <Suspense fallback={<div className="text-center text-xs font-bold text-slate-500">Loading signup...</div>}>
          <SignupForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
