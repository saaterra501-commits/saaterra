import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Check, X, Sparkles, Flame, ShieldCheck, Zap, ArrowRight, Star,
  HelpCircle, CreditCard, Building2, TrendingUp, DollarSign, Layers,
  CheckCircle2, XCircle, ArrowUpRight
} from 'lucide-react';

export const metadata: Metadata = {
  title: "AppSumo Alternative in India: 5-Year SaaS Passes with UPI & GST | StackDeal",
  description:
    "Looking for an AppSumo alternative in India? StackDeal offers curated 5-Year B2B SaaS passes in INR with instant UPI checkout, official 18% GST B2B tax invoices, and a 70% revenue share for software creators.",
  keywords: [
    "AppSumo alternative India",
    "AppSumo alternative",
    "AppSumo India",
    "SaaS deals India",
    "B2B software lifetime deals India",
    "5-Year SaaS pass India",
    "SaaS deals UPI",
    "AppSumo GST invoice",
    "Indian agency SaaS discounts",
    "StackDeal India"
  ],
  alternates: {
    canonical: "https://www.stackdeal.in/appsumo-alternative-india",
  },
  openGraph: {
    title: "AppSumo Alternative in India: 5-Year SaaS Passes with UPI & GST | StackDeal",
    description:
      "Save 90%+ on essential B2B SaaS without USD credit card failures, 3.5% forex loss, or missing GST invoices. Curated for 1.5M+ Indian digital agencies.",
    url: "https://www.stackdeal.in/appsumo-alternative-india",
    siteName: "StackDeal",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/stackdeal-logo.png",
        width: 1200,
        height: 630,
        alt: "StackDeal — The AppSumo Alternative in India",
      },
    ],
  },
};

const comparisonData = [
  {
    feature: "Pricing Currency",
    appsumo: "US Dollars ($49 – $299)",
    stackdeal: "Indian Rupees (₹1,499 – ₹9,999)",
    winner: "stackdeal",
    highlight: "Transparent INR pricing with zero FX fluctuations"
  },
  {
    feature: "Indian Payment Rails (UPI)",
    appsumo: "No UPI. Credit/Debit Cards only",
    stackdeal: "1-Click PhonePe, Google Pay, Paytm, BHIM & RuPay",
    winner: "stackdeal",
    highlight: "Zero card mandate failures or OTP drop-offs"
  },
  {
    feature: "Card Mandate Failure Rate (RBI)",
    appsumo: "Over 70% failure on recurring debits",
    stackdeal: "0% Mandate Failure (1-Time UPI Pass)",
    winner: "stackdeal",
    highlight: "Smooth one-time domestic payment verification"
  },
  {
    feature: "18% GST B2B Tax Invoice",
    appsumo: "Foreign US Invoice (0% Indian Tax Credit)",
    stackdeal: "Automated GSTIN Tax Invoice (SAC 998313)",
    winner: "stackdeal",
    highlight: "Registered businesses claim 100% Input Tax Credit (ITC)"
  },
  {
    feature: "Bank Forex Markup Loss",
    appsumo: "3.5% Forex fee + 18% equalisation levy",
    stackdeal: "₹0 Zero Forex Fee (100% Domestic INR)",
    winner: "stackdeal",
    highlight: "Save hundreds per purchase in hidden card fees"
  },
  {
    feature: "Software Creator Revenue Share",
    appsumo: "Takes up to 70% (Founder gets only 30%)",
    stackdeal: "Creator Keeps 70% (StackDeal takes only 30%)",
    winner: "stackdeal",
    highlight: "Attracts top-tier, committed software founders"
  },
  {
    feature: "Sustainable Deal Horizon",
    appsumo: "Uncapped lifetime (frequently abandoned)",
    stackdeal: "Guaranteed 5-Year Access Passes",
    winner: "stackdeal",
    highlight: "Ensures software remains funded & actively updated"
  },
  {
    feature: "Targeted Product Curation",
    appsumo: "Generic Western consumer & B2C tools",
    stackdeal: "Indian Agency Stack (WhatsApp, GEO SEO, Scrapers)",
    winner: "stackdeal",
    highlight: "Built for Indian digital marketing & client retainers"
  },
  {
    feature: "AI SaaS Stack Matchmaking",
    appsumo: "Basic keyword & category browsing",
    stackdeal: "Built-in Groq Llama 3.3 AI Matchmaker (3s inference)",
    winner: "stackdeal",
    highlight: "Tailors custom 3-tool software stack to your niche"
  },
  {
    feature: "Risk-Free Guarantee",
    appsumo: "60-Day Money Back",
    stackdeal: "60-Day Unconditional Money Back",
    winner: "tie",
    highlight: "Zero-risk testing window for every purchase"
  }
];

