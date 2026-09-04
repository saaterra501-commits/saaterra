const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

// Slide dimensions: 16:9 widescreen (1280 x 720 pt)
const doc = new PDFDocument({
  size: [1280, 720],
  margins: { top: 40, bottom: 40, left: 60, right: 60 },
  autoFirstPage: false
});

const outputPath = path.join(__dirname, 'StackDeal_FirstCapital_PitchDeck.pdf');
const desktopOutputPath = path.join('C:\\Users\\ujjaw\\OneDrive\\Desktop\\saaterra', 'StackDeal_FirstCapital_PitchDeck.pdf');

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Helper function to draw slide background & header
function startSlide(title, category, slideNum) {
  doc.addPage();
  
  // Dark Background
  doc.rect(0, 0, 1280, 720).fill('#0B0F19');

  // Decorative ambient gradients/circles
  doc.save();
  doc.circle(1150, 100, 250).fillOpacity(0.04).fill('#6366F1');
  doc.circle(100, 620, 220).fillOpacity(0.03).fill('#F97316');
  doc.restore();

  // Header
  // Brand Pill
  doc.roundedRect(60, 35, 24, 24, 5).fill('#FF6B35');
  doc.fillColor('#FFFFFF').fontSize(14).font('Helvetica-Bold').text('%', 66, 40);

  doc.fillColor('#FFFFFF').fontSize(16).font('Helvetica-Bold').text('StackDeal', 92, 38);
  doc.fillColor('#64748B').fontSize(11).font('Helvetica').text('stackdeal.in', 175, 41);

  // Category
  doc.fillColor('#818CF8').fontSize(11).font('Helvetica-Bold').text(category.toUpperCase(), 800, 41, { width: 420, align: 'right' });

  // Divider line
  doc.strokeColor('#1E293B').lineWidth(1).moveTo(60, 70).lineTo(1220, 70).stroke();

  // Slide Title & Subtitle if provided
  if (title) {
    doc.fillColor('#FFFFFF').fontSize(26).font('Helvetica-Bold').text(title, 60, 95);
  }

  // Footer
  doc.strokeColor('#1E293B').lineWidth(1).moveTo(60, 665).lineTo(1220, 665).stroke();
  doc.fillColor('#475569').fontSize(10).font('Helvetica').text('First Capital by Indra Dhar • Official Pitch Submission', 60, 680);
  doc.fillColor('#475569').fontSize(10).font('Helvetica').text(`Slide ${slideNum} of 10`, 1100, 680, { width: 120, align: 'right' });
}

// ─────────────────────────────────────────────
// SLIDE 1: COVER
// ─────────────────────────────────────────────
doc.addPage();
doc.rect(0, 0, 1280, 720).fill('#0B0F19');

// Glows
doc.save();
doc.circle(640, 360, 400).fillOpacity(0.05).fill('#6366F1');
doc.restore();

// Top Pill
doc.roundedRect(480, 140, 320, 32, 16).fill('#1E293B');
doc.fillColor('#94A3B8').fontSize(11).font('Helvetica-Bold').text('STAGE 1 PITCH SUBMISSION • 2026', 480, 150, { width: 320, align: 'center' });

// Brand Logo & Title
doc.roundedRect(560, 200, 44, 44, 10).fill('#FF6B35');
doc.fillColor('#FFFFFF').fontSize(26).font('Helvetica-Bold').text('%', 572, 208);
doc.fillColor('#FFFFFF').fontSize(56).font('Helvetica-Bold').text('StackDeal', 620, 195);

doc.fillColor('#E2E8F0').fontSize(22).font('Helvetica-Bold').text("India's Curated B2B SaaS Deal Marketplace", 60, 290, { width: 1160, align: 'center' });
doc.fillColor('#94A3B8').fontSize(15).font('Helvetica').text(
  'Empowering 35,000+ Indian Digital Agencies & Solopreneurs with transparent 5-Year Access Passes,\nwhile giving bootstrapped SaaS founders profitable, sustainable distribution.',
  60, 335, { width: 1160, align: 'center', lineGap: 6 }
);

// Details Card
doc.roundedRect(390, 430, 500, 140, 12).fill('#111827');
doc.rect(390, 430, 500, 140).strokeColor('#374151').lineWidth(1).stroke();

