'use client';

import { useState } from 'react';
import { Download, Search, RefreshCw, CheckCircle2, ShieldCheck, DollarSign } from 'lucide-react';

const ORDERS_LIST = [
  { id: 'ord_1088', buyer: 'Rahul Sharma', email: 'rahul@agencyone.in', deal: 'Chat Chacha — WhatsApp AI', tier: 'Tier 1 Starter', price: '₹1,999', gstin: '07AAAAA9999B1Z2', status: 'Completed', date: '28 Aug 2026' },
  { id: 'ord_1087', buyer: 'Priya Mehta', email: 'priya@seoagency.com', deal: 'Nuwatomic GEO SEO', tier: 'Tier 1 Starter', price: '₹2,499', gstin: '29BBBBB8888C1Z4', status: 'Completed', date: '28 Aug 2026' },
  { id: 'ord_1086', buyer: 'Amit Patel', email: 'amit@pateltech.in', deal: 'LeadExtractor AI', tier: 'Tier 1 Starter', price: '₹1,499', gstin: '24CCCCC7777D1Z1', status: 'Completed', date: '27 Aug 2026' },
  { id: 'ord_1085', buyer: 'Vikram Singh', email: 'vikram@growthpack.in', deal: 'Chat Chacha — WhatsApp AI', tier: 'Tier 2 Pro Pass', price: '₹3,999', gstin: '07DDDDD6666E1Z9', status: 'Completed', date: '26 Aug 2026' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(ORDERS_LIST);
  const [search, setSearch] = useState('');

  const filteredOrders = orders.filter(
    (o) => o.buyer.toLowerCase().includes(search.toLowerCase()) ||
           o.gstin.toLowerCase().includes(search.toLowerCase()) ||
           o.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      
      <div className="flex items-center justify-between bg-white/5 border border-white/10 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-black text-white">Orders & B2B GST Tax Invoices Manager</h2>
          <p className="text-xs text-slate-400 font-medium">View all customer orders, download GST Tax Invoices, or process 60-day refunds.</p>
        </div>

        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search GSTIN, Order ID, Buyer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/15 text-white text-xs font-bold rounded-xl focus:outline-none focus:border-[#2475FF]"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#070B16] border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-black text-white">All Completed Transactions ({filteredOrders.length})</h3>

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
              <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                <td className="p-3 font-mono font-bold text-[#2475FF]">{ord.id}</td>
                <td className="p-3">
                  <div className="font-bold text-white">{ord.buyer}</div>
                  <div className="text-[10px] text-slate-400">{ord.email}</div>
                </td>
                <td className="p-3 text-slate-300">
                  <div>{ord.deal}</div>
                  <div className="text-[10px] text-slate-400 font-bold">{ord.tier}</div>
                </td>
                <td className="p-3 font-black text-emerald-400">{ord.price}</td>
                <td className="p-3 font-mono text-slate-400 text-[11px]">{ord.gstin}</td>
                <td className="p-3">
                  <a
                    href={`/api/invoice/${ord.id}?print=true`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2475FF] hover:underline bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-lg"
                  >
                    <Download className="w-3 h-3" /> Download GST PDF
                  </a>
                </td>
                <td className="p-3 text-slate-500 text-[11px]">{ord.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
