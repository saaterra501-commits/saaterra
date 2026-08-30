'use client';

import { useState, useEffect } from 'react';
import { Download, Search, RefreshCw, ShoppingBag, CheckCircle2 } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/overview');
      const data = await res.json();
      if (data?.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error('Failed to fetch orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    const q = search.toLowerCase();
    return (
      o.orderId?.toLowerCase().includes(q) ||
      o.userEmail?.toLowerCase().includes(q) ||
      o.userName?.toLowerCase().includes(q) ||
      o.gstNumber?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#2475FF]" /> Orders & B2B GST Tax Invoices
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Real-time verified Razorpay UPI customer orders and downloadable tax invoices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl border border-white/10 transition-colors cursor-pointer"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search GSTIN, Order ID, Email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/15 text-white text-xs font-bold rounded-xl focus:outline-none focus:border-[#2475FF]"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#070B16] border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-black text-white">All Transactions ({filteredOrders.length})</h3>

        {loading ? (
          <div className="py-16 text-center text-slate-500 text-xs animate-pulse">
            Loading orders from database...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-12 text-center space-y-3 bg-white/[0.02] border border-white/5 rounded-2xl">
            <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">No live transactions yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Real-time customer transactions placed via Razorpay will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium text-slate-300">
              <thead className="bg-white/5 text-slate-400 uppercase tracking-wider text-[10px] font-black">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Buyer Name & Email</th>
                  <th className="p-3">Pass & Tier</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Buyer GSTIN</th>
                  <th className="p-3">GST Tax Invoice</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.map((ord) => (
                  <tr key={ord._id || ord.orderId} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#2475FF]">{ord.orderId}</td>
                    <td className="p-3">
                      <div className="font-bold text-white">{ord.userName || ord.userEmail}</div>
                      <div className="text-[10px] text-slate-400">{ord.userEmail}</div>
                    </td>
                    <td className="p-3 text-slate-300">
                      <div className="font-bold">{ord.tier || '5-Year Pass'}</div>
                      <div className="text-[10px] text-emerald-400 font-mono">Code: {ord.licenseCode}</div>
                    </td>
                    <td className="p-3 font-black text-emerald-400">₹{ord.amountPaid?.toLocaleString('en-IN')}</td>
                    <td className="p-3 font-mono text-slate-400 text-[11px]">{ord.gstNumber || 'N/A'}</td>
                    <td className="p-3">
                      <a
                        href={`/api/invoice/${ord.orderId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2475FF] hover:underline bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-lg"
                      >
                        <Download className="w-3 h-3" /> Download GST Invoice
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
