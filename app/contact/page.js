'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Mail,
  Clock,
  ShieldCheck,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MessageSquare,
  Copy,
  Check,
  Zap,
  Building,
  HelpCircle,
  Phone,
  ArrowRight,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'general', label: '❓ General Question', desc: 'Queries about how 5-Year passes work & account help' },
  { id: 'vendor_listing', label: '🤝 List My SaaS Tool', desc: 'SaaS Founders looking to launch on StackDeal' },
  { id: 'order_billing', label: '💳 Order & GST Invoice', desc: 'Help with Razorpay payments, downloads & GSTIN' },
  { id: 'refund_request', label: '🛡️ 60-Day Refund', desc: '100% hassle-free money-back guarantee request' },
  { id: 'technical_issue', label: '🐛 Technical Bug Report', desc: 'Issues with code redemption or license activation' },
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
    <div className="min-h-screen bg-[#F6F7FB] flex flex-col font-sans text-slate-900">
      <Navbar />

      {/* Top Gold & Orange Ticker Ribbon */}
      <div className="w-full bg-[#FF6B35] text-white py-2 overflow-hidden shadow-xs relative z-20">
        <div className="ticker-wrapper flex whitespace-nowrap">
          <div className="ticker-inner flex items-center gap-8 animate-ticker text-[11px] font-black uppercase tracking-wider">
            {[1, 2, 3, 4].map((_, i) => (
              <span key={i} className="inline-flex items-center gap-8">
                <span className="flex items-center gap-1.5"><span>⚡</span> Avg Response: Under 2 Hours</span>
                <span className="flex items-center gap-1.5"><span>🔒</span> Direct Founder Support</span>
                <span className="flex items-center gap-1.5"><span>✉️</span> hello@stackdeal.in</span>
                <span className="flex items-center gap-1.5"><span>🧾</span> 18% GST Invoices on Every Deal</span>
                <span className="flex items-center gap-1.5"><span>🇮🇳</span> Dedicated Indian Agency Desk</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Mint Header Hero */}
      <section className="bg-[#E6F9EE] py-12 px-4 sm:px-6 border-b border-emerald-200/70 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0A0F1E] text-amber-300 text-xs font-black uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Dedicated Support & Vendor Helpdesk</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            How can we <span className="text-[#2475FF]">help your agency?</span>
          </h1>

          <p className="text-slate-700 text-sm sm:text-base font-medium max-w-2xl mx-auto leading-relaxed">
            Have a question about a 5-Year Pass, need GST invoice assistance, or want to list your SaaS tool?
            Fill out the form below or reach our founders directly at <strong className="text-slate-950 font-bold">hello@stackdeal.in</strong>.
          </p>
        </div>
      </section>

      {/* Main Form & Info Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Primary Channel Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
              <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#2475FF]" />
                <span>Direct Contact Channels</span>
              </h2>

              <div className="space-y-3.5">
                
                {/* Email Support */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-[#2475FF]/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-[#2475FF]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider">General & Agency Support</div>
                    <a
                      href="mailto:hello@stackdeal.in"
                      className="text-sm font-black text-slate-900 hover:text-[#2475FF] transition-colors block mt-0.5"
                    >
                      hello@stackdeal.in
                    </a>
                    <div className="text-[11px] text-slate-500 mt-0.5">Average reply time: &lt; 2 hours</div>
                  </div>
                </div>

                {/* Founder Desk */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-amber-500/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center shrink-0 text-amber-600">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider">SaaS Founder Partnerships</div>
                    <Link
                      href="/submit"
                      className="text-sm font-black text-slate-900 hover:text-amber-600 transition-colors block mt-0.5"
                    >
                      List Your SaaS Tool ➔
                    </Link>
                    <div className="text-[11px] text-slate-500 mt-0.5">70% revenue share with UPI payouts</div>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Support Timings</div>
                    <div className="text-sm font-black text-slate-900 mt-0.5">Mon – Sat : 9:30 AM – 8:00 PM IST</div>
                    <div className="text-[11px] text-emerald-600 font-bold mt-0.5 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Active & Responding Live
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
              
              {status.type === 'success' ? (
                <div className="text-center py-10 px-4 animate-fadeIn space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-slate-950">Inquiry Received Successfully!</h3>
                    <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                      {status.message}
                    </p>
                  </div>

                  {status.ticketId && (
                    <div className="inline-flex items-center gap-3 bg-slate-50 border border-slate-200 px-5 py-3 rounded-2xl">
                      <div className="text-left">
                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Support Ticket ID</div>
                        <div className="text-base font-mono font-black text-[#2475FF]">{status.ticketId}</div>
                      </div>
                      <button
                        onClick={() => copyTicket(status.ticketId)}
                        className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="Copy Ticket ID"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  )}

                  <div>
                    <button
                      onClick={() => setStatus({ type: null, message: '', ticketId: null })}
                      className="btn-primary px-6 py-2.5 text-sm rounded-xl"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {status.type === 'error' && (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-3">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                      <span>{status.message}</span>
                    </div>
                  )}

                  {/* Category Pills */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2.5">
                      Select Inquiry Type <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, category: cat.id })}
                          className={`text-left px-3.5 py-2.5 rounded-2xl border text-xs font-medium transition-all cursor-pointer ${
                            formData.category === cat.id
                              ? 'bg-[#2475FF] border-[#2475FF] text-white shadow-sm'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className={`font-black ${formData.category === cat.id ? 'text-white' : 'text-slate-900'}`}>
                            {cat.label}
                          </div>
                          <div className={`text-[10px] mt-0.5 truncate ${formData.category === cat.id ? 'text-blue-100' : 'text-slate-500'}`}>
                            {cat.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Your Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#2475FF] focus:bg-white placeholder:text-slate-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Work Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. rahul@agency.in"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#2475FF] focus:bg-white placeholder:text-slate-400 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Phone & Subject Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        WhatsApp / Phone <span className="text-slate-400 text-[10px] font-normal">(Optional)</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#2475FF] focus:bg-white placeholder:text-slate-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Subject Line <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Brief summary of your inquiry"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#2475FF] focus:bg-white placeholder:text-slate-400 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Message Box */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Detailed Message / Query <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please explain how we can assist you with your 5-Year Pass, SaaS tool listing, or GST billing inquiry..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-900 focus:outline-none focus:border-[#2475FF] focus:bg-white placeholder:text-slate-400 transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
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

                  <div className="text-center text-[11px] text-slate-500 font-medium">
                    🔒 Handled directly by our Indian founder & support team.
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
