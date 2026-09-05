import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UpcomingDealAlert from '@/models/UpcomingDealAlert';

export const dynamic = 'force-dynamic';

// POST /api/upcoming-alerts — Subscribe to upcoming deal alerts
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, whatsapp, preferredCategory, source } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, message: 'Valid email is required.' }, { status: 400 });
    }

    await dbConnect();

    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

    // Upsert — if same email comes again, just update their info (don't error)
    const existing = await UpcomingDealAlert.findOne({ email: email.toLowerCase().trim() });

    if (existing) {
      if (!existing.subscribed) {
        existing.subscribed = true;
        await existing.save();
        return NextResponse.json({
          success: true,
          message: 'Welcome back! You\'ve been re-subscribed to upcoming deal alerts.',
          alreadySubscribed: false,
        });
      }
      return NextResponse.json({
        success: true,
        message: 'You\'re already on the VIP list! We\'ll notify you first when a new deal drops.',
        alreadySubscribed: true,
      });
    }

    await UpcomingDealAlert.create({
      name: (name || '').trim(),
      email: email.toLowerCase().trim(),
      whatsapp: (whatsapp || '').replace(/\s/g, ''),
      preferredCategory: preferredCategory || 'All',
      source: source || 'homepage',
      ip: String(ip).split(',')[0].trim(),
    });

    return NextResponse.json({
      success: true,
      message: 'You\'re on the VIP list! 🎉 We\'ll notify you first when the next deal drops.',
      alreadySubscribed: false,
    });
  } catch (err) {
    console.error('[Upcoming Alerts] Subscribe error:', err);
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

// GET /api/upcoming-alerts — Admin: get subscriber list
export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '50'));
    const skip = (page - 1) * limit;

    const [subscribers, total] = await Promise.all([
      UpcomingDealAlert.find({ subscribed: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      UpcomingDealAlert.countDocuments({ subscribed: true }),
    ]);

    const whatsappCount = await UpcomingDealAlert.countDocuments({
      subscribed: true,
      whatsapp: { $ne: '' },
    });

    return NextResponse.json({
      success: true,
      subscribers,
      total,
      whatsappCount,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
