'use client';

import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CompareTray from './CompareTray';
import LTDCheckoutModal from './LTDCheckoutModal';
import Link from 'next/link';
import {
  Sparkles, Flame, ShieldCheck, Clock, Check, X, MessageSquare, ThumbsUp,
  User, Play, Star, ChevronDown, ChevronRight, Copy, Share2, HelpCircle, ArrowRight,
  ExternalLink, Search, Filter, Globe, Building2, MapPin, Calendar, Users, ShoppingCart
} from 'lucide-react';
import { addToCart, isInCart } from '@/lib/cart';

function LinkedInIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  );
}

function TwitterXIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function IceCreamStars({ count = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`text-sm transition-opacity ${i <= count ? 'opacity-100' : 'opacity-25 grayscale'}`}>
          🍦
        </span>
      ))}
    </div>
  );
}

function FaqAccordionItem({ faq, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs transition-all">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-slate-50/50 transition-colors"
      >
        <span className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
          {faq.question}
        </span>
        <div className={`w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 transition-transform ${isOpen ? 'rotate-180 bg-orange-100 text-[#FF6B35]' : ''}`}>
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      {isOpen && (
        <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-slate-600 font-medium leading-relaxed border-t border-slate-100 animate-fadeIn space-y-3">
          <p>{faq.answer}</p>
          {faq.founderReply && (
            <div className="bg-orange-50/60 border-l-2 border-[#FF6B35] p-3 rounded-r-xl space-y-1">
              <div className="text-[10px] font-black text-[#FF6B35] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                <span>Founder Verified Response</span>
              </div>
              <p className="text-xs text-slate-800 font-semibold">{faq.founderReply}</p>
            </div>
          )}
        </div>
      )}
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

export default function DealDetailClient({ initialDeal, dealSlug, params }) {
  const [deal, setDeal] = useState(initialDeal || null);
  const [loading, setLoading] = useState(!initialDeal);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedTierIndex, setSelectedTierIndex] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState({});
  const [activeTab, setActiveTab] = useState('Reviews');
  const [termsOpen, setTermsOpen] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const handleAddToCart = () => {
    if (!deal) return;
    addToCart(deal, selectedTierIndex);
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 3000);
  };
  
  // Question / Founder message states
  const [questionName, setQuestionName] = useState('');
  const [questionEmail, setQuestionEmail] = useState('');
  const [questionPhone, setQuestionPhone] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [questionSubmitting, setQuestionSubmitting] = useState(false);
  const [questionSuccessMsg, setQuestionSuccessMsg] = useState('');
  const [questionErrorMsg, setQuestionErrorMsg] = useState('');

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    setQuestionErrorMsg('');
    setQuestionSuccessMsg('');

    if (!questionName.trim() || !questionEmail.trim() || !newQuestion.trim()) {
      setQuestionErrorMsg('Please fill in your name, email, and question.');
      return;
    }

    setQuestionSubmitting(true);

    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: deal.slug || 'chat-chacha',
          name: questionName,
          email: questionEmail,
          phone: questionPhone,
          question: newQuestion,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setQuestionErrorMsg(data.error || 'Failed to send question to founder.');
        return;
      }

      setQuestionSuccessMsg(data.message || `✓ Your question has been emailed directly to the founder!`);
      
      // Optimistically add to deal questions
      const newQ = {
        userName: questionName,
        userEmail: questionEmail,
        question: newQuestion,
        createdAt: new Date().toISOString(),
        status: 'Pending',
      };
      setDeal((prev) => ({
        ...prev,
        questions: [newQ, ...(prev.questions || [])],
      }));

      setNewQuestion('');
      setQuestionPhone('');
    } catch (err) {
      setQuestionErrorMsg(err.message || 'Network error sending question.');
    } finally {
      setQuestionSubmitting(false);
    }
  };

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

      setReviewMsg(data.message || 'Your verified review has been submitted successfully!');
      
      // Add review optimistically
      const newR = {
        name: 'You (Verified Buyer)',
        rating: reviewRating,
        date: 'Just now',
        headline: reviewHeadline,
        pros: reviewPros,
        cons: reviewCons,
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
    if (initialDeal) {
      setDeal(initialDeal);
      setLoading(false);
      return;
    }
    async function fetchDeal() {
      try {
        const p = await params;
        const slug = p?.['deal-slug'] || dealSlug || 'chat-chacha';
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
  }, [params, initialDeal, dealSlug]);

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
              {(() => {
                const allImgs = [
                  ...(deal.heroImage ? [deal.heroImage] : []),
                  ...(deal.screenshot && deal.screenshot !== deal.heroImage ? [deal.screenshot] : []),
                  ...(deal.screenshots || [])
                ].filter(Boolean);
                const gallery = Array.from(new Set(allImgs));
                if (gallery.length === 0) {
                  gallery.push('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop');
                }

                const hasValidVideo = Boolean(deal.videoUrl && deal.videoUrl.trim() && !deal.videoUrl.includes('dQw4w9WgXcQ'));

                return (
                  <div className="space-y-4">
                    <div className="rounded-3xl overflow-hidden border border-slate-200 bg-slate-950 aspect-video shadow-xl relative">
                      {selectedImage === -1 && hasValidVideo ? (
                        <iframe
                          src={deal.videoUrl}
                          title={deal.title}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      ) : (
                        <img
                          src={gallery[selectedImage >= 0 ? selectedImage : 0] || gallery[0]}
                          alt={deal.title || 'software screenshot'}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Thumbnails Row */}
                    {(gallery.length > 1 || hasValidVideo) && (
                      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {hasValidVideo && (
                          <button
                            onClick={() => setSelectedImage(-1)}
                            className={`w-24 h-16 rounded-xl overflow-hidden border-2 relative shrink-0 transition-all cursor-pointer ${
                              selectedImage === -1 ? 'border-[#2475FF] ring-2 ring-[#2475FF]/20' : 'border-slate-200'
                            }`}
                          >
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold">
                              <Play className="w-5 h-5 fill-white" />
                            </div>
                          </button>
                        )}
                        {gallery.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedImage(idx)}
                            className={`w-24 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                              (selectedImage === idx || (selectedImage === -1 && !hasValidVideo && idx === 0))
                                ? 'border-[#2475FF] ring-2 ring-[#2475FF]/20'
                                : 'border-slate-200'
                            }`}
                          >
                            <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

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
                        <IceCreamStars count={Math.round(Number(deal.reviews?.length > 0 ? (deal.reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / deal.reviews.length) : (deal.rating || 5)))} />
                        <span className="text-xs font-bold text-slate-600">({deal.reviews?.length || 0} reviews)</span>
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

                {/* Action Buttons: Buy Now & Add to Cart */}
                <div className="space-y-2.5">
                  <Link
                    href={`/cart?deal=${deal.slug || 'chat-chacha'}&tier=${encodeURIComponent(currentTier.tierName)}&price=${currentTier.price}`}
                    onClick={() => addToCart(deal, selectedTierIndex)}
                    className="w-full py-3.5 bg-[#FF6B35] hover:bg-[#E85A24] text-white font-black text-sm rounded-xl shadow-lg transition-all transform hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Buy now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`w-full py-3 rounded-xl border-2 font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isAddedToCart
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800 shadow-xs'
                    }`}
                  >
                    {isAddedToCart ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Added to Cart! (View in Header)</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 text-[#FF6B35]" />
                        <span>Add to Cart (Save for Later)</span>
                      </>
                    )}
                  </button>
                </div>

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

        {/* Dynamic Tier Grid (1, 2, or 3+ columns) */}
        {(() => {
          const activePricingTiers = (deal.pricingTiers || []).filter((t) => t.enabled !== false);
          const gridColsClass =
            activePricingTiers.length === 1
              ? 'grid grid-cols-1 max-w-md mx-auto'
              : activePricingTiers.length === 2
              ? 'grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
              : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto';

          return (
            <div className={`${gridColsClass} gap-8 items-stretch`}>
              {activePricingTiers.map((tier, idx) => (
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
                        <span className="text-4xl font-black text-slate-950">₹{(tier.price || 0).toLocaleString('en-IN')}</span>
                        <span className="text-slate-500 font-bold text-xs">/ 5-year access</span>
                      </div>

                      {/* Per-Tier Pass Inventory Scarcity Badge */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-full text-[11px] font-black mt-2">
                        <Flame className="w-3 h-3 text-amber-500" />
                        <span>Limited: {tier.totalCodes || 100} Passes Available</span>
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
          );
        })()}

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
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-12 w-full">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left: Clean Company Profile Specs */}
          <div className="md:col-span-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 space-y-4 text-xs">
            {/* Company Logo & Name Header */}
            <div className="flex items-center gap-3 pb-3.5 border-b border-slate-200/80">
              <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 p-2 shadow-xs flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  src={deal.vendorLogo || 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png'}
                  alt={deal.vendorName || 'Company'}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png';
                  }}
                />
              </div>
              <div className="min-w-0">
                <h4 className="font-black text-slate-950 text-sm truncate">{deal.vendorName || 'Company Partner'}</h4>
                <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full mt-0.5">
                  Verified Partner
                </span>
              </div>
            </div>

            {/* Clean Spec Pairs */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Founded</span>
                <span className="font-bold text-slate-900">{deal.foundedDate || 'April 2023'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Headquarters</span>
                <span className="font-bold text-slate-900">{deal.vendorLocation || 'Mumbai, India'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Team Size</span>
                <span className="font-bold text-slate-900">{deal.teamSize || '1-10 employees'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Status</span>
                <span className="font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md text-[11px]">Active SaaS</span>
              </div>
            </div>

            {/* Optional Website Link */}
            {deal.websiteUrl && (
              <div className="pt-2 border-t border-slate-200/80">
                <a
                  href={deal.websiteUrl.startsWith('http') ? deal.websiteUrl : `https://${deal.websiteUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11px] rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  <span>Visit Official Website</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            )}
          </div>

          {/* Right: Founder Story & Social Profile */}
          <div className="md:col-span-8 space-y-5">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                Founder's Mission
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 leading-snug">
                We built {deal.vendorName || deal.title} to solve real agency challenges.
              </h3>
            </div>

            <div className="relative pl-4 border-l-2 border-blue-500/40">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                "{deal.founderNote || 'We created this software to solve real agency bottlenecks without burning cash on overpriced monthly subscriptions.'}"
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-xs">
                  <img
                    src={deal.founderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={deal.founderName || 'Founder'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
                    }}
                  />
                </div>
                <div>
                  <div className="font-black text-slate-950 text-sm">{deal.founderName || 'Founder'}</div>
                  <div className="text-[11px] text-slate-500 font-bold">{deal.founderTitle || 'Founder & CEO'}</div>
                </div>
              </div>

              {/* Founder Social Links (LinkedIn & Twitter/X) */}
              <div className="flex items-center gap-2">
                {deal.founderLinkedin ? (
                  <a
                    href={deal.founderLinkedin.startsWith('http') ? deal.founderLinkedin : `https://${deal.founderLinkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] text-xs font-black rounded-xl transition-all"
                  >
                    <LinkedInIcon className="w-3.5 h-3.5 fill-current" />
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                ) : (
                  <a
                    href={`https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(deal.founderName || deal.vendorName || 'Founder')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
                  >
                    <LinkedInIcon className="w-3.5 h-3.5 text-[#0A66C2] fill-[#0A66C2]" />
                    <span>LinkedIn</span>
                  </a>
                )}

                {deal.founderTwitter && (
                  <a
                    href={deal.founderTwitter.startsWith('http') ? deal.founderTwitter : `https://x.com/${deal.founderTwitter.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all"
                  >
                    <TwitterXIcon className="w-3.5 h-3.5 fill-current" />
                    <span>Twitter / X</span>
                  </a>
                )}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 8. Dedicated Frequently Asked Questions Section ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-8 w-full">
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
            <div>
              <span className="text-[10px] font-black text-[#FF6B35] bg-orange-50 border border-orange-200 px-3 py-1 rounded-full uppercase tracking-wider">
                💬 Product FAQs & Knowledge Base
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 mt-2">
                Frequently Asked Questions
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Everything you need to know about {deal.vendorName || deal.title}, 5-Year Pass licensing, updates, and refunds.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs">
                {(deal.faqs || []).length > 0 ? `${deal.faqs.length} Answers Available` : '4 Common FAQs'}
              </span>
            </div>
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-3.5">
            {((deal.faqs && deal.faqs.length > 0) ? deal.faqs : [
              {
                question: `How do customers redeem the 5-Year Pass after purchase?`,
                answer: `Immediately upon checkout, you will receive your unique license activation key on your order confirmation page and via email, along with the official redemption link to activate your ${deal.title || 'software'} account.`
              },
              {
                question: `Are future feature updates included in this 5-Year Pass?`,
                answer: `Yes! All core product feature updates, enhancements, and security bug fixes released over the next 5 years are 100% included in the pass with zero recurring monthly fees.`
              },
              {
                question: `Can I upgrade my license plan (e.g. from Starter to Pro or Agency) later?`,
                answer: `Yes, you can upgrade your license tier anytime during the campaign window by simply paying the price difference between the tiers.`
              },
              {
                question: `How does the 60-day money-back guarantee work?`,
                answer: `You have 60 full days to test the software with your agency workflows. If you are not satisfied, you can request a 100% full refund with zero questions asked.`
              }
            ]).map((faq, fIdx) => (
              <FaqAccordionItem key={fIdx} faq={faq} defaultOpen={fIdx === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. Interactive Tabs: Reviews & Community Q&A ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8 w-full">
        <div className="border-b border-slate-200 pb-4 flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-2xl font-black text-slate-950">Community & reviews</h2>
          
          <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
            {['Reviews', 'FAQs', 'Questions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 border-b-2 transition-all cursor-pointer ${
                  activeTab === tab ? 'border-[#2475FF] text-[#2475FF] font-black' : 'border-transparent hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ── TAB CONTENT: REVIEWS ── */}
        {activeTab === 'Reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
            
            {/* Reviews List */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Write a Review CTA Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                <div>
                  <span className="text-[10px] font-black text-[#2475FF] bg-blue-100 px-2.5 py-0.5 rounded-full uppercase">
                    ⭐ Community Feedback
                  </span>
                  <h4 className="font-black text-slate-950 text-sm sm:text-base mt-1">
                    Have you tested {deal.vendorName || deal.title}?
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    Share your verified experience to help fellow agency founders make informed decisions.
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
                <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <IceCreamStars count={r.rating} />
                      <span className="text-xs font-black text-slate-900">{r.name}</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        ✔ Verified Pass
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold">{r.date}</span>
                  </div>

                  {/* Review Headline if available */}
                  {r.headline && (
                    <h5 className="text-sm font-black text-slate-950">
                      "{r.headline}"
                    </h5>
                  )}

                  {/* Pros & Cons Section */}
                  {r.pros || r.cons ? (
                    <div className="space-y-2 pt-1">
                      {r.pros && (
                        <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 text-xs leading-relaxed text-slate-800">
                          <span className="font-black text-emerald-800 block mb-0.5 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
                            What I Like (Pros):
                          </span>
                          <p className="font-medium text-slate-700">{r.pros}</p>
                        </div>
                      )}
                      {r.cons && (
                        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs leading-relaxed text-slate-800">
                          <span className="font-black text-slate-800 block mb-0.5 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                            Suggestions / Challenges (Cons):
                          </span>
                          <p className="font-medium text-slate-600">{r.cons}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">{r.text}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Right Summary Box - Real Time Dynamic Average Review Analytics */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
              {(() => {
                const reviewsList = deal.reviews || [];
                const totalReviews = reviewsList.length;
                const avgRating = totalReviews > 0
                  ? (reviewsList.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / totalReviews).toFixed(1)
                  : (deal.rating ? Number(deal.rating).toFixed(1) : '5.0');

                const count5 = reviewsList.filter((r) => Number(r.rating) === 5).length;
                const count4 = reviewsList.filter((r) => Number(r.rating) === 4).length;
                const count3 = reviewsList.filter((r) => Number(r.rating) === 3).length;
                const count2 = reviewsList.filter((r) => Number(r.rating) === 2).length;
                const count1 = reviewsList.filter((r) => Number(r.rating) === 1).length;

                const pct5 = totalReviews > 0 ? Math.round((count5 / totalReviews) * 100) : 0;
                const pct4 = totalReviews > 0 ? Math.round((count4 / totalReviews) * 100) : 0;
                const pct3 = totalReviews > 0 ? Math.round((count3 / totalReviews) * 100) : 0;
                const pct2 = totalReviews > 0 ? Math.round((count2 / totalReviews) * 100) : 0;
                const pct1 = totalReviews > 0 ? Math.round((count1 / totalReviews) * 100) : 0;

                return (
                  <>
                    <div className="text-center space-y-1">
                      <div className="text-3xl font-black text-slate-950">{avgRating}</div>
                      <IceCreamStars count={Math.round(Number(avgRating))} />
                      <div className="text-xs font-bold text-slate-500">
                        {totalReviews > 0 ? `Based on ${totalReviews} verified ${totalReviews === 1 ? 'review' : 'reviews'}` : 'No verified reviews yet · Be the first!'}
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-600">
                      {[
                        { stars: 5, label: '5 Ice Creams', pct: pct5, count: count5 },
                        { stars: 4, label: '4 Ice Creams', pct: pct4, count: count4 },
                        { stars: 3, label: '3 Ice Creams', pct: pct3, count: count3 },
                        { stars: 2, label: '2 Ice Creams', pct: pct2, count: count2 },
                        { stars: 1, label: '1 Ice Cream', pct: pct1, count: count1 },
                      ].map((row) => (
                        <div key={row.stars} className="flex items-center justify-between gap-3">
                          <span className="w-24 text-[11px] font-bold text-slate-700">{row.label}</span>
                          <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div className="bg-amber-400 h-full rounded-full transition-all duration-300" style={{ width: `${row.pct}%` }} />
                          </div>
                          <span className="font-mono font-bold text-slate-900 text-[11px] w-8 text-right">{row.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>

          </div>
        )}

        {/* ── TAB CONTENT: FAQS ── */}
        {activeTab === 'FAQs' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
            <div className="lg:col-span-8 space-y-3.5">
              {((deal.faqs && deal.faqs.length > 0) ? deal.faqs : [
                {
                  question: `How do customers redeem the 5-Year Pass after purchase?`,
                  answer: `Immediately upon checkout, you will receive your unique license activation key on your order confirmation page and via email, along with the official redemption link to activate your ${deal.title || 'software'} account.`
                },
                {
                  question: `Are future feature updates included in this 5-Year Pass?`,
                  answer: `Yes! All core product feature updates, enhancements, and security bug fixes released over the next 5 years are 100% included in the pass with zero recurring monthly fees.`
                },
                {
                  question: `Can I upgrade my license plan (e.g. from Starter to Pro or Agency) later?`,
                  answer: `Yes, you can upgrade your license tier anytime during the campaign window by simply paying the price difference between the tiers.`
                },
                {
                  question: `How does the 60-day money-back guarantee work?`,
                  answer: `You have 60 full days to test the software with your agency workflows. If you are not satisfied, you can request a 100% full refund with zero questions asked.`
                }
              ]).map((faq, fIdx) => (
                <FaqAccordionItem key={fIdx} faq={faq} defaultOpen={fIdx < 2} />
              ))}
            </div>

            {/* Right FAQ Help Box */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                <HelpCircle className="w-4 h-4 text-[#FF6B35]" />
                <span>Have Another Question?</span>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Need more technical details before grabbing your 5-Year Pass? You can reach the founder or our support team directly.
              </p>
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('Questions')}
                  className="w-full py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Ask the Founder</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB CONTENT: QUESTIONS (LIVE FOUNDER EMAIL DISPATCH) ── */}
        {activeTab === 'Questions' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
            <div className="lg:col-span-8 space-y-6">
              
              {/* Ask Question & Direct Email Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-[#2475FF] flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-950">
                        Ask a Question to {deal.founderName || 'the Founder'}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Dispatches a direct email to the founder's verified inbox ({deal.founderName || 'Founder'}).
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase">
                    ⚡ Live Email Connect
                  </span>
                </div>

                {questionSuccessMsg && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold rounded-2xl animate-fadeIn space-y-1">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{questionSuccessMsg}</span>
                    </div>
                    <p className="text-[11px] text-emerald-700 font-medium pl-6">
                      The founder will reply directly to <span className="font-bold">{questionEmail}</span>.
                    </p>
                  </div>
                )}

                {questionErrorMsg && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl animate-fadeIn flex items-center gap-2">
                    <X className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{questionErrorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleQuestionSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={questionName}
                        onChange={(e) => setQuestionName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3 rounded-xl focus:bg-white focus:outline-none focus:border-[#2475FF]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                        Your Email (For Founder Reply) *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="rahul@agency.in"
                        value={questionEmail}
                        onChange={(e) => setQuestionEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3 rounded-xl focus:bg-white focus:outline-none focus:border-[#2475FF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                      <span>WhatsApp / Phone Number (Optional)</span>
                      <span className="text-[10px] text-slate-400 font-normal">For instant WhatsApp replies</span>
                    </label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={questionPhone}
                      onChange={(e) => setQuestionPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3 rounded-xl focus:bg-white focus:outline-none focus:border-[#2475FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                      Your Question or Proposal *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder={`Ask ${deal.founderName || 'the founder'} about API limits, custom webhooks, roadmap, or specific agency workflows...`}
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium p-3.5 rounded-xl focus:bg-white focus:outline-none focus:border-[#2475FF]"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Founder typically replies in &lt; 4 hours</span>
                    </span>

                    <button
                      type="submit"
                      disabled={questionSubmitting}
                      className="px-6 py-3 bg-[#FF6B35] hover:bg-[#E85A24] disabled:opacity-50 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {questionSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>✉️ Submit Question & Send Email</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Community Questions & Answers List */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Community Q&A with Founder
                </h4>

                {deal.questions && deal.questions.length > 0 ? (
                  deal.questions.map((q, qIdx) => (
                    <div key={qIdx} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3.5 shadow-xs">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900">
                            {q.userName || 'Community Buyer'} asked:
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold">
                          {q.createdAt ? new Date(q.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Recently'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-800 font-bold bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                        "{q.question}"
                      </p>

                      {q.founderReply ? (
                        <div className="bg-orange-50/60 border-l-2 border-[#FF6B35] p-3.5 rounded-r-xl space-y-1">
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-[#FF6B35]" />
                            <span className="text-[10px] font-black text-[#FF6B35] uppercase tracking-wider">
                              {deal.founderName || 'Founder'} (Verified Creator Response)
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 font-medium leading-relaxed">
                            {q.founderReply}
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-[11px] text-amber-700 font-bold bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Email dispatched to {deal.founderName || 'Founder'} · Response pending</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">Q: Can I use this for multiple client accounts in my agency?</span>
                      <span className="text-[10px] text-slate-400 font-bold">2 days ago</span>
                    </div>
                    <div className="bg-slate-50 border-l-2 border-[#FF6B35] p-3.5 rounded-r-xl space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black text-[#FF6B35] uppercase tracking-wider">
                          {deal.founderName || 'Founder'} (Verified Creator)
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">
                        Yes! The Pro and Agency passes both include commercial client management and multi-workspace support.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Founder Support Card */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-xs">
              <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-xs">
                  <img
                    src={deal.founderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={deal.founderName || 'Founder'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-black text-slate-950">{deal.founderName || 'Founder & CEO'}</div>
                  <div className="text-xs text-slate-500 font-bold">{deal.founderTitle || 'Product Creator'}</div>
                  <span className="inline-block text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-1 border border-emerald-200">
                    🟢 Verified SaaS Founder
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-xs font-medium text-slate-600">
                <p className="leading-relaxed">
                  Have doubts before purchasing? Send your question via the form. It sends an instant email notification to the founder's inbox.
                </p>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="text-[11px] font-bold text-slate-800 flex items-center justify-between">
                    <span>Average Response:</span>
                    <span className="text-emerald-700 font-black">&lt; 4 Hours</span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-800 flex items-center justify-between">
                    <span>Direct Reply:</span>
                    <span className="text-blue-700 font-black">To Your Email</span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-800 flex items-center justify-between">
                    <span>Refund Policy:</span>
                    <span className="text-[#FF6B35] font-black">60-Day Guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
                ⭐ Community Review
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
              {/* Ice Cream Rating Select */}
              <div>
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block mb-1">
                  Your Rating (1 to 5 Ice Creams 🍦)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className={`text-2xl p-1 transition-transform hover:scale-125 cursor-pointer ${
                        star <= reviewRating ? 'opacity-100 scale-110' : 'opacity-25 grayscale'
                      }`}
                    >
                      🍦
                    </button>
                  ))}
                  <span className="text-xs font-black text-slate-700 ml-2">
                    {reviewRating} {reviewRating === 1 ? 'Ice Cream' : 'Ice Creams'}
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
                  <span>Submit Verified Review</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
