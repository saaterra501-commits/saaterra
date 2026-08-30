import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Deal from '@/models/Deal';

export async function GET(req, { params }) {
  try {
    const { slug } = await params;
    const cleanSlug = slug?.toLowerCase();

    // 1. Check in-memory STORED_DEALS first
    if (global.STORED_DEALS && global.STORED_DEALS.length > 0) {
      const memoryDeal = global.STORED_DEALS.find(
        (d) => d.slug?.toLowerCase() === cleanSlug || String(d.id) === cleanSlug
      );
      if (memoryDeal) {
        return NextResponse.json({ success: true, deal: formatDeal(memoryDeal) });
      }
    }

    // 2. Check MongoDB Atlas (saasgrid)
    try {
      const conn = await dbConnect();
      if (conn) {
        const dealFromDb = await Deal.findOne({
          $or: [
            { slug: cleanSlug },
            { slug: new RegExp(`^${cleanSlug}$`, 'i') }
          ]
        }).lean();

        if (dealFromDb) {
          return NextResponse.json({ success: true, deal: formatDeal(dealFromDb) });
        }
      }
    } catch (dbErr) {
      console.warn('MongoDB Atlas find error for slug:', slug, dbErr.message);
    }

    // 3. Fallback to sample deals if known
    const defaultDeal = {
      slug: cleanSlug || 'chat-chacha',
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
      founderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      founderNote: 'After trying expensive foreign WhatsApp tools charging $100+/month with no Indian UPI or GST support, we built Chat Chacha.',
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
        bestFor: 'Digital Agencies, Freelancers, E-commerce Brands',
      },
      featureShowcases: [
        {
          title: 'Run Automated WhatsApp Broadcasts Without Limits',
          description: 'Send personalized promotions, deal alerts, and broadcast sequences to thousands of verified contacts without manual work.',
          bullets: [
            'Upload bulk CSV or sync contacts from Google Sheets',
            'Tailor messages with custom contact variables',
            'Track open rates and deliveries in real-time',
          ],
          imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
        },
      ],
      pricingTiers: [
        {
          tierName: 'Starter Pass',
          price: 1999,
          originalPrice: 24000,
          isRecommended: false,
          features: [
            { text: '5-Year Access to core software', included: true },
            { text: 'All minor updates included', included: true },
            { text: '1 Workspace / Account', included: true },
          ],
        },
        {
          tierName: 'Pro Pass',
          price: 3999,
          originalPrice: 48000,
          isRecommended: true,
          features: [
            { text: '5-Year Access to all Pro features', included: true },
            { text: 'Unlimited workspaces & campaigns', included: true },
            { text: '5 Team member seats', included: true },
          ],
        },
      ],
      terms: [
        '5-Year Access Pass to software updates.',
        'Must redeem license code within 60 days of purchase.',
        '60-Day Money-Back Guarantee — test it risk-free.',
      ],
      reviews: [
        {
          name: 'Verified Agency Founder',
          rating: 5,
          date: 'Recently',
          text: 'Super easy setup and seamless integration with our agency workflow.',
        },
      ],
    };

    return NextResponse.json({ success: true, deal: defaultDeal });

  } catch (err) {
    console.error('API /deals/[slug] error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

function formatDeal(raw) {
  const tier1Price = Number(raw.tier1Price || raw.price || 1999);
  const tier2Price = Number(raw.tier2Price || Math.round(tier1Price * 2));
  const tier3Price = Number(raw.tier3Price || Math.round(tier1Price * 4));
  const originalPrice = Number(raw.originalPrice || (tier1Price * 10));

  // Build pricing tiers from submitted form data if not present
  const pricingTiers = (raw.pricingTiers && raw.pricingTiers.length > 0)
    ? raw.pricingTiers
    : [
        {
          tierName: 'Starter Pass',
          price: tier1Price,
          originalPrice: originalPrice,
          isRecommended: false,
          features: [
            { text: '5-Year Access to core software features', included: true },
            { text: 'All software updates during 5-Year pass', included: true },
            { text: 'Standard email support', included: true },
            { text: '1 Team Account / License', included: true },
          ],
        },
        {
          tierName: 'Pro Pass',
          price: tier2Price,
          originalPrice: Math.round(originalPrice * 1.8),
          isRecommended: true,
          features: [
            { text: '5-Year Access to all Pro features', included: true },
            { text: 'Unlimited workspaces & campaigns', included: true },
            { text: '5 Team member seats', included: true },
            { text: 'Priority WhatsApp support', included: true },
          ],
        },
        {
          tierName: 'Agency Pass',
          price: tier3Price,
          originalPrice: Math.round(originalPrice * 3.5),
          isRecommended: false,
          features: [
            { text: 'Everything in Pro Pass', included: true },
            { text: 'Unlimited sub-accounts & client management', included: true },
            { text: 'Full White-Label custom domain', included: true },
            { text: 'Dedicated Account Manager', included: true },
          ],
        },
      ];

  // Screenshots formatting
  let screenshots = raw.screenshots || [];
  if (screenshots.length === 0 && raw.screenshotsText) {
    screenshots = raw.screenshotsText.split('\n').map((s) => s.trim()).filter(Boolean);
  }
  if (screenshots.length === 0 && (raw.heroImage || raw.screenshot)) {
    screenshots = [raw.heroImage || raw.screenshot];
  }
  if (screenshots.length === 0) {
    screenshots = ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop'];
  }

  // TLDR formatting
  let tldr = raw.tldr || [];
  if (tldr.length === 0 && raw.tldrText) {
    tldr = raw.tldrText.split('\n').map((s) => s.trim()).filter(Boolean);
  }
  if (tldr.length === 0 && raw.tagline) {
    tldr = [raw.tagline, 'Full 5-Year Access with zero recurring subscription fees', 'Instant license code delivery & GST invoice'];
  }

  // Terms formatting
  let terms = raw.terms || [];
  if (terms.length === 0 && raw.termsText) {
    terms = raw.termsText.split('\n').map((s) => s.trim()).filter(Boolean);
  }
  if (terms.length === 0) {
    terms = [
      `5-Year Access Pass to ${raw.title || 'software'} updates.`,
      'Must redeem license code within 60 days of purchase.',
      '60-Day Money-Back Guarantee — test it risk-free.',
      'Includes B2B GST Tax Invoice with 100% Input Tax Credit (ITC).'
    ];
  }

  // Feature Showcases formatting
  let featureShowcases = raw.featureShowcases || [];
  if (featureShowcases.length === 0 && (raw.feat1Title || raw.feat2Title)) {
    featureShowcases = [];
    if (raw.feat1Title) {
      featureShowcases.push({
        title: raw.feat1Title,
        description: raw.feat1Desc || '',
        bullets: (raw.feat1Bullets || '').split('\n').map((b) => b.trim()).filter(Boolean),
        imageUrl: raw.feat1Image || screenshots[0],
      });
    }
    if (raw.feat2Title) {
      featureShowcases.push({
        title: raw.feat2Title,
        description: raw.feat2Desc || '',
        bullets: (raw.feat2Bullets || '').split('\n').map((b) => b.trim()).filter(Boolean),
        imageUrl: raw.feat2Image || screenshots[0],
      });
    }
  }

  // At a glance
  const atAGlance = raw.atAGlance || {
    alternativeTo: raw.alternativeTo || 'Expensive monthly SaaS subscriptions',
    integrations: raw.integrations || 'Google Sheets, Zapier, Webhooks, Razorpay',
    bestFor: raw.bestFor || 'Digital Marketing Agencies, Freelancers, Solopreneurs',
  };

    const launchTime = raw.launchDate ? new Date(raw.launchDate).getTime() : (raw.createdAt ? new Date(raw.createdAt).getTime() : Date.now());
    const durationDays = Number(raw.campaignDurationDays || 14);
    const campaignEndDate = raw.campaignEndDate ? new Date(raw.campaignEndDate).toISOString() : new Date(launchTime + durationDays * 24 * 60 * 60 * 1000).toISOString();

    return {
      id: raw._id || raw.id || raw.slug,
      slug: raw.slug,
      title: raw.title || 'SaaS 5-Year Pass',
      tagline: raw.tagline || '5-Year Access Pass for Indian Agencies',
      category: raw.category || 'AI Tools',
      status: raw.status || 'Active',
      campaignDurationDays: durationDays,
      campaignEndDate: campaignEndDate,
      launchDate: new Date(launchTime).toISOString(),
      vendorName: raw.vendorName || 'StackDeal Partner',
      vendorLogo: raw.vendorLogo || 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png',
      vendorLocation: raw.vendorLocation || 'India',
      foundedDate: raw.foundedDate || '2023',
      teamSize: raw.teamSize || '1-10 employees',
      videoUrl: raw.videoUrl || '',
      heroImage: raw.heroImage || raw.screenshot || screenshots[0],
      screenshots,
      tldr,
      atAGlance,
      featureShowcases,
      pricingTiers,
      terms,
      founderName: raw.founderName || raw.vendorName || 'Founder',
      founderTitle: raw.founderTitle || 'Founder & CEO',
      founderAvatar: raw.founderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      founderNote: raw.founderNote || `We created ${raw.title || raw.vendorName} to solve real bottlenecks for growing businesses and agencies without recurring subscription overhead.`,
      reviews: raw.reviews || [
        {
          name: 'Verified Agency Founder',
          rating: 5,
          date: 'Recently',
          text: 'Outstanding software with fast support. The 5-Year Pass saved our team thousands of rupees vs monthly subscriptions.',
        }
      ],
    };
  }
