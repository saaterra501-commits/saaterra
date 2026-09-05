'use client';

import { useState, useEffect } from 'react';
import {
  Bell, Zap, ArrowRight, Check, Clock, Lock, Flame, Sparkles, Users,
  ChevronUp, Eye, X, ShieldCheck, TrendingUp, MessageSquare,
  Search, Video, Database, Share2, Send, CheckCircle2, ChevronRight
} from 'lucide-react';

const CATEGORIES = ['All', 'Lead Scrapers', 'WhatsApp Bots', 'AI & GEO SEO', 'Productivity'];

const UPCOMING_DROPS = [
  {
    id: 'lead-scrape-ai',
    name: 'LeadScrape AI — B2B Verified Contact Extractor',
    tagline: 'Extract validated B2B emails, founder phone numbers & LinkedIn profiles in 1 click.',
    category: 'Lead Scrapers',
    dropTimestamp: Date.now() + (4 * 24 + 18) * 3600 * 1000 + 42 * 60 * 1000, // ~4 days 18h
    badge: '🔥 Most Demanded',
    badgeColor: 'bg-orange-50 text-orange-600 border-orange-200',
    initialUpvotes: 412,
    claimedSlots: 412,
    totalSlots: 500,
    icon: Database,
    iconColor: 'text-[#FF6B35]',
    iconBg: 'bg-orange-50 border-orange-100',
    gradient: 'from-[#FF6B35] to-amber-500',
    replaces: 'Apollo.io ($99/mo) & Lusha',
    estSavings: '₹84,000 / year',
    expectedPassPrice: '₹2,499',
    originalMarketPrice: '₹32,000',
    highlights: [
      'Unlimited Google Maps & LinkedIn B2B business lead export',
      'Built-in real-time SMTP server email validator (99% deliverability)',
      '1-Click automated sync to Google Sheets, CSV & Zapier',
      'Full 18% GST Input Tax Credit invoice included'
    ],
    techStack: ['Google Maps API', 'SMTP Verifier', 'Google Sheets Sync', 'Meta API Ready'],
    whoItsFor: 'B2B Agencies, Lead Gen Freelancers, Outbound Sales Teams'
  },
  {
    id: 'whatsapp-agency-suite',
    name: 'WhatsAuto Suite — Multi-Agent WhatsApp Agency CRM',
    tagline: 'Manage 100+ client WhatsApp inboxes, recover carts, and broadcast official Meta Cloud API campaigns.',
    category: 'WhatsApp Bots',
    dropTimestamp: Date.now() + (8 * 24 + 6) * 3600 * 1000 + 15 * 60 * 1000, // ~8 days 6h
    badge: '⚡ VIP Priority',
    badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    initialUpvotes: 358,
    claimedSlots: 358,
    totalSlots: 500,
    icon: MessageSquare,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50 border-emerald-100',
    gradient: 'from-emerald-500 to-teal-600',
    replaces: 'WATI (₹3,500/mo) & Interakt',
    estSavings: '₹42,000 / year',
    expectedPassPrice: '₹1,999',
    originalMarketPrice: '₹28,000',
    highlights: [
      'Official Meta Cloud API verified green-badge setup guidance',
      'Multi-agent shared team inbox with client role permissions',
      'Automated WhatsApp cart abandonment sequence (98% open rates)',
      'Shopify, WooCommerce, Razorpay & Webhook triggers'
    ],
    techStack: ['Official Meta Cloud API', 'Webhooks', 'Shopify App', 'Team Roles'],
    whoItsFor: 'E-Commerce Brands, D2C Founders, Digital Marketing Agencies'
  },
  {
    id: 'nuwatomic-geo-radar',
    name: 'RankPerplex — AI Engine (ChatGPT & Perplexity) GEO Radar',
    tagline: 'Optimize agency clients to get recommended on ChatGPT, Claude, and Perplexity AI answer engines.',
    category: 'AI & GEO SEO',
    dropTimestamp: Date.now() + (12 * 24 + 14) * 3600 * 1000 + 50 * 60 * 1000, // ~12 days 14h
    badge: '🤖 AI Native',
    badgeColor: 'bg-blue-50 text-blue-600 border-blue-200',
    initialUpvotes: 284,
    claimedSlots: 284,
    totalSlots: 400,
    icon: Search,
    iconColor: 'text-[#2475FF]',
    iconBg: 'bg-blue-50 border-blue-100',
    gradient: 'from-[#2475FF] to-indigo-600',
    replaces: 'BrightEdge ($149/mo) & SurferSEO',
    estSavings: '₹1,20,000 / year',
    expectedPassPrice: '₹2,999',
    originalMarketPrice: '₹42,000',
    highlights: [
      'Monitor brand sentiment & citation frequency across Perplexity & OpenAI',
      'Generate white-label PDF audit reports ready to send clients',
      'Local Indian high-intent commercial keyword rankings tracker',
      '5-Year Pass includes all future AI model updates'
    ],
    techStack: ['OpenAI o3-mini', 'Perplexity Sonar', 'White-Label PDF', 'SERP API'],
    whoItsFor: 'SEO Agencies, Content Creators, SaaS Founders'
  },
  {
    id: 'shorts-viral-ai',
    name: 'ShortsViral AI — Viral Script & Retention Hook Engine',
    tagline: 'Turn any blog URL or rough brief into viral short-form video scripts engineered for high retention.',
    category: 'Productivity',
    dropTimestamp: Date.now() + (16 * 24 + 21) * 3600 * 1000 + 5 * 60 * 1000, // ~16 days 21h
    badge: '🚀 Creator Studio',
    badgeColor: 'bg-purple-50 text-purple-600 border-purple-200',
    initialUpvotes: 219,
    claimedSlots: 219,
    totalSlots: 350,
    icon: Video,
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50 border-purple-100',
    gradient: 'from-purple-500 to-pink-600',
    replaces: 'Syllaby ($49/mo) & Jasper Video',
    estSavings: '₹48,000 / year',
    expectedPassPrice: '₹2,199',
    originalMarketPrice: '₹24,000',
    highlights: [
      '500+ proven psychological opening hooks for YouTube Shorts & Reels',
      'Interactive teleprompter mode with automatic reading pace guide',
      'Export ready audio voiceover scripts & B-roll visual cues',
      'Indian regional angle hooks tailored for Hindi & English creators'
    ],
    techStack: ['Retention AI', 'Teleprompter Web App', 'B-Roll Generator', 'Multi-Language'],
    whoItsFor: 'YouTubers, Social Media Agencies, Solopreneurs'
  }
];

