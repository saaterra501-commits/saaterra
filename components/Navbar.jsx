'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Bell, ShoppingCart, User, Menu, X, LogIn, LogOut, Wallet, Shield, Sparkles, Flame, KeyRound, UploadCloud, Layers, Rocket } from 'lucide-react';
import StackDealLogo from './StackDealLogo';
import AuthModal from './AuthModal';
import AiDealAssistantModal from './AiDealAssistantModal';
import { getCartCount } from '@/lib/cart';

const CATEGORIES = [
  { label: 'WhatsApp Tools', href: '/deals?cat=whatsapp' },
  { label: 'AI & GEO SEO', href: '/deals?cat=ai-tools' },
  { label: 'Lead Scraping', href: '/deals?cat=lead-gen' },
  { label: 'CRM & Sales', href: '/deals?cat=crm' },
  { label: 'Video & Design', href: '/deals?cat=design' },
  { label: 'Analytics', href: '/deals?cat=analytics' },
];

export default function Navbar() {
  const [search, setSearch] = useState('');
  const [dealsCatalog, setDealsCatalog] = useState([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [notifsOpen, setNotifsOpen] = useState(false);
  const [userNotifs, setUserNotifs] = useState([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const catRef = useRef(null);
  const userRef = useRef(null);
  const notifRef = useRef(null);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  // Fetch logged in user and notifications on mount
  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data?.user) {
          setCurrentUser(data.user);
        }
      } catch (err) {
        // Silently handled
      }
    }

    async function loadNotifications() {
      try {
        let userEmail = '';
        if (typeof window !== 'undefined') {
          userEmail = (
            localStorage.getItem('stackdeal_vendor_email') ||
            localStorage.getItem('stackdeal_user_email') ||
            ''
          ).trim().toLowerCase();
        }
        const query = userEmail ? `?email=${encodeURIComponent(userEmail)}` : '';
        const res = await fetch(`/api/user/notifications${query}`);
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data?.success && Array.isArray(data?.notifications)) {
          setUserNotifs(data.notifications);
        }
      } catch (err) {
        // Silently handled
      }
    }

    async function loadCatalog() {
      try {
        const res = await fetch('/api/deals');
        const data = await res.json();
        if (isMounted && data?.deals && Array.isArray(data.deals)) {
          setDealsCatalog(data.deals);
        }
      } catch (err) {
        // Silently handled
      }
    }

    checkAuth();
    loadNotifications();
    loadCatalog();
    setCartCount(getCartCount());

    const handleCartSync = () => {
      setCartCount(getCartCount());
    };
    const handleVendorSubmitted = () => {
      loadNotifications();
    };

    window.addEventListener('stackdeal_cart_updated', handleCartSync);
    window.addEventListener('storage', handleCartSync);
    window.addEventListener('vendor_deal_submitted', handleVendorSubmitted);
    window.addEventListener('focus', loadNotifications);

    const interval = setInterval(loadNotifications, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('stackdeal_cart_updated', handleCartSync);
      window.removeEventListener('storage', handleCartSync);
      window.removeEventListener('vendor_deal_submitted', handleVendorSubmitted);
      window.removeEventListener('focus', loadNotifications);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setCurrentUser(null);
      window.location.href = '/';
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (!search.trim()) return;
    setSearchFocused(false);
    setMobileSearchOpen(false);
    window.location.href = `/deals?q=${encodeURIComponent(search.trim())}`;
  };

  const matchedSuggestions = search.trim().length > 0 ? dealsCatalog.filter((d) => {
    const q = search.toLowerCase().trim();
    return (
      (d.title || '').toLowerCase().includes(q) ||
      (d.tagline || '').toLowerCase().includes(q) ||
      (d.category || '').toLowerCase().includes(q) ||
      (d.vendorName || '').toLowerCase().includes(q) ||
      (d.slug || '').toLowerCase().includes(q) ||
      (d.atAGlance?.alternativeTo || '').toLowerCase().includes(q) ||
      (d.atAGlance?.bestFor || '').toLowerCase().includes(q) ||
      (Array.isArray(d.tldr) && d.tldr.some((t) => (t || '').toLowerCase().includes(q)))
    );
  }).slice(0, 5) : [];

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('nav-search')?.focus();
        setSearchFocused(true);
      }
      if (e.key === 'Escape') {
        setCatOpen(false);
        setUserDropdown(false);
        setNotifsOpen(false);
        setSearchFocused(false);
        setMobileSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserDropdown(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifsOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchFocused(false);
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target)) setMobileSearchOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 font-sans">

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[68px] flex items-center justify-between gap-4">
        
        {/* 1. Logo */}
        <Link href="/" className="flex items-center shrink-0 hover:opacity-95 transition-opacity mr-2">
          <StackDealLogo className="w-[170px] sm:w-[185px] h-[48px] sm:h-[52px]" />
        </Link>

        {/* 2. Search Input Box with Live Keyword Autocomplete & Dropdown */}
        <div className="hidden md:flex items-center flex-1 max-w-md relative" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="nav-search"
              type="text"
              placeholder="Search by keyword, tool, competitor (⌘+k)"
              value={search}
              onFocus={() => setSearchFocused(true)}
              onChange={(e) => {
                setSearch(e.target.value);
                setSearchFocused(true);
              }}
              className="w-full pl-11 pr-9 py-2.5 text-xs font-medium text-slate-900 bg-[#EEF2F6] border border-transparent rounded-full focus:outline-none focus:bg-white focus:border-slate-300 transition-all placeholder:text-slate-500 shadow-xs"
              suppressHydrationWarning
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full cursor-pointer text-xs"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </form>

          {/* Live Search Suggestions Dropdown */}
          {searchFocused && search.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn max-h-[420px] overflow-y-auto">
              <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-100">
                <span>Matching Deals ({matchedSuggestions.length})</span>
                <span className="text-slate-400 font-normal">Press Enter ↵</span>
              </div>

              <div className="divide-y divide-slate-100">
                {matchedSuggestions.length > 0 ? (
                  matchedSuggestions.map((d) => (
                    <Link
                      key={d.slug || d.id}
                      href={`/deals/${d.slug}`}
                      onClick={() => setSearchFocused(false)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200/60 flex items-center justify-center">
                        {d.screenshot || d.heroImage || d.vendorLogo ? (
                          <img
                            src={d.screenshot || d.heroImage || d.vendorLogo}
                            alt={d.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs">⚡</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[9px] font-black text-[#2475FF] bg-blue-50 px-1.5 py-0.5 rounded uppercase">
                            {d.category || 'SaaS'}
                          </span>
                          {d.atAGlance?.alternativeTo && (
                            <span className="text-[9px] font-medium text-slate-400 truncate">
                              vs {d.atAGlance.alternativeTo}
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-[#FF6B35] transition-colors">
                          {d.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate">
                          {d.tagline}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-black text-slate-950">
                          ₹{(d.tier1Price || d.price || 1999).toLocaleString('en-IN')}
                        </div>
                        <div className="text-[9px] font-bold text-emerald-600">
                          5-Year Pass
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="py-6 px-4 text-center space-y-2">
                    <p className="text-xs text-slate-500 font-medium">
                      No direct deals found for &ldquo;{search}&rdquo;
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchFocused(false);
                        setAiModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-black text-[#FF6B35] bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Ask AI Matchmaker for suggestions</span>
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleSearchSubmit}
                className="w-full mt-1 pt-2 pb-1 text-center text-[11px] font-black text-[#2475FF] hover:text-blue-700 hover:bg-blue-50/50 rounded-xl transition-colors cursor-pointer border-t border-slate-100 flex items-center justify-center gap-1"
              >
                <span>View all search results for &ldquo;{search}&rdquo;</span>
                <span>➔</span>
              </button>
            </div>
          )}
        </div>

        {/* 3. Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-800">
          
          {/* Software Dropdown */}
          <div className="relative" ref={catRef}>
            <button
              onClick={() => setCatOpen(!catOpen)}
              className="flex items-center gap-1 hover:text-slate-950 transition-colors py-2 cursor-pointer"
              suppressHydrationWarning
            >
              <span>Software</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${catOpen ? 'rotate-180' : ''}`} />
            </button>

            {catOpen && (
              <div className="absolute left-0 top-full w-52 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 space-y-0.5 z-50">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    onClick={() => setCatOpen(false)}
                    className="block px-3.5 py-2.5 rounded-xl hover:bg-slate-100 font-bold text-slate-800 text-xs transition-colors"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/deals" className="hover:text-slate-950 transition-colors">
            New arrivals
          </Link>

          <Link href="/plus" className="flex items-center gap-1 bg-[#1A1828] text-amber-400 font-black px-2.5 py-1 rounded-md text-[10px] tracking-wider uppercase hover:bg-slate-900 transition-colors">
            PLUS
          </Link>

        </nav>

        {/* 4. Right Utility Icons */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 text-slate-800">

          {/* Become a Vendor Feature Button */}
          <Link
            href="/submit"
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-950 hover:bg-black text-white border border-slate-800 hover:border-orange-500/50 text-xs font-bold transition-all shadow-xs hover:shadow-md group cursor-pointer"
            title="List your SaaS tool on StackDeal"
          >
            <UploadCloud className="w-3.5 h-3.5 text-[#FF6B35] group-hover:scale-110 transition-transform" />
            <span>Become a Vendor</span>
          </Link>
          
          {/* Live User & Vendor Notification Bell */}
          <button
            onClick={() => setNotifsOpen(true)}
            className="relative hover:text-slate-950 transition-colors p-1 hidden sm:block cursor-pointer"
            title="Notifications"
            suppressHydrationWarning
          >
            <Bell className="w-5 h-5 text-slate-700 hover:text-slate-950" />
            {userNotifs.filter((n) => !n.isRead).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FF6B35] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {userNotifs.filter((n) => !n.isRead).length}
              </span>
            )}
          </button>

          {/* Shopping Cart */}
          <Link href="/cart" className="hover:text-slate-950 transition-colors p-1 relative hidden sm:block" title="Shopping Cart">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FF6B00] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-fadeIn">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Auth Cluster */}
          {currentUser ? (
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full border border-slate-200 transition-all cursor-pointer"
                suppressHydrationWarning
              >
                <div className="w-6 h-6 rounded-full bg-[#2475FF] text-white flex items-center justify-center text-xs font-black">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-bold text-slate-900 max-w-[90px] truncate hidden md:inline">
                  {currentUser.name?.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {userDropdown && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 space-y-1 z-50 text-xs font-bold">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <div className="font-black text-slate-950 truncate">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-400 font-medium truncate">{currentUser.email}</div>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setUserDropdown(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-800 transition-colors"
                  >
                    <User className="w-4 h-4 text-[#2475FF]" />
                    <span>My 5-Year Passes</span>
                  </Link>

                  {currentUser.role === 'admin' && (
                    <Link
                      href="/sd-ops-vault-9839"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-amber-50 text-amber-600 font-bold transition-colors"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Ops Vault (Admin)</span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 font-black transition-colors text-left cursor-pointer border-t border-slate-100 mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-[#FF6B35] hover:bg-[#E85A24] text-white text-xs font-black rounded-full transition-all cursor-pointer shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log in</span>
            </button>
          )}

          {/* Mobile Search Toggle Button */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden p-1 text-slate-700 hover:text-slate-950 transition-colors"
            aria-label="Search deals"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-1 text-slate-800 hover:text-slate-950"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>

      </div>

      {/* Mobile Search Bar Dropdown */}
      {mobileSearchOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white p-3 shadow-md animate-fadeIn" ref={mobileSearchRef}>
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              autoFocus
              placeholder="Search keyword (e.g. WhatsApp, SEO, WATI)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2 text-xs font-medium text-slate-900 bg-[#EEF2F6] border border-transparent rounded-full focus:outline-none focus:bg-white focus:border-slate-300"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"
              >
                ✕
              </button>
            )}
          </form>

          {/* Quick suggestions on mobile */}
          {matchedSuggestions.length > 0 && (
            <div className="mt-2 divide-y divide-slate-100 bg-slate-50 rounded-xl p-1.5 max-h-48 overflow-y-auto">
              {matchedSuggestions.map((d) => (
                <Link
                  key={d.slug || d.id}
                  href={`/deals/${d.slug}`}
                  onClick={() => setMobileSearchOpen(false)}
                  className="flex items-center justify-between p-2 hover:bg-white rounded-lg text-xs"
                >
                  <div className="truncate mr-2 font-bold text-slate-900">
                    {d.title}
                  </div>
                  <div className="text-right shrink-0 text-[10px] font-black text-[#FF6B35]">
                    ₹{(d.tier1Price || d.price || 1999).toLocaleString('en-IN')}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {search.trim().length > 0 && (
            <button
              onClick={handleSearchSubmit}
              className="w-full mt-2 py-2 bg-[#FF6B35] text-white text-xs font-black rounded-xl text-center cursor-pointer shadow-sm"
            >
              Search &ldquo;{search}&rdquo; ➔
            </button>
          )}
        </div>
      )}

      {/* ── CLEAN, MODERN MOBILE DRAWER ── */}
      {menuOpen && (
        <div className="lg:hidden border-t border-slate-200/80 bg-white p-4 space-y-3.5 font-sans text-xs shadow-2xl animate-fadeIn">
          
          {/* 1. User Header / Guest Welcome Card */}
          {currentUser ? (
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF6B35] to-[#2475FF] text-white flex items-center justify-center font-black text-xs shadow-xs shrink-0">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium truncate">
                    {currentUser.email}
                  </div>
                </div>
              </div>
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-bold text-slate-700 hover:text-slate-900 shadow-2xs shrink-0 transition-colors"
              >
                My Passes
              </Link>
            </div>
          ) : (
            <div className="p-3.5 bg-gradient-to-r from-orange-50/80 to-amber-50/80 border border-orange-200/60 rounded-2xl flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-slate-900">Welcome to StackDeal! 👋</div>
                <div className="text-[10px] text-slate-600 font-medium mt-0.5">Explore 5-Year SaaS Passes with GST invoices</div>
              </div>
              <button
                onClick={() => { setMenuOpen(false); setAuthModalOpen(true); }}
                className="px-3 py-1.5 bg-[#FF6B35] hover:bg-[#e85a26] text-white text-xs font-bold rounded-xl shadow-xs shrink-0 transition-colors cursor-pointer"
              >
                Log In
              </button>
            </div>
          )}

          {/* 2. Main Navigation 2x2 Grid Cards */}
          <div className="grid grid-cols-2 gap-2">
            {/* View Cart */}
            <Link
              href="/cart"
              onClick={() => setMenuOpen(false)}
              className="p-3 rounded-2xl bg-slate-50/80 hover:bg-slate-100 border border-slate-200/60 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-100/80 text-[#FF6B35] flex items-center justify-center shrink-0">
                  <ShoppingCart className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-slate-800 group-hover:text-slate-950">Cart</span>
              </div>
              {cartCount > 0 ? (
                <span className="bg-[#FF6B35] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              ) : (
                <span className="text-slate-400 text-[10px] font-medium">0</span>
              )}
            </Link>

            {/* New Arrivals / All Deals */}
            <Link
              href="/deals"
              onClick={() => setMenuOpen(false)}
              className="p-3 rounded-2xl bg-slate-50/80 hover:bg-slate-100 border border-slate-200/60 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-100/80 text-rose-600 flex items-center justify-center shrink-0">
                  <Flame className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-slate-800 group-hover:text-slate-950">All Deals</span>
              </div>
              <span className="text-[10px] text-slate-400 font-bold">5-Yr</span>
            </Link>

            {/* Redeem Code */}
            <Link
              href="/redeem"
              onClick={() => setMenuOpen(false)}
              className="p-3 rounded-2xl bg-slate-50/80 hover:bg-slate-100 border border-slate-200/60 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0">
                  <KeyRound className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-slate-800 group-hover:text-slate-950">Redeem</span>
              </div>
              <span className="text-[10px] text-slate-400 font-bold">Code</span>
            </Link>

            {/* StackDeal PLUS Club */}
            <Link
              href="/plus"
              onClick={() => setMenuOpen(false)}
              className="p-3 rounded-2xl bg-[#0A0F1E] hover:bg-slate-900 border border-slate-800 text-amber-400 flex items-center justify-between transition-all group shadow-xs"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="font-black text-amber-300">PLUS Club</span>
              </div>
              <span className="text-[9px] bg-amber-400/20 text-amber-300 font-black px-1.5 py-0.5 rounded">
                -10%
              </span>
            </Link>
          </div>

          {/* 3. Dedicated Become a Vendor / Creator Spotlight Banner */}
          <Link
            href="/submit"
            onClick={() => setMenuOpen(false)}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white border border-slate-800 flex items-center justify-between group transition-all shadow-md hover:border-orange-500/50"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B35] to-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Rocket className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-white">Become a Vendor</span>
                </div>
                <p className="text-[10px] text-slate-300 font-medium truncate mt-0.5">
                  Launch 5-Year Passes & get 50–100 paying customers
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-orange-400 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-2">
              Apply ➔
            </span>
          </Link>

          {/* 4. Secondary Actions / Utility Rows */}
          <div className="divide-y divide-slate-100 border border-slate-200/70 rounded-2xl overflow-hidden bg-white">
            <Link
              href="/redeem"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors text-slate-700 font-semibold"
            >
              <div className="flex items-center gap-2.5">
                <KeyRound className="w-4 h-4 text-slate-400" />
                <span>Redeem License Code</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 -rotate-90" />
            </Link>

            <Link
              href="/submit"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors text-slate-700 font-semibold"
            >
              <div className="flex items-center gap-2.5">
                <UploadCloud className="w-4 h-4 text-slate-400" />
                <span>List Your SaaS Tool</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 -rotate-90" />
            </Link>

            {currentUser?.role === 'admin' && (
              <Link
                href="/sd-ops-vault-9839"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between p-3 hover:bg-amber-50 transition-colors text-amber-700 font-bold"
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-amber-500" />
                  <span>Ops Vault (Admin)</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-amber-500 -rotate-90" />
              </Link>
            )}

            {currentUser && (
              <button
                onClick={() => { setMenuOpen(false); handleLogout(); }}
                className="w-full flex items-center justify-between p-3 hover:bg-red-50 transition-colors text-red-600 font-bold text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Log Out ({currentUser.name?.split(' ')[0]})</span>
                </div>
              </button>
            )}
          </div>

        </div>
      )}

      {/* ── RIGHT-SIDE SLIDE-OVER NOTIFICATION DRAWER ── */}
      {notifsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop Blur Overlay */}
          <div
            onClick={() => setNotifsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fadeIn"
          />

          {/* Right Slide-in Drawer Sheet */}
          <div className="relative w-full sm:w-[420px] bg-white h-full shadow-2xl z-10 flex flex-col animate-slideLeft border-l border-slate-200">
            
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FF6B35]/15 text-[#FF6B35] flex items-center justify-center shadow-xs">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-950">Notifications & Activity</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Real-time updates on your software & passes</p>
                </div>
              </div>

              <button
                onClick={() => setNotifsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                title="Close Drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sub-bar: Unread Count & Actions */}
            <div className="px-5 py-3 bg-white border-b border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] font-black text-[#2475FF] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full uppercase">
                {userNotifs.filter((n) => !n.isRead).length} Unread Updates
              </span>

              {userNotifs.length > 0 && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={async () => {
                      setUserNotifs(userNotifs.map((n) => ({ ...n, isRead: true })));
                      try {
                        const email = typeof window !== 'undefined' ? (localStorage.getItem('stackdeal_vendor_email') || localStorage.getItem('stackdeal_user_email') || '') : '';
                        await fetch('/api/user/notifications', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ markAllRead: true, email }),
                        });
                      } catch (e) {}
                    }}
                    className="text-slate-500 hover:text-slate-900 font-bold text-xs cursor-pointer"
                  >
                    Mark all read
                  </button>

                  <button
                    onClick={async () => {
                      setUserNotifs([]);
                      try {
                        const email = typeof window !== 'undefined' ? (localStorage.getItem('stackdeal_vendor_email') || localStorage.getItem('stackdeal_user_email') || '') : '';
                        const query = email ? `?email=${encodeURIComponent(email)}` : '';
                        await fetch(`/api/user/notifications${query}`, { method: 'DELETE' });
                      } catch (e) {}
                    }}
                    className="text-red-500 hover:text-red-700 font-bold text-xs cursor-pointer"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Scrollable Notifications List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {userNotifs.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                    <Bell className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-bold text-slate-700">No notifications yet</div>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">You're all caught up! Updates regarding software approvals and passes will show here.</p>
                </div>
              ) : (
                userNotifs.map((notif) => {
                  const isApproved = notif.type === 'submission_approved';
                  const isRejected = notif.type === 'submission_rejected';

                  return (
                    <div
                      key={notif.id}
                      className={`p-4 rounded-2xl border text-xs space-y-2 transition-all shadow-xs ${
                        isApproved
                          ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-emerald-100'
                          : isRejected
                          ? 'bg-red-50/80 border-red-300 text-red-950 shadow-red-100'
                          : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-black text-sm flex items-center gap-2">
                          <span className="text-base">{isApproved ? '🎉' : isRejected ? '⚠️' : '🔔'}</span>
                          <span>{notif.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {new Date(notif.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 font-medium leading-relaxed">{notif.message}</p>

                      {notif.link && (
                        <div className="pt-2 flex justify-end">
                          <Link
                            href={notif.link}
                            onClick={() => setNotifsOpen(false)}
                            className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1 shadow-sm ${
                              isApproved
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                : isRejected
                                ? 'bg-red-600 hover:bg-red-500 text-white'
                                : 'bg-[#2475FF] hover:bg-blue-600 text-white'
                            }`}
                          >
                            <span>{isApproved ? 'View Live Software Page' : isRejected ? 'Edit Submission' : 'View Link'}</span>
                            <span className="text-xs">➔</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 bg-[#F8FAFC] flex items-center justify-between">
              <Link
                href="/profile"
                onClick={() => setNotifsOpen(false)}
                className="w-full py-3 bg-[#0A0F1E] hover:bg-slate-800 text-white text-xs font-black rounded-xl text-center shadow transition-all flex items-center justify-center gap-2"
              >
                <span>Go to Founder & Account Dashboard</span>
                <span>➔</span>
              </Link>
            </div>

          </div>
        </div>
      )}

      {/* Auth Modal Popup */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(user) => setCurrentUser(user)}
      />

      {/* StackDeal AI Deal Matchmaker Copilot Modal */}
      <AiDealAssistantModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
      />

      {/* Floating Stacky AI Assistant Pill at Bottom Right */}
      {!aiModalOpen && (
        <button
          type="button"
          onClick={() => setAiModalOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-white/95 hover:bg-white backdrop-blur-md text-slate-900 border-2 border-[#FF6B35] px-4 py-2.5 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_35px_rgba(255,107,53,0.3)] flex items-center gap-2.5 font-black text-xs transition-all hover:scale-105 cursor-pointer group"
        >
          <div className="w-7 h-7 rounded-lg bg-[#FFF4EE] border border-[#FFE2D5] p-0.5 flex items-center justify-center shadow-xs shrink-0">
            <img
              src="/stackdeal-icon.png"
              alt="StackDeal"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col items-start leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-900 group-hover:text-[#FF6B35] transition-colors font-bold text-xs">Stacky</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <span className="text-[9px] text-slate-500 font-semibold">Ask FAQs & Deals</span>
          </div>
        </button>
      )}

    </header>
  );
}
