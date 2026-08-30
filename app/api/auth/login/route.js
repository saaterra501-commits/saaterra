import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { generateToken, setAuthCookie, logAuditAction, ADMIN_EMAILS } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(request) {
  try {
    const { isRateLimited } = checkRateLimit(request, 'login', 10, 15 * 60 * 1000);
    if (isRateLimited) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please wait 15 minutes and try again.' },
        { status: 429 }
      );
    }

    const { email, password, adminSecretKey } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    await dbConnect();

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail }).select('+password');
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await logAuditAction({
        adminEmail: email,
        action: 'FAILED_LOGIN_ATTEMPT',
        target: email,
        details: 'Incorrect password',
        req: request,
      });
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Auto-promote Whitelisted Admin Emails
    if (ADMIN_EMAILS && ADMIN_EMAILS.includes(cleanEmail)) {
      if (user.role !== 'admin') {
        user.role = 'admin';
        await user.save();
      }
    }

    // Feature 2: Master Admin Secret Key Verification
    const masterKey = process.env.ADMIN_SECRET_KEY;
    if (masterKey && adminSecretKey && adminSecretKey.trim() === masterKey) {
      user.role = 'admin';
      await user.save();

      await logAuditAction({
        adminEmail: user.email,
        action: 'ADMIN_ROLE_GRANTED_VIA_MASTER_KEY',
        target: user.email,
        details: 'Elevated role to admin via Master Secret Key',
        req: request,
      });
    }

    const token = generateToken(user);
    await setAuthCookie(token);

    if (user.role === 'admin') {
      await logAuditAction({
        adminEmail: user.email,
        action: 'ADMIN_LOGIN_SUCCESS',
        target: user.email,
        details: 'Logged into admin session',
        req: request,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Logged in successfully!',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('[Login API Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to login' },
      { status: 500 }
    );
  }
}
