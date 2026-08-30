'use client';

import { useState, useEffect } from 'react';
import { Users, CheckCircle2, RefreshCw, ArrowUpRight, DollarSign } from 'lucide-react';

export default function AdminVendorsPage() {
  const [pendingDeals, setPendingDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/overview');
      const data = await res.json();
      if (data?.success && Array.isArray(data.pendingDeals)) {
        setPendingDeals(data.pendingDeals);
      }
    } catch (e) {
      console.error('Failed to load vendors:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleApprove = async (dealSlug) => {
    setProcessing(dealSlug);
    try {
      const res = await fetch(`/api/admin/deals`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: dealSlug, status: 'Active' }),
      });
      if (res.ok) {
        setPendingDeals(pendingDeals.filter((d) => d.slug !== dealSlug));
      }
    } catch (e) {
      console.error('Failed to approve deal:', e);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between bg-white/5 border border-white/10 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" /> Vendor Partners & 70/30 Payouts Ledger
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Review live vendor SaaS listing applications and track automated 70% revenue share payouts.
          </p>
        </div>

        <button
          onClick={fetchVendors}
          className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl border border-white/10 transition-colors cursor-pointer"
          title="Refresh Vendors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Applications Section */}
      <div className="bg-[#070B16] border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-black text-white">Pending SaaS Launch Applications ({pendingDeals.length})</h3>

        {loading ? (
          <div className="py-16 text-center text-slate-500 text-xs animate-pulse">
            Checking pending applications in database...
          </div>
        ) : pendingDeals.length === 0 ? (
          <div className="py-12 text-center space-y-3 bg-white/[0.02] border border-white/5 rounded-2xl">
            <Users className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">No pending vendor applications</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              When SaaS founders submit their software via the <strong>/submit</strong> portal, their review requests will appear here for QA verification.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingDeals.map((app) => (
              <div
                key={app._id || app.slug}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">{app.title}</span>
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">
                      {app.status || 'Pending Review'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Vendor: <strong className="text-slate-200">{app.vendorName || 'Unknown'}</strong> · Category: {app.category}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleApprove(app.slug)}
                    disabled={processing === app.slug}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-black text-white rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{processing === app.slug ? 'Approving...' : 'Approve & Go Live'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