const faqs = [
  {
    q: "Why is StackDeal called the Indian alternative to AppSumo?",
    a: "AppSumo is built primarily for the US and European markets, charging exclusively in US Dollars. In India, over 70% of credit cards fail on international recurring mandates, banks charge a 3.5% forex markup, and foreign invoices cannot be claimed for 18% GST Input Tax Credit. StackDeal was engineered specifically for India: 100% INR pricing, 1-click UPI checkout (GPay, PhonePe), automated GST B2B tax invoices, and an industry-leading 70% revenue share for software creators."
  },
  {
    q: "What is the difference between a 5-Year Pass and an AppSumo Lifetime Deal?",
    a: "True 'Lifetime Deals' (LTDs) on global platforms frequently lead to tool abandonment after 12–18 months because server hosting, OpenAI/Claude API tokens, and development maintenance cost money. StackDeal's 5-Year Access Pass gives agencies a massive 92%+ cost reduction (saving lakhs of rupees) while ensuring the software creator remains financially viable and committed to pushing updates for 5 full years."
  },
  {
    q: "Can I pay using PhonePe, Google Pay, or Paytm on StackDeal?",
    a: "Yes. StackDeal is integrated with Razorpay's domestic payment infrastructure. You can check out in under 10 seconds using any UPI app, RuPay card, net banking, or domestic debit/credit card without international activation."
  },
  {
    q: "How does the 18% GST B2B invoice work on StackDeal?",
    a: "During checkout, you simply enter your company name and GSTIN. As soon as your payment is confirmed, a compliant B2B tax invoice with official SAC code 998313 (IT Software Services) is generated dynamically and saved in your dashboard for instant download and Input Tax Credit (ITC) tax filing."
  },
  {
    q: "Why do SaaS creators prefer StackDeal's 70% revenue share?",
    a: "AppSumo typically takes up to 70% of gross revenue, leaving indie developers with just 30%, which barely covers server bills. StackDeal flips this equation: 70% goes directly to the software creator and StackDeal retains only 30%. This gives founders upfront, non-dilutive liquidity and zero-CAC distribution to 10,000+ Indian agencies."
  },
  {
    q: "What if a tool purchased on StackDeal doesn't suit my agency?",
    a: "Every tool on StackDeal is backed by our strict 60-Day Money-Back Guarantee. If you test a tool and find it does not integrate with your workflow, you can request an unconditional refund within 60 days directly from your dashboard."
  }
];