doc.fillColor('#818CF8').fontSize(11).font('Helvetica-Bold').text('SUBMISSION DETAILS', 390, 450, { width: 500, align: 'center' });
doc.fillColor('#FFFFFF').fontSize(14).font('Helvetica-Bold').text('Founder: Ujjawal Tiwari', 390, 475, { width: 500, align: 'center' });
doc.fillColor('#94A3B8').fontSize(12).font('Helvetica').text('Platform: stackdeal.in  •  Contact: hello@stackdeal.in', 390, 500, { width: 500, align: 'center' });
doc.fillColor('#10B981').fontSize(11).font('Helvetica-Bold').text('Status: Live Production Marketplace on Product Hunt', 390, 530, { width: 500, align: 'center' });

doc.fillColor('#475569').fontSize(10).font('Helvetica').text('First Capital by Indra Dhar • Slide 1 of 10', 60, 680, { width: 1160, align: 'center' });


// ─────────────────────────────────────────────
// SLIDE 2: THE PROBLEM
// ─────────────────────────────────────────────
startSlide('The Two-Sided Crisis in B2B Software', '01 • Problem Analysis', 2);
doc.fillColor('#94A3B8').fontSize(14).font('Helvetica').text('Recurring subscription fatigue hurts Indian agencies, while bootstrapped SaaS founders starve for distribution.', 60, 130);

// Left Card: Agency Struggle
doc.roundedRect(60, 175, 560, 460, 12).fill('#111827');
doc.rect(60, 175, 560, 460).strokeColor('#EF4444').lineWidth(1.5).stroke();

doc.fillColor('#EF4444').fontSize(18).font('Helvetica-Bold').text('The Indian Agency Struggle (Buyers)', 90, 205);
doc.fillColor('#CBD5E1').fontSize(13).font('Helvetica').text(
  '• Severe Subscription Fatigue: An average boutique agency uses 6 to 8 tools (WhatsApp bots, SEO trackers, scrapers, CRM) paying $30 to $99 every single month on credit cards, even during slow client months.\n\n' +
  '• Zero GST Input Tax Credit (ITC): Foreign SaaS invoices from Stripe/US entities provide no Indian GST compliance, causing a direct 18% tax loss for Indian agencies.\n\n' +
  '• Currency Volatility & Bank Surcharges: Fluctuating USD-INR exchange rates and 3.5% cross-border foreign markup transaction fees on monthly cards.',
  90, 250, { width: 500, lineGap: 8 }
);

// Right Card: SaaS Founder Struggle
doc.roundedRect(660, 175, 560, 460, 12).fill('#111827');
doc.rect(660, 175, 560, 460).strokeColor('#F59E0B').lineWidth(1.5).stroke();

doc.fillColor('#F59E0B').fontSize(18).font('Helvetica-Bold').text('The SaaS Founder Struggle (Sellers)', 690, 205);
doc.fillColor('#CBD5E1').fontSize(13).font('Helvetica').text(
  '• Distribution Bottleneck: Independent developers build great technical software but struggle for initial customers and distribution with zero marketing budgets.\n\n' +
  '• Predatory Legacy Deal Platforms: AppSumo and global deal platforms charge 70% to 80% commissions and withhold founder payouts for 60+ days.\n\n' +
  '• Infinite Server Liability: "Lifetime Deals" (LTDs) burden founders with infinite server and API costs without sustainable unit economic boundaries.',
  690, 250, { width: 500, lineGap: 8 }
);


// ─────────────────────────────────────────────
// SLIDE 3: THE SOLUTION
// ─────────────────────────────────────────────
startSlide('The 5-Year Access Pass Marketplace', '02 • Solution & Value Proposition', 3);
doc.fillColor('#94A3B8').fontSize(14).font('Helvetica').text('A sustainable, transparent model connecting high-utility B2B software with agency buyers.', 60, 130);

const colWidth = 360;
const gap = 20;

