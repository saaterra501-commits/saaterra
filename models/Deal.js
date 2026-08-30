import mongoose from 'mongoose';

const DealSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    tagline: { type: String, required: true },
    category: { type: String, default: 'WhatsApp Bots' },
    isSelect: { type: Boolean, default: true },
    status: { type: String, default: 'Active' },
    
    // 14-Day Real Countdown Fields
    campaignDurationDays: { type: Number, default: 14 },
    campaignEndDate: { type: Date, default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
    launchDate: { type: Date, default: Date.now },
    
    vendorName: { type: String, required: true },
    vendorLogo: { type: String, default: 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png' },
    vendorLocation: { type: String, default: 'New Delhi, India' },
    foundedDate: { type: String, default: 'April 2022' },
    teamSize: { type: String, default: '1-10 employees' },
    founderName: { type: String, default: 'Ujjwal Sharma' },
    founderTitle: { type: String, default: 'Founder & CEO' },
    founderAvatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
    founderNote: { type: String, default: '' },

    videoUrl: { type: String, default: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    screenshots: { type: [String], default: [] },
    tldr: { type: [String], default: [] },
    
    atAGlance: {
      alternativeTo: { type: String, default: 'Calendly, Acuity' },
      integrations: { type: String, default: 'Google Calendar, Zoom, Razorpay' },
      bestFor: { type: String, default: 'Agencies, Freelancers, Consultants' },
    },

    featureShowcases: [
      {
        title: String,
        description: String,
        bullets: [String],
        imageUrl: String,
      },
    ],

    pricingTiers: [
      {
        tierName: String,
        price: Number,
        originalPrice: Number,
        isRecommended: Boolean,
        features: [
          {
            text: String,
            included: Boolean,
          },
        ],
      },
    ],

    terms: { type: [String], default: [] },

    faqs: [
      {
        question: String,
        answer: String,
        askedBy: String,
        founderReply: String,
        upvotes: { type: Number, default: 0 },
      },
    ],

    reviews: [
      {
        name: String,
        role: String,
        rating: Number,
        text: String,
        date: String,
      },
    ],

    tacoBreakdown: {
      taco5: { type: Number, default: 32 },
      taco4: { type: Number, default: 5 },
      taco3: { type: Number, default: 1 },
      taco2: { type: Number, default: 0 },
      taco1: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Deal || mongoose.model('Deal', DealSchema);
