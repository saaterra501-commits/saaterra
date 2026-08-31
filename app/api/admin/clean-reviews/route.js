import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Deal from '@/models/Deal';
import Review from '@/models/Review';
import Software from '@/models/Software';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();

    // 1. Clear reviews from all deals
    const dealsResult = await Deal.updateMany(
      {},
      {
        $set: {
          reviews: [],
          reviewsCount: 0,
          rating: 5.0,
          tacoRating: 5.0,
          'tacoBreakdown.taco5': 0,
          'tacoBreakdown.taco4': 0,
          'tacoBreakdown.taco3': 0,
          'tacoBreakdown.taco2': 0,
          'tacoBreakdown.taco1': 0,
        },
      }
    );

    // 2. Clear reviews collection
    const reviewsResult = await Review.deleteMany({});

    // 3. Reset softwares collection
    await Software.updateMany(
      {},
      {
        $set: {
          totalReviews: 0,
          averageRating: 5.0,
        },
      }
    );

    // 4. Reset in-memory global deals if any
    if (global.STORED_DEALS) {
      global.STORED_DEALS.forEach((d) => {
        d.reviews = [];
        d.reviewsCount = 0;
        d.rating = 5.0;
        d.tacoRating = 5.0;
      });
    }

    return NextResponse.json({
      success: true,
      message: 'All dummy reviews deleted from MongoDB successfully!',
      dealsUpdated: dealsResult.modifiedCount,
      reviewsDeleted: reviewsResult.deletedCount,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
