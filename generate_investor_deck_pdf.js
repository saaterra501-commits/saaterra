const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

// Slide dimensions: 16:9 widescreen presentation (1280 x 720 pt)
const doc = new PDFDocument({
  size: [1280, 720],
  margins: { top: 35, bottom: 35, left: 55, right: 55 },
  autoFirstPage: false
});

const outputPath = path.join('C:\\Users\\ujjaw\\OneDrive\\Documents\\saaterra', 'StackDeal_Investor_Pitch_Deck.pdf');
const desktopOutputPath = path.join('C:\\Users\\ujjaw\\OneDrive\\Desktop\\saaterra', 'StackDeal_Investor_Pitch_Deck.pdf');

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Helper function to render consistent slide frame
function createSlide(slideNumber, categoryTag, slideTitle, slideSubtitle) {
  doc.addPage();

  // 1. Pure crisp clean background
  doc.rect(0, 0, 1280, 720).fill('#0F172A'); // Modern slate dark theme

  // 2. Ambient subtle background accents
  doc.save();
  doc.circle(1180, 90, 180).fillOpacity(0.04).fill('#6366F1');
  doc.circle(90, 630, 160).fillOpacity(0.03).fill('#FF6B35');
  doc.restore();

  // 3. Top Accent Bar
  doc.rect(0, 0, 1280, 5).fill('#FF6B35');

  // 4. Header Bar
  // Brand Pill
  doc.roundedRect(55, 25, 26, 26, 6).fill('#FF6B35');
  doc.fillColor('#FFFFFF').fontSize(15).font('Helvetica-Bold').text('%', 62, 30);

  doc.fillColor('#FFFFFF').fontSize(16).font('Helvetica-Bold').text('StackDeal', 90, 28);
  doc.fillColor('#94A3B8').fontSize(11).font('Helvetica').text('• stackdeal.in', 172, 31);

  // Category Tag on top right
  doc.roundedRect(930, 24, 295, 28, 6).fill('#1E293B');
  doc.fillColor('#818CF8').fontSize(10).font('Helvetica-Bold').text(categoryTag.toUpperCase(), 930, 32, { width: 295, align: 'center' });

  // Header Divider
  doc.strokeColor('#334155').lineWidth(0.8).moveTo(55, 62).lineTo(1225, 62).stroke();

  // 5. Slide Title & Subtitle
  doc.fillColor('#F8FAFC').fontSize(24).font('Helvetica-Bold').text(slideTitle, 55, 78);
  if (slideSubtitle) {
    doc.fillColor('#94A3B8').fontSize(12.5).font('Helvetica').text(slideSubtitle, 55, 110, { width: 1170 });
  }

  // 6. Footer
  doc.strokeColor('#334155').lineWidth(0.8).moveTo(55, 672).lineTo(1225, 672).stroke();
  doc.fillColor('#64748B').fontSize(9.5).font('Helvetica').text('StackDeal — Official Investor Pitch Deck • First Capital by Indra Dhar', 55, 685);
  doc.fillColor('#94A3B8').fontSize(9.5).font('Helvetica-Bold').text(`SLIDE ${slideNumber} OF 10`, 1100, 685, { width: 125, align: 'right' });
}

// Card Renderer Helper
function drawCard(x, y, w, h, borderColor, tagText, tagColor, titleText, bulletItems) {
  doc.roundedRect(x, y, w, h, 10).fill('#1E293B');
  doc.roundedRect(x, y, w, h, 10).strokeColor(borderColor || '#334155').lineWidth(1.2).stroke();

  let curY = y + 16;

  if (tagText) {
    doc.fillColor(tagColor || '#818CF8').fontSize(9.5).font('Helvetica-Bold').text(tagText.toUpperCase(), x + 18, curY);
    curY += 16;
  }

  if (titleText) {
    doc.fillColor('#FFFFFF').fontSize(15).font('Helvetica-Bold').text(titleText, x + 18, curY, { width: w - 36 });
    curY += 24;
  } else {
    curY += 6;
  }

  if (bulletItems && bulletItems.length > 0) {
    bulletItems.forEach((item) => {
      // Bullet Dot
      doc.circle(x + 22, curY + 6, 2.5).fill(tagColor || '#818CF8');
      
      // Item Title & Description
      if (item.bold) {
        doc.fillColor('#F1F5F9').fontSize(11).font('Helvetica-Bold').text(item.bold + ': ', x + 32, curY, {
          continued: true,
          width: w - 50
        });
        doc.fillColor('#CBD5E1').fontSize(11).font('Helvetica').text(item.text, {
          lineGap: 3
        });
      } else {
        doc.fillColor('#CBD5E1').fontSize(11).font('Helvetica').text(item.text, x + 32, curY, {
          width: w - 50,
          lineGap: 3
        });
      }

      curY += item.space || 32;
    });
  }
}

