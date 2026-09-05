import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Deal from '@/models/Deal';
import Notification from '@/models/Notification';
import User from '@/models/User';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    const conn = await dbConnect();
    if (conn) {
      const dealsFromDb = await Deal.find({}).sort({ createdAt: -1 });
      if (dealsFromDb && dealsFromDb.length > 0) {
        return NextResponse.json({ success: true, deals: dealsFromDb });
      }
    }
  } catch (err) {
    console.warn('DB fetch error:', err.message);
  }

  return NextResponse.json({ success: true, deals: global.STORED_DEALS || [] });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const dealStatus = body.status || 'Pending';

    const founderEmail = (body.founderEmail || body.founderContact?.email || body.vendorEmail || '').trim().toLowerCase();
    const founderPhone = (body.founderPhone || body.founderContact?.phone || '').trim();

    let authUserId = null;
    try {
      const authUser = await getAuthUser();
      if (authUser?.userId) authUserId = authUser.userId;
    } catch (e) {}

    const dealObj = {
      id: body.id || Date.now(),
      slug,
      ...body,
      founderEmail,
      founderPhone,
      founderContact: {
        email: founderEmail,
        phone: founderPhone,
      },
      vendorEmail: founderEmail,
      userId: body.userId || authUserId || null,
      isSelect: true,
      status: dealStatus,
      originalPrice: body.originalPrice || ((body.tier1Price || 1999) * 10),
      soldCount: body.soldCount || 0,
      totalCodes: body.totalCodes || 100,
      rating: 5.0,
      reviewsCount: 1,
    };

    if (!global.STORED_DEALS) {
      global.STORED_DEALS = [];
    }

    // Update memory array
    global.STORED_DEALS = [dealObj, ...global.STORED_DEALS.filter((d) => d.slug !== slug)];

    // Persist to MongoDB
    try {
      const conn = await dbConnect();
      if (conn) {
        await Deal.findOneAndUpdate({ slug }, dealObj, { upsert: true, new: true });
      }
    } catch (dbErr) {
      console.warn('MongoDB save error:', dbErr.message);
    }

    // Trigger Vendor pending notification in MongoDB
    if (founderEmail) {
      try {
        const conn = await dbConnect();
        if (conn) {
          const userDoc = await User.findOne({ email: founderEmail });
          await Notification.create({
            userId: userDoc?._id || authUserId || null,
            userEmail: founderEmail,
            type: 'submission_pending',
            title: `⏳ Software Submitted for Review: ${dealObj.title}`,
            message: `Your software "${dealObj.title}" was submitted successfully and is currently under QA review by the StackDeal team.`,
            link: '/profile',
            icon: '⏳',
            meta: { slug: dealObj.slug, dealTitle: dealObj.title },
            isRead: false,
          });
        }
      } catch (notifErr) {
        console.warn('Could not create pending notification:', notifErr.message);
      }
    }

    // Trigger Admin Notification for new vendor submission
    if (!global.ADMIN_NOTIFICATIONS) {
      global.ADMIN_NOTIFICATIONS = [];
    }

    if (dealStatus === 'Pending') {
      const notif = {
        id: 'notif-' + Date.now(),
        type: 'vendor_submission',
        title: `New Vendor Listing: ${dealObj.vendorName || dealObj.title}`,
        message: `${dealObj.vendorName} submitted "${dealObj.title}" for QA verification. Review and approve to publish live.`,
        slug: dealObj.slug,
        vendorEmail: founderEmail,
        time: new Date().toISOString(),
        isRead: false,
      };
      global.ADMIN_NOTIFICATIONS.unshift(notif);
    }

    return NextResponse.json({ success: true, deal: dealObj });
  } catch (err) {
    console.error('API Admin Deals Error:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const { slug, status } = await req.json();
    if (!slug) {
      return NextResponse.json({ success: false, error: 'Deal slug required' }, { status: 400 });
    }

    const newStatus = status || 'Active';
    const now = new Date();

    // 1. Fetch deal from DB first to get exact vendor email
    let dbDeal = null;
    try {
      const conn = await dbConnect();
      if (conn) {
        dbDeal = await Deal.findOne({ slug });
      }
    } catch (err) {
      console.warn('MongoDB deal fetch error:', err.message);
    }

    const matchedDeal = (global.STORED_DEALS || []).find((d) => d.slug === slug);
    const dealTitle = dbDeal?.title || matchedDeal?.title || slug;
    const vendorEmail = (
      dbDeal?.founderContact?.email ||
      dbDeal?.founderEmail ||
      dbDeal?.vendorEmail ||
      matchedDeal?.founderContact?.email ||
      matchedDeal?.founderEmail ||
      matchedDeal?.vendorEmail ||
      ''
    ).trim().toLowerCase();

    // 2. Update in-memory
    if (global.STORED_DEALS) {
      const deal = global.STORED_DEALS.find((d) => d.slug === slug);
      if (deal) {
        deal.status = newStatus;
        if (newStatus === 'Active') {
          deal.launchDate = now.toISOString();
          deal.campaignEndDate = new Date(Date.now() + (deal.campaignDurationDays || 14) * 24 * 60 * 60 * 1000).toISOString();
        }
      }
    }

    // 3. Update MongoDB Deal
    try {
      const conn = await dbConnect();
      if (conn) {
        const updateFields = { status: newStatus };
        if (newStatus === 'Active') {
          updateFields.launchDate = now;
          updateFields.campaignEndDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
        }
        await Deal.findOneAndUpdate({ slug }, updateFields, { new: true });
      }
    } catch (err) {
      console.warn('MongoDB deal status update error:', err.message);
    }

    // 4. Create Vendor Notification (Persistent in MongoDB & In-Memory)
    const notifType = newStatus === 'Active' ? 'submission_approved' : newStatus === 'Rejected' ? 'submission_rejected' : 'general';
    const notifTitle = newStatus === 'Active'
      ? `🎉 Software Approved & Live: ${dealTitle}`
      : newStatus === 'Rejected'
      ? `⚠️ Software Listing Rejected: ${dealTitle}`
      : `Listing Status Update: ${dealTitle} is now ${newStatus}`;

    const notifMessage = newStatus === 'Active'
      ? `Congratulations! Your software "${dealTitle}" has passed QA verification and is now LIVE on the StackDeal marketplace!`
      : newStatus === 'Rejected'
      ? `Your listing submission for "${dealTitle}" was not approved. Please update your details or reach out to admin@stackdeal.in.`
      : `Your software submission "${dealTitle}" status changed to ${newStatus}.`;

    const notifLink = newStatus === 'Active' ? `/deals/${slug}` : '/profile';
    const notifIcon = newStatus === 'Active' ? '🎉' : newStatus === 'Rejected' ? '⚠️' : '🔔';

    // Persist to MongoDB Notification collection
    try {
      const conn = await dbConnect();
      if (conn && (vendorEmail || dbDeal?.userId)) {
        let targetUserId = dbDeal?.userId || null;
        if (!targetUserId && vendorEmail) {
          const userDoc = await User.findOne({ email: vendorEmail });
          if (userDoc) targetUserId = userDoc._id;
        }

        await Notification.create({
          userId: targetUserId,
          userEmail: vendorEmail,
          type: notifType,
          title: notifTitle,
          message: notifMessage,
          link: notifLink,
          icon: notifIcon,
          meta: { slug, dealTitle, status: newStatus },
          isRead: false,
        });
      }
    } catch (err) {
      console.warn('MongoDB vendor notification create error:', err.message);
    }

    // Also update in-memory
    if (!global.VENDOR_NOTIFICATIONS) {
      global.VENDOR_NOTIFICATIONS = [];
    }

    global.VENDOR_NOTIFICATIONS.unshift({
      id: 'vnotif-' + Date.now(),
      type: notifType,
      title: notifTitle,
      message: notifMessage,
      slug: slug,
      link: notifLink,
      icon: notifIcon,
      userEmail: vendorEmail,
      time: now.toISOString(),
      isRead: false,
    });

    return NextResponse.json({
      success: true,
      message: `Software ${slug} is now ${newStatus}! Notification sent to vendor (${vendorEmail || 'registered vendor'}).`,
      status: newStatus,
      vendorEmail,
    });
  } catch (err) {
    console.error('API Admin Deals PATCH Error:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    if (!slug) return NextResponse.json({ success: false, error: 'Slug required' }, { status: 400 });

    if (global.STORED_DEALS) {
      global.STORED_DEALS = global.STORED_DEALS.filter((d) => d.slug !== slug);
    }

    try {
      const conn = await dbConnect();
      if (conn) {
        await Deal.findOneAndDelete({ slug });
      }
    } catch (err) {
      console.warn('MongoDB delete error:', err.message);
    }

    return NextResponse.json({ success: true, message: `Deal ${slug} deleted` });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
