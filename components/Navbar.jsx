'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Bell, ShoppingCart, User, Menu, X, LogIn, LogOut, Wallet, Shield, Sparkles } from 'lucide-react';
import StackDealLogo from './StackDealLogo';
import AuthModal from './AuthModal';
import AiDealAssistantModal from './AiDealAssistantModal';

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [notifsOpen, setNotifsOpen] = useState(false);
  const [userNotifs, setUserNotifs] = useState([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const catRef = useRef(null);
  const userRef = useRef(null);
  const notifRef = useRef(null);

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
        const res = await fetch('/api/user/notifications');
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data?.success && Array.isArray(data?.notifications)) {
          setUserNotifs(data.notifications);
        }
      } catch (err) {
        // Silently handled
      }
    }

    checkAuth();
    loadNotifications();
    const interval = setInterval(loadNotifications, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
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

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('nav-search')?.focus();
      }
      if (e.key === 'Escape') {
        setCatOpen(false);
        setUserDropdown(false);
        setNotifsOpen(false);
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

        {/* 2. AppSumo Search Input Box with (⌘+k) Pill */}
        <div className="hidden md:flex items-center flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="nav-search"
            type="text"
            placeholder="Search products (⌘+k)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 text-xs font-medium text-slate-900 bg-[#EEF2F6] border border-transparent rounded-full focus:outline-none focus:bg-white focus:border-slate-300 transition-all placeholder:text-slate-500"
            suppressHydrationWarning
          />
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

          <Link href="/deals" className="hover:text-slate-950 transition-colors">
            Ending soon
          </Link>

          <Link href="/compare" className="hover:text-slate-950 transition-colors">
            Compare
          </Link>

          <Link href="/deals" className="hover:text-slate-950 transition-colors flex items-center gap-1.5">
            <span>Radar</span>
            <span className="bg-blue-100 text-blue-700 text-[9px] font-black px-1.5 py-0.5 rounded border border-blue-200 uppercase">
              NEW
            </span>
          </Link>

          <Link href="/contact" className="hover:text-slate-950 transition-colors font-bold">
            Contact
          </Link>

          <Link href="/plus" className="flex items-center gap-1 bg-[#1A1828] text-amber-400 font-black px-2.5 py-1 rounded-md text-[10px] tracking-wider uppercase hover:bg-slate-900 transition-colors">
            PLUS
          </Link>

        </nav>

        {/* 4. Right Utility Icons */}
        <div className="flex items-center gap-3 shrink-0 text-slate-800">
          
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
            <span className="absolute -top-1 -right-1 bg-[#FF6B00] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              2
            </span>
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

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-1 text-slate-800 hover:text-slate-950"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white p-4 space-y-3 font-bold text-xs">
          <Link href="/cart" className="block py-2 text-slate-900 font-black">View Cart (2 Items)</Link>
          <Link href="/deals" className="block py-2 text-slate-900 font-black">New arrivals</Link>
          <Link href="/deals" className="block py-2 text-slate-900 font-black">Ending soon</Link>
          <Link href="/compare" className="block py-2 text-slate-900 font-black">Compare Software</Link>
          <Link href="/plus" className="block py-2 text-amber-600 font-black">StackDeal PLUS (10% OFF)</Link>
          <Link href="/contact" className="block py-2 text-slate-900 font-black">Contact Support 💬</Link>
          <Link href="/redeem" className="block py-2 text-slate-700">Redeem License Code</Link>
          <Link href="/submit" className="block py-2 text-slate-700">List Your SaaS Tool</Link>
          <Link href="/profile" className="block py-2 text-slate-700">My Passes Dashboard</Link>
          {currentUser ? (
            <button onClick={handleLogout} className="block py-2 text-red-600 font-black text-left">
              Log Out ({currentUser.name})
            </button>
          ) : (
            <button onClick={() => { setMenuOpen(false); setAuthModalOpen(true); }} className="block py-2 text-[#FF6B35] font-black text-left">
              Log In / Sign Up
            </button>
          )}
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
                        await fetch('/api/user/notifications', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ markAllRead: true }),
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
                        await fetch('/api/user/notifications', { method: 'DELETE' });
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

      {/* Floating AI Deal Assistant Pill at Bottom Right */}
      <button
        type="button"
        onClick={() => setAiModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#070B16] hover:bg-[#0D1527] text-white border-2 border-[#FF6B35] px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2.5 font-black text-xs transition-all hover:scale-105 cursor-pointer group"
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#FF6B35] to-[#2475FF] flex items-center justify-center text-[#FFD519]">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        </div>
        <span className="group-hover:text-[#FFD519] transition-colors">✨ Ask AI Matchmaker</span>
      </button>

    </header>
  );
}