// Card 1: For Agencies
doc.roundedRect(60, 175, colWidth, 460, 12).fill('#111827');
doc.rect(60, 175, colWidth, 460).strokeColor('#6366F1').lineWidth(1.5).stroke();
doc.fillColor('#818CF8').fontSize(16).font('Helvetica-Bold').text('For Agencies & SMBs', 85, 205);
doc.fillColor('#CBD5E1').fontSize(12).font('Helvetica').text(
  '• Pay Once, 5-Year Access: Complete peace of mind with 0 monthly recurring subscription stress.\n\n' +
  '• Instant Indian Checkout: Native Razorpay integration supporting PhonePe, Google Pay, Paytm, Net Banking, and Cards.\n\n' +
  '• Official 18% GST Invoices: Automated B2B tax invoices with agency GSTIN for full CA input tax credit.\n\n' +
  '• 60-Day Money-Back Guarantee: 100% risk-free software trial.',
  85, 245, { width: 310, lineGap: 7 }
);

// Card 2: For Founders
doc.roundedRect(60 + colWidth + gap, 175, colWidth, 460, 12).fill('#111827');
doc.rect(60 + colWidth + gap, 175, colWidth, 460).strokeColor('#10B981').lineWidth(1.5).stroke();
doc.fillColor('#34D399').fontSize(16).font('Helvetica-Bold').text('For SaaS Founders', 85 + colWidth + gap, 205);
doc.fillColor('#CBD5E1').fontSize(12).font('Helvetica').text(
  '• 70% Revenue Share: Founders keep 70% of every sale with bi-weekly direct bank payouts.\n\n' +
  '• 100+ Paying Power Users: Immediate cohort of active agency customers driving testimonials and referrals.\n\n' +
  '• 1-Click AI Listing Copilot: Automated deal copy, graphics, and landing page generated in minutes.\n\n' +
  '• Zero Upfront Listing Fees.',
  85 + colWidth + gap, 245, { width: 310, lineGap: 7 }
);

// Card 3: The 5-Year Advantage
doc.roundedRect(60 + (colWidth + gap) * 2, 175, colWidth, 460, 12).fill('#111827');
doc.rect(60 + (colWidth + gap) * 2, 175, colWidth, 460).strokeColor('#F97316').lineWidth(1.5).stroke();
doc.fillColor('#FB923C').fontSize(16).font('Helvetica-Bold').text('The 5-Year Model', 85 + (colWidth + gap) * 2, 205);
doc.fillColor('#CBD5E1').fontSize(12).font('Helvetica').text(
  '• Sustainable Unit Economics: Unlike risky Lifetime Deals, 5-Year Passes establish healthy server boundaries.\n\n' +
  '• Expansion & Upgrades: As agency client volume grows, they naturally upgrade to higher tiers.\n\n' +
  '• High Perceived Value: Buyer saves 85-92% compared to monthly recurring SaaS bills.',
  85 + (colWidth + gap) * 2, 245, { width: 310, lineGap: 7 }
);


// ─────────────────────────────────────────────
// SLIDE 4: THE PRODUCT
// ─────────────────────────────────────────────
startSlide('Live Production Architecture (stackdeal.in)', '03 • Product & Tech Stack', 4);
doc.fillColor('#94A3B8').fontSize(14).font('Helvetica').text('Production-ready marketplace built for speed, security, and conversion.', 60, 130);

const pCardW = 270;
const pGap = 20;

const pCards = [
  { title: 'Next.js 16 SSR', color: '#60A5FA', desc: 'Pre-rendered server-side architecture for sub-second load times and complete Google SEO crawl indexing with zero Soft 404s.' },
  { title: 'Razorpay & GST', color: '#34D399', desc: 'Seamless Indian payment gateway with automated PDF B2B tax invoice generation and GSTIN validation.' },
  { title: 'Groq AI Matchmaker', color: '#F472B6', desc: 'Llama-3 powered intelligent assistant that analyzes agency niche and recommends high-ROI software stacks instantly.' },
  { title: 'Vendor Operations Vault', color: '#FBBF24', desc: 'Secure admin portal for deal approvals, redemption code management, and automated payout tracking.' }
];

pCards.forEach((c, i) => {
  const x = 60 + (pCardW + pGap) * i;
  doc.roundedRect(x, 175, pCardW, 280, 12).fill('#111827');
  doc.rect(x, 175, pCardW, 280).strokeColor('#1E293B').lineWidth(1).stroke();
  doc.fillColor(c.color).fontSize(16).font('Helvetica-Bold').text(c.title, x + 20, 205);
  doc.fillColor('#94A3B8').fontSize(12).font('Helvetica').text(c.desc, x + 20, 245, { width: pCardW - 40, lineGap: 6 });
});

