'use client';

import { useState, useEffect, useRef } from 'react';
import AuthModal from './AuthModal';

export default function GuestAuthNudge() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const timerRef = useRef(null);

  const verifyUserSession = async () => {
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' });
      const data = await res.json();
      if (data?.user || data?.authenticated) {
        setIsAuthenticated(true);
        setIsOpen(false);
        if (timerRef.current) clearTimeout(timerRef.current);
        return true;
      } else {
        setIsAuthenticated(false);
        return false;
      }
    } catch {
      setIsAuthenticated(false);
      return false;
    } finally {
      setCheckedAuth(true);
    }
  };

  // Check auth state on mount and on window focus
  useEffect(() => {
    verifyUserSession();

    const handleFocus = () => verifyUserSession();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Periodic Nudge Logic (Only for unauthenticated visitors)
  useEffect(() => {
    if (!checkedAuth || isAuthenticated) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsOpen(false);
      return;
    }

    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    // Skip on admin vault, login, signup, or profile pages
    if (
      pathname.startsWith('/sd-ops-vault-9839') ||
      pathname === '/login' ||
      pathname === '/signup' ||
      pathname === '/profile'
    ) {
      return;
    }

    timerRef.current = setTimeout(async () => {
      // Re-verify right before opening to prevent race conditions
      const isLogged = await verifyUserSession();
      if (!isLogged) {
        setIsOpen(true);
      }
    }, 18000); // 18 seconds interval

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [checkedAuth, isAuthenticated, isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    // Schedule next nudge after 25 seconds if still not logged in
    if (!isAuthenticated) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(async () => {
        const isLogged = await verifyUserSession();
        const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
        if (
          !isLogged &&
          !pathname.startsWith('/sd-ops-vault-9839') &&
          pathname !== '/login' &&
          pathname !== '/signup' &&
          pathname !== '/profile'
        ) {
          setIsOpen(true);
        }
      }, 25000);
    }
  };

  const handleSuccess = (user) => {
    setIsAuthenticated(true);
    setIsOpen(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  if (!checkedAuth || isAuthenticated) return null;

  return (
    <AuthModal
      isOpen={isOpen}
      onClose={handleClose}
      initialMode="signup"
      onSuccess={handleSuccess}
    />
  );
}
