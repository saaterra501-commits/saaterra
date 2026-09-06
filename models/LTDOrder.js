import mongoose from 'mongoose';

const LTDOrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  dealId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deal',
    required: true,
  },
  dealSlug: {
    type: String,
    default: '',
  },
  dealTitle: {
    type: String,
    default: '',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true,
  },
  userEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  userName: {
    type: String,
    default: '',
  },
  userPhone: {
    type: String,
    default: '',
  },
  tier: {
    type: String,
    required: true,
    default: 'Tier 1',
  },
  amountPaid: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  paymentGateway: {
    type: String,
    default: 'razorpay',
  },
  paymentId: {
    type: String,
    default: '',
  },
  razorpaySignature: {
    type: String,
    default: '',
  },
  licenseCode: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  isRedeemed: {
    type: Boolean,
    default: false,
  },
  redeemedAt: {
    type: Date,
    default: null,
  },
  gstNumber: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['created', 'paid', 'refunded', 'failed'],
    default: 'paid',
  },
  purchasedAt: {
    type: Date,
    default: Date.now,
  },
  refundDeadline: {
    type: Date,
    required: true, // 60 days from purchase
  },
}, {
  timestamps: true,
});

// Cache busting for Next.js hot reload
if (process.env.NODE_ENV !== 'production' && mongoose.models.LTDOrder) {
  delete mongoose.models.LTDOrder;
}

export default mongoose.models.LTDOrder || mongoose.model('LTDOrder', LTDOrderSchema);
