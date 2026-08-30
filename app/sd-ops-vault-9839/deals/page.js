'use client';

import { useState, useEffect } from 'react';
import PlanFeaturesBuilder from '@/components/PlanFeaturesBuilder';
import {
  Plus, Tag, Edit3, Trash2, CheckCircle2, Sparkles, Flame, Clock, Eye, Save,
  RefreshCw, Video, Image, FileText, Layout, Layers, ShieldCheck, User, Globe,
  Bell, Check, X, AlertCircle
} from 'lucide-react';

export default function AdminDealsPage() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState('basic');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Pending' | 'Active'

  const emptyDeal = {
    title: '',
    slug: '',
    tagline: '',
    category: 'WhatsApp Bots',
    vendorName: '',
    vendorLogo: 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png',
    vendorLocation: 'New Delhi, India',
    foundedDate: 'April 2022',
    teamSize: '1-10 employees',
    isSelect: true,
    status: 'Active',
    
    campaignDurationDays: 14,

    tier1Price: 1999,
    tier2Price: 3999,
    tier3Price: 7999,
    originalPrice: 24000,
    totalCodes: 100,
    soldCount: 42,

    pricingTiers: [
      {
        tierName: 'Starter Pass',
        price: 1999,
        originalPrice: 24000,
        isRecommended: false,
        features: [
          { text: '5-Year Access to core software', included: true },
          { text: 'All minor & major software updates', included: true },
          { text: '1 Workspace / Account', included: true },
          { text: 'Priority WhatsApp VIP Support', included: true },
          { text: '100% White-Label (Custom Domain)', included: false },
        ],
      },
      {
        tierName: 'Pro Pass',
        price: 3999,
        originalPrice: 48000,
        isRecommended: true,
        features: [
          { text: '5-Year Access to all Pro features', included: true },
          { text: 'Unlimited campaigns & workflows', included: true },
          { text: '5 Team member seats', included: true },
          { text: 'Full API & Webhook integrations', included: true },
          { text: 'Priority WhatsApp VIP Support', included: true },
        ],
      },
      {
        tierName: 'Agency Pass',
        price: 7999,
        originalPrice: 96000,
        isRecommended: false,
        features: [
          { text: 'Everything in Pro Pass', included: true },
          { text: 'Unlimited team seats & workspaces', included: true },
          { text: '100% White-Label (Custom Domain)', included: true },
          { text: 'Dedicated 1-on-1 Account Manager', included: true },
        ],
      },
    ],

    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    screenshotsText: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop\nhttps://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
    
    tldrText: 'Create 1-click WhatsApp broadcasts & drip sequences\nRecover abandoned carts automatically via AI WhatsApp chatbots\nAccept payments via UPI directly inside WhatsApp chats',
    
    alternativeTo: 'Interakt, WATI, ManyChat',
    integrations: 'Shopify, WooCommerce, Razorpay, Google Sheets, Zapier',
    bestFor: 'Digital Agencies, Freelancers, E-commerce Brands',

    feat1Title: 'Run Automated WhatsApp Broadcasts Without Limits',
    feat1Desc: 'Send personalized promotions, deal alerts, and broadcast sequences to thousands of verified contacts.',
    feat1Bullets: 'Upload bulk CSV or sync contacts from Google Sheets\nTailor messages with custom contact variables\nTrack open rates & click-through rates',
    feat1Image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',

    feat2Title: 'Turn Abandoned Carts Into Revenue Streams',
    feat2Desc: 'Automatically trigger AI WhatsApp reminder sequences when a customer leaves their cart.',
    feat2Bullets: 'Auto-trigger reminders 15 mins, 2 hours, and 24 hours after drop\nCreate 1-click discount coupon links\nInstant Razorpay UPI checkout link',
    feat2Image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',

    termsText: '5-Year Access Pass to software updates.\nMust redeem license code within 60 days of purchase.\n60-Day Money-Back Guarantee — test it risk-free.',
    founderName: 'Ujjwal Sharma',
    founderTitle: 'Founder & CEO',
    founderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    founderNote: 'After trying expensive foreign WhatsApp tools charging $100+/month with no Indian UPI support, we built Chat Chacha.',
  };

  const [editingDeal, setEditingDeal] = useState(emptyDeal);

  // Fetch Live Deals from MongoDB Atlas & In-Memory API
  const fetchAdminDeals = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/deals');
      const data = await res.json();
      if (data?.success && data?.deals) {
        setDeals(data.deals);
      }
    } catch (err) {
      console.error('Error fetching admin deals from MongoDB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminDeals();
  }, []);

  const handleStatusChange = async (slug, newStatus) => {
    try {
      const res = await fetch('/api/admin/deals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, status: newStatus }),
      });
      const data = await res.json();
      if (data?.success) {
        setStatusMsg(`Software deal ${slug} is now marked as ${newStatus}!`);
        setTimeout(() => setStatusMsg(''), 4000);
        await fetchAdminDeals();
      }
    } catch (err) {
      console.error('Status change error:', err);
    }
  };

  const handleDelete = async (slug) => {
    if (!confirm(`Are you sure you want to permanently delete "${slug}"?`)) return;
    try {
      const res = await fetch(`/api/admin/deals?slug=${slug}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusMsg(`Deal ${slug} deleted successfully.`);
        setTimeout(() => setStatusMsg(''), 3000);
        await fetchAdminDeals();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleEditClick = (deal) => {
    const screenshotsText = (deal.screenshots || []).join('\n');
    const tldrText = (deal.tldr || []).join('\n');
    const termsText = (deal.terms || []).join('\n');
    const f1 = deal.featureShowcases?.[0] || {};
    const f2 = deal.featureShowcases?.[1] || {};

    setEditingDeal({
      ...deal,
      screenshotsText: screenshotsText || emptyDeal.screenshotsText,
      tldrText: tldrText || emptyDeal.tldrText,
      termsText: termsText || emptyDeal.termsText,
      feat1Title: f1.title || emptyDeal.feat1Title,
      feat1Desc: f1.description || emptyDeal.feat1Desc,
      feat1Bullets: (f1.bullets || []).join('\n') || emptyDeal.feat1Bullets,
      feat1Image: f1.imageUrl || emptyDeal.feat1Image,
      feat2Title: f2.title || emptyDeal.feat2Title,
      feat2Desc: f2.description || emptyDeal.feat2Desc,
      feat2Bullets: (f2.bullets || []).join('\n') || emptyDeal.feat2Bullets,
      feat2Image: f2.imageUrl || emptyDeal.feat2Image,
      alternativeTo: deal.atAGlance?.alternativeTo || emptyDeal.alternativeTo,
      integrations: deal.atAGlance?.integrations || emptyDeal.integrations,
      bestFor: deal.atAGlance?.bestFor || emptyDeal.bestFor,
      pricingTiers: deal.pricingTiers && deal.pricingTiers.length > 0 ? deal.pricingTiers : emptyDeal.pricingTiers,
    });

    setShowAddForm(true);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleSaveDeal = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const slug = editingDeal.slug || editingDeal.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const screenshots = editingDeal.screenshotsText.split('\n').map((s) => s.trim()).filter(Boolean);
      const tldr = editingDeal.tldrText.split('\n').map((s) => s.trim()).filter(Boolean);
      const terms = editingDeal.termsText.split('\n').map((s) => s.trim()).filter(Boolean);

      const featureShowcases = [
        {
          title: editingDeal.feat1Title,
          description: editingDeal.feat1Desc,
          bullets: editingDeal.feat1Bullets.split('\n').map((b) => b.trim()).filter(Boolean),
          imageUrl: editingDeal.feat1Image,
        },
        {
          title: editingDeal.feat2Title,
          description: editingDeal.feat2Desc,
          bullets: editingDeal.feat2Bullets.split('\n').map((b) => b.trim()).filter(Boolean),
          imageUrl: editingDeal.feat2Image,
        },
      ];

      const pricingTiers = (editingDeal.pricingTiers || emptyDeal.pricingTiers).map((t, idx) => ({
        ...t,
        price: idx === 0 ? (Number(editingDeal.tier1Price) || t.price) : idx === 1 ? (Number(editingDeal.tier2Price) || t.price) : (Number(editingDeal.tier3Price) || t.price),
        originalPrice: idx === 0 ? (Number(editingDeal.originalPrice) || t.originalPrice) : t.originalPrice,
      }));

      const payload = {
        ...editingDeal,
        slug,
        isSelect: true,
        status: editingDeal.status || 'Active',
        screenshots,
        tldr,
        terms,
        featureShowcases,
        pricingTiers,
        atAGlance: {
          alternativeTo: editingDeal.alternativeTo,
          integrations: editingDeal.integrations,
          bestFor: editingDeal.bestFor,
        },
      };

      const res = await fetch('/api/admin/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSavedMsg(true);
        setTimeout(() => setSavedMsg(false), 3500);
        setShowAddForm(false);
        await fetchAdminDeals();
      }
    } catch (err) {
      console.error('Save deal error:', err);
    } finally {
      setSaving(false);
    }
  };

  const pendingDeals = deals.filter((d) => d.status === 'Pending');
  const activeDeals = deals.filter((d) => d.status === 'Active' || !d.status);

  const filteredDeals = statusFilter === 'Pending'
    ? pendingDeals
    : statusFilter === 'Active'
    ? activeDeals
    : deals;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-black text-white">Full Software Deal & QA Moderation Center</h2>
          <p className="text-xs text-slate-400 font-medium">Review pending vendor submissions, approve deals to go live, and edit full marketplace pages.</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchAdminDeals}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-slate-300 rounded-xl transition-all cursor-pointer"
            title="Refresh from MongoDB Atlas"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => {
              setEditingDeal(emptyDeal);
              setShowAddForm(!showAddForm);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#FF6B35] hover:bg-[#e55a27] text-white text-xs font-black rounded-xl transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" /> {showAddForm ? 'Close Editor' : 'Create New Software Deal'}
          </button>
        </div>
      </div>

      {/* ── Active Admin Alert Banner if Pending Submissions Exist ── */}
      {pendingDeals.length > 0 && (
        <div className="bg-amber-500/15 border-2 border-amber-500/40 p-4 sm:p-5 rounded-2xl flex items-center justify-between gap-4 text-amber-300 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="text-sm font-black text-white flex items-center gap-2">
                <span>{pendingDeals.length} New Vendor Software {pendingDeals.length === 1 ? 'Submission' : 'Submissions'} Awaiting QA Approval!</span>
                <span className="text-[10px] font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full uppercase">Action Required</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Review software details below and click <strong>Approve & Go Live</strong> to publish across the website.
              </p>
            </div>
          </div>

          <button
            onClick={() => setStatusFilter('Pending')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl shrink-0 cursor-pointer shadow-md transition-all"
          >
            View Pending ({pendingDeals.length})
          </button>
        </div>
      )}

      {statusMsg && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 p-4 rounded-xl text-xs font-bold text-emerald-400 animate-fadeIn">
          🎉 {statusMsg}
        </div>
      )}

      {savedMsg && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 p-4 rounded-xl text-xs font-bold text-emerald-400 animate-fadeIn">
          🎉 All software deal sections saved permanently to SaasGrid MongoDB Atlas! Single deal page updated live.
        </div>
      )}

      {/* ── 5-Tab Comprehensive Form Editor ── */}
      {showAddForm && (
        <form onSubmit={handleSaveDeal} className="bg-[#070B16] border border-[#2475FF]/40 rounded-2xl p-6 space-y-6 animate-fadeInUp">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Full Software Deal Section Command Center
            </h3>
            <span className="text-[10px] font-black text-[#2475FF] bg-blue-500/20 px-2.5 py-0.5 rounded uppercase">
              100% MongoDB Atlas Synced
            </span>
          </div>

          {/* Form Tabs Header */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
            {[
              { id: 'basic', label: '1. Basic & Pricing', icon: Layout },
              { id: 'media', label: '2. Video & Media', icon: Video },
              { id: 'tldr', label: '3. TL;DR & Specs', icon: FileText },
              { id: 'features', label: '4. Visual Showcases & Matrix', icon: Layers },
              { id: 'terms', label: '5. Terms & Founder Story', icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeFormTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFormTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    active ? 'bg-[#2475FF] text-white shadow-md' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: BASIC & PRICING */}
          {activeFormTab === 'basic' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Software Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chat Chacha - WhatsApp Marketing"
                    value={editingDeal.title}
                    onChange={(e) => setEditingDeal({ ...editingDeal, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#2475FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Slug (URL identifier) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. chat-chacha"
                    value={editingDeal.slug}
                    onChange={(e) => setEditingDeal({ ...editingDeal, slug: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#2475FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Tagline (High converting pitch) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Automate WhatsApp broadcasts, AI chatbots & UPI payments"
                  value={editingDeal.tagline}
                  onChange={(e) => setEditingDeal({ ...editingDeal, tagline: e.target.value })}
                  className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#2475FF]"
                />
              </div>

              {/* Website URL Auto Logo Fetcher */}
              <div className="bg-white/5 border border-white/15 rounded-2xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-black text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5" /> Software Website Link (Auto-Fetches Logo)
                    </label>
                    <input
                      type="url"
                      placeholder="e.g. https://chatchacha.com or mailmunch.com"
                      value={editingDeal.websiteUrl || ''}
                      onChange={(e) => {
                        const url = e.target.value;
                        const domain = url.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
                        let autoLogo = editingDeal.vendorLogo;
                        if (domain && domain.includes('.')) {
                          autoLogo = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
                        }
                        setEditingDeal({
                          ...editingDeal,
                          websiteUrl: url,
                          vendorLogo: autoLogo,
                        });
                      }}
                      className="w-full bg-white/10 border border-white/20 text-white text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#2475FF]"
                    />
                  </div>

                  <div className="flex items-center gap-3 bg-white/10 p-2 rounded-xl border border-white/15 shrink-0">
                    <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center p-1.5 overflow-hidden">
                      {editingDeal.vendorLogo ? (
                        <img src={editingDeal.vendorLogo} alt="Logo" className="w-full h-full object-contain" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] font-bold text-white">Live Logo</div>
                      <div className="text-[9px] text-slate-400 truncate max-w-[100px]">
                        {editingDeal.vendorName || 'Detected'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Category</label>
                  <select
                    value={editingDeal.category}
                    onChange={(e) => setEditingDeal({ ...editingDeal, category: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl cursor-pointer"
                  >
                    <option value="WhatsApp Bots" className="text-slate-900">WhatsApp Bots</option>
                    <option value="AI & GEO SEO" className="text-slate-900">AI & GEO SEO</option>
                    <option value="Lead Scrapers" className="text-slate-900">Lead Scrapers</option>
                    <option value="CRM & Sales" className="text-slate-900">CRM & Sales</option>
                    <option value="Video & Design" className="text-slate-900">Video & Design</option>
                    <option value="Analytics" className="text-slate-900">Analytics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Status</label>
                  <select
                    value={editingDeal.status || 'Active'}
                    onChange={(e) => setEditingDeal({ ...editingDeal, status: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl cursor-pointer"
                  >
                    <option value="Active" className="text-slate-900">✔ Active (Live on Marketplace)</option>
                    <option value="Pending" className="text-slate-900">⏳ Pending (Under QA Review)</option>
                    <option value="Draft" className="text-slate-900">Draft (Hidden)</option>
                    <option value="Rejected" className="text-slate-900">✖ Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Original Annual Price (₹)</label>
                  <input
                    type="number"
                    value={editingDeal.originalPrice}
                    onChange={(e) => setEditingDeal({ ...editingDeal, originalPrice: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl"
                  />
                </div>
              </div>

              {/* 14-Day Real Launch Duration */}
              <div className="bg-red-950/40 border border-red-500/30 rounded-2xl p-4 space-y-2">
                <label className="block text-xs font-black text-red-400 uppercase tracking-wider">
                  14-Day Real Flash Launch Duration (Days) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <select
                    value={editingDeal.campaignDurationDays || 14}
                    onChange={(e) => {
                      const days = Number(e.target.value);
                      setEditingDeal({
                        ...editingDeal,
                        campaignDurationDays: days,
                        campaignEndDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString(),
                      });
                    }}
                    className="w-full bg-white/10 border border-white/20 text-white text-xs font-black p-3 rounded-xl cursor-pointer"
                  >
                    <option value={14} className="text-slate-900">🔥 14 Days (Standard AppSumo Flash Launch)</option>
                    <option value={7} className="text-slate-900">⚡ 7 Days (Short Flash Promo)</option>
                    <option value={21} className="text-slate-900">🚀 21 Days (Extended Launch)</option>
                    <option value={30} className="text-slate-900">🌟 30 Days (Full Month Special)</option>
                  </select>

                  <div className="text-xs font-bold text-slate-300">
                    Live countdown timer will calculate remaining time from launch moment.
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-amber-400 mb-1">Starter Pass Tier 1 Price (₹)</label>
                  <input
                    type="number"
                    value={editingDeal.tier1Price}
                    onChange={(e) => setEditingDeal({ ...editingDeal, tier1Price: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-400 mb-1">Pro Pass Tier 2 Price (₹)</label>
                  <input
                    type="number"
                    value={editingDeal.tier2Price}
                    onChange={(e) => setEditingDeal({ ...editingDeal, tier2Price: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-400 mb-1">Agency Pass Tier 3 Price (₹)</label>
                  <input
                    type="number"
                    value={editingDeal.tier3Price}
                    onChange={(e) => setEditingDeal({ ...editingDeal, tier3Price: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VIDEO & MEDIA */}
          {activeFormTab === 'media' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">YouTube Demo/Pitch Video Embed URL</label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/embed/..."
                  value={editingDeal.videoUrl}
                  onChange={(e) => setEditingDeal({ ...editingDeal, videoUrl: e.target.value })}
                  className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Hero / Main Screenshot Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={editingDeal.heroImage || ''}
                  onChange={(e) => setEditingDeal({ ...editingDeal, heroImage: e.target.value })}
                  className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Screenshot Gallery Images (One per line)</label>
                <textarea
                  rows={4}
                  placeholder="https://images.unsplash.com/photo-1&#10;https://images.unsplash.com/photo-2"
                  value={editingDeal.screenshotsText}
                  onChange={(e) => setEditingDeal({ ...editingDeal, screenshotsText: e.target.value })}
                  className="w-full bg-white/5 border border-white/15 text-white text-xs font-medium p-3 rounded-xl"
                />
              </div>
            </div>
          )}

          {/* TAB 3: TLDR & SPECS */}
          {activeFormTab === 'tldr' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-amber-400 mb-1">TL;DR Bullet Points (One per line)</label>
                <textarea
                  rows={4}
                  placeholder="1-click automation workflows&#10;Pre-built Indian marketing templates&#10;Integrates directly with Razorpay"
                  value={editingDeal.tldrText}
                  onChange={(e) => setEditingDeal({ ...editingDeal, tldrText: e.target.value })}
                  className="w-full bg-white/5 border border-white/15 text-white text-xs font-medium p-3 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Alternative To</label>
                  <input
                    type="text"
                    value={editingDeal.alternativeTo}
                    onChange={(e) => setEditingDeal({ ...editingDeal, alternativeTo: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Integrations</label>
                  <input
                    type="text"
                    value={editingDeal.integrations}
                    onChange={(e) => setEditingDeal({ ...editingDeal, integrations: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Best For</label>
                  <input
                    type="text"
                    value={editingDeal.bestFor}
                    onChange={(e) => setEditingDeal({ ...editingDeal, bestFor: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VISUAL SHOWCASES & MATRIX */}
          {activeFormTab === 'features' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
                <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider">Visual Feature Showcase 1</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Showcase Title"
                    value={editingDeal.feat1Title}
                    onChange={(e) => setEditingDeal({ ...editingDeal, feat1Title: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl"
                  />
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={editingDeal.feat1Image}
                    onChange={(e) => setEditingDeal({ ...editingDeal, feat1Image: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl"
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="Description..."
                  value={editingDeal.feat1Desc}
                  onChange={(e) => setEditingDeal({ ...editingDeal, feat1Desc: e.target.value })}
                  className="w-full bg-white/5 border border-white/15 text-white text-xs font-medium p-3 rounded-xl"
                />
              </div>

              {/* Plan Features Matrix Builder */}
              <div className="pt-2">
                <PlanFeaturesBuilder
                  tiers={editingDeal.pricingTiers || emptyDeal.pricingTiers}
                  onChange={(updatedTiers) => setEditingDeal({ ...editingDeal, pricingTiers: updatedTiers })}
                />
              </div>
            </div>
          )}

          {/* TAB 5: TERMS & FOUNDER STORY */}
          {activeFormTab === 'terms' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Terms & Conditions (One per line)</label>
                <textarea
                  rows={3}
                  placeholder="5-Year Access Pass to software updates.&#10;Must redeem license code within 60 days.&#10;60-Day Money-Back Guarantee."
                  value={editingDeal.termsText}
                  onChange={(e) => setEditingDeal({ ...editingDeal, termsText: e.target.value })}
                  className="w-full bg-white/5 border border-white/15 text-white text-xs font-medium p-3 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Founder Name</label>
                  <input
                    type="text"
                    value={editingDeal.founderName}
                    onChange={(e) => setEditingDeal({ ...editingDeal, founderName: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Founder Title</label>
                  <input
                    type="text"
                    value={editingDeal.founderTitle}
                    onChange={(e) => setEditingDeal({ ...editingDeal, founderTitle: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Founder Avatar URL</label>
                  <input
                    type="text"
                    value={editingDeal.founderAvatar}
                    onChange={(e) => setEditingDeal({ ...editingDeal, founderAvatar: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-400 mb-1">Founder Story Note ("Why we built this tool...")</label>
                <textarea
                  rows={3}
                  placeholder="Explain the founder story and why Indian agencies will love this software..."
                  value={editingDeal.founderNote}
                  onChange={(e) => setEditingDeal({ ...editingDeal, founderNote: e.target.value })}
                  className="w-full bg-white/5 border border-white/15 text-white text-xs font-medium p-3 rounded-xl"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="text-xs text-slate-400 font-medium">
              Section Tab {activeFormTab === 'basic' ? '1/5' : activeFormTab === 'media' ? '2/5' : activeFormTab === 'tldr' ? '3/5' : activeFormTab === 'features' ? '4/5' : '5/5'}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 bg-[#2475FF] hover:bg-blue-600 text-white text-xs font-black rounded-xl cursor-pointer shadow-lg flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saving to MongoDB Atlas...' : 'Save Permanently to SaasGrid MongoDB Atlas'}
            </button>
          </div>

        </form>
      )}

      {/* ── Deals Moderation & List Header with Filter Tabs ── */}
      <div className="bg-[#070B16] border border-white/10 rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-base font-black text-white">Software Catalog Moderation ({deals.length})</h3>
            <p className="text-xs text-slate-400">Approve vendor submissions or edit live marketplace listings.</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setStatusFilter('All')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                statusFilter === 'All' ? 'bg-[#2475FF] text-white shadow' : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              All ({deals.length})
            </button>

            <button
              onClick={() => setStatusFilter('Pending')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'Pending' ? 'bg-amber-500 text-slate-950 shadow' : 'bg-white/5 text-amber-400 hover:bg-white/10'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pending QA ({pendingDeals.length})</span>
            </button>

            <button
              onClick={() => setStatusFilter('Active')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'Active' ? 'bg-emerald-600 text-white shadow' : 'bg-white/5 text-emerald-400 hover:bg-white/10'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Active Live ({activeDeals.length})</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="w-6 h-6 border-2 border-[#2475FF] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-400">Loading deals from SaasGrid MongoDB Atlas...</p>
          </div>
        ) : filteredDeals.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs font-bold">
            No software deals found in this filter tab.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDeals.map((d) => {
              const isPending = d.status === 'Pending';
              
              return (
                <div
                  key={d.id || d.slug || d._id}
                  className={`border rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all ${
                    isPending ? 'bg-amber-950/20 border-amber-500/40 shadow-md' : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black text-[#2475FF] bg-blue-500/20 px-2 py-0.5 rounded uppercase">
                        {d.category || 'SaaS Tool'}
                      </span>
                      
                      {isPending ? (
                        <span className="text-[10px] font-black text-amber-300 bg-amber-500/30 px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
                          <Clock className="w-3 h-3 animate-pulse" /> Pending QA Approval
                        </span>
                      ) : (
                        <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Live on Marketplace
                        </span>
                      )}

                      <span className="text-[10px] font-black text-slate-400">
                        Duration: {d.campaignDurationDays || 14} Days
                      </span>
                    </div>

                    <h4 className="text-base font-black text-white">{d.title}</h4>
                    
                    <div className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
                      <span>Vendor: <strong className="text-slate-200">{d.vendorName}</strong></span>
                      <span>•</span>
                      <span>Starter Pass: <strong className="text-amber-400">₹{d.tier1Price || d.price || 1999}</strong></span>
                      {d.founderContact?.email && (
                        <>
                          <span>•</span>
                          <span>Contact: <strong className="text-slate-300">{d.founderContact.email}</strong></span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                    
                    {/* 1-Click Approve Button */}
                    {isPending ? (
                      <>
                        <button
                          onClick={() => handleStatusChange(d.slug, 'Active')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve & Launch Live</span>
                        </button>

                        <button
                          onClick={() => handleStatusChange(d.slug, 'Rejected')}
                          className="px-3 py-2 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(d.slug, 'Pending')}
                        className="px-3 py-1.5 bg-white/10 hover:bg-amber-500/20 text-xs font-bold text-slate-300 hover:text-amber-300 rounded-xl transition-all cursor-pointer"
                        title="Move to pending review"
                      >
                        Unpublish (Set Pending)
                      </button>
                    )}

                    <button
                      onClick={() => handleEditClick(d)}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>

                    <a
                      href={`/deals/${d.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-[#2475FF] hover:bg-blue-600 text-xs font-bold text-white rounded-xl transition-all flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Preview
                    </a>

                    <button
                      onClick={() => handleDelete(d.slug)}
                      className="p-2 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete deal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
}
