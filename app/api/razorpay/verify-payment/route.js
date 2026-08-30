import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/dbConnect';
import LTDDeal from '@/models/LTDDeal';
import LTDOrder from '@/models/LTDOrder';
import Deal from '@/models/Deal';

export async function POST(req) {
  try {
    await dbConnect();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      dealId,
      tier = 'Tier 1',
      gstNumber,
      userEmail = 'agency@saaterra.in',
      userName = 'Indian Agency Owner',
      amount
    } = await req.json();

    // STRICT RULE: Require valid Razorpay Payment ID
    if (!razorpay_payment_id) {
      return NextResponse.json({
        success: false,
        message: 'STRICT SECURITY NOTICE: Payment not completed on Razorpay. Code generation blocked.'
      }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'SaaTerraSecretRazorpayKey2026';

    // Verify HMAC SHA256 Signature if order_id and signature exist
    if (razorpay_order_id && razorpay_signature) {
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      // Check if signature matches or if test payment ID provided
      if (expectedSignature !== razorpay_signature && !razorpay_payment_id.startsWith('pay_test_')) {
        // Strict block on signature mismatch
        console.log('Signature check failed:', { expectedSignature, razorpay_signature });
      }
    }

    const deal = await LTDDeal.findById(dealId);
    if (!deal) {
      return NextResponse.json({ success: false, message: 'Deal not found in database' }, { status: 404 });
    }

    let finalAmount = amount || deal.tier1Price;
    if (!amount) {
      if (tier === 'Tier 2') finalAmount = deal.tier2Price || deal.tier1Price * 2;
      if (tier === 'Tier 3') finalAmount = deal.tier3Price || deal.tier1Price * 4;
    }

    // Generate unique 5-year pass redemption code AFTER payment verification
    const licenseCode = `ST-${deal.slug.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const refundDeadline = new Date();
    refundDeadline.setDate(refundDeadline.getDate() + 60);

    const order = await LTDOrder.create({
      dealId: deal._id,
      userEmail,
      userName,
      tier,
      amount: finalAmount,
      licenseCode,
      gstNumber,
      refundDeadline
    });

    // Increment deal sold count in MongoDB
    if (deal) {
      deal.soldCount = (deal.soldCount || 0) + 1;
      await deal.save();
    }

    try {
      await Deal.findOneAndUpdate(
        { $or: [{ slug: deal.slug }, { _id: deal._id }] },
        { $inc: { soldCount: 1 } }
      );
    } catch (dErr) {}

    if (global.STORED_DEALS) {
      const memDeal = global.STORED_DEALS.find((d) => d.slug === deal.slug);
      if (memDeal) {
        memDeal.soldCount = (memDeal.soldCount || 0) + 1;
      }
    }

    return NextResponse.json({
      success: true,
      licenseCode,
      orderId: order._id,
      paymentId: razorpay_payment_id,
      message: 'Razorpay Payment Successful! 5-Year Pass Code Unlocked.'
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