// ─────────────────────────────────────────────
// SLIDE 1: STARTUP OVERVIEW (COVER)
// ─────────────────────────────────────────────
doc.addPage();
doc.rect(0, 0, 1280, 720).fill('#0F172A');

// Top Accent
doc.rect(0, 0, 1280, 6).fill('#FF6B35');

// Cover Card Background
doc.roundedRect(120, 75, 1040, 570, 16).fill('#1E293B');
doc.roundedRect(120, 75, 1040, 570, 16).strokeColor('#334155').lineWidth(1.5).stroke();

// Brand Header
doc.roundedRect(570, 115, 46, 46, 10).fill('#FF6B35');
doc.fillColor('#FFFFFF').fontSize(26).font('Helvetica-Bold').text('%', 583, 124);
doc.fillColor('#FFFFFF').fontSize(44).font('Helvetica-Bold').text('StackDeal', 120, 175, { width: 1040, align: 'center' });

doc.fillColor('#818CF8').fontSize(16).font('Helvetica-Bold').text('INDIA\'S CURATED B2B SAAS DEAL MARKETPLACE', 120, 230, { width: 1040, align: 'center' });
doc.fillColor('#CBD5E1').fontSize(14).font('Helvetica').text(
  'Empowering 35,000+ Indian Digital Marketing Agencies with 5-Year Access Passes,\nwhile giving bootstrapped SaaS founders profitable, sustainable distribution.',
  120, 260, { width: 1040, align: 'center', lineGap: 5 }
);

// 3 Highlight Feature Cards
const cW = 300;
const cG = 25;
const startX = 185;

// Card A
doc.roundedRect(startX, 340, cW, 145, 8).fill('#0F172A');
doc.roundedRect(startX, 340, cW, 145, 8).strokeColor('#6366F1').lineWidth(1).stroke();
doc.fillColor('#818CF8').fontSize(11).font('Helvetica-Bold').text('FOR AGENCIES & BUYERS', startX + 15, 355);
doc.fillColor('#F8FAFC').fontSize(13).font('Helvetica-Bold').text('Zero Subscription Fatigue', startX + 15, 375);
doc.fillColor('#94A3B8').fontSize(10.5).font('Helvetica').text('Pay once in INR via UPI, get 5 full years of verified software access with automated 18% GST invoices.', startX + 15, 400, { width: cW - 30, lineGap: 3 });

// Card B
doc.roundedRect(startX + cW + cG, 340, cW, 145, 8).fill('#0F172A');
doc.roundedRect(startX + cW + cG, 340, cW, 145, 8).strokeColor('#10B981').lineWidth(1).stroke();
doc.fillColor('#34D399').fontSize(11).font('Helvetica-Bold').text('FOR SAAS FOUNDERS', startX + cW + cG + 15, 355);
doc.fillColor('#F8FAFC').fontSize(13).font('Helvetica-Bold').text('70% Direct Revenue Share', startX + cW + cG + 15, 375);
doc.fillColor('#94A3B8').fontSize(10.5).font('Helvetica').text('Acquire 100+ paying agency power users with bi-weekly payouts and 1-Click AI listing copilot.', startX + cW + cG + 15, 400, { width: cW - 30, lineGap: 3 });

// Card C
doc.roundedRect(startX + (cW + cG) * 2, 340, cW, 145, 8).fill('#0F172A');
doc.roundedRect(startX + (cW + cG) * 2, 340, cW, 145, 8).strokeColor('#F59E0B').lineWidth(1).stroke();
doc.fillColor('#FBBF24').fontSize(11).font('Helvetica-Bold').text('MARKET VALIDATION', startX + (cW + cG) * 2 + 15, 355);
doc.fillColor('#F8FAFC').fontSize(13).font('Helvetica-Bold').text('Live & Product Hunt Debuted', startX + (cW + cG) * 2 + 15, 375);
doc.fillColor('#94A3B8').fontSize(10.5).font('Helvetica').text('Fully deployed at stackdeal.in with razorpay checkout, live multi-vendor catalogue, and Google indexing.', startX + (cW + cG) * 2 + 15, 400, { width: cW - 30, lineGap: 3 });

