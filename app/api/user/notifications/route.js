import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Notification from '@/models/Notification';
import Deal from '@/models/Deal';
import LTDOrder from '@/models/LTDOrder';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const authUser = await getAuthUser();
    const { searchParams } = new URL(req.url);
    const queryEmail = searchParams.get('email')?.toLowerCase();
    const userEmail = authUser?.email?.toLowerCase() || queryEmail;

    // If user is not logged in and has no email, return zero notifications
    if (!userEmail) {
      return NextResponse.json({ success: true, notifications: [] });
    }

    const notifs = [];
    await dbConnect();

    // 1. BUYER NOTIFICATIONS: Fetch real purchased 5-Year Passes for this user
    try {
      const userOrders = await LTDOrder.find({
        userEmail: userEmail,
        status: 'paid',
      })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

      for (const ord of userOrders) {
        notifs.push({
          id: 'ord-notif-' + ord._id,
          type: 'order_completed',
          title: `🎟️ 5-Year Pass Activated: ${ord.dealTitle || 'Software Pass'}`,
          message: `Your lifetime pass is active! Unique License Code: ${ord.licenseCode || 'Generated'}. Redeem on vendor site.`,
          link: '/profile',
          time: ord.purchasedAt ? new Date(ord.purchasedAt).toISOString() : new Date(ord.createdAt).toISOString(),
          isRead: false,
        });
      }
    } catch (ordErr) {
      console.warn('Error querying user orders for notifications:', ordErr.message);
    }

    // 2. VENDOR NOTIFICATIONS: Fetch real SaaS listings submitted by this specific user
    try {
      const userDeals = await Deal.find({
        $or: [
          { 'founderContact.email': userEmail },
          { founderEmail: userEmail },
          { vendorEmail: userEmail },
          ...(authUser?.userId ? [{ userId: authUser.userId }] : []),
        ],
      })
        .sort({ updatedAt: -1 })
        .lean();

      for (const deal of userDeals) {
        if (deal.status === 'Active') {
          notifs.push({
            id: 'deal-live-' + deal.slug,
            type: 'submission_approved',
            title: `🎉 Software Approved & Live: ${deal.title}`,
            message: `Your software "${deal.title}" has passed QA verification and is now LIVE on StackDeal marketplace!`,
            link: `/deals/${deal.slug}`,
            slug: deal.slug,
            time: deal.launchDate ? new Date(deal.launchDate).toISOString() : new Date(deal.updatedAt || deal.createdAt).toISOString(),
            isRead: false,
          });
        } else if (deal.status === 'Pending') {
          notifs.push({
            id: 'deal-pend-' + deal.slug,
            type: 'submission_pending',
            title: `⏳ Submission Under QA Review: ${deal.title}`,
            message: `Your software "${deal.title}" was submitted successfully and is currently under QA verification.`,
            link: `/deals/${deal.slug}`,
            slug: deal.slug,
            time: deal.createdAt ? new Date(deal.createdAt).toISOString() : new Date().toISOString(),
            isRead: false,
          });
        }

        // 3. Direct Customer Questions for this Founder
        if (deal.questions && Array.isArray(deal.questions)) {
          for (const q of deal.questions.slice(0, 5)) {
            notifs.push({
              id: 'q-notif-' + (q._id || Math.random().toString(36).slice(2)),
              type: 'customer_question',
              title: `💬 Question on ${deal.title} from ${q.userName || 'Buyer'}`,
              message: `"${(q.question || '').slice(0, 90)}..."`,
              link: `/deals/${deal.slug}`,
              time: q.createdAt ? new Date(q.createdAt).toISOString() : new Date().toISOString(),
              isRead: false,
            });
          }
        }
      }
    } catch (dealErr) {
      console.warn('Error querying user deals for notifications:', dealErr.message);
    }

    // 4. In-Memory vendor notifications for this user
    if (global.VENDOR_NOTIFICATIONS && global.VENDOR_NOTIFICATIONS.length > 0) {
      const matched = global.VENDOR_NOTIFICATIONS.filter(
        (n) => n.userEmail && n.userEmail.toLowerCase() === userEmail
      );
      const existingIds = new Set(notifs.map((n) => n.id));
      for (const m of matched) {
        if (!existingIds.has(m.id)) {
          notifs.push(m);
        }
      }
    }

    // Sort by timestamp descending
    notifs.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    return NextResponse.json({
      success: true,
      notifications: notifs,
    });
  } catch (err) {
    console.error('API User Notifications Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { notifId, markAllRead } = await req.json();

    if (markAllRead) {
      if (global.VENDOR_NOTIFICATIONS) {
        global.VENDOR_NOTIFICATIONS = global.VENDOR_NOTIFICATIONS.map((n) => ({ ...n, isRead: true }));
      }
    } else if (notifId && global.VENDOR_NOTIFICATIONS) {
      global.VENDOR_NOTIFICATIONS = global.VENDOR_NOTIFICATIONS.map((n) =>
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
    global.VENDOR_NOTIFICATIONS = [];
    return NextResponse.json({ success: true, message: 'All notifications cleared successfully' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
