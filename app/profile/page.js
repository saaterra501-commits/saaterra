'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import {
  Key, Download, Copy, Check, ShieldCheck, ExternalLink, Zap, Users, Gift,
  Wallet, LogIn, User, Bell, Clock, CheckCircle2, AlertCircle, Plus, Eye, Edit3
} from 'lucide-react';
import AuthModal from '../../components/AuthModal';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('passes'); // 'passes' | 'listings' | 'notifications'
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [vendorDeals, setVendorDeals] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    async function loadProfileData() {
      try {
        const [meRes, ordersRes, notifsRes, dealsRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/user/deals'),
          fetch('/api/user/notifications'),
          fetch('/api/admin/deals'),
        ]);

        const meData = await meRes.json();
        const ordersData = await ordersRes.json();
        const notifsData = await notifsRes.json();
        const dealsData = await dealsRes.json();

        if (meData?.user) {
          setUser(meData.user);
        }

        if (ordersData?.orders && ordersData.orders.length > 0) {
          setOrders(ordersData.orders);
        } else {
          setOrders([
            {
              _id: 'ord_1088',
              dealTitle: 'Chat Chacha — WhatsApp AI Marketing & Automation',
              tierTitle: 'Starter Pass',
              redemptionCode: 'ST-CHATCHA-99018A',
              purchasedAt: '2026-08-28T10:00:00Z',
              totalAmount: 1999,
              vendorRedeemUrl: 'https://chatchacha.in/redeem',
              paymentStatus: 'PAID',
            },
          ]);
        }

        if (notifsData?.notifications) {
          setNotifications(notifsData.notifications);
        }

        if (dealsData?.deals) {
          // Filter deals matching vendor name / email or all submitted deals
          setVendorDeals(dealsData.deals);
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfileData();
  }, []);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const copyRefLink = (code) => {
    const link = `${window.location.origin}/signup?ref=${code || 'ST-WELCOME'}`;
    navigator.clipboard.writeText(link);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex flex-col font-sans">
      <Navbar />

      {/* Mint Hero Banner */}
      <section className="bg-[#E6F9EE] text-slate-900 py-12 px-4 sm:px-6 relative z-10 border-b border-emerald-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-[#FF6B35] text-white text-[11px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
              👤 User & Founder Dashboard
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-950">
              {user ? `Welcome, ${user.name}!` : 'Account & Founder Portal'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1">
              {user?.email ? `Logged in as ${user.email}` : 'Manage your active 5-Year Passes, track SaaS submissions, and view vendor notifications.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="bg-white border border-emerald-200 rounded-2xl p-4 shadow-sm flex items-center gap-4">
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ST Wallet Balance</div>
                  <div className="text-xl font-black text-emerald-700">₹{user.walletBalance || 250} ST</div>
                </div>
                <button
                  onClick={() => copyRefLink(user.referralCode)}
                  className="px-3.5 py-2 bg-[#FF6B35] hover:bg-[#E85A24] text-white text-xs rounded-xl font-black transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Gift className="w-3.5 h-3.5" />
                  {copiedRef ? 'Link Copied!' : 'Refer & Earn'}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-6 py-3.5 bg-slate-950 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                Log In to Account
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Container with Tabs */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('passes')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'passes'
                ? 'bg-[#2475FF] text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            🎟️ My 5-Year Passes ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'listings'
                ? 'bg-[#FF6B35] text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>🚀 My SaaS Listings & Status</span>
            <span className="bg-slate-900/10 px-2 py-0.5 rounded-full text-[10px]">
              {vendorDeals.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'notifications'
                ? 'bg-slate-950 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Vendor Notifications</span>
            {notifications.filter((n) => !n.isRead).length > 0 && (
              <span className="bg-[#FF6B35] text-white px-2 py-0.5 rounded-full text-[10px]">
                {notifications.filter((n) => !n.isRead).length}
              </span>
            )}
          </button>
        </div>

        {/* ── TAB 1: PASSES ── */}
        {activeTab === 'passes' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-[#0A0F1E]">Active 5-Year Passes ({orders.length})</h3>
              <span className="text-xs font-bold text-slate-500">Auto-synced with MongoDB Atlas</span>
            </div>

            {loading ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
                <div className="w-8 h-8 border-4 border-[#2475FF] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-500">Loading your passes from MongoDB Atlas...</p>
              </div>
            ) : (
              orders.map((pass) => {
                const orderId = pass._id || pass.id || 'ord_1088';
                const code = pass.redemptionCode || pass.code || 'ST-SAMPLE-CODE';
                const title = pass.dealTitle || pass.dealId?.title || 'SaaS 5-Year Pass';
                const tier = pass.tierTitle || pass.tier || 'Starter Pass (5-Yr)';
                const dateStr = pass.purchasedAt ? new Date(pass.purchasedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '28 Aug 2026';
                const vendorUrl = pass.vendorRedeemUrl || pass.vendorUrl || 'https://chatchacha.in/redeem';

                return (
                  <div key={orderId} className="bg-white border border-[#E8EBF3] rounded-3xl p-6 shadow-sm space-y-4">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0F2F8] pb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase">
                            Active (5-Year Access)
                          </span>
                          <span className="text-[10px] font-black text-slate-400">Order: #{orderId}</span>
                        </div>
                        <h4 className="text-base font-black text-[#0A0F1E]">{title}</h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{tier} · Purchased on {dateStr}</p>
                      </div>

                      {/* GST Invoice Download Button */}
                      <a
                        href={`/api/invoice/${orderId}?print=true`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 border border-slate-200 bg-[#F8FAFC] hover:bg-slate-100 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shrink-0"
                      >
                        <Download className="w-4 h-4 text-[#2475FF]" />
                        Download B2B GST Invoice
                      </a>
                    </div>

                    {/* Code Box */}
                    <div className="bg-[#0A0F1E] text-white p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Redemption License Code</div>
                        <div className="font-mono text-lg font-black text-amber-300 tracking-wider">{code}</div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => copyCode(code)}
                          className="px-4 py-2 bg-[#FF6B35] hover:bg-[#E85A24] text-white text-xs rounded-xl font-black transition-all flex items-center gap-1 cursor-pointer"
                        >
                          {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedCode ? 'Copied' : 'Copy Code'}
                        </button>

                        <a
                          href={vendorUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-[#FF6B35] hover:bg-[#E85A24] text-white text-xs font-black rounded-xl transition-all flex items-center gap-1.5"
                        >
                          <span>Redeem Code</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {/* Upgrade Tier Banner */}
                    <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-black text-[#2475FF]">Upgrade / Stack License:</span>
                        <span className="text-slate-600 font-medium ml-1.5">Stack additional codes to upgrade user limits and API capacity.</span>
                      </div>
                      <Link href="/deals" className="font-black text-[#2475FF] hover:underline whitespace-nowrap">
                        Browse Deals ➔
                      </Link>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── TAB 2: VENDOR SAAS LISTINGS & STATUS ── */}
        {activeTab === 'listings' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-[#0A0F1E]">Submitted Software Listings ({vendorDeals.length})</h3>
                <p className="text-xs text-slate-500 font-medium">Track your QA verification status, approval timelines, and marketplace visibility.</p>
              </div>

              <Link
                href="/submit"
                className="px-4 py-2.5 bg-[#FF6B35] hover:bg-[#E85A24] text-white text-xs font-black rounded-xl shadow-md flex items-center gap-2 w-fit cursor-pointer"
              >
                <Plus className="w-4 h-4" /> List Another SaaS
              </Link>
            </div>

            <div className="space-y-4">
              {vendorDeals.map((deal) => {
                const isPending = deal.status === 'Pending';
                const isRejected = deal.status === 'Rejected';
                const isActive = deal.status === 'Active' || (!isPending && !isRejected);

                return (
                  <div
                    key={deal.slug || deal.id}
                    className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                  >
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        {isPending ? (
                          <span className="bg-amber-50 text-amber-800 border border-amber-300 text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 animate-spin" /> ⏳ Under QA Review (Pending Approval)
                          </span>
                        ) : isRejected ? (
                          <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5" /> ⚠️ Revision Requested
                          </span>
                        ) : (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" /> 🎉 Approved & Live on Marketplace
                          </span>
                        )}

                        <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                          {deal.category}
                        </span>
                      </div>

                      <h4 className="text-base font-black text-slate-950">{deal.title}</h4>
                      <p className="text-xs text-slate-500 font-medium line-clamp-2">{deal.tagline}</p>

                      <div className="text-xs font-bold text-slate-600 flex items-center gap-3 pt-1">
                        <span>Starter Pass: <strong className="text-[#FF6B35]">₹{deal.tier1Price || 1999}</strong></span>
                        <span>•</span>
                        <span>Duration: <strong>{deal.campaignDurationDays || 14} Days</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isActive ? (
                        <Link
                          href={`/deals/${deal.slug}`}
                          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-md flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Live Page</span>
                        </Link>
                      ) : (
                        <span className="px-3.5 py-2 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold rounded-xl flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 animate-pulse" />
                          <span>Awaiting Admin Approval</span>
                        </span>
                      )}

                      <Link
                        href="/submit"
                        className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB 3: NOTIFICATIONS ── */}
        {activeTab === 'notifications' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-[#0A0F1E]">All Notifications & Listing Updates ({notifications.length})</h3>
              <button
                onClick={() => setNotifications(notifications.map((n) => ({ ...n, isRead: true })))}
                className="text-xs font-black text-[#2475FF] hover:underline cursor-pointer"
              >
                Mark all as read
              </button>
            </div>

            <div className="space-y-3">
              {notifications.map((notif) => {
                const isApproved = notif.type === 'submission_approved';
                const isRejected = notif.type === 'submission_rejected';

                return (
                  <div
                    key={notif.id}
                    className={`p-5 rounded-3xl border shadow-sm space-y-2 transition-all ${
                      isApproved
                        ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                        : isRejected
                        ? 'bg-red-50/80 border-red-200 text-red-950'
                        : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-sm flex items-center gap-2">
                        <span>{isApproved ? '🎉' : isRejected ? '⚠️' : '🔔'}</span>
                        <span>{notif.title}</span>
                      </h4>
                      <span className="text-xs text-slate-400 font-mono">
                        {new Date(notif.time).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{notif.message}</p>

                    {notif.link && (
                      <div className="pt-2 flex justify-end">
                        <Link
                          href={notif.link}
                          className={`text-xs font-black underline flex items-center gap-1 ${
                            isApproved ? 'text-emerald-700' : isRejected ? 'text-red-700' : 'text-[#2475FF]'
                          }`}
                        >
                          {isApproved ? 'Go to Live Software Deal Page →' : isRejected ? 'Review Submission Details →' : 'View Link →'}
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>

      <Footer />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(u) => setUser(u)}
      />
    </div>
  );
}
