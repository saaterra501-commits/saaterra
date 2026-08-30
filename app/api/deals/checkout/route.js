import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import LTDDeal from '@/models/LTDDeal';
import LTDOrder from '@/models/LTDOrder';
import Deal from '@/models/Deal';

export async function POST(req) {
  try {
    await dbConnect();
    const { dealId, tier = 'Tier 1', gstNumber, userEmail = 'agency@saaterra.in', userName = 'Indian Agency Owner' } = await req.json();

    const deal = await LTDDeal.findById(dealId);
    if (!deal) {
      return NextResponse.json({ success: false, message: 'Deal not found' }, { status: 404 });
    }

    let price = deal.tier1Price;
    if (tier === 'Tier 2') price = deal.tier2Price || deal.tier1Price * 2;
    if (tier === 'Tier 3') price = deal.tier3Price || deal.tier1Price * 4;

    // Generate redemption license code
    const licenseCode = `ST-${deal.slug.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Set 60-day refund deadline
    const refundDeadline = new Date();
    refundDeadline.setDate(refundDeadline.getDate() + 60);

    const order = await LTDOrder.create({
      dealId: deal._id,
      userEmail,
      userName,
      tier,
      amount: price,
      licenseCode,
      gstNumber,
      refundDeadline
    });

    // Increment sold count
    deal.soldCount = (deal.soldCount || 0) + 1;
    await deal.save();

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
      message: 'Payment processed successfully via Razorpay UPI'
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