// Pitch Details
doc.fillColor('#E2E8F0').fontSize(11.5).font('Helvetica-Bold').text('Founder: Ujjawal Tiwari  •  Platform: stackdeal.in  •  First Capital by Indra Dhar 2026', 120, 520, { width: 1040, align: 'center' });
doc.fillColor('#64748B').fontSize(10).font('Helvetica').text('Official Investment & Mentorship Pitch Deck • Slide 1 of 10', 120, 600, { width: 1040, align: 'center' });


// ─────────────────────────────────────────────
// SLIDE 2: THE PROBLEM (2-SIDED CRISIS)
// ─────────────────────────────────────────────
createSlide(2, '01 • Problem Analysis', '2. The Two-Sided Crisis in B2B Software', 'Indian agencies suffer from recurring subscription bleed, while bootstrapped founders have zero distribution.');

drawCard(55, 140, 570, 510, '#EF4444', 'Problem A • The Indian Agency Pain', 'The Buyer Struggle', null, [
  { bold: 'Severe Monthly Subscription Bleed', text: 'An average boutique agency uses 6 to 8 SaaS tools (WhatsApp bots, SEO trackers, lead scrapers, CRM), paying $30 to $99 every month on credit cards, even during slow business seasons.', space: 70 },
  { bold: 'Zero Indian GST Tax Credit (18% Direct Loss)', text: 'Foreign billing from Stripe/US entities offers zero Indian GST compliance, forcing agencies to forfeit 18% tax input credit (ITC) on software expenses.', space: 70 },
  { bold: 'Currency Surcharges & Bank Failures', text: 'Indian bank debit cards face automatic foreign transaction blocks under RBI rules, plus 3.5% foreign exchange bank markup fees on USD payments.', space: 70 },
  { bold: 'Overwhelming Tool Redundancy', text: 'Agencies pay for bloated enterprise feature sets when they only need 20% core utility for daily client deliverables.', space: 60 }
]);

drawCard(655, 140, 570, 510, '#F59E0B', 'Problem B • The SaaS Founder Pain', 'The Seller Struggle', null, [
  { bold: 'The Distribution & Marketing Bottleneck', text: 'Independent software developers build world-class products but have ₹0 marketing budget to acquire their first 100 paying customers.', space: 70 },
  { bold: 'Predatory Legacy Deal Platforms', text: 'Global platforms like AppSumo take 70% to 80% commissions from founders and withhold payouts in escrow for over 60 days.', space: 70 },
  { bold: 'Infinite Server Cost Liabilities', text: 'Traditional "Lifetime Deals" (LTDs) burden founders with infinite server and API costs with zero recurring unit economic boundaries.', space: 70 },
  { bold: 'Neglect of the Indian Tech Market', text: 'Global platforms ignore the 35,000+ Indian agency ecosystem due to lack of local UPI payment rails and Indian tax invoicing.', space: 60 }
]);


// ─────────────────────────────────────────────
// SLIDE 3: THE SOLUTION (5-YEAR PASS MODEL)
// ─────────────────────────────────────────────
createSlide(3, '02 • Solution & Innovation', '3. The 5-Year Access Pass Marketplace', 'A sustainable, transparent model connecting high-utility software with verified agency buyers.');

const sColW = 370;
const sGap = 30;

drawCard(55, 140, sColW, 510, '#6366F1', 'For Agencies & SMBs', 'Peace of Mind & Local Tax', null, [
  { bold: '5-Year Cost Predictability', text: 'Pay once in INR, get 5 full years of verified software access with zero recurring monthly surprise bills.', space: 65 },
  { bold: '100% Indian-Native Checkout', text: '1-Click payment via PhonePe, Google Pay, Paytm, Net Banking, and Indian Cards via Razorpay.', space: 65 },
  { bold: 'Automated 18% GST Invoices', text: 'Instant B2B tax invoices with agency GSTIN for straightforward CA tax write-offs and ITC.', space: 65 },
  { bold: '60-Day Guarantee', text: 'Unconditional money-back trial guarantee on all software passes.', space: 55 }
]);

drawCard(55 + sColW + sGap, 140, sColW, 510, '#10B981', 'For SaaS Founders', 'Profitable Distribution', null, [
  { bold: '70% Founder Revenue Share', text: 'Founders keep 70% of every sale with bi-weekly direct bank payouts (vs AppSumo’s 20-30%).', space: 65 },
  { bold: '100+ Paying Power Users', text: 'Instant cohort of active agency customers driving real testimonials, reviews, and word-of-mouth.', space: 65 },
  { bold: '1-Click AI Listing Copilot', text: 'Automated deal copy, graphics, and landing page generated in under 5 minutes.', space: 65 },
  { bold: 'Zero Upfront Fees', text: '100% performance-based listing with zero upfront financial risk.', space: 55 }
]);

