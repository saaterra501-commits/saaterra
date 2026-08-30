'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Mail,
  Phone,
  Clock,
  ShieldCheck,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MessageSquare,
  HelpCircle,
  Copy,
  Check,
  ArrowRight,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'general', label: '❓ General Question', desc: 'Queries about how StackDeal 5-Year passes work' },
  { id: 'vendor_listing', label: '🤝 List My SaaS Tool', desc: 'Founders looking to launch on StackDeal' },
  { id: 'order_billing', label: '💳 Order & GST Invoice', desc: 'Assistance with payments, downloads & GSTIN' },
  { id: 'refund_request', label: '🛡️ 60-Day Refund', desc: 'Hassle-free money-back guarantee request' },
  { id: 'technical_issue', label: '🐛 Technical / Bug Report', desc: 'Issues with code redemption or dashboard' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'general',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({
    type: null,
    message: '',
    ticketId: null,
  });
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '', ticketId: null });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit message. Please try again.');
      }

      setStatus({
        type: 'success',
        message: data.message || 'Your inquiry has been submitted successfully!',
        ticketId: data.ticketId,
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        category: 'general',
        subject: '',
        message: '',
      });
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message || 'Something went wrong. Please email hello@stackdeal.in directly.',
        ticketId: null,
      });
    } finally {
      setLoading(false);
    }
  };

  const copyTicket = (id) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col selection:bg-[#2475FF]/30">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dedicated Agency & Founder Support Desk</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            How can we <span className="text-[#FFD519]">help you today?</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-400 font-medium leading-relaxed">
            Have a question about a 5-Year Pass, need GST invoice assistance, or want to list your SaaS tool?
            Send us a message below or email us directly at <span className="text-amber-400 font-bold">hello@stackdeal.in</span>.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Primary Contact Card */}
            <div className="bg-[#0D1527] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#2475FF]/10 rounded-full blur-2xl pointer-events-none" />
              
              <h2 className="text-lg font-black text-white flex items-center gap-2.5">
                <MessageSquare className="w-5 h-5 text-[#2475FF]" />
                Direct Communication Channels
              </h2>
              
              <div className="mt-6 space-y-5">
                {/* Email 1 */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-amber-500/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">General & Support</div>
                    <a
                      href="mailto:hello@stackdeal.in"
                      className="text-sm font-bold text-white hover:text-amber-400 transition-colors block mt-0.5"
                    >
                      hello@stackdeal.in
                    </a>
                    <div className="text-[11px] text-slate-400 mt-0.5">Average reply time: Under 2 hours</div>
                  </div>
                </div>

                {/* Founder Desk */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-[#2475FF]/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-[#2475FF]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">SaaS Founder Partnerships</div>
                    <Link
                      href="/submit"
                      className="text-sm font-bold text-white hover:text-[#2475FF] transition-colors block mt-0.5"
                    >
                      List Your SaaS Tool ➔
                    </Link>
                    <div className="text-[11px] text-slate-400 mt-0.5">Earn 70% revenue share in INR</div>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Support Timings</div>
                    <div className="text-sm font-bold text-white mt-0.5">Mon – Sat : 9:30 AM – 8:00 PM IST</div>
                    <div className="text-[11px] text-emerald-400 font-medium mt-0.5">● Active & Responding Live</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 60-Day Guarantee Box */}
            <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900/60 border border-emerald-500/30 rounded-3xl p-6">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-emerald-300">100% 60-Day Money-Back Guarantee</h3>
                  <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">
                    If any 5-Year SaaS pass doesn't solve your agency workflow needs, just request a refund with your order ID. We process it via UPI instantly.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#0D1527] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
              
              {status.type === 'success' ? (
                <div className="text-center py-8 px-4 animate-fadeIn space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-white">Inquiry Received Successfully!</h3>
                    <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
                      {status.message}
                    </p>
                  </div>

                  {status.ticketId && (
                    <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl">
                      <div className="text-left">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Support Ticket ID</div>
                        <div className="text-sm font-mono font-black text-amber-400">{status.ticketId}</div>
                      </div>
                      <button
                        onClick={() => copyTicket(status.ticketId)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Copy Ticket ID"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  )}

                  <div>
                    <button
                      onClick={() => setStatus({ type: null, message: '' })}
                      className="btn-primary px-6 py-2.5 text-sm rounded-xl"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {status.type === 'error' && (
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-3">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{status.message}</span>
                    </div>
                  )}

                  {/* Category Pills */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5">
                      What is your inquiry regarding?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, category: cat.id })}
                          className={`text-left px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                            formData.category === cat.id
                              ? 'bg-[#2475FF]/20 border-[#2475FF] text-white shadow-lg'
                              : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:bg-white/5 hover:text-slate-200'
                          }`}
                        >
                          <div className="font-bold text-slate-200">{cat.label}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5 truncate">{cat.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Your Full Name <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#2475FF] placeholder:text-slate-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Work Email Address <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. rahul@agency.in"
                        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#2475FF] placeholder:text-slate-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Phone & Subject Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        WhatsApp / Phone <span className="text-slate-500 text-[10px] font-normal">(Optional)</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#2475FF] placeholder:text-slate-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Subject Line <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Brief summary of your question"
                        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#2475FF] placeholder:text-slate-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Message Box */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Detailed Message / Query <span className="text-amber-400">*</span>
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please explain how we can assist you with your 5-Year Pass, SaaS listing, or account..."
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#2475FF] placeholder:text-slate-500 transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-xl hover:shadow-blue-500/20 disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Submit Support Ticket</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center text-[11px] text-slate-400 font-medium">
                    🔒 All inquiries are encrypted & handled directly by our Indian support team.
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
