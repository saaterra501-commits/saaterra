'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import AppSumoDealCard from '../../components/AppSumoDealCard';
import CompareTray from '../../components/CompareTray';
import LTDCheckoutModal from '../../components/LTDCheckoutModal';
import Link from 'next/link';
import { Search, Flame, Sparkles, Filter } from 'lucide-react';

const CATEGORIES = ['All', 'WhatsApp Bots', 'AI & GEO SEO', 'Lead Scrapers'];

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

export default function DealsPage() {
  const [deals, setDeals] = useState(INITIAL_DEALS);
  const [loading, setLoading] = useState(false);
  const [activeCat, setActiveCat] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    async function fetchDeals() {
      try {
        const res = await fetch('/api/deals');
        const data = await res.json();
        if (data?.success && data?.deals && data.deals.length > 0) {
          setDeals(data.deals);
        }
      } catch (err) {
        console.error('Error fetching deals catalog:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDeals();

    // Read initial search query & category from URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlQ = params.get('q');
      const urlCat = params.get('cat');
      if (urlQ) setSearchQuery(urlQ);
      if (urlCat) {
        const lower = urlCat.toLowerCase();
        if (lower.includes('whatsapp')) setActiveCat('WhatsApp Bots');
        else if (lower.includes('seo') || lower.includes('ai')) setActiveCat('AI & GEO SEO');
        else if (lower.includes('lead') || lower.includes('scrap')) setActiveCat('Lead Scrapers');
      }
    }
  }, []);

  const handleBuy = (deal) => {
    setSelectedDeal(deal);
    setShowCheckout(true);
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

  const filteredDeals = deals.filter((d) => {
    const matchesCat = activeCat === 'All' || d.category === activeCat;
    if (!matchesCat) return false;

    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase().trim();
    return (
      (d.title || '').toLowerCase().includes(q) ||
      (d.tagline || '').toLowerCase().includes(q) ||
      (d.category || '').toLowerCase().includes(q) ||
      (d.vendorName || '').toLowerCase().includes(q) ||
      (d.slug || '').toLowerCase().includes(q) ||
      (d.atAGlance?.alternativeTo || '').toLowerCase().includes(q) ||
      (d.atAGlance?.bestFor || '').toLowerCase().includes(q) ||
      (d.atAGlance?.integrations || '').toLowerCase().includes(q) ||
      (Array.isArray(d.tldr) && d.tldr.some((t) => (t || '').toLowerCase().includes(q)))
    );
  });

  const catalogSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Browse All 5-Year SaaS Passes — StackDeal India",
    "description": "Discover top WhatsApp marketing bots, AI & GEO SEO engines, lead scrapers, and CRM automation passes for Indian digital agencies.",
    "url": "https://stackdeal.in/deals",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": filteredDeals.slice(0, 20).map((deal, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": deal.title,
        "url": `https://stackdeal.in/deals/${deal.slug}`,
        "image": deal.screenshot || deal.heroImage || "https://stackdeal.in/stackdeal-logo.png"
      }))
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex flex-col font-sans">
      
      {/* ── JSON-LD Structured Data for Catalog Page ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogSchema) }}
      />

      <Navbar />

      {/* StackDeal Ticker Ribbon (#FF6B35) */}
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

      {/* Mint Hero Banner */}
      <section className="bg-[#E6F9EE] text-slate-900 py-12 px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <span className="inline-flex items-center gap-1.5 bg-[#FF6B35] text-white text-[11px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
            🔥 Browse All 5-Year SaaS Passes
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950">
            Explore Curated Software Deals
          </h1>
          <p className="text-slate-700 text-sm sm:text-base font-medium max-w-xl mx-auto">
            Pay once, enjoy 5 full years of software access for your Indian digital agency or business.
          </p>

          {/* Search Box */}
          <div className="max-w-md mx-auto pt-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by keyword, tool, or competitor (e.g. WhatsApp, SEO, Apollo, WATI)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-full shadow-md focus:outline-none focus:border-[#FF6B35] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-black bg-slate-100 hover:bg-slate-200 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer transition-colors"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Deals Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        
        {/* Active Search Result Indicator */}
        {searchQuery.trim() && (
          <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-5 py-3.5 shadow-xs mb-8">
            <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
              <span className="text-base">🔍</span>
              <span>
                Found <span className="text-[#FF6B35] font-black text-sm">{filteredDeals.length}</span> {filteredDeals.length === 1 ? 'deal' : 'deals'} matching &ldquo;<span className="text-slate-950 font-black">{searchQuery}</span>&rdquo;
              </span>
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-black text-[#FF6B35] hover:underline cursor-pointer"
            >
              Reset Search ✕
            </button>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide mb-8 py-1">
          {dynamicCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border cursor-pointer ${
                activeCat === cat
                  ? 'bg-slate-950 text-white border-slate-950 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-[#2475FF] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-500">Loading catalog deals...</p>
          </div>
        ) : filteredDeals.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-2xl">
              ⏳
            </div>
            <h3 className="text-lg font-black text-slate-900">No deals match this filter</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">Try changing your search query or switching to All Deals.</p>
            <button
              onClick={() => { setActiveCat('All'); setSearchQuery(''); }}
              className="px-5 py-2.5 bg-slate-950 text-white text-xs font-black rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal) => (
              <AppSumoDealCard key={deal.id || deal.slug} deal={deal} onBuyClick={handleBuy} />
            ))}
          </div>
        )}
      </section>

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
