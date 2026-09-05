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
    const queryEmail = searchParams.get('email')?.toLowerCase()?.trim();
    const userEmail = authUser?.email?.toLowerCase()?.trim() || queryEmail;

    // If user is not logged in and has no email, return empty
    if (!userEmail && !authUser?.userId) {
      return NextResponse.json({ success: true, notifications: [] });
    }

    const notifs = [];
    const seenKeys = new Set();
    await dbConnect();

    const safeEmailRegex = userEmail
      ? new RegExp('^' + userEmail.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + '$', 'i')
      : null;

    // 1. PERSISTED NOTIFICATIONS from MongoDB Notification collection
    try {
      const orConditions = [];
      if (safeEmailRegex) {
        orConditions.push({ userEmail: safeEmailRegex });
      }
      if (authUser?.userId) {
        orConditions.push({ userId: authUser.userId });
      }

      if (orConditions.length > 0) {
        const dbNotifs = await Notification.find({ $or: orConditions })
          .sort({ createdAt: -1 })
          .limit(40)
          .lean();

        for (const n of dbNotifs) {
          const key = (n.meta?.slug ? `deal-${n.type}-${n.meta.slug}` : n._id.toString());
          seenKeys.add(key);
          notifs.push({
            id: n._id.toString(),
            type: n.type,
            title: n.title,
            message: n.message,
            link: n.link || (n.meta?.slug ? `/deals/${n.meta.slug}` : '/profile'),
            icon: n.icon || (n.type === 'submission_approved' ? '🎉' : n.type === 'submission_rejected' ? '⚠️' : '🔔'),
            time: n.createdAt ? new Date(n.createdAt).toISOString() : new Date().toISOString(),
            isRead: Boolean(n.isRead),
            meta: n.meta || {},
          });
        }
      }
    } catch (dbNotifErr) {
      console.warn('Error querying MongoDB notifications:', dbNotifErr.message);
    }

    // 2. BUYER NOTIFICATIONS: Fetch real purchased 5-Year Passes for this user
    if (safeEmailRegex) {
      try {
        const userOrders = await LTDOrder.find({
          userEmail: safeEmailRegex,
          status: 'paid',
        })
          .sort({ createdAt: -1 })
          .limit(10)
          .lean();

        for (const ord of userOrders) {
          const key = `order-${ord._id}`;
          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            notifs.push({
              id: 'ord-notif-' + ord._id,
              type: 'order_completed',
              title: `🎟️ 5-Year Pass Activated: ${ord.dealTitle || 'Software Pass'}`,
              message: `Your lifetime pass is active! Unique License Code: ${ord.licenseCode || 'Generated'}. Redeem on vendor site.`,
              link: '/profile',
              icon: '🎟️',
              time: ord.purchasedAt ? new Date(ord.purchasedAt).toISOString() : new Date(ord.createdAt).toISOString(),
              isRead: false,
            });
          }
        }
      } catch (ordErr) {
        console.warn('Error querying user orders for notifications:', ordErr.message);
      }
    }

    // 3. VENDOR NOTIFICATIONS: Dynamic fallback for SaaS listings submitted by this specific user
    try {
      const dealQuery = [];
      if (safeEmailRegex) {
        dealQuery.push(
          { 'founderContact.email': safeEmailRegex },
          { founderEmail: safeEmailRegex },
          { vendorEmail: safeEmailRegex }
        );
      }
      if (authUser?.userId) {
        dealQuery.push({ userId: authUser.userId });
      }

      if (dealQuery.length > 0) {
        const userDeals = await Deal.find({ $or: dealQuery })
          .sort({ updatedAt: -1 })
          .lean();

        for (const deal of userDeals) {
          const approvedKey = `deal-submission_approved-${deal.slug}`;
          const pendingKey = `deal-submission_pending-${deal.slug}`;

          if (deal.status === 'Active' && !seenKeys.has(approvedKey)) {
            seenKeys.add(approvedKey);
            notifs.push({
              id: 'deal-live-' + deal.slug,
              type: 'submission_approved',
              title: `🎉 Software Approved & Live: ${deal.title}`,
              message: `Your software "${deal.title}" has passed QA verification and is now LIVE on StackDeal marketplace!`,
              link: `/deals/${deal.slug}`,
              slug: deal.slug,
              icon: '🎉',
              time: deal.launchDate ? new Date(deal.launchDate).toISOString() : new Date(deal.updatedAt || deal.createdAt).toISOString(),
              isRead: false,
            });
          } else if (deal.status === 'Pending' && !seenKeys.has(pendingKey)) {
            seenKeys.add(pendingKey);
            notifs.push({
              id: 'deal-pend-' + deal.slug,
              type: 'submission_pending',
              title: `⏳ Submission Under QA Review: ${deal.title}`,
              message: `Your software "${deal.title}" was submitted successfully and is currently under QA verification.`,
              link: `/deals/${deal.slug}`,
              slug: deal.slug,
              icon: '⏳',
              time: deal.createdAt ? new Date(deal.createdAt).toISOString() : new Date().toISOString(),
              isRead: false,
            });
          }

          // Direct Customer Questions for this Founder
          if (deal.questions && Array.isArray(deal.questions)) {
            for (const q of deal.questions.slice(0, 5)) {
              const qKey = `q-${deal.slug}-${q._id || q.question}`;
              if (!seenKeys.has(qKey)) {
                seenKeys.add(qKey);
                notifs.push({
                  id: 'q-notif-' + (q._id || Math.random().toString(36).slice(2)),
                  type: 'customer_question',
                  title: `💬 Question on ${deal.title} from ${q.userName || 'Buyer'}`,
                  message: `"${(q.question || '').slice(0, 90)}..."`,
                  link: `/deals/${deal.slug}`,
                  icon: '💬',
                  time: q.createdAt ? new Date(q.createdAt).toISOString() : new Date().toISOString(),
                  isRead: false,
                });
              }
            }
          }
        }
      }
    } catch (dealErr) {
      console.warn('Error querying user deals for notifications:', dealErr.message);
    }

    // 4. In-Memory fallback for immediate same-session reactivity
    if (global.VENDOR_NOTIFICATIONS && global.VENDOR_NOTIFICATIONS.length > 0 && userEmail) {
      const matched = global.VENDOR_NOTIFICATIONS.filter(
        (n) => n.userEmail && n.userEmail.toLowerCase() === userEmail
      );
      for (const m of matched) {
        const memKey = m.slug ? `deal-${m.type}-${m.slug}` : m.id;
        if (!seenKeys.has(memKey) && !seenKeys.has(m.id)) {
          seenKeys.add(memKey);
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
    const { notifId, markAllRead, email } = await req.json();
    const authUser = await getAuthUser();
    const targetEmail = authUser?.email?.toLowerCase()?.trim() || email?.toLowerCase()?.trim();

    await dbConnect();

    if (markAllRead) {
      const matchCriteria = [];
      if (targetEmail) {
        const safeEmailRegex = new RegExp('^' + targetEmail.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + '$', 'i');
        matchCriteria.push({ userEmail: safeEmailRegex });
      }
      if (authUser?.userId) {
        matchCriteria.push({ userId: authUser.userId });
      }

      if (matchCriteria.length > 0) {
        try {
          await Notification.updateMany({ $or: matchCriteria }, { isRead: true, readAt: new Date() });
        } catch (e) {
          console.warn('Error marking DB notifications read:', e.message);
        }
      }

      if (global.VENDOR_NOTIFICATIONS) {
        global.VENDOR_NOTIFICATIONS = global.VENDOR_NOTIFICATIONS.map((n) =>
          !targetEmail || (n.userEmail && n.userEmail.toLowerCase() === targetEmail)
            ? { ...n, isRead: true }
            : n
        );
      }
    } else if (notifId) {
      try {
        await Notification.findByIdAndUpdate(notifId, { isRead: true, readAt: new Date() });
      } catch (e) {}

      if (global.VENDOR_NOTIFICATIONS) {
        global.VENDOR_NOTIFICATIONS = global.VENDOR_NOTIFICATIONS.map((n) =>
          n.id === notifId ? { ...n, isRead: true } : n
        );
      }
    }

    return NextResponse.json({ success: true, message: 'Notifications marked as read' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const authUser = await getAuthUser();
    const { searchParams } = new URL(req.url);
    const queryEmail = searchParams.get('email')?.toLowerCase()?.trim();
    const targetEmail = authUser?.email?.toLowerCase()?.trim() || queryEmail;

    await dbConnect();

    const matchCriteria = [];
    if (targetEmail) {
      const safeEmailRegex = new RegExp('^' + targetEmail.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + '$', 'i');
      matchCriteria.push({ userEmail: safeEmailRegex });
    }
    if (authUser?.userId) {
      matchCriteria.push({ userId: authUser.userId });
    }

    if (matchCriteria.length > 0) {
      try {
        await Notification.deleteMany({ $or: matchCriteria });
      } catch (e) {
        console.warn('Error deleting DB notifications:', e.message);
      }
    }

    if (global.VENDOR_NOTIFICATIONS) {
      if (targetEmail) {
        global.VENDOR_NOTIFICATIONS = global.VENDOR_NOTIFICATIONS.filter(
          (n) => n.userEmail && n.userEmail.toLowerCase() !== targetEmail
        );
      } else {
        global.VENDOR_NOTIFICATIONS = [];
      }
    }

    return NextResponse.json({ success: true, message: 'All notifications cleared successfully' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
