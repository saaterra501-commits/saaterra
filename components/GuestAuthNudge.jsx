'use client';

import { useState, useEffect, useRef } from 'react';
import AuthModal from './AuthModal';

export default function GuestAuthNudge() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const timerRef = useRef(null);

  // Check auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data?.authenticated && data?.user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setCheckedAuth(true);
      }
    };

    checkAuth();
  }, []);

  // Periodic Nudge Logic (Every 15-20 seconds for unauthenticated visitors)
  useEffect(() => {
    if (!checkedAuth || isAuthenticated) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const scheduleNudge = () => {
      timerRef.current = setTimeout(() => {
        // Only open if modal is not already open and not on admin vault
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/sd-ops-vault-9839')) {
          setIsOpen(true);
        }
      }, 16000); // 16 seconds nudge
    };

    scheduleNudge();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [checkedAuth, isAuthenticated, isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    // Schedule next nudge after 20 seconds if still not logged in
    if (!isAuthenticated) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/sd-ops-vault-9839')) {
          setIsOpen(true);
        }
      }, 20000); // 20 seconds interval
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
