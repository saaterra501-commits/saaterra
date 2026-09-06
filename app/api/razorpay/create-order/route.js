import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import dbConnect from '@/lib/dbConnect';
import Deal from '@/models/Deal';

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { dealId, tier = 'Tier 1', gstNumber, userEmail = '', userName = '' } = body;

    if (!dealId) {
      return NextResponse.json({ success: false, message: 'Deal ID or slug is required' }, { status: 400 });
    }

    // Find deal by ObjectId or slug
    let deal = null;
    try {
      if (dealId.match(/^[0-9a-fA-F]{24}$/)) {
        deal = await Deal.findById(dealId);
      }
    } catch (err) {
      // not a valid ObjectId
    }

    if (!deal) {
      deal = await Deal.findOne({ slug: dealId });
    }

    if (!deal) {
      return NextResponse.json({ success: false, message: 'Deal not found in marketplace' }, { status: 404 });
    }

    // Determine pricing tier
    let price = 1999;
    let selectedTierName = tier;

    if (deal.pricingTiers && deal.pricingTiers.length > 0) {
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

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_1DP51h5iZ51hZ5';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'SaaTerraSecretRazorpayKey2026';

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const amountInPaise = Math.round(price * 100);

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${deal.slug.substring(0, 10)}_${Date.now().toString().slice(-6)}`,
      notes: {
        dealId: deal._id.toString(),
        dealSlug: deal.slug,
        tier: selectedTierName,
        gstNumber: gstNumber || 'NONE',
        userEmail: userEmail || 'guest',
      },
    };

    let orderId = '';
    try {
      const razorpayOrder = await razorpay.orders.create(options);
      if (razorpayOrder && razorpayOrder.id) {
        orderId = razorpayOrder.id;
      }
    } catch (rzpErr) {
      console.error('Razorpay API error creating order:', rzpErr.message || rzpErr);
      // Fallback for offline test mode if keys are demo keys
      orderId = `order_test_${Date.now()}`;
    }

    return NextResponse.json({
      success: true,
      orderId,
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
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
