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
import SavingsCalculator from '../components/SavingsCalculator';
import Link from 'next/link';
import {
  Sparkles, Flame, ShieldCheck, Clock, Check, ArrowRight, Zap, Users,
  Calculator, Gift, Crown, Star, Key, RefreshCw
} from 'lucide-react';

const CATEGORIES = ['All', 'WhatsApp Bots', 'AI & GEO SEO', 'Lead Scrapers', 'CRM & Sales'];

export default function Home() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState('All');
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  // Dynamic Live Deals Fetching from MongoDB & Admin API
  useEffect(() => {
    async function loadDeals() {
      try {
        const res = await fetch('/api/deals');
        const data = await res.json();
        if (data?.success && data?.deals) {
          setDeals(data.deals);
        }
      } catch (err) {
        console.error('Error loading live deals:', err);
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

      {/* ── 3. Hero Carousel Slider with Live MongoDB Deals ── */}
      <HeroDealSlider deals={deals} onBuyClick={handleBuy} />

      {/* ── 4. Main Content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full space-y-14">
        
        {/* ── 4A. DealMirror Card Carousel Slider ── */}
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

        {/* ── 4C. Dedicated Ending Soon Software Passes Carousel ── */}
        {!loading && deals.length > 0 && (
          <EndingSoonSliderSection deals={deals} onBuyClick={handleBuy} />
        )}

        {/* ── 4D. 5-Year Savings Math Calculator ── */}
        <SavingsCalculator />

      </main>

      <CompareTray />
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
