'use client';

import { useState, useEffect } from 'react';
import {
  Grid, Plus, Edit2, Trash2, CheckCircle2, RefreshCw, AlertCircle,
  Flame, Image as ImageIcon, ExternalLink, ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

export default function AdminTopCategoriesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Modal State
  const [modal, setModal] = useState({
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

  const fetchTopCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/site-config');
      const data = await res.json();
      if (data?.success && data?.config?.topCategories) {
        setItems(data.config.topCategories);
      } else {
        setItems([
          { id: 'top-1', name: 'Most Popular', categoryKey: 'All', isMostPopular: true, order: 1, active: true },
          { id: 'top-2', name: 'WhatsApp Bots', categoryKey: 'WhatsApp Bots', image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=300&h=300&q=80', isMostPopular: false, order: 2, active: true },
          { id: 'top-3', name: 'AI & GEO SEO', categoryKey: 'AI & GEO SEO', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&h=300&q=80', isMostPopular: false, order: 3, active: true },
          { id: 'top-4', name: 'Lead Scrapers', categoryKey: 'Lead Scrapers', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=300&h=300&q=80', isMostPopular: false, order: 4, active: true },
          { id: 'top-5', name: 'CRM & Sales', categoryKey: 'CRM & Sales', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=300&h=300&q=80', isMostPopular: false, order: 5, active: true },
          { id: 'top-6', name: 'Video & Design', categoryKey: 'Video & Design', image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=300&h=300&q=80', isMostPopular: false, order: 6, active: true },
          { id: 'top-7', name: 'Email Marketing', categoryKey: 'Email Marketing', image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&w=300&h=300&q=80', isMostPopular: false, order: 7, active: true },
          { id: 'top-8', name: 'Developer Tools', categoryKey: 'Developer Tools', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=300&h=300&q=80', isMostPopular: false, order: 8, active: true },
          { id: 'top-9', name: 'Analytics', categoryKey: 'Analytics', image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=300&h=300&q=80', isMostPopular: false, order: 9, active: true },
        ]);
      }
    } catch (err) {
      console.error('Failed to load top categories:', err);
      setErrorMsg('Failed to load top categories from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopCategories();
  }, []);

  const persistItems = async (updatedList) => {
    setSaving(true);
    setSavedMsg(false);
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/site-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topCategories: updatedList }),
      });
      const data = await res.json();
      if (data?.success) {
        setSavedMsg(true);
        setTimeout(() => setSavedMsg(false), 3500);
      } else {
        setErrorMsg(data.error || 'Failed to save');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error saving top categories');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveModal = async () => {
    if (!modal.name.trim()) return;
    const list = [...items];
    const itemData = {
      id: modal.id || `top-${Date.now()}`,
      name: modal.name.trim(),
      categoryKey: modal.categoryKey.trim() || modal.name.trim(),
      image: modal.image.trim(),
      isMostPopular: Boolean(modal.isMostPopular),
      order: Number(modal.order) || list.length + 1,
      active: modal.active !== false,
    };

    if (modal.isEdit && modal.idx >= 0) {
      list[modal.idx] = itemData;
    } else {
      list.push(itemData);
    }

    setItems(list);
    setModal({ open: false, isEdit: false, idx: -1, id: '', name: '', categoryKey: '', image: '', isMostPopular: false, order: 1, active: true });
    await persistItems(list);
  };

  const handleDelete = async (idx) => {
    if (!confirm('Are you sure you want to remove this circular badge from the homepage?')) return;
    const list = items.filter((_, i) => i !== idx);
    setItems(list);
    await persistItems(list);
  };

  const handleToggleActive = async (idx) => {
    const list = [...items];
    list[idx].active = !list[idx].active;
    setItems(list);
    await persistItems(list);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0E1528] border border-white/10 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Grid className="w-5 h-5 text-[#25D366]" /> Homepage Top Categories (Circular Row)
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Manage the circular category icons shown on the homepage right below the hero carousel. Users can click any circle to filter marketplace software.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              setModal({
                open: true,
                isEdit: false,
                idx: -1,
                id: `top-${Date.now()}`,
                name: '',
                categoryKey: '',
                image: '',
                isMostPopular: false,
                order: items.length + 1,
                active: true,
              })
            }
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Top Categories</span>
          </button>
        </div>
      </div>

      {savedMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-400 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Top Categories circular row saved & synced across homepage in real time!</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400 text-xs font-bold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Grid of Badges */}
      {loading ? (
        <div className="p-12 text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#25D366] mb-2" />
          <p className="text-xs text-slate-400">Loading top circular categories from database...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-[#0E1528] border border-white/10 rounded-2xl p-12 text-center text-slate-400 text-xs">
          No circular categories found. Click <strong>Add to Top Categories</strong> to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, idx) => (
            <div
              key={item.id || idx}
              className={`border rounded-2xl p-5 space-y-3 transition-all ${
                item.active !== false
                  ? 'bg-[#0E1528] border-white/10 hover:border-white/20'
                  : 'bg-black/30 border-dashed border-white/5 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  {item.isMostPopular ? (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF4D4D] via-[#FF6B35] to-[#FF8C00] flex items-center justify-center text-white shadow-md ring-2 ring-[#FF6B35]/40 shrink-0">
                      <Flame className="w-7 h-7 animate-pulse" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700 shadow-md shrink-0 flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-black text-slate-400">{item.name?.slice(0, 2).toUpperCase()}</span>
                      )}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-white">{item.name}</h3>
                      {item.isMostPopular && (
                        <span className="text-[9px] font-black bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
                          POPULAR
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Target Filter: <strong className="text-slate-200">{item.categoryKey || item.name}</strong>
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
                <div className="flex items-center gap-2">
                  <span>Display Order:</span>
                  <strong className="text-white font-mono bg-white/5 px-2 py-0.5 rounded">{item.order ?? idx + 1}</strong>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleActive(idx)}
                    className="px-2.5 py-1 text-[11px] font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  >
                    {item.active !== false ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() =>
                      setModal({
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
                    onClick={() => handleDelete(idx)}
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
      )}

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#0E1528] border border-white/20 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-black text-white">
              {modal.isEdit ? 'Edit Top Category Badge' : 'Add to Top Categories'}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Display Name *</label>
                <input
                  type="text"
                  value={modal.name}
                  onChange={(e) => setModal({ ...modal, name: e.target.value })}
                  placeholder="e.g. WhatsApp Bots"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Target Category Filter Key</label>
                <input
                  type="text"
                  value={modal.categoryKey}
                  onChange={(e) => setModal({ ...modal, categoryKey: e.target.value })}
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
                  value={modal.image}
                  onChange={(e) => setModal({ ...modal, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={modal.order}
                    onChange={(e) => setModal({ ...modal, order: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div className="flex-1 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={modal.isMostPopular}
                      onChange={(e) => setModal({ ...modal, isMostPopular: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500 cursor-pointer"
                    />
                    <span className="text-xs text-slate-300 font-bold">Fire / Most Popular Badge</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="topCatActiveDirect"
                  checked={modal.active !== false}
                  onChange={(e) => setModal({ ...modal, active: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-500 cursor-pointer"
                />
                <label htmlFor="topCatActiveDirect" className="text-xs text-slate-300 cursor-pointer font-bold">
                  Active on Homepage Row
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setModal({ open: false, isEdit: false, idx: -1, id: '', name: '', categoryKey: '', image: '', isMostPopular: false, order: 1, active: true })}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModal}
                disabled={saving}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-sm cursor-pointer disabled:opacity-50"
              >
                {modal.isEdit ? 'Update Top Category' : 'Save Top Category'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