export default function AppSumoAlternativePage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 selection:bg-orange-500 selection:text-white">
      {/* Schema.org FAQ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-gradient-to-b from-orange-50/60 via-white to-[#F8FAFC] border-b border-slate-200/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
            
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-[#FF6B35] text-xs font-black uppercase tracking-wider shadow-xs">
              <span className="text-sm">🇮🇳</span>
              <span>The Dedicated Indian Alternative to AppSumo</span>
            </div>

            {/* Main H1 */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.15] max-w-4xl mx-auto">
              Why Indian Digital Agencies Are Switching From{' '}
              <span className="text-slate-400 line-through decoration-red-500 decoration-3">AppSumo</span>{' '}
              to <span className="bg-gradient-to-r from-[#FF6B35] to-orange-600 bg-clip-text text-transparent">StackDeal</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
              Say goodbye to USD credit card failure rates, 3.5% foreign exchange fees, and missing GST tax deductions. 
              Get curated <strong>5-Year SaaS Passes</strong> in Indian Rupees with <strong>instant UPI checkout</strong> and verified <strong>18% GST B2B tax invoices</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                href="/deals"
                className="w-full sm:w-auto px-8 py-4 bg-[#FF6B35] hover:bg-[#E85A24] text-white font-black text-sm rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Flame className="w-4 h-4 fill-white" />
                <span>Explore Active 5-Year Passes</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/submit"
                className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Submit Your SaaS (70% Rev-Share)</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>

            {/* 4 Trust Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-8 max-w-4xl mx-auto">
              <div className="bg-white border border-slate-200 rounded-2xl p-3.5 text-center shadow-xs">
                <div className="text-xl font-black text-[#FF6B35]">₹0 Forex Loss</div>
                <div className="text-[11px] font-bold text-slate-600 mt-0.5">Pay in INR via UPI</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-3.5 text-center shadow-xs">
                <div className="text-xl font-black text-emerald-600">18% GST ITC</div>
                <div className="text-[11px] font-bold text-slate-600 mt-0.5">Official B2B Tax Invoices</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-3.5 text-center shadow-xs">
                <div className="text-xl font-black text-indigo-600">70% to Creators</div>
                <div className="text-[11px] font-bold text-slate-600 mt-0.5">vs AppSumo's 30% Cut</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-3.5 text-center shadow-xs">
                <div className="text-xl font-black text-amber-600">60-Day Shield</div>
                <div className="text-[11px] font-bold text-slate-600 mt-0.5">100% Money-Back</div>
              </div>
            </div>

          </div>
        </section>

        {/* COMPARISON MATRIX TABLE SECTION */}
        <section className="py-16 lg:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-[#FF6B35] bg-orange-100/60 px-3 py-1 rounded-full border border-orange-200">
              Direct Feature Comparison
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              AppSumo vs. StackDeal: Which is Better for India?
            </h2>
            <p className="text-sm text-slate-600 font-medium max-w-xl mx-auto">
              Compare side-by-side why StackDeal is engineered specifically to protect Indian buyers and empower SaaS founders.
            </p>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-900 text-white">
                    <th className="p-4 sm:p-5 text-xs sm:text-sm font-black uppercase tracking-wider w-1/3">
                      Core Evaluation Criteria
                    </th>
                    <th className="p-4 sm:p-5 text-xs sm:text-sm font-black uppercase tracking-wider w-1/3 bg-slate-800 text-slate-300">
                      AppSumo (Global Model)
                    </th>
                    <th className="p-4 sm:p-5 text-xs sm:text-sm font-black uppercase tracking-wider w-1/3 bg-[#FF6B35] text-white">
                      StackDeal (India Model) 🇮🇳
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {comparisonData.map((item, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                      <td className="p-4 sm:p-5 font-bold text-slate-900">
                        <div>{item.feature}</div>
                        <div className="text-[11px] font-normal text-slate-500 mt-0.5">{item.highlight}</div>
                      </td>
                      <td className="p-4 sm:p-5 text-slate-600 font-medium bg-slate-50/30">
                        <div className="flex items-start gap-2">
                          {item.winner === "stackdeal" ? (
                            <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          )}
                          <span>{item.appsumo}</span>
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 text-slate-950 font-bold bg-orange-50/20">
                        <div className="flex items-start gap-2 text-slate-900">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className={item.winner === "stackdeal" ? "text-slate-950 font-black" : ""}>
                            {item.stackdeal}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 3 CORE PILLARS WHY AGENCIES PROFIT */}
        <section className="py-16 bg-white border-y border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Economic Advantage
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
                The 3 Big Reasons Indian Agencies Choose StackDeal
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#FF6B35] flex items-center justify-center font-black">
                  <DollarSign className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900">No Dollar Bleed or Mandates</h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  US Dollar subscriptions force Indian agencies to pay 3.5% foreign exchange markups and risk recurring card debit failures every month. With StackDeal, you pay once via UPI and stay secure for 5 full years.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Official 18% GST Invoicing</h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Foreign platforms like AppSumo cannot issue Indian GST invoices. StackDeal dynamically generates formal tax receipts with SAC 998313, allowing your business to claim full Input Tax Credit (ITC).
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Curated for Indian Workflows</h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Western deal platforms focus on B2C writing tools. StackDeal curates high-ROI tools tailored for Indian agencies: WhatsApp Meta Cloud API bots, Google Maps lead scrapers, and local SEO engines.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED DEALS SECTION */}
        <section className="py-16 lg:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#FF6B35]">
                Live 5-Year Passes
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
                Active B2B SaaS Passes on StackDeal
              </h2>
            </div>
            <Link
              href="/deals"
              className="inline-flex items-center gap-1.5 text-xs font-black text-[#FF6B35] hover:text-orange-700 transition-colors"
            >
              <span>View All 50+ SaaS Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Deal 1 */}
            <Link
              href="/deals/chat-chacha"
              className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/5 transition-all group block"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
                  Save 96%
                </span>
                <span className="text-xs font-bold text-slate-500">5-Year Pass</span>
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 group-hover:text-[#FF6B35] transition-colors">
                  ChatChaCha
                </h3>
                <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1">
                  Official WhatsApp Cloud API bulk messaging, automated chatbots & live team inbox.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 line-through">₹1,44,000</div>
                  <div className="text-lg font-black text-slate-950">₹4,999</div>
                </div>
                <span className="text-xs font-black text-[#FF6B35] group-hover:translate-x-1 transition-transform">
                  View Pass →
                </span>
              </div>
            </Link>

            {/* Deal 2 */}
            <Link
              href="/deals/scrapeking-ai"
              className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/5 transition-all group block"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
                  Save 97%
                </span>
                <span className="text-xs font-bold text-slate-500">5-Year Pass</span>
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 group-hover:text-[#FF6B35] transition-colors">
                  ScrapeKing AI
                </h3>
                <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1">
                  Google Maps B2B lead extractor with verified mobile numbers and instant Excel export.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 line-through">₹1,80,000</div>
                  <div className="text-lg font-black text-slate-950">₹5,999</div>
                </div>
                <span className="text-xs font-black text-[#FF6B35] group-hover:translate-x-1 transition-transform">
                  View Pass →
                </span>
              </div>
            </Link>

            {/* Deal 3 */}
            <Link
              href="/deals/rankrocket-geo"
              className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/5 transition-all group block"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
                  Save 97%
                </span>
                <span className="text-xs font-bold text-slate-500">5-Year Pass</span>
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 group-hover:text-[#FF6B35] transition-colors">
                  RankRocket GEO
                </h3>
                <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1">
                  Generative Engine Optimization (GEO) & AI search ranking tracker for ChatGPT & Perplexity.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 line-through">₹2,10,000</div>
                  <div className="text-lg font-black text-slate-950">₹6,499</div>
                </div>
                <span className="text-xs font-black text-[#FF6B35] group-hover:translate-x-1 transition-transform">
                  View Pass →
                </span>
              </div>
            </Link>

            {/* Deal 4 */}
            <Link
              href="/deals/omnicrm-suite"
              className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/5 transition-all group block"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
                  Save 96%
                </span>
                <span className="text-xs font-bold text-slate-500">5-Year Pass</span>
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 group-hover:text-[#FF6B35] transition-colors">
                  OmniCRM Suite
                </h3>
                <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1">
                  Full agency sales pipeline, automated client onboarding, and automated GST billing.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 line-through">₹1,20,000</div>
                  <div className="text-lg font-black text-slate-950">₹3,999</div>
                </div>
                <span className="text-xs font-black text-[#FF6B35] group-hover:translate-x-1 transition-transform">
                  View Pass →
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* FAQ ACCORDION SECTION */}
        <section className="py-16 lg:py-24 bg-slate-50 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#FF6B35]">
                Frequently Asked Questions
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
                Everything You Need to Know About StackDeal vs AppSumo
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-2"
                >
                  <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-start gap-2.5">
                    <HelpCircle className="w-5 h-5 text-[#FF6B35] shrink-0 mt-0.5" />
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed pl-7">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BOTTOM CTA BANNER */}
        <section className="py-16 bg-slate-950 text-white text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-black uppercase tracking-wider bg-orange-500/20 text-[#FF6B35] px-3 py-1 rounded-full border border-orange-500/30">
              Ready to Upgrade Your Agency Stack?
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Save Lakhs on Essential B2B Software with Instant UPI & GST Invoices.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-xl mx-auto">
              Join thousands of Indian agencies, marketing consultants, and SaaS builders already growing on StackDeal.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/deals"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#FF6B35] hover:bg-[#E85A24] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all"
              >
                Browse All 5-Year Passes
              </Link>
              <Link
                href="/submit"
                className="w-full sm:w-auto px-7 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all"
              >
                List Your Software on StackDeal
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
