import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import LTDCode from '@/models/LTDCode';
import Deal from '@/models/Deal';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const selectedDealId = searchParams.get('dealId');

    // 1. Fetch all deals for selector
    const deals = await Deal.find({}, '_id title slug pricingTiers').sort({ title: 1 }).lean();

    // 2. Fetch inventory summary for all deals
    const allCodes = await LTDCode.find({}, 'dealId tier status').lean();

    // Group by dealId + tier
    const statsByDeal = {};
    deals.forEach((d) => {
      const idStr = String(d._id);
      statsByDeal[idStr] = {
        dealId: idStr,
        title: d.title,
        slug: d.slug,
        tiers: {
          'Tier 1': { available: 0, assigned: 0, total: 0 },
          'Tier 2': { available: 0, assigned: 0, total: 0 },
          'Tier 3': { available: 0, assigned: 0, total: 0 },
        },
        hasLowStock: false,
      };
    });

    allCodes.forEach((c) => {
      const idStr = String(c.dealId);
      if (statsByDeal[idStr]) {
        const tierKey = c.tier || 'Tier 1';
        if (!statsByDeal[idStr].tiers[tierKey]) {
          statsByDeal[idStr].tiers[tierKey] = { available: 0, assigned: 0, total: 0 };
        }
        statsByDeal[idStr].tiers[tierKey].total += 1;
        if (c.status === 'available') {
          statsByDeal[idStr].tiers[tierKey].available += 1;
        } else if (c.status === 'assigned') {
          statsByDeal[idStr].tiers[tierKey].assigned += 1;
        }
      }
    });

    // Check low stock (< 5 available)
    let lowStockCount = 0;
    Object.values(statsByDeal).forEach((dealStat) => {
      Object.values(dealStat.tiers).forEach((t) => {
        if (t.total > 0 && t.available < 5) {
          dealStat.hasLowStock = true;
          lowStockCount += 1;
        }
      });
    });

    // 3. If a specific deal is queried, return its individual keys
    let keysList = [];
    if (selectedDealId) {
      keysList = await LTDCode.find({ dealId: selectedDealId })
        .sort({ createdAt: -1 })
        .limit(100)
        .lean();
    }

    return NextResponse.json({
      success: true,
      deals,
      stats: Object.values(statsByDeal),
      lowStockCount,
      keys: keysList,
    });
  } catch (err) {
    console.error('Admin keys GET error:', err);
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
    const { dealId, tier = 'Tier 1', rawKeys } = body;

    if (!dealId || !rawKeys) {
      return NextResponse.json({ error: 'Deal ID and keys are required' }, { status: 400 });
    }

    await dbConnect();

    // Split raw keys by newlines or commas
    const parsedKeys = rawKeys
      .split(/[\r\n,]+/)
      .map((k) => k.trim().toUpperCase())
      .filter((k) => k.length > 3);

    if (parsedKeys.length === 0) {
      return NextResponse.json({ error: 'No valid keys found in input' }, { status: 400 });
    }

    // Check existing keys to avoid duplicates
    const existing = await LTDCode.find({
      dealId,
      code: { $in: parsedKeys },
    }).select('code');

    const existingSet = new Set(existing.map((e) => e.code));
    const newKeys = parsedKeys.filter((k) => !existingSet.has(k));

    if (newKeys.length === 0) {
      return NextResponse.json({
        error: 'All provided keys already exist in the vault for this deal',
      }, { status: 400 });
    }

    const docs = newKeys.map((code) => ({
      dealId,
      code,
      tier,
      status: 'available',
    }));

    await LTDCode.insertMany(docs);

    return NextResponse.json({
      success: true,
      insertedCount: newKeys.length,
      skippedCount: parsedKeys.length - newKeys.length,
      message: `Successfully added ${newKeys.length} license keys!`,
    });
  } catch (err) {
    console.error('Admin keys POST error:', err);
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
      return NextResponse.json({ error: 'Key ID required' }, { status: 400 });
    }

    await dbConnect();
    await LTDCode.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'License key removed from vault' });
  } catch (err) {
    console.error('Admin keys DELETE error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
