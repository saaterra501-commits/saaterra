'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import PlanFeaturesBuilder from '../../components/PlanFeaturesBuilder';
import {
  Rocket, DollarSign, ShieldCheck, CheckCircle2, ArrowRight, Zap, Users,
  Calculator, Gift, Tag, Video, Image, FileText, Layers, User, Sparkles,
  ExternalLink, Check, Clock, Upload, Mail, Phone, Building
} from 'lucide-react';

export default function VendorSubmitPage() {
  // ── 1. 70/30 Revenue Calculator State ──
  const [salesTarget, setSalesTarget] = useState(100);
  const [passPrice, setPassPrice] = useState(1999);

  const grossRevenue = salesTarget * passPrice;
  const vendorPayout = Math.round(grossRevenue * 0.70);
  const stackdealCommission = Math.round(grossRevenue * 0.30);

  // ── 2. Vendor Software Submission Form State ──
  const [activeFormTab, setActiveFormTab] = useState('basic');
  const [saving, setSaving] = useState(false);
  const [submittedDeal, setSubmittedDeal] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    tagline: '',
    category: 'WhatsApp Bots',
    websiteUrl: '',
    vendorName: '',
    vendorLogo: 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png',
    vendorLocation: 'Bengaluru, India',
    foundedDate: 'April 2023',
    teamSize: '1-10 employees',
    
    // 14-Day Real Countdown Setting
    campaignDurationDays: 14,
    
    // Pricing
    tier1Price: 1999,
    tier2Price: 3999,
    tier3Price: 7999,
    originalPrice: 24000,
    totalCodes: 100,

    // Media
    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    screenshotsText: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop\nhttps://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',

    // TL;DR & Specs
    tldrText: '1-Click automated workflows for fast execution\nPre-built templates optimized for Indian agencies\nIntegrates directly with UPI and existing software stacks',
    alternativeTo: 'Expensive foreign monthly SaaS tools',
    integrations: 'Shopify, WooCommerce, Razorpay, Google Sheets, Zapier',
    bestFor: 'Digital Marketing Agencies, Freelancers, E-commerce Founders',

    // Feature Showcase 1
    feat1Title: 'High-Impact Automated Workflows',
    feat1Desc: 'Empower your team to execute complex campaigns in seconds without technical knowledge.',
    feat1Bullets: 'Zero setup friction with intuitive dashboard\nExport analytics reports in 1 click\nMulti-user team collaboration support',
    feat1Image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',

    // Feature Showcase 2
    feat2Title: 'Built Specifically for Indian Market Growth',
    feat2Desc: 'Optimized for high conversion rates, speed, and seamless customer onboarding.',
    feat2Bullets: 'Native INR pricing and Indian payment options\nLightning-fast cloud servers\n24/7 Priority WhatsApp technical assistance',
    feat2Image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',

    // Founder Story & Terms
    founderName: '',
    founderTitle: 'Founder & CEO',
    founderEmail: '',
    founderPhone: '',
    founderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    founderNote: 'We built this software to solve real agency bottlenecks without burning cash on overpriced monthly subscriptions.',
    vendorRedeemUrl: 'https://yourwebsite.com/redeem',
    termsText: '5-Year Access Pass to software updates.\nMust redeem license code within 60 days of purchase.\n60-Day Money-Back Guarantee included.',
  });

  const handleWebsiteChange = (url) => {
    let domain = url.trim();
    domain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
    let autoLogo = formData.vendorLogo;
    if (domain && domain.includes('.')) {
      autoLogo = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    }
    setFormData((prev) => ({
      ...prev,
      websiteUrl: url,
      vendorLogo: autoLogo,
      vendorRedeemUrl: prev.vendorRedeemUrl === 'https://yourwebsite.com/redeem' || !prev.vendorRedeemUrl ? `https://${domain}/redeem` : prev.vendorRedeemUrl,
    }));
  };

  // ── 3. Plan-Wise Features State ──
  const [pricingTiers, setPricingTiers] = useState([
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
        { text: 'Client Sub-Accounts & Reseller rights', included: false },
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
        { text: 'Automated Data Export & CSV Reports', included: true },
        { text: '100% White-Label (Custom Domain)', included: false },
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
        { text: 'Client Sub-Accounts & Reseller rights', included: true },
        { text: 'Dedicated 1-on-1 Account Manager', included: true },
        { text: 'Native Razorpay UPI Checkout Widget', included: true },
      ],
    },
  ]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'title' && !prev.slug) {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
      }
      return updated;
    });
  };

  const handleVendorSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    try {
      const autoSlug = (formData.slug || formData.title)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || `saas-${Date.now()}`;

      const payload = {
        title: formData.title,
        slug: autoSlug,
        tagline: formData.tagline,
        category: formData.category,
        vendorName: formData.vendorName,
        vendorLogo: formData.vendorLogo,
        vendorLocation: formData.vendorLocation,
        foundedDate: formData.foundedDate,
        teamSize: formData.teamSize,
        isSelect: true,
        status: 'Pending',
        
        tier1Price: Number(formData.tier1Price) || 1999,
        tier2Price: Number(formData.tier2Price) || 3999,
        tier3Price: Number(formData.tier3Price) || 7999,
        originalPrice: Number(formData.originalPrice) || (Number(formData.tier1Price || 1999) * 10),
        totalCodes: Number(formData.totalCodes) || 100,
        soldCount: 0,
        rating: 5.0,
        reviewsCount: 1,

        campaignDurationDays: Number(formData.campaignDurationDays) || 14,
        campaignEndDate: new Date(Date.now() + (Number(formData.campaignDurationDays) || 14) * 24 * 60 * 60 * 1000),
        launchDate: new Date(),

        heroImage: formData.heroImage,
        screenshot: formData.heroImage,
        videoUrl: formData.videoUrl,
        screenshots: formData.screenshotsText.split('\n').map((s) => s.trim()).filter(Boolean),
        tldr: formData.tldrText.split('\n').map((s) => s.trim()).filter(Boolean),
        terms: formData.termsText.split('\n').map((s) => s.trim()).filter(Boolean),

        atAGlance: {
          alternativeTo: formData.alternativeTo,
          integrations: formData.integrations,
          bestFor: formData.bestFor,
        },

        featureShowcases: [
          {
            title: formData.feat1Title,
            description: formData.feat1Desc,
            bullets: formData.feat1Bullets.split('\n').map((b) => b.trim()).filter(Boolean),
            imageUrl: formData.feat1Image,
          },
          {
            title: formData.feat2Title,
            description: formData.feat2Desc,
            bullets: formData.feat2Bullets.split('\n').map((b) => b.trim()).filter(Boolean),
            imageUrl: formData.feat2Image,
          },
        ],

        // Synchronize tier prices with form inputs
        pricingTiers: pricingTiers.map((t, idx) => ({
          ...t,
          price: idx === 0 ? (Number(formData.tier1Price) || t.price) : idx === 1 ? (Number(formData.tier2Price) || t.price) : (Number(formData.tier3Price) || t.price),
          originalPrice: idx === 0 ? (Number(formData.originalPrice) || t.originalPrice) : t.originalPrice,
        })),

        founderName: formData.founderName,
        founderTitle: formData.founderTitle,
        founderAvatar: formData.founderAvatar,
        founderNote: formData.founderNote,
        vendorRedeemUrl: formData.vendorRedeemUrl,
        founderContact: {
          email: formData.founderEmail,
          phone: formData.founderPhone,
        },
      };

      const res = await fetch('/api/admin/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data?.success) {
        setSubmittedDeal(payload);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setErrorMsg(data?.error || 'Failed to submit software. Please try again.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMsg('Network error. Please check connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex flex-col font-sans">
      <Navbar />

      {/* Orange Ticker Ribbon (#FF6B35) */}
      <div className="w-full bg-[#FF6B35] text-white py-2.5 overflow-hidden shadow-sm relative z-20">
        <div className="ticker-wrapper flex whitespace-nowrap">
          <div className="ticker-inner flex items-center gap-8 animate-ticker text-xs font-black uppercase tracking-wider">
            {[1, 2, 3, 4].map((_, i) => (
              <span key={i} className="inline-flex items-center gap-8">
                <span className="flex items-center gap-2"><span className="text-base">🚀</span> 70% Founder Revenue Share</span>
                <span className="flex items-center gap-2"><span className="text-base">💳</span> Instant Razorpay UPI Payouts</span>
                <span className="flex items-center gap-2"><span className="text-base">👥</span> 2,400+ Agency Buyers</span>
                <span className="flex items-center gap-2"><span className="text-base">⚡</span> 0 Listing Fees</span>
                <span className="flex items-center gap-2"><span className="text-base">🛡️</span> Full GST Invoicing</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Mint Hero Header */}
      <section className="bg-[#E6F9EE] text-slate-900 py-12 px-4 sm:px-6 relative z-10 border-b border-emerald-200/60">
        <div className="max-w-4xl mx-auto space-y-4 text-center">
          <span className="inline-flex items-center gap-1.5 bg-[#FF6B35] text-white text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-wider">
            🚀 Founder & Vendor Launch Studio
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 leading-tight">
            Launch Your Software on StackDeal
          </h1>
          <p className="text-slate-700 text-sm sm:text-base font-medium max-w-2xl mx-auto leading-relaxed">
            Reach thousands of verified Indian digital agencies and solopreneurs. Keep <strong>70% revenue share</strong> with automated Razorpay UPI payouts and zero upfront listing fees.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full space-y-12">

        {/* ── SUCCESS STATE SCREEN ── */}
        {submittedDeal ? (
          <div className="bg-white border-2 border-amber-500 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-6 text-center animate-fadeIn">
            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Clock className="w-10 h-10 animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black text-amber-700 uppercase tracking-widest bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200">
                ⏳ Status: Pending Admin QA Review
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-950">
                "{submittedDeal.title}" Submitted Successfully!
              </h2>
              <p className="text-sm text-slate-600 max-w-xl mx-auto font-medium leading-relaxed">
                Our QA and Admin team has received an instant notification. We will review your software details, verify redemption links, and publish your deal live across StackDeal within <strong>24 hours</strong>.
              </p>
            </div>

            {/* Action Buttons (No Draft Preview until Admin Approval) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setSubmittedDeal(null)}
                className="w-full sm:w-auto px-8 py-4 bg-[#FF6B35] hover:bg-[#E85A24] text-white font-black text-sm rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>List Another Software Tool</span>
              </button>

              <Link
                href="/profile"
                className="w-full sm:w-auto px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-2xl transition-all flex items-center justify-center"
              >
                Track Status in My Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* ── 1. 70/30 Revenue Share Calculator ── */}
            <div className="bg-gradient-to-br from-[#0c0d14] via-[#141726] to-[#08090f] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-amber-500/20 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-[#FFC700] flex items-center justify-center shrink-0">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">70/30 Revenue Share Math</h3>
                    <p className="text-xs text-slate-400 font-medium">Calculate your projected net payout from a standard 14-day launch</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-slate-950 bg-[#FFC700] px-3 py-1 rounded-full uppercase tracking-wider">
                    70% Founder / 30% StackDeal
                  </span>
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Passes Slider */}
                <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-300">Target Passes Sold:</span>
                    <span className="text-base font-black text-[#FFC700]">{salesTarget} Passes</span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="500"
                    step="25"
                    value={salesTarget}
                    onChange={(e) => setSalesTarget(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#FF6B35]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                    <span>25 passes</span>
                    <span>250 passes</span>
                    <span>500 passes</span>
                  </div>
                </div>

                {/* Pass Price Slider */}
                <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-300">Starter Pass Price:</span>
                    <span className="text-base font-black text-emerald-400">₹{passPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="999"
                    max="9999"
                    step="500"
                    value={passPrice}
                    onChange={(e) => {
                      setPassPrice(Number(e.target.value));
                      setFormData((p) => ({ ...p, tier1Price: Number(e.target.value) }));
                    }}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                    <span>₹999</span>
                    <span>₹4,999</span>
                    <span>₹9,999</span>
                  </div>
                </div>

              </div>

              {/* Payout Totals Display */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/10">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Campaign Sales</div>
                  <div className="text-xl sm:text-2xl font-black text-white mt-1">₹{grossRevenue.toLocaleString('en-IN')}</div>
                </div>

                <div className="bg-emerald-950/40 rounded-2xl p-4 border border-emerald-500/30">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Your Net Payout (70%)</div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">₹{vendorPayout.toLocaleString('en-IN')}</div>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">StackDeal Cut (30%)</div>
                  <div className="text-xl sm:text-2xl font-black text-slate-300 mt-1">₹{stackdealCommission.toLocaleString('en-IN')}</div>
                </div>
              </div>

            </div>

            {/* ── 2. Full 5-Tab Vendor Software Submission Form ── */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-xl p-6 sm:p-10 space-y-8">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-950 flex items-center gap-2">
                    <Rocket className="w-6 h-6 text-[#FF6B35]" />
                    Software Listing & Deal Creator
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Fill out your software details below to publish your 5-Year Pass deal directly to StackDeal.
                  </p>
                </div>

                <span className="text-[10px] font-black text-[#FF6B35] bg-orange-50 border border-orange-200 px-3 py-1 rounded-full uppercase tracking-wider">
                  ⚡ Auto-Published to Marketplace
                </span>
              </div>

              {errorMsg && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-2xl">
                  {errorMsg}
                </div>
              )}

              {/* Form Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
                {[
                  { id: 'basic', label: '📌 1. Basic & Pricing', icon: Tag },
                  { id: 'tiers', label: '💳 2. Plan Features (Starter/Pro/Agency)', icon: Layers },
                  { id: 'media', label: '🎬 3. Media & Gallery', icon: Video },
                  { id: 'tldr', label: '⚡ 4. TL;DR & Specs', icon: FileText },
                  { id: 'features', label: '✨ 5. Feature Showcases', icon: Sparkles },
                  { id: 'founder', label: '💼 6. Founder & Delivery', icon: User },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveFormTab(tab.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      activeFormTab === tab.id
                        ? 'bg-[#FF6B35] text-white shadow-md font-black'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* FORM FIELDS */}
              <form onSubmit={handleVendorSubmit} className="space-y-6">
                
                {/* ── TAB 1: BASIC INFO & PRICING ── */}
                {activeFormTab === 'basic' && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                          Software / Tool Title *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Chat Chacha — WhatsApp AI Marketing"
                          value={formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3.5 rounded-xl focus:bg-white focus:outline-none focus:border-[#FF6B35]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                          Vendor / Company Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Chat Chacha AI Technologies"
                          value={formData.vendorName}
                          onChange={(e) => handleInputChange('vendorName', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3.5 rounded-xl focus:bg-white focus:outline-none focus:border-[#FF6B35]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                        Tagline / Subtitle *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Automate WhatsApp marketing broadcasts, AI chatbot cart recovery, and boost sales..."
                        value={formData.tagline}
                        onChange={(e) => handleInputChange('tagline', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3.5 rounded-xl focus:bg-white focus:outline-none focus:border-[#FF6B35]"
                      />
                    </div>

                    {/* ── Auto-Detect Website Logo Section ── */}
                    <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                            Software Website Link (Auto-Fetches Logo) *
                          </label>
                          <p className="text-[11px] text-slate-500 font-medium">
                            Enter your tool website link — Logo is automatically detected and synced everywhere!
                          </p>
                        </div>
                        {formData.vendorLogo && (
                          <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                            <Check className="w-3 h-3 text-emerald-600" />
                            Logo Auto-Detected
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex-1 w-full">
                          <input
                            type="text"
                            placeholder="e.g. https://chatchacha.com or mailmunch.com"
                            value={formData.websiteUrl || ''}
                            onChange={(e) => handleWebsiteChange(e.target.value)}
                            className="w-full bg-white border border-slate-200 text-slate-900 text-xs font-bold p-3.5 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                          />
                        </div>

                        {/* Live Detected Logo Preview */}
                        <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs shrink-0">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center p-1.5 overflow-hidden">
                            {formData.vendorLogo ? (
                              <img
                                src={formData.vendorLogo}
                                alt="Detected Logo"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  e.target.src = 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png';
                                }}
                              />
                            ) : (
                              <Sparkles className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          <div className="text-left">
                            <div className="text-[11px] font-black text-slate-900">Live Logo Preview</div>
                            <div className="text-[10px] text-slate-500 font-semibold truncate max-w-[120px]">
                              {formData.vendorName || 'Auto-Detected'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Category *</label>
                        <select
                          value={formData.category}
                          onChange={(e) => handleInputChange('category', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3.5 rounded-xl cursor-pointer focus:outline-none focus:border-[#FF6B35]"
                        >
                          <option value="WhatsApp Bots">💬 WhatsApp Tools & Bots</option>
                          <option value="AI & GEO SEO">🤖 AI & GEO SEO</option>
                          <option value="Lead Scrapers">🎯 Lead Scraping & B2B</option>
                          <option value="CRM & Sales">📊 CRM & Sales Automation</option>
                          <option value="Video & Design">🎨 Video & Design Tools</option>
                          <option value="Analytics">📈 Analytics & Reporting</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Vendor Location</label>
                        <input
                          type="text"
                          placeholder="e.g. Bengaluru, India"
                          value={formData.vendorLocation}
                          onChange={(e) => handleInputChange('vendorLocation', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3.5 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Vendor Logo URL (or Auto)</label>
                        <input
                          type="text"
                          placeholder="https://..."
                          value={formData.vendorLogo}
                          onChange={(e) => handleInputChange('vendorLogo', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3.5 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                        />
                      </div>
                    </div>

                    {/* ── 14-Day Real Flash Launch Campaign Setting ── */}
                    <div className="bg-red-50/70 border-2 border-red-200/80 rounded-2xl p-4 sm:p-5 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-red-600 animate-pulse" />
                          <div>
                            <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider">
                              14-Day Real Flash Launch Duration *
                            </h4>
                            <p className="text-[11px] text-slate-500 font-medium">
                              Set your official flash deal duration. A real-time live ticking countdown timer will appear on your deal page and cards!
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] font-black text-red-700 bg-red-100 border border-red-300 px-3 py-1 rounded-full uppercase tracking-wider shrink-0">
                          Live Ticking Timer
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Campaign Duration (Days) *
                          </label>
                          <select
                            value={formData.campaignDurationDays || 14}
                            onChange={(e) => handleInputChange('campaignDurationDays', Number(e.target.value))}
                            className="w-full bg-white border border-red-200 text-slate-900 text-xs font-black p-3.5 rounded-xl cursor-pointer focus:outline-none focus:border-red-500"
                          >
                            <option value={14}>🔥 14 Days (Standard AppSumo Flash Launch - Recommended)</option>
                            <option value={7}>⚡ 7 Days (Short Flash Promo)</option>
                            <option value={21}>🚀 21 Days (Extended Launch)</option>
                            <option value={30}>🌟 30 Days (Full Month Special)</option>
                          </select>
                        </div>

                        <div className="bg-white p-3.5 rounded-xl border border-red-200/70 flex items-center gap-3">
                          <div className="text-2xl font-black text-red-600 font-mono">
                            {formData.campaignDurationDays || 14}d
                          </div>
                          <div className="text-[11px] text-slate-600 font-semibold leading-tight">
                            Deal will automatically run with live 24/7 countdown timer from launch moment.
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pricing Tiers */}
                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider">
                        5-Year Pass Pricing Tiers (INR ₹)
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Starter Pass (₹) *</label>
                          <input
                            type="number"
                            required
                            value={formData.tier1Price}
                            onChange={(e) => handleInputChange('tier1Price', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Pro Pass (₹) *</label>
                          <input
                            type="number"
                            required
                            value={formData.tier2Price}
                            onChange={(e) => handleInputChange('tier2Price', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Agency Pass (₹)</label>
                          <input
                            type="number"
                            value={formData.tier3Price}
                            onChange={(e) => handleInputChange('tier3Price', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Original 5-Yr Cost (₹)</label>
                          <input
                            type="number"
                            value={formData.originalPrice}
                            onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── TAB 2: PLAN FEATURES BUILDER (STARTER / PRO / AGENCY) ── */}
                {activeFormTab === 'tiers' && (
                  <div className="space-y-4 animate-fadeIn">
                    <PlanFeaturesBuilder
                      pricingTiers={pricingTiers.map((t, idx) => ({
                        ...t,
                        price: idx === 0 ? (Number(formData.tier1Price) || t.price) : idx === 1 ? (Number(formData.tier2Price) || t.price) : (Number(formData.tier3Price) || t.price),
                      }))}
                      onChange={(updatedTiers) => setPricingTiers(updatedTiers)}
                    />
                  </div>
                )}

                {/* ── TAB 2: MEDIA & GALLERY ── */}
                {activeFormTab === 'media' && (
                  <div className="space-y-5 animate-fadeIn">
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                        Hero Product Screenshot Image URL *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="https://images.unsplash.com/photo-..."
                        value={formData.heroImage}
                        onChange={(e) => handleInputChange('heroImage', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3.5 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                      />
                      {formData.heroImage && (
                        <div className="mt-3 w-48 h-32 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                          <img src={formData.heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                        YouTube Demo / Walkthrough Embed URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://www.youtube.com/embed/dQw4w9WgXcQ"
                        value={formData.videoUrl}
                        onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3.5 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                        Additional Product Screenshots (1 URL per line)
                      </label>
                      <textarea
                        rows={4}
                        placeholder="https://...\nhttps://..."
                        value={formData.screenshotsText}
                        onChange={(e) => handleInputChange('screenshotsText', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono p-3.5 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                      />
                    </div>
                  </div>
                )}

                {/* ── TAB 3: TL;DR & SPECS ── */}
                {activeFormTab === 'tldr' && (
                  <div className="space-y-5 animate-fadeIn">
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                        TL;DR Key Value Props (1 bullet per line) *
                      </label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Create 1-click broadcasts\nAutomate abandoned cart recovery\nInstant Razorpay checkout"
                        value={formData.tldrText}
                        onChange={(e) => handleInputChange('tldrText', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3.5 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Alternative To</label>
                        <input
                          type="text"
                          placeholder="e.g. Interakt, WATI, ManyChat"
                          value={formData.alternativeTo}
                          onChange={(e) => handleInputChange('alternativeTo', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3.5 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Integrations</label>
                        <input
                          type="text"
                          placeholder="e.g. Shopify, Razorpay, Zapier"
                          value={formData.integrations}
                          onChange={(e) => handleInputChange('integrations', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3.5 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Best For</label>
                        <input
                          type="text"
                          placeholder="e.g. Digital Agencies, E-commerce"
                          value={formData.bestFor}
                          onChange={(e) => handleInputChange('bestFor', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3.5 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── TAB 4: FEATURE SHOWCASES ── */}
                {activeFormTab === 'features' && (
                  <div className="space-y-6 animate-fadeIn">
                    
                    {/* Feature 1 */}
                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Feature Showcase #1</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Feature Title</label>
                          <input
                            type="text"
                            value={formData.feat1Title}
                            onChange={(e) => handleInputChange('feat1Title', e.target.value)}
                            className="w-full bg-white border border-slate-200 text-slate-900 text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Feature Screenshot URL</label>
                          <input
                            type="text"
                            value={formData.feat1Image}
                            onChange={(e) => handleInputChange('feat1Image', e.target.value)}
                            className="w-full bg-white border border-slate-200 text-slate-900 text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Feature Description</label>
                        <textarea
                          rows={2}
                          value={formData.feat1Desc}
                          onChange={(e) => handleInputChange('feat1Desc', e.target.value)}
                          className="w-full bg-white border border-slate-200 text-slate-900 text-xs font-medium p-3 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                        />
                      </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Feature Showcase #2</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Feature Title</label>
                          <input
                            type="text"
                            value={formData.feat2Title}
                            onChange={(e) => handleInputChange('feat2Title', e.target.value)}
                            className="w-full bg-white border border-slate-200 text-slate-900 text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Feature Screenshot URL</label>
                          <input
                            type="text"
                            value={formData.feat2Image}
                            onChange={(e) => handleInputChange('feat2Image', e.target.value)}
                            className="w-full bg-white border border-slate-200 text-slate-900 text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Feature Description</label>
                        <textarea
                          rows={2}
                          value={formData.feat2Desc}
                          onChange={(e) => handleInputChange('feat2Desc', e.target.value)}
                          className="w-full bg-white border border-slate-200 text-slate-900 text-xs font-medium p-3 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                        />
                      </div>
                    </div>

                  </div>
                )}

                {/* ── TAB 5: FOUNDER & DELIVERY ── */}
                {activeFormTab === 'founder' && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                          Founder Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rahul Verma"
                          value={formData.founderName}
                          onChange={(e) => handleInputChange('founderName', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3.5 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                          Founder Title
                        </label>
                        <input
                          type="text"
                          placeholder="Founder & CEO"
                          value={formData.founderTitle}
                          onChange={(e) => handleInputChange('founderTitle', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3.5 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                          Founder Work Email (For 70% Payouts) *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="founder@company.com"
                          value={formData.founderEmail}
                          onChange={(e) => handleInputChange('founderEmail', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3.5 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                          Founder WhatsApp / Phone Number *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="+91 98765 43210"
                          value={formData.founderPhone}
                          onChange={(e) => handleInputChange('founderPhone', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3.5 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                        License Redemption URL (Where buyers activate their 5-Yr pass) *
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://yourproduct.com/redeem"
                        value={formData.vendorRedeemUrl}
                        onChange={(e) => handleInputChange('vendorRedeemUrl', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3.5 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                        Founder Story / Why you built this tool
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Share the problem you faced and why you created this SaaS software..."
                        value={formData.founderNote}
                        onChange={(e) => handleInputChange('founderNote', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium p-3.5 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                      />
                    </div>
                  </div>
                )}

                {/* Submit Bar */}
                <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>70% Revenue Share · Razorpay UPI · B2B GST Invoiced</span>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full sm:w-auto px-10 py-4 bg-[#FF6B35] hover:bg-[#E85A24] disabled:opacity-50 text-white font-black text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {saving ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Rocket className="w-4 h-4" />
                        <span>Publish SaaS Tool & Start 14-Day Launch</span>
                      </>
                    )}
                  </button>
                </div>

              </form>

            </div>
          </>
        )}

      </main>

      <Footer />
    </div>
  );
}