// Live Banner
doc.roundedRect(60, 480, 1160, 150, 12).fill('#0F172A');
doc.rect(60, 480, 1160, 150).strokeColor('#6366F1').lineWidth(1).stroke();

doc.fillColor('#FFFFFF').fontSize(16).font('Helvetica-Bold').text('Current Live Software Categories on StackDeal:', 90, 505);
doc.fillColor('#CBD5E1').fontSize(13).font('Helvetica').text(
  '• WhatsApp Marketing & Automation: Recover carts & broadcast with Meta Cloud API (Chat Chacha)\n' +
  '• AI & GEO Search Engine Optimization: Track rankings in Google, ChatGPT & Perplexity (SEO Rocket & Nuwatomic)\n' +
  '• B2B Lead Scrapers & Data Extraction: Verify emails and maps leads for outreach (EmailExtractor Pro AI)',
  90, 535, { lineGap: 6 }
);


// ─────────────────────────────────────────────
// SLIDE 5: MARKET OPPORTUNITY
// ─────────────────────────────────────────────
startSlide('Market Size: The $14.5 Billion Indian SaaS Boom', '04 • Market Opportunity (SaaSBoomi & IAMAI Data)', 5);
doc.fillColor('#94A3B8').fontSize(14).font('Helvetica').text('Data verified from SaaSBoomi, NASSCOM, IAMAI, and Bain & Company research reports.', 60, 130);

const mWidth = 360;
const mGap = 20;

// TAM
doc.roundedRect(60, 175, mWidth, 230, 12).fill('#111827');
doc.rect(60, 175, mWidth, 230).strokeColor('#3B82F6').lineWidth(1.5).stroke();
doc.fillColor('#60A5FA').fontSize(36).font('Helvetica-Bold').text('Rs 1,20,000 Cr', 85, 205);
doc.fillColor('#FFFFFF').fontSize(15).font('Helvetica-Bold').text('TAM ($14.5 Billion)', 85, 255);
doc.fillColor('#94A3B8').fontSize(11).font('Helvetica').text('Total Indian domestic B2B SaaS software consumption market by 2026, expanding at 28% annual CAGR toward $50B by 2030.', 85, 280, { width: 310, lineGap: 5 });

// SAM
doc.roundedRect(60 + mWidth + mGap, 175, mWidth, 230, 12).fill('#111827');
doc.rect(60 + mWidth + mGap, 175, mWidth, 230).strokeColor('#F97316').lineWidth(1.5).stroke();
doc.fillColor('#FB923C').fontSize(36).font('Helvetica-Bold').text('Rs 8,500 Cr', 85 + mWidth + mGap, 205);
doc.fillColor('#FFFFFF').fontSize(15).font('Helvetica-Bold').text('SAM ($1.0 Billion)', 85 + mWidth + mGap, 255);
doc.fillColor('#94A3B8').fontSize(11).font('Helvetica').text('Annual software spending by 35,000+ Indian digital agencies and 1.5 Crore+ freelancers & tech solopreneurs.', 85 + mWidth + mGap, 280, { width: 310, lineGap: 5 });

// SOM
doc.roundedRect(60 + (mWidth + mGap) * 2, 175, mWidth, 230, 12).fill('#111827');
doc.rect(60 + (mWidth + mGap) * 2, 175, mWidth, 230).strokeColor('#10B981').lineWidth(1.5).stroke();
doc.fillColor('#34D399').fontSize(36).font('Helvetica-Bold').text('Rs 85 Cr', 85 + (mWidth + mGap) * 2, 205);
doc.fillColor('#FFFFFF').fontSize(15).font('Helvetica-Bold').text('SOM (3-Year GMV Target)', 85 + (mWidth + mGap) * 2, 255);
doc.fillColor('#94A3B8').fontSize(11).font('Helvetica').text('Targeting 5,000 active digital agencies purchasing an average of 3 to 4 SaaS passes annually on StackDeal ($10M).', 85 + (mWidth + mGap) * 2, 280, { width: 310, lineGap: 5 });

