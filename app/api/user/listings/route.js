import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Deal from '@/models/Deal';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const authUser = await getAuthUser();
    
    // Check email from auth or query param
    const { searchParams } = new URL(req.url);
    const queryEmail = searchParams.get('email')?.toLowerCase()?.trim();
    const userEmail = authUser?.email?.toLowerCase()?.trim() || queryEmail;

    if (!userEmail && !authUser?.userId) {
      return NextResponse.json({ success: true, listings: [] });
    }

    await dbConnect();

    const safeRegex = userEmail
      ? new RegExp('^' + userEmail.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + '$', 'i')
      : null;

    // Query ONLY deals submitted by this specific user
    const orConditions = [];
    if (safeRegex) {
      orConditions.push(
        { 'founderContact.email': safeRegex },
        { founderEmail: safeRegex },
        { vendorEmail: safeRegex }
      );
    }
    if (authUser?.userId) {
      orConditions.push({ userId: authUser.userId });
    }

    const userDeals = await Deal.find({ $or: orConditions })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      listings: userDeals || [],
    });
  } catch (error) {
    console.error('Error fetching user SaaS listings:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
