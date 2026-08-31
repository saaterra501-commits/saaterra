'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles, ShieldCheck, Zap, ArrowRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';

const FAQ_ITEMS = [
  {
    q: 'What is a 5-Year Access Pass on StackDeal?',
    a: 'A 5-Year Access Pass allows Indian digital agencies, SMBs, and freelancers to pay once upfront in ₹ INR and use premium software tools for 5 full years without paying recurring monthly subscription fees. This saves agency owners 85%–95% compared to standard monthly SaaS plans.'
  },
  {
    q: 'How is StackDeal different from foreign deal websites or monthly subscriptions?',
    a: 'Foreign platforms charge in USD ($) which incurs heavy 3.5%–4% bank currency conversion fees, requires international credit cards, and does not provide Indian GST tax invoices. StackDeal is built specifically for India: direct UPI/Card checkout via Razorpay in INR, zero forex markups, automated B2B GST tax invoices, and localized customer support.'
  },
  {
    q: 'How do I redeem my software license code after purchasing?',
    a: 'Immediately after completing your payment via UPI or Cards, your unique redemption license code is generated and displayed on your screen, sent to your registered email, and permanently saved in your StackDeal Profile dashboard under "My 5-Year Passes". You simply copy the code and enter it on the vendor’s software website.'
  },
  {
    q: 'Can I get a B2B GST Tax Invoice with my company’s GSTIN?',
    a: 'Yes, 100%! During checkout, you can enter your company’s 15-digit GSTIN number. StackDeal automatically generates an official GST-compliant tax invoice that your chartered accountant (CA) can use to claim 18% Input Tax Credit (ITC).'
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major Indian payment methods through our secure Razorpay gateway: Instant UPI (Google Pay, PhonePe, Paytm, BHIM, CRED), Indian Debit/Credit Cards (Visa, Mastercard, RuPay), NetBanking from 50+ Indian banks, and Business Corporate Cards.'
  },
  {
    q: 'How does StackDeal ensure software quality & reliability?',
    a: 'Every SaaS deal listed on StackDeal undergoes a rigorous 7-step quality audit: API uptime verification, feature stability testing, founder background checks, data privacy compliance, and multi-tier stress tests before being approved for public launch.'
  },
  {
    q: 'I am a SaaS founder. How can I launch my software on StackDeal?',
    a: 'We welcome Indian and global B2B SaaS creators! You can submit your software for review on our Vendor Portal at /submit. We provide 70% revenue share, automated bi-weekly payouts, zero listing fees, and direct access to 50,000+ Indian agency founders.'
  }
];

export default function HomeFAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  const toggle = (idx) => {
    setOpenIdx((prev) => (prev === idx ? -1 : idx));
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto w-full font-sans">
      {/* Schema.org FAQPage for Google SEO Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Header */}
      <div className="text-center space-y-3 mb-12">
        <span className="inline-flex items-center gap-1.5 bg-[#EEF4FF] text-[#2475FF] text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
        </span>
        <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-950">
          Everything You Need to Know About StackDeal
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm font-medium max-w-xl mx-auto leading-relaxed">
          Clear answers about our 5-Year SaaS Passes, instant UPI payments, GST invoices, and redemption process.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3 max-w-3xl mx-auto">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-white border-blue-200 shadow-md shadow-blue-500/5'
                  : 'bg-white/80 hover:bg-white border-slate-200/90'
              }`}
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
              >
                <span className={`text-sm sm:text-base font-bold ${isOpen ? 'text-[#2475FF]' : 'text-slate-900'}`}>
                  {item.q}
                </span>
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? 'bg-blue-50 text-[#2475FF] rotate-180' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium animate-fadeIn border-t border-slate-100/80 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Help Box */}
      <div className="mt-10 max-w-3xl mx-auto bg-gradient-to-r from-[#0A0F1E] to-[#171E36] text-white p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-sm font-black text-white flex items-center justify-center sm:justify-start gap-2">
            <span>Have more questions?</span>
            <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">
              Support 24/7
            </span>
          </div>
          <p className="text-xs text-slate-300 font-medium">
            Our team in India is ready to assist with any software pass inquiry.
          </p>
        </div>

        <Link
          href="/contact"
          className="px-5 py-2.5 bg-[#FF6B35] hover:bg-[#E85A24] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Contact Support</span>
        </Link>
      </div>
    </section>
  );
}
