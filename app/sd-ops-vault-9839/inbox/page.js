'use client';

import { useState, useEffect } from 'react';
import {
  Mail,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  ExternalLink,
  Phone,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export default function AdminInboxPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/inbox');
      const data = await res.json();
      if (data?.success && Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error('Failed to load inbox messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = messages.filter((m) => {
    if (filter !== 'all' && m.category !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        m.name?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.subject?.toLowerCase().includes(q) ||
        m.ticketId?.toLowerCase().includes(q) ||
        m.message?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2.5">
            <Mail className="w-5 h-5 text-amber-400" />
            Support & SaaS Inquiries Inbox
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Real-time messages submitted via the public /contact form.
          </p>
        </div>

        <button
          onClick={fetchMessages}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Inbox</span>
        </button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by sender name, email, ticket ID, or keywords..."
            className="w-full bg-[#070B16] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Inquiries' },
            { id: 'vendor_listing', label: '🤝 SaaS Listings' },
            { id: 'order_billing', label: '💳 Billing & GST' },
            { id: 'refund_request', label: '🛡️ Refunds' },
            { id: 'general', label: '❓ General' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                filter === cat.id
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 text-xs animate-pulse">
          Loading support inbox from database...
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="bg-[#070B16] border border-white/10 rounded-2xl p-12 text-center space-y-3">
          <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No inquiries found</h3>
          <p className="text-xs text-slate-500">
            {search ? 'Try adjusting your search query.' : 'New inquiries from the website will appear here in real-time.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((m) => (
            <div
              key={m._id || m.ticketId}
              className="bg-[#070B16] border border-white/10 hover:border-white/20 rounded-2xl p-5 sm:p-6 transition-all space-y-4"
            >
              {/* Top Row: Ticket ID, Sender, Date */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-black text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-lg">
                    {m.ticketId}
                  </span>
                  <span className="text-sm font-black text-white">{m.name}</span>
                  <span className="text-xs text-slate-400 font-mono">({m.email})</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  {m.phone && (
                    <a
                      href={`https://wa.me/${m.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{m.phone} (WhatsApp)</span>
                    </a>
                  )}
                  <span className="text-slate-500">
                    {new Date(m.createdAt).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              {/* Subject & Category */}
              <div>
                <div className="inline-block text-[10px] font-black uppercase tracking-wider text-amber-300 bg-white/5 px-2 py-0.5 rounded mb-1.5">
                  Category: {m.category}
                </div>
                <h4 className="text-base font-bold text-white">{m.subject}</h4>
              </div>

              {/* Message Content */}
              <div className="bg-black/40 border border-white/5 rounded-xl p-4 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                {m.message}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500 font-medium">
                  IP: {m.ipAddress || 'Recorded'}
                </span>

                <a
                  href={`mailto:${m.email}?subject=Re: [Ticket ${m.ticketId}] ${encodeURIComponent(
                    m.subject
                  )}&body=Hi ${encodeURIComponent(
                    m.name
                  )},%0D%0A%0D%0AThank you for contacting StackDeal.%0D%0A%0D%0A`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2475FF] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-md"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Reply via Email ({m.email})</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
