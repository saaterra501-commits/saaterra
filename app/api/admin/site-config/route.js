import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import SiteConfig from '@/models/SiteConfig';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    let config = await SiteConfig.findOne({ key: 'global_config' }).lean();

    if (!config) {
      config = await SiteConfig.create({ key: 'global_config' });
    }

    return NextResponse.json({ success: true, config });
  } catch (err) {
    console.error('Admin site-config GET error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    await dbConnect();

    const updateData = {
      ...(body.announcement && { announcement: body.announcement }),
      ...(body.greenStrip && { greenStrip: body.greenStrip }),
      ...(body.promoBanner && { promoBanner: body.promoBanner }),
      ...(body.seo && { seo: body.seo }),
      ...(body.faqs && { faqs: body.faqs }),
    };

    const updated = await SiteConfig.findOneAndUpdate(
      { key: 'global_config' },
      { $set: updateData },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, config: updated, message: 'Settings saved successfully!' });
  } catch (err) {
    console.error('Admin site-config POST error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
