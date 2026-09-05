import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UpcomingDealAlert from '@/models/UpcomingDealAlert';

export const dynamic = 'force-dynamic';

// POST /api/upcoming-alerts — Subscribe to upcoming deal alerts (strictly 1 registration per email/phone)
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, whatsapp, preferredCategory, source } = body;

    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanPhone = (whatsapp || '').replace(/\D/g, '').slice(0, 10);

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Kripya ek valid email address enter karein.' },
        { status: 400 }
      );
    }

    await dbConnect();

    // 1. Check if email is already registered — strictly 1 entry per email
    const existingEmail = await UpcomingDealAlert.findOne({ email: cleanEmail });
    if (existingEmail) {
      return NextResponse.json(
        {
          success: false,
          alreadySubscribed: true,
          message: 'Ye email pehle se hi VIP list me add hai! Ek email se sirf ek baar hi register kar sakte hain.',
        },
        { status: 409 }
      );
    }

    // 2. Check if WhatsApp number is already registered (if provided)
    if (cleanPhone && cleanPhone.length === 10) {
      const existingPhone = await UpcomingDealAlert.findOne({ whatsapp: cleanPhone });
      if (existingPhone) {
        return NextResponse.json(
          {
            success: false,
            alreadySubscribed: true,
            message: 'Ye WhatsApp number pehle se hi VIP list me add hai! Ek number se ek hi baar register kar sakte hain.',
          },
          { status: 409 }
        );
      }
    }

    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

    // 3. Create new record
    await UpcomingDealAlert.create({
      name: (name || '').trim(),
      email: cleanEmail,
      whatsapp: cleanPhone,
      preferredCategory: preferredCategory || 'All',
      source: source || 'homepage',
      ip: String(ip).split(',')[0].trim(),
    });

    return NextResponse.json({
      success: true,
      message: 'Aap VIP list me add ho chuke hain! 🎉 First access drop alerts aapko milenge.',
      alreadySubscribed: false,
    });
  } catch (err) {
    // Catch MongoDB duplicate key error (code 11000)
    if (err.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          alreadySubscribed: true,
          message: 'Ye email pehle se hi VIP list me add hai! Ek email se ek hi baar register kar sakte hain.',
        },
        { status: 409 }
      );
    }
    console.error('[Upcoming Alerts] Subscribe error:', err);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
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