// Two Detail Cards
doc.roundedRect(60, 430, 560, 200, 12).fill('#111827');
doc.rect(60, 430, 560, 200).strokeColor('#1E293B').lineWidth(1).stroke();
doc.fillColor('#FFFFFF').fontSize(15).font('Helvetica-Bold').text('35,000+ Registered Digital Agencies in India', 90, 455);
doc.fillColor('#94A3B8').fontSize(12).font('Helvetica').text(
  '• 94% are boutique operations with 2 to 20 team members.\n' +
  '• Average agency spends Rs 2.5 Lakh to Rs 4 Lakh annually on software.\n' +
  '• High intent to cut recurring expenses and obtain 18% GST tax input credit.',
  90, 485, { width: 500, lineGap: 6 }
);

doc.roundedRect(660, 430, 560, 200, 12).fill('#111827');
doc.rect(660, 430, 560, 200).strokeColor('#1E293B').lineWidth(1).stroke();
doc.fillColor('#FFFFFF').fontSize(15).font('Helvetica-Bold').text('1.5 Crore+ Freelancers & Tech Solopreneurs', 690, 455);
doc.fillColor('#94A3B8').fontSize(12).font('Helvetica').text(
  '• India is the 2nd largest freelancer workforce globally (NASSCOM data).\n' +
  '• Massive demand for affordable productivity, marketing, and scraping tools.\n' +
  '• Strong propensity to pay via instant UPI without corporate credit cards.',
  690, 485, { width: 500, lineGap: 6 }
);


// ─────────────────────────────────────────────
// SLIDE 6: BUSINESS MODEL
// ─────────────────────────────────────────────
startSlide('Marketplace Monetization & Unit Economics', '05 • Business Model & Revenue', 6);
doc.fillColor('#94A3B8').fontSize(14).font('Helvetica').text('Clear take-rate on deal volume with zero inventory and zero physical fulfillment costs.', 60, 130);

const bWidth = 360;
const bGap = 20;

// Model 1: Take Rate
doc.roundedRect(60, 175, bWidth, 460, 12).fill('#111827');
doc.rect(60, 175, bWidth, 460).strokeColor('#3B82F6').lineWidth(1.5).stroke();
doc.fillColor('#60A5FA').fontSize(18).font('Helvetica-Bold').text('1. Deal Take-Rate (Live)', 85, 205);
doc.fillColor('#CBD5E1').fontSize(12).font('Helvetica').text(
  '• 30% Marketplace Commission:\nStackDeal retains 30% of every 5-Year Pass transaction; 70% goes directly to the software creator.\n\n' +
  '• Healthy Unit Economics:\nOn a Rs 2,499 deal pass, StackDeal retains Rs 750 gross profit with zero inventory holding cost.\n\n' +
  '• Automated Split Payouts:\nBi-weekly direct bank transfers to verified vendor accounts.',
  85, 245, { width: 310, lineGap: 8 }
);

// Model 2: Plus Membership
doc.roundedRect(60 + bWidth + bGap, 175, bWidth, 460, 12).fill('#111827');
doc.rect(60 + bWidth + bGap, 175, bWidth, 460).strokeColor('#10B981').lineWidth(1.5).stroke();
doc.fillColor('#34D399').fontSize(18).font('Helvetica-Bold').text('2. StackDeal Plus (Q4)', 85 + bWidth + bGap, 205);
doc.fillColor('#CBD5E1').fontSize(12).font('Helvetica').text(
  '• Annual VIP Membership:\nRs 2,999/year subscription for active agency buyers.\n\n' +
  '• Agency VIP Perks:\n- Additional 10% discount on all deals\n- 24-hour early access to limited deal drops\n- Dedicated priority WhatsApp support\n\n' +
  '• 100% Pure Recurring SaaS Margin for StackDeal.',
  85 + bWidth + bGap, 245, { width: 310, lineGap: 8 }
);

