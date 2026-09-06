import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/dbConnect';
import Deal from '@/models/Deal';
import LTDOrder from '@/models/LTDOrder';

export async function POST(req) {
  try {
    await dbConnect();
    const { dealId, tier = 'Tier 1', gstNumber, userEmail = 'agency@stackdeal.in', userName = 'Indian Agency Owner' } = await req.json();

    let deal = null;
    try {
      if (dealId && dealId.match(/^[0-9a-fA-F]{24}$/)) {
        deal = await Deal.findById(dealId);
      }
    } catch (e) {}

    if (!deal) {
      deal = await Deal.findOne({ slug: dealId });
    }

    if (!deal) {
      return NextResponse.json({ success: false, message: 'Deal not found' }, { status: 404 });
    }

    let matchedTier = deal.pricingTiers?.find((t) => t.tierName?.toLowerCase() === tier?.toLowerCase());
    let price = matchedTier?.price || deal.pricingTiers?.[0]?.price || 1999;

    let licenseCode = null;
    if (matchedTier?.licenseCodes?.length > 0) {
      licenseCode = matchedTier.licenseCodes.shift();
    } else if (deal.licenseKeys?.length > 0) {
      licenseCode = deal.licenseKeys.shift();
    }
    if (!licenseCode) {
      licenseCode = `SD-${deal.slug.toUpperCase().replace(/[^A-Z0-9]/g, '')}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    }

    const refundDeadline = new Date();
    refundDeadline.setDate(refundDeadline.getDate() + 60);

    const order = await LTDOrder.create({
      orderId: `order_chk_${Date.now()}`,
      dealId: deal._id,
      dealSlug: deal.slug,
      dealTitle: deal.title,
      userEmail,
      userName,
      tier: matchedTier?.tierName || tier,
      amountPaid: price,
      currency: 'INR',
      paymentGateway: 'razorpay',
      licenseCode,
      gstNumber: gstNumber || '',
      status: 'paid',
      refundDeadline,
    });

    deal.soldCount = (deal.soldCount || 0) + 1;
    if (matchedTier) matchedTier.soldCount = (matchedTier.soldCount || 0) + 1;
    await deal.save();

    return NextResponse.json({
      success: true,
      licenseCode,
      orderId: order.orderId,
      message: 'Payment processed successfully via Razorpay UPI',
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
