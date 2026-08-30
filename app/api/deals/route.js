import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Deal from '@/models/Deal';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let deals = [];

    // 1. Try MongoDB Atlas (saasgrid) - Only fetch approved Active deals
    try {
      const conn = await dbConnect();
      if (conn) {
        const dealsFromDb = await Deal.find({
          $or: [
            { status: 'Active' },
            { status: { $exists: false } }
          ]
        }).sort({ createdAt: -1 }).lean();
        if (dealsFromDb && dealsFromDb.length > 0) {
          deals = dealsFromDb.map(formatMarketplaceDeal);
        }
      }
    } catch (dbErr) {
      console.warn('MongoDB Atlas deals fetch error:', dbErr.message);
    }

    // 2. Merge with in-memory STORED_DEALS if any new submissions exist (only Active)
    if (global.STORED_DEALS && global.STORED_DEALS.length > 0) {
      const activeMemDeals = global.STORED_DEALS.filter((d) => d.status === 'Active' || !d.status);
      const memoryFormatted = activeMemDeals.map(formatMarketplaceDeal);
      const existingSlugs = new Set(deals.map((d) => d.slug));
      for (const memDeal of memoryFormatted) {
        if (!existingSlugs.has(memDeal.slug)) {
          deals.unshift(memDeal);
          existingSlugs.add(memDeal.slug);
        }
      }
    }

    // 3. Fallback defaults if database is completely empty
    if (deals.length === 0) {
      deals = [
        {
          id: 'deal-1',
          slug: 'chat-chacha',
          title: 'Chat Chacha - WhatsApp AI Marketing & Automation',
          tagline: 'Official Meta WhatsApp Cloud API with AI chatbots and broadcast workflows.',
          category: 'WhatsApp Bots',
          price: 1999,
          tier1Price: 1999,
          originalPrice: 24000,
          vendorName: 'Chat Chacha',
          vendorLogo: 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png',
          screenshot: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800&auto=format&fit=crop&q=80',
          tacoRating: 5.0,
          rating: 4.9,
          reviewsCount: 41,
          claimedPercent: 84,
        },
        {
          id: 'deal-2',
          slug: 'bitvoiper',
          title: 'Bitvoiper: Cloud Based VOIP & International Calling',
          tagline: 'Make HD international calls & send SMS from any browser with zero setup.',
          category: 'CRM & Sales',
          price: 2999,
          tier1Price: 2999,
          originalPrice: 32000,
          vendorName: 'Bitvoiper',
          vendorLogo: 'https://cdn-icons-png.flaticon.com/512/3059/3059502.png',
          screenshot: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80',
          tacoRating: 4.9,
          rating: 4.8,
          reviewsCount: 29,
          claimedPercent: 78,
        },
        {
          id: 'deal-3',
          slug: 'viralclippr',
          title: 'ViralClippr: AI Offline Video to Viral Shorts Generator',
          tagline: 'Automatically convert long videos into viral-ready shorts with captions.',
          category: 'AI & GEO SEO',
          price: 2499,
          tier1Price: 2499,
          originalPrice: 28000,
          vendorName: 'ViralClippr',
          vendorLogo: 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png',
          screenshot: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
          tacoRating: 5.0,
          rating: 5.0,
          reviewsCount: 34,
          claimedPercent: 91,
        },
        {
          id: 'deal-4',
          slug: 'duprun',
          title: 'Duprun: Launch Your Own White-Label Video Creation SaaS',
          tagline: 'Generate stunning marketing videos using screenshots with white-label license.',
          category: 'Lead Scrapers',
          price: 3999,
          tier1Price: 3999,
          originalPrice: 45000,
          vendorName: 'Duprun',
          vendorLogo: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png',
          screenshot: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
          tacoRating: 4.8,
          rating: 4.9,
          reviewsCount: 19,
          claimedPercent: 68,
          whiteLabel: true,
          reseller: true,
        },
      ];
    }

    return NextResponse.json({ success: true, deals });
  } catch (error) {
    console.error('[API Deals Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function formatMarketplaceDeal(raw) {
  const starterTier = raw.pricingTiers && raw.pricingTiers.length > 0 ? raw.pricingTiers[0] : null;
  const price = Number(raw.tier1Price ?? starterTier?.price ?? raw.price ?? 1999);
  const originalPrice = Number(raw.originalPrice ?? starterTier?.originalPrice ?? (price * 10));

  let screenshot = raw.screenshot || raw.heroImage;
  if (!screenshot && raw.screenshots && raw.screenshots.length > 0) {
    screenshot = raw.screenshots[0];
  }
  if (!screenshot && raw.screenshotsText) {
    screenshot = raw.screenshotsText.split('\n')[0]?.trim();
  }
  if (!screenshot) {
    screenshot = `https://picsum.photos/seed/${raw.slug || 'saas'}/400/300`;
  }

  const launchTime = raw.launchDate ? new Date(raw.launchDate).getTime() : (raw.createdAt ? new Date(raw.createdAt).getTime() : Date.now());
  const durationDays = Number(raw.campaignDurationDays || 14);
  const campaignEndDate = raw.campaignEndDate ? new Date(raw.campaignEndDate).toISOString() : new Date(launchTime + durationDays * 24 * 60 * 60 * 1000).toISOString();

  return {
    id: raw._id || raw.id || raw.slug,
    slug: raw.slug,
    title: raw.title,
    tagline: raw.tagline || '',
    category: raw.category || 'AI Tools',
    status: raw.status || 'Active',
    price: price,
    tier1Price: price,
    originalPrice: originalPrice,
    pricingTiers: raw.pricingTiers || [],
    campaignDurationDays: durationDays,
    campaignEndDate: campaignEndDate,
    launchDate: new Date(launchTime).toISOString(),
    vendorName: raw.vendorName || 'StackDeal Partner',
    vendorLogo: raw.vendorLogo || 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png',
    screenshot: screenshot,
    heroImage: screenshot,
    tacoRating: raw.rating || 5.0,
    rating: raw.rating || 5.0,
    reviewsCount: raw.reviewsCount || (raw.reviews?.length) || 1,
    claimedPercent: raw.claimedPercent || 72,
    whiteLabel: raw.whiteLabel || false,
    reseller: raw.reseller || false,
  };
}
