import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import LTDOrder from '@/models/LTDOrder';
import Deal from '@/models/Deal';
import LTDDeal from '@/models/LTDDeal';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const authUser = await getAuthUser();
    if (!authUser || !authUser.email) {
      return NextResponse.json({ success: true, orders: [] });
    }

    await dbConnect();

    // Query ONLY paid orders matching the authenticated user's email
    const orders = await LTDOrder.find({
      userEmail: authUser.email.toLowerCase(),
      status: 'paid',
    })
      .sort({ createdAt: -1 })
      .lean();

    if (!orders || orders.length === 0) {
      return NextResponse.json({ success: true, orders: [] });
    }

    // Enhance orders with real deal details
    const enhancedOrders = await Promise.all(
      orders.map(async (order) => {
        let deal = null;
        if (order.dealId) {
          deal = await Deal.findById(order.dealId).lean();
          if (!deal) {
            deal = await LTDDeal.findById(order.dealId).lean();
          }
        }

        return {
          _id: order._id,
          orderId: order.orderId || `ord_${order._id.toString().slice(-6)}`,
          dealTitle: deal?.title || order.dealTitle || '5-Year SaaS Access Pass',
          dealSlug: deal?.slug || '',
          tierTitle: order.tier || 'Standard Tier',
          redemptionCode: order.licenseCode,
          purchasedAt: order.purchasedAt || order.createdAt,
          totalAmount: order.amountPaid || order.amount,
          vendorRedeemUrl: deal?.vendorRedeemUrl || '/redeem',
          paymentStatus: order.status === 'paid' ? 'PAID' : 'PENDING',
          gstNumber: order.gstNumber || '',
        };
      })
    );

    return NextResponse.json({ success: true, orders: enhancedOrders });
  } catch (error) {
    console.error('Error fetching user deals:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
