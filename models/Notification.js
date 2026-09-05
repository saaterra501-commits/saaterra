import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    // ─── Target User ──────────────────────────────────────────────────────────
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      default: null,
      index: true,
    },
    userEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
      index: true,
    },

    // ─── Notification Content ─────────────────────────────────────────────────
    type: {
      type: String,
      enum: [
        'submission_approved',
        'submission_rejected',
        'submission_pending',
        'vendor_submission',
        'order_placed',
        'order_completed',
        'customer_question',
        'review',
        'general',
      ],
      default: 'general',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      default: null,
    },
    icon: {
      type: String,
      default: '🔔',
    },

    // ─── Extra Data (voucher code, amount etc.) ───────────────────────────────
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // ─── Read Status ──────────────────────────────────────────────────────────
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast unread count queries per user
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ userEmail: 1, isRead: 1, createdAt: -1 });

if (process.env.NODE_ENV !== 'production' && mongoose.models.Notification) {
  delete mongoose.models.Notification;
}

export default mongoose.models.Notification ||
  mongoose.model('Notification', NotificationSchema);
