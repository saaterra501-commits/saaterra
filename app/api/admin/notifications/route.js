import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Deal from '@/models/Deal';
import ContactMessage from '@/models/ContactMessage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let pendingDeals = [];
    let pendingInquiries = [];

    // Check MongoDB for Pending deals & unread Contact Inquiries
    try {
      const conn = await dbConnect();
      if (conn) {
        // 1. Pending Deals awaiting QA Approval
        pendingDeals = await Deal.find({ status: 'Pending' })
          .sort({ createdAt: -1 })
          .lean();

        // 2. Only 'New' unread Contact Messages (NOT already in review or resolved)
        pendingInquiries = await ContactMessage.find({ status: 'New' })
          .sort({ createdAt: -1 })
          .lean();
      }
    } catch (err) {
      console.warn('MongoDB notifications count error:', err.message);
    }

    const dealNotifs = pendingDeals.map((deal) => ({
      id: 'notif-deal-' + (deal.slug || deal._id),
      type: 'vendor_submission',
      title: `New Vendor Listing: ${deal.vendorName || deal.title}`,
      message: `${deal.vendorName || 'Vendor'} submitted "${deal.title}" for QA verification. Review & Approve.`,
      link: `/sd-ops-vault-9839/deals`,
      slug: deal.slug,
      time: deal.createdAt ? new Date(deal.createdAt).toISOString() : new Date().toISOString(),
      isRead: false,
    }));

    const inquiryNotifs = pendingInquiries.map((inq) => ({
      id: 'notif-inq-' + (inq.ticketId || inq._id),
      type: 'contact_inquiry',
      title: `📩 Support Inquiry: ${inq.name}`,
      message: `[${inq.ticketId}] "${inq.subject}" — ${inq.message.slice(0, 75)}...`,
      link: `/sd-ops-vault-9839/inbox`,
      ticketId: inq.ticketId,
      time: inq.createdAt ? new Date(inq.createdAt).toISOString() : new Date().toISOString(),
      isRead: false,
    }));

    // In-Memory admin notifications
    const memoryNotifs = (global.ADMIN_NOTIFICATIONS || []).filter((n) => !n.isRead);

    // Combine and sort by date descending
    const allNotifs = [...inquiryNotifs, ...dealNotifs, ...memoryNotifs].sort(
      (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
    );

    const pendingDealsCount = pendingDeals.length;
    const pendingInquiriesCount = pendingInquiries.length;
    const totalPending = pendingDealsCount + pendingInquiriesCount + memoryNotifs.length;

    return NextResponse.json({
      success: true,
      pendingCount: totalPending,
      pendingDealsCount,
      pendingInquiriesCount,
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
      // Mark all new contact messages as in review / read
      await ContactMessage.updateMany({ status: 'New' }, { status: 'In Review' });
      if (global.ADMIN_NOTIFICATIONS) {
        global.ADMIN_NOTIFICATIONS = global.ADMIN_NOTIFICATIONS.map((n) => ({ ...n, isRead: true }));
      }
    } else if (ticketId) {
      await ContactMessage.updateOne({ ticketId }, { status: 'In Review' });
    } else if (notifId && global.ADMIN_NOTIFICATIONS) {
      global.ADMIN_NOTIFICATIONS = global.ADMIN_NOTIFICATIONS.map((n) =>
        n.id === notifId ? { ...n, isRead: true } : n
      );
    }

    return NextResponse.json({ success: true, message: 'Notifications marked as read' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    // Resolve all contact messages and clear in-memory notifications
    await ContactMessage.updateMany({}, { status: 'Resolved' });
    global.ADMIN_NOTIFICATIONS = [];

    return NextResponse.json({ success: true, message: 'All admin activity alerts cleared' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
