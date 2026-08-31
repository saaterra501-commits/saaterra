import { NextResponse } from 'next/server';
import { recommendDealsWithAI } from '@/lib/aiService';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { query, businessType, budget } = await req.json();

    if (!query || !query.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please enter what type of software or problem you want to solve.' },
        { status: 400 }
      );
    }

    const result = await recommendDealsWithAI({
      query: query.trim(),
      businessType,
      budget,
    });

    return NextResponse.json({
      success: true,
      reply: result.reply,
      matchedDeals: result.matchedDeals,
    });
  } catch (err) {
    console.error('API /api/ai/match Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to generate recommendations.' },
      { status: 500 }
    );
  }
}
