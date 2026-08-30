

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { generateToken, setAuthCookie, ADMIN_EMAILS } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';
import { validatePassword, validateEmail, sanitizeInput } from '@/lib/security';
import { addWalletCredits } from '@/lib/walletEngine';

export async function POST(request) {
  try {
    const { isRateLimited } = checkRateLimit(request, 'signup', 5, 60 * 1000);
    if (isRateLimited) {
      return NextResponse.json(
        { error: 'Too many account creation attempts. Please wait a minute and try again.' },
        { status: 429 }
      );
    }
    const { name, email, password, refCode } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }

    // 1. Validate and sanitize Email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      );
    }

    // 2. Validate Strong Password (Min 8 chars, uppercase, lowercase, number, special char)
    const passValidation = validatePassword(password);
    if (!passValidation.valid) {
      return NextResponse.json(
        { error: passValidation.error },
        { status: 400 }
      );
    }

    const sanitizedName = sanitizeInput(name);
    if (sanitizedName.length < 2) {
      return NextResponse.json(
        { error: 'Please enter a valid full name.' },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingUser = await User.findOne({ email: emailValidation.sanitizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 400 }
      );
    }

    // Look up Referrer if refCode was provided
    let referrerUser = null;
    const cleanRefCode = refCode ? String(refCode).trim() : '';
    if (cleanRefCode) {
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(cleanRefCode);
      referrerUser = await User.findOne({
        $or: [
          { referralCode: cleanRefCode },
          ...(isObjectId ? [{ _id: cleanRefCode }] : []),
        ],
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique referral code for new user e.g. "ST-A9B8C"
    const uniqueRefToken = 'ST-' + crypto.randomBytes(3).toString('hex').toUpperCase();
    const isAdminEmail = ADMIN_EMAILS && ADMIN_EMAILS.includes(emailValidation.sanitizedEmail.toLowerCase().trim());

    const newUser = await User.create({
      name: sanitizedName,
      email: emailValidation.sanitizedEmail,
      password: hashedPassword,
      role: isAdminEmail ? 'admin' : 'user',
      referralCode: uniqueRefToken,
      referredBy: referrerUser ? referrerUser._id : null,
    });

    // Reward ₹250 ST Credits to Referrer
    if (referrerUser) {
      try {
        await addWalletCredits({
          userId: referrerUser._id,
          amount: 250,
          source: 'referral_bonus',
          description: `Referral bonus for inviting ${newUser.name}`,
          referenceId: String(newUser._id),
          expiresDays: 60,
        });
      } catch (refErr) {
        console.warn('[Referral Credit Reward Warning]:', refErr.message);
      }
    }

    const token = generateToken(newUser);
    await setAuthCookie(token);

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully!',
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Signup API Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create account' },
      { status: 500 }
    );
  }
}
