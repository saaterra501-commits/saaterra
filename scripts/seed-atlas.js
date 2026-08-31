const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in environment variables.');
  process.exit(1);
}

const DealSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    tagline: { type: String, required: true },
    category: { type: String, default: 'WhatsApp Bots' },
    isSelect: { type: Boolean, default: true },
    status: { type: String, default: 'Active' },
    vendorName: { type: String, required: true },
    vendorLogo: { type: String },
    vendorLocation: { type: String },
    foundedDate: { type: String },
    teamSize: { type: String },
    founderName: { type: String },
    founderTitle: { type: String },
    founderAvatar: { type: String },
    founderNote: { type: String },
    videoUrl: { type: String },
    screenshots: [String],
    tldr: [String],
    atAGlance: {
      alternativeTo: String,
      integrations: String,
      bestFor: String,
    },
    featureShowcases: [
      {
        title: String,
        description: String,
        bullets: [String],
        imageUrl: String,
      },
    ],
    pricingTiers: [
      {
        tierName: String,
        price: Number,
        originalPrice: Number,
        isRecommended: Boolean,
        features: [
          {
            text: String,
            included: Boolean,
          },
        ],
      },
    ],
    terms: [String],
    faqs: [
      {
        question: String,
        answer: String,
        askedBy: String,
        founderReply: String,
        upvotes: Number,
      },
    ],
    reviews: [
      {
        name: String,
        role: String,
        rating: Number,
        text: String,
        date: String,
      },
    ],
    tacoBreakdown: {
      taco5: Number,
      taco4: Number,
      taco3: Number,
      taco2: Number,
      taco1: Number,
    },
  },
  { timestamps: true }
);

const Deal = mongoose.models.Deal || mongoose.model('Deal', DealSchema);

