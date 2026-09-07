'use client';

import { useState, useEffect } from 'react';
import {
  Star, Search, RefreshCw, CheckCircle2, AlertCircle, Eye, ExternalLink,
  Sparkles, Layers, Check, X, ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

export default function AdminHeroSliderPage() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/deals');
      const data = await res.json();
      if (data?.success && data?.deals) {
        setDeals(data.deals);
      }
    } catch (err) {
      console.error('Failed to load deals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleToggleSlider = async (deal) => {
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
        setDeals((prev) =>
          prev.map((d) => (d.slug === deal.slug ? { ...d, showOnHeroSlider: nextState } : d))
        );
        setStatusMsg(
          nextState
            ? `🌟 "${deal.title}" is now LIVE on the Homepage Hero Slider!`
            : `Removed "${deal.title}" from Homepage Hero Slider.`
        );
        setTimeout(() => setStatusMsg(''), 4000);
      }
    } catch (err) {
      console.error('Slider toggle error:', err);
    }
  };

  const handleSaveMeta = async (deal, fields) => {
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
        setDeals((prev) =>
          prev.map((d) => (d.slug === deal.slug ? { ...d, ...fields } : d))
        );
        setStatusMsg(`Updated Hero Banner settings for "${deal.title}"`);
        setTimeout(() => setStatusMsg(''), 3500);
      }
    } catch (err) {
      console.error('Save meta error:', err);
    }
  };

  const featuredDeals = deals.filter((d) => d.showOnHeroSlider);
  const filteredDeals = deals.filter((deal) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (deal.title || '').toLowerCase().includes(q) ||
      (deal.vendorName || '').toLowerCase().includes(q) ||
      (deal.category || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0E1528] border border-white/10 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> Hero Banner Carousel Featured Software
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Control which software listings appear in the prime spotlight carousel at the very top of the StackDeal homepage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-xs rounded-xl border border-white/10 transition-all flex items-center gap-1.5"
          >
            <span>Preview Live Homepage</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {statusMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-400 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#070B16] border border-white/10 rounded-2xl p-4">
          <span className="text-[11px] font-bold text-slate-400">Total Software Listings</span>
          <p className="text-2xl font-black text-white mt-1">{deals.length}</p>
        </div>
        <div className="bg-[#070B16] border border-amber-500/30 rounded-2xl p-4">
          <span className="text-[11px] font-bold text-amber-400">Currently Featured on Hero Slider</span>
          <p className="text-2xl font-black text-amber-300 mt-1">{featuredDeals.length}</p>
        </div>
        <div className="bg-[#070B16] border border-white/10 rounded-2xl p-4">
          <span className="text-[11px] font-bold text-slate-400">Homepage Carousel Status</span>
          <p className="text-sm font-black text-emerald-400 mt-2">
            {featuredDeals.length > 0 ? '🟢 Custom Admin Selection Active' : '🟡 Curated Fallback Active'}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search software title, vendor name, or category..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        <button
          onClick={fetchDeals}
          className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl border border-white/10 transition-colors cursor-pointer"
          title="Refresh Deals"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Deals List */}
      {loading ? (
        <div className="p-12 text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-amber-400 mb-2" />
          <p className="text-xs text-slate-400">Loading software listings...</p>
        </div>
      ) : filteredDeals.length === 0 ? (
        <div className="bg-[#0E1528] border border-white/10 rounded-2xl p-12 text-center text-slate-400 text-xs">
          No software listings match your search.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDeals.map((deal) => (
            <HeroSliderDealCard
              key={deal.slug || deal.id}
              deal={deal}
              onToggle={() => handleToggleSlider(deal)}
              onSaveMeta={(fields) => handleSaveMeta(deal, fields)}
            />
          ))}
        </div>
      )}

    </div>
  );
}

function HeroSliderDealCard({ deal, onToggle, onSaveMeta }) {
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
          ? 'bg-amber-950/20 border-amber-500/50 shadow-xl'
          : 'bg-[#0E1528] border-white/10 hover:border-white/20'
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
                <span className="text-[10px] font-black bg-amber-400/30 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/40 flex items-center gap-1 animate-pulse">
                  <Star className="w-3 h-3 fill-amber-400" /> Featured on Hero Carousel
                </span>
              ) : (
                <span className="text-[10px] text-slate-400">Not on slider</span>
              )}
            </div>

            <h3 className="text-base font-black text-white mt-1">{deal.title}</h3>
            <p className="text-xs text-slate-400">
              Vendor: <strong className="text-slate-200">{deal.vendorName}</strong> • Price: <strong className="text-amber-400">₹{deal.tier1Price || deal.price || 1999}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={onToggle}
          className={`px-5 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            deal.showOnHeroSlider
              ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-lg'
              : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
          }`}
        >
          <Star className={`w-4 h-4 ${deal.showOnHeroSlider ? 'fill-slate-950' : ''}`} />
          <span>{deal.showOnHeroSlider ? '★ Live on Slider (Click to Remove)' : '+ Feature on Slider'}</span>
        </button>
      </div>

      {deal.showOnHeroSlider && (
        <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-3 pt-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Custom Hero Carousel Banner Settings for {deal.title}</span>
            </p>
            {isChanged && (
              <span className="text-[10px] text-amber-400 font-bold">Unsaved changes</span>
            )}
          </div>

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
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-lg shadow cursor-pointer transition-all"
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
