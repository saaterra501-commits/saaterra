'use client';

import { useState } from 'react';
import { Crown, Sparkles, ShieldCheck, User, Calendar, DollarSign } from 'lucide-react';

const VIP_MEMBERS = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@agencyone.in', plan: '1 Year VIP Access', paid: '₹999', joined: '15 Aug 2026', expires: '15 Aug 2027', status: 'Active' },
  { id: 2, name: 'Priya Mehta', email: 'priya@seoagency.com', plan: '1 Year VIP Access', paid: '₹999', joined: '18 Aug 2026', expires: '18 Aug 2027', status: 'Active' },
  { id: 3, name: 'Amit Patel', email: 'amit@pateltech.in', plan: '1 Year VIP Access', paid: '₹999', joined: '22 Aug 2026', expires: '22 Aug 2027', status: 'Active' },
];

export default function AdminPlusPage() {
  return (
    <div className="space-y-6 font-sans">
      
      <div className="flex items-center justify-between bg-white/5 border border-white/10 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" /> StackDeal Plus VIP Members
          </h2>
          <p className="text-xs text-slate-400 font-medium">Manage ₹999/yr VIP subscriptions, view active VIP members list, and configure 90-day extended refund privileges.</p>
        </div>
      </div>

      <div className="bg-[#070B16] border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-black text-white">Active VIP Members ({VIP_MEMBERS.length})</h3>

        <table className="w-full text-left text-xs font-medium text-slate-300">
          <thead className="bg-white/5 text-slate-400 uppercase tracking-wider text-[10px] font-black">
            <tr>
              <th className="p-3">Member Name & Email</th>
              <th className="p-3">Plan Type</th>
              <th className="p-3">Amount Paid</th>
              <th className="p-3">Joined Date</th>
              <th className="p-3">Renewal Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {VIP_MEMBERS.map((m) => (
              <tr key={m.id} className="hover:bg-white/5 transition-colors">
                <td className="p-3">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-amber-400" /> {m.name}
                  </div>
                  <div className="text-[10px] text-slate-400">{m.email}</div>
                </td>
                <td className="p-3 text-slate-300 font-bold">{m.plan}</td>
                <td className="p-3 font-black text-amber-400">{m.paid}</td>
                <td className="p-3 text-slate-400">{m.joined}</td>
                <td className="p-3 text-slate-400">{m.expires}</td>
                <td className="p-3">
                  <span className="text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full uppercase">
                    {m.status} VIP
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