drawCard(55 + (sColW + sGap) * 2, 140, sColW, 510, '#F59E0B', 'The 5-Year Model', 'Sustainable Economics', null, [
  { bold: 'Eliminates Lifetime Liability', text: '5-Year Passes establish healthy server boundaries while giving agencies multi-year cost certainty.', space: 65 },
  { bold: 'Natural Agency Expansion', text: 'As client volume expands beyond tier caps, agencies naturally upgrade to vendor recurring plans.', space: 65 },
  { bold: 'Win-Win Unit Economics', text: 'Buyers save 85-92% compared to monthly subscriptions; founders receive lump-sum upfront cash flow.', space: 65 },
  { bold: 'Curated Quality Only', text: 'Strict QA vetting ensures only high-uptime tools get listed.', space: 55 }
]);


// ─────────────────────────────────────────────
// SLIDE 4: THE PRODUCT & TECH STACK
// ─────────────────────────────────────────────
createSlide(4, '03 • Product Architecture', '4. Live & Fully Operational Platform (stackdeal.in)', 'Production-grade marketplace architecture built for sub-second speed, compliance, and AI matching.');

const pColW = 270;
const pGapX = 26;

drawCard(55, 140, pColW, 310, '#3B82F6', 'Performance', 'Next.js 16 SSR Engine', null, [
  { bold: 'Sub-Second Speeds', text: 'Pre-rendered server-side architecture delivering instant page loads.', space: 55 },
  { bold: 'Verified SEO', text: '100% Google Search Console indexing with zero Soft 404 crawl errors.', space: 55 },
  { bold: 'Schema.org', text: 'Automated Product & FAQ rich snippets for organic search discovery.', space: 45 }
]);

drawCard(55 + pColW + pGapX, 140, pColW, 310, '#10B981', 'Billing Engine', 'Razorpay & GST Invoicing', null, [
  { bold: 'UPI & RuPay', text: 'Native PhonePe, GPay, and Card payment rails with zero checkout drop-off.', space: 55 },
  { bold: 'Instant PDF Invoices', text: 'Automated B2B tax invoice generation with GSTIN validation.', space: 55 },
  { bold: 'Webhook Engine', text: 'Real-time license key assignment upon successful payment.', space: 45 }
]);

drawCard(55 + (pColW + pGapX) * 2, 140, pColW, 310, '#EC4899', 'AI Intelligence', 'Groq AI Matchmaker', null, [
  { bold: 'Llama-3 Powered', text: 'Ultra-fast inference analyzing agency niche, size, and tool requirements.', space: 55 },
  { bold: 'Smart Stacks', text: 'Recommends highest-ROI software bundle in 3 seconds.', space: 55 },
  { bold: 'Vendor Copilot', text: 'Assists founders in writing high-converting deal copy.', space: 45 }
]);

drawCard(55 + (pColW + pGapX) * 3, 140, pColW, 310, '#F59E0B', 'Security & Ops', 'Vendor Vault Portal', null, [
  { bold: 'Admin Operations', text: 'Secure vault for deal approvals, redemption codes, and metrics.', space: 55 },
  { bold: 'Payout Tracking', text: 'Automated 70-30 split accounting and escrow management.', space: 55 },
  { bold: 'Shield Defense', text: 'DDoS rate-limiting and bot-blocking middleware active.', space: 45 }
]);

// Bottom Verified Active Deals Box
doc.roundedRect(55, 470, 1170, 180, 10).fill('#1E293B');
doc.roundedRect(55, 470, 1170, 180, 10).strokeColor('#6366F1').lineWidth(1.2).stroke();
doc.fillColor('#818CF8').fontSize(11).font('Helvetica-Bold').text('VERIFIED LIVE CATALOGUE ON STACKDEAL.IN TODAY', 75, 490);
doc.fillColor('#FFFFFF').fontSize(15).font('Helvetica-Bold').text('Curated High-Utility B2B Deals in Active Production:', 75, 510);

const dList = [
  '• Chat Chacha — WhatsApp AI Marketing & Official Meta Cloud API Automation (Bestseller)',
  '• SEO Rocket — AI Keyword Ranking & Competitor Radar for Digital Agencies (Hot Deal)',
  '• EmailExtractor Pro AI — Verified B2B Lead Scraping & Google Maps Data Extraction (Trending)',
  '• Nuwatomic — Generative Engine Optimization (GEO) for ChatGPT, Claude & Perplexity Search'
];
dList.forEach((deal, idx) => {
  doc.fillColor('#CBD5E1').fontSize(11.5).font('Helvetica').text(deal, 75, 545 + idx * 22);
});


