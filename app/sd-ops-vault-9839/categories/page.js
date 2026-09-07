'use client';

import { useState, useEffect } from 'react';
import {
  Layers, Plus, Edit2, Trash2, CheckCircle2, RefreshCw, AlertCircle,
  Tag, Save, Eye, Palette
} from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Modal State
  const [catModal, setCatModal] = useState({
    open: false,
    isEdit: false,
    idx: -1,
    id: '',
    name: '',
    slug: '',
    description: '',
    image: '',
    themeColor: '#FF6B35',
    icon: 'Zap',
    active: true,
    order: 1,
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/site-config');
      const data = await res.json();
      if (data?.success && data?.config?.categories) {
        setCategories(data.config.categories);
      } else {
        // Fallback default categories
        setCategories([
          { id: 'cat-1', name: 'WhatsApp Bots', slug: 'whatsapp-bots', description: 'WhatsApp marketing & bots', themeColor: '#25D366', icon: 'MessageSquare', active: true, order: 1 },
          { id: 'cat-2', name: 'AI & GEO SEO', slug: 'ai-geo-seo', description: 'AI search & keyword tools', themeColor: '#8B5CF6', icon: 'Sparkles', active: true, order: 2 },
          { id: 'cat-3', name: 'Lead Scrapers', slug: 'lead-scrapers', description: 'B2B leads & data extractors', themeColor: '#0284C7', icon: 'Target', active: true, order: 3 },
          { id: 'cat-4', name: 'CRM & Sales', slug: 'crm-sales', description: 'Sales pipelines & CRM', themeColor: '#FF6B35', icon: 'BarChart3', active: true, order: 4 },
          { id: 'cat-5', name: 'Video & Design', slug: 'video-design', description: 'AI video & design creators', themeColor: '#EC4899', icon: 'Video', active: true, order: 5 },
          { id: 'cat-6', name: 'Email Marketing', slug: 'email-marketing', description: 'Cold email & newsletters', themeColor: '#6366F1', icon: 'Mail', active: true, order: 6 },
          { id: 'cat-7', name: 'Developer Tools', slug: 'developer-tools', description: 'APIs & developer utilities', themeColor: '#0F172A', icon: 'Code', active: true, order: 7 },
          { id: 'cat-8', name: 'Analytics', slug: 'analytics', description: 'Website traffic & reports', themeColor: '#0D9488', icon: 'TrendingUp', active: true, order: 8 },
        ]);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
      setErrorMsg('Failed to load categories from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const persistCategories = async (updatedList) => {
    setSaving(true);
    setSavedMsg(false);
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/site-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories: updatedList }),
      });
      const data = await res.json();
      if (data?.success) {
        setSavedMsg(true);
        setTimeout(() => setSavedMsg(false), 3500);
      } else {
        setErrorMsg(data.error || 'Failed to save categories');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error saving categories');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveModal = async () => {
    if (!catModal.name.trim()) return;
    const slug = catModal.slug.trim() || catModal.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const list = [...categories];
    const catData = {
      id: catModal.id || `cat-${Date.now()}`,
      name: catModal.name.trim(),
      slug,
      description: catModal.description.trim(),
      image: (catModal.image || '').trim(),
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

    setCategories(list);
    setCatModal({ open: false, isEdit: false, idx: -1, id: '', name: '', slug: '', description: '', image: '', themeColor: '#FF6B35', icon: 'Zap', active: true, order: 1 });
    await persistCategories(list);
  };

  const handleDelete = async (idx) => {
    if (!confirm('Are you sure you want to delete this category? Deals assigned to it may need updating.')) return;
    const list = categories.filter((_, i) => i !== idx);
    setCategories(list);
    await persistCategories(list);
  };

  const handleToggleActive = async (idx) => {
    const list = [...categories];
    list[idx].active = !list[idx].active;
    setCategories(list);
    await persistCategories(list);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0E1528] border border-white/10 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#FF6B35]" /> Platform Deal Categories Manager
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Add, edit, or remove categories available across StackDeal. Used for vendor submissions, marketplace tags, and category pages.
          </p>
        </div>

        <div className="flex items-center gap-3">
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
                order: categories.length + 1,
              })
            }
            className="px-4 py-2.5 bg-[#FF6B35] hover:bg-[#e55a27] text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Category</span>
          </button>
        </div>
      </div>

      {savedMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-400 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Categories saved & synced across MongoDB Atlas and homepage filters in real time!</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400 text-xs font-bold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Grid of Categories */}
      {loading ? (
        <div className="p-12 text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#FF6B35] mb-2" />
          <p className="text-xs text-slate-400">Loading categories from database...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-[#0E1528] border border-white/10 rounded-2xl p-12 text-center text-slate-400 text-xs">
          No categories found. Click <strong>Add New Category</strong> to create your first platform category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, idx) => (
            <div
              key={cat.id || idx}
              className={`border rounded-2xl p-5 space-y-3 transition-all ${
                cat.active !== false
                  ? 'bg-[#0E1528] border-white/10 hover:border-white/20'
                  : 'bg-black/30 border-dashed border-white/5 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shadow-md text-xs"
                    style={{ backgroundColor: cat.themeColor || '#FF6B35' }}
                  >
                    {cat.name?.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">{cat.name}</h3>
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
                <div className="flex items-center gap-2">
                  <span>Order:</span>
                  <strong className="text-white font-mono bg-white/5 px-2 py-0.5 rounded">{cat.order ?? idx + 1}</strong>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleActive(idx)}
                    className="px-2.5 py-1 text-[11px] font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
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
                        image: cat.image || '',
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
                    onClick={() => handleDelete(idx)}
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
      )}

      {/* Category Modal */}
      {catModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#0E1528] border border-white/20 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-black text-white">
              {catModal.isEdit ? 'Edit Category' : 'Add New Category'}
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B35]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">URL Slug</label>
                <input
                  type="text"
                  value={catModal.slug}
                  onChange={(e) => setCatModal({ ...catModal, slug: e.target.value })}
                  placeholder="e.g. whatsapp-bots"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#FF6B35]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Short Description</label>
                <input
                  type="text"
                  value={catModal.description}
                  onChange={(e) => setCatModal({ ...catModal, description: e.target.value })}
                  placeholder="e.g. WhatsApp marketing & automation bots"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B35]"
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

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Homepage Circular Image URL (Optional)</label>
                <input
                  type="text"
                  value={catModal.image || ''}
                  onChange={(e) => setCatModal({ ...catModal, image: e.target.value })}
                  placeholder="https://images.unsplash.com/... (optional)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#FF6B35]"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Optional: If left blank, a clean circular badge with your brand theme color and category initials will be used automatically on the homepage.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="catActiveDedicated"
                  checked={catModal.active !== false}
                  onChange={(e) => setCatModal({ ...catModal, active: e.target.checked })}
                  className="w-4 h-4 rounded text-[#FF6B35] cursor-pointer"
                />
                <label htmlFor="catActiveDedicated" className="text-xs text-slate-300 cursor-pointer font-bold">
                  Active on Platform (Main Web & Filters)
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCatModal({ open: false, isEdit: false, idx: -1, id: '', name: '', slug: '', description: '', image: '', themeColor: '#FF6B35', icon: 'Zap', active: true, order: 1 })}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModal}
                disabled={saving}
                className="px-4 py-2 bg-[#FF6B35] hover:bg-[#e55a27] text-white font-black text-xs rounded-xl shadow-sm cursor-pointer disabled:opacity-50"
              >
                {catModal.isEdit ? 'Update Category' : 'Save Category'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
