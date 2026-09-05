import mongoose from 'mongoose';

const SiteConfigSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'global_config',
    },
    announcement: {
      enabled: { type: Boolean, default: false },
      text: { type: String, default: '🔥 Launch Offer: Get instant 10% off with coupon code VIP10' },
      link: { type: String, default: '/deals' },
      badge: { type: String, default: 'NEW' },
      bgColor: { type: String, default: '#0F172A' },
      textColor: { type: String, default: '#FFFFFF' },
    },
    greenStrip: {
      enabled: { type: Boolean, default: true },
      isSlim: { type: Boolean, default: true },
      items: {
        type: [
          {
            text: { type: String, default: '' },
            icon: { type: String, default: '✓' },
          },
        ],
        default: [
          { text: '5-Year Access', icon: '✓' },
          { text: 'One-Time Payment', icon: '⚡' },
          { text: 'Business Deals', icon: '★' },
          { text: 'Save More', icon: '%' },
        ],
      },
    },
    promoBanner: {
      enabled: { type: Boolean, default: false },
      badge: { type: String, default: 'STACKDEAL PLUS' },
      title: { type: String, default: 'Save $350+/year on essential tools to grow your business' },
      subtitle: { type: String, default: 'Enjoy member-only perks that will help your business scale faster.' },
      price: { type: String, default: '$99' },
      priceSubtitle: { type: String, default: 'Annual membership' },
      buttonText: { type: String, default: 'Join StackDeal Plus' },
      buttonLink: { type: String, default: '/plus' },
    },
    seo: {
      googleVerification: { type: String, default: 'tjrhKK8lic4LxbLxJmyjnemqrwbHQh61k9zbqNeg5O0' },
      gaId: { type: String, default: '' },
      metaPixelId: { type: String, default: '' },
      siteTitle: { type: String, default: "StackDeal — India's #1 B2B SaaS 5-Year Deal Marketplace" },
      siteDescription: {
        type: String,
        default:
          "India's premier B2B software discovery marketplace. Get exclusive 5-Year Access Passes on WhatsApp automation, AI & GEO SEO, CRM, and Lead Scrapers.",
      },
    },
    faqs: {
      type: [
        {
          id: { type: String, default: '' },
          q: { type: String, required: true },
          a: { type: String, required: true },
          active: { type: Boolean, default: true },
        },
      ],
      default: [
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
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.SiteConfig || mongoose.model('SiteConfig', SiteConfigSchema);
