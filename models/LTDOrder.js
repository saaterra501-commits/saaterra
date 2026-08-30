import mongoose from 'mongoose';

const LTDOrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  dealId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LTDDeal',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    default: '',
  },
  tier: {
    type: String,
    required: true,
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
  licenseCode: {
    type: String,
    required: true,
  },
  gstNumber: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['paid', 'refunded'],
    default: 'paid',
  },
  purchasedAt: {
    type: Date,
    default: Date.now,
  },
  refundDeadline: {
    type: Date,
    required: true, // 60 days from purchase date
  },
}, {
  timestamps: true,
});

export default mongoose.models.LTDOrder || mongoose.model('LTDOrder', LTDOrderSchema);
