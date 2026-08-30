import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ContactMessage from '@/models/ContactMessage';
import Notification from '@/models/Notification';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';

    // Rate limiting: 5 submissions per 10 mins per IP
    const isAllowed = rateLimit(ip, 5, 600000);
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a few minutes before submitting again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, phone, category, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Please fill all required fields (Name, Email, Subject, Message).' },
        { status: 400 }
      );
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Generate unique Ticket ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketId = `SD-${Date.now().toString().slice(-4)}${randomSuffix}`;

    const newContact = await ContactMessage.create({
      ticketId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      category: category || 'general',
      subject: subject.trim(),
      message: message.trim(),
      ipAddress: ip,
      status: 'New',
    });

    // Create system notification for admin dashboard
    try {
      await Notification.create({
        type: 'SYSTEM',
        title: `📩 New Support Query: ${ticketId}`,
        message: `From ${name} (${email}): "${subject}" [Category: ${category || 'general'}]`,
        link: `/sd-ops-vault-9839`,
      });
    } catch (e) {
      // Non-blocking notification
    }

    return NextResponse.json({
      success: true,
      ticketId,
      message: 'Your message has been received! Our support team will reply within 2-4 hours.',
    });
  } catch (error) {
    console.error('Contact form API error:', error);
    return NextResponse.json(
      { error: 'Internal server error while submitting your inquiry.' },
      { status: 500 }
    );
  }
}
