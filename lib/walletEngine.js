import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import WalletTransaction from '@/models/WalletTransaction';

/**
 * Add ST Credits to a User's Wallet
 */
export async function addWalletCredits({
  userId,
  amount,
  source = 'review_reward',
  description = '',
  referenceId = null,
  expiresDays = 60,
}) {
  await dbConnect();
  if (!userId || !amount || amount <= 0) {
    throw new Error('Invalid userId or credit amount');
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresDays);

  // 1. Create transaction ledger entry
  const transaction = await WalletTransaction.create({
    userId,
    type: 'credit',
    amount,
    source,
    description,
    referenceId: referenceId ? String(referenceId) : null,
    status: 'active',
    expiresAt,
  });

  // 2. Atomically increment User wallet balance
  await User.findByIdAndUpdate(userId, {
    $inc: { walletBalance: amount },
  });

  return transaction;
}

/**
 * Deduct ST Credits from a User's Wallet
 */
export async function deductWalletCredits({
  userId,
  amount,
  source = 'cashback_redemption',
  description = '',
  referenceId = null,
}) {
  await dbConnect();
  if (!userId || !amount || amount <= 0) {
    throw new Error('Invalid userId or debit amount');
  }

  const user = await User.findById(userId);
  if (!user || (user.walletBalance || 0) < amount) {
    throw new Error('Insufficient wallet balance');
  }

  const expiresAt = new Date(); // Immediate timestamp for debit log

  // 1. Create transaction ledger entry for debit
  const transaction = await WalletTransaction.create({
    userId,
    type: 'debit',
    amount,
    source,
    description,
    referenceId: referenceId ? String(referenceId) : null,
    status: 'redeemed',
    expiresAt,
  });

  // 2. Atomically decrement User wallet balance
  await User.findByIdAndUpdate(userId, {
    $inc: { walletBalance: -amount },
  });

  return transaction;
}

/**
 * Get Wallet balance, expiring credits, and recent transaction history for a user
 */
export async function getUserWalletSummary(userId) {
  await dbConnect();
  let user = await User.findById(userId).select('walletBalance referralCode');
  if (!user) {
    return { balance: 0, expiringSoon: 0, transactions: [] };
  }

  // If existing user does not have a referralCode, auto-generate and save one
  if (!user.referralCode) {
    const crypto = await import('crypto');
    user.referralCode = 'ST-' + crypto.randomBytes(3).toString('hex').toUpperCase();
    await user.save();
  }

  const now = new Date();
  const next30Days = new Date();
  next30Days.setDate(next30Days.getDate() + 30);

  // Find credits expiring in the next 30 days
  const expiringSoonTxns = await WalletTransaction.find({
    userId,
    type: 'credit',
    status: 'active',
    expiresAt: { $gte: now, $lte: next30Days },
  }).lean();

  const expiringSoon = expiringSoonTxns.reduce((sum, tx) => sum + tx.amount, 0);

  // Fetch last 20 transactions
  const transactions = await WalletTransaction.find({ userId })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  return {
    balance: user.walletBalance || 0,
    referralCode: user.referralCode || String(user._id),
    expiringSoon,
    transactions: JSON.parse(JSON.stringify(transactions)),
  };
}

/**
 * Expiry Processing Engine (Breakage Cron Utility)
 */
export async function processExpiredCredits() {
  await dbConnect();
  const now = new Date();

  // Find active credits past expiry date
  const expiredTxns = await WalletTransaction.find({
    type: 'credit',
    status: 'active',
    expiresAt: { $lt: now },
  });

  let totalExpiredCount = 0;
  let totalExpiredAmount = 0;

  for (const txn of expiredTxns) {
    txn.status = 'expired';
    await txn.save();

    // Create an audit debit record marking expiration
    await WalletTransaction.create({
      userId: txn.userId,
      type: 'debit',
      amount: txn.amount,
      source: 'expired',
      description: `Credits expired (${txn.amount} ST Credits)`,
      referenceId: String(txn._id),
      status: 'expired',
      expiresAt: now,
    });

    // Update user balance safely (floor at 0)
    const user = await User.findById(txn.userId);
    if (user) {
      const newBalance = Math.max(0, (user.walletBalance || 0) - txn.amount);
      user.walletBalance = newBalance;
      await user.save();
    }

    totalExpiredCount++;
    totalExpiredAmount += txn.amount;
  }

  return {
    processedCount: totalExpiredCount,
    totalAmountExpired: totalExpiredAmount,
  };
}

/**
 * Fetch users who have active credits expiring within the next N days
 */
export async function getExpiringCreditsUsers(withinDays = 15) {
  await dbConnect();
  const now = new Date();
  const targetExpiryDate = new Date();
  targetExpiryDate.setDate(targetExpiryDate.getDate() + withinDays);

  const txns = await WalletTransaction.find({
    type: 'credit',
    status: 'active',
    expiresAt: { $gte: now, $lte: targetExpiryDate },
  }).populate('userId', 'name email walletBalance').lean();

  const userMap = {};

  for (const tx of txns) {
    if (!tx.userId) continue;
    const uId = String(tx.userId._id || tx.userId);
    if (!userMap[uId]) {
      userMap[uId] = {
        userId: uId,
        name: tx.userId.name || 'User',
        email: tx.userId.email || '',
        walletBalance: tx.userId.walletBalance || 0,
        expiringAmount: 0,
        earliestExpiryDate: tx.expiresAt,
      };
    }

    userMap[uId].expiringAmount += tx.amount;
    if (new Date(tx.expiresAt) < new Date(userMap[uId].earliestExpiryDate)) {
      userMap[uId].earliestExpiryDate = tx.expiresAt;
    }
  }

  return Object.values(userMap);
}

