import { NextResponse } from 'next/server';
import { generateVendorListingWithAI } from '@/lib/aiService';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { websiteUrl, pitch, category } = await req.json();

    if (!websiteUrl && !pitch) {
      return NextResponse.json(
        { success: false, error: 'Please provide either your Website URL or a 1-sentence product pitch.' },
        { status: 400 }
      );
    }

    const result = await generateVendorListingWithAI({
      websiteUrl,
      pitch,
      category,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error('API /api/ai/generate-listing Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to auto-generate listing with AI.' },
      { status: 500 }
    );
  }
}
