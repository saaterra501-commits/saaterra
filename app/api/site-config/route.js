import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import SiteConfig from '@/models/SiteConfig';

export const dynamic = 'force-dynamic';

const DEFAULT_CONFIG = {
  announcement: {
    enabled: false,
    text: '🔥 Launch Offer: Get instant 10% off with coupon code VIP10',
    link: '/deals',
    badge: 'NEW',
    bgColor: '#0F172A',
    textColor: '#FFFFFF',
  },
  greenStrip: {
    enabled: true,
    isSlim: true,
    items: [
      { text: '5-Year Access', icon: '✓' },
      { text: 'One-Time Payment', icon: '⚡' },
      { text: 'Business Deals', icon: '★' },
      { text: 'Save More', icon: '%' },
    ],
  },
  promoBanner: {
    enabled: false,
    badge: 'STACKDEAL PLUS',
    title: 'Save $350+/year on essential tools to grow your business',
    subtitle: 'Enjoy member-only perks that will help your business scale faster.',
    price: '$99',
    priceSubtitle: 'Annual membership',
    buttonText: 'Join StackDeal Plus',
    buttonLink: '/plus',
  },
  seo: {
    googleVerification: 'tjrhKK8lic4LxbLxJmyjnemqrwbHQh61k9zbqNeg5O0',
    gaId: '',
    metaPixelId: '',
    siteTitle: "StackDeal — India's #1 B2B SaaS 5-Year Deal Marketplace",
    siteDescription: "India's premier B2B software discovery marketplace. Get exclusive 5-Year Access Passes on WhatsApp automation, AI & GEO SEO, CRM, and Lead Scrapers.",
  },
  faqs: [
    {
      id: 'faq-1',
      q: 'What is a 5-Year Access Pass on StackDeal?',
      a: 'A 5-Year Access Pass allows Indian digital agencies, SMBs, and freelancers to pay once upfront in ₹ INR and use premium software tools for 5 full years without paying recurring monthly subscription fees.',
      active: true,
    },
    {
      id: 'faq-2',
      q: 'How is StackDeal different from foreign deal websites or monthly subscriptions?',
      a: 'Foreign platforms charge in USD ($) with heavy forex bank fees and no Indian GST invoice. StackDeal provides direct UPI checkout via Razorpay, zero forex markups, and automated GST tax invoices.',
      active: true,
    },
    {
      id: 'faq-3',
      q: 'How do I redeem my software license code after purchasing?',
      a: 'Immediately after completing payment, your unique license redemption code is displayed on your screen, sent via email, and saved in your StackDeal Profile dashboard.',
      active: true,
    },
    {
      id: 'faq-4',
      q: 'Can I get a B2B GST Tax Invoice with my company’s GSTIN?',
      a: 'Yes, 100%! During checkout, you can enter your company’s 15-digit GSTIN number to claim 18% Input Tax Credit (ITC).',
      active: true,
    },
    {
      id: 'faq-5',
      q: 'What payment methods do you accept?',
      a: 'We accept all major Indian payment methods through Razorpay: Instant UPI (Google Pay, PhonePe, Paytm, CRED), Debit/Credit Cards, and NetBanking.',
      active: true,
    },
  ],
};

export async function GET() {
  try {
    await dbConnect();
    let config = await SiteConfig.findOne({ key: 'global_config' }).lean();

    if (!config) {
      // Create initial document
      try {
        config = await SiteConfig.create({ key: 'global_config', ...DEFAULT_CONFIG });
      } catch (e) {
        config = DEFAULT_CONFIG;
      }
    }

    return NextResponse.json({ success: true, config });
  } catch (err) {
    console.error('Error in /api/site-config:', err);
    return NextResponse.json({ success: true, config: DEFAULT_CONFIG });
  }
}
