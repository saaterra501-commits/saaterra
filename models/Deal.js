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
    websiteUrl: { type: String, default: '' },
    foundedDate: { type: String, default: 'April 2022' },
    teamSize: { type: String, default: '1-10 employees' },
    founderName: { type: String, default: 'Ujjwal Sharma' },
    founderTitle: { type: String, default: 'Founder & CEO' },
    founderAvatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
    founderLinkedin: { type: String, default: '' },
    founderTwitter: { type: String, default: '' },
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
        totalCodes: { type: Number, default: 100 },
        soldCount: { type: Number, default: 0 },
        isRecommended: Boolean,
        enabled: { type: Boolean, default: true },
        licenseCodes: { type: [String], default: [] },
        features: [
          {
            text: String,
            included: Boolean,
          },
        ],
      },
    ],

    terms: { type: [String], default: [] },
    termsAgreed: { type: Boolean, default: true },

    payoutDetails: {
      payoutMethod: { type: String, default: 'UPI' },
      upiId: { type: String, default: '' },
      accountHolderName: { type: String, default: '' },
      accountNumber: { type: String, default: '' },
      ifscCode: { type: String, default: '' },
      bankName: { type: String, default: '' },
      panOrGstin: { type: String, default: '' },
    },

    licenseKeys: { type: [String], default: [] },

    faqs: [
      {
        question: String,
        answer: String,
        askedBy: String,
        founderReply: String,
        upvotes: { type: Number, default: 0 },
      },
    ],

    questions: [
      {
        userName: String,
        userEmail: String,
        userPhone: String,
        question: String,
        founderReply: String,
        status: { type: String, default: 'Pending' },
        createdAt: { type: Date, default: Date.now },
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
