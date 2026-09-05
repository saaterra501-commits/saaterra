import mongoose from 'mongoose';

const UpcomingDealAlertSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    email: { type: String, required: true, lowercase: true, trim: true },
    whatsapp: { type: String, default: '' },
    preferredCategory: { type: String, default: 'All' },
    source: { type: String, default: 'homepage' }, // homepage | deal-page | popup
    referredBy: { type: String, default: '' },
    subscribed: { type: Boolean, default: true },
    notifiedCount: { type: Number, default: 0 },
    lastNotifiedAt: { type: Date, default: null },
    tags: { type: [String], default: [] },
    ip: { type: String, default: '' },
  },
  { timestamps: true }
);

// Ensure unique email
UpcomingDealAlertSchema.index({ email: 1 }, { unique: true });

export default mongoose.models.UpcomingDealAlert ||
  mongoose.model('UpcomingDealAlert', UpcomingDealAlertSchema);