// ─────────────────────────────────────────────
// SLIDE 5: MARKET OPPORTUNITY (TAM-SAM-SOM)
// ─────────────────────────────────────────────
createSlide(5, '04 • Market Sizing', '5. The $14.5 Billion Indian SaaS Opportunity', 'Data verified from SaaSBoomi, NASSCOM, IAMAI, and Bain & Company research reports.');

const mColW = 370;
const mGapX = 30;

// TAM Box
doc.roundedRect(55, 140, mColW, 230, 10).fill('#1E293B');
doc.roundedRect(55, 140, mColW, 230, 10).strokeColor('#3B82F6').lineWidth(1.5).stroke();
doc.fillColor('#60A5FA').fontSize(32).font('Helvetica-Bold').text('₹1,20,000 Cr', 75, 160);
doc.fillColor('#FFFFFF').fontSize(15).font('Helvetica-Bold').text('TAM ($14.5 Billion)', 75, 205);
doc.fillColor('#94A3B8').fontSize(11).font('Helvetica').text(
  'Total Indian domestic B2B SaaS software consumption market by 2026, expanding at 28% annual CAGR toward $50 Billion by 2030 (SaaSBoomi & NASSCOM Domestic SaaS Report).',
  75, 230, { width: mColW - 40, lineGap: 4 }
);

// SAM Box
doc.roundedRect(55 + mColW + mGapX, 140, mColW, 230, 10).fill('#1E293B');
doc.roundedRect(55 + mColW + mGapX, 140, mColW, 230, 10).strokeColor('#F97316').lineWidth(1.5).stroke();
doc.fillColor('#FB923C').fontSize(32).font('Helvetica-Bold').text('₹8,500 Cr', 75 + mColW + mGapX, 160);
doc.fillColor('#FFFFFF').fontSize(15).font('Helvetica-Bold').text('SAM ($1.0 Billion)', 75 + mColW + mGapX, 205);
doc.fillColor('#94A3B8').fontSize(11).font('Helvetica').text(
  'Annual software expenditure by 35,000+ Indian digital marketing agencies and 1.5 Crore+ tech freelancers & solopreneurs spending ₹2.5L to ₹4L/year on marketing & automation SaaS.',
  75 + mColW + mGapX, 230, { width: mColW - 40, lineGap: 4 }
);

// SOM Box
doc.roundedRect(55 + (mColW + mGapX) * 2, 140, mColW, 230, 10).fill('#1E293B');
doc.roundedRect(55 + (mColW + mGapX) * 2, 140, mColW, 230, 10).strokeColor('#10B981').lineWidth(1.5).stroke();
doc.fillColor('#34D399').fontSize(32).font('Helvetica-Bold').text('₹85 Cr', 75 + (mColW + mGapX) * 2, 160);
doc.fillColor('#FFFFFF').fontSize(15).font('Helvetica-Bold').text('SOM (3-Year GMV Target)', 75 + (mColW + mGapX) * 2, 205);
doc.fillColor('#94A3B8').fontSize(11).font('Helvetica').text(
  'Capturing 5,000 active digital agencies purchasing an average of 3 to 4 SaaS passes annually on StackDeal ($10M GMV), generating ₹26.2 Crore net revenue for StackDeal.',
  75 + (mColW + mGapX) * 2, 230, { width: mColW - 40, lineGap: 4 }
);

// Bottom 2 Detail Cards
drawCard(55, 395, 570, 255, '#334155', 'Target Segment 1', '35,000+ Digital Marketing Agencies', null, [
  { bold: 'Boutique Dominance', text: '94% of agencies are boutique operations with 2 to 20 team members (IAMAI Census Data).', space: 45 },
  { bold: 'Tool Spending Profile', text: 'Average agency spends ₹2.5 Lakh to ₹4.0 Lakh per year across 6-8 disconnected tools.', space: 45 },
  { bold: 'Tax Motivation', text: 'High willingness to consolidate spending onto StackDeal for 18% GST input credit savings.', space: 40 }
]);

drawCard(655, 395, 570, 255, '#334155', 'Target Segment 2', '1.5 Crore+ Freelancers & Tech Creators', null, [
  { bold: 'Global Freelancer Hub', text: 'India is the #2 largest freelancer workforce globally (NASSCOM FutureSkills data).', space: 45 },
  { bold: 'UPI Payment Behavior', text: 'Strong preference for instant UPI QR checkout rather than expensive USD credit card subscriptions.', space: 45 },
  { bold: 'Price Sensitivity', text: 'Desperately seeking affordable 5-Year Passes to avoid monthly recurring cash flow strain.', space: 40 }
]);


