import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Deal from '@/models/Deal';
import LTDOrder from '@/models/LTDOrder';
import User from '@/models/User';
import ContactMessage from '@/models/ContactMessage';
import Review from '@/models/Review';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized admin' }, { status: 403 });
    }

    await dbConnect();

    // 1. Fetch Orders & Calculate Real GMV
    let orders = [];
    let grossGMV = 0;
    try {
      orders = await LTDOrder.find().sort({ createdAt: -1 }).limit(50).lean();
      grossGMV = orders
        .filter((o) => o.status === 'paid')
        .reduce((sum, o) => sum + (Number(o.amountPaid) || 0), 0);
    } catch (e) {
      console.warn('Orders query warning:', e.message);
    }

    const netRevenue = Math.round(grossGMV * 0.3);
    const vendorPayouts = Math.round(grossGMV * 0.7);

    // 2. Fetch Real Deals Counts
    let activeDealsCount = 0;
    let pendingDealsCount = 0;
    let pendingDeals = [];
    try {
      activeDealsCount = await Deal.countDocuments({
        $or: [{ status: 'Active' }, { status: { $exists: false } }],
      });
      pendingDeals = await Deal.find({ status: 'Pending' }).lean();
      pendingDealsCount = pendingDeals.length;
    } catch (e) {
      console.warn('Deals query warning:', e.message);
    }

    // 3. Fetch Real Users & VIPs
    let totalUsers = 0;
    let vipMembers = [];
    try {
      totalUsers = await User.countDocuments({});
      vipMembers = await User.find({ isPlusMember: true })
        .select('name email plusTier plusExpiresAt createdAt')
        .lean();
    } catch (e) {
      console.warn('Users query warning:', e.message);
    }

    // 4. Fetch Real Inquiries
    let totalInquiries = 0;
    try {
      totalInquiries = await ContactMessage.countDocuments({});
    } catch (e) {
      console.warn('Inquiries count warning:', e.message);
    }

    // 5. Fetch Real Reviews
    let reviews = [];
    try {
      reviews = await Review.find().sort({ createdAt: -1 }).limit(20).lean();
    } catch (e) {
      console.warn('Reviews query warning:', e.message);
    }

    return NextResponse.json({
      success: true,
      metrics: {
        grossGMV: `₹${grossGMV.toLocaleString('en-IN')}`,
        grossGMVRaw: grossGMV,
        netRevenue: `₹${netRevenue.toLocaleString('en-IN')}`,
        vendorPayouts: `₹${vendorPayouts.toLocaleString('en-IN')}`,
        activeDealsCount: `${activeDealsCount} Deals`,
        pendingDealsCount: `${pendingDealsCount} Pending`,
        totalUsers,
        totalInquiries,
      },
      orders: orders || [],
      pendingDeals: pendingDeals || [],
      vipMembers: vipMembers || [],
      reviews: reviews || [],
    });
  } catch (err) {
    console.error('Admin overview API error:', err);
    return NextResponse.json({ error: 'Failed to load admin overview' }, { status: 500 });
  }
}
