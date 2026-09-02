'use client';

import { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, CheckCircle2, AlertCircle, Building2, Rocket } from 'lucide-react';
import StackDealLogo from './StackDealLogo';
import GoogleAuthButton from './GoogleAuthButton';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('agency_buyer'); // 'agency_buyer' | 'saas_founder'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const payload = mode === 'login'
        ? { email, password }
        : { name, email, password, userType };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || 'Authentication failed. Please try again.');
        return;
      }

      setSuccessMsg(mode === 'login' ? 'Logged in successfully!' : 'Account created successfully!');
      
      setTimeout(() => {
        if (onSuccess) onSuccess(data.user);
        onClose();
        window.location.reload();
      }, 700);

    } catch (err) {
      setError(err.message || 'Something went wrong. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn"
      style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      <div className="bg-white border border-slate-100 rounded-3xl max-w-[390px] w-full p-6 sm:p-7 shadow-2xl shadow-slate-950/20 relative space-y-4 animate-scaleUp">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100/90 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Vertical Brand Header */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="flex justify-center mb-1">
            <StackDealLogo className="w-[125px] h-[34px]" />
          </div>
          <h3 className="text-xl font-bold tracking-tight text-slate-900">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h3>
          <p className="text-[12px] text-slate-500 font-normal">
            {mode === 'login'
              ? 'Log in to manage your 5-Year SaaS Passes'
              : 'Join 50,000+ Indian agency founders'}
          </p>
        </div>

        {/* Vertical Google Button */}
        <div className="w-full">
          <GoogleAuthButton
            mode={mode}
            userType={userType}
            onSuccess={(user) => {
              if (onSuccess) onSuccess(user);
              onClose();
            }}
          />
        </div>

        {/* Vertical Divider */}
        <div className="relative flex items-center justify-center my-1">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider relative">
            or with email
          </span>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium rounded-xl">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Vertical Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <>
              {/* Vertical Role Option */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setUserType('agency_buyer')}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      userType === 'agency_buyer'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Agency Buyer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('saas_founder')}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      userType === 'saas_founder'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Rocket className="w-3.5 h-3.5 text-amber-500" />
                    <span>SaaS Founder</span>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Work Email
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700 block">
                Password
              </label>
              {mode === 'login' && (
                <a
                  href="/login"
                  className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Forgot?
                </a>
              )}
            </div>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#FF6B35] hover:bg-[#E85A24] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Mode Switcher */}
        <div className="text-center text-xs text-slate-500 font-medium pt-1">
          {mode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); }}
                className="text-blue-600 hover:text-blue-700 font-bold cursor-pointer hover:underline"
              >
                Sign up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); }}
                className="text-blue-600 hover:text-blue-700 font-bold cursor-pointer hover:underline"
              >
                Sign in
              </button>
            </span>
          )}
        </div>

        {/* Security Note */}
        <div className="text-center text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1.5 pt-0.5">
          <span>🔒 256-bit SSL encrypted</span>
          <span>·</span>
          <span>B2B GST compliant</span>
        </div>

      </div>
    </div>
  );
}
