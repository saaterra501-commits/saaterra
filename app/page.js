'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroDealSlider from '../components/HeroDealSlider';
import AppSumoDealCard from '../components/AppSumoDealCard';
import CompareTray from '../components/CompareTray';
import DealMirrorSliderSection from '../components/DealMirrorSliderSection';
import EndingSoonSliderSection from '../components/EndingSoonSliderSection';
import LTDCheckoutModal from '../components/LTDCheckoutModal';
import SalesTicker from '../components/SalesTicker';
import HomeFAQ from '../components/HomeFAQ';
import DynamicPromoBanner from '../components/DynamicPromoBanner';
import UpcomingDealsSection from '../components/UpcomingDealsSection';
import UpcomingDropBar from '../components/UpcomingDropBar';
import UpcomingTeaserBanner from '../components/UpcomingTeaserBanner';
import FloatingSubscribeIndicator from '../components/FloatingSubscribeIndicator';
import Link from 'next/link';
import {
  Sparkles, Flame, ShieldCheck, Clock, Check, ArrowRight, Zap, Users,
  Calculator, Gift, Crown, Star, Key, RefreshCw
} from 'lucide-react';

const CATEGORIES = ['All', 'WhatsApp Bots', 'AI & GEO SEO', 'Lead Scrapers', 'CRM & Sales'];

const INITIAL_DEALS = [
  {
    _id: "init-1",
    id: "chat-chacha",
    slug: "chat-chacha",
    title: "Chat Chacha — WhatsApp AI Marketing & Automation",
    tagline: "Recover abandoned carts, broadcast offers, and automate agency support with WhatsApp Cloud API.",
    category: "WhatsApp Bots",
    badge: "Bestseller 🔥",
    rating: 4.9,
    tacoCount: 5,
    reviewsCount: 42,
    tier1Price: 1999,
    originalPrice: 24000,
    discountPct: 92,
    atAGlance: {
      alternativeTo: "WATI, Interakt, ManyChat",
      bestFor: "E-Commerce Brands, D2C Founders, Agencies",
      integrations: "Shopify, WooCommerce, Razorpay, Webhooks"
    },
    tldr: [
      "Official Meta Cloud API verified setup.",
      "Automate cart recovery messages with 98% open rates.",
      "18% GST invoice included with 60-day refund guarantee."
    ],
    heroImage: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?q=80&w=1000&auto=format&fit=crop",
    screenshot: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?q=80&w=1000&auto=format&fit=crop"
  },
  {
    _id: "init-2",
    id: "seo-rocket",
    slug: "seo-rocket",
    title: "AI Keyword & Competitor Radar",
    tagline: "Track local Indian agency rankings, discover high-intent keywords, and automate client SEO audits.",
    category: "AI & GEO SEO",
    badge: "Hot Deal ⚡",
    rating: 4.8,
    tacoCount: 5,
    reviewsCount: 38,
    tier1Price: 2499,
    originalPrice: 32000,
    discountPct: 92,
    atAGlance: {
      alternativeTo: "Ahrefs, Semrush, Ubersuggest",
      bestFor: "SEO Agencies, Content Creators, Founders",
      integrations: "Google Search Console, WordPress, Webflow"
    },
    tldr: [
      "Track Google & AI engine rankings in real time.",
      "Generate client-ready white-label PDF audit reports in 1 click.",
      "One-time 5-Year Pass with zero monthly recurring bills."
    ],
    heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
    screenshot: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop"
  },
  {
    _id: "init-3",
    id: "emailextractor-pro-ai",
    slug: "emailextractor-pro-ai",
    title: "EmailExtractor Pro AI & Lead Finder",
    tagline: "Extract verified B2B emails and phone numbers from Google Maps and LinkedIn in 1 click.",
    category: "Lead Scrapers",
    badge: "Trending 🚀",
    rating: 4.9,
    tacoCount: 5,
    reviewsCount: 51,
    tier1Price: 2999,
    originalPrice: 36000,
    discountPct: 92,
    atAGlance: {
      alternativeTo: "Apollo.io, Hunter.io, Lusha",
      bestFor: "B2B Sales Teams, Agencies, Freelancers",
      integrations: "Google Sheets, CSV Export, Zapier"
    },
    tldr: [
      "99% email deliverability with built-in SMTP verifier.",
      "Scrape unlimited local business leads from Google Maps.",
      "5-Year Pass with full GST invoice and instant activation."
    ],
    heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
    screenshot: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop"
  },
  {
    _id: "init-4",
    id: "nuwatomic-geo-seo",
    slug: "nuwatomic-geo-seo",
    title: "Nuwatomic — AI Search (ChatGPT & Perplexity) GEO SEO",
    tagline: "Optimize your agency clients to get recommended on ChatGPT, Claude, and Perplexity AI engines.",
    category: "AI & GEO SEO",
    badge: "AI Native 🤖",
    rating: 4.9,
    tacoCount: 5,
    reviewsCount: 29,
    tier1Price: 3499,
    originalPrice: 42000,
    discountPct: 91,
    atAGlance: {
      alternativeTo: "BrightEdge, SurferSEO, MarketMuse",
      bestFor: "Digital Marketers, High-Growth Agencies",
      integrations: "OpenAI, Perplexity API, Webhooks"
    },
    tldr: [
      "Generative Engine Optimization (GEO) auditing suite.",
      "Monitor brand sentiment across all major LLMs.",
      "5-Year Pass including all future model updates."
    ],
    heroImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop",
    screenshot: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop"
  }
];

