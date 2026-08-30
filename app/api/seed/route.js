import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import LTDDeal from '@/models/LTDDeal';

export async function GET() {
  try {
    await dbConnect();

    const sampleDeals = [
      {
        slug: 'chat-chacha',
        title: 'Chat Chacha — WhatsApp AI Marketing & Automation',
        tagline: 'Automate WhatsApp marketing broadcasts, AI chatbot recovery, and lead conversion with zero coding.',
        description: 'Chat Chacha gives your team complete WhatsApp API broadcasts, AI cart recovery chatbots, and lead conversion with zero coding.',
        vendorName: 'Chat Chacha',
        vendorLogo: 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png',
        vendorWebsite: 'https://www.chatchacha.in',
        category: 'WhatsApp Bots',
        isSelect: true,
        originalPrice: 24000,
        tier1Price: 1999,
        tier1Title: 'Starter Pass',
        tier1Credits: '1 User / 2,500 Broadcasts/mo',
        tier1Features: ['Official WhatsApp Business API', '2,500 Broadcasts/mo', '1 Team Member', 'Standard Support'],
        tier2Price: 3999,
        tier2Title: 'Pro Pass',
        tier2Credits: '3 Users / 10,000 Broadcasts/mo',
        tier2Features: ['Official WhatsApp Business API', '10,000 Broadcasts/mo', '3 Team Members', 'AI Abandoned Cart Recovery', 'Priority Support'],
        tier3Price: 7999,
        tier3Title: 'Agency Lifetime Pass (LTD)',
        tier3Credits: '10 Users / Unlimited Broadcasts / Permanent Lifetime',
        tier3Features: ['Official WhatsApp Business API', 'Unlimited Broadcasts', '10 Team Members', 'AI Abandoned Cart & Support Bot', 'Dedicated Account Manager'],
        totalCodes: 100,
        soldCount: 84,
        rating: 5.0,
        reviewsCount: 38,
        endDate: new Date('2026-09-10T00:00:00.000Z'),
        demoVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        bestFor: 'Digital Marketing Agencies, E-commerce Stores, Sales Teams',
        alternativeTo: 'Wati, Interakt, AiSensy',
        integrations: 'Shopify, WooCommerce, Webhooks, Razorpay',
        founderName: 'Ujjawal',
        founderRole: 'Founder & CEO of Chat Chacha',
        founderNote: `Hey Sumo-lings & Agency Owners! I'm Ujjawal, Founder of Chat Chacha. We built Chat Chacha because Indian agencies were paying $150+/month for foreign WhatsApp automation tools that failed on Stripe credit card payments. Chat Chacha gives your team complete WhatsApp API broadcasts, AI cart recovery chatbots, and lead conversion with zero coding. We are excited to offer this 5-Year Access Pass exclusively on SaaTerra!`,
        problemStatement: 'Indian digital agencies spend ₹15,000+/month on foreign WhatsApp tools with high per-message markup, failing international credit card payments on Stripe.',
        solutionStatement: 'Chat Chacha gives your agency a 5-Year Capped Pass to send bulk broadcasts, trigger AI workflows, and automate lead support with local Razorpay UPI & GST invoices.',
        features: [
          'Official Meta WhatsApp Business API Integration',
          'AI Cart Abandonment & Order Recovery Workflows',
          'Bulk Broadcasting with Tag Segmenting & Analytics',
          'Instant Code Delivery & 100% Tax Credit GST Invoices'
        ],
        reviews: [
          { name: 'Amit Sharma', rating: 5, comment: 'Saved ₹1.8 Lakhs/year for my marketing agency! WhatsApp broadcast delivery rate in India is 99%.' },
          { name: 'Priya Patel', rating: 5, comment: 'UPI checkout was super smooth and received GST invoice immediately for my CA.' }
        ]
      },
      {
        slug: 'nuwatomic-geo-seo',
        title: 'Nuwatomic — AI Search (ChatGPT & Perplexity) GEO SEO',
        tagline: 'Track, optimize, and rank your agency clients on ChatGPT, Gemini, and Perplexity search answers.',
        description: 'Generative Engine Optimization (GEO) suite built for agencies to audit and rank clients on AI answer engines.',
        vendorName: 'Nuwatomic',
        vendorLogo: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png',
        vendorWebsite: 'https://www.nuwatomic.com',
        category: 'AI & GEO SEO',
        isSelect: true,
        originalPrice: 32000,
        tier1Price: 2499,
        tier1Title: 'Starter Pass',
        tier1Credits: '5 Brand Monitors / 100 AI Audits',
        tier1Features: ['5 Brand Monitors', '100 AI Search Audits', 'ChatGPT & Gemini Tracking'],
        tier2Price: 4999,
        tier2Title: 'Pro Pass',
        tier2Credits: '20 Brand Monitors / 500 AI Audits',
        tier2Features: ['20 Brand Monitors', '500 AI Search Audits', 'ChatGPT, Gemini & Perplexity Tracking', 'White-Label Reports'],
        tier3Price: 9999,
        tier3Title: 'Agency Lifetime Pass (LTD)',
        tier3Credits: 'Unlimited Brands & Audit Reports / Permanent Lifetime',
        tier3Features: ['Unlimited Brand Monitors', 'Unlimited Audits', 'All AI Search Engines', 'White-Label Agency Client PDF Reports'],
        totalCodes: 50,
        soldCount: 41,
        rating: 5.0,
        reviewsCount: 29,
        endDate: new Date('2026-09-08T00:00:00.000Z'),
        demoVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        bestFor: 'SEO Agencies, Digital Marketers, Content Consultants',
        alternativeTo: 'Ahrefs, SEMrush, Moz',
        integrations: 'Google Search Console, Webhooks',
        founderName: 'Alex & Team',
        founderRole: 'Creators of Nuwatomic',
        founderNote: `Hey Sumo-lings! Search is changing rapidly. Over 40% of users now ask ChatGPT and Perplexity instead of searching Google. We built Nuwatomic to help agencies audit, optimize, and rank their clients directly inside AI answer engines!`,
        problemStatement: 'Search traffic is shifting from Google to ChatGPT, but legacy SEO tools like Ahrefs do not track AI citations.',
        solutionStatement: 'Nuwatomic provides Generative Engine Optimization (GEO) audits to ensure your brand gets suggested #1 by AI.',
        features: [
          'AI Search Citation & Rank Tracker',
          'Google Search Console Gaps Analyzer',
          'GEO Schema & Table Generator',
          'White-Label PDF Reports for Clients'
        ],
        reviews: [
          { name: 'Rohan Gupta', rating: 5, comment: 'Must-have tool for digital marketing agencies in 2026. Very easy to show AI search gaps to clients.' }
        ]
      }
    ];

    for (const d of sampleDeals) {
      await LTDDeal.findOneAndUpdate({ slug: d.slug }, d, { upsert: true, new: true });
    }

    return NextResponse.json({ success: true, message: 'Database seeded with 5-Year Passes successfully!' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