// ─────────────────────────────────────────────
// SLIDE 6: BUSINESS MODEL & UNIT ECONOMICS
// ─────────────────────────────────────────────
createSlide(6, '05 • Business Model', '6. High-Margin Marketplace Monetization', 'Clear commission take-rate on deal volume with zero physical inventory or fulfillment risk.');

const bColW = 370;
const bGapX = 30;

drawCard(55, 140, bColW, 510, '#3B82F6', 'Stream 1 • Live Today', '30% Marketplace Commission', null, [
  { bold: 'Transparent 70/30 Split', text: 'StackDeal retains 30% on every 5-Year Pass transaction; 70% is transferred directly to the software creator.', space: 60 },
  { bold: 'Unit Economics Example', text: 'Retail Price: ₹2,499 (Buyer pays once for 5 years)\nFounder Payout: ₹1,749 (70% direct payout)\nStackDeal Gross Profit: ₹750 (30% net take-rate)', space: 75 },
  { bold: 'Pure Software Margins', text: 'Zero inventory holding costs; 100% digital fulfillment via automated license keys.', space: 60 },
  { bold: 'Automated Payouts', text: 'Bi-weekly direct bank settlements to verified vendor accounts.', space: 55 }
]);

drawCard(55 + bColW + bGapX, 140, bColW, 510, '#10B981', 'Stream 2 • Q4 Launch', 'StackDeal Plus VIP Membership', null, [
  { bold: 'Annual VIP Subscription', text: '₹2,999/year membership for high-volume agency buyers and power users.', space: 60 },
  { bold: 'Exclusive VIP Benefits', text: '• Extra 10% discount on all marketplace deals\n• 24-hour early access to limited deal drops\n• Dedicated priority WhatsApp account manager', space: 75 },
  { bold: '100% Recurring Margin', text: 'Generates predictable recurring SaaS subscription cash flow for StackDeal.', space: 60 },
  { bold: 'High Retention', text: 'Increases annual customer lifetime value (LTV) by 4x.', space: 55 }
]);

drawCard(55 + (bColW + bGapX) * 2, 140, bColW, 510, '#F59E0B', 'Stream 3 • Expansion', 'Sponsored Vendor Spotlights', null, [
  { bold: 'Hero Carousel Placement', text: 'Established SaaS vendors pay ₹25,000 to ₹50,000 per launch campaign for premium hero slider visibility.', space: 65 },
  { bold: 'Dedicated Outbound Blasts', text: 'Sponsored newsletter and WhatsApp broadcasts to our verified Indian agency database.', space: 65 },
  { bold: 'Co-Branded Launch Bundles', text: 'High-margin promotional fee for featured category takeovers and Product Hunt syndication.', space: 65 },
  { bold: 'B2B Lead Generation', text: 'Vendors acquire enterprise agency demo requests.', space: 55 }
]);


// ─────────────────────────────────────────────
// SLIDE 7: COMPETITIVE MOAT (STACKDEAL VS APPSUMO)
// ─────────────────────────────────────────────
createSlide(7, '06 • Competitive Advantage', '7. Why StackDeal Wins in the Indian Market', 'Built specifically for the payment infrastructure, tax regulations, and unit economics of India.');

// Comparison Matrix Table
const cY = 150;
doc.roundedRect(55, cY, 1170, 42, 6).fill('#1E293B');
doc.fillColor('#94A3B8').fontSize(11).font('Helvetica-Bold').text('KEY METRIC / FEATURE', 75, cY + 14);
doc.fillColor('#818CF8').fontSize(11).font('Helvetica-Bold').text('STACKDEAL (INDIA-FIRST)', 370, cY + 14);
doc.fillColor('#CBD5E1').fontSize(11).font('Helvetica-Bold').text('APPSUMO (US INCUMBENT)', 690, cY + 14);
doc.fillColor('#CBD5E1').fontSize(11).font('Helvetica-Bold').text('PITCHGROUND', 990, cY + 14);

