'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import {
  Sparkles, ShieldCheck, Zap, TrendingUp, Users, ArrowRight,
  CheckCircle2, HeartHandshake, Award, FileText, Globe, Building2
} from 'lucide-react';
import StackDealLogo from '@/components/StackDealLogo';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F6F7FB] flex flex-col font-sans text-slate-900">
      <Navbar />

      {/* Top StackDeal Orange Ribbon */}
      <div className="w-full bg-[#FF6B35] text-white py-2 overflow-hidden shadow-xs relative z-20">
        <div className="ticker-wrapper flex whitespace-nowrap">
          <div className="ticker-inner flex items-center gap-8 animate-ticker text-[11px] font-black uppercase tracking-wider">
            {[1, 2, 3, 4].map((_, i) => (
              <span key={i} className="inline-flex items-center gap-8">
                <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-amber-300" /> India's Premier B2B SaaS Discovery Platform</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> 100% Direct INR Checkout & UPI Payments</span>
                <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-blue-200" /> Automated B2B GST Tax Invoicing</span>
                <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-yellow-300" /> 5-Year Software Passes</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1">
        {/* Mint Hero Header */}
        <section className="bg-[#E6F9EE] text-slate-900 py-16 sm:py-20 px-4 sm:px-6 relative z-10 border-b border-emerald-100">
          <div className="max-w-4xl mx-auto text-center space-y-5">
            <span className="inline-flex items-center gap-1.5 bg-[#0A0F1E] text-amber-300 text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> About StackDeal India
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 leading-tight">
              Empowering Indian Digital Agencies with 5-Year Software Passes
            </h1>
            <p className="text-slate-700 text-sm sm:text-base font-medium max-w-2xl mx-auto leading-relaxed">
              We started StackDeal with one clear mission: eliminate the painful monthly subscription fatigue and foreign USD currency fees that hold back Indian agencies, founders, and creators.
            </p>
          </div>
        </section>

        {/* Core Mission & Story Section */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-16">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs font-black uppercase text-[#2475FF] tracking-wider">
                Our Story & Vision
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 leading-snug">
                Why We Built an Indian-First SaaS Marketplace
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                For years, Indian digital marketers and agency owners were forced to buy essential tools from US-based foreign websites. This meant paying in USD, suffering 3.5%–4% bank currency conversion charges, and never receiving an Indian GST invoice for input tax credit.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                StackDeal solves this by providing a localized, premium marketplace where digital agencies can discover, evaluate, and purchase curated 5-Year Passes on cutting-edge WhatsApp automation, AI SEO, and CRM tools directly in ₹ INR via UPI.
              </p>
            </div>

            {/* Metric Highlights Box */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Agency Savings', value: '₹2.4 Cr+', sub: 'Saved vs monthly plans', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
                { label: 'Community', value: '50,000+', sub: 'Indian founders & agencies', color: 'text-[#2475FF]', bg: 'bg-blue-50 border-blue-100' },
                { label: 'Verified Tools', value: '150+', sub: '7-step quality audited', color: 'text-[#FF6B35]', bg: 'bg-orange-50 border-orange-100' },
                { label: 'Satisfaction', value: '99.4%', sub: 'Verified 5-star reviews', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
              ].map((m) => (
                <div key={m.label} className={`p-5 rounded-3xl border ${m.bg} space-y-1`}>
                  <div className={`text-2xl sm:text-3xl font-black ${m.color}`}>{m.value}</div>
                  <div className="text-xs font-black text-slate-900">{m.label}</div>
                  <div className="text-[10px] text-slate-500 font-medium">{m.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 4 Core Pillars */}
          <div className="space-y-8">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-xs font-black uppercase text-[#FF6B35] tracking-wider">
                The StackDeal Standard
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
                Built on 4 Unshakeable Pillars
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Zap,
                  title: '5-Year Access Passes',
                  desc: 'Pay once upfront and use premium software for 5 full years. No hidden recurring charges.',
                  color: 'text-amber-500',
                  bg: 'bg-amber-50'
                },
                {
                  icon: ShieldCheck,
                  title: '100% Direct INR via UPI',
                  desc: 'Pay directly via PhonePe, GPay, Paytm, or Cards with zero foreign exchange currency markup.',
                  color: 'text-emerald-500',
                  bg: 'bg-emerald-50'
                },
                {
                  icon: FileText,
                  title: 'B2B GST Invoicing',
                  desc: 'Automated 18% GST tax invoices with your company GSTIN for direct chartered accountant credit.',
                  color: 'text-blue-500',
                  bg: 'bg-blue-50'
                },
                {
                  icon: HeartHandshake,
                  title: '70/30 Founder Payouts',
                  desc: 'We support bootstrapped SaaS founders with transparent 70% revenue share and bi-weekly payouts.',
                  color: 'text-purple-500',
                  bg: 'bg-purple-50'
                }
              ].map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.title} className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-3 shadow-xs hover:shadow-md transition-all">
                    <div className={`w-10 h-10 rounded-2xl ${p.bg} flex items-center justify-center ${p.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-black text-slate-950">{p.title}</h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{p.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Banner */}
          <div className="bg-gradient-to-br from-[#0A0F1E] via-[#11192E] to-[#1E293B] text-white p-8 sm:p-12 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left max-w-md">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                Ready to Upgrade Your Agency Stack?
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Explore Verified 5-Year Deals Today
              </h3>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                Save 90%+ on top-rated WhatsApp bots, AI SEO software, and CRM suites with instant license activation.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <Link
                href="/deals"
                className="btn-primary px-6 py-3.5 text-xs font-black rounded-2xl shadow-lg flex items-center gap-2"
              >
                <span>Browse 5-Year Deals</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/submit"
                className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs font-black rounded-2xl border border-white/15 transition-all"
              >
                List Your SaaS
              </Link>
            </div>
          </div>

        </section>
      </main>

      <Footer />
    </div>
  );
}
