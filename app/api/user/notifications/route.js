import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Notification from '@/models/Notification';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email')?.toLowerCase();

    let notifs = [];

    // 1. Fetch vendor notifications from global in-memory store
    if (global.VENDOR_NOTIFICATIONS && global.VENDOR_NOTIFICATIONS.length > 0) {
      notifs = [...global.VENDOR_NOTIFICATIONS];
      if (email) {
        notifs = notifs.filter((n) => !n.userEmail || n.userEmail.toLowerCase() === email);
      }
    }

    // 2. Fetch from MongoDB Notification collection (Excluding any legacy cashback entries)
    try {
      const conn = await dbConnect();
      if (conn) {
        const query = {
          type: { $nin: ['cashback_approved', 'cashback_rejected', 'cashback', 'voucher'] },
          title: { $not: /cashback/i },
          message: { $not: /cashback/i },
          ...(email ? { $or: [{ userEmail: email }, { userEmail: '' }, { userEmail: { $exists: false } }] } : {}),
        };

        const dbNotifs = await Notification.find(query).sort({ createdAt: -1 }).limit(20).lean();
        if (dbNotifs && dbNotifs.length > 0) {
          const existingIds = new Set(notifs.map((n) => n.id));
          for (const dbN of dbNotifs) {
            if (!existingIds.has(String(dbN._id))) {
              notifs.push({
                id: String(dbN._id),
                title: dbN.title,
                message: dbN.message,
                type: dbN.type,
                link: dbN.link,
                time: dbN.createdAt ? new Date(dbN.createdAt).toISOString() : new Date().toISOString(),
                isRead: dbN.isRead,
              });
            }
          }
        }
      }
    } catch (err) {
      console.warn('MongoDB user notifications fetch error:', err.message);
    }

    // 3. Strict JS filter to guarantee ZERO cashback / voucher notifications
    notifs = notifs.filter((n) => {
      const type = (n.type || '').toLowerCase();
      const title = (n.title || '').toLowerCase();
      const msg = (n.message || '').toLowerCase();
      if (type.includes('cashback') || type === 'voucher') return false;
      if (title.includes('cashback') || msg.includes('cashback')) return false;
      return true;
    });

    // Fallback sample notifications if empty
    if (notifs.length === 0) {
      notifs = [
        {
          id: 'notif-welcome',
          title: '🎉 Welcome to StackDeal!',
          message: 'Explore 5-Year Access Passes for top software or list your own SaaS with 70% revenue share.',
          type: 'general',
          link: '/deals',
          time: new Date().toISOString(),
          isRead: false,
        },
      ];
    }

    return NextResponse.json({ success: true, notifications: notifs });
  } catch (err) {
    console.error('API User Notifications Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { notifId, markAllRead } = await req.json();

    if (markAllRead && global.VENDOR_NOTIFICATIONS) {
      global.VENDOR_NOTIFICATIONS = global.VENDOR_NOTIFICATIONS.map((n) => ({ ...n, isRead: true }));
    } else if (notifId && global.VENDOR_NOTIFICATIONS) {
      global.VENDOR_NOTIFICATIONS = global.VENDOR_NOTIFICATIONS.map((n) =>
        n.id === notifId ? { ...n, isRead: true } : n
      );
    }

    return NextResponse.json({ success: true, message: 'Notification marked as read' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