const cRows = [
  { feat: 'Payment Infrastructure', sd: 'Instant UPI, PhonePe, Paytm, RuPay & Cards', as: 'Foreign USD Credit Cards only (3.5% markup)', pg: 'USD / Limited Card Rails' },
  { feat: 'Indian GST Tax Compliance', sd: 'Automated 18% GST B2B Invoices with GSTIN', as: 'Zero Indian GST (18% direct tax loss)', pg: 'Manual / Inconsistent' },
  { feat: 'Founder Revenue Share', sd: '70% to SaaS Founder (Bi-weekly Payouts)', as: '20% to 30% (Takes 70-80% commission)', pg: '40% to 50%' },
  { feat: 'Access Model Structure', sd: 'Sustainable 5-Year Access Pass', as: 'Infinite Lifetime Deals (Heavy server risk)', pg: 'Lifetime Deals' },
  { feat: 'Local Software Curation', sd: 'WhatsApp Bots, Maps Scrapers, Local SEO', as: 'US/EU tools only (Ignores WhatsApp & D2C)', pg: 'Generic Global Tools' },
  { feat: 'AI Deal Matchmaker', sd: 'Built-in Groq AI Copilot for Agency Stacks', as: 'Manual Keyword Search Only', pg: 'None' }
];

cRows.forEach((r, idx) => {
  const rowY = cY + 50 + idx * 72;
  doc.roundedRect(55, rowY, 1170, 64, 6).fill(idx % 2 === 0 ? '#111827' : '#1E293B');
  doc.roundedRect(55, rowY, 1170, 64, 6).strokeColor('#334155').lineWidth(0.8).stroke();

  doc.fillColor('#FFFFFF').fontSize(12).font('Helvetica-Bold').text(r.feat, 75, rowY + 24);
  doc.fillColor('#34D399').fontSize(11.5).font('Helvetica-Bold').text(r.sd, 370, rowY + 24, { width: 300 });
  doc.fillColor('#94A3B8').fontSize(11).font('Helvetica').text(r.as, 690, rowY + 24, { width: 280 });
  doc.fillColor('#94A3B8').fontSize(11).font('Helvetica').text(r.pg, 990, rowY + 24, { width: 200 });
});


// ─────────────────────────────────────────────
// SLIDE 8: FOUNDER & EXECUTION DISCIPLINE
// ─────────────────────────────────────────────
createSlide(8, '07 • Team & Execution', '8. Built with Speed, Technical Grit & Capital Discipline', 'Zero bloated overheads, full-stack architectural mastery, and relentless focus on product execution.');

drawCard(55, 140, 570, 510, '#6366F1', 'Founder & Product Architect', 'Ujjawal Tiwari', null, [
  { bold: 'Full-Stack Technical Ownership', text: 'Engineered the complete StackDeal production platform from scratch (Next.js 16, TypeScript, MongoDB, Razorpay API, Groq AI).', space: 70 },
  { bold: 'Proven Shipping Velocity', text: 'Built, tested, and deployed a production marketplace with live payment processing and automated invoicing in record time.', space: 70 },
  { bold: 'Technical SEO Mastery', text: 'Diagnosed and solved complex Google Search Console crawl/SSR soft 404 indexing issues, achieving green-tick verified status.', space: 70 },
  { bold: 'Zero Capital Burn', text: 'Bootstrapped the entire core infrastructure with extreme capital efficiency and zero external debt.', space: 60 }
]);

drawCard(655, 140, 570, 510, '#10B981', 'Core Execution Pillars', 'How We Operate & Scale', null, [
  { bold: 'Hyper-Lean Capital Discipline', text: 'We do not burn capital on vanity metrics or bloated hiring; every single rupee is invested directly into vendor acquisition and buyer growth.', space: 70 },
  { bold: 'High Velocity Iteration', text: 'Daily shipping cadence driven by live user feedback, operational metrics, and rapid feature deployment.', space: 70 },
  { bold: 'Organic Community Distribution', text: 'Leveraging Product Hunt launches, LinkedIn founder storytelling, and direct Indian digital agency WhatsApp hubs for zero-CAC customer acquisition.', space: 70 },
  { bold: 'Long-Term Founder Commitment', text: 'Dedicated to solving the real software discovery problem for India’s 35,000+ digital agencies.', space: 60 }
]);


// ─────────────────────────────────────────────
// SLIDE 9: TRACTION & PROVEN MILESTONES
// ─────────────────────────────────────────────
createSlide(9, '08 • Traction & Progress', '9. Real Milestones Delivered (Not Just an Idea)', 'StackDeal is a live, operating, and verified software marketplace today.');

const tColW = 370;
const tGapX = 30;

drawCard(55, 140, tColW, 250, '#3B82F6', 'Milestone 1 • Live Production', 'Production Platform Active', null, [
  { bold: 'Live at stackdeal.in', text: 'Fully deployed production infrastructure with instant cart checkout and automated Razorpay webhook processing.', space: 60 },
  { bold: 'Zero-Friction Invoicing', text: 'Automatic 18% GST B2B tax invoice PDF generation operational on every purchase.', space: 55 }
]);

