import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import LTDOrder from '@/models/LTDOrder';
import LTDDeal from '@/models/LTDDeal';

export async function GET() {
  try {
    await dbConnect();
    const orders = await LTDOrder.find().populate('dealId').sort({ purchasedAt: -1 });
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