const SEED_DEALS = [
  {
    slug: 'chat-chacha',
    title: 'Chat Chacha — WhatsApp AI Marketing & Automation',
    tagline: 'Automate WhatsApp marketing broadcasts, AI chatbot cart recovery, and lead conversion with zero coding.',
    category: 'WhatsApp Bots',
    isSelect: true,
    status: 'Active',
    vendorName: 'Chat Chacha AI',
    vendorLogo: 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png',
    vendorLocation: 'New Delhi, India',
    foundedDate: 'April 2022',
    teamSize: '1-10 employees',
    founderName: 'Ujjwal Sharma',
    founderTitle: 'Founder & CEO',
    founderLinkedin: 'https://www.linkedin.com/in/ujjawal-kumar',
    founderTwitter: 'https://x.com/ujjawal_dev',
    websiteUrl: 'https://www.chatchacha.in',
    founderNote: 'After trying expensive foreign WhatsApp tools charging $100+/month with no Indian UPI or GST support, we built Chat Chacha. It brings your broadcasts, AI chatbot replies, and client management into one place — so you can focus on scaling your agency without recurring subscriptions!',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    screenshots: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
    ],
    tldr: [
      'Create 1-click WhatsApp broadcasts, group, and automated drip sequences.',
      'Recover abandoned carts automatically via AI WhatsApp chatbots.',
      'Accept payments via UPI, PhonePe, and GPay directly inside WhatsApp chats.',
    ],
    atAGlance: {
      alternativeTo: 'Interakt, WATI, ManyChat',
      integrations: 'Shopify, WooCommerce, Razorpay, Google Sheets, Zapier',
      bestFor: 'Digital Agencies, Freelancers, E-commerce Brands, EdTech Founders',
    },
    pricingTiers: [
      {
        tierName: 'Starter Pass',
        price: 1999,
        originalPrice: 24000,
        totalCodes: 180,
        isRecommended: false,
        features: [
          { text: '1 User Account / Login', included: true },
          { text: '2,500 Broadcast Credits per month', included: true },
          { text: 'Chat Chacha Branding: Reduced', included: true },
          { text: 'AI Chatbot Builder & Flow Nodes', included: true },
          { text: 'Automated Cart Recovery Sequences', included: true },
        ],
      },
      {
        tierName: 'Pro Pass',
        price: 3999,
        originalPrice: 48000,
        totalCodes: 91,
        isRecommended: true,
        features: [
          { text: '3 User Accounts / Logins', included: true },
          { text: '10,000 Broadcast Credits per month', included: true },
          { text: 'Chat Chacha Branding: 100% Removed (White Label)', included: true },
          { text: 'AI Chatbot Builder & Flow Nodes', included: true },
          { text: 'Automated Cart Recovery Sequences', included: true },
          { text: 'API & Webhook Access', included: true },
        ],
      },
      {
        tierName: 'Agency Lifetime Pass (LTD)',
        price: 7999,
        originalPrice: 96000,
        totalCodes: 30,
        isRecommended: false,
        isLifetime: true,
        features: [
          { text: '10 User Accounts / Logins', included: true },
          { text: '50,000 Broadcast Credits per month', included: true },
          { text: '∞ Permanent Lifetime Access (No 5-Year Expiry)', included: true },
          { text: 'Full Custom White-Label & Custom Domain', included: true },
          { text: 'AI Chatbot Builder & Pro Workflows', included: true },
          { text: 'Unlimited Client Accounts & Team Members', included: true },
          { text: 'Dedicated Account Manager & VIP Support', included: true },
        ],
      },
    ],
    terms: [
      '5-Year Access Pass for Starter/Pro tiers & Permanent Lifetime Access for Agency Pass.',
      'Must redeem license code within 60 days of purchase.',
      '60-Day Money-Back Guarantee — test it risk-free for 2 full months.',
    ],
  },
  {
    slug: 'nuwatomic-geo-seo',
    title: 'Nuwatomic — AI Search (ChatGPT & Perplexity) GEO SEO',
    tagline: 'Track, optimize, and rank your agency clients on ChatGPT, Gemini, and Perplexity AI search answers.',
    category: 'AI & GEO SEO',
    isSelect: true,
    status: 'Active',
    vendorName: 'Nuwatomic',
    vendorLogo: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png',
    vendorLocation: 'Bengaluru, India',
    foundedDate: 'Jan 2024',
    teamSize: '5-15 employees',
    founderName: 'Ananya Roy',
    founderTitle: 'Co-Founder & CTO',
    founderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    founderNote: 'Generative Engine Optimization (GEO) is the future of SEO. We built Nuwatomic to help Indian agencies track and optimize client brand presence inside ChatGPT, Gemini, and Perplexity answers.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    screenshots: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
    ],
    tldr: [
      'Track client brand mentions inside ChatGPT, Perplexity, and Gemini AI outputs.',
      'Automated GEO keyword citation optimization recommendations.',
      'White-label PDF reports for agency clients.',
    ],
    atAGlance: {
      alternativeTo: 'Semrush, Ahrefs, BrightLocal',
      integrations: 'Google Search Console, OpenAI API, Perplexity API',
      bestFor: 'SEO Agencies, Content Creators, SaaS Founders',
    },
    pricingTiers: [
      {
        tierName: 'Starter Pass',
        price: 2499,
        originalPrice: 32000,
        isRecommended: false,
        features: [
          { text: '5 Tracked Agency Clients', included: true },
          { text: 'Daily ChatGPT & Perplexity Audits', included: true },
          { text: 'Automated Citation Reports', included: true },
        ],
      },
      {
        tierName: 'Pro Pass',
        price: 4999,
        originalPrice: 64000,
        isRecommended: true,
        features: [
          { text: '25 Tracked Agency Clients', included: true },
          { text: 'Daily ChatGPT, Gemini & Perplexity Audits', included: true },
          { text: 'White-Label Agency Client PDF Reports', included: true },
        ],
      },
      {
        tierName: 'Agency Lifetime Pass (LTD)',
        price: 8999,
        originalPrice: 120000,
        isRecommended: false,
        isLifetime: true,
        features: [
          { text: '100 Tracked Agency Clients', included: true },
          { text: '∞ Permanent Lifetime Access (No 5-Year Expiry)', included: true },
          { text: 'Real-time AI Mentions & Citation Audits', included: true },
          { text: 'Custom Branded Agency Portal & API', included: true },
        ],
      },
    ],
  },
];

async function runSeed() {
  try {
    console.log('Connecting to SaasGrid MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    for (const dealData of SEED_DEALS) {
      await Deal.findOneAndUpdate({ slug: dealData.slug }, dealData, { upsert: true, new: true });
      console.log(`✅ Seeded deal: ${dealData.title}`);
    }

    console.log('🎉 SaasGrid MongoDB Atlas Seeding Completed!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

runSeed();
