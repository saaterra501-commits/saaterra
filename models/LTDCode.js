import mongoose from 'mongoose';

const LTDCodeSchema = new mongoose.Schema({
  dealId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deal',
    required: true,
    index: true,
  },
  code: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },
  tier: {
    type: String,
    default: 'Tier 1',
    trim: true,
  },
  status: {
    type: String,
    enum: ['available', 'assigned', 'refunded'],
    default: 'available',
    index: true,
  },
  assignedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  assignedUserEmail: {
    type: String,
    default: '',
  },
  orderId: {
    type: String,
    default: '',
  },
  assignedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

LTDCodeSchema.index({ dealId: 1, status: 1 });
LTDCodeSchema.index({ dealId: 1, tier: 1, status: 1 });

export default mongoose.models.LTDCode || mongoose.model('LTDCode', LTDCodeSchema);
