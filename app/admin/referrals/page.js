'use client';

import { useState } from 'react';
import { Gift, Users, DollarSign, CheckCircle2, Copy } from 'lucide-react';

const REFERRERS = [
  { id: 1, name: 'Rahul Sharma', code: 'agency9901', clicks: 14, buyers: 3, earnings: '₹600', status: 'Active' },
  { id: 2, name: 'Priya Mehta', code: 'agency4421', clicks: 28, buyers: 5, earnings: '₹1,000', status: 'Active' },
  { id: 3, name: 'Amit Patel', code: 'patel7711', clicks: 8, buyers: 2, earnings: '₹400', status: 'Active' },
];

export default function AdminReferralsPage() {
  return (
    <div className="space-y-6 font-sans">
      
      <div className="flex items-center justify-between bg-white/5 border border-white/10 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-black text-white">Referral Rewards & Wallet Manager</h2>
          <p className="text-xs text-slate-400 font-medium">Track referral links, top agency referrers, and total ₹200 credits distributed.</p>
        </div>
      </div>

      <div className="bg-[#070B16] border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-black text-white">Top Referrers Ledger</h3>

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
            {REFERRERS.map((r) => (
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

    </div>
  );
}
