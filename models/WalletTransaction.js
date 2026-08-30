import mongoose from 'mongoose';

const WalletTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    type: {
      type: String,
      enum: ['credit', 'debit'],
      required: [true, 'Transaction type (credit/debit) is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [1, 'Amount must be greater than 0'],
    },
    source: {
      type: String,
      enum: [
        'review_reward',
        'referral_bonus',
        'cashback_redemption',
        'signup_bonus',
        'expired',
        'admin_adjustment',
      ],
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'redeemed', 'expired', 'cancelled'],
      default: 'active',
      index: true,
    },
    referenceId: {
      type: String,
      default: null,
    },
    expiresAt: {
      type: Date,
      index: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

if (mongoose.models && mongoose.models.WalletTransaction) {
  delete mongoose.models.WalletTransaction;
}

export default mongoose.model('WalletTransaction', WalletTransactionSchema);
