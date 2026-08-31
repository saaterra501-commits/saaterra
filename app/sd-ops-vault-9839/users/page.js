'use client';

import { useState, useEffect } from 'react';
import { Users, Search, RefreshCw, ShieldCheck, Mail, Calendar, UserCheck } from 'lucide-react';

export default function AdminUsersDirectoryPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data?.success && Array.isArray(data.users)) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#2475FF]" /> Registered Users & Agency Accounts
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Live directory of all signed-up Indian agency founders, buyers, and admin accounts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl border border-white/10 transition-colors cursor-pointer"
            title="Refresh Users"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/15 text-white text-xs font-bold rounded-xl focus:outline-none focus:border-[#2475FF]"
            />
          </div>
        </div>
      </div>

      {/* Users Table Card */}
      <div className="bg-[#070B16] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-white">
            All Registered Accounts ({filteredUsers.length})
          </h3>
          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            ● Live MongoDB Sync
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-500 text-xs animate-pulse">
            Loading registered users from database...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-12 text-center space-y-3 bg-white/[0.02] border border-white/5 rounded-2xl">
            <Users className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">No registered accounts found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              When users sign up via Google OAuth or Email Login on <strong>/signup</strong>, their accounts will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium text-slate-300">
              <thead className="bg-white/5 text-slate-400 uppercase tracking-wider text-[10px] font-black">
                <tr>
                  <th className="p-3 rounded-l-xl">User Profile</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Role & Access</th>
                  <th className="p-3">Plus VIP Status</th>
                  <th className="p-3 rounded-r-xl">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((u) => {
                  const isAdmin = u.role === 'admin' || u.email?.toLowerCase() === 'ujjawal@stackdeal.in';
                  return (
                    <tr key={u._id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#FF6B35] text-white flex items-center justify-center font-black text-xs shrink-0">
                            {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-white">{u.name || 'Unnamed User'}</div>
                            <div className="text-[10px] text-slate-500 font-mono">ID: {u._id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          <span>{u.email}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black bg-amber-500/20 text-[#FFD519] border border-amber-500/30 px-2.5 py-0.5 rounded-full uppercase">
                            <ShieldCheck className="w-3 h-3" /> Super Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black bg-blue-500/15 text-blue-300 border border-blue-500/30 px-2.5 py-0.5 rounded-full uppercase">
                            <UserCheck className="w-3 h-3" /> Agency Buyer
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        {u.isPlusMember ? (
                          <span className="text-[10px] font-black bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md uppercase">
                            ⭐ Plus VIP
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-bold">Standard</span>
                        )}
                      </td>
                      <td className="p-3 text-slate-400 font-mono text-[11px]">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'Recent'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