// Model 3: Sponsored Spotlights
doc.roundedRect(60 + (bWidth + bGap) * 2, 175, bWidth, 460, 12).fill('#111827');
doc.rect(60 + (bWidth + bGap) * 2, 175, bWidth, 460).strokeColor('#F59E0B').lineWidth(1.5).stroke();
doc.fillColor('#FBBF24').fontSize(18).font('Helvetica-Bold').text('3. Sponsored Spotlights', 85 + (bWidth + bGap) * 2, 205);
doc.fillColor('#CBD5E1').fontSize(12).font('Helvetica').text(
  '• Featured Homepage Banners:\nEstablished SaaS vendors pay Rs 25,000 to Rs 50,000 per launch campaign for premium hero carousel placement.\n\n' +
  '• Dedicated Email Broadcasts:\nTargeted outbound blasts to our verified agency database.\n\n' +
  '• Co-branded Product Hunt & Community promotions.',
  85 + (bWidth + bGap) * 2, 245, { width: 310, lineGap: 8 }
);


// ─────────────────────────────────────────────
// SLIDE 7: COMPETITIVE ADVANTAGE
// ─────────────────────────────────────────────
startSlide('Why StackDeal Wins Over Global Incumbents', '06 • Competitive Advantage', 7);
doc.fillColor('#94A3B8').fontSize(14).font('Helvetica').text('Tailor-made for the unit economics and payment realities of the Indian ecosystem.', 60, 130);

// Table Header
const tY = 180;
doc.roundedRect(60, tY, 1160, 45, 8).fill('#1E293B');
doc.fillColor('#94A3B8').fontSize(12).font('Helvetica-Bold').text('CAPABILITY / METRIC', 85, tY + 15);
doc.fillColor('#818CF8').fontSize(12).font('Helvetica-Bold').text('STACKDEAL (INDIA)', 450, tY + 15);
doc.fillColor('#94A3B8').fontSize(12).font('Helvetica-Bold').text('APPSUMO (US)', 780, tY + 15);
doc.fillColor('#94A3B8').fontSize(12).font('Helvetica-Bold').text('PITCHGROUND', 1030, tY + 15);

const rows = [
  { metric: 'Payment Infrastructure', sd: 'Instant UPI, Cards & NetBanking', as: 'USD Credit Card only + markups', pg: 'USD / Limited cards' },
  { metric: 'Indian GST Compliance', sd: 'Automated 18% GST B2B Invoices', as: 'Zero Indian GST support', pg: 'Manual / Inconsistent' },
  { metric: 'Founder Revenue Share', sd: '70% to Founder (Fair)', as: '20% to 30% (Takes 70-80% cut)', pg: '40% to 50%' },
  { metric: 'Deal Access Model', sd: 'Sustainable 5-Year Pass', as: 'Infinite Lifetime Deals', pg: 'Lifetime Deals' },
  { metric: 'AI Matchmaker Copilot', sd: 'Built-in Groq AI Assistant', as: 'None (Manual search only)', pg: 'None' }
];

rows.forEach((r, idx) => {
  const rowY = tY + 55 + idx * 75;
  doc.roundedRect(60, rowY, 1160, 65, 8).fill(idx % 2 === 0 ? '#111827' : '#0F172A');
  doc.rect(60, rowY, 1160, 65).strokeColor('#1E293B').lineWidth(1).stroke();

  doc.fillColor('#FFFFFF').fontSize(13).font('Helvetica-Bold').text(r.metric, 85, rowY + 25);
  doc.fillColor('#34D399').fontSize(13).font('Helvetica-Bold').text(r.sd, 450, rowY + 25);
  doc.fillColor('#94A3B8').fontSize(12).font('Helvetica').text(r.as, 780, rowY + 25);
  doc.fillColor('#94A3B8').fontSize(12).font('Helvetica').text(r.pg, 1030, rowY + 25);
});


// ─────────────────────────────────────────────
// SLIDE 8: TEAM & EXECUTION
// ─────────────────────────────────────────────
startSlide('Built with Speed, Technical Grit & Capital Efficiency', '07 • Team & Execution Capability', 8);
doc.fillColor('#94A3B8').fontSize(14).font('Helvetica').text('Zero corporate overheads, high shipping velocity, and full-stack technical ownership.', 60, 130);

// Left: Founder Profile
doc.roundedRect(60, 175, 560, 460, 12).fill('#111827');
doc.rect(60, 175, 560, 460).strokeColor('#6366F1').lineWidth(1.5).stroke();

doc.roundedRect(90, 205, 60, 60, 30).fill('#6366F1');
doc.fillColor('#FFFFFF').fontSize(22).font('Helvetica-Bold').text('UT', 105, 222);

