import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Deal from '@/models/Deal';

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

    const dealObj = {
      id: body.id || Date.now(),
      slug,
      ...body,
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
        vendorEmail: dealObj.founderContact?.email || '',
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

    // 1. Update in-memory
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

    // 2. Update MongoDB
    try {
      const conn = await dbConnect();
      if (conn) {
        const updateFields = { status: newStatus };
        if (newStatus === 'Active') {
          updateFields.launchDate = now;
          updateFields.campaignEndDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
        }
        await Deal.findOneAndUpdate({ slug }, updateFields);
      }
    } catch (err) {
      console.warn('MongoDB deal status update error:', err.message);
    }

    // 3. Trigger Vendor Notification
    if (!global.VENDOR_NOTIFICATIONS) {
      global.VENDOR_NOTIFICATIONS = [];
    }

    const matchedDeal = (global.STORED_DEALS || []).find((d) => d.slug === slug);
    const dealTitle = matchedDeal?.title || slug;
    const vendorEmail = matchedDeal?.founderContact?.email || '';

    if (newStatus === 'Active') {
      global.VENDOR_NOTIFICATIONS.unshift({
        id: 'vnotif-' + Date.now(),
        type: 'submission_approved',
        title: `🎉 Software Approved & Live: ${dealTitle}`,
        message: `Your software "${dealTitle}" has passed QA verification and is now LIVE on the StackDeal marketplace!`,
        slug: slug,
        link: `/deals/${slug}`,
        userEmail: vendorEmail,
        time: now.toISOString(),
        isRead: false,
      });
    } else if (newStatus === 'Rejected') {
      global.VENDOR_NOTIFICATIONS.unshift({
        id: 'vnotif-' + Date.now(),
        type: 'submission_rejected',
        title: `⚠️ Listing Update: ${dealTitle}`,
        message: `Your listing submission for "${dealTitle}" was not approved. Please update your details or reach out to admin@stackdeal.in.`,
        slug: slug,
        link: '/submit',
        userEmail: vendorEmail,
        time: now.toISOString(),
        isRead: false,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Software ${slug} is now ${newStatus}!`,
      status: newStatus,
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
