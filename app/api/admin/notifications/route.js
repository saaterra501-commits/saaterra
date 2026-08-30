import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Deal from '@/models/Deal';
import ContactMessage from '@/models/ContactMessage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let pendingCount = 0;
    let pendingDeals = [];
    let pendingInquiries = [];

    // Check MongoDB for Pending deals & Contact Inquiries
    try {
      const conn = await dbConnect();
      if (conn) {
        // 1. Pending Deals
        pendingDeals = await Deal.find({ status: 'Pending' })
          .sort({ createdAt: -1 })
          .lean();

        // 2. New Contact Messages / Support Inquiries
        pendingInquiries = await ContactMessage.find({
          status: { $in: ['New', 'In Review'] },
        })
          .sort({ createdAt: -1 })
          .lean();

        pendingCount = pendingDeals.length + pendingInquiries.length;
      }
    } catch (err) {
      console.warn('MongoDB notifications count error:', err.message);
    }

    const dealNotifs = pendingDeals.map((deal) => ({
      id: 'notif-deal-' + (deal.slug || deal._id),
      type: 'vendor_submission',
      title: `New Vendor Listing: ${deal.vendorName || deal.title}`,
      message: `${deal.vendorName || 'Vendor'} submitted "${deal.title}" for QA verification.`,
      link: `/sd-ops-vault-9839/qa`,
      slug: deal.slug,
      time: deal.createdAt ? new Date(deal.createdAt).toISOString() : new Date().toISOString(),
      isRead: false,
    }));

    const inquiryNotifs = pendingInquiries.map((inq) => ({
      id: 'notif-inq-' + (inq.ticketId || inq._id),
      type: 'contact_inquiry',
      title: `📩 New Support Inquiry: ${inq.name}`,
      message: `[${inq.ticketId}] "${inq.subject}" — ${inq.message.slice(0, 75)}...`,
      link: `/sd-ops-vault-9839/inbox`,
      ticketId: inq.ticketId,
      time: inq.createdAt ? new Date(inq.createdAt).toISOString() : new Date().toISOString(),
      isRead: false,
    }));

    // Combine and sort by date descending
    const allNotifs = [...inquiryNotifs, ...dealNotifs].sort(
      (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
    );

    return NextResponse.json({
      success: true,
      pendingCount,
      notifications: allNotifs,
    });
  } catch (err) {
    console.error('API Admin Notifications Error:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { notifId, ticketId, markAllRead } = await req.json();
    await dbConnect();

    if (markAllRead) {
      await ContactMessage.updateMany({ status: 'New' }, { status: 'In Review' });
    } else if (ticketId) {
      await ContactMessage.updateOne({ ticketId }, { status: 'In Review' });
    }

    return NextResponse.json({ success: true, message: 'Notifications updated' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
