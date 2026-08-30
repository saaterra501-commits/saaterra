'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  Tag,
  Users,
  ShoppingBag,
  ArrowUpRight,
  Download,
  Plus,
  CheckCircle2,
  RefreshCw,
  Mail,
} from 'lucide-react';

export default function VaultDashboardPage() {
  const [data, setData] = useState({
    metrics: {
      grossGMV: '₹0',
      netRevenue: '₹0',
      activeDealsCount: '0 Deals',
      pendingDealsCount: '0 Pending',
      vendorPayouts: '₹0',
      totalUsers: 0,
      totalInquiries: 0,
    },
    orders: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/overview');
      const json = await res.json();
      if (json?.success) {
        setData(json);
      }
    } catch (e) {
      console.error('Failed to load vault overview:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const metricCards = [
    {
      label: 'Gross GMV Sales',
      value: data.metrics.grossGMV,
      change: 'Live Razorpay',
      icon: DollarSign,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'StackDeal Net (30%)',
      value: data.metrics.netRevenue,
      change: 'Commission',
      icon: TrendingUp,
      color: 'text-[#FFD519]',
      bg: 'bg-amber-500/10',
    },
    {
      label: 'Active 5-Year Deals',
      value: data.metrics.activeDealsCount,
      change: data.metrics.pendingDealsCount,
      icon: Tag,
      color: 'text-[#FF6B35]',
      bg: 'bg-orange-500/10',
    },
    {
      label: 'Vendor Payouts Due (70%)',
      value: data.metrics.vendorPayouts,
      change: 'Bi-Weekly',
      icon: Users,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Welcome & Quick Commands Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-black text-white">Vault Executive Overview</h2>
          <p className="text-xs text-slate-400 font-medium">
            Real-time marketplace revenue, active 5-year passes, and verified database transactions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOverview}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl border border-white/10 transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/sd-ops-vault-9839/inbox"
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl transition-all shadow-md"
          >
            <Mail className="w-4 h-4" /> Support Inbox ({data.metrics.totalInquiries || 0})
          </Link>
          <Link
            href="/sd-ops-vault-9839/deals"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#FF6B35] hover:bg-[#e55a27] text-white text-xs font-black rounded-xl transition-all shadow-md"
          >
            <Plus className="w-4 h-4" /> Add New SaaS Deal
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-[#070B16] border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">{m.label}</span>
                <div className={`w-8 h-8 rounded-xl ${m.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${m.color}`} />
                </div>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-2xl font-black text-white">{m.value}</span>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  {m.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders & GST Invoices */}
      <div className="bg-[#070B16] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-white">Recent Transactions & B2B GST Invoices</h3>
            <p className="text-xs text-slate-400 font-medium">
              Verified live Razorpay UPI orders with automated GSTIN tax invoice generation
            </p>
          </div>
          <Link
            href="/sd-ops-vault-9839/orders"
            className="text-xs font-bold text-[#FFD519] hover:underline flex items-center gap-1"
          >
            View All Orders <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {data.orders.length === 0 ? (
          <div className="py-12 text-center space-y-3 bg-white/[0.02] border border-white/5 rounded-2xl">
            <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">No live transactions yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              When customers purchase 5-Year Passes via Razorpay UPI, completed orders and GST tax invoices will appear here in real-time.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium text-slate-300">
              <thead className="bg-white/5 text-slate-400 uppercase tracking-wider text-[10px] font-black">
                <tr>
                  <th className="p-3 rounded-l-xl">Order ID</th>
                  <th className="p-3">Buyer & Agency</th>
                  <th className="p-3">SaaS Pass</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Buyer GSTIN</th>
                  <th className="p-3">GST Invoice</th>
                  <th className="p-3 rounded-r-xl">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.orders.map((ord) => (
                  <tr key={ord._id || ord.orderId} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-mono font-bold text-white">{ord.orderId}</td>
                    <td className="p-3 font-bold text-slate-200">
                      <div>{ord.userName || ord.userEmail}</div>
                      <div className="text-[10px] text-slate-500">{ord.userEmail}</div>
                    </td>
                    <td className="p-3 text-slate-300">{ord.tier || '5-Year Pass'}</td>
                    <td className="p-3 font-black text-emerald-400">₹{ord.amountPaid?.toLocaleString('en-IN')}</td>
                    <td className="p-3 font-mono text-[11px] text-slate-400">{ord.gstNumber || 'N/A'}</td>
                    <td className="p-3">
                      <a
                        href={`/api/invoice/${ord.orderId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/30"
                      >
                        <CheckCircle2 className="w-3 h-3" /> GST Tax Invoice
                      </a>
                    </td>
                    <td className="p-3 text-slate-400 text-[11px]">
                      {new Date(ord.createdAt || ord.purchasedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
