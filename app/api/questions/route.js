import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Deal from '@/models/Deal';
import { sendFounderQuestionEmail } from '@/lib/emailService';

export async function POST(req) {
  try {
    const body = await req.json();
    const { slug, name, email, phone, question } = body;

    if (!slug || !name?.trim() || !email?.trim() || !question?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please provide your name, email, and question.' },
        { status: 400 }
      );
    }

    const cleanSlug = slug.toLowerCase();
    let deal = null;

    // 1. Fetch deal from MongoDB
    try {
      const conn = await dbConnect();
      if (conn) {
        deal = await Deal.findOne({
          $or: [{ slug: cleanSlug }, { slug: new RegExp(`^${cleanSlug}$`, 'i') }],
        });
      }
    } catch (err) {
      console.warn('MongoDB deal fetch error in questions route:', err.message);
    }

    // Fallback to memory
    if (!deal && global.STORED_DEALS) {
      deal = global.STORED_DEALS.find((d) => d.slug?.toLowerCase() === cleanSlug);
    }

    const dealTitle = deal?.title || 'SaaS Deal';
    const founderName = deal?.founderName || deal?.vendorName || 'Founder';
    const founderEmail =
      deal?.founderContact?.email ||
      deal?.founderEmail ||
      deal?.vendorEmail ||
      process.env.ADMIN_NOTIFY_EMAIL ||
      'ujjawal@stackdeal.in';

    const newQuestionObj = {
      userName: name.trim(),
      userEmail: email.trim(),
      userPhone: phone?.trim() || '',
      question: question.trim(),
      status: 'Pending',
      createdAt: new Date(),
    };

    // 2. Persist question to Deal in MongoDB
    if (deal) {
      try {
        if (!deal.questions) deal.questions = [];
        deal.questions.unshift(newQuestionObj);
        await deal.save();
      } catch (saveErr) {
        console.warn('Error saving question to MongoDB:', saveErr.message);
      }
    }

    // 3. Dispatch real email to SaaS Founder
    const emailResult = await sendFounderQuestionEmail({
      founderEmail,
      founderName,
      dealTitle,
      dealSlug: cleanSlug,
      userName: name.trim(),
      userEmail: email.trim(),
      userPhone: phone?.trim() || '',
      question: question.trim(),
    });

    // 4. Also register an admin notification in global ops vault
    if (!global.ADMIN_NOTIFICATIONS) global.ADMIN_NOTIFICATIONS = [];
    global.ADMIN_NOTIFICATIONS.unshift({
      id: 'qnotif-' + Date.now(),
      type: 'customer_question',
      title: `Question for ${founderName} (${dealTitle})`,
      message: `${name} (${email}) asked: "${question.trim().slice(0, 80)}..."`,
      slug: cleanSlug,
      time: new Date().toISOString(),
      isRead: false,
    });

    return NextResponse.json({
      success: true,
      message: `Your question has been emailed directly to ${founderName} (${founderEmail})! They typically reply within a few hours.`,
      founderName,
      founderEmail,
      emailDispatched: emailResult.success,
      question: newQuestionObj,
    });
  } catch (err) {
    console.error('API /api/questions Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to submit question.' },
      { status: 500 }
    );
  }
}