doc.fillColor('#FFFFFF').fontSize(22).font('Helvetica-Bold').text('Ujjawal Tiwari', 170, 212);
doc.fillColor('#818CF8').fontSize(14).font('Helvetica').text('Founder & Full-Stack Builder', 170, 240);

doc.fillColor('#CBD5E1').fontSize(13).font('Helvetica').text(
  '• Built the entire StackDeal platform end-to-end: Next.js 16, TypeScript, MongoDB, Razorpay payment gateway, and Groq AI integration.\n\n' +
  '• Demonstrated rapid execution: Diagnosed complex SEO crawling/soft 404 indexing issues, launched on Product Hunt, and deployed production-grade infrastructure with zero capital burn.\n\n' +
  '• Hands-on founder committed to making StackDeal the default software discovery layer for Indian digital agencies.',
  90, 290, { width: 500, lineGap: 8 }
);

// Right: Core Execution Principles
doc.roundedRect(660, 175, 560, 460, 12).fill('#111827');
doc.rect(660, 175, 560, 460).strokeColor('#10B981').lineWidth(1.5).stroke();

doc.fillColor('#34D399').fontSize(20).font('Helvetica-Bold').text('Core Execution Principles', 690, 205);
doc.fillColor('#CBD5E1').fontSize(13).font('Helvetica').text(
  '• Hyper-Lean Capital Discipline: We do not burn money on vanity metrics or bloated teams; every rupee is deployed into vendor curation and buyer acquisition.\n\n' +
  '• Fast Iteration Loops: Daily shipping cadence driven by live user feedback, technical monitoring, and rapid feature deployment.\n\n' +
  '• Organic Community Flywheel: Driving growth through Product Hunt launches, LinkedIn founder storytelling, and direct agency partnerships.',
  690, 255, { width: 500, lineGap: 9 }
);


// ─────────────────────────────────────────────
// SLIDE 9: TRACTION & MILESTONES
// ─────────────────────────────────────────────
startSlide('Real Milestones Delivered (Not Just an Idea)', '08 • Traction & Progress', 9);
doc.fillColor('#94A3B8').fontSize(14).font('Helvetica').text('StackDeal is a live, operating, and verified software marketplace today.', 60, 130);

const tColW = 360;
const tColGap = 20;

// Milestone 1
doc.roundedRect(60, 175, tColW, 260, 12).fill('#111827');
doc.rect(60, 175, tColW, 260).strokeColor('#3B82F6').lineWidth(1).stroke();
doc.fillColor('#60A5FA').fontSize(18).font('Helvetica-Bold').text('Live Production Platform', 85, 205);
doc.fillColor('#CBD5E1').fontSize(12).font('Helvetica').text(
  '• Fully deployed at stackdeal.in\n' +
  '• Production database & API architecture\n' +
  '• Instant cart & Razorpay UPI checkout active\n' +
  '• Automated webhook and license key delivery',
  85, 245, { width: 310, lineGap: 8 }
);

// Milestone 2
doc.roundedRect(60 + tColW + tColGap, 175, tColW, 260, 12).fill('#111827');
doc.rect(60 + tColW + tColGap, 175, tColW, 260).strokeColor('#F59E0B').lineWidth(1).stroke();
doc.fillColor('#FBBF24').fontSize(18).font('Helvetica-Bold').text('Product Hunt Launch', 85 + tColW + tColGap, 205);
doc.fillColor('#CBD5E1').fontSize(12).font('Helvetica').text(
  '• Officially live on Product Hunt (September 2026)\n' +
  '• Active community engagement and reviews\n' +
  '• Verified Maker profile & live analytics\n' +
  '• High-authority backlink boosting global SEO',
  85 + tColW + tColGap, 245, { width: 310, lineGap: 8 }
);

// Milestone 3
doc.roundedRect(60 + (tColW + tColGap) * 2, 175, tColW, 260, 12).fill('#111827');
doc.rect(60 + (tColW + tColGap) * 2, 175, tColW, 260).strokeColor('#10B981').lineWidth(1).stroke();
doc.fillColor('#34D399').fontSize(18).font('Helvetica-Bold').text('Google Indexing Verified', 85 + (tColW + tColGap) * 2, 205);
doc.fillColor('#CBD5E1').fontSize(12).font('Helvetica').text(
  '• Green check verified on Google Search Console\n' +
  '• Server-Side Rendered (SSR) rich HTML payload\n' +
  '• Schema.org Product & FAQ structured data\n' +
  '• Zero Soft 404 crawl errors',
  85 + (tColW + tColGap) * 2, 245, { width: 310, lineGap: 8 }
);