drawCard(55 + tColW + tGapX, 140, tColW, 250, '#F59E0B', 'Milestone 2 • Community Debut', 'Product Hunt Launch (Sep 2026)', null, [
  { bold: 'Maker Status Verified', text: 'Officially live on Product Hunt with positive founder engagement, active reviews, and community support.', space: 60 },
  { bold: 'High-Authority Backlink', text: 'Strong global domain authority boost driving initial organic referral traffic.', space: 55 }
]);

drawCard(55 + (tColW + tGapX) * 2, 140, tColW, 250, '#10B981', 'Milestone 3 • Organic Discovery', 'Google Search Console Verified', null, [
  { bold: 'Green-Tick Verified', text: '100% pre-rendered SSR architecture eliminating Soft 404 errors completely.', space: 60 },
  { bold: 'Rich Schema.org', text: 'Automated Product and FAQ structured data embedded for Google search presence.', space: 55 }
]);

// Active Deal Pipeline Card
drawCard(55, 415, 1170, 235, '#6366F1', 'Curated Launch Pipeline', 'Active SaaS Tool Categories on StackDeal:', null, [
  { bold: 'WhatsApp Marketing & Automation', text: 'Chat Chacha — Meta Cloud API verified chatbot & abandoned cart recovery suite (Bestseller).', space: 42 },
  { bold: 'AI Search Engine Optimization (GEO)', text: 'SEO Rocket & Nuwatomic — Keyword tracking and generative search engine visibility for ChatGPT & Perplexity.', space: 42 },
  { bold: 'B2B Lead Scrapers & Data Finders', text: 'EmailExtractor Pro AI — Verified B2B lead scraping and Google Maps data extraction for agency outreach.', space: 42 },
  { bold: 'Agency Operations & Client CRM', text: 'Lightweight client portal and project billing suites built for digital freelancers and boutique agencies.', space: 35 }
]);


// ─────────────────────────────────────────────
// SLIDE 10: THE FUNDING ASK & CAPITAL DEPLOYMENT
// ─────────────────────────────────────────────
createSlide(10, '09 • Funding & Growth Roadmap', '10. Capital Deployment (₹1 Lakh) & 12-Month Targets', 'Clear capital allocation strategy to scale from initial traction to market dominance.');

drawCard(55, 140, 570, 510, '#10B981', 'Capital Allocation', 'Deployment of ₹1,00,000 First Capital', null, [
  { bold: '40% (₹40,000) — Vendor Curation & Onboarding', text: 'Direct outreach and onboarding launch incentives to secure exclusive 5-Year Passes for the first 25 verified high-utility SaaS tools.', space: 70 },
  { bold: '35% (₹35,000) — Agency Community Distribution', text: 'Targeted spotlight campaigns across Indian marketing agency WhatsApp hubs, LinkedIn founder networks, and digital marketing communities.', space: 70 },
  { bold: '25% (₹25,000) — Platform Infrastructure & Scaling', text: 'Dedicated production server capacity, automated GST invoice pipelines, and Groq AI Matchmaker optimization.', space: 70 },
  { bold: 'Zero Fluff', text: '100% of capital deployed into measurable customer and vendor acquisition.', space: 50 }
]);

drawCard(655, 140, 570, 510, '#6366F1', 'Target Milestones', '12-Month Hard Performance Targets', null, [
  { bold: '50+ Verified SaaS Deals', text: 'Live catalogue across WhatsApp, AI SEO, Lead Scrapers, CRM, and Productivity.', space: 65 },
  { bold: '2,000+ Active Paying Agency Accounts', text: 'Paying agency buyers across Delhi-NCR, Bengaluru, Mumbai, Pune, and Tier-2 business hubs.', space: 65 },
  { bold: '₹1.5 Crore+ Deal GMV', text: 'Generating ₹45+ Lakhs in gross marketplace profit with strong positive cash flows.', space: 65 },
  { bold: 'Direct Economic Impact', text: 'Enabling 50+ Indian bootstrapped software creators to earn their first ₹5L to ₹10L in sustainable revenue.', space: 65 },
  { bold: 'Long-Term Vision', text: 'Scaling to ₹85 Crore ($10M) GMV as India’s default software discovery layer.', space: 50 }
]);

doc.end();

writeStream.on('finish', () => {
  console.log('Investor Pitch Deck PDF successfully created at:', outputPath);
  try {
    fs.copyFileSync(outputPath, desktopOutputPath);
    console.log('Copied to Desktop:', desktopOutputPath);
  } catch (e) {
    console.log('Desktop copy note:', e.message);
  }
});