export default function Home() {
  const [deals, setDeals] = useState(INITIAL_DEALS);
  const [loading, setLoading] = useState(false);
  const [activeCat, setActiveCat] = useState('All');
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  // Dynamic Live Deals Fetching from MongoDB & Admin API
  useEffect(() => {
    async function loadDeals() {
      try {
        const res = await fetch('/api/deals');
        if (!res.ok) return;
        const data = await res.json();
        if (data?.success && data?.deals && data.deals.length > 0) {
          setDeals(data.deals);
        }
      } catch (err) {
        console.warn('Live deals fetch notice:', err?.message || err);
      } finally {
        setLoading(false);
      }
    }
    loadDeals();
  }, []);

  const handleBuy = (deal) => {
    window.location.href = `/cart?deal=${deal.slug || deal.id || 'chat-chacha'}`;
  };

  const isDealEndingSoon = (deal) => {
    const launchTime = deal.launchDate ? new Date(deal.launchDate).getTime() : (deal.createdAt ? new Date(deal.createdAt).getTime() : Date.now());
    const durationDays = Number(deal.campaignDurationDays || 14);
    const targetEnd = deal.campaignEndDate ? new Date(deal.campaignEndDate).getTime() : (launchTime + durationDays * 24 * 60 * 60 * 1000);
    const diffDays = Math.ceil((targetEnd - Date.now()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const endingSoonCount = deals.filter(isDealEndingSoon).length;

  const dynamicCategories = ['All', ...new Set(deals.map((d) => d.category).filter(Boolean))];

  const filteredDeals = deals.filter(
    (d) => activeCat === 'All' || d.category === activeCat
  );

  const homepageItemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Featured 5-Year SaaS Passes India",
    "description": "Curated collection of top Indian B2B SaaS lifetime software deals for digital agencies and solopreneurs.",
    "itemListElement": deals.slice(0, 10).map((deal, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": deal.title,
      "url": `https://stackdeal.in/deals/${deal.slug}`,
      "image": deal.screenshot || deal.heroImage || "https://stackdeal.in/stackdeal-logo.png"
    }))
  };

  const homepageFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is StackDeal and how do 5-Year SaaS Passes work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "StackDeal is India's premier B2B software discovery platform. Instead of paying monthly dollar subscriptions, buyers pay once in INR via UPI/cards to get 5 full years of software access, license keys, and regular updates."
        }
      },
      {
        "@type": "Question",
        "name": "Can Indian agencies claim 18% GST input tax credit (ITC)?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Every purchase on StackDeal automatically generates an official GST B2B tax invoice with your agency name and GSTIN for straightforward tax write-offs and CA filing."
        }
      },
      {
        "@type": "Question",
        "name": "What payment methods are supported on StackDeal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "StackDeal supports instant Indian payment options including PhonePe, Google Pay, Paytm, BHIM UPI, Net Banking, and Credit/Debit Cards via Razorpay."
        }
      },
      {
        "@type": "Question",
        "name": "What is the StackDeal refund guarantee?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "StackDeal provides an unconditional 60-day 100% money-back guarantee on all software purchases if a tool does not suit your business workflow."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex flex-col font-sans">
      
      {/* ── JSON-LD Structured Data for Google, Bing & AI Engines ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageItemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageFaqSchema) }}
      />

      {/* ── 1. Navbar ── */}
      <Navbar />

      {/* ── 2. Upcoming Deal Drop Alert Bar (right below navbar) ── */}
      <UpcomingDropBar />

      {/* ── 3. Hero Carousel Slider with Live MongoDB Deals ── */}
      <HeroDealSlider deals={deals} onBuyClick={handleBuy} />

      {/* ── 4. Main Content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full space-y-14">
        
        {/* ── 4A. High-Impact VIP Launch Radar Teaser (Drives visitors to explore 25+ drops and subscribe) ── */}
        <UpcomingTeaserBanner />

        {/* ── 4B. DealMirror Card Carousel Slider ── */}
        {!loading && deals.length > 0 && (
          <DealMirrorSliderSection deals={deals} onBuyClick={handleBuy} />
        )}

        {/* ── 4B. SaaTerra Select Spotlight Grid: Category Filter + Deal Cards ── */}
        <div>
          {/* Section Header + Category Tab Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-6">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-[#FF6B35] text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider mb-1">
                StackDeal Spotlight
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
                Featured 5-Year SaaS Passes
              </h2>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
              {dynamicCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border cursor-pointer ${
                    activeCat === cat
                      ? 'bg-slate-950 text-white border-slate-950 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Live Deals Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-[#2475FF] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-500">Loading live SaaS deals from database...</p>
            </div>
          ) : filteredDeals.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-2xl">
                ⏳
              </div>
              <h3 className="text-lg font-black text-slate-900">No deals ending in the next 7 days</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">All current software campaigns are in active launch windows. Check back as launch deadlines approach!</p>
              <button
                onClick={() => setActiveCat('All')}
                className="px-5 py-2.5 bg-slate-950 text-white text-xs font-black rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
              >
                Browse All Deals
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDeals.map((deal) => (
                <AppSumoDealCard key={deal.id || deal.slug} deal={deal} onBuyClick={handleBuy} />
              ))}
            </div>
          )}
        </div>

        {/* ── 4C. Dynamic Admin-Controlled Promotional Banner ── */}
        <DynamicPromoBanner />

        {/* ── 4D. Dedicated Ending Soon Software Passes Carousel ── */}
        {!loading && deals.length > 0 && (
          <EndingSoonSliderSection deals={deals} onBuyClick={handleBuy} />
        )}

        {/* ── 4E. VIP Buyer Network — Upcoming Deal Alert Signup ── */}
        <UpcomingDealsSection />

        {/* ── 4F. Verified FAQ Accordion with Schema.org SEO ── */}
        <HomeFAQ />

      </main>

      <CompareTray />
      <FloatingSubscribeIndicator />
      <Footer />

      {showCheckout && selectedDeal && (
        <LTDCheckoutModal
          deal={selectedDeal}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
}
