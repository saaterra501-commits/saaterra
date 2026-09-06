import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import dbConnect from '@/lib/dbConnect';
import Deal from '@/models/Deal';
import fs from 'fs';
import path from 'path';

function getRazorpayCredentials() {
  let keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
  let keySecret = process.env.RAZORPAY_KEY_SECRET || '';

  if (!keyId || !keySecret) {
    try {
      const candidates = [
        path.join(process.cwd(), '.env.local'),
        'C:\\Users\\ujjaw\\OneDrive\\Documents\\saaterra\\.env.local',
        'C:\\Users\\ujjaw\\OneDrive\\Desktop\\saaterra\\.env.local',
      ];
      for (const envPath of candidates) {
        if (fs.existsSync(envPath)) {
          const content = fs.readFileSync(envPath, 'utf8');
          const lines = content.split(/\r?\n/);
          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('RAZORPAY_KEY_ID=')) {
              const val = trimmed.split('=')[1]?.trim()?.replace(/^["']|["']$/g, '');
              if (val) keyId = val;
            }
            if (trimmed.startsWith('RAZORPAY_KEY_SECRET=')) {
              const val = trimmed.split('=')[1]?.trim()?.replace(/^["']|["']$/g, '');
              if (val) keySecret = val;
            }
            if (trimmed.startsWith('NEXT_PUBLIC_RAZORPAY_KEY_ID=') && !keyId) {
              const val = trimmed.split('=')[1]?.trim()?.replace(/^["']|["']$/g, '');
              if (val) keyId = val;
            }
          }
          if (keyId && keySecret) break;
        }
      }
    } catch (e) {
      console.warn('Fallback env read notice:', e.message);
    }
  }

  return { keyId, keySecret };
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const {
      dealId,
      tier = 'Tier 1',
      price: customPrice,
      gstNumber,
      userEmail = '',
      userName = '',
    } = body;

    const targetDealId = dealId || 'chat-chacha';

    // Find deal by ObjectId or slug
    let deal = null;
    try {
      if (typeof targetDealId === 'string' && targetDealId.match(/^[0-9a-fA-F]{24}$/)) {
        deal = await Deal.findById(targetDealId);
      }
    } catch (err) {
      // not a valid ObjectId
    }

    if (!deal && typeof targetDealId === 'string') {
      deal = await Deal.findOne({ slug: targetDealId });
    }

    // Fallback: If not found (e.g. cart bundle order), pick first active deal or general marketplace pass
    if (!deal) {
      deal = await Deal.findOne({ status: 'Active' }) || await Deal.findOne({});
    }

    // Fallback deal object if DB has no deals
    if (!deal) {
      deal = {
        _id: 'sd_bundle_pass',
        slug: 'stackdeal-bundle',
        title: 'StackDeal 5-Year Software Pass',
        pricingTiers: [{ tierName: 'Starter Pass', price: 1999 }],
      };
    }

    // Determine pricing tier & amount
    let price = customPrice ? Number(customPrice) : 1999;
    let selectedTierName = tier;

    if (!customPrice && deal.pricingTiers && deal.pricingTiers.length > 0) {
      // Match by exact or partial tier name
      const matchedTier = deal.pricingTiers.find((t) =>
        t.tierName?.toLowerCase() === tier?.toLowerCase() ||
        (tier?.toLowerCase().includes('tier 1') && t.tierName?.toLowerCase().includes('starter')) ||
        (tier?.toLowerCase().includes('tier 2') && (t.tierName?.toLowerCase().includes('pro') || t.tierName?.toLowerCase().includes('growth'))) ||
        (tier?.toLowerCase().includes('tier 3') && (t.tierName?.toLowerCase().includes('agency') || t.tierName?.toLowerCase().includes('lifetime') || t.tierName?.toLowerCase().includes('scale')))
      );

      if (matchedTier && matchedTier.price) {
        price = matchedTier.price;
        selectedTierName = matchedTier.tierName;
      } else {
        // Match by index fallback
        if (tier === 'Tier 2' && deal.pricingTiers[1]) {
          price = deal.pricingTiers[1].price;
          selectedTierName = deal.pricingTiers[1].tierName;
        } else if (tier === 'Tier 3' && (deal.pricingTiers[2] || deal.pricingTiers[1])) {
          const tObj = deal.pricingTiers[2] || deal.pricingTiers[1];
          price = tObj.price;
          selectedTierName = tObj.tierName;
        } else {
          price = deal.pricingTiers[0].price;
          selectedTierName = deal.pricingTiers[0].tierName;
        }
      }
    }

    const { keyId, keySecret } = getRazorpayCredentials();

    if (!keyId || !keySecret) {
      return NextResponse.json({
        success: false,
        message: 'Razorpay API credentials are not configured in environment variables.',
      }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const amountInPaise = Math.round(price * 100);

    const safeSlug = deal.slug ? deal.slug.substring(0, 10) : 'sd_pass';
    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${safeSlug}_${Date.now().toString().slice(-6)}`,
      notes: {
        dealId: deal._id ? deal._id.toString() : (deal.slug || 'stackdeal'),
        dealSlug: deal.slug || 'stackdeal',
        tier: selectedTierName,
        gstNumber: gstNumber || 'NONE',
        userEmail: userEmail || 'guest',
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: 'INR',
      keyId,
      dealTitle: deal.title,
      dealSlug: deal.slug,
      tier: selectedTierName,
      price,
    });
  } catch (error) {
    console.error('create-order route fatal error:', error);
    return NextResponse.json({
      success: false,
      message: error?.error?.description || error.message || 'Failed to create Razorpay order',
    }, { status: 500 });
  }
}
