'use client';

import { useState, useEffect } from 'react';
import {
  Settings,
  Sparkles,
  Globe,
  HelpCircle,
  Save,
  CheckCircle2,
  RefreshCw,
  Eye,
  Plus,
  Trash2,
  Edit2,
  AlertCircle,
  Tag,
  ExternalLink,
  Layers,
  Sliders,
  Star,
  Check,
  X,
  Search,
  Image as ImageIcon,
  Flame,
  Grid,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('homepage'); // 'homepage' | 'categories' | 'topCategories' | 'heroSlider' | 'seo' | 'faqs'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Hero Slider Deals State
  const [dealsList, setDealsList] = useState([]);
  const [dealsLoading, setDealsLoading] = useState(false);
  const [dealSearch, setDealSearch] = useState('');
  const [sliderSaveMsg, setSliderSaveMsg] = useState('');

  const [config, setConfig] = useState({
    announcement: {
      enabled: false,
      text: '🔥 Launch Offer: Get instant 10% off with coupon code VIP10',
      link: '/deals',
      badge: 'NEW',
      bgColor: '#0F172A',
      textColor: '#FFFFFF',
    },
    greenStrip: {
      enabled: true,
      isSlim: true,
      items: [
        { text: '5-Year Access', icon: '✓' },
        { text: 'One-Time Payment', icon: '⚡' },
        { text: 'Business Deals', icon: '★' },
        { text: 'Save More', icon: '%' },
      ],
    },
    promoBanner: {
      enabled: false,
      badge: 'STACKDEAL PLUS',
      title: 'Save $350+/year on essential tools to grow your business',
      subtitle: 'Enjoy member-only perks that will help your business scale faster.',
      price: '$99',
      priceSubtitle: 'Annual membership',
      buttonText: 'Join StackDeal Plus',
      buttonLink: '/plus',
    },
    seo: {
      googleVerification: 'tjrhKK8lic4LxbLxJmyjnemqrwbHQh61k9zbqNeg5O0',
      gaId: '',
      metaPixelId: '',
      siteTitle: "StackDeal — India's #1 B2B SaaS 5-Year Deal Marketplace",
      siteDescription: "India's premier B2B software discovery marketplace. Get exclusive 5-Year Access Passes on WhatsApp automation, AI & GEO SEO, CRM, and Lead Scrapers.",
    },
    faqs: [],
    categories: [
      { id: 'cat-1', name: 'WhatsApp Bots', slug: 'whatsapp-bots', description: 'WhatsApp marketing & bots', themeColor: '#25D366', icon: 'MessageSquare', active: true, order: 1 },
      { id: 'cat-2', name: 'AI & GEO SEO', slug: 'ai-geo-seo', description: 'AI search & keyword tools', themeColor: '#8B5CF6', icon: 'Sparkles', active: true, order: 2 },
      { id: 'cat-3', name: 'Lead Scrapers', slug: 'lead-scrapers', description: 'B2B leads & data extractors', themeColor: '#0284C7', icon: 'Target', active: true, order: 3 },
      { id: 'cat-4', name: 'CRM & Sales', slug: 'crm-sales', description: 'Sales pipelines & CRM', themeColor: '#FF6B35', icon: 'BarChart3', active: true, order: 4 },
      { id: 'cat-5', name: 'Video & Design', slug: 'video-design', description: 'AI video & design creators', themeColor: '#EC4899', icon: 'Video', active: true, order: 5 },
      { id: 'cat-6', name: 'Email Marketing', slug: 'email-marketing', description: 'Cold email & newsletters', themeColor: '#6366F1', icon: 'Mail', active: true, order: 6 },
      { id: 'cat-7', name: 'Developer Tools', slug: 'developer-tools', description: 'APIs & developer utilities', themeColor: '#0F172A', icon: 'Code', active: true, order: 7 },
      { id: 'cat-8', name: 'Analytics', slug: 'analytics', description: 'Website traffic & reports', themeColor: '#0D9488', icon: 'TrendingUp', active: true, order: 8 },
    ],
    topCategories: [
      { id: 'top-1', name: 'Most Popular', categoryKey: 'All', isMostPopular: true, order: 1, active: true },
      { id: 'top-2', name: 'WhatsApp Bots', categoryKey: 'WhatsApp Bots', image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=300&h=300&q=80', isMostPopular: false, order: 2, active: true },
      { id: 'top-3', name: 'AI & GEO SEO', categoryKey: 'AI & GEO SEO', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&h=300&q=80', isMostPopular: false, order: 3, active: true },
      { id: 'top-4', name: 'Lead Scrapers', categoryKey: 'Lead Scrapers', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=300&h=300&q=80', isMostPopular: false, order: 4, active: true },
      { id: 'top-5', name: 'CRM & Sales', categoryKey: 'CRM & Sales', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=300&h=300&q=80', isMostPopular: false, order: 5, active: true },
      { id: 'top-6', name: 'Video & Design', categoryKey: 'Video & Design', image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=300&h=300&q=80', isMostPopular: false, order: 6, active: true },
      { id: 'top-7', name: 'Email Marketing', categoryKey: 'Email Marketing', image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&w=300&h=300&q=80', isMostPopular: false, order: 7, active: true },
      { id: 'top-8', name: 'Developer Tools', categoryKey: 'Developer Tools', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=300&h=300&q=80', isMostPopular: false, order: 8, active: true },
      { id: 'top-9', name: 'Analytics', categoryKey: 'Analytics', image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=300&h=300&q=80', isMostPopular: false, order: 9, active: true },
    ],
  });

  // Modal for adding/editing FAQ
  const [faqModal, setFaqModal] = useState({ open: false, isEdit: false, idx: -1, q: '', a: '' });

  // Modal for adding/editing Platform Category
  const [catModal, setCatModal] = useState({
    open: false,
    isEdit: false,
    idx: -1,
    id: '',
    name: '',
    slug: '',
    description: '',
    themeColor: '#FF6B35',
    icon: 'Zap',
    active: true,
    order: 1,
  });

  // Modal for adding/editing Top Circular Category
  const [topCatModal, setTopCatModal] = useState({
    open: false,
    isEdit: false,
    idx: -1,
    id: '',
    name: '',
    categoryKey: '',
    image: '',
    isMostPopular: false,
    order: 1,
    active: true,
  });

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/site-config');
      const data = await res.json();
      if (data?.success && data?.config) {
        setConfig((prev) => ({
          ...prev,
          ...data.config,
          categories: (data.config.categories && data.config.categories.length > 0) ? data.config.categories : prev.categories,
          topCategories: (data.config.topCategories && data.config.topCategories.length > 0) ? data.config.topCategories : prev.topCategories,
        }));
      }
    } catch (e) {
      console.error('Failed to load site config:', e);
      setErrorMsg('Failed to load settings from database');
    } finally {
      setLoading(false);
    }
  };

  const fetchDeals = async () => {
    setDealsLoading(true);
    try {
      const res = await fetch('/api/admin/deals');
      const data = await res.json();
      if (data?.success && data?.deals) {
        setDealsList(data.deals);
      }
    } catch (e) {
      console.error('Failed to load deals:', e);
    } finally {
      setDealsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
    fetchDeals();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSavedMsg(false);
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/site-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (data?.success) {
        setSavedMsg(true);
        setTimeout(() => setSavedMsg(false), 4000);
      } else {
        setErrorMsg(data.error || 'Failed to save');
      }
    } catch (e) {
      setErrorMsg(e.message || 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  // FAQ helpers
  const saveFaqItem = () => {
    if (!faqModal.q.trim() || !faqModal.a.trim()) return;
    const list = [...(config.faqs || [])];
    if (faqModal.isEdit && faqModal.idx >= 0) {
      list[faqModal.idx] = { ...list[faqModal.idx], q: faqModal.q, a: faqModal.a };
    } else {
      list.push({ id: `faq-${Date.now()}`, q: faqModal.q, a: faqModal.a, active: true });
    }
    setConfig({ ...config, faqs: list });
    setFaqModal({ open: false, isEdit: false, idx: -1, q: '', a: '' });
  };

  const deleteFaqItem = (idx) => {
    const list = config.faqs.filter((_, i) => i !== idx);
    setConfig({ ...config, faqs: list });
  };

  const toggleFaqActive = (idx) => {
    const list = [...config.faqs];
    list[idx].active = !list[idx].active;
    setConfig({ ...config, faqs: list });
  };

  // Category helpers
  const saveCatItem = () => {
    if (!catModal.name.trim()) return;
    const slug = catModal.slug.trim() || catModal.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const list = [...(config.categories || [])];
    const catData = {
      id: catModal.id || `cat-${Date.now()}`,
      name: catModal.name.trim(),
      slug,
      description: catModal.description.trim(),
      themeColor: catModal.themeColor || '#FF6B35',
      icon: catModal.icon || 'Zap',
      active: catModal.active !== false,
      order: Number(catModal.order) || list.length + 1,
    };

    if (catModal.isEdit && catModal.idx >= 0) {
      list[catModal.idx] = catData;
    } else {
      list.push(catData);
    }
    setConfig({ ...config, categories: list });
    setCatModal({ open: false, isEdit: false, idx: -1, id: '', name: '', slug: '', description: '', themeColor: '#FF6B35', icon: 'Zap', active: true, order: 1 });
  };

  const deleteCatItem = (idx) => {
    const list = config.categories.filter((_, i) => i !== idx);
    setConfig({ ...config, categories: list });
  };

  const toggleCatActive = (idx) => {
    const list = [...config.categories];
    list[idx].active = !list[idx].active;
    setConfig({ ...config, categories: list });
  };

  // Top Category helpers
  const saveTopCatItem = () => {
    if (!topCatModal.name.trim()) return;
    const list = [...(config.topCategories || [])];
    const itemData = {
      id: topCatModal.id || `top-${Date.now()}`,
      name: topCatModal.name.trim(),
      categoryKey: topCatModal.categoryKey.trim() || topCatModal.name.trim(),
      image: topCatModal.image.trim(),
      isMostPopular: Boolean(topCatModal.isMostPopular),
      order: Number(topCatModal.order) || list.length + 1,
      active: topCatModal.active !== false,
    };

    if (topCatModal.isEdit && topCatModal.idx >= 0) {
      list[topCatModal.idx] = itemData;
    } else {
      list.push(itemData);
    }
    setConfig({ ...config, topCategories: list });
    setTopCatModal({ open: false, isEdit: false, idx: -1, id: '', name: '', categoryKey: '', image: '', isMostPopular: false, order: 1, active: true });
  };

  const deleteTopCatItem = (idx) => {
    const list = config.topCategories.filter((_, i) => i !== idx);
    setConfig({ ...config, topCategories: list });
  };

  const toggleTopCatActive = (idx) => {
    const list = [...config.topCategories];
    list[idx].active = !list[idx].active;
    setConfig({ ...config, topCategories: list });
  };

  // Hero Slider Deal helpers
  const handleToggleDealSlider = async (deal) => {
    const nextState = !deal.showOnHeroSlider;
    try {
      const res = await fetch('/api/admin/deals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: deal.slug,
          showOnHeroSlider: nextState,
        }),
      });
      const data = await res.json();
      if (data?.success) {
        setDealsList((prev) =>
          prev.map((d) => (d.slug === deal.slug ? { ...d, showOnHeroSlider: nextState } : d))
        );
        setSliderSaveMsg(nextState ? `"${deal.title}" added to Hero Slider!` : `"${deal.title}" removed from Hero Slider.`);
        setTimeout(() => setSliderSaveMsg(''), 3000);
      }
    } catch (e) {
      console.error('Error updating slider toggle:', e);
    }
  };

  const handleSaveDealSliderDetails = async (deal, fields) => {
    try {
      const res = await fetch('/api/admin/deals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: deal.slug,
          ...fields,
        }),
      });
      const data = await res.json();
      if (data?.success) {
        setDealsList((prev) =>
          prev.map((d) => (d.slug === deal.slug ? { ...d, ...fields } : d))
        );
        setSliderSaveMsg(`Updated slider settings for "${deal.title}"`);
        setTimeout(() => setSliderSaveMsg(''), 3000);
      }
    } catch (e) {
      console.error('Error saving deal slider details:', e);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" /> Site Settings & Dynamic CMS
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Update homepage tickers, banner toggles, Google Search Console keys, and FAQs without touching code.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>

      {savedMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-400 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Settings saved successfully! Homepage and SEO are updated in real time.</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400 text-xs font-bold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 flex-wrap">
        <button
          onClick={() => setActiveTab('homepage')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'homepage'
              ? 'bg-white/15 text-white shadow-sm border border-white/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Homepage Banners & Ticker</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'categories'
              ? 'bg-[#FF6B35]/20 text-[#FF6B35] border border-[#FF6B35]/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Tag className="w-3.5 h-3.5 text-[#FF6B35]" />
          <span>📁 Platform Categories ({config.categories?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('topCategories')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'topCategories'
              ? 'bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Grid className="w-3.5 h-3.5 text-[#25D366]" />
          <span>🎯 Top Circular Categories ({config.topCategories?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('heroSlider')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'heroSlider'
              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>🌟 Hero Slider Software ({dealsList.filter((d) => d.showOnHeroSlider).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('seo')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'seo'
              ? 'bg-white/15 text-white shadow-sm border border-white/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-blue-400" />
          <span>SEO & Analytics Codes</span>
        </button>

        <button
          onClick={() => setActiveTab('faqs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'faqs'
              ? 'bg-white/15 text-white shadow-sm border border-white/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>FAQs Manager</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-amber-400 mb-2" />
          <p className="text-xs text-slate-400">Loading vault settings...</p>
        </div>
      ) : (
        <>
          {/* ═══════════ TAB 1: HOMEPAGE BANNERS & TICKER ═══════════ */}
          {activeTab === 'homepage' && (
            <div className="space-y-6">
              
              {/* 1. TOP ANNOUNCEMENT BAR */}
              <div className="bg-[#0E1528] border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <span>📢 Top Announcement Notice Bar</span>
                      <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">
                        Top of Page
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Displays a notification strip at the very top of the website for flash sales, coupons, or launch updates.
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.announcement.enabled}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          announcement: { ...config.announcement, enabled: e.target.checked },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-2">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={config.announcement.badge || ''}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          announcement: { ...config.announcement, badge: e.target.value },
                        })
                      }
                      placeholder="NEW / SALE"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="sm:col-span-7">
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Announcement Text</label>
                    <input
                      type="text"
                      value={config.announcement.text || ''}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          announcement: { ...config.announcement, text: e.target.value },
                        })
                      }
                      placeholder="e.g. 🔥 Flash Sale: Use code VIP10 for flat 10% off today"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Target Link</label>
                    <input
                      type="text"
                      value={config.announcement.link || ''}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          announcement: { ...config.announcement, link: e.target.value },
                        })
                      }
                      placeholder="/deals or coupon code"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* 2. GREEN TICKER / MARQUEE STRIP */}
              <div className="bg-[#0E1528] border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#63f477]" />
                      <span>Hero Green Marquee Strip</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      The tilted green ticker strip right above the top hero slider.
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="text-xs text-slate-300 font-bold flex items-center gap-2 cursor-pointer">
                      <span>Slim Mode (Patli):</span>
                      <input
                        type="checkbox"
                        checked={config.greenStrip.isSlim !== false}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            greenStrip: { ...config.greenStrip, isSlim: e.target.checked },
                          })
                        }
                        className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0"
                      />
                    </label>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.greenStrip.enabled !== false}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            greenStrip: { ...config.greenStrip, enabled: e.target.checked },
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                  {(config.greenStrip.items || []).map((item, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 p-3 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">
                          Item #{idx + 1}
                        </span>
                        <input
                          type="text"
                          value={item.icon || '✓'}
                          onChange={(e) => {
                            const items = [...config.greenStrip.items];
                            items[idx].icon = e.target.value;
                            setConfig({ ...config, greenStrip: { ...config.greenStrip, items } });
                          }}
                          placeholder="Icon"
                          className="w-8 text-center bg-white/10 border border-white/20 rounded-md text-xs text-white py-0.5"
                          title="Icon / Symbol (e.g. ✓, ⚡, ★, %)"
                        />
                      </div>
                      <input
                        type="text"
                        value={item.text || ''}
                        onChange={(e) => {
                          const items = [...config.greenStrip.items];
                          items[idx].text = e.target.value;
                          setConfig({ ...config, greenStrip: { ...config.greenStrip, items } });
                        }}
                        placeholder="Label text"
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. PROMOTIONAL PLUS / FESTIVE BANNER */}
              <div className="bg-[#0E1528] border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#FF5A36]" />
                      <span>Promotional Plus / Festive Membership Banner</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Toggle the AppSumo / StackDeal Plus style promotional card on the homepage without touching code.
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.promoBanner.enabled}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          promoBanner: { ...config.promoBanner, enabled: e.target.checked },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Badge Brand</label>
                    <input
                      type="text"
                      value={config.promoBanner.badge || ''}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          promoBanner: { ...config.promoBanner, badge: e.target.value },
                        })
                      }
                      placeholder="STACKDEAL PLUS"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Price</label>
                    <input
                      type="text"
                      value={config.promoBanner.price || ''}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          promoBanner: { ...config.promoBanner, price: e.target.value },
                        })
                      }
                      placeholder="$99 / ₹7,999"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Button Text</label>
                    <input
                      type="text"
                      value={config.promoBanner.buttonText || ''}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          promoBanner: { ...config.promoBanner, buttonText: e.target.value },
                        })
                      }
                      placeholder="Join StackDeal Plus"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Headline</label>
                    <input
                      type="text"
                      value={config.promoBanner.title || ''}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          promoBanner: { ...config.promoBanner, title: e.target.value },
                        })
                      }
                      placeholder="Save $350+/year on essential tools to grow your business"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Button Link</label>
                    <input
                      type="text"
                      value={config.promoBanner.buttonLink || ''}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          promoBanner: { ...config.promoBanner, buttonLink: e.target.value },
                        })
                      }
                      placeholder="/plus or /deals"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ═══════════ TAB 2: SEO & TRACKING CODES ═══════════ */}
          {activeTab === 'seo' && (
            <div className="bg-[#0E1528] border border-white/10 rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span>Google Search Console, Analytics & Verification</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Enter your tracking IDs once; they will be served to search engines and visitors automatically.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Google Site Verification Token (Search Console HTML tag)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={config.seo.googleVerification || ''}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          seo: { ...config.seo, googleVerification: e.target.value },
                        })
                      }
                      placeholder="e.g. tjrhKK8lic4LxbLxJmyjnemqrwbHQh61k9zbqNeg5O0"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Pastes directly into <code>&lt;meta name=&quot;google-site-verification&quot; content=&quot;...&quot; /&gt;</code>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Google Analytics 4 (GA4) Measurement ID
                    </label>
                    <input
                      type="text"
                      value={config.seo.gaId || ''}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          seo: { ...config.seo, gaId: e.target.value },
                        })
                      }
                      placeholder="G-XXXXXXXXXX"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Meta Pixel ID (Facebook Ads)
                    </label>
                    <input
                      type="text"
                      value={config.seo.metaPixelId || ''}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          seo: { ...config.seo, metaPixelId: e.target.value },
                        })
                      }
                      placeholder="1234567890"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Homepage SEO Title Tag
                  </label>
                  <input
                    type="text"
                    value={config.seo.siteTitle || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        seo: { ...config.seo, siteTitle: e.target.value },
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Meta Description (Shown in Google Search Results)
                  </label>
                  <textarea
                    rows={3}
                    value={config.seo.siteDescription || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        seo: { ...config.seo, siteDescription: e.target.value },
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ═══════════ TAB 3: FAQS ACCORDION MANAGER ═══════════ */}
          {activeTab === 'faqs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-[#0E1528] border border-white/10 p-5 rounded-2xl">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-400" />
                    <span>Homepage FAQ Accordion ({config.faqs?.length || 0} Questions)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Add or edit questions that appear on the homepage FAQ accordion and Google Rich Snippet schema.
                  </p>
                </div>

                <button
                  onClick={() => setFaqModal({ open: true, isEdit: false, idx: -1, q: '', a: '' })}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Question</span>
                </button>
              </div>

              <div className="space-y-3">
                {(config.faqs || []).map((faq, idx) => (
                  <div
                    key={faq.id || idx}
                    className={`p-4 rounded-xl border transition-all ${
                      faq.active !== false
                        ? 'bg-[#0E1528] border-white/10'
                        : 'bg-white/2 border-white/5 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                            Q{idx + 1}
                          </span>
                          <h4 className="text-xs font-bold text-white">{faq.q}</h4>
                        </div>
                        <p className="text-xs text-slate-400 font-normal leading-relaxed pl-7">{faq.a}</p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => toggleFaqActive(idx)}
                          className={`text-[10px] font-bold px-2 py-1 rounded-lg border cursor-pointer ${
                            faq.active !== false
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : 'bg-slate-800 border-slate-700 text-slate-400'
                          }`}
                        >
                          {faq.active !== false ? 'Active' : 'Hidden'}
                        </button>
                        <button
                          onClick={() =>
                            setFaqModal({ open: true, isEdit: true, idx, q: faq.q, a: faq.a })
                          }
                          className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteFaqItem(idx)}
                          className="p-1.5 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════ TAB 4: PLATFORM CATEGORIES ═══════════ */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0E1528] border border-white/10 p-5 rounded-2xl">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <span>📁 Platform Deal Categories</span>
                    <span className="text-[10px] bg-amber-400/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-400/30">
                      {config.categories?.length || 0} Categories
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Define categories available on StackDeal. These determine vendor submission categories, marketplace filters, and theme brand styling.
                  </p>
                </div>

                <button
                  onClick={() =>
                    setCatModal({
                      open: true,
                      isEdit: false,
                      idx: -1,
                      id: `cat-${Date.now()}`,
                      name: '',
                      slug: '',
                      description: '',
                      themeColor: '#FF6B35',
                      icon: 'Zap',
                      active: true,
                      order: (config.categories?.length || 0) + 1,
                    })
                  }
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Category</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(config.categories || []).map((cat, idx) => (
                  <div
                    key={cat.id || idx}
                    className={`border rounded-2xl p-4 space-y-3 transition-all ${
                      cat.active !== false
                        ? 'bg-[#0E1528] border-white/10'
                        : 'bg-black/30 border-dashed border-white/5 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-inner"
                          style={{ backgroundColor: cat.themeColor || '#FF6B35' }}
                        >
                          <span className="text-xs font-black">{cat.name?.slice(0, 2).toUpperCase()}</span>
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-white">{cat.name}</h4>
                          <p className="text-[10px] text-slate-400 font-mono">/{cat.slug || cat.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}</p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          cat.active !== false
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                      >
                        {cat.active !== false ? 'Active' : 'Hidden'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">
                      {cat.description || 'No description provided.'}
                    </p>

                    <div className="flex items-center justify-between border-t border-white/5 pt-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <span>Order:</span>
                        <strong className="text-white font-mono bg-white/5 px-1.5 py-0.5 rounded">{cat.order ?? idx + 1}</strong>
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleCatActive(idx)}
                          className="px-2 py-1 text-[10px] font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                        >
                          {cat.active !== false ? 'Hide' : 'Show'}
                        </button>
                        <button
                          onClick={() =>
                            setCatModal({
                              open: true,
                              isEdit: true,
                              idx,
                              id: cat.id || `cat-${idx}`,
                              name: cat.name || '',
                              slug: cat.slug || '',
                              description: cat.description || '',
                              themeColor: cat.themeColor || '#FF6B35',
                              icon: cat.icon || 'Zap',
                              active: cat.active !== false,
                              order: cat.order ?? idx + 1,
                            })
                          }
                          className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteCatItem(idx)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════ TAB 5: TOP CIRCULAR CATEGORIES ROW ═══════════ */}
          {activeTab === 'topCategories' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0E1528] border border-white/10 p-5 rounded-2xl">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <span>🎯 Homepage Top Categories (Circular Row)</span>
                    <span className="text-[10px] bg-emerald-400/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-400/30">
                      {config.topCategories?.length || 0} Badges
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage the circular category icons shown on the homepage right below the hero carousel. Users can click any circle to instantly filter software deals.
                  </p>
                </div>

                <button
                  onClick={() =>
                    setTopCatModal({
                      open: true,
                      isEdit: false,
                      idx: -1,
                      id: `top-${Date.now()}`,
                      name: '',
                      categoryKey: '',
                      image: '',
                      isMostPopular: false,
                      order: (config.topCategories?.length || 0) + 1,
                      active: true,
                    })
                  }
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Top Categories</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(config.topCategories || []).map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className={`border rounded-2xl p-4 space-y-3 transition-all ${
                      item.active !== false
                        ? 'bg-[#0E1528] border-white/10'
                        : 'bg-black/30 border-dashed border-white/5 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        {item.isMostPopular ? (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF4D4D] via-[#FF6B35] to-[#FF8C00] flex items-center justify-center text-white shadow-md ring-2 ring-[#FF6B35]/40 shrink-0">
                            <Flame className="w-6 h-6 animate-pulse" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700 shadow-md shrink-0 flex items-center justify-center">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xs font-black text-slate-400">{item.name?.slice(0, 2).toUpperCase()}</span>
                            )}
                          </div>
                        )}

                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-black text-white">{item.name}</h4>
                            {item.isMostPopular && (
                              <span className="text-[9px] font-black bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-400/30">
                                POPULAR
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400">
                            Filter: <strong className="text-slate-300">{item.categoryKey || item.name}</strong>
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          item.active !== false
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                      >
                        {item.active !== false ? 'Active' : 'Hidden'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <span>Display Order:</span>
                        <strong className="text-white font-mono bg-white/5 px-1.5 py-0.5 rounded">{item.order ?? idx + 1}</strong>
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleTopCatActive(idx)}
                          className="px-2 py-1 text-[10px] font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                        >
                          {item.active !== false ? 'Hide' : 'Show'}
                        </button>
                        <button
                          onClick={() =>
                            setTopCatModal({
                              open: true,
                              isEdit: true,
                              idx,
                              id: item.id || `top-${idx}`,
                              name: item.name || '',
                              categoryKey: item.categoryKey || item.name || '',
                              image: item.image || '',
                              isMostPopular: Boolean(item.isMostPopular),
                              order: item.order ?? idx + 1,
                              active: item.active !== false,
                            })
                          }
                          className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors cursor-pointer"
                          title="Edit Top Category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteTopCatItem(idx)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete Top Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════ TAB 6: HERO SLIDER FEATURED SOFTWARE ═══════════ */}
          {activeTab === 'heroSlider' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0E1528] border border-white/10 p-5 rounded-2xl">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <span>🌟 Hero Banner Carousel Software</span>
                    <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                      {dealsList.filter((d) => d.showOnHeroSlider).length} Featured Deals
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Select which active software listings appear in the main Hero Slider banner carousel on the homepage. Admin has 100% control over spotlight placement, discount badges, and ordering.
                  </p>
                </div>

                <div className="relative shrink-0 w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={dealSearch}
                    onChange={(e) => setDealSearch(e.target.value)}
                    placeholder="Search software or vendor..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {sliderSaveMsg && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{sliderSaveMsg}</span>
                </div>
              )}

              {dealsLoading ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-7 h-7 animate-spin mx-auto text-amber-400 mb-2" />
                  <p className="text-xs text-slate-400 font-bold">Loading software deals...</p>
                </div>
              ) : dealsList.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs font-bold">
                  No software deals found in database.
                </div>
              ) : (
                <div className="space-y-4">
                  {dealsList
                    .filter((deal) => {
                      if (!dealSearch.trim()) return true;
                      const q = dealSearch.toLowerCase();
                      return (
                        (deal.title || '').toLowerCase().includes(q) ||
                        (deal.vendorName || '').toLowerCase().includes(q) ||
                        (deal.category || '').toLowerCase().includes(q)
                      );
                    })
                    .map((deal) => (
                      <DealSliderRow
                        key={deal.slug || deal.id || deal._id}
                        deal={deal}
                        onToggleSlider={() => handleToggleDealSlider(deal)}
                        onSaveMeta={(fields) => handleSaveDealSliderDetails(deal, fields)}
                      />
                    ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* FAQ Modal */}
      {faqModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#0E1528] border border-white/20 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-black text-white">
              {faqModal.isEdit ? 'Edit FAQ Item' : 'Add New FAQ Question'}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Question</label>
                <input
                  type="text"
                  value={faqModal.q}
                  onChange={(e) => setFaqModal({ ...faqModal, q: e.target.value })}
                  placeholder="e.g. Can Indian agencies claim 18% GST input tax credit?"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Answer</label>
                <textarea
                  rows={4}
                  value={faqModal.a}
                  onChange={(e) => setFaqModal({ ...faqModal, a: e.target.value })}
                  placeholder="Detailed explanation..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setFaqModal({ open: false, isEdit: false, idx: -1, q: '', a: '' })}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={saveFaqItem}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-sm cursor-pointer"
              >
                {faqModal.isEdit ? 'Update FAQ' : 'Save Question'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Platform Category Modal */}
      {catModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#0E1528] border border-white/20 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-black text-white">
              {catModal.isEdit ? 'Edit Platform Category' : 'Add New Platform Category'}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Category Name *</label>
                <input
                  type="text"
                  value={catModal.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    setCatModal({ ...catModal, name, slug: catModal.isEdit ? catModal.slug : slug });
                  }}
                  placeholder="e.g. WhatsApp Bots"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">URL Slug</label>
                <input
                  type="text"
                  value={catModal.slug}
                  onChange={(e) => setCatModal({ ...catModal, slug: e.target.value })}
                  placeholder="e.g. whatsapp-bots"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Short Description</label>
                <input
                  type="text"
                  value={catModal.description}
                  onChange={(e) => setCatModal({ ...catModal, description: e.target.value })}
                  placeholder="e.g. WhatsApp marketing & bots"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Theme Brand Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={catModal.themeColor}
                      onChange={(e) => setCatModal({ ...catModal, themeColor: e.target.value })}
                      className="w-8 h-8 rounded-lg border border-white/10 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={catModal.themeColor}
                      onChange={(e) => setCatModal({ ...catModal, themeColor: e.target.value })}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={catModal.order}
                    onChange={(e) => setCatModal({ ...catModal, order: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="catActive"
                  checked={catModal.active !== false}
                  onChange={(e) => setCatModal({ ...catModal, active: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 cursor-pointer"
                />
                <label htmlFor="catActive" className="text-xs text-slate-300 cursor-pointer font-bold">
                  Active on Platform
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCatModal({ open: false, isEdit: false, idx: -1, id: '', name: '', slug: '', description: '', themeColor: '#FF6B35', icon: 'Zap', active: true, order: 1 })}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={saveCatItem}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-sm cursor-pointer"
              >
                {catModal.isEdit ? 'Update Category' : 'Save Category'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Circular Category Modal */}
      {topCatModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#0E1528] border border-white/20 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-black text-white">
              {topCatModal.isEdit ? 'Edit Top Category' : 'Add to Top Categories'}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Display Name *</label>
                <input
                  type="text"
                  value={topCatModal.name}
                  onChange={(e) => setTopCatModal({ ...topCatModal, name: e.target.value })}
                  placeholder="e.g. WhatsApp Bots"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Target Category Filter Key</label>
                <input
                  type="text"
                  value={topCatModal.categoryKey}
                  onChange={(e) => setTopCatModal({ ...topCatModal, categoryKey: e.target.value })}
                  placeholder="e.g. WhatsApp Bots or All"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Clicking this circle will filter homepage deals matching this exact category name (or &apos;All&apos; for most popular).
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Circular Image URL</label>
                <input
                  type="text"
                  value={topCatModal.image}
                  onChange={(e) => setTopCatModal({ ...topCatModal, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={topCatModal.order}
                    onChange={(e) => setTopCatModal({ ...topCatModal, order: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div className="flex-1 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={topCatModal.isMostPopular}
                      onChange={(e) => setTopCatModal({ ...topCatModal, isMostPopular: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500 cursor-pointer"
                    />
                    <span className="text-xs text-slate-300 font-bold">Fire / Most Popular Badge</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="topCatActive"
                  checked={topCatModal.active !== false}
                  onChange={(e) => setTopCatModal({ ...topCatModal, active: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-500 cursor-pointer"
                />
                <label htmlFor="topCatActive" className="text-xs text-slate-300 cursor-pointer font-bold">
                  Active on Homepage Row
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setTopCatModal({ open: false, isEdit: false, idx: -1, id: '', name: '', categoryKey: '', image: '', isMostPopular: false, order: 1, active: true })}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={saveTopCatItem}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-sm cursor-pointer"
              >
                {topCatModal.isEdit ? 'Update Top Category' : 'Save Top Category'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function DealSliderRow({ deal, onToggleSlider, onSaveMeta }) {
  const [discount, setDiscount] = useState(deal.sliderDiscount || '');
  const [badge, setBadge] = useState(deal.sliderBadge || '');
  const [subtitle, setSubtitle] = useState(deal.sliderSubtitle || '');
  const [order, setOrder] = useState(deal.sliderOrder || 0);
  const [isChanged, setIsChanged] = useState(false);

  const handleSave = () => {
    onSaveMeta({
      sliderDiscount: discount,
      sliderBadge: badge,
      sliderSubtitle: subtitle,
      sliderOrder: Number(order) || 0,
    });
    setIsChanged(false);
  };

  return (
    <div
      className={`border rounded-2xl p-5 transition-all space-y-4 ${
        deal.showOnHeroSlider
          ? 'bg-amber-950/20 border-amber-500/40 shadow-lg'
          : 'bg-[#0E1528] border-white/10'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-800 border border-white/10 shrink-0 flex items-center justify-center">
            {deal.vendorLogo || deal.heroImage || deal.screenshot ? (
              <img
                src={deal.vendorLogo || deal.heroImage || deal.screenshot}
                alt={deal.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-black text-slate-400">SD</span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black text-[#2475FF] bg-blue-500/20 px-2 py-0.5 rounded uppercase">
                {deal.category || 'SaaS Tool'}
              </span>
              {deal.showOnHeroSlider ? (
                <span className="text-[10px] font-black bg-amber-400/30 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/40 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400" /> Featured on Hero Slider
                </span>
              ) : (
                <span className="text-[10px] text-slate-400">Not on slider</span>
              )}
            </div>
            <h4 className="text-sm font-black text-white mt-1">{deal.title}</h4>
            <p className="text-xs text-slate-400">
              Vendor: <strong className="text-slate-200">{deal.vendorName}</strong> • ₹{deal.tier1Price || deal.price || 1999}
            </p>
          </div>
        </div>

        <button
          onClick={onToggleSlider}
          className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            deal.showOnHeroSlider
              ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-md'
              : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
          }`}
        >
          <Star className={`w-4 h-4 ${deal.showOnHeroSlider ? 'fill-slate-950' : ''}`} />
          <span>{deal.showOnHeroSlider ? '★ Live on Slider (Click to Remove)' : '+ Feature on Slider'}</span>
        </button>
      </div>

      {deal.showOnHeroSlider && (
        <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-3 pt-3">
          <p className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
            Custom Carousel Banner Settings for {deal.title}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1">Banner Discount</label>
              <input
                type="text"
                value={discount}
                onChange={(e) => {
                  setDiscount(e.target.value);
                  setIsChanged(true);
                }}
                placeholder="e.g. 50-92% Off"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1">Badge Tag</label>
              <input
                type="text"
                value={badge}
                onChange={(e) => {
                  setBadge(e.target.value);
                  setIsChanged(true);
                }}
                placeholder="e.g. META CLOUD API"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1">Banner Subtitle</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => {
                  setSubtitle(e.target.value);
                  setIsChanged(true);
                }}
                placeholder="e.g. WhatsApp AI Cart Recovery & Broadcasts"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1">Display Order</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={order}
                  onChange={(e) => {
                    setOrder(e.target.value);
                    setIsChanged(true);
                  }}
                  className="w-20 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
                {isChanged && (
                  <button
                    onClick={handleSave}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-lg shadow cursor-pointer"
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
