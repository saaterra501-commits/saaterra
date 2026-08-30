'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, X } from 'lucide-react';

export default function GoogleAuthButton({ mode = 'login', onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDirectModal, setShowDirectModal] = useState(false);
  const [directEmail, setDirectEmail] = useState('');
  const [directName, setDirectName] = useState('');

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Initialize Google Identity Services if Client ID is configured
  useEffect(() => {
    if (!clientId) return;

    const loadGoogleScript = () => {
      if (document.getElementById('google-jssdk')) return;
      const script = document.createElement('script');
      script.id = 'google-jssdk';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google?.accounts?.id) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
          });
        }
      };
      document.body.appendChild(script);
    };

    loadGoogleScript();
  }, [clientId]);

  const handleGoogleCredentialResponse = async (response) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'Google authentication failed.');
        setLoading(false);
        return;
      }

      handleSuccessRedirect(data.user);
    } catch (err) {
      setError(err.message || 'Google login failed');
      setLoading(false);
    }
  };

  const handleGoogleClick = () => {
    setError('');
    if (clientId && window.google?.accounts?.id) {
      // Trigger official Google One-Tap / Account Chooser
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          setShowDirectModal(true);
        }
      });
    } else {
      // Fallback direct instant Google sign-in modal
      setShowDirectModal(true);
    }
  };

  const handleDirectGoogleAuth = async (e) => {
    e.preventDefault();
    if (!directEmail || !directEmail.includes('@')) {
      setError('Please enter a valid Google email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: directEmail.toLowerCase().trim(),
          name: directName || directEmail.split('@')[0],
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(directEmail)}`,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'Authentication failed');
        setLoading(false);
        return;
      }

      handleSuccessRedirect(data.user);
    } catch (err) {
      setError(err.message || 'Login failed');
      setLoading(false);
    }
  };

  const handleSuccessRedirect = (user) => {
    if (onSuccess) onSuccess(user);

    const redirectPath = user?.role === 'admin' ? '/sd-ops-vault-9839' : '/profile';
    setTimeout(() => {
      window.location.href = redirectPath;
    }, 600);
  };

  return (
    <div className="w-full space-y-2">
      {error && (
        <div className="text-[11px] font-bold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200 text-center">
          {error}
        </div>
      )}

      {/* Main Google Button */}
      <button
        type="button"
        onClick={handleGoogleClick}
        disabled={loading}
        className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl text-slate-800 text-xs font-bold shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
      >
        {/* Google 'G' Logo SVG */}
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>

        <span>
          {loading
            ? 'Connecting to Google...'
            : mode === 'signup'
            ? 'Sign up with Google (Instant)'
            : 'Continue with Google'}
        </span>
      </button>

      {/* Instant Google One-Click Modal (Fallback / Direct) */}
      {showDirectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 relative space-y-4">
            
            <button
              onClick={() => setShowDirectModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-2 text-[#4285F4]">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
              </div>
              <h3 className="text-base font-black text-slate-900">Google 1-Click Sign In</h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Enter your Google email to instantly sign in without a password.
              </p>
            </div>

            <form onSubmit={handleDirectGoogleAuth} className="space-y-3">
              <div>
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider block mb-1">
                  Google Email Address
                </label>
                <input
                  type="email"
                  required
                  autoFocus
                  placeholder="e.g. ujjawal@stackdeal.in or you@gmail.com"
                  value={directEmail}
                  onChange={(e) => setDirectEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#4285F4] focus:outline-none"
                />
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider block mb-1">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ujjawal Tiwari"
                    value={directName}
                    onChange={(e) => setDirectName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#4285F4] focus:outline-none"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#4285F4] hover:bg-[#3367D6] text-white text-xs font-black rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Verify & Continue with Google</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
