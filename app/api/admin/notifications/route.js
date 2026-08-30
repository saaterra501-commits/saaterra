import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Deal from '@/models/Deal';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let pendingCount = 0;
    let pendingDeals = [];

    // 1. Check MongoDB for Pending deals
    try {
      const conn = await dbConnect();
      if (conn) {
        pendingDeals = await Deal.find({ status: 'Pending' }).sort({ createdAt: -1 }).lean();
        pendingCount = pendingDeals.length;
      }
    } catch (err) {
      console.warn('MongoDB pending deals count error:', err.message);
    }

    // 2. Check in-memory STORED_DEALS
    if (global.STORED_DEALS) {
      const memoryPending = global.STORED_DEALS.filter((d) => d.status === 'Pending');
      const existingSlugs = new Set(pendingDeals.map((d) => d.slug));
      for (const mem of memoryPending) {
        if (!existingSlugs.has(mem.slug)) {
          pendingDeals.push(mem);
          pendingCount++;
        }
      }
    }

    const notifications = (global.ADMIN_NOTIFICATIONS && global.ADMIN_NOTIFICATIONS.length > 0)
      ? global.ADMIN_NOTIFICATIONS
      : pendingDeals.map((deal) => ({
          id: 'notif-' + deal.slug,
          type: 'vendor_submission',
          title: `New Vendor Listing: ${deal.vendorName || deal.title}`,
          message: `${deal.vendorName || 'Vendor'} submitted "${deal.title}" for QA verification.`,
          slug: deal.slug,
          time: deal.createdAt ? new Date(deal.createdAt).toISOString() : new Date().toISOString(),
          isRead: false,
        }));

    return NextResponse.json({
      success: true,
      pendingCount,
      notifications,
    });
  } catch (err) {
    console.error('API Admin Notifications Error:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { notifId, markAllRead } = await req.json();

    if (markAllRead && global.ADMIN_NOTIFICATIONS) {
      global.ADMIN_NOTIFICATIONS = global.ADMIN_NOTIFICATIONS.map((n) => ({ ...n, isRead: true }));
    } else if (notifId && global.ADMIN_NOTIFICATIONS) {
      global.ADMIN_NOTIFICATIONS = global.ADMIN_NOTIFICATIONS.map((n) =>
        n.id === notifId ? { ...n, isRead: true } : n
      );
    }

    return NextResponse.json({ success: true, message: 'Notifications updated' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
