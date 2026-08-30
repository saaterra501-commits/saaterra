'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import CompareTray from '../../../components/CompareTray';
import LTDCheckoutModal from '../../../components/LTDCheckoutModal';
import Link from 'next/link';
import {
  Sparkles, Flame, ShieldCheck, Clock, Check, X, MessageSquare, ThumbsUp,
  User, Play, Star, ChevronDown, ChevronRight, Copy, Share2, HelpCircle, ArrowRight,
  ExternalLink, Search, Filter
} from 'lucide-react';

function TacoStars({ count = 5 }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`text-base ${i <= count ? 'text-amber-400' : 'text-slate-300'}`}>
          🌮
        </span>
      ))}
    </div>
  );
}

function RealFlashCountdown({ endDate, durationDays = 14 }) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: durationDays || 14,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
    percentLeft: 100,
  });

  useEffect(() => {
    setMounted(true);
    const target = endDate ? new Date(endDate).getTime() : Date.now() + durationDays * 24 * 60 * 60 * 1000;
    const totalDuration = durationDays * 24 * 60 * 60 * 1000;

    function update() {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, percentLeft: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      const percentLeft = Math.max(0, Math.min(100, Math.round((diff / totalDuration) * 100)));

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false, percentLeft });
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endDate, durationDays]);

  const displayDays = mounted ? String(timeLeft.days).padStart(2, '0') : String(durationDays || 14).padStart(2, '0');
  const displayHours = mounted ? String(timeLeft.hours).padStart(2, '0') : '00';
  const displayMins = mounted ? String(timeLeft.minutes).padStart(2, '0') : '00';
  const displaySecs = mounted ? String(timeLeft.seconds).padStart(2, '0') : '00';

  return (
    <div className="bg-gradient-to-r from-red-50 via-amber-50 to-orange-50 border-2 border-red-200/80 rounded-2xl p-3.5 space-y-2.5" suppressHydrationWarning>
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-black text-red-600">
          <Clock className="w-4 h-4 animate-pulse" />
          <span>REAL 14-DAY FLASH LAUNCH</span>
        </div>
        <span className="text-[10px] font-black bg-red-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
          Limited Pass
        </span>
      </div>

      {/* Countdown Digits */}
      <div className="grid grid-cols-4 gap-1.5 text-center" suppressHydrationWarning>
        <div className="bg-white border border-red-200/70 rounded-xl py-1.5 shadow-xs">
          <div className="text-lg font-black text-slate-950 font-mono leading-none" suppressHydrationWarning>{displayDays}</div>
          <div className="text-[8px] font-bold text-slate-500 uppercase mt-0.5">Days</div>
        </div>
        <div className="bg-white border border-red-200/70 rounded-xl py-1.5 shadow-xs">
          <div className="text-lg font-black text-slate-950 font-mono leading-none" suppressHydrationWarning>{displayHours}</div>
          <div className="text-[8px] font-bold text-slate-500 uppercase mt-0.5">Hours</div>
        </div>
        <div className="bg-white border border-red-200/70 rounded-xl py-1.5 shadow-xs">
          <div className="text-lg font-black text-slate-950 font-mono leading-none" suppressHydrationWarning>{displayMins}</div>
          <div className="text-[8px] font-bold text-slate-500 uppercase mt-0.5">Mins</div>
        </div>
        <div className="bg-white border border-red-200/70 rounded-xl py-1.5 shadow-xs">
          <div className="text-lg font-black text-red-600 font-mono leading-none" suppressHydrationWarning>{displaySecs}</div>
          <div className="text-[8px] font-bold text-red-600 uppercase mt-0.5">Secs</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="w-full h-1.5 bg-red-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-1000"
            style={{ width: `${timeLeft.percentLeft}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] font-bold text-slate-500">
          <span>Vendor 14-Day Launch</span>
          <span className="text-red-600">{timeLeft.percentLeft}% Time Remaining</span>
        </div>
      </div>
    </div>
  );
}

export default function SingleSoftwareDealPage({ params }) {
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedTierIndex, setSelectedTierIndex] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState({});
  const [activeTab, setActiveTab] = useState('Reviews');
  const [termsOpen, setTermsOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [questionAsked, setQuestionAsked] = useState(false);

  // Review Modal states
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHeadline, setReviewHeadline] = useState('');
  const [reviewPros, setReviewPros] = useState('');
  const [reviewCons, setReviewCons] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');
  const [reviewError, setReviewError] = useState('');

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewMsg('');
    setReviewSubmitting(true);

    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          softwareSlug: deal.slug || 'chat-chacha',
          rating: reviewRating,
          headline: reviewHeadline,
          feedbackPros: reviewPros,
          feedbackCons: reviewCons,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setReviewError(data.error || 'Failed to submit review');
        return;
      }

      setReviewMsg(data.message || 'Review submitted successfully! ₹100 ST Credits added to wallet.');
      
      // Add review optimistically
      const newR = {
        name: 'You (Verified Buyer)',
        rating: reviewRating,
        date: 'Just now',
        text: `${reviewHeadline}: ${reviewPros}`,
      };
      setDeal((prev) => ({
        ...prev,
        reviews: [newR, ...(prev.reviews || [])],
      }));

      setTimeout(() => {
        setReviewModalOpen(false);
        setReviewHeadline('');
        setReviewPros('');
        setReviewCons('');
        setReviewMsg('');
      }, 1200);

    } catch (err) {
      setReviewError(err.message || 'Error submitting review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  useEffect(() => {
    async function fetchDeal() {
      try {
        const p = await params;
        const slug = p?.['deal-slug'] || 'chat-chacha';
        const res = await fetch(`/api/deals/${slug}`);
        const data = await res.json();
        if (data?.success && data?.deal) {
          setDeal(data.deal);
        }
      } catch (err) {
        console.error('Fetch deal error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDeal();
  }, [params]);

  if (loading || !deal) {
    return (
      <div className="min-h-screen bg-[#F6F7FB] flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#2475FF] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500">Loading Software Deal Details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Block public viewing if software deal is not yet approved by Admin
  if (deal.status === 'Pending') {
    return (
      <div className="min-h-screen bg-[#F6F7FB] flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="max-w-lg w-full bg-white border border-amber-300 rounded-3xl p-8 text-center space-y-5 shadow-xl animate-fadeIn">
            <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-black text-amber-800 bg-amber-50 px-3 py-1 rounded-full uppercase border border-amber-200">
                ⏳ Under QA Verification
              </span>
              <h2 className="text-2xl font-black text-slate-950">
                "{deal.title}" is Pending Admin Approval
              </h2>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                This software deal is currently undergoing QA verification by the StackDeal team. It will become publicly visible once approved.
              </p>
            </div>
            <Link
              href="/deals"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B35] hover:bg-[#E85A24] text-white font-black text-xs rounded-xl shadow transition-all"
            >
              Browse Active Deals
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const currentTier = deal.pricingTiers?.[selectedTierIndex] || deal.pricingTiers?.[0] || {
    tierName: 'Starter Pass', price: 1999, originalPrice: 24000
  };

  const discountPct = Math.round((1 - currentTier.price / (currentTier.originalPrice || currentTier.price * 10)) * 100);

  const toggleFeatures = (idx) => {
    setShowAllFeatures((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const dealProductSchema = {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "Product"],
    "name": deal.title,
    "headline": deal.tagline,
    "description": deal.description || deal.tagline,
    "applicationCategory": deal.category || "BusinessApplication",
    "operatingSystem": "Web, Cloud, Windows, macOS, Linux, Android, iOS",
    "url": `https://stackdeal.in/deals/${deal.slug}`,
    "image": deal.screenshot || deal.heroImage || "https://stackdeal.in/stackdeal-logo.png",
    "brand": {
      "@type": "Brand",
      "name": deal.vendorName || "StackDeal Partner"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": deal.tacoRating || 5.0,
      "bestRating": 5,
      "ratingCount": deal.reviewsCount || (deal.reviews?.length || 12),
      "reviewCount": deal.reviews?.length || 12
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": currentTier.price || 1999,
      "priceValidUntil": "2030-12-31",
      "availability": "https://schema.org/InStock",
      "url": `https://stackdeal.in/deals/${deal.slug}`,
      "seller": {
        "@type": "Organization",
        "name": "StackDeal India"
      },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "IN",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 60,
        "returnMethod": "https://schema.org/ReturnOnline",
        "returnFees": "https://schema.org/FreeReturn"
      }
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://stackdeal.in" },
      { "@type": "ListItem", "position": 2, "name": "Deals", "item": "https://stackdeal.in/deals" },
      { "@type": "ListItem", "position": 3, "name": deal.title, "item": `https://stackdeal.in/deals/${deal.slug}` }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": (deal.faqs && deal.faqs.length > 0 ? deal.faqs : [
      { q: "What is included in the 5-Year Pass?", a: "You get full platform access, all regular feature updates, and priority customer support for 5 full years with zero monthly subscription fees." },
      { q: "Can I get an official GST B2B tax invoice?", a: "Yes, automated 18% GST tax invoices with your agency name and GSTIN are provided instantly upon checkout." },
      { q: "What is the refund policy?", a: "StackDeal provides a 100% money-back guarantee for 60 days from date of purchase." }
    ]).map((f) => ({
      "@type": "Question",
      "name": f.q || f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a || f.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex flex-col font-sans">
      
      {/* ── JSON-LD Structured Data for SEO, AIO (SearchGPT / Perplexity), and GEO ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dealProductSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Navbar />

      {/* ── 1. Top StackDeal Ticker Ribbon (#FF6B35) ── */}
      <div className="w-full bg-[#FF6B35] text-white py-2.5 overflow-hidden shadow-sm relative z-20">
        <div className="ticker-wrapper flex whitespace-nowrap">
          <div className="ticker-inner flex items-center gap-8 animate-ticker text-xs font-black uppercase tracking-wider">
            {[1, 2, 3, 4].map((_, i) => (
              <span key={i} className="inline-flex items-center gap-8">
                <span className="flex items-center gap-2"><span className="text-base">💳</span> 5-Year Access Passes for Agencies</span>
                <span className="flex items-center gap-2"><span className="text-base">⚡</span> Zero Monthly Subscriptions</span>
                <span className="flex items-center gap-2"><span className="text-base">🇮🇳</span> Instant Razorpay UPI</span>
                <span className="flex items-center gap-2"><span className="text-base">🛡️</span> 60-Day Money-Back Guarantee</span>
                <span className="flex items-center gap-2"><span className="text-base">📄</span> GST B2B Invoices Included</span>
                <span className="flex items-center gap-2"><span className="text-base">🔑</span> Instant License Key Delivery</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. Top Header & Sticky Purchase Widget Container ── */}
      <section className="bg-white border-b border-slate-200 pt-8 pb-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <Link href="/" className="hover:text-slate-900">Home</Link>
            <span>/</span>
            <Link href="/deals" className="hover:text-slate-900">Deals</Link>
            <span>/</span>
            <span className="text-slate-900 font-extrabold">{deal.vendorName}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: Main Title + Video / Large Gallery */}
            <div className="lg:col-span-8 space-y-6">
              
              <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
                {deal.title}
              </h1>

              {/* Main Media Player / Image Display */}
              <div className="rounded-3xl overflow-hidden border border-slate-200 bg-slate-950 aspect-video shadow-xl relative">
                {selectedImage === 0 && deal.videoUrl ? (
                  <iframe
                    src={deal.videoUrl}
                    title={deal.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : (
                  <img
                    src={deal.screenshots?.[selectedImage] || deal.screenshots?.[0]}
                    alt="product screenshot"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Thumbnails Row */}
              {deal.screenshots && deal.screenshots.length > 0 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {deal.videoUrl && (
                    <button
                      onClick={() => setSelectedImage(0)}
                      className={`w-24 h-16 rounded-xl overflow-hidden border-2 relative shrink-0 transition-all ${
                        selectedImage === 0 ? 'border-[#2475FF] ring-2 ring-[#2475FF]/20' : 'border-slate-200'
                      }`}
                    >
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold">
                        <Play className="w-5 h-5 fill-white" />
                      </div>
                    </button>
                  )}
                  {deal.screenshots.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx + (deal.videoUrl ? 1 : 0))}
                      className={`w-24 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        selectedImage === (idx + (deal.videoUrl ? 1 : 0)) ? 'border-[#2475FF] ring-2 ring-[#2475FF]/20' : 'border-slate-200'
                      }`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Tagline / Intro Description */}
              <p className="text-slate-700 text-sm sm:text-base font-medium leading-relaxed">
                {deal.tagline}
              </p>

            </div>

            {/* RIGHT: Sticky Purchase Card Widget (AppSumo Exact Match) */}
            <div className="lg:col-span-4 sticky top-20">
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-xl space-y-6">
                
                {/* Logo & Vendor Rating */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 p-2 shrink-0">
                      <img src={deal.vendorLogo} alt={deal.vendorName} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-950 text-base">{deal.vendorName}</h3>
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <TacoStars count={5} />
                        <span className="text-xs font-bold text-slate-600">({deal.reviews?.length || 1} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Real 14-Day Countdown Timer Widget ── */}
                <RealFlashCountdown
                  endDate={deal.campaignEndDate}
                  durationDays={deal.campaignDurationDays || 14}
                />

                {/* Pricing & Discount Pill */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500 text-white font-black text-xs px-2.5 py-0.5 rounded-full">
                      -{discountPct}%
                    </span>
                    <span className="text-3xl font-black text-slate-950">
                      ₹{currentTier.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-slate-400 line-through text-sm font-semibold">
                      ₹{(currentTier.originalPrice || currentTier.price * 10).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Tier Selection Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Select a plan:
                  </label>
                  <select
                    value={selectedTierIndex}
                    onChange={(e) => setSelectedTierIndex(Number(e.target.value))}
                    className="w-full p-3 bg-[#F8FAFC] border-2 border-slate-200 text-slate-900 font-bold text-xs rounded-xl focus:outline-none focus:border-[#2475FF] cursor-pointer"
                  >
                    {deal.pricingTiers?.map((t, idx) => (
                      <option key={idx} value={idx}>
                        {t.tierName} — ₹{t.price.toLocaleString('en-IN')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bright Orange Buy Now CTA Button */}
                <Link
                  href={`/cart?deal=${deal.slug || 'chat-chacha'}&tier=${encodeURIComponent(currentTier.tierName)}&price=${currentTier.price}`}
                  className="w-full py-4 bg-[#FF6B35] hover:bg-[#E85A24] text-white font-black text-base rounded-xl shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Buy now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Trust Bullet Items */}
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-medium text-slate-700">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <strong>5-Year access</strong> to software updates
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <strong>Refundable up to 60 days</strong> (No questions asked)
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#2475FF] shrink-0" />
                    B2B GST Tax Invoice included
                  </div>
                </div>

                {/* Compare With Other Tools Link */}
                <div className="pt-2 border-t border-slate-100 text-center">
                  <Link
                    href={`/compare?tools=${deal.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#2475FF] transition-colors"
                  >
                    <span>Compare with alternative tools</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 3. TL;DR & At-a-Glance Box ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-6">
        
        {/* TLDR Bullet List */}
        {deal.tldr && deal.tldr.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xl font-black text-slate-950">TL;DR</h3>
            <div className="space-y-2">
              {deal.tldr.map((point, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-sm font-bold text-slate-800 leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* At-a-Glance Box (Exact AppSumo Card Match) */}
        {deal.atAGlance && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            <div className="space-y-1">
              <div className="text-xs font-black text-slate-400 uppercase tracking-wider">Alternative to</div>
              <div className="text-sm font-bold text-slate-900">{deal.atAGlance.alternativeTo}</div>
            </div>
            <div className="space-y-1 pt-4 md:pt-0 md:pl-6">
              <div className="text-xs font-black text-slate-400 uppercase tracking-wider">Integrations</div>
              <div className="text-sm font-bold text-slate-900">{deal.atAGlance.integrations}</div>
            </div>
            <div className="space-y-1 pt-4 md:pt-0 md:pl-6">
              <div className="text-xs font-black text-slate-400 uppercase tracking-wider">Best for</div>
              <div className="text-sm font-bold text-slate-900">{deal.atAGlance.bestFor}</div>
            </div>
          </div>
        )}

      </section>

      {/* ── 4. Feature Showcase Rows (Alternating Grid) ── */}
      {deal.featureShowcases && deal.featureShowcases.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-16">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
              Run your whole agency workflow with {deal.vendorName}
            </h2>
          </div>

          <div className="space-y-16">
            {deal.featureShowcases.map((feat, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={idx} className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${!isEven ? 'lg:flex-row-reverse' : ''}`}>
                  
                  {/* Text Column */}
                  <div className={`lg:col-span-6 space-y-4 ${!isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-950 leading-tight">
                      {feat.title}
                    </h3>
                    <p className="text-slate-700 text-sm font-medium leading-relaxed">
                      {feat.description}
                    </p>

                    {feat.bullets && feat.bullets.length > 0 && (
                      <ul className="space-y-2 pt-2">
                        {feat.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2 text-xs font-bold text-slate-800">
                            <span className="text-emerald-500 font-black">•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Screenshot Image Column */}
                  <div className={`lg:col-span-6 ${!isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white">
                      <img src={feat.imageUrl} alt={feat.title} className="w-full h-auto object-cover" />
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── 5. Pricing Tier Cards ("Choose the plan that's right for you") ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-14 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950">
            Choose the plan that's right for you
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Feel secure in your purchase with StackDeal's 60-day money-back guarantee.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {deal.pricingTiers?.map((tier, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-3xl p-8 shadow-xl flex flex-col justify-between relative border-2 ${
                tier.isRecommended ? 'border-[#2475FF] ring-4 ring-[#2475FF]/10' : 'border-slate-200'
              }`}
            >
              {tier.isRecommended && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#2475FF] text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3 h-3" /> Recommended
                </div>
              )}

              <div className="space-y-6">
                <div className="text-center space-y-2 border-b border-slate-100 pb-6">
                  <h3 className="text-lg font-black text-slate-950">{tier.tierName}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-black text-slate-950">₹{tier.price.toLocaleString('en-IN')}</span>
                    <span className="text-slate-500 font-bold text-xs">/ 5-year access</span>
                  </div>
                </div>

                {/* Primary Orange Buy Button */}
                <Link
                  href={`/cart?deal=${deal.slug || 'chat-chacha'}&tier=${encodeURIComponent(tier.tierName)}&price=${tier.price}`}
                  className="w-full py-3.5 bg-[#FF6B35] hover:bg-[#E85A24] text-white font-black text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Buy now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Feature Checklist */}
                <div className="space-y-3 pt-2">
                  {tier.features?.map((f, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs font-bold">
                      {f.included ? (
                        <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center shrink-0 mt-0.5">
                          <X className="w-3 h-3" />
                        </div>
                      )}
                      <span className={f.included ? 'text-slate-900' : 'text-slate-400 line-through'}>
                        {f.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Show all included features toggle */}
              <div className="pt-6 text-center border-t border-slate-100 mt-6">
                <button
                  onClick={() => toggleFeatures(idx)}
                  className="text-xs font-bold text-[#2475FF] hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
                >
                  <span>Show all included features</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAllFeatures[idx] ? 'rotate-180' : ''}`} />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Guarantee Pill */}
        <div className="text-center pt-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-full">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Refundable up to 60 days
          </span>
        </div>
      </section>

      {/* ── 6. Deal Terms & Conditions Accordion ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 py-4 w-full">
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => setTermsOpen(!termsOpen)}
            className="w-full p-5 flex items-center justify-between font-black text-sm text-slate-950 hover:bg-slate-50 transition-colors text-left"
          >
            <span>Deal terms & conditions</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${termsOpen ? 'rotate-180' : ''}`} />
          </button>

          {termsOpen && (
            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-2 text-xs font-semibold text-slate-700">
              {deal.terms?.map((t, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-[#2475FF] font-black">•</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 7. Founder Story & Company Specs Card ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-10 w-full">
        <div className="bg-[#F8FAFC] border border-slate-200 rounded-3xl p-8 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left: Company Specs */}
          <div className="md:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 space-y-3 font-semibold text-xs text-slate-700">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <img src={deal.vendorLogo} alt={deal.vendorName} className="w-8 h-8 object-contain" />
              <span className="font-black text-slate-950 text-sm">{deal.vendorName}</span>
            </div>
            <div>🚩 Founded {deal.foundedDate || 'April 2022'}</div>
            <div>📍 {deal.vendorLocation || 'New Delhi, India'}</div>
            <div>👥 {deal.teamSize || '1-10 employees'}</div>
            <div>🚀 Stage: Active SaaS</div>
          </div>

          {/* Right: Founder Story */}
          <div className="md:col-span-8 space-y-4">
            <h3 className="text-xl font-black text-slate-950">
              We built {deal.vendorName} to solve real agency challenges.
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              "{deal.founderNote}"
            </p>

            <div className="flex items-center gap-3 pt-2">
              <img src={deal.founderAvatar} alt={deal.founderName} className="w-10 h-10 rounded-full object-cover border border-slate-300" />
              <div>
                <div className="font-black text-slate-950 text-xs">{deal.founderName}</div>
                <div className="text-[10px] text-slate-500 font-bold">{deal.founderTitle}</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 8. Questions & Reviews Section ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-8 w-full">
        <div className="border-b border-slate-200 pb-4 flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-2xl font-black text-slate-950">Questions & reviews</h2>
          
          <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
            {['Reviews', 'Questions', 'FAQs'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 border-b-2 transition-all ${
                  activeTab === tab ? 'border-[#2475FF] text-[#2475FF] font-black' : 'border-transparent hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews List Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Reviews List */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Write a Review CTA Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
              <div>
                <span className="text-[10px] font-black text-[#2475FF] bg-blue-100 px-2 py-0.5 rounded-full uppercase">
                  🎁 Earn ₹100 ST Credits
                </span>
                <h4 className="font-black text-slate-950 text-sm sm:text-base mt-1">
                  Have you tested {deal.vendorName || deal.title}?
                </h4>
                <p className="text-xs text-slate-600 font-medium">
                  Write a verified review to help fellow founders and get ₹100 added to your wallet.
                </p>
              </div>

              <button
                onClick={() => setReviewModalOpen(true)}
                className="px-4 py-2.5 bg-[#FF6B35] hover:bg-[#E85A24] text-white text-xs font-black rounded-xl shadow-md transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Write a Review</span>
              </button>
            </div>

            {deal.reviews?.map((r, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TacoStars count={r.rating} />
                    <span className="text-xs font-black text-slate-900">{r.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">{r.date}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{r.text}</p>
                <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 inline-block px-2.5 py-0.5 rounded-full border border-emerald-200">
                  ✔ Verified Buyer Pass
                </div>
              </div>
            ))}
          </div>

          {/* Right Summary Box */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="text-center space-y-1">
              <div className="text-3xl font-black text-slate-950">4.9</div>
              <TacoStars count={5} />
              <div className="text-xs font-bold text-slate-500">Based on {deal.reviews?.length || 1} verified reviews (MongoDB)</div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-600">
              <div className="flex justify-between">
                <span>5 Tacos</span>
                <span className="font-bold text-slate-900">84%</span>
              </div>
              <div className="flex justify-between">
                <span>4 Tacos</span>
                <span className="font-bold text-slate-900">12%</span>
              </div>
              <div className="flex justify-between">
                <span>3 Tacos</span>
                <span className="font-bold text-slate-900">4%</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      <CompareTray />
      <Footer />

      {showCheckout && (
        <LTDCheckoutModal
          deal={{
            ...deal,
            tier1Price: currentTier.price,
            tier1Title: currentTier.tierName,
          }}
          selectedTier={currentTier.tierName}
          onClose={() => setShowCheckout(false)}
        />
      )}

      {/* Write a Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-5">
            <button
              onClick={() => setReviewModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-black text-[#2475FF] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full uppercase">
                🎁 Earn ₹100 ST Credits
              </span>
              <h3 className="text-xl font-black text-slate-950 mt-1">
                Write a Review for {deal.vendorName || deal.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Your authentic feedback helps fellow SaaS founders make informed decisions.
              </p>
            </div>

            {reviewError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl">
                {reviewError}
              </div>
            )}

            {reviewMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl">
                {reviewMsg}
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Taco Rating Select */}
              <div>
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block mb-1">
                  Your Taco Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className={`text-2xl p-1 transition-transform hover:scale-125 cursor-pointer ${
                        star <= reviewRating ? 'opacity-100' : 'opacity-30 grayscale'
                      }`}
                    >
                      🌮
                    </button>
                  ))}
                  <span className="text-xs font-black text-slate-700 ml-2">
                    {reviewRating} {reviewRating === 1 ? 'Taco' : 'Tacos'}
                  </span>
                </div>
              </div>

              {/* Headline */}
              <div>
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Best WhatsApp marketing automation tool for agencies!"
                  value={reviewHeadline}
                  onChange={(e) => setReviewHeadline(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#2475FF] focus:outline-none"
                />
              </div>

              {/* Pros */}
              <div>
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block mb-1">
                  What do you like best? (Pros)
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="The automated chatbot workflows and broadcast speed are unmatched..."
                  value={reviewPros}
                  onChange={(e) => setReviewPros(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#2475FF] focus:outline-none"
                />
              </div>

              {/* Cons */}
              <div>
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block mb-1">
                  Any suggestions or challenges? (Cons)
                </label>
                <input
                  type="text"
                  placeholder="e.g. More API integrations with HubSpot would be great."
                  value={reviewCons}
                  onChange={(e) => setReviewCons(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#2475FF] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={reviewSubmitting}
                className="w-full py-3 bg-[#FF6B35] hover:bg-[#E85A24] disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {reviewSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Submit Verified Review & Claim ₹100 Credits</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
