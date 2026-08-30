'use client';

import Link from 'next/link';
import {
  DollarSign, TrendingUp, Tag, Users, ShoppingBag, Crown,
  ArrowUpRight, Download, Plus, CheckCircle2, ShieldCheck, Zap
} from 'lucide-react';

const METRICS = [
  { label: 'Gross GMV Sales', value: '₹14,84,000', change: '+24.5%', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { label: 'StackDeal Net Revenue (30%)', value: '₹4,45,200', change: '+28.0%', icon: TrendingUp, color: 'text-[#FFD519]', bg: 'bg-amber-500/10' },
  { label: 'Active 5-Year Deals', value: '12 Deals', change: '3 Pending', icon: Tag, color: 'text-[#FF6B35]', bg: 'bg-orange-500/10' },
  { label: 'Vendor Payouts Due (70%)', value: '₹10,38,800', change: 'Bi-Weekly', icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
];

const RECENT_ORDERS = [
  { id: 'ord_1088', buyer: 'Rahul Sharma (Digital Agency)', deal: 'Chat Chacha — WhatsApp AI', price: '₹1,999', gstin: '07AAAAA9999B1Z2', status: 'Completed', date: 'Just now' },
  { id: 'ord_1087', buyer: 'Priya Mehta (SEO Agency)', deal: 'RankRocket AI GEO SEO', price: '₹2,499', gstin: '29BBBBB8888C1Z4', status: 'Completed', date: '12 mins ago' },
  { id: 'ord_1086', buyer: 'Amit Patel (Consultant)', deal: 'ScrapeKing AI B2B Leads', price: '₹1,499', gstin: '24CCCCC7777D1Z1', status: 'Completed', date: '45 mins ago' },
  { id: 'ord_1085', buyer: 'Vikram Singh (Agency Owner)', deal: 'Chat Chacha — WhatsApp AI', price: '₹3,999', gstin: '07DDDDD6666E1Z9', status: 'Completed', date: '2 hours ago' },
];

export default function VaultDashboardPage() {
  return (
    <div className="space-y-6 font-sans">
      
      {/* Welcome & Quick Commands Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-black text-white">Vault Executive Overview</h2>
          <p className="text-xs text-slate-400 font-medium">Real-time marketplace revenue, active 5-year passes, and 70/30 vendor payouts.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/sd-ops-vault-9839/deals"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#FF6B35] hover:bg-[#e55a27] text-white text-xs font-black rounded-xl transition-all shadow-md"
          >
            <Plus className="w-4 h-4" /> Add New SaaS Deal
          </Link>
          <Link
            href="/sd-ops-vault-9839/vendors"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#FFD519] hover:bg-[#e6c016] text-slate-950 text-xs font-black rounded-xl transition-all shadow-md"
          >
            <Users className="w-4 h-4" /> Process 70% Payouts
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map((m) => {
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
            <p className="text-xs text-slate-400 font-medium">Verified Razorpay UPI orders with automated GSTIN tax invoice generation</p>
          </div>
          <Link href="/sd-ops-vault-9839/orders" className="text-xs font-bold text-[#FFD519] hover:underline flex items-center gap-1">
            View All Orders <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium text-slate-300">
            <thead className="bg-white/5 text-slate-400 uppercase tracking-wider text-[10px] font-black">
              <tr>
                <th className="p-3 rounded-l-xl">Order ID</th>
                <th className="p-3">Buyer & Agency</th>
                <th className="p-3">SaaS Pass Purchased</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Buyer GSTIN</th>
                <th className="p-3">GST Invoice</th>
                <th className="p-3 rounded-r-xl">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {RECENT_ORDERS.map((ord) => (
                <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 font-mono font-bold text-white">{ord.id}</td>
                  <td className="p-3 font-bold text-slate-200">{ord.buyer}</td>
                  <td className="p-3 text-slate-300">{ord.deal}</td>
                  <td className="p-3 font-black text-emerald-400">{ord.price}</td>
                  <td className="p-3 font-mono text-[11px] text-slate-400">{ord.gstin}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" /> GST Paid
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">{ord.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