// Recent live founder alert simulation for high-trust social proof
const RECENT_RESERVATIONS = [
  { name: 'Rahul S.', city: 'Bangalore', tool: 'LeadScrape AI', time: '2m ago' },
  { name: 'Aditya V.', city: 'Mumbai', tool: 'WhatsAuto Suite', time: '7m ago' },
  { name: 'Pooja M.', city: 'Delhi NCR', tool: 'RankPerplex AI', time: '14m ago' },
  { name: 'Karthik N.', city: 'Hyderabad', tool: 'LeadScrape AI', time: '21m ago' },
];

export default function UpcomingDealsSection() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [upvotes, setUpvotes] = useState({});
  const [userUpvoted, setUserUpvoted] = useState({});
  const [activeModalDeal, setActiveModalDeal] = useState(null);
  const [quickAlertDealId, setQuickAlertDealId] = useState(null);
  const [quickInput, setQuickInput] = useState('');
  const [quickSubmitting, setQuickSubmitting] = useState(false);
  const [quickSuccess, setQuickSuccess] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  
  // Interactive Request Tool State
  const [showRequestBox, setShowRequestBox] = useState(false);
  const [requestedTool, setRequestedTool] = useState('');
  const [requestEmail, setRequestEmail] = useState('');
  const [requestSuccess, setRequestSuccess] = useState(false);

  // Live timer tick
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize upvotes from local storage
  useEffect(() => {
    try {
      const storedUpvotes = JSON.parse(localStorage.getItem('stackdeal_upcoming_upvotes') || '{}');
      const initialCounts = {};
      UPCOMING_DROPS.forEach(d => {
        initialCounts[d.id] = (storedUpvotes[d.id] ? d.initialUpvotes + 1 : d.initialUpvotes);
      });
      setUpvotes(initialCounts);
      setUserUpvoted(storedUpvotes);
    } catch {
      const initialCounts = {};
      UPCOMING_DROPS.forEach(d => { initialCounts[d.id] = d.initialUpvotes; });
      setUpvotes(initialCounts);
    }
  }, []);

  const handleUpvote = (deal, e) => {
    e?.stopPropagation();
    const dealId = deal.id;
    const isAlreadyUpvoted = !!userUpvoted[dealId];

    const newUpvotedState = { ...userUpvoted, [dealId]: !isAlreadyUpvoted };
    const newCount = (upvotes[dealId] || deal.initialUpvotes) + (isAlreadyUpvoted ? -1 : 1);

    setUserUpvoted(newUpvotedState);
    setUpvotes({ ...upvotes, [dealId]: newCount });

    try {
      localStorage.setItem('stackdeal_upcoming_upvotes', JSON.stringify(newUpvotedState));
    } catch {}

    if (!isAlreadyUpvoted) {
      triggerToast(`🔥 Upvoted ${deal.name.split('—')[0].trim()}! Want VIP drop alerts? Click 'Notify Me'.`);
    }
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4500);
  };

  const formatCountdown = (targetTime) => {
    const diff = Math.max(0, targetTime - currentTime);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    return {
      days: String(days).padStart(2, '0'),
      hours: String(hours).padStart(2, '0'),
      mins: String(mins).padStart(2, '0'),
      secs: String(secs).padStart(2, '0'),
      isUrgent: days < 5
    };
  };

  const handleQuickNotify = async (dealId, dealName) => {
    if (!quickInput || (!quickInput.includes('@') && quickInput.replace(/\D/g, '').length < 10)) {
      triggerToast('⚠️ Please enter a valid Email or 10-digit WhatsApp number.');
      return;
    }
    setQuickSubmitting(true);
    try {
      const isEmail = quickInput.includes('@');
      const payload = {
        email: isEmail ? quickInput.trim() : `whatsapp_${quickInput.replace(/\D/g, '')}@stackdeal.in`,
        whatsapp: !isEmail ? quickInput.replace(/\D/g, '') : '',
        preferredCategory: selectedCategory,
        source: `upcoming_card_${dealId}`,
        name: `VIP Buyer (${dealName.split('—')[0].trim()})`
      };

      const res = await fetch('/api/upcoming-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data?.success) {
        setQuickSuccess(dealId);
        triggerToast(`🎉 You're locked in for VIP early access to ${dealName.split('—')[0].trim()}!`);
        setTimeout(() => {
          setQuickAlertDealId(null);
          setQuickInput('');
        }, 3000);
      } else {
        triggerToast(data?.message || 'Error subscribing. Please try again.');
      }
    } catch {
      triggerToast('Network error. Please try again.');
    } finally {
      setQuickSubmitting(false);
    }
  };

  const handleRequestToolSubmit = async (e) => {
    e.preventDefault();
    if (!requestedTool.trim()) return;
    try {
      await fetch('/api/upcoming-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: requestEmail || 'tool_request_anonymous@stackdeal.in',
          name: `Tool Request: ${requestedTool.trim()}`,
          preferredCategory: 'Requested Tools',
          source: 'community_request'
        })
      });
      setRequestSuccess(true);
      setTimeout(() => {
        setShowRequestBox(false);
        setRequestSuccess(false);
        setRequestedTool('');
        setRequestEmail('');
      }, 4000);
    } catch {
      setRequestSuccess(true);
    }
  };

  const filteredDrops = UPCOMING_DROPS.filter(
    (drop) => selectedCategory === 'All' || drop.category === selectedCategory
  );

  return (
    <section
      id="upcoming-deals"
      className="w-full space-y-8 scroll-mt-24"
      aria-labelledby="upcoming-deals-heading"
    >
      {/* ── Toast Notification Bar ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950 text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage('')}
            className="text-slate-400 hover:text-white ml-2 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── 1. Section Header & Interactive Controls ── */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_2px_16px_rgba(10,15,30,0.05)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-[#2475FF] text-white text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                <Flame className="w-3 h-3 text-amber-300 fill-amber-300 animate-pulse" />
                Community Launchpad • Dropping Soon
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping mr-0.5" />
                18 Founders Voting Live
              </span>
            </div>

            <h2
              id="upcoming-deals-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight"
            >
              Upcoming 5-Year SaaS Passes
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm font-medium max-w-2xl leading-relaxed">
              Every tool is negotiated exclusively for Indian agencies & founders with zero monthly subscriptions.
              <span className="font-bold text-slate-900"> Upvote software you want</span> or lock in early-bird passes before public launch!
            </p>
          </div>

          {/* Social Proof & Request Pill */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Live reservation ticker pill */}
            <div className="hidden sm:flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-2.5">
              <div className="flex -space-x-2 overflow-hidden">
                <span className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-[#FF6B35] text-white text-[10px] font-black flex items-center justify-center">RS</span>
                <span className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-[#2475FF] text-white text-[10px] font-black flex items-center justify-center">AV</span>
                <span className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center">PM</span>
              </div>
              <div className="text-left">
                <div className="text-xs font-black text-slate-900">1,240+ Reserved</div>
                <div className="text-[10px] text-slate-500 font-bold">VIP Early-Bird Spots</div>
              </div>
            </div>

            {/* Request a tool trigger button */}
            <button
              onClick={() => setShowRequestBox(!showRequestBox)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-2xl border border-slate-200 hover:border-slate-300 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-[#2475FF]" />
              <span>Request a SaaS Tool</span>
            </button>
          </div>
        </div>

        {/* ── Interactive Category Tabs ── */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pt-6 mt-6 border-t border-slate-100">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
            Category:
          </span>
          {CATEGORIES.map((cat) => {
            const count = cat === 'All'
              ? UPCOMING_DROPS.length
              : UPCOMING_DROPS.filter(d => d.category === cat).length;
            const isActive = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all whitespace-nowrap flex items-center gap-1.5 border cursor-pointer ${
                  isActive
                    ? 'bg-slate-950 text-white border-slate-950 shadow-md scale-[1.02]'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Community Tool Request Box (Collapsible) ── */}
      {showRequestBox && (
        <div className="bg-gradient-to-br from-blue-50/70 via-white to-orange-50/70 border-2 border-[#2475FF]/20 rounded-3xl p-6 shadow-lg animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#2475FF] bg-blue-100/60 px-2.5 py-0.5 rounded-full">
                Founder Sourcing Request
              </span>
              <h3 className="text-lg font-black text-slate-950 mt-1">
                Which tool should StackDeal negotiate for a 5-Year Pass next?
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Tell us the software you currently pay high monthly dollar bills for. We approach founders directly!
              </p>
            </div>
            <button
              onClick={() => setShowRequestBox(false)}
              className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {requestSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Thank you! Your tool request has been sent to the StackDeal vendor sourcing desk.</span>
            </div>
          ) : (
            <form onSubmit={handleRequestToolSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Software Name (e.g., ManyChat, Jasper, ClickUp, Smartlead)"
                value={requestedTool}
                onChange={(e) => setRequestedTool(e.target.value)}
                required
                className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2475FF] shadow-sm"
              />
              <input
                type="email"
                placeholder="Your Email (to notify you if listed)"
                value={requestEmail}
                onChange={(e) => setRequestEmail(e.target.value)}
                className="sm:w-64 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2475FF] shadow-sm"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#2475FF] hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Request
              </button>
            </form>
          )}
        </div>
      )}

      {/* ── 2. Interactive Upcoming Deal Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDrops.map((deal) => {
          const countdown = formatCountdown(deal.dropTimestamp);
          const currentUpvoteCount = upvotes[deal.id] || deal.initialUpvotes;
          const isUpvoted = !!userUpvoted[deal.id];
          const isQuickActive = quickAlertDealId === deal.id;
          const IconComponent = deal.icon;
          const claimedPercent = Math.round((deal.claimedSlots / deal.totalSlots) * 100);

          return (
            <div
              key={deal.id}
              className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-[0_2px_12px_rgba(10,15,30,0.06)] hover:shadow-[0_16px_40px_rgba(10,15,30,0.11)] transition-all duration-300 flex flex-col group relative"
            >
              {/* Top Accent Gradient Line */}
              <div className={`h-[4px] w-full bg-gradient-to-r ${deal.gradient}`} />

              <div className="p-6 flex flex-col flex-1 space-y-4">
                {/* Header: Icon, Category, Upvote button */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${deal.iconBg} ${deal.iconColor} shadow-sm group-hover:scale-105 transition-transform`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${deal.badgeColor}`}>
                        {deal.badge}
                      </span>
                      <div className="text-[11px] font-bold text-slate-400 mt-1 flex items-center gap-1">
                        <span>Replaces:</span>
                        <span className="text-slate-700 font-black">{deal.replaces}</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Hunt Style Upvote Button */}
                  <button
                    onClick={(e) => handleUpvote(deal, e)}
                    className={`flex flex-col items-center justify-center min-w-[56px] py-1.5 px-2 rounded-2xl border transition-all cursor-pointer select-none active:scale-95 ${
                      isUpvoted
                        ? 'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-500/20'
                        : 'bg-slate-50 hover:bg-orange-50 border-slate-200 hover:border-orange-300 text-slate-700 hover:text-[#FF6B35]'
                    }`}
                    title={isUpvoted ? 'Upvoted! Click to undo' : 'Upvote this deal to accelerate launch'}
                  >
                    <ChevronUp className={`w-4 h-4 ${isUpvoted ? 'stroke-[3]' : 'stroke-[2.5]'}`} />
                    <span className="text-xs font-black leading-none mt-0.5">
                      {currentUpvoteCount}
                    </span>
                    <span className="text-[9px] uppercase font-bold tracking-tight opacity-80 mt-0.5">
                      {isUpvoted ? 'Voted' : 'Vote'}
                    </span>
                  </button>
                </div>

                {/* Deal Title & Tagline */}
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-950 tracking-tight leading-snug group-hover:text-[#2475FF] transition-colors">
                    {deal.name}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1.5">
                    {deal.tagline}
                  </p>
                </div>

                {/* Tech Highlights Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {deal.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-bold bg-slate-100/80 text-slate-600 border border-slate-200/80 px-2 py-0.5 rounded-lg"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* ── Live Ticking Countdown Box ── */}
                <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#FF6B35] shrink-0" />
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Launch In</div>
                      <div className="text-xs font-black text-slate-800">Target Drop Window</div>
                    </div>
                  </div>

                  {/* Digits Display */}
                  <div className="flex items-center gap-1.5 font-mono text-xs font-black">
                    <div className="bg-white border border-slate-200 px-2 py-1 rounded-lg text-slate-900 shadow-2xs">
                      {countdown.days}<span className="text-[9px] text-slate-400 font-sans ml-0.5">d</span>
                    </div>
                    <span className="text-slate-300 font-bold">:</span>
                    <div className="bg-white border border-slate-200 px-2 py-1 rounded-lg text-slate-900 shadow-2xs">
                      {countdown.hours}<span className="text-[9px] text-slate-400 font-sans ml-0.5">h</span>
                    </div>
                    <span className="text-slate-300 font-bold">:</span>
                    <div className="bg-white border border-slate-200 px-2 py-1 rounded-lg text-slate-900 shadow-2xs">
                      {countdown.mins}<span className="text-[9px] text-slate-400 font-sans ml-0.5">m</span>
                    </div>
                    <span className="text-slate-300 font-bold">:</span>
                    <div className="bg-white border border-[#FF6B35]/30 text-[#FF6B35] px-2 py-1 rounded-lg shadow-2xs">
                      {countdown.secs}<span className="text-[9px] text-slate-400 font-sans ml-0.5">s</span>
                    </div>
                  </div>
                </div>

                {/* Pricing Teaser & Savings Bar */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <div>
                    <div className="text-[10px] font-black uppercase text-slate-400">Early Bird Pass Price</div>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-lg font-black text-slate-950 font-mono">{deal.expectedPassPrice}</span>
                      <span className="text-xs text-slate-400 line-through font-mono">{deal.originalMarketPrice}</span>
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-md">
                        Save {deal.estSavings}
                      </span>
                    </div>
                  </div>

                  {/* Scarcity / Reservation Ratio */}
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-slate-400">Batch 1 Allocation</div>
                    <div className="text-xs font-black text-slate-800 mt-0.5">
                      {deal.claimedSlots} / {deal.totalSlots} <span className="text-[10px] text-orange-600">({claimedPercent}%)</span>
                    </div>
                  </div>
                </div>

                {/* Reservation Progress Bar */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${deal.gradient} rounded-full transition-all duration-500`}
                    style={{ width: `${claimedPercent}%` }}
                  />
                </div>

                {/* ── Interactive Action Buttons ── */}
                <div className="pt-2 flex items-center gap-2">
                  {/* Sneak Peek Specs Button */}
                  <button
                    onClick={() => setActiveModalDeal(deal)}
                    className="flex-1 py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-black rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>View Specs & ROI</span>
                  </button>

                  {/* Notify Me Trigger Button */}
                  <button
                    onClick={() => {
                      setQuickAlertDealId(isQuickActive ? null : deal.id);
                      setQuickSuccess(null);
                    }}
                    className={`flex-1 py-2.5 px-3 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isQuickActive
                        ? 'bg-slate-950 text-white'
                        : 'bg-[#FF6B35] hover:bg-[#E85A24] text-white shadow-md shadow-orange-500/20'
                    }`}
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>{isQuickActive ? 'Close Alert' : 'Notify Me (VIP)'}</span>
                  </button>
                </div>

                {/* ── Inline 1-Click RSVP Expansion ── */}
                {isQuickActive && (
                  <div className="mt-3 p-4 bg-orange-50/60 border border-orange-200/90 rounded-2xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-slate-900 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-[#FF6B35]" />
                        Get VIP First Access to {deal.name.split('—')[0].trim()}
                      </span>
                      <span className="text-[10px] font-bold text-orange-600 bg-white border border-orange-200 px-2 py-0.5 rounded-full">
                        Free Alert
                      </span>
                    </div>

                    {quickSuccess === deal.id ? (
                      <div className="bg-emerald-100 text-emerald-800 p-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>VIP Alert Confirmed! You'll get private early-bird link first.</span>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Email or 10-digit WhatsApp"
                          value={quickInput}
                          onChange={(e) => setQuickInput(e.target.value)}
                          className="flex-1 bg-white border border-orange-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF6B35]"
                        />
                        <button
                          onClick={() => handleQuickNotify(deal.id, deal.name)}
                          disabled={quickSubmitting}
                          className="px-4 py-2 bg-[#FF6B35] hover:bg-orange-600 text-white text-xs font-black rounded-xl transition-all cursor-pointer disabled:opacity-60 shrink-0 flex items-center gap-1"
                        >
                          {quickSubmitting ? (
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <span>Lock In</span>
                              <ArrowRight className="w-3 h-3" />
                            </>
                          )}
                        </button>
                      </div>
                    )}
                    <p className="text-[10px] text-slate-400 font-medium">
                      🔒 Zero spam. We only ping you once when this deal goes live with early-bird coupon.
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 3. Interactive VIP Buyer Network Banner with Live Founder Feed ── */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(10,15,30,0.06)] relative overflow-hidden">
        {/* Background Subtle Accent */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-blue-100/40 via-orange-100/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left info & social ticker */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">
                Live Founder Network
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              Join 3,200+ Indian Agency Founders on the VIP Access Radar
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              When StackDeal secures an exclusive 5-Year software license, VIP members get an alert{' '}
              <span className="font-bold text-slate-950">24 hours before the public launch</span>.
              Grab limited-code tiers before stock runs out!
            </p>

            {/* Live reservation mini ticker */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Recent Early-Bird RSVPs:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {RECENT_RESERVATIONS.map((r, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-white border border-slate-200 px-2.5 py-1 rounded-xl text-slate-700 shadow-2xs"
                  >
                    <span className="text-[#FF6B35] font-black">{r.name}</span>
                    <span className="text-slate-400 font-normal">({r.city})</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-900 font-semibold">{r.tool}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Trust Badges Row */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 pt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                60-Day Money-Back Guarantee
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4 text-[#2475FF]" />
                18% GST Input Credit Invoice
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-amber-500" />
                Zero Recurring Monthly Bills
              </span>
            </div>
          </div>

          {/* Right VIP Fast Signup Box */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                  ⚡ 100% Free VIP Access
                </span>
                <h4 className="text-base font-black text-white mt-0.5">Subscribe to All Upcoming Drops</h4>
              </div>
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                <Bell className="w-4 h-4 text-amber-400" />
              </div>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formEmail = e.target.vip_email.value;
                const formWhatsapp = e.target.vip_whatsapp.value;
                if (!formEmail || !formEmail.includes('@')) {
                  triggerToast('Please enter a valid email.');
                  return;
                }
                try {
                  const res = await fetch('/api/upcoming-alerts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      email: formEmail,
                      whatsapp: formWhatsapp,
                      preferredCategory: selectedCategory,
                      source: 'homepage_vip_banner'
                    })
                  });
                  const d = await res.json();
                  if (d?.success) {
                    triggerToast('🎉 Welcome to VIP Buyer Network! First drop alert is locked.');
                    e.target.reset();
                  } else {
                    triggerToast(d?.message || 'Subscription failed.');
                  }
                } catch {
                  triggerToast('Network error.');
                }
              }}
              className="space-y-3"
            >
              <input
                name="vip_email"
                type="email"
                required
                placeholder="Work Email Address *"
                className="w-full bg-white/10 border border-white/15 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 outline-none transition-all"
              />
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">+91</span>
                <input
                  name="vip_whatsapp"
                  type="tel"
                  maxLength={10}
                  placeholder="WhatsApp Number (optional — instant drop ping)"
                  className="w-full bg-white/10 border border-white/15 focus:border-emerald-400 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-slate-400 outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#FF6B35] to-amber-500 hover:from-[#E85A24] hover:to-amber-400 text-white font-black text-xs rounded-xl shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Join VIP Network — Get Early-Bird Links</span>
                <ArrowRight className="w-3.5 h-3.5 ml-auto" />
              </button>
            </form>

            <p className="text-[10px] text-slate-400 text-center font-medium">
              Join 3,200+ founders. Unsubscribe anytime in 1 click.
            </p>
          </div>
        </div>
      </div>

      {/* ── 4. Interactive Deal Sneak-Peek & Specs Modal ── */}
      {activeModalDeal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setActiveModalDeal(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${activeModalDeal.iconBg} ${activeModalDeal.iconColor}`}>
                  <activeModalDeal.icon className="w-6 h-6" />
                </div>
                <div>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${activeModalDeal.badgeColor}`}>
                    {activeModalDeal.badge}
                  </span>
                  <h3 className="text-lg font-black text-slate-950 leading-tight mt-1">
                    {activeModalDeal.name}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setActiveModalDeal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Replaces & ROI Comparison Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500">Replaces Monthly Bill of:</span>
                <span className="font-black text-red-600 line-through">{activeModalDeal.replaces}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500">Estimated 5-Year Savings:</span>
                <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {activeModalDeal.estSavings}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-200">
                <span className="font-black text-slate-900">Expected 5-Year Pass:</span>
                <span className="text-lg font-black text-[#FF6B35] font-mono">{activeModalDeal.expectedPassPrice}</span>
              </div>
            </div>

            {/* Key Features Included */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                What's Included in This 5-Year Pass
              </h4>
              <div className="space-y-2">
                {activeModalDeal.highlights.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Who It's Built For */}
            <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-3.5">
              <div className="text-[10px] font-black uppercase tracking-wider text-[#2475FF]">Ideal For</div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">{activeModalDeal.whoItsFor}</div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={(e) => {
                  handleUpvote(activeModalDeal, e);
                }}
                className={`flex-1 py-3 rounded-xl text-xs font-black border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  userUpvoted[activeModalDeal.id]
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                }`}
              >
                <ChevronUp className="w-4 h-4" />
                <span>{userUpvoted[activeModalDeal.id] ? 'Upvoted! (Saved)' : `Upvote (${upvotes[activeModalDeal.id] || activeModalDeal.initialUpvotes})`}</span>
              </button>

              <button
                onClick={() => {
                  setActiveModalDeal(null);
                  setQuickAlertDealId(activeModalDeal.id);
                  const el = document.getElementById('upcoming-deals');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex-1 py-3 bg-[#FF6B35] hover:bg-orange-600 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span>Reserve VIP Alert</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
