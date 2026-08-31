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
    const queryEmail = searchParams.get('email')?.toLowerCase();
    const userEmail = authUser?.email?.toLowerCase() || queryEmail;

    if (!userEmail) {
      return NextResponse.json({ success: true, listings: [] });
    }

    await dbConnect();

    // Query ONLY deals submitted by this specific user
    const userDeals = await Deal.find({
      $or: [
        { 'founderContact.email': userEmail },
        { founderEmail: userEmail },
        { vendorEmail: userEmail },
        ...(authUser?.userId ? [{ userId: authUser.userId }] : []),
      ],
    })
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
