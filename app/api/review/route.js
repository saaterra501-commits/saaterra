import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Software from '@/models/Software';
import Deal from '@/models/Deal';
import Review from '@/models/Review';
import WalletTransaction from '@/models/WalletTransaction';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    // ─── 1. Auth Check ─────────────────────────────────────────────────────────
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in to write a verified review.' },
        { status: 401 }
      );
    }

    // ─── 2. Parse Body ─────────────────────────────────────────────────────────
    const body = await request.json();
    const {
      softwareSlug,
      userDesignation,
      rating,
      headline,
      reviewTitle,
      content,
      feedbackPros,
      feedbackCons,
      userName,
    } = body;

    const cleanSlug = (softwareSlug || '').toLowerCase().trim();
    const titleToSave = (headline || reviewTitle || '').trim();
    const contentToSave = (content || feedbackPros || '').trim();
    const consToSave = (feedbackCons || '').trim() || 'Overall a smooth experience.';
    const nameToSave = (authUser?.name || userName || 'Verified Buyer').trim();

    // ─── 3. Validation ─────────────────────────────────────────────────────────
    if (!cleanSlug) {
      return NextResponse.json({ error: 'Software slug is required.' }, { status: 400 });
    }
    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return NextResponse.json({ error: 'Please select a valid Taco rating (1–5).' }, { status: 400 });
    }
    if (!titleToSave) {
      return NextResponse.json({ error: 'Please provide a review headline.' }, { status: 400 });
    }
    if (!contentToSave || contentToSave.length < 5) {
      return NextResponse.json({ error: 'Review content must be at least 5 characters.' }, { status: 400 });
    }

    await dbConnect();

    // ─── 4. Resolve User ID ────────────────────────────────────────────────────
    let resolvedUserId = null;

    if (authUser.userId || authUser._id || authUser.id) {
      const rawId = authUser.userId || authUser._id || authUser.id;
      const userById = await User.findById(rawId).select('_id walletBalance');
      if (userById) {
        resolvedUserId = userById._id;
      }
    }

    if (!resolvedUserId && authUser.email) {
      const userByEmail = await User.findOne({ email: authUser.email.toLowerCase() }).select('_id walletBalance');
      if (userByEmail) {
        resolvedUserId = userByEmail._id;
      }
    }

    console.log('[Review API] Auth user:', authUser?.email, '| Resolved userId:', resolvedUserId?.toString());

    // ─── 5. Resolve Software or Deal from Database ─────────────────────────────
    let softwareDoc = await Software.findOne({
      $or: [
        { slug: cleanSlug },
        { slug: new RegExp(`^${cleanSlug}$`, 'i') },
      ],
    });

    let dealDoc = await Deal.findOne({
      $or: [
        { slug: cleanSlug },
        { slug: new RegExp(`^${cleanSlug}$`, 'i') },
      ],
    });

    // If deal exists in memory (global.STORED_DEALS)
    let memoryDeal = null;
    if (!dealDoc && global.STORED_DEALS) {
      memoryDeal = global.STORED_DEALS.find((d) => d.slug?.toLowerCase() === cleanSlug);
    }

    const matchedDeal = dealDoc || memoryDeal;

    // If softwareDoc doesn't exist yet, auto-create/upsert one so review has a valid softwareId
    if (!softwareDoc) {
      const softwareName = matchedDeal?.title || matchedDeal?.vendorName || cleanSlug.replace(/-/g, ' ').toUpperCase();
      const softwareTagline = matchedDeal?.tagline || '5-Year SaaS Access Pass';

      try {
        softwareDoc = await Software.findOneAndUpdate(
          { slug: cleanSlug },
          {
            name: softwareName,
            slug: cleanSlug,
            tagline: softwareTagline.slice(0, 190),
            description: softwareTagline,
            categorySlug: (matchedDeal?.category || 'other').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            logo: matchedDeal?.vendorLogo || 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png',
            status: 'active',
          },
          { upsert: true, new: true }
        );
      } catch (upsertErr) {
        console.warn('[Review API] Software upsert fallback:', upsertErr.message);
        // If unique constraint or other error, retry find
        softwareDoc = await Software.findOne({ slug: cleanSlug });
      }
    }

    if (!softwareDoc) {
      return NextResponse.json({ error: 'Software could not be initialized for review.' }, { status: 404 });
    }

    // ─── 6. Create Review Record ───────────────────────────────────────────────
    const newReview = await Review.create({
      softwareId: softwareDoc._id,
      userId: resolvedUserId,
      userEmail: authUser.email || '',
      userName: nameToSave,
      userDesignation: userDesignation?.trim() || null,
      rating: Number(rating),
      reviewTitle: titleToSave,
      feedbackPros: contentToSave,
      feedbackCons: consToSave || 'Smooth experience overall',
      status: 'approved',
      isVerifiedBuyer: true,
    });

    // ─── 7. Append Review to Deal Record (for Single Deal Page Display) ─────────
    const reviewFormatted = {
      name: nameToSave,
      role: 'Verified Purchaser',
      rating: Number(rating),
      text: `${titleToSave}: ${contentToSave}`,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    };

    try {
      if (dealDoc) {
        await Deal.findByIdAndUpdate(dealDoc._id, {
          $push: { reviews: reviewFormatted },
          $inc: { reviewsCount: 1 },
        });
      }
    } catch (dealUpdateErr) {
      console.warn('[Review API] Deal reviews update error:', dealUpdateErr.message);
    }

    // Also update in-memory deal if present
    if (global.STORED_DEALS) {
      const inMem = global.STORED_DEALS.find((d) => d.slug?.toLowerCase() === cleanSlug);
      if (inMem) {
        if (!inMem.reviews) inMem.reviews = [];
        inMem.reviews.unshift(reviewFormatted);
        inMem.reviewsCount = (inMem.reviewsCount || 0) + 1;
      }
    }

    // ─── 8. Add ₹100 ST Credits (Wallet Reward) ────────────────────────────────
    let creditsAdded = 0;

    if (resolvedUserId) {
      try {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 60);

        await WalletTransaction.create({
          userId: resolvedUserId,
          type: 'credit',
          amount: 100,
          source: 'review_reward',
          description: `Reward for reviewing ${softwareDoc.name}`,
          referenceId: String(newReview._id),
          status: 'active',
          expiresAt,
        });

        await User.findByIdAndUpdate(resolvedUserId, {
          $inc: { walletBalance: 100 },
        });

        creditsAdded = 100;
        console.log('[Review API] ₹100 ST Credits added to user:', resolvedUserId.toString());
      } catch (creditErr) {
        console.error('[Review API] Credit Reward FAILED:', creditErr.message);
      }
    } else {
      console.warn('[Review API] Could not resolve userId — credits NOT added.');
    }

    // ─── 9. Update Software Rating Stats ───────────────────────────────────────
    try {
      const [stats] = await Review.aggregate([
        { $match: { softwareId: softwareDoc._id, status: { $ne: 'flagged' } } },
        {
          $group: {
            _id: '$softwareId',
            avgRating: { $avg: '$rating' },
            count: { $sum: 1 },
          },
        },
      ]);

      if (stats) {
        softwareDoc.averageRating = Math.round(stats.avgRating * 10) / 10;
        softwareDoc.totalReviews = stats.count;
        await softwareDoc.save();
      }
    } catch (aggErr) {
      console.warn('[Review API] Rating aggregation warning:', aggErr.message);
    }

    // ─── 10. Return Success ────────────────────────────────────────────────────
    return NextResponse.json(
      {
        success: true,
        message: creditsAdded > 0
          ? `Review published! ₹${creditsAdded} ST Credits have been added to your StackDeal Wallet.`
          : 'Review published successfully! Thank you for sharing your experience.',
        review: {
          _id: newReview._id,
          name: nameToSave,
          rating: newReview.rating,
          reviewTitle: newReview.reviewTitle,
          text: `${titleToSave}: ${contentToSave}`,
        },
        creditsAdded,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Review API POST Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit review.' },
      { status: 500 }
    );
  }
}
