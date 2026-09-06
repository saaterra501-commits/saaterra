import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import LTDOrder from '@/models/LTDOrder';
import Deal from '@/models/Deal';

export async function POST(req) {
  try {
    await dbConnect();
    const { code } = await req.json();

    if (!code || !code.trim()) {
      return NextResponse.json({ success: false, message: 'Please enter a valid license code.' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();

    // Look up order by license code
    const order = await LTDOrder.findOne({ licenseCode: cleanCode });

    if (!order) {
      return NextResponse.json({
        success: false,
        message: 'License code not found in our database. Please double-check your code or invoice.',
      }, { status: 404 });
    }

    // Look up deal for vendor portal URL
    let deal = null;
    if (order.dealId) {
      deal = await Deal.findById(order.dealId);
    } else if (order.dealSlug) {
      deal = await Deal.findOne({ slug: order.dealSlug });
    }

    const isAlreadyRedeemed = !!order.isRedeemed;

    if (!order.isRedeemed) {
      order.isRedeemed = true;
      order.redeemedAt = new Date();
      await order.save();
    }

    return NextResponse.json({
      success: true,
      isAlreadyRedeemed,
      licenseCode: order.licenseCode,
      dealTitle: order.dealTitle || deal?.title || '5-Year SaaS Pass',
      tier: order.tier || 'Starter Pass',
      purchasedAt: order.purchasedAt,
      vendorWebsite: deal?.websiteUrl || '',
      message: isAlreadyRedeemed
        ? 'License code is already activated and verified.'
        : 'License successfully activated! Your 5-Year Pass is live.',
    });
  } catch (error) {
    console.error('Redeem API error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
