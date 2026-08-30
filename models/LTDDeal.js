import mongoose from 'mongoose';

const LTDDealSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  tagline: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  vendorName: {
    type: String,
    required: true,
  },
  vendorLogo: {
    type: String,
    default: '/placeholder-logo.png',
  },
  videoUrl: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    default: 'AI & Automation',
  },
  durationYears: {
    type: Number,
    default: 5,
  },
  originalPriceYearly: {
    type: Number,
    required: true, // e.g. 12000 INR
  },
  tier1Price: {
    type: Number,
    default: 999, // INR
  },
  tier1Title: {
    type: String,
    default: 'Starter Pass',
  },
  tier1Credits: {
    type: String,
    default: '1 User · 1,000 Monthly Credits',
  },
  tier2Price: {
    type: Number,
    default: 2499, // INR
  },
  tier2Title: {
    type: String,
    default: 'Pro Pass (Most Popular)',
  },
  tier2Credits: {
    type: String,
    default: '3 Users · 5,000 Monthly Credits',
  },
  tier3Price: {
    type: Number,
    default: 4999, // INR
  },
  tier3Title: {
    type: String,
    default: 'Agency Pass',
  },
  tier3Credits: {
    type: String,
    default: '10 Users · 25,000 Monthly Credits',
  },
  features: [{
    type: String,
  }],
  faqs: [{
    question: String,
    answer: String,
  }],
  soldCount: {
    type: Number,
    default: 0,
  },
  totalAvailableCodes: {
    type: Number,
    default: 100,
  },
  endDate: {
    type: Date,
    required: true, // 14-day expiry date
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'draft'],
    default: 'active',
  },
  rating: {
    type: Number,
    default: 4.8,
  },
  reviewCount: {
    type: Number,
    default: 24,
  },
}, {
  timestamps: true,
});

export default mongoose.models.LTDDeal || mongoose.model('LTDDeal', LTDDealSchema);
