'use client';

import { useState, useEffect } from 'react';
import {
  Gift,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Copy,
  Check,
  Calendar,
  DollarSign,
  Tag,
  Clock,
  AlertCircle,
} from 'lucide-react';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percent',
    discountValue: 10,
    minOrderAmount: 0,
    maxDiscount: 2000,
    usageLimit: 0,
    expiresAt: '',
    isActive: true,
    autoApply: false,
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/coupons');
      const data = await res.json();
      if (data?.success && Array.isArray(data.coupons)) {
        setCoupons(data.coupons);
      }
    } catch (err) {
      console.error('Failed to load coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data?.success) {
        setSuccessMsg(`Coupon ${formData.code.toUpperCase()} created successfully!`);
        setShowModal(false);
        setFormData({
          code: '',
          description: '',
          discountType: 'percent',
          discountValue: 10,
          minOrderAmount: 0,
          maxDiscount: 2000,
          usageLimit: 0,
          expiresAt: '',
          isActive: true,
          autoApply: false,
        });
        fetchCoupons();
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(data.error || 'Failed to create coupon');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error creating coupon');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await fetch('/api/admin/coupons', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });
      setCoupons(coupons.map((c) => (c._id === id ? { ...c, isActive: !currentStatus } : c)));
    } catch (e) {
      console.error('Failed to toggle status:', e);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await fetch(`/api/admin/coupons?id=${id}`, { method: 'DELETE' });
      setCoupons(coupons.filter((c) => c._id !== id));
    } catch (e) {
      console.error('Failed to delete coupon:', e);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const activeCount = coupons.filter((c) => c.isActive).length;
  const totalRedemptions = coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Gift className="w-5 h-5 text-purple-400" /> Coupon Codes & Discount Engine
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Create promotional coupon codes for sales and agency partnerships without touching code.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon Code</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-400 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0E1528] border border-white/10 rounded-2xl p-5 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Coupons</span>
          <div className="text-2xl font-black text-white">{activeCount} Live</div>
          <p className="text-[10px] text-slate-500">Ready to use in cart</p>
        </div>

        <div className="bg-[#0E1528] border border-white/10 rounded-2xl p-5 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Redemptions</span>
          <div className="text-2xl font-black text-emerald-400">{totalRedemptions} Orders</div>
          <p className="text-[10px] text-slate-500">Discounts claimed by buyers</p>
        </div>

        <div className="bg-[#0E1528] border border-white/10 rounded-2xl p-5 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Built-in Defaults</span>
          <div className="text-sm font-bold text-purple-400 flex items-center gap-2 pt-1">
            <span className="bg-white/10 px-2 py-0.5 rounded font-mono text-xs text-white">VIP10</span>
            <span className="bg-white/10 px-2 py-0.5 rounded font-mono text-xs text-white">FOUNDER20</span>
          </div>
          <p className="text-[10px] text-slate-500 pt-0.5">Automated fallback support</p>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-[#0E1528] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-xs font-black text-white uppercase tracking-wider">Active & Scheduled Coupons</h3>
          <button
            onClick={fetchCoupons}
            className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading coupons...</div>
        ) : coupons.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto text-xl">
              🎟️
            </div>
            <h4 className="text-sm font-bold text-white">No custom coupons created yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Create your first promotional code (e.g. FESTIVE500, AGENCY20) to offer instant discounts on the cart page.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-slate-400 uppercase text-[10px] font-black border-b border-white/10">
                <tr>
                  <th className="px-5 py-3.5">Code</th>
                  <th className="px-5 py-3.5">Discount</th>
                  <th className="px-5 py-3.5">Min Order</th>
                  <th className="px-5 py-3.5">Usage / Limit</th>
                  <th className="px-5 py-3.5">Expiry</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {coupons.map((c) => {
                  const isExpired = c.expiresAt && new Date(c.expiresAt) < new Date();

                  return (
                    <tr key={c._id} className="hover:bg-white/2 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-white flex items-center gap-2">
                        <span className="bg-purple-500/15 border border-purple-500/30 text-purple-300 px-2.5 py-1 rounded-lg">
                          {c.code}
                        </span>
                        <button
                          onClick={() => copyToClipboard(c.code)}
                          className="text-slate-400 hover:text-white p-1"
                          title="Copy Code"
                        >
                          {copiedCode === c.code ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-extrabold text-white">
                          {c.discountType === 'percent' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT`}
                        </span>
                        {c.description && <div className="text-[10px] text-slate-400">{c.description}</div>}
                      </td>

                      <td className="px-5 py-4 text-slate-400">
                        {c.minOrderAmount > 0 ? `₹${c.minOrderAmount.toLocaleString('en-IN')}` : 'No minimum'}
                      </td>

                      <td className="px-5 py-4 text-slate-400">
                        <span className="font-bold text-white">{c.usedCount || 0}</span>
                        <span> / {c.usageLimit > 0 ? c.usageLimit : '∞ Unlimited'}</span>
                      </td>

                      <td className="px-5 py-4 text-slate-400">
                        {c.expiresAt ? (
                          <span className={isExpired ? 'text-red-400 font-bold' : ''}>
                            {new Date(c.expiresAt).toLocaleDateString('en-IN')}
                          </span>
                        ) : (
                          'Never'
                        )}
                      </td>

                      <td className="px-5 py-4">
                        {isExpired ? (
                          <span className="text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-md">
                            Expired
                          </span>
                        ) : c.isActive ? (
                          <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                            Active
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded-md">
                            Disabled
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleToggleActive(c._id, c.isActive)}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
                        >
                          {c.isActive ? 'Disable' : 'Enable'}
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#0E1528] border border-white/20 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Gift className="w-4 h-4 text-purple-400" />
              <span>Create New Promo Coupon</span>
            </h3>

            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-bold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. VIP10, FLAT500, FOUNDER30"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Description / Label</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. 10% Launch Special Discount"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full bg-[#070B16] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="flat">Flat Cash (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Min Cart Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                    placeholder="0 for none"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Usage Limit</label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                    placeholder="0 = Unlimited"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
