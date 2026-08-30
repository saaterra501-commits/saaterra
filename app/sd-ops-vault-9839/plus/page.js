'use client';

import { useState, useEffect } from 'react';
import { Crown, Sparkles, ShieldCheck, User, Calendar, RefreshCw } from 'lucide-react';

export default function AdminPlusPage() {
  const [vipMembers, setVipMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlusMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/overview');
      const data = await res.json();
      if (data?.success && Array.isArray(data.vipMembers)) {
        setVipMembers(data.vipMembers);
      }
    } catch (e) {
      console.error('Failed to load VIP members:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlusMembers();
  }, []);

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between bg-white/5 border border-white/10 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" /> StackDeal Plus VIP Members
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Manage ₹999/yr VIP subscriptions, view active VIP members list, and configure extended privileges.
          </p>
        </div>

        <button
          onClick={fetchPlusMembers}
          className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl border border-white/10 transition-colors cursor-pointer"
          title="Refresh VIP Members"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="bg-[#070B16] border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-black text-white">Active VIP Members ({vipMembers.length})</h3>

        {loading ? (
          <div className="py-16 text-center text-slate-500 text-xs animate-pulse">
            Loading VIP members from database...
          </div>
        ) : vipMembers.length === 0 ? (
          <div className="py-12 text-center space-y-3 bg-white/[0.02] border border-white/5 rounded-2xl">
            <Crown className="w-10 h-10 text-amber-500/50 mx-auto" />
            <h4 className="text-sm font-bold text-white">No active Plus VIP subscribers yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              When agency founders subscribe to StackDeal Plus (₹999/yr), their VIP memberships and expiration dates will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                {vipMembers.map((m) => (
                  <tr key={m._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <Crown className="w-3.5 h-3.5 text-amber-400" /> {m.name}
                      </div>
                      <div className="text-[10px] text-slate-400">{m.email}</div>
                    </td>
                    <td className="p-3 text-slate-300 font-bold">{m.plusTier || '1 Year VIP Access'}</td>
                    <td className="p-3 font-black text-amber-400">₹999</td>
                    <td className="p-3 text-slate-400">
                      {new Date(m.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-3 text-slate-400">
                      {m.plusExpiresAt
                        ? new Date(m.plusExpiresAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'Active'}
                    </td>
                    <td className="p-3">
                      <span className="text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full uppercase">
                        ACTIVE VIP
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
