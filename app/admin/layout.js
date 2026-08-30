'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Tag, ShoppingBag, Users, MessageSquare, Gift,
  Crown, ExternalLink, ShieldCheck, Settings, LogOut, Bell, Clock,
  CheckCircle2, ArrowRight, X
} from 'lucide-react';
import StackDealLogo from '../../components/StackDealLogo';

const NAV_ITEMS = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Deals & Tiers', href: '/admin/deals', icon: Tag, showPendingBadge: true },
  { label: 'Orders & GST Invoices', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Vendor Payouts (70/30)', href: '/admin/vendors', icon: Users },
  { label: 'Q&A & Moderation', href: '/admin/qa', icon: MessageSquare },
  { label: 'Referral Rewards', href: '/admin/referrals', icon: Gift },
  { label: 'StackDeal Plus VIP', href: '/admin/plus', icon: Crown },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifsDropdown, setShowNotifsDropdown] = useState(false);

  useEffect(() => {
    async function loadNotifs() {
      try {
        const res = await fetch('/api/admin/notifications');
        const data = await res.json();
        if (data?.success) {
          setPendingCount(data.pendingCount || 0);
          setNotifications(data.notifications || []);
        }
      } catch (e) {}
    }

    loadNotifs();
    const interval = setInterval(loadNotifs, 10000);
    return () => clearInterval(interval);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-slate-100 flex font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#070B16] border-r border-white/10 flex flex-col shrink-0">
        
        {/* Brand Logo */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link href="/admin">
            <StackDealLogo className="w-[140px] h-[40px]" />
          </Link>
          <span className="bg-[#FF6B35] text-white text-[9px] font-black px-2 py-0.5 rounded uppercase">
            ADMIN
          </span>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 flex-1">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-3 mb-2">
            Command Center
          </div>

          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            const hasPending = item.showPendingBadge && pendingCount > 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? 'bg-[#2475FF] text-white shadow-lg shadow-[#2475FF]/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>

                {hasPending && (
                  <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs animate-pulse">
                    {pendingCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Store Link & Admin Info */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 transition-all border border-white/10"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#2475FF]" /> Live Store
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">ONLINE</span>
          </Link>

          <div className="flex items-center justify-between px-3 pt-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#2475FF] flex items-center justify-center font-black text-xs">
                A
              </div>
              <div className="text-xs">
                <div className="font-bold text-white leading-none">Super Admin</div>
                <div className="text-[10px] text-slate-400">admin@stackdeal.in</div>
              </div>
            </div>
            <Link href="/" title="Log out">
              <LogOut className="w-4 h-4 text-slate-500 hover:text-red-400 transition-colors" />
            </Link>
          </div>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-[#070B16] border-b border-white/10 px-6 flex items-center justify-between shrink-0 relative z-30">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-black text-white">StackDeal Command Center</h1>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
              System Active
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-xs font-mono text-slate-400 hidden sm:block">
              {new Date().toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </div>

            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifsDropdown(!showNotifsDropdown)}
                className="relative w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
                title="Vendor Notifications"
              >
                <Bell className={`w-4 h-4 ${pendingCount > 0 ? 'text-amber-400' : ''}`} />
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                    {pendingCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Panel */}
              {showNotifsDropdown && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#0E1528] border border-white/15 rounded-2xl shadow-2xl p-4 space-y-3 z-50 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-amber-400" />
                      <h4 className="text-xs font-black text-white">Admin Activity Alerts</h4>
                    </div>
                    <span className="text-[10px] font-black bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded uppercase">
                      {pendingCount} Pending
                    </span>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-500 font-medium">
                        No new notifications. Everything is caught up!
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className="bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/10 space-y-1 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-amber-400">{notif.title}</span>
                            <span className="text-[9px] text-slate-500 font-mono">
                              {new Date(notif.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-snug">{notif.message}</p>
                          <div className="pt-1.5 flex justify-end">
                            <Link
                              href="/admin/deals"
                              onClick={() => setShowNotifsDropdown(false)}
                              className="text-[10px] font-black text-[#2475FF] hover:underline flex items-center gap-1"
                            >
                              <span>Review & Approve</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <Link
                      href="/admin/deals"
                      onClick={() => setShowNotifsDropdown(false)}
                      className="block text-center py-2 bg-[#2475FF] hover:bg-blue-600 text-white text-xs font-black rounded-xl transition-all"
                    >
                      Go to Deals Moderation Center
                    </Link>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  );
}
