import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Coupon from '@/models/Coupon';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { code, cartSubtotal } = await req.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ success: false, message: 'Please provide a coupon code' }, { status: 400 });
    }

    await dbConnect();
    const cleanCode = code.trim().toUpperCase();

    // 1. First check MongoDB
    let coupon = await Coupon.findOne({ code: cleanCode, isActive: true });

    // 2. Fallback for default built-in promo codes if not yet in DB
    if (!coupon) {
      if (cleanCode === 'VIP10' || cleanCode === 'SAATERRA10') {
        coupon = {
          code: cleanCode,
          description: '10% Launch Discount',
          discountType: 'percent',
          discountValue: 10,
          minOrderAmount: 0,
          maxDiscount: 5000,
        };
      } else if (cleanCode === 'FOUNDER20') {
        coupon = {
          code: cleanCode,
          description: '20% Founder Discount',
          discountType: 'percent',
          discountValue: 20,
          minOrderAmount: 1999,
          maxDiscount: 5000,
        };
      } else if (cleanCode === 'SAVE500') {
        coupon = {
          code: cleanCode,
          description: '₹500 Flat Savings',
          discountType: 'flat',
          discountValue: 500,
          minOrderAmount: 1999,
          maxDiscount: 500,
        };
      }
    }

    if (!coupon) {
      return NextResponse.json({ success: false, message: 'Invalid or inactive coupon code' }, { status: 404 });
    }

    // Check expiry
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ success: false, message: 'This coupon code has expired' }, { status: 400 });
    }

    // Check usage limit
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ success: false, message: 'This coupon usage limit has been reached' }, { status: 400 });
    }

    const subtotal = Number(cartSubtotal) || 0;

    // Check min order amount
    if (coupon.minOrderAmount > 0 && subtotal < coupon.minOrderAmount) {
      return NextResponse.json({
        success: false,
        message: `Minimum cart value of ₹${coupon.minOrderAmount.toLocaleString('en-IN')} required for this coupon`,
      }, { status: 400 });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'percent') {
      discountAmount = Math.round(subtotal * (coupon.discountValue / 100));
      if (coupon.maxDiscount > 0 && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = Math.min(subtotal, coupon.discountValue);
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        description: coupon.description || `${coupon.discountValue}${coupon.discountType === 'percent' ? '%' : '₹'} Discount`,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
      },
      message: `Coupon ${coupon.code} applied successfully!`,
    });
  } catch (err) {
    console.error('Coupon validation error:', err);
    return NextResponse.json({ success: false, message: 'Error validating coupon' }, { status: 500 });
  }
}
