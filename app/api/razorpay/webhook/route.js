import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/dbConnect';
import Deal from '@/models/Deal';
import LTDOrder from '@/models/LTDOrder';
import Notification from '@/models/Notification';
import LTDCode from '@/models/LTDCode';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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
            let isRealVendorKey = false;
            const vendorRedeemUrl = deal.vendorRedeemUrl || deal.websiteUrl || '';
            const vendorInstructions = deal.vendorRedeemInstructions || 'Log in to the vendor software portal and paste this license key under Account/Billing to unlock your 5-Year Pass.';

            // 1. Check LTDCode vault atomically
            try {
              const claimedCode = await LTDCode.findOneAndUpdate(
                {
                  dealId: deal._id,
                  status: 'available',
                  $or: [
                    { tier: matchedTier?.tierName || tier },
                    { tier: 'Tier 1' },
                    { tier: { $exists: false } },
                  ],
                },
                {
                  $set: {
                    status: 'assigned',
                    assignedUserEmail: userEmail.toLowerCase().trim(),
                    orderId,
                    assignedAt: new Date(),
                  },
                },
                { new: true, returnDocument: 'after' }
              );
              if (claimedCode?.code) {
                licenseCode = claimedCode.code.trim();
                isRealVendorKey = true;
              }
            } catch (err) {}

            // Fetch all used license codes in the database to avoid collision
            const existingOrders = await LTDOrder.find({}).select('licenseCode').lean();
            const usedKeySet = new Set(existingOrders.map((o) => (o.licenseCode ? o.licenseCode.trim().toUpperCase() : '')));

            // 2. Check matchedTier.licenseCodes
            if (!licenseCode && matchedTier && Array.isArray(matchedTier.licenseCodes) && matchedTier.licenseCodes.length > 0) {
              const unusedTierCodes = matchedTier.licenseCodes.filter((c) => c && !usedKeySet.has(c.trim().toUpperCase()));
              if (unusedTierCodes.length > 0) {
                licenseCode = unusedTierCodes[0].trim();
                matchedTier.licenseCodes = matchedTier.licenseCodes.filter((c) => c.trim() !== licenseCode);
                deal.markModified('pricingTiers');
                isRealVendorKey = true;
                Deal.updateOne({ _id: deal._id }, { $pull: { 'pricingTiers.$[].licenseCodes': licenseCode } }).catch(() => {});
              }
            }

            // 3. Check deal.licenseKeys
            if (!licenseCode && Array.isArray(deal.licenseKeys) && deal.licenseKeys.length > 0) {
              const unusedDealCodes = deal.licenseKeys.filter((c) => c && !usedKeySet.has(c.trim().toUpperCase()));
              if (unusedDealCodes.length > 0) {
                licenseCode = unusedDealCodes[0].trim();
                deal.licenseKeys = deal.licenseKeys.filter((c) => c.trim() !== licenseCode);
                deal.markModified('licenseKeys');
                isRealVendorKey = true;
                Deal.updateOne({ _id: deal._id }, { $pull: { licenseKeys: licenseCode } }).catch(() => {});
              }
            }

            // 4. Fallback if out of stock
            if (!licenseCode) {
              const slugClean = deal.slug.toUpperCase().replace(/[^A-Z0-9]/g, '');
              licenseCode = `SD-${slugClean}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
              isRealVendorKey = false;
            }

            const refundDeadline = new Date();
            refundDeadline.setDate(refundDeadline.getDate() + 60);

            try {
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
                isRealVendorKey,
                vendorRedeemUrl,
                vendorInstructions,
                gstNumber,
                status: 'paid',
                refundDeadline,
              });
            } catch (wCreateErr) {
              if (wCreateErr.code === 11000) {
                const slugClean = deal.slug.toUpperCase().replace(/[^A-Z0-9]/g, '');
                licenseCode = `SD-${slugClean}-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
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
                  isRealVendorKey: false,
                  vendorRedeemUrl,
                  vendorInstructions,
                  gstNumber,
                  status: 'paid',
                  refundDeadline,
                });
              }
            }

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
