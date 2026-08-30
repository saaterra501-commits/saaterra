'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CompareTray from '../../components/CompareTray';
import Link from 'next/link';
import {
  Scale, Plus, X, Check, ArrowRight, ShieldCheck, Sparkles, Star,
  Share2, HelpCircle, CheckCircle2, XCircle, Clock, Zap, ArrowLeft
} from 'lucide-react';

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [allDeals, setAllDeals] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [highlightDiff, setHighlightDiff] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch all available deals from API
  useEffect(() => {
    async function loadDeals() {
      try {
        const res = await fetch('/api/deals');
        const data = await res.json();
        if (data?.success && data?.deals) {
          setAllDeals(data.deals);
        }
      } catch (err) {
        console.error('Error fetching deals for comparison:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDeals();
  }, []);

  // Sync selected tools from searchParams or localStorage
  useEffect(() => {
    if (allDeals.length === 0) return;

    const toolsParam = searchParams.get('tools');
    let toolSlugs = [];

    if (toolsParam) {
      toolSlugs = toolsParam.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
    } else {
      try {
        const local = JSON.parse(localStorage.getItem('stackdeal_compare_items') || '[]');
        toolSlugs = local.map((item) => item.slug?.toLowerCase()).filter(Boolean);
      } catch (e) {}
    }

    // Default to first 2 deals if nothing selected
    if (toolSlugs.length === 0) {
      toolSlugs = allDeals.slice(0, 2).map((d) => d.slug);
    }

    const matched = toolSlugs
      .map((slug) => allDeals.find((d) => d.slug === slug || String(d.id) === slug))
      .filter(Boolean);

    setSelectedTools(matched.slice(0, 4));
  }, [allDeals, searchParams]);

  // Update URL and localStorage when tools change
  const updateSelected = (tools) => {
    setSelectedTools(tools);
    const slugs = tools.map((t) => t.slug).join(',');
    router.replace(`/compare?tools=${slugs}`);
    try {
      localStorage.setItem('stackdeal_compare_items', JSON.stringify(tools));
      window.dispatchEvent(new Event('stackdeal_compare_updated'));
    } catch (e) {}
  };

  const handleAddTool = (slug) => {
    if (selectedTools.length >= 4) return;
    const dealToAdd = allDeals.find((d) => d.slug === slug);
    if (dealToAdd && !selectedTools.some((t) => t.slug === slug)) {
      updateSelected([...selectedTools, dealToAdd]);
    }
  };

  const handleRemoveTool = (slug) => {
    if (selectedTools.length <= 1) return;
    updateSelected(selectedTools.filter((t) => t.slug !== slug));
  };

  const handleCopyShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Available options to add
  const availableToAdd = allDeals.filter(
    (d) => !selectedTools.some((st) => st.slug === d.slug)
  );

  const comparePageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Side-by-Side B2B SaaS Software Comparison — StackDeal India",
    "description": "Compare features, 5-Year pricing, alternative tools, money-back guarantees, and integrations across top Indian SaaS products.",
    "url": "https://stackdeal.in/compare",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://stackdeal.in" },
        { "@type": "ListItem", "position": 2, "name": "Deals", "item": "https://stackdeal.in/deals" },
        { "@type": "ListItem", "position": 3, "name": "Compare Software", "item": "https://stackdeal.in/compare" }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex flex-col font-sans">
      
      {/* ── JSON-LD Structured Data for Comparison Page ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(comparePageSchema) }}
      />

      <Navbar />

      {/* StackDeal Ticker Ribbon */}
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
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Header in #FFD519 Gold Theme */}
      <div className="bg-[#FFD519] border-b-2 border-amber-300/80 py-10 px-4 sm:px-8 text-slate-950 relative overflow-hidden shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-slate-900/80 mb-2">
              <Link href="/deals" className="hover:underline flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Deals
              </Link>
              <span>/</span>
              <span className="bg-slate-950 text-[#FFD519] px-2 py-0.5 rounded-md text-[10px] uppercase font-black">Software Matrix</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              Compare SaaS 5-Year Passes Side-by-Side ⚖️
            </h1>
            <p className="text-slate-900/90 text-sm sm:text-base font-bold mt-1 max-w-2xl leading-relaxed">
              Evaluate pricing, features, integrations, and 5-Year lifetime savings before locking in your agency license pass.
            </p>
          </div>

          {/* Controls: Highlight Diff & Share */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={handleCopyShareLink}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-950 text-xs font-black rounded-xl shadow-sm border border-slate-900/20 transition-all flex items-center gap-1.5 cursor-pointer"
              suppressHydrationWarning
            >
              <Share2 className="w-4 h-4 text-slate-900" />
              <span>{copied ? 'Link Copied! ✔' : 'Share Comparison'}</span>
            </button>

            {/* Dropdown to add more tools */}
            {selectedTools.length < 4 && availableToAdd.length > 0 && (
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddTool(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-[#FFD519] text-xs font-black rounded-xl shadow-md transition-all cursor-pointer focus:outline-none border-2 border-slate-950"
                defaultValue=""
                suppressHydrationWarning
              >
                <option value="" disabled>+ Add Tool to Compare</option>
                {availableToAdd.map((d) => (
                  <option key={d.slug} value={d.slug} className="text-slate-900 bg-white">
                    {d.title} (₹{Number(d.price).toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Main Comparison Table */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 flex-1 w-full">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-slate-950 border-t-[#FFD519] rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-slate-500">Loading comparison details...</p>
          </div>
        ) : selectedTools.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto space-y-4">
            <Scale className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-xl font-black text-slate-900">No software selected for comparison</h3>
            <p className="text-xs text-slate-500 font-medium">
              Select 2 to 4 SaaS tools from our marketplace to compare side-by-side.
            </p>
            <Link
              href="/deals"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFD519] text-slate-950 font-black text-xs rounded-xl shadow-md hover:bg-[#E6C016] border border-[#E6C016]"
            >
              Browse Deals
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
            
            {/* Table Matrix Header Row */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                
                {/* ── 1. PRODUCT HEADER CARDS ── */}
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50">
                    <th className="p-5 w-48 text-xs font-black text-slate-400 uppercase tracking-wider align-top">
                      Software Overview
                    </th>
                    {selectedTools.map((tool) => (
                      <th key={tool.slug} className="p-5 align-top min-w-[220px]">
                        <div className="space-y-3 relative">
                          
                          {/* Close Button */}
                          {selectedTools.length > 1 && (
                            <button
                              onClick={() => handleRemoveTool(tool.slug)}
                              className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-slate-100 hover:bg-red-100 hover:text-red-600 text-slate-500 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                              title="Remove from comparison"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}

                          {/* Logo & Category */}
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 p-2 shadow-xs shrink-0 flex items-center justify-center overflow-hidden">
                              <img
                                src={tool.vendorLogo || 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png'}
                                alt={tool.vendorName}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] font-black text-slate-950 bg-[#FFD519] border border-amber-300/80 px-2 py-0.5 rounded-full uppercase tracking-wider block w-fit shadow-2xs">
                                {tool.category || 'SaaS Tool'}
                              </span>
                              <h3 className="text-base font-black text-slate-950 leading-tight mt-1">
                                {tool.vendorName}
                              </h3>
                            </div>
                          </div>

                          {/* Title */}
                          <p className="text-xs font-semibold text-slate-700 line-clamp-2">
                            {tool.title}
                          </p>

                          {/* Price Tag with #FFD519 Highlight */}
                          <div className="bg-gradient-to-br from-[#FFFDF0] to-[#FFF9D6] border-2 border-[#FFD519] rounded-2xl p-3.5 space-y-1 shadow-2xs">
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-black text-slate-950 font-mono">
                                ₹{Number(tool.price).toLocaleString('en-IN')}
                              </span>
                              <span className="text-[11px] font-black text-slate-700">/5-Yr Pass</span>
                            </div>
                            <div className="text-[11px] text-slate-400 font-semibold line-through">
                              ₹{Number(tool.originalPrice || tool.price * 10).toLocaleString('en-IN')}
                            </div>
                          </div>

                          {/* Buy CTA Button in #FFD519 */}
                          <Link
                            href={`/cart?deal=${tool.slug}&tier=Starter Pass&price=${tool.price}`}
                            className="w-full py-3 bg-[#FFD519] hover:bg-[#E6C016] text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-[#E6C016]"
                          >
                            <span>Get 5-Year Pass</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>

                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* ── 2. KEY ATTRIBUTES ROWS ── */}
                <tbody className="divide-y divide-slate-100 text-xs">
                  
                  {/* Category */}
                  <tr>
                    <td className="p-4 font-bold text-slate-500 bg-slate-50/40">Category</td>
                    {selectedTools.map((tool) => (
                      <td key={tool.slug} className="p-4 font-bold text-slate-900">
                        {tool.category}
                      </td>
                    ))}
                  </tr>

                  {/* 14-Day Flash Campaign */}
                  <tr>
                    <td className="p-4 font-bold text-slate-500 bg-slate-50/40">Flash Duration</td>
                    {selectedTools.map((tool) => (
                      <td key={tool.slug} className="p-4">
                        <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 font-black px-2.5 py-1 rounded-full text-[11px] border border-red-200">
                          <Clock className="w-3.5 h-3.5" />
                          {tool.campaignDurationDays || 14} Days Real Flash Launch
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Alternative To */}
                  <tr>
                    <td className="p-4 font-bold text-slate-500 bg-slate-50/40">Alternative To</td>
                    {selectedTools.map((tool) => (
                      <td key={tool.slug} className="p-4 font-semibold text-slate-800">
                        {tool.atAGlance?.alternativeTo || 'Expensive foreign monthly SaaS'}
                      </td>
                    ))}
                  </tr>

                  {/* Integrations */}
                  <tr>
                    <td className="p-4 font-bold text-slate-500 bg-slate-50/40">Integrations</td>
                    {selectedTools.map((tool) => (
                      <td key={tool.slug} className="p-4 font-semibold text-slate-800">
                        {tool.atAGlance?.integrations || 'Razorpay, UPI, Zapier, Webhooks'}
                      </td>
                    ))}
                  </tr>

                  {/* Best For */}
                  <tr>
                    <td className="p-4 font-bold text-slate-500 bg-slate-50/40">Best For</td>
                    {selectedTools.map((tool) => (
                      <td key={tool.slug} className="p-4 font-semibold text-slate-800">
                        {tool.atAGlance?.bestFor || 'Agencies, Freelancers, Solopreneurs'}
                      </td>
                    ))}
                  </tr>

                  {/* Taco Rating */}
                  <tr>
                    <td className="p-4 font-bold text-slate-500 bg-slate-50/40">Rating</td>
                    {selectedTools.map((tool) => (
                      <td key={tool.slug} className="p-4 font-black text-amber-600">
                        🌮 {tool.tacoRating ?? 5.0} / 5.0 ({tool.reviewsCount || 1} reviews)
                      </td>
                    ))}
                  </tr>

                  {/* Money Back Guarantee */}
                  <tr>
                    <td className="p-4 font-bold text-slate-500 bg-slate-50/40">Refund Policy</td>
                    {selectedTools.map((tool) => (
                      <td key={tool.slug} className="p-4 font-bold text-emerald-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        60-Day 100% Money-Back Guarantee
                      </td>
                    ))}
                  </tr>

                  {/* License Model */}
                  <tr>
                    <td className="p-4 font-bold text-slate-500 bg-slate-50/40">License Validity</td>
                    {selectedTools.map((tool) => (
                      <td key={tool.slug} className="p-4 font-bold text-slate-900">
                        5-Year Full Platform Access & Updates
                      </td>
                    ))}
                  </tr>

                  {/* GST Invoice */}
                  <tr>
                    <td className="p-4 font-bold text-slate-500 bg-slate-50/40">Tax Invoice</td>
                    {selectedTools.map((tool) => (
                      <td key={tool.slug} className="p-4 font-bold text-slate-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#2475FF] shrink-0" />
                        Official B2B GST Invoice (18% ITC)
                      </td>
                    ))}
                  </tr>

                  {/* Quick Details View */}
                  <tr>
                    <td className="p-4 font-bold text-slate-500 bg-slate-50/40">Full Breakdown</td>
                    {selectedTools.map((tool) => (
                      <td key={tool.slug} className="p-4">
                        <Link
                          href={`/deals/${tool.slug}`}
                          className="text-xs font-black text-[#2475FF] hover:underline flex items-center gap-1"
                        >
                          View Full Features & Demo <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    ))}
                  </tr>

                </tbody>

              </table>
            </div>

          </div>
        )}
      </main>

      <CompareTray />
      <Footer />
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F6F7FB]">
        <div className="w-10 h-10 border-4 border-[#2475FF] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CompareContent />
    </Suspense>
  );
}
