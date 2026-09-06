import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/dbConnect';
import Deal from '@/models/Deal';
import LTDOrder from '@/models/LTDOrder';
import Notification from '@/models/Notification';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    await dbConnect();
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET || 'SaaTerraSecretRazorpayKey2026';

    // Verify webhook signature if provided
    if (signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        console.warn('Razorpay webhook signature mismatch');
        return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    // Process payment.captured or order.paid
    if (event === 'payment.captured' || event === 'order.paid') {
      const payment = payload.payload?.payment?.entity;
      const order = payload.payload?.order?.entity;

      const orderId = payment?.order_id || order?.id;
      const paymentId = payment?.id;
      const notes = payment?.notes || order?.notes || {};
      const amountPaid = (payment?.amount || order?.amount || 199900) / 100;
      const userEmail = payment?.email || notes?.userEmail || 'buyer@stackdeal.in';
      const dealId = notes?.dealId;
      const tier = notes?.tier || 'Tier 1';
      const gstNumber = notes?.gstNumber || '';

      if (orderId) {
        // Idempotency check: see if order already saved
        const existing = await LTDOrder.findOne({
          $or: [{ orderId }, { paymentId }],
        });

        if (!existing && dealId) {
          // Find deal
          let deal = null;
          try {
            if (dealId.match(/^[0-9a-fA-F]{24}$/)) {
              deal = await Deal.findById(dealId);
            }
          } catch (e) {}
          if (!deal) deal = await Deal.findOne({ slug: notes?.dealSlug || dealId });

          if (deal) {
            let matchedTier = deal.pricingTiers?.find((t) => t.tierName?.toLowerCase() === tier?.toLowerCase());
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

            await LTDOrder.create({
              orderId,
              dealId: deal._id,
              dealSlug: deal.slug,
              dealTitle: deal.title,
              userEmail: userEmail.toLowerCase().trim(),
              userName: payment?.notes?.userName || 'Valued Founder',
              tier: matchedTier?.tierName || tier,
              amountPaid,
              currency: 'INR',
              paymentGateway: 'razorpay',
              paymentId: paymentId || '',
              licenseCode,
              gstNumber,
              status: 'paid',
              refundDeadline,
            });

            deal.soldCount = (deal.soldCount || 0) + 1;
            if (matchedTier) matchedTier.soldCount = (matchedTier.soldCount || 0) + 1;
            await deal.save();
          }
        }
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Razorpay Webhook Error:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
