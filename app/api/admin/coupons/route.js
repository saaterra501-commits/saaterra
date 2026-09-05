import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Coupon from '@/models/Coupon';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, coupons });
  } catch (err) {
    console.error('Admin coupons GET error:', err);
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
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      usageLimit,
      expiresAt,
      isActive,
      autoApply,
    } = body;

    if (!code || !discountValue) {
      return NextResponse.json({ error: 'Coupon code and discount value are required' }, { status: 400 });
    }

    await dbConnect();

    const cleanCode = code.trim().toUpperCase();
    const existing = await Coupon.findOne({ code: cleanCode });
    if (existing) {
      return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 });
    }

    const coupon = await Coupon.create({
      code: cleanCode,
      description: description || '',
      discountType: discountType || 'percent',
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount) || 0,
      maxDiscount: Number(maxDiscount) || 10000,
      usageLimit: Number(usageLimit) || 0,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isActive: isActive !== false,
      autoApply: autoApply === true,
    });

    return NextResponse.json({ success: true, coupon, message: 'Coupon created successfully!' });
  } catch (err) {
    console.error('Admin coupons POST error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { id, isActive, autoApply, discountValue, description } = body;

    if (!id) {
      return NextResponse.json({ error: 'Coupon ID required' }, { status: 400 });
    }

    await dbConnect();
    const update = {};
    if (isActive !== undefined) update.isActive = isActive;
    if (autoApply !== undefined) update.autoApply = autoApply;
    if (discountValue !== undefined) update.discountValue = Number(discountValue);
    if (description !== undefined) update.description = description;

    const updated = await Coupon.findByIdAndUpdate(id, { $set: update }, { new: true });

    return NextResponse.json({ success: true, coupon: updated, message: 'Coupon updated!' });
  } catch (err) {
    console.error('Admin coupons PUT error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Coupon ID required' }, { status: 400 });
    }

    await dbConnect();
    await Coupon.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Coupon deleted!' });
  } catch (err) {
    console.error('Admin coupons DELETE error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