// Pipeline Banner
doc.roundedRect(60, 460, 1160, 175, 12).fill('#0F172A');
doc.rect(60, 460, 1160, 175).strokeColor('#6366F1').lineWidth(1).stroke();

doc.fillColor('#FFFFFF').fontSize(16).font('Helvetica-Bold').text('Active Deal Pipeline & Target Categories:', 90, 485);
doc.fillColor('#CBD5E1').fontSize(13).font('Helvetica').text(
  '1. Chat Chacha — WhatsApp AI Marketing & Meta Cloud API Automation\n' +
  '2. SEO Rocket — AI Keyword Ranking & Competitor Radar for Digital Agencies\n' +
  '3. EmailExtractor Pro AI — B2B Lead Scraping and Google Maps Data Extraction\n' +
  '4. Nuwatomic — Generative Engine Optimization (GEO) for ChatGPT & Perplexity Search',
  90, 515, { lineGap: 6 }
);


// ─────────────────────────────────────────────
// SLIDE 10: ROADMAP & USE OF FUNDS
// ─────────────────────────────────────────────
startSlide('Roadmap & Deployment of First Capital (Rs 1 Lakh)', '09 • Future Vision & Growth Roadmap', 10);
doc.fillColor('#94A3B8').fontSize(14).font('Helvetica').text('Clear capital allocation strategy to scale from initial traction to market dominance.', 60, 130);

// Left: Use of Funds
doc.roundedRect(60, 175, 560, 460, 12).fill('#111827');
doc.rect(60, 175, 560, 460).strokeColor('#10B981').lineWidth(1.5).stroke();

doc.fillColor('#34D399').fontSize(20).font('Helvetica-Bold').text('Deployment of Rs 1 Lakh Capital', 90, 205);
doc.fillColor('#CBD5E1').fontSize(13).font('Helvetica').text(
  '• 40% (Rs 40,000) — Vendor Acquisition & Onboarding:\nDirect outreach and launch onboarding incentives to secure exclusive 5-Year Passes for the first 25 high-quality SaaS tools.\n\n' +
  '• 35% (Rs 35,000) — Agency Community Distribution:\nTargeted spotlight campaigns across Indian marketing agency WhatsApp hubs, LinkedIn founder networks, and digital marketing communities.\n\n' +
  '• 25% (Rs 25,000) — Platform Infrastructure & Scaling:\nDedicated production server capacity, automated GST invoice pipelines, and Groq AI Matchmaker optimization.',
  90, 245, { width: 500, lineGap: 8 }
);

// Right: 12-Month Targets
doc.roundedRect(660, 175, 560, 460, 12).fill('#111827');
doc.rect(660, 175, 560, 460).strokeColor('#6366F1').lineWidth(1.5).stroke();

doc.fillColor('#818CF8').fontSize(20).font('Helvetica-Bold').text('12-Month Milestone Targets', 690, 205);
doc.fillColor('#CBD5E1').fontSize(13).font('Helvetica').text(
  '• 50+ Verified SaaS Deals live across Marketing, Sales, SEO, and Productivity.\n\n' +
  '• 2,000+ Active Paying Agency Accounts across Tier-1 and Tier-2 Indian business hubs.\n\n' +
  '• Rs 1.5 Crore+ Gross Merchandise Value (GMV) with healthy operating profit margins.\n\n' +
  '• Direct Impact: Enabling 50+ Indian bootstrapped software creators to earn their first Rs 5L to Rs 10L in sustainable revenue.',
  690, 245, { width: 500, lineGap: 8 }
);

doc.end();

writeStream.on('finish', () => {
  console.log('PDF successfully generated at:', outputPath);
  try {
    fs.copyFileSync(outputPath, desktopOutputPath);
    console.log('PDF successfully copied to Desktop:', desktopOutputPath);
  } catch (e) {
    console.log('Desktop copy skipped/noted:', e.message);
  }
});
