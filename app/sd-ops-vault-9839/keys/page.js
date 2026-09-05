'use client';

import { useState, useEffect } from 'react';
import {
  Key,
  Plus,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ShoppingBag,
  Upload,
  Trash2,
  Search,
  Check,
  Clock,
  Layers,
  FileText,
} from 'lucide-react';

export default function AdminKeysPage() {
  const [deals, setDeals] = useState([]);
  const [stats, setStats] = useState([]);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Selected deal for inspecting individual keys
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [inspectKeys, setInspectKeys] = useState([]);
  const [loadingKeys, setLoadingKeys] = useState(false);

  // Modal for bulk uploading keys
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadDealId, setUploadDealId] = useState('');
  const [uploadTier, setUploadTier] = useState('Tier 1');
  const [rawKeysInput, setRawKeysInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/keys');
      const data = await res.json();
      if (data?.success) {
        setDeals(data.deals || []);
        setStats(data.stats || []);
        setLowStockCount(data.lowStockCount || 0);
        if (data.deals?.length > 0 && !uploadDealId) {
          setUploadDealId(data.deals[0]._id);
        }
      }
    } catch (err) {
      console.error('Failed to load keys stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleInspectDeal = async (deal) => {
    setSelectedDeal(deal);
    setLoadingKeys(true);
    try {
      const res = await fetch(`/api/admin/keys?dealId=${deal.dealId}`);
      const data = await res.json();
      if (data?.success) {
        setInspectKeys(data.keys || []);
      }
    } catch (err) {
      console.error('Failed to load keys for deal:', err);
    } finally {
      setLoadingKeys(false);
    }
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    setErrorMsg('');
    setUploadResult(null);

    try {
      const res = await fetch('/api/admin/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealId: uploadDealId,
          tier: uploadTier,
          rawKeys: rawKeysInput,
        }),
      });
      const data = await res.json();
      if (data?.success) {
        setUploadResult(data);
        setRawKeysInput('');
        fetchStats();
        if (selectedDeal && selectedDeal.dealId === uploadDealId) {
          handleInspectDeal(selectedDeal);
        }
      } else {
        setErrorMsg(data.error || 'Failed to upload keys');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error uploading keys');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteKey = async (keyId) => {
    if (!confirm('Remove this license key from inventory?')) return;
    try {
      await fetch(`/api/admin/keys?id=${keyId}`, { method: 'DELETE' });
      setInspectKeys(inspectKeys.filter((k) => k._id !== keyId));
      fetchStats();
    } catch (e) {
      console.error('Failed to delete key:', e);
    }
  };

  // Aggregated totals
  let totalAvailable = 0;
  let totalAssigned = 0;
  stats.forEach((s) => {
    Object.values(s.tiers).forEach((t) => {
      totalAvailable += t.available;
      totalAssigned += t.assigned;
    });
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-400" /> License Keys Vault & Inventory Control
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Monitor software license inventory, upload bulk keys, and get instant low-stock alerts.
          </p>
        </div>

        <button
          onClick={() => {
            setShowUploadModal(true);
            setUploadResult(null);
            setErrorMsg('');
          }}
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Bulk Upload Keys</span>
        </button>
      </div>

      {/* ⚠️ LOW STOCK CRITICAL ALERT BANNER */}
      {lowStockCount > 0 && (
        <div className="p-4 bg-red-500/15 border border-red-500/40 rounded-2xl flex items-center justify-between gap-4 text-red-300 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider">
                Low Inventory Warning ({lowStockCount} Tier{lowStockCount > 1 ? 's' : ''} with &lt; 5 keys)
              </h3>
              <p className="text-xs text-red-300/90 font-medium mt-0.5">
                Some software deals have fewer than 5 keys left. Please upload more keys to prevent order fulfillment errors!
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-3 py-1.5 bg-red-500 hover:bg-red-400 text-white font-black text-xs rounded-xl transition-all shrink-0 cursor-pointer"
          >
            Refill Now
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0E1528] border border-white/10 rounded-2xl p-5 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Available in Vault</span>
          <div className="text-2xl font-black text-emerald-400">{totalAvailable} Keys</div>
          <p className="text-[10px] text-slate-500">Ready for instant delivery</p>
        </div>

        <div className="bg-[#0E1528] border border-white/10 rounded-2xl p-5 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Delivered to Customers</span>
          <div className="text-2xl font-black text-white">{totalAssigned} Assigned</div>
          <p className="text-[10px] text-slate-500">Fulfilled orders</p>
        </div>

        <div className="bg-[#0E1528] border border-white/10 rounded-2xl p-5 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Low Stock Tiers</span>
          <div className={`text-2xl font-black ${lowStockCount > 0 ? 'text-red-400' : 'text-slate-400'}`}>
            {lowStockCount} Tiers
          </div>
          <p className="text-[10px] text-slate-500">&lt; 5 keys remaining</p>
        </div>
      </div>

      {/* Main Grid: Inventory Table */}
      <div className="bg-[#0E1528] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-xs font-black text-white uppercase tracking-wider">
            Deal License Stock Breakdown
          </h3>
          <button
            onClick={fetchStats}
            className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading vault inventory...</div>
        ) : stats.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No deals found in database.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-slate-400 uppercase text-[10px] font-black border-b border-white/10">
                <tr>
                  <th className="px-5 py-3.5">Software Deal</th>
                  <th className="px-5 py-3.5">Tier 1 Stock</th>
                  <th className="px-5 py-3.5">Tier 2 Stock</th>
                  <th className="px-5 py-3.5">Tier 3 Stock</th>
                  <th className="px-5 py-3.5">Health Status</th>
                  <th className="px-5 py-3.5 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {stats.map((s) => {
                  const t1 = s.tiers['Tier 1'] || { available: 0, total: 0 };
                  const t2 = s.tiers['Tier 2'] || { available: 0, total: 0 };
                  const t3 = s.tiers['Tier 3'] || { available: 0, total: 0 };

                  return (
                    <tr key={s.dealId} className="hover:bg-white/2 transition-colors">
                      <td className="px-5 py-4 font-bold text-white max-w-[240px] truncate">
                        {s.title}
                        <div className="text-[10px] text-slate-500 font-mono">/deals/{s.slug}</div>
                      </td>

                      <td className="px-5 py-4">
                        <span className={`font-black ${t1.total > 0 && t1.available < 5 ? 'text-red-400 font-extrabold' : 'text-emerald-400'}`}>
                          {t1.available}
                        </span>
                        <span className="text-slate-500"> / {t1.total}</span>
                      </td>

                      <td className="px-5 py-4">
                        <span className={`font-black ${t2.total > 0 && t2.available < 5 ? 'text-red-400 font-extrabold' : 'text-emerald-400'}`}>
                          {t2.available}
                        </span>
                        <span className="text-slate-500"> / {t2.total}</span>
                      </td>

                      <td className="px-5 py-4">
                        <span className={`font-black ${t3.total > 0 && t3.available < 5 ? 'text-red-400 font-extrabold' : 'text-emerald-400'}`}>
                          {t3.available}
                        </span>
                        <span className="text-slate-500"> / {t3.total}</span>
                      </td>

                      <td className="px-5 py-4">
                        {s.hasLowStock ? (
                          <span className="text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-md flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3 h-3" /> Low Stock
                          </span>
                        ) : t1.total === 0 && t2.total === 0 ? (
                          <span className="text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded-md">
                            No Keys Added
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md flex items-center gap-1 w-fit">
                            <Check className="w-3 h-3" /> Healthy
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleInspectDeal(s)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 hover:bg-white/10 text-amber-300 border border-white/10 transition-colors cursor-pointer"
                        >
                          View Keys
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

      {/* Individual Keys Inspector Drawer/Modal */}
      {selectedDeal && (
        <div className="bg-[#0E1528] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <span>Vault Keys: {selectedDeal.title}</span>
                <span className="text-[10px] font-mono bg-white/10 text-slate-300 px-2 py-0.5 rounded">
                  {inspectKeys.length} Records Loaded
                </span>
              </h3>
            </div>
            <button
              onClick={() => setSelectedDeal(null)}
              className="text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
            >
              ✕ Close
            </button>
          </div>

          {loadingKeys ? (
            <div className="py-8 text-center text-xs text-slate-400">Loading keys...</div>
          ) : inspectKeys.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">No keys in vault for this deal.</div>
          ) : (
            <div className="overflow-x-auto max-h-[350px]">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-slate-400 uppercase text-[10px] font-black sticky top-0">
                  <tr>
                    <th className="px-4 py-2.5">Key Code</th>
                    <th className="px-4 py-2.5">Tier</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5">Customer Email</th>
                    <th className="px-4 py-2.5">Assigned Order</th>
                    <th className="px-4 py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {inspectKeys.map((k) => (
                    <tr key={k._id} className="hover:bg-white/2">
                      <td className="px-4 py-2.5 font-mono font-bold text-white">{k.code}</td>
                      <td className="px-4 py-2.5 text-slate-400">{k.tier || 'Tier 1'}</td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            k.status === 'available'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {k.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-slate-400">{k.assignedUserEmail || '—'}</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">{k.orderId || '—'}</td>
                      <td className="px-4 py-2.5 text-right">
                        {k.status === 'available' && (
                          <button
                            onClick={() => handleDeleteKey(k._id)}
                            className="p-1 hover:text-red-400 text-slate-500 cursor-pointer"
                            title="Delete unused key"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Bulk Key Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#0E1528] border border-white/20 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-amber-400" />
              <span>Bulk Upload License Keys</span>
            </h3>

            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-bold">
                {errorMsg}
              </div>
            )}

            {uploadResult && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold space-y-1">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{uploadResult.message}</span>
                </div>
                {uploadResult.skippedCount > 0 && (
                  <p className="text-[11px] text-slate-400 font-normal">
                    {uploadResult.skippedCount} duplicate keys were automatically skipped.
                  </p>
                )}
              </div>
            )}

            <form onSubmit={handleBulkUpload} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Target Software Deal *</label>
                <select
                  required
                  value={uploadDealId}
                  onChange={(e) => setUploadDealId(e.target.value)}
                  className="w-full bg-[#070B16] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  {deals.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Tier *</label>
                <select
                  value={uploadTier}
                  onChange={(e) => setUploadTier(e.target.value)}
                  className="w-full bg-[#070B16] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Tier 1">Tier 1 (Starter Pass)</option>
                  <option value="Tier 2">Tier 2 (Pro Pass)</option>
                  <option value="Tier 3">Tier 3 (Agency Pass)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  License Keys (Paste line-by-line or comma-separated) *
                </label>
                <textarea
                  rows={6}
                  required
                  value={rawKeysInput}
                  onChange={(e) => setRawKeysInput(e.target.value)}
                  placeholder={`SD-CHACHA-001-A9F2\nSD-CHACHA-002-B83K\nSD-CHACHA-003-88ZP\n...`}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  You can paste 50–200 keys directly from Excel, CSV, or vendor email. Duplicate keys will be detected automatically.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer disabled:opacity-50"
                >
                  {uploading ? 'Adding Keys...' : 'Save Keys to Vault'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
