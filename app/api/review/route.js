import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Software from '@/models/Software';
import Deal from '@/models/Deal';
import Review from '@/models/Review';
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
    const consToSave = (feedbackCons || '').trim() || 'No major issues observed.';
    const nameToSave = (authUser?.name || userName || 'Verified Buyer').trim();
    const userEmail = (authUser?.email || '').toLowerCase().trim();

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
      return NextResponse.json({ error: 'What you like (Pros) must be at least 5 characters.' }, { status: 400 });
    }

    await dbConnect();

    // ─── 4. Resolve User ID ────────────────────────────────────────────────────
    let resolvedUserId = null;

    if (authUser.userId || authUser._id || authUser.id) {
      const rawId = authUser.userId || authUser._id || authUser.id;
      const userById = await User.findById(rawId).select('_id');
      if (userById) {
        resolvedUserId = userById._id;
      }
    }

    if (!resolvedUserId && userEmail) {
      const userByEmail = await User.findOne({ email: userEmail }).select('_id');
      if (userByEmail) {
        resolvedUserId = userByEmail._id;
      }
    }

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

    let memoryDeal = null;
    if (!dealDoc && global.STORED_DEALS) {
      memoryDeal = global.STORED_DEALS.find((d) => d.slug?.toLowerCase() === cleanSlug);
    }

    const matchedDeal = dealDoc || memoryDeal;

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
        softwareDoc = await Software.findOne({ slug: cleanSlug });
      }
    }

    if (!softwareDoc) {
      return NextResponse.json({ error: 'Software could not be found for review.' }, { status: 404 });
    }

    // ─── 6. STRICT DUPLICATE CHECK: 1 Review Per Email / Account ──────────────
    const existingConditions = [];
    if (userEmail) existingConditions.push({ userEmail });
    if (resolvedUserId) existingConditions.push({ userId: resolvedUserId });

    if (existingConditions.length > 0) {
      const existingReview = await Review.findOne({
        softwareId: softwareDoc._id,
        $or: existingConditions,
      });

      if (existingReview) {
        return NextResponse.json(
          {
            error: 'You have already submitted a review for this software. Each account/email can only write 1 review per tool.',
          },
          { status: 400 }
        );
      }
    }

    // ─── 7. Create Review Record ───────────────────────────────────────────────
    const newReview = await Review.create({
      softwareId: softwareDoc._id,
      userId: resolvedUserId,
      userEmail: userEmail,
      userName: nameToSave,
      userDesignation: userDesignation?.trim() || 'Agency Founder',
      rating: Number(rating),
      reviewTitle: titleToSave,
      feedbackPros: contentToSave,
      feedbackCons: consToSave,
      status: 'approved',
      isVerifiedBuyer: true,
    });

    // ─── 8. Append Structured Review to Deal Record (Pros & Cons) ──────────────
    const reviewFormatted = {
      name: nameToSave,
      role: 'Verified Purchaser',
      rating: Number(rating),
      headline: titleToSave,
      pros: contentToSave,
      cons: consToSave,
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

    if (global.STORED_DEALS) {
      const inMem = global.STORED_DEALS.find((d) => d.slug?.toLowerCase() === cleanSlug);
      if (inMem) {
        if (!inMem.reviews) inMem.reviews = [];
        inMem.reviews.unshift(reviewFormatted);
        inMem.reviewsCount = (inMem.reviewsCount || 0) + 1;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Your verified review with Pros & Cons has been published successfully!',
      review: newReview,
    });
  } catch (error) {
    console.error('[Review API Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error while saving review.' },
      { status: 500 }
    );
  }
}
