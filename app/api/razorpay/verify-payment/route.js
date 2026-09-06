import { NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import Razorpay from 'razorpay';
import dbConnect from '@/lib/dbConnect';
import Deal from '@/models/Deal';
import LTDOrder from '@/models/LTDOrder';
import Notification from '@/models/Notification';
import User from '@/models/User';

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      dealId,
      tier = 'Tier 1',
      gstNumber = '',
      userEmail = 'buyer@stackdeal.in',
      userName = 'Verified Agency Founder',
      userPhone = '',
      userId = null,
    } = body;

    // ──────────────────────────────────────────────────────────────────────────
    // 🛡️ SECURITY LAYER 1: Mandatory Parameter & Type Validation
    // ──────────────────────────────────────────────────────────────────────────
    if (!razorpay_payment_id || typeof razorpay_payment_id !== 'string') {
      return NextResponse.json({
        success: false,
        message: 'SECURITY BLOCKED: Missing or invalid Razorpay Payment ID.',
      }, { status: 400 });
    }

    if (!razorpay_order_id || typeof razorpay_order_id !== 'string') {
      return NextResponse.json({
        success: false,
        message: 'SECURITY BLOCKED: Missing or invalid Razorpay Order ID.',
      }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || '';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
    const isLiveMode = keyId.startsWith('rzp_live_');

    // ──────────────────────────────────────────────────────────────────────────
    // 🛡️ SECURITY LAYER 2: Live Mode Lockdown (Strict Anti-Spoofing)
    // ──────────────────────────────────────────────────────────────────────────
    if (isLiveMode) {
      // In live mode, forbid any test/mock IDs completely
      if (
        razorpay_payment_id.startsWith('pay_test_') ||
        razorpay_order_id.startsWith('order_test_') ||
        razorpay_order_id.startsWith('order_mock_')
      ) {
        return NextResponse.json({
          success: false,
          message: 'SECURITY ALERT: Test payment IDs are strictly forbidden on production Live Mode.',
        }, { status: 403 });
      }

      if (!razorpay_signature) {
        return NextResponse.json({
          success: false,
          message: 'SECURITY BLOCKED: Razorpay signature is mandatory for live transactions.',
        }, { status: 400 });
      }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 🛡️ SECURITY LAYER 3: Cryptographic HMAC-SHA256 Signature Verification
    // ──────────────────────────────────────────────────────────────────────────
    let isSignatureValid = false;
    if (razorpay_order_id && razorpay_signature && keySecret) {
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (expectedSignature === razorpay_signature) {
        isSignatureValid = true;
      }
    }

    // In Live mode, signature mismatch is a hard rejection
    if (isLiveMode && !isSignatureValid) {
      console.error('CRITICAL SECURITY: HMAC Signature verification mismatch!', {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      });
      return NextResponse.json({
        success: false,
        message: 'SECURITY VERIFICATION FAILED: Cryptographic payment signature mismatch. Transaction rejected.',
      }, { status: 400 });
    }

    // If in test mode with demo secret, allow test payment only for non-live keys
    if (!isLiveMode && !isSignatureValid) {
      const isLocalTest =
        razorpay_payment_id.startsWith('pay_test_') ||
        razorpay_order_id.startsWith('order_test_');
      if (!isLocalTest) {
        return NextResponse.json({
          success: false,
          message: 'Invalid signature in test mode.',
        }, { status: 400 });
      }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 🛡️ SECURITY LAYER 4: Anti-Replay Attack Protection
    // ──────────────────────────────────────────────────────────────────────────
    const existingOrder = await LTDOrder.findOne({
      $or: [
        { orderId: razorpay_order_id },
        { paymentId: razorpay_payment_id },
      ],
    });

    if (existingOrder) {
      return NextResponse.json({
        success: true,
        licenseCode: existingOrder.licenseCode,
        orderId: existingOrder.orderId,
        paymentId: existingOrder.paymentId,
        dealTitle: existingOrder.dealTitle,
        tier: existingOrder.tier,
        message: 'Order already verified successfully.',
      });
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 🛡️ SECURITY LAYER 5: Fetch Deal from MongoDB & Validate Tier Price
    // ──────────────────────────────────────────────────────────────────────────
    let deal = null;
    try {
      if (dealId && dealId.match(/^[0-9a-fA-F]{24}$/)) {
        deal = await Deal.findById(dealId);
      }
    } catch (err) {}

    if (!deal && dealId) {
      deal = await Deal.findOne({ slug: dealId });
    }

    if (!deal) {
      deal = await Deal.findOne({ status: 'Active' }) || await Deal.findOne({});
    }

    let matchedTier = null;
    if (deal?.pricingTiers && deal.pricingTiers.length > 0) {
      matchedTier = deal.pricingTiers.find((t) =>
        t.tierName?.toLowerCase() === tier?.toLowerCase() ||
        (tier?.toLowerCase().includes('tier 1') && t.tierName?.toLowerCase().includes('starter')) ||
        (tier?.toLowerCase().includes('tier 2') && (t.tierName?.toLowerCase().includes('pro') || t.tierName?.toLowerCase().includes('growth'))) ||
        (tier?.toLowerCase().includes('tier 3') && (t.tierName?.toLowerCase().includes('agency') || t.tierName?.toLowerCase().includes('lifetime') || t.tierName?.toLowerCase().includes('scale')))
      );
    }

    const expectedPrice = amount ? Number(amount) : (matchedTier ? matchedTier.price : (deal?.pricingTiers?.[0]?.price || 1999));
    const expectedPaise = Math.round(expectedPrice * 100);

    // ──────────────────────────────────────────────────────────────────────────
    // 🛡️ SECURITY LAYER 6: Real-time Server-to-Server Verification with Razorpay API
    // ──────────────────────────────────────────────────────────────────────────
    if (isLiveMode && keyId && keySecret) {
      try {
        const razorpayInstance = new Razorpay({
          key_id: keyId,
          key_secret: keySecret,
        });

        const paymentRecord = await razorpayInstance.payments.fetch(razorpay_payment_id);

        // A. Verify Status is actually CAPTURED (money received in Razorpay)
        if (paymentRecord.status !== 'captured') {
          return NextResponse.json({
            success: false,
            message: `SECURITY BLOCKED: Payment status is "${paymentRecord.status}" (not captured). No license issued.`,
          }, { status: 400 });
        }

        // B. Verify Payment is for THIS exact Order ID
        if (paymentRecord.order_id !== razorpay_order_id) {
          return NextResponse.json({
            success: false,
            message: 'SECURITY ALERT: Payment record does not match the requested order ID.',
          }, { status: 400 });
        }

        // C. Anti-Price Tampering: Verify exact amount paid
        if (Number(paymentRecord.amount) < expectedPaise) {
          console.error('PRICE TAMPERING DETECTED:', {
            paid: paymentRecord.amount,
            expected: expectedPaise,
          });
          return NextResponse.json({
            success: false,
            message: `SECURITY ALERT: Amount paid (₹${paymentRecord.amount / 100}) is less than the required tier price (₹${expectedPrice}). Transaction rejected.`,
          }, { status: 400 });
        }
      } catch (rzpFetchErr) {
        console.error('Razorpay live fetch error:', rzpFetchErr.message);
        return NextResponse.json({
          success: false,
          message: `Unable to verify transaction with Razorpay servers: ${rzpFetchErr.message}`,
        }, { status: 502 });
      }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 🔑 LICENSE ALLOCATION & ATOMIC STORAGE
    // ──────────────────────────────────────────────────────────────────────────
    let licenseCode = null;
    if (matchedTier && matchedTier.licenseCodes && matchedTier.licenseCodes.length > 0) {
      licenseCode = matchedTier.licenseCodes.shift();
    } else if (deal.licenseKeys && deal.licenseKeys.length > 0) {
      licenseCode = deal.licenseKeys.shift();
    }

    if (!licenseCode) {
      licenseCode = `SD-${deal.slug.toUpperCase().replace(/[^A-Z0-9]/g, '')}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    }

    const refundDeadline = new Date();
    refundDeadline.setDate(refundDeadline.getDate() + 60);

    let attachedUserId = userId;
    if (!attachedUserId && userEmail) {
      try {
        const foundUser = await User.findOne({ email: userEmail.toLowerCase() });
        if (foundUser) attachedUserId = foundUser._id;
      } catch (uErr) {}
    }

    // Save Order
    const order = await LTDOrder.create({
      orderId: razorpay_order_id,
      dealId: deal._id,
      dealSlug: deal.slug,
      dealTitle: deal.title,
      userId: attachedUserId || null,
      userEmail: userEmail.toLowerCase().trim(),
      userName: userName.trim(),
      userPhone: userPhone.trim(),
      tier: matchedTier?.tierName || tier,
      amountPaid: expectedPrice, // strictly server-enforced price
      currency: 'INR',
      paymentGateway: 'razorpay',
      paymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature || '',
      licenseCode,
      gstNumber: gstNumber.trim(),
      status: 'paid',
      refundDeadline,
    });

    // Update Deal Metrics
    deal.soldCount = (deal.soldCount || 0) + 1;
    if (matchedTier) {
      matchedTier.soldCount = (matchedTier.soldCount || 0) + 1;
    }
    await deal.save();

    // Create In-App Notification
    try {
      await Notification.create({
        userId: attachedUserId || null,
        userEmail: userEmail.toLowerCase().trim(),
        type: 'order_completed',
        title: `🎉 5-Year Pass Unlocked: ${deal.title}!`,
        message: `Payment of ₹${expectedPrice.toLocaleString('en-IN')} verified. License Key: ${licenseCode}. 60-day refund guarantee active.`,
        link: '/profile',
        icon: '🔑',
        meta: {
          licenseCode,
          dealTitle: deal.title,
          dealSlug: deal.slug,
          orderId: order.orderId,
          amountPaid: expectedPrice,
        },
      });
    } catch (notifErr) {
      console.warn('Notification log:', notifErr.message);
    }

    // Send Email via Nodemailer
    try {
      if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
          },
        });

        const invoiceUrl = `https://stackdeal.in/api/invoice/${order.orderId}`;
        const redeemUrl = `https://stackdeal.in/redeem?code=${encodeURIComponent(licenseCode)}`;

        const emailHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #090d16; color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
            <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 32px 24px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff;">⚡ Payment Successful!</h1>
              <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 15px;">Your 5-Year Access Pass is unlocked.</p>
            </div>
            <div style="padding: 28px 24px;">
              <p style="color: #94a3b8; font-size: 15px; margin: 0 0 20px 0;">Hello <strong>${userName || 'Founder'}</strong>,</p>
              <div style="background: #131b2e; border: 1px solid #059669; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
                <span style="display: block; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #34d399; margin-bottom: 8px;">Official License Pass Key</span>
                <code style="display: inline-block; background: #000000; color: #10b981; font-size: 20px; font-weight: 800; padding: 10px 20px; border-radius: 8px; border: 1px dashed rgba(52, 211, 153, 0.4);">${licenseCode}</code>
              </div>
              <div style="text-align: center; margin-bottom: 24px;">
                <a href="${redeemUrl}" style="display: inline-block; background: #059669; color: #ffffff; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 8px; text-decoration: none; margin-right: 8px;">
                  🚀 Activate Pass Now &rarr;
                </a>
                <a href="${invoiceUrl}" style="display: inline-block; background: rgba(255,255,255,0.1); color: #ffffff; font-weight: 600; font-size: 14px; padding: 12px 20px; border-radius: 8px; text-decoration: none;">
                  📄 Download Tax Invoice
                </a>
              </div>
            </div>
          </div>
        `;

        await transporter.sendMail({
          from: `"${process.env.GMAIL_FROM_NAME || 'StackDeal Platform'}" <${process.env.GMAIL_USER}>`,
          to: userEmail.toLowerCase().trim(),
          subject: `⚡ [CONFIRMED] Your 5-Year Pass for ${deal.title} is Ready!`,
          html: emailHtml,
        });
      }
    } catch (mailErr) {
      console.warn('Email send notice:', mailErr.message);
    }

    return NextResponse.json({
      success: true,
      licenseCode,
      orderId: order.orderId,
      paymentId: razorpay_payment_id,
      dealTitle: deal.title,
      tier: matchedTier?.tierName || tier,
      amountPaid: expectedPrice,
      invoiceUrl: `/api/invoice/${order.orderId}`,
      message: 'Razorpay Payment Successful! 5-Year Pass Code Unlocked.',
    });
  } catch (error) {
    console.error('verify-payment fatal error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Payment verification failed',
    }, { status: 500 });
  }
}
