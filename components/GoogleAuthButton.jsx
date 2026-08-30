'use client';

import { useState, useEffect, useRef } from 'react';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '880398633054-jngmmtq22quaf7pc1dvsruvha2eaplhf.apps.googleusercontent.com';

export default function GoogleAuthButton({ mode = 'login', onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const googleBtnRef = useRef(null);

  // Load Google Identity Services SDK
  useEffect(() => {
    const loadGsi = () => {
      if (typeof window === 'undefined') return;

      if (!document.getElementById('google-gsi-client')) {
        const script = document.createElement('script');
        script.id = 'google-gsi-client';
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          initializeGoogle();
        };
        document.head.appendChild(script);
      } else if (window.google?.accounts?.id) {
        initializeGoogle();
      }
    };

    const initializeGoogle = () => {
      if (!window.google?.accounts?.id) return;

      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        if (googleBtnRef.current) {
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: mode === 'signup' ? 'signup_with' : 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            width: googleBtnRef.current.offsetWidth || 340,
          });
        }
      } catch (err) {
        console.warn('[Google GSI Init Warn]:', err.message);
      }
    };

    loadGsi();
  }, [mode]);

  // Handle Cryptographic ID Token from Google
  const handleGoogleCredentialResponse = async (response) => {
    if (!response?.credential) return;

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

  // Direct OAuth2 Token Client Popup (For custom styled button click)
  const triggerOAuthPopup = () => {
    setError('');
    setLoading(true);

    if (window.google?.accounts?.oauth2) {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'email profile openid',
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            setError(tokenResponse.error_description || 'Google sign-in was cancelled.');
            setLoading(false);
            return;
          }

          try {
            // Fetch Google User Info with Access Token
            const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            });
            const userInfo = await userInfoRes.json();

            if (!userInfo || !userInfo.email) {
              setError('Failed to retrieve email from Google.');
              setLoading(false);
              return;
            }

            // Authenticate on StackDeal Backend
            const backendRes = await fetch('/api/auth/google', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: userInfo.email,
                name: userInfo.name || userInfo.email.split('@')[0],
                avatar: userInfo.picture || null,
              }),
            });

            const backendData = await backendRes.json();
            if (!backendRes.ok || backendData.error) {
              setError(backendData.error || 'Authentication failed');
              setLoading(false);
              return;
            }

            handleSuccessRedirect(backendData.user);
          } catch (err) {
            setError(err.message || 'Failed to authenticate with Google');
            setLoading(false);
          }
        },
      });

      tokenClient.requestAccessToken({ prompt: 'select_account' });
    } else if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          setLoading(false);
        }
      });
    } else {
      // Direct standard Google OAuth redirect fallback
      const redirectUri = typeof window !== 'undefined' ? `${window.location.origin}/api/auth/google` : 'https://stackdeal.in/api/auth/google';
      const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=email%20profile%20openid&prompt=select_account`;
      window.open(googleOAuthUrl, '_blank', 'width=500,height=600');
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
    <div className="w-full space-y-2 font-sans">
      {error && (
        <div className="text-[11px] font-bold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200 text-center animate-shake">
          {error}
        </div>
      )}

      {/* Official Google Styled Clickable Button */}
      <button
        type="button"
        onClick={triggerOAuthPopup}
        disabled={loading}
        className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl text-slate-800 text-xs font-bold shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
      >
        {/* Google 'G' Official Logo SVG */}
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
            ? 'Opening Google Account Chooser...'
            : mode === 'signup'
            ? 'Sign up with Google'
            : 'Continue with Google'}
        </span>
      </button>

      {/* Hidden Native GIS Button Container (for seamless auto-initialization) */}
      <div ref={googleBtnRef} className="hidden" />
    </div>
  );
}
