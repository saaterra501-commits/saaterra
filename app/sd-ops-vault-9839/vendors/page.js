'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ArrowUpRight,
  DollarSign,
  Eye,
  MessageSquare,
  Clock,
  ExternalLink,
  ShieldCheck,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';

export default function AdminVendorsPage() {
  const [pendingDeals, setPendingDeals] = useState([]);
  const [activeDeals, setActiveDeals] = useState([]);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'approved'
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  // Reject modal state
  const [rejectModal, setRejectModal] = useState({ open: false, slug: '', feedback: '' });
  // Preview modal state
  const [inspectModal, setInspectModal] = useState({ open: false, deal: null });

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/overview');
      const data = await res.json();
      if (data?.success) {
        if (Array.isArray(data.pendingDeals)) {
          setPendingDeals(data.pendingDeals);
        }
        if (Array.isArray(data.deals)) {
          setActiveDeals(data.deals.filter((d) => d.status === 'Active'));
        }
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
        const approved = pendingDeals.find((d) => d.slug === dealSlug);
        setPendingDeals(pendingDeals.filter((d) => d.slug !== dealSlug));
        if (approved) {
          setActiveDeals([...activeDeals, { ...approved, status: 'Active' }]);
        }
      }
    } catch (e) {
      console.error('Failed to approve deal:', e);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async () => {
    if (!rejectModal.slug) return;
    setProcessing(rejectModal.slug);
    try {
      const res = await fetch(`/api/admin/deals`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: rejectModal.slug,
          status: 'Rejected',
          rejectionFeedback: rejectModal.feedback,
        }),
      });
      if (res.ok) {
        setPendingDeals(pendingDeals.filter((d) => d.slug !== rejectModal.slug));
        setRejectModal({ open: false, slug: '', feedback: '' });
      }
    } catch (e) {
      console.error('Failed to reject deal:', e);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" /> Vendor Submissions & 1-Click Approval
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Review SaaS founder submissions from the <strong>/submit</strong> portal, verify tech stacks, and approve live launches.
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

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pending Submissions ({pendingDeals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('approved')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'approved'
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Live Marketplace Partners</span>
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="py-16 text-center text-slate-500 text-xs animate-pulse">
          Loading vendor applications from database...
        </div>
      ) : activeTab === 'pending' ? (
        <div className="bg-[#0E1528] border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-black text-white uppercase tracking-wider">
            Pending SaaS Applications Awaiting Audit ({pendingDeals.length})
          </h3>

          {pendingDeals.length === 0 ? (
            <div className="py-12 text-center space-y-3 bg-white/[0.02] border border-white/5 rounded-2xl">
              <Users className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-white">No pending vendor applications</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                When SaaS founders submit their software via the <strong>/submit</strong> portal, their review requests appear here for 1-click publishing.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingDeals.map((app) => (
                <div
                  key={app._id || app.slug}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/20 transition-all"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-black text-white">{app.title}</span>
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded">
                        Pending Verification
                      </span>
                      <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                        {app.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-1">
                      {app.tagline || app.description || 'No description provided'}
                    </p>

                    <div className="text-[11px] text-slate-400 flex items-center gap-4">
                      <span>Vendor: <strong className="text-slate-200">{app.vendorName || 'Independent Founder'}</strong></span>
                      <span>Pricing: <strong className="text-emerald-400">₹{app.price || app.tier1Price || 999}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setInspectModal({ open: true, deal: app })}
                      className="px-3 py-2 bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>

                    <button
                      onClick={() => setRejectModal({ open: true, slug: app.slug, feedback: '' })}
                      disabled={processing === app.slug}
                      className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-xs font-bold text-red-400 border border-red-500/30 rounded-xl transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>

                    <button
                      onClick={() => handleApprove(app.slug)}
                      disabled={processing === app.slug}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-xs font-black text-slate-950 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{processing === app.slug ? 'Publishing...' : 'Approve & Go Live'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#0E1528] border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-black text-white uppercase tracking-wider">
            Live Partner Software & Deals ({activeDeals.length})
          </h3>

          <div className="space-y-3">
            {activeDeals.map((deal) => (
              <div
                key={deal._id || deal.slug}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{deal.title}</span>
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                      Live on Site
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Category: {deal.category} · Price: ₹{deal.price || deal.tier1Price || 999}
                  </div>
                </div>

                <a
                  href={`/deals/${deal.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs text-slate-300 font-bold rounded-xl flex items-center gap-1 w-fit"
                >
                  <span>View Live Page</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reject Modal with Feedback */}
      {rejectModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#0E1528] border border-white/20 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-400" />
              <span>Reject Submission with Feedback</span>
            </h3>

            <p className="text-xs text-slate-400">
              Provide feedback for the founder so they can update their software listing requirements.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Feedback Note</label>
              <textarea
                rows={4}
                value={rejectModal.feedback}
                onChange={(e) => setRejectModal({ ...rejectModal, feedback: e.target.value })}
                placeholder="e.g. Please upload higher-resolution dashboard screenshots and verify that Meta Cloud API connection works without errors."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-400"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectModal({ open: false, slug: '', feedback: '' })}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspect Deal Modal */}
      {inspectModal.open && inspectModal.deal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#0E1528] border border-white/20 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-black text-white">{inspectModal.deal.title}</h3>
              <button
                onClick={() => setInspectModal({ open: false, deal: null })}
                className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-400">Vendor:</span>{' '}
                <span className="text-white">{inspectModal.deal.vendorName || 'Unknown'}</span>
              </div>
              <div>
                <span className="font-bold text-slate-400">Tagline:</span>{' '}
                <span className="text-slate-200">{inspectModal.deal.tagline}</span>
              </div>
              <div>
                <span className="font-bold text-slate-400">Category:</span>{' '}
                <span className="text-slate-200">{inspectModal.deal.category}</span>
              </div>
              <div>
                <span className="font-bold text-slate-400">Base Price:</span>{' '}
                <span className="text-emerald-400 font-bold">₹{inspectModal.deal.tier1Price || inspectModal.deal.price}</span>
              </div>
              {inspectModal.deal.videoUrl && (
                <div>
                  <span className="font-bold text-slate-400">Demo Video:</span>{' '}
                  <a
                    href={inspectModal.deal.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 underline"
                  >
                    Watch Demo Video
                  </a>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectModal({ open: false, deal: null })}
                className="px-4 py-2 bg-white/10 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
