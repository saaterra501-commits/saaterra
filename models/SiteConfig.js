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
    categories: {
      type: [
        {
          id: { type: String },
          name: { type: String, required: true },
          slug: { type: String },
          description: { type: String, default: '' },
          themeColor: { type: String, default: '#FF6B35' },
          icon: { type: String, default: 'Zap' },
          active: { type: Boolean, default: true },
          order: { type: Number, default: 0 },
        },
      ],
      default: [
        { id: 'cat-1', name: 'WhatsApp Bots', slug: 'whatsapp-bots', description: 'WhatsApp marketing & bots', themeColor: '#25D366', icon: 'MessageSquare', active: true, order: 1 },
        { id: 'cat-2', name: 'AI & GEO SEO', slug: 'ai-geo-seo', description: 'AI search & keyword tools', themeColor: '#8B5CF6', icon: 'Sparkles', active: true, order: 2 },
        { id: 'cat-3', name: 'Lead Scrapers', slug: 'lead-scrapers', description: 'B2B leads & data extractors', themeColor: '#0284C7', icon: 'Target', active: true, order: 3 },
        { id: 'cat-4', name: 'CRM & Sales', slug: 'crm-sales', description: 'Sales pipelines & CRM', themeColor: '#FF6B35', icon: 'BarChart3', active: true, order: 4 },
        { id: 'cat-5', name: 'Video & Design', slug: 'video-design', description: 'AI video & design creators', themeColor: '#EC4899', icon: 'Video', active: true, order: 5 },
        { id: 'cat-6', name: 'Email Marketing', slug: 'email-marketing', description: 'Cold email & newsletters', themeColor: '#6366F1', icon: 'Mail', active: true, order: 6 },
        { id: 'cat-7', name: 'Developer Tools', slug: 'developer-tools', description: 'APIs & developer utilities', themeColor: '#0F172A', icon: 'Code', active: true, order: 7 },
        { id: 'cat-8', name: 'Analytics', slug: 'analytics', description: 'Website traffic & reports', themeColor: '#0D9488', icon: 'TrendingUp', active: true, order: 8 },
      ],
    },
    topCategories: {
      type: [
        {
          id: { type: String },
          name: { type: String, required: true },
          categoryKey: { type: String, required: true },
          image: { type: String, default: '' },
          isMostPopular: { type: Boolean, default: false },
          order: { type: Number, default: 0 },
          active: { type: Boolean, default: true },
        },
      ],
      default: [
        { id: 'top-1', name: 'Most Popular', categoryKey: 'All', isMostPopular: true, order: 1, active: true },
        { id: 'top-2', name: 'WhatsApp Bots', categoryKey: 'WhatsApp Bots', image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=300&h=300&q=80', isMostPopular: false, order: 2, active: true },
        { id: 'top-3', name: 'AI & GEO SEO', categoryKey: 'AI & GEO SEO', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&h=300&q=80', isMostPopular: false, order: 3, active: true },
        { id: 'top-4', name: 'Lead Scrapers', categoryKey: 'Lead Scrapers', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=300&h=300&q=80', isMostPopular: false, order: 4, active: true },
        { id: 'top-5', name: 'CRM & Sales', categoryKey: 'CRM & Sales', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=300&h=300&q=80', isMostPopular: false, order: 5, active: true },
        { id: 'top-6', name: 'Video & Design', categoryKey: 'Video & Design', image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=300&h=300&q=80', isMostPopular: false, order: 6, active: true },
        { id: 'top-7', name: 'Email Marketing', categoryKey: 'Email Marketing', image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&w=300&h=300&q=80', isMostPopular: false, order: 7, active: true },
        { id: 'top-8', name: 'Developer Tools', categoryKey: 'Developer Tools', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=300&h=300&q=80', isMostPopular: false, order: 8, active: true },
        { id: 'top-9', name: 'Analytics', categoryKey: 'Analytics', image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=300&h=300&q=80', isMostPopular: false, order: 9, active: true },
      ],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.SiteConfig || mongoose.model('SiteConfig', SiteConfigSchema);
