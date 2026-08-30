'use client';

import { useState } from 'react';
import { Gift, Users, RefreshCw } from 'lucide-react';

export default function AdminReferralsPage() {
  const [referrers, setReferrers] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between bg-white/5 border border-white/10 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Gift className="w-5 h-5 text-emerald-400" /> Referral Rewards & Wallet Manager
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Track user referral links, top agency referrers, and total ₹200 wallet credits distributed.
          </p>
        </div>
      </div>

      <div className="bg-[#070B16] border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-black text-white">Top Referrers Ledger ({referrers.length})</h3>

        {referrers.length === 0 ? (
          <div className="py-12 text-center space-y-3 bg-white/[0.02] border border-white/5 rounded-2xl">
            <Gift className="w-10 h-10 text-emerald-500/40 mx-auto" />
            <h4 className="text-sm font-bold text-white">No active referral conversions yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              When users invite other agency founders and they complete a purchase, referral stats and wallet credits will appear here in real-time.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium text-slate-300">
              <thead className="bg-white/5 text-slate-400 uppercase tracking-wider text-[10px] font-black">
                <tr>
                  <th className="p-3">Referrer Name</th>
                  <th className="p-3">Referral Code</th>
                  <th className="p-3">Clicks</th>
                  <th className="p-3">Buyers Converted</th>
                  <th className="p-3">Total Earnings</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {referrers.map((r) => (
                  <tr key={r.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-bold text-white">{r.name}</td>
                    <td className="p-3 font-mono text-[#2475FF]">{r.code}</td>
                    <td className="p-3 text-slate-300">{r.clicks}</td>
                    <td className="p-3 font-bold text-emerald-400">{r.buyers}</td>
                    <td className="p-3 font-black text-amber-400">{r.earnings}</td>
                    <td className="p-3">
                      <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                        {r.status}
                      </span>
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
