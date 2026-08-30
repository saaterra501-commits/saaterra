'use client';

import { useState } from 'react';
import { Users, CheckCircle2, XCircle, DollarSign, ArrowUpRight, Calculator, Send } from 'lucide-react';

const SUBMISSIONS = [
  { id: 1, product: 'WhatsApp AutoBot AI', founder: 'Karan Malhotra', email: 'karan@autobot.in', cat: 'WhatsApp Bots', status: 'Pending Review', date: 'Today' },
  { id: 2, product: 'NuwaRank SEO Tracker', founder: 'Anita Sharma', email: 'anita@nuwarank.com', cat: 'AI & GEO SEO', status: 'Pending Review', date: 'Yesterday' },
];

const PAYOUTS = [
  { id: 'PAY-101', vendor: 'Chat Chacha AI', gross: '₹1,67,916', payout: '₹1,17,541 (70%)', fee: '₹50,375 (30%)', status: 'Paid', date: '25 Aug 2026' },
  { id: 'PAY-102', vendor: 'Nuwatomic GEO SEO', gross: '₹1,02,459', payout: '₹71,721 (70%)', fee: '₹30,738 (30%)', status: 'Due 01 Sep', date: 'Pending' },
];

export default function AdminVendorsPage() {
  const [apps, setApps] = useState(SUBMISSIONS);
  const [payoutList, setPayoutList] = useState(PAYOUTS);

  const approveApp = (id) => {
    setApps(apps.map((a) => (a.id === id ? { ...a, status: 'Approved' } : a)));
  };

  const processPayout = (id) => {
    setPayoutList(payoutList.map((p) => (p.id === id ? { ...p, status: 'Paid' } : p)));
  };

  return (
    <div className="space-y-6 font-sans">
      
      <div className="flex items-center justify-between bg-white/5 border border-white/10 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-black text-white">Vendor Partners & 70/30 Payouts Ledger</h2>
          <p className="text-xs text-slate-400 font-medium">Review vendor applications and approve 70% bi-weekly revenue payouts.</p>
        </div>
      </div>

      {/* Applications Section */}
      <div className="bg-[#070B16] border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-black text-white">Incoming Launch Applications ({apps.length})</h3>

        <div className="space-y-3">
          {apps.map((app) => (
            <div key={app.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-white">{app.product}</span>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">
                    {app.status}
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Founder: <strong className="text-slate-200">{app.founder}</strong> ({app.email}) · Category: {app.cat}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {app.status === 'Pending Review' ? (
                  <>
                    <button
                      onClick={() => approveApp(app.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-xs font-black text-white rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve Deal
                    </button>
                  </>
                ) : (
                  <span className="text-xs font-black text-emerald-400">✅ Approved & Listed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payouts Table */}
      <div className="bg-[#070B16] border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-black text-white">70/30 Vendor Revenue Payout Ledger</h3>

        <table className="w-full text-left text-xs font-medium text-slate-300">
          <thead className="bg-white/5 text-slate-400 uppercase tracking-wider text-[10px] font-black">
            <tr>
              <th className="p-3">Payout ID</th>
              <th className="p-3">SaaS Vendor</th>
              <th className="p-3">Gross Sales</th>
              <th className="p-3">Vendor 70% Share</th>
              <th className="p-3">StackDeal 30% Fee</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {payoutList.map((p) => (
              <tr key={p.id} className="hover:bg-white/5 transition-colors">
                <td className="p-3 font-mono font-bold text-[#2475FF]">{p.id}</td>
                <td className="p-3 font-bold text-white">{p.vendor}</td>
                <td className="p-3 text-slate-300">{p.gross}</td>
                <td className="p-3 font-black text-emerald-400">{p.payout}</td>
                <td className="p-3 font-bold text-slate-400">{p.fee}</td>
                <td className="p-3">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded ${p.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="p-3">
                  {p.status !== 'Paid' && (
                    <button
                      onClick={() => processPayout(p.id)}
                      className="px-3 py-1 bg-[#2475FF] hover:bg-blue-600 text-xs font-bold text-white rounded-lg transition-all"
                    >
                      Release Payout
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
