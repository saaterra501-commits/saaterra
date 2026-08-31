import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 403 });
    }

    await dbConnect();

    const users = await User.find()
      .select('name email role avatar createdAt updatedAt isPlusMember walletBalance')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      totalUsers: users.length,
      users: users || [],
    });
  } catch (error) {
    console.error('Admin users API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
