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
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('homepage'); // 'homepage' | 'seo' | 'faqs'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
  });

  // Modal for adding/editing FAQ
  const [faqModal, setFaqModal] = useState({ open: false, isEdit: false, idx: -1, q: '', a: '' });

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/site-config');
      const data = await res.json();
      if (data?.success && data?.config) {
        setConfig(data.config);
      }
    } catch (e) {
      console.error('Failed to load site config:', e);
      setErrorMsg('Failed to load settings from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
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
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
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

    </div>
  );
}
