const fs = require('fs');
const path = require('path');

// Dynamically resolve PDFKit
let PDFDocument;
try {
  PDFDocument = require('pdfkit');
} catch (e) {
  PDFDocument = require('C:\\Users\\ujjaw\\OneDrive\\Documents\\saaterra\\node_modules\\pdfkit\\js\\pdfkit.js');
}

// A4 Document format: 595.28 x 841.89 pt
const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 20, bottom: 10, left: 45, right: 45 },
  autoFirstPage: false
});

let actualPagesCreated = 0;
doc.on('pageAdded', () => {
  actualPagesCreated++;
  console.log(`[PDFKit Event] Page ${actualPagesCreated} added`);
});

// Output paths
const docFolderOutput = path.join('C:\\Users\\ujjaw\\OneDrive\\Documents\\saaterra', 'StackDeal_Master_Company_Profile_and_Guide.pdf');
const desktopSaaterraOutput = path.join('C:\\Users\\ujjaw\\OneDrive\\Desktop\\saaterra', 'StackDeal_Master_Company_Profile_and_Guide.pdf');
const desktopRootOutput = path.join('C:\\Users\\ujjaw\\OneDrive\\Desktop', 'StackDeal_Master_Company_Profile_and_Guide.pdf');

const writeStream = fs.createWriteStream(desktopSaaterraOutput);
doc.pipe(writeStream);

let pageNum = 0;
const totalPages = 8;

// Helper: Standard Document Page Frame
function newDocPage(headerCategory, isCover = false) {
  doc.addPage();
  pageNum++;

  // Top Orange Stripe Accent
  doc.rect(0, 0, 595.28, 5).fill('#FF6B35');

  if (!isCover) {
    // Top Running Header
    doc.fillColor('#FF6B35').fontSize(10.5).font('Helvetica-Bold').text('StackDeal', 45, 18);
    doc.fillColor('#64748B').fontSize(8).font('Helvetica').text('• stackdeal.in', 105, 20);
    doc.fillColor('#64748B').fontSize(8).font('Helvetica-Bold').text((headerCategory || 'Master Ecosystem Guide').toUpperCase(), 230, 20, { width: 320, align: 'right' });

    // Header Divider
    doc.strokeColor('#E2E8F0').lineWidth(0.8).moveTo(45, 34).lineTo(550, 34).stroke();

    // Bottom Running Footer
    doc.strokeColor('#E2E8F0').lineWidth(0.8).moveTo(45, 804).lineTo(550, 804).stroke();
    doc.fillColor('#94A3B8').fontSize(7.5).font('Helvetica').text('StackDeal — Official Company Profile, Operations & Ecosystem Blueprint • Founder: Ujjawal Tiwari', 45, 812);
    doc.fillColor('#64748B').fontSize(8).font('Helvetica-Bold').text(`Page ${pageNum} of ${totalPages}`, 470, 812, { width: 80, align: 'right' });
  } else {
    // Cover Footer
    doc.strokeColor('#E2E8F0').lineWidth(0.8).moveTo(45, 804).lineTo(550, 804).stroke();
    doc.fillColor('#64748B').fontSize(7.5).font('Helvetica-Bold').text('CONFIDENTIAL & OFFICIAL • FOR INVESTORS, PARTNERS, VENDORS & USERS • 2026', 45, 812, { width: 505, align: 'center' });
  }
}

// Helper: Section Title Block
function drawPageHeader(sectionTag, title, subtitle) {
  doc.fillColor('#FF6B35').fontSize(8.5).font('Helvetica-Bold').text(sectionTag.toUpperCase(), 45, 44);
  doc.fillColor('#0F172A').fontSize(17).font('Helvetica-Bold').text(title, 45, 57);
  if (subtitle) {
    doc.fillColor('#64748B').fontSize(8.5).font('Helvetica').text(subtitle, 45, 78, { width: 505 });
  }
  doc.strokeColor('#CBD5E1').lineWidth(0.8).moveTo(45, 95).lineTo(550, 95).stroke();
}

// Helper: Card Box with custom background & border
function drawCard(x, y, w, h, bgColor, borderColor, title, bodyText, titleColor = '#0F172A') {
  doc.roundedRect(x, y, w, h, 6).fill(bgColor || '#F8FAFC');
  doc.roundedRect(x, y, w, h, 6).strokeColor(borderColor || '#E2E8F0').lineWidth(1).stroke();

  if (title) {
    doc.fillColor(titleColor).fontSize(10).font('Helvetica-Bold').text(title, x + 10, y + 8, { width: w - 20 });
  }

  if (bodyText) {
    const textY = title ? y + 23 : y + 8;
    doc.fillColor('#334155').fontSize(8).font('Helvetica').text(bodyText, x + 10, textY, {
      width: w - 20,
      lineGap: 2
    });
  }
}

// Helper: Stat Highlight Box
function drawStatBox(x, y, w, h, statValue, statLabel, subtext, valueColor = '#FF6B35') {
  doc.roundedRect(x, y, w, h, 6).fill('#FFFFFF');
  doc.roundedRect(x, y, w, h, 6).strokeColor('#E2E8F0').lineWidth(1).stroke();

  doc.fillColor(valueColor).fontSize(15).font('Helvetica-Bold').text(statValue, x + 5, y + 6, { width: w - 10, align: 'center' });
  doc.fillColor('#0F172A').fontSize(7.5).font('Helvetica-Bold').text(statLabel.toUpperCase(), x + 5, y + 25, { width: w - 10, align: 'center' });
  if (subtext) {
    doc.fillColor('#64748B').fontSize(7).font('Helvetica').text(subtext, x + 5, y + 36, { width: w - 10, align: 'center' });
  }
}

// =========================================================================
// PAGE 1: COVER PAGE & EXECUTIVE PROFILE
// =========================================================================
newDocPage('Executive Cover', true);

// Header Tag
doc.fillColor('#FF6B35').fontSize(10.5).font('Helvetica-Bold').text('OFFICIAL COMPANY PROFILE & ECOSYSTEM BLUEPRINT', 45, 50);
doc.fillColor('#0F172A').fontSize(25).font('Helvetica-Bold').text('StackDeal: Master Operations Guide', 45, 68);
doc.fillColor('#475569').fontSize(11.5).font('Helvetica').text("India's Premier Curated B2B SaaS 5-Year Deal Marketplace (The Indian Alternative to AppSumo)", 45, 100);

doc.strokeColor('#E2E8F0').lineWidth(1).moveTo(45, 124).lineTo(550, 124).stroke();

// Founder Profile Badge Card
doc.roundedRect(45, 136, 505, 96, 8).fill('#0F172A');
doc.roundedRect(45, 136, 505, 96, 8).strokeColor('#334155').lineWidth(1).stroke();

doc.fillColor('#FF6B35').fontSize(9.5).font('Helvetica-Bold').text('FOUNDER & ARCHITECT PROFILE', 60, 148);
doc.fillColor('#FFFFFF').fontSize(16).font('Helvetica-Bold').text('Ujjawal Tiwari — Solo Founder & Full-Stack Developer', 60, 163);
doc.fillColor('#94A3B8').fontSize(8.5).font('Helvetica').text(
  'A 19-year-old software engineer and visionary builder from India. Engineered and launched StackDeal ground-up to solve the crippling dollar subscription fatigue faced by 1.5M+ Indian digital marketing agencies, freelancers, and small businesses. Single-handedly architected the Next.js 16 platform, Groq AI Llama 3.3 matchmaker, and localized 18% GST B2B billing engine.',
  60, 185, { width: 475, lineGap: 2.5 }
);

// 4 Key Stat Metrics
drawStatBox(45, 246, 120, 56, '5-Year Passes', 'Disruptive Pricing', 'Zero monthly fees', '#FF6B35');
drawStatBox(173, 246, 120, 56, '70% Rev-Share', 'Vendor Centric', 'Upfront liquidity', '#10B981');
drawStatBox(301, 246, 120, 56, '92%+ Savings', 'Buyer Benefit', 'Save lakhs in capital', '#6366F1');
drawStatBox(430, 246, 120, 56, '18% GST ITC', 'B2B Tax Invoicing', 'Full expense claim', '#0284C7');

// Executive Overview Card
drawCard(
  45, 316, 505, 105, '#F8FAFC', '#CBD5E1',
  'Executive Summary & Market Mission',
  '• Core Offering: StackDeal (https://www.stackdeal.in) curates high-utility B2B SaaS software—WhatsApp Cloud API marketing bots, AI SEO engines, lead scrapers, and CRM suites—and makes them accessible via 5-Year Passes.\n' +
  '• The Friction Eliminated: Eliminates recurring US Dollar credit card charges ($49–$199/month), 3.5% foreign exchange markups, and frequent RBI e-mandate card failure rates in India.\n' +
  '• Dual-Sided Win: Indian agencies save 90-95% on essential software while SaaS founders unlock instant upfront liquidity and zero-CAC distribution to 10,000+ agency buyers.'
);

// What This Document Covers Card
drawCard(
  45, 435, 505, 130, '#EFF6FF', '#BFDBFE',
  'What This Master Blueprint Explains (Table of Contents)',
  '1. Section 1: What is StackDeal? — Understanding the 5-Year Pass Model vs Subscription Fatigue\n' +
  '2. Section 2: How StackDeal Works — End-to-End Workflow for Buyers and Software Vendors\n' +
  '3. Section 3: How Users & Buyers Profit — Financial Math, 92%+ Savings & 18% GST ITC Tax Shield\n' +
  '4. Section 4: How Software Vendors Profit — 70% Revenue Split, Non-Dilutive Capital & Zero-CAC Reach\n' +
  '5. Section 5: Founder Story & Vision — Ujjawal Tiwari\'s Inspiration, Technical Execution & Philosophy\n' +
  '6. Section 6: Technological Edge & DRM — Next.js 16, Groq AI Recommendation Engine & Security\n' +
  '7. Section 7: Market Size, Competitor Comparison (vs AppSumo) & Strategic Growth Roadmap',
  '#1E40AF'
);

// Key Guarantees & Operational Pillars
drawCard(
  45, 580, 245, 140, '#F0FDF4', '#BBF7D0',
  'For Software Buyers',
  '• 60-Day Unconditional Money-Back Guarantee\n' +
  '• Instant UPI Checkout (PhonePe, GPay, Paytm)\n' +
  '• Official 18% GST B2B Invoices with SAC codes\n' +
  '• Centralized License Key Management Hub\n' +
  '• Verified Software Quality & Direct Updates\n' +
  '• Direct Developer Access & Roadmap Input',
  '#166534'
);

drawCard(
  305, 580, 245, 140, '#FEF2F2', '#FECACA',
  'For SaaS Vendors & Creators',
  '• 70% Vendor Payout (Industry\'s highest)\n' +
  '• Immediate upfront liquidity without equity loss\n' +
  '• Zero upfront listing or onboarding fees\n' +
  '• StackDeal handles customer billing & GST\n' +
  '• Direct access to high-intent agency buyers\n' +
  '• Full ownership of buyer relationships',
  '#991B1B'
);


// =========================================================================
// PAGE 2: SECTION 1 — WHAT IS STACKDEAL & THE CORE PROBLEM
// =========================================================================
newDocPage('Section 1 • Problem & Vision');
drawPageHeader('SECTION 1 OF 7', 'What is StackDeal? The Problem & Paradigm Shift', 'Understanding the crippling Indian SaaS subscription crisis and StackDeal\'s 5-Year Pass solution.');

// The Core Problem
drawCard(
  45, 110, 505, 135, '#FEF2F2', '#FECACA',
  'The Reality: Why the Current SaaS Model is Broken for India',
  'Over 95% of world-class B2B software is built in the West and charges recurring monthly fees in US Dollars ($49 to $199/month). For Indian digital agencies, freelance marketers, and bootstrapped startups, this creates severe operational hurdles:\n\n' +
  '1. Currency & Forex Bleed: A $99/mo tool costs over ₹8,200/mo (nearly ₹1,00,000 every single year) plus a 3.5% foreign exchange card markup.\n' +
  '2. RBI Recurring Mandate Friction: The Reserve Bank of India\'s strict e-mandate rules cause recurring card debit failure rates exceeding 70-80%, resulting in abrupt tool lockouts and client project halts.\n' +
  '3. Lack of GST Input Tax Credit: Foreign credit card billing cannot issue valid Indian 18% GST invoices, meaning Indian companies lose thousands in unclaimed business tax deductions.\n' +
  '4. Unforgiving Subscription Fatigue: Paying 5 to 8 recurring monthly software subscriptions causes chronic cash-flow anxiety for growing marketing agencies.',
  '#991B1B'
);

// The Solution: 5-Year SaaS Passes
drawCard(
  45, 255, 505, 135, '#F0FDF4', '#BBF7D0',
  'The StackDeal Solution: Curated 5-Year SaaS Passes',
  'StackDeal introduces a revolutionary marketplace model tailored specifically to the Indian economic reality. Instead of endless monthly recurring payments, StackDeal partners with vetted SaaS developers to offer exclusive 5-Year Access Passes for a single, transparent INR fee (typically ₹1,499 to ₹9,999).\n\n' +
  '• Predictable Capital Expenditure: Agencies pay once and secure guaranteed access for 5 full years. No hidden renewals, no monthly billing shock, and zero forex fee bleed.\n' +
  '• 100% Indian Payment Rails: Instant checkout via UPI (Google Pay, PhonePe, Paytm), RuPay, NetBanking, and domestic corporate credit cards.\n' +
  '• Automated 18% GST B2B Invoices: Instant downloadable tax invoice featuring the agency\'s GSTIN, allowing full Input Tax Credit (ITC) business expense write-offs.\n' +
  '• High-Standard Quality Curation: Only stable, actively maintained SaaS tools with proven customer support and enterprise security are accepted onto StackDeal.',
  '#166534'
);

// The AppSumo Void in India
drawCard(
  45, 400, 505, 130, '#F8FAFC', '#CBD5E1',
  'Why Western Platforms (AppSumo) Fail the Indian Market',
  'While AppSumo popularised lifetime software deals globally, it remains fundamentally inaccessible and hostile to the Indian ecosystem:\n\n' +
  '• US Dollar Bias: AppSumo prices exclusively in USD ($59 - $299), which when converted to INR creates psychological and financial friction for Indian buyers.\n' +
  '• Hostile Vendor Economics: AppSumo takes up to 70% commission from software creators, leaving developers with a meager 30% that barely covers server costs.\n' +
  '• No Indian Tax Compliance: Zero support for Indian B2B GST invoices, causing domestic businesses to miss out on legal tax write-offs.\n' +
  '• No Local Payment Support: No UPI, no domestic NetBanking. Indian buyers must maintain international credit cards with enabled forex limits.\n' +
  '• StackDeal addresses this exact market void by building India\'s dedicated SaaS deal infrastructure.',
  '#0F172A'
);

// Strategic Pillars Summary
drawCard(
  45, 540, 245, 130, '#EFF6FF', '#BFDBFE',
  'StackDeal Buyer Value Pillars',
  '• 90% - 95% One-Time Cost Reduction\n' +
  '• 5-Year Uninterrupted Software Security\n' +
  '• 1-Click UPI Payment Experience\n' +
  '• 18% GST Input Tax Credit Eligibility\n' +
  '• 60-Day Money-Back Risk-Free Trial\n' +
  '• Direct Developer Community Support\n' +
  '• Groq AI Matchmaker for Stack Building',
  '#1E40AF'
);

drawCard(
  305, 540, 245, 130, '#FAF5FF', '#E9D5FF',
  'StackDeal Vendor Value Pillars',
  '• Generous 70% Revenue Share to Creators\n' +
  '• Immediate Upfront Cash Injection (₹3L-₹10L)\n' +
  '• Zero Customer Acquisition Cost (CAC)\n' +
  '• 10,000+ Indian Agency User Distribution\n' +
  '• Automated Indian GST & Tax Compliance\n' +
  '• Organic Product Reviews & Testimonials\n' +
  '• Expansion & Enterprise Upsell Pipeline',
  '#6B21A8'
);


// =========================================================================
// PAGE 3: SECTION 2 — HOW STACKDEAL WORKS (STEP-BY-STEP WORKFLOW)
// =========================================================================
newDocPage('Section 2 • How It Works');
drawPageHeader('SECTION 2 OF 7', 'How StackDeal Works: Dual-Sided Ecosystem Architecture', 'A seamless, friction-free journey engineered for software buyers and software vendors.');

// Buyer Workflow
doc.fillColor('#0F172A').fontSize(10.5).font('Helvetica-Bold').text('THE BUYER JOURNEY (5 STEP IMPLEMENTATION)', 45, 108);

drawCard(
  45, 122, 505, 115, '#F8FAFC', '#CBD5E1',
  'Step-by-Step Experience for Digital Agencies & Buyers',
  '1. Discover & Match: Browse verified tools across 10+ categories (WhatsApp automation, AI SEO, cold email, CRM) or use StackDeal\'s Groq AI Matchmaker to generate a personalized software stack tailored to your agency\'s niche.\n' +
  '2. Transparent One-Time Checkout: Review transparent 5-Year pricing with zero hidden renewal fees. Checkout in 10 seconds via PhonePe, Google Pay, Paytm UPI, or corporate card.\n' +
  '3. Instant Automated License Delivery: The moment payment is verified, the unique software license key and vendor redemption instructions appear inside your StackDeal dashboard and are emailed immediately.\n' +
  '4. Automated GST Invoice Download: Download your official 18% GST B2B tax invoice directly from the dashboard to claim full business expense input tax credit.\n' +
  '5. 60-Day Money-Back Shield: Enjoy full access for 60 days. If the tool fails to satisfy your operational standards, request an instant 100% refund with zero questions asked.'
);

// Vendor Workflow
doc.fillColor('#0F172A').fontSize(10.5).font('Helvetica-Bold').text('THE VENDOR / CREATOR JOURNEY (5 HIGH-LEVERAGE STEPS)', 45, 248);

drawCard(
  45, 262, 505, 120, '#F8FAFC', '#CBD5E1',
  'Step-by-Step Experience for SaaS Founders & Indie Developers',
  '1. Deal Submission: SaaS founders submit their product via the StackDeal Vendor Portal. StackDeal\'s product team reviews code quality, server architecture, uptime history, and roadmap commitment.\n' +
  '2. Deal Packaging & Creative Launch: StackDeal\'s copywriting and marketing team crafts high-converting deal copy, feature comparisons, video walkthroughs, and promotional creative banners.\n' +
  '3. Targeted Community Distribution: The deal is pushed live on stackdeal.in and blasted to 10,000+ Indian agency founders via WhatsApp groups, LinkedIn bulletins, and targeted newsletters.\n' +
  '4. Automated Key Vault Fulfillment: StackDeal\'s automated licensing engine handles DRM key redemption, buyer onboarding, and level-1 customer billing inquiries.\n' +
  '5. 70% Revenue Share Payout: The vendor receives 70% of all gross deal sales directly into their registered bank account with complete transparency, accompanied by an analytics dashboard.'
);

// Workflow Flowchart Visual Table
doc.fillColor('#0F172A').fontSize(10.5).font('Helvetica-Bold').text('STACKDEAL OPERATIONAL ECOSYSTEM AT A GLANCE', 45, 395);

drawCard(
  45, 410, 160, 130, '#EFF6FF', '#BFDBFE',
  '1. Curation & Trust',
  '• Code quality audit\n' +
  '• Uptime & security check\n' +
  '• Clear 5-Year roadmap\n' +
  '• Direct founder dialogue\n' +
  '• Only top 10% accepted',
  '#1E40AF'
);

drawCard(
  217, 410, 160, 130, '#F0FDF4', '#BBF7D0',
  '2. Transaction & Invoicing',
  '• 100% UPI & RuPay support\n' +
  '• Instant 18% GST invoice\n' +
  '• Automated webhook DRM\n' +
  '• Zero forex exchange fee\n' +
  '• 60-day refund escrow',
  '#166534'
);

drawCard(
  390, 410, 160, 130, '#FAF5FF', '#E9D5FF',
  '3. Long-Term Value',
  '• 5-Year guaranteed access\n' +
  '• Centralized license keys\n' +
  '• 70% payout to creator\n' +
  '• Agency client reselling\n' +
  '• Ongoing tool updates',
  '#6B21A8'
);

// Operational Guarantees Callout
drawCard(
  45, 550, 505, 125, '#FFFBEB', '#FDE68A',
  'Our Zero-Compromise Security & Trust Philosophy',
  '• Vendor Quality Guarantee: We do not accept abandoned scripts, reskinned open-source wrappers, or unmaintained tools. Every tool on StackDeal must have an active founder committed to long-term feature releases.\n' +
  '• Buyer Protection Escrow: Vendor payout reserves are held to protect buyers during the 60-day trial window. If a vendor discontinues support, buyers receive full protection.\n' +
  '• Transparent License Keys: All licenses grant authentic access directly on the vendor\'s official platform—not a reverse-proxy or shared account.\n' +
  '• High Availability Infrastructure: StackDeal is deployed on edge CDNs with sub-second response times, ensuring zero checkout downtime even during high-traffic launch spikes.',
  '#B45309'
);


// =========================================================================
// PAGE 4: SECTION 3 — HOW USERS & BUYERS PROFIT (FINANCIAL MATH)
// =========================================================================
newDocPage('Section 3 • Buyer Profit & ROI');
drawPageHeader('SECTION 3 OF 7', 'How Users & Buyers Profit: The Financial Economics', 'Enabling Indian digital agencies and freelancers to save over 92% in operational capital.');

// Core Buyer Value Narrative
drawCard(
  45, 108, 505, 80, '#F8FAFC', '#CBD5E1',
  'Transforming SaaS Costs from a Monthly Liability to an Asset',
  'For an Indian digital agency managing 10 to 20 client retainers, software is the single largest operating expense after payroll. Standard monthly SaaS pricing forces agencies to bleed ₹50,000 to ₹1,50,000 every month just to stay operational. StackDeal converts recurring expenses into a one-time, low-cost capital investment that unlocks 5 years of steady agency profit margins.'
);

// Comparative ROI Table Block
doc.fillColor('#0F172A').fontSize(10).font('Helvetica-Bold').text('REAL-WORLD 5-YEAR COST COMPARISON (REGULAR SAAS VS STACKDEAL)', 45, 200);

// Table Header
doc.rect(45, 214, 505, 20).fill('#0F172A');
doc.fillColor('#FFFFFF').fontSize(8).font('Helvetica-Bold').text('SOFTWARE CATEGORY & TOOL TYPE', 55, 220);
doc.fillColor('#FFFFFF').fontSize(8).font('Helvetica-Bold').text('MONTHLY SAAS (5 YRS)', 250, 220);
doc.fillColor('#FFFFFF').fontSize(8).font('Helvetica-Bold').text('STACKDEAL 5-YR PASS', 370, 220);
doc.fillColor('#10B981').fontSize(8).font('Helvetica-Bold').text('NET CAPITAL SAVINGS', 460, 220);

// Table Row 1
doc.rect(45, 234, 505, 20).fill('#F8FAFC');
doc.strokeColor('#E2E8F0').lineWidth(0.8).rect(45, 234, 505, 20).stroke();
doc.fillColor('#0F172A').fontSize(7.5).font('Helvetica-Bold').text('WhatsApp Cloud API Marketing Suite', 55, 240);
doc.fillColor('#64748B').fontSize(7.5).font('Helvetica').text('₹2,400/mo = ₹1,44,000', 250, 240);
doc.fillColor('#0F172A').fontSize(7.5).font('Helvetica-Bold').text('₹4,999 One-Time', 370, 240);
doc.fillColor('#10B981').fontSize(7.5).font('Helvetica-Bold').text('₹1,39,001 (96.5%)', 460, 240);

// Table Row 2
doc.rect(45, 254, 505, 20).fill('#FFFFFF');
doc.strokeColor('#E2E8F0').lineWidth(0.8).rect(45, 254, 505, 20).stroke();
doc.fillColor('#0F172A').fontSize(7.5).font('Helvetica-Bold').text('AI SEO & GEO Search Visibility Engine', 55, 260);
doc.fillColor('#64748B').fontSize(7.5).font('Helvetica').text('₹3,500/mo = ₹2,10,000', 250, 260);
doc.fillColor('#0F172A').fontSize(7.5).font('Helvetica-Bold').text('₹6,499 One-Time', 370, 260);
doc.fillColor('#10B981').fontSize(7.5).font('Helvetica-Bold').text('₹2,03,501 (96.9%)', 460, 260);

// Table Row 3
doc.rect(45, 274, 505, 20).fill('#F8FAFC');
doc.strokeColor('#E2E8F0').lineWidth(0.8).rect(45, 274, 505, 20).stroke();
doc.fillColor('#0F172A').fontSize(7.5).font('Helvetica-Bold').text('B2B Cold Email & Lead Scraper Engine', 55, 280);
doc.fillColor('#64748B').fontSize(7.5).font('Helvetica').text('₹3,000/mo = ₹1,80,000', 250, 280);
doc.fillColor('#0F172A').fontSize(7.5).font('Helvetica-Bold').text('₹5,999 One-Time', 370, 280);
doc.fillColor('#10B981').fontSize(7.5).font('Helvetica-Bold').text('₹1,74,001 (96.7%)', 460, 280);

// Table Row 4
doc.rect(45, 294, 505, 20).fill('#FFFFFF');
doc.strokeColor('#E2E8F0').lineWidth(0.8).rect(45, 294, 505, 20).stroke();
doc.fillColor('#0F172A').fontSize(7.5).font('Helvetica-Bold').text('Agency CRM & Client Invoicing System', 55, 300);
doc.fillColor('#64748B').fontSize(7.5).font('Helvetica').text('₹2,000/mo = ₹1,20,000', 250, 300);
doc.fillColor('#0F172A').fontSize(7.5).font('Helvetica-Bold').text('₹3,999 One-Time', 370, 300);
doc.fillColor('#10B981').fontSize(7.5).font('Helvetica-Bold').text('₹1,16,001 (96.7%)', 460, 300);

// Total Row
doc.rect(45, 314, 505, 22).fill('#0F172A');
doc.fillColor('#FFFFFF').fontSize(8).font('Helvetica-Bold').text('FULL STACK TOTAL (4 ESSENTIAL TOOLS)', 55, 320);
doc.fillColor('#FDA4AF').fontSize(8).font('Helvetica-Bold').text('₹6,54,000 OVER 5 YRS', 250, 320);
doc.fillColor('#FEF08A').fontSize(8).font('Helvetica-Bold').text('₹21,496 ONE-TIME', 370, 320);
doc.fillColor('#34D399').fontSize(8).font('Helvetica-Bold').text('SAVINGS: ₹6,32,504 (96.7%)', 460, 320);

// 4 In-Depth Profit Levers for Buyers
drawCard(
  45, 350, 245, 105, '#F0FDF4', '#BBF7D0',
  '1. Massive Capital Retention',
  'Agencies keep ₹6,30,000+ in retained operational capital. This capital can be redeployed into hiring top creators, scaling paid ad campaigns for clients, or reinvesting into business growth without debt.',
  '#166534'
);

drawCard(
  305, 350, 245, 105, '#EFF6FF', '#BFDBFE',
  '2. 18% GST Input Tax Credit (ITC)',
  'Because StackDeal provides verified B2B GST tax invoices, registered businesses can claim the entire 18% GST paid as input tax credit against their sales tax, lowering the effective net software cost even further.',
  '#1E40AF'
);

drawCard(
  45, 465, 245, 105, '#FAF5FF', '#E9D5FF',
  '3. Client Reselling & Packaging',
  'Agencies can bundle tools purchased on StackDeal (e.g. WhatsApp bots or lead generation engines) into high-margin client retainer packages. Software becomes a profit-generating profit center.',
  '#6B21A8'
);

drawCard(
  305, 465, 245, 105, '#FFFBEB', '#FDE68A',
  '4. Zero Risk with 60-Day Shield',
  'Unlike traditional foreign SaaS that rejects refunds once a month begins, StackDeal offers a rock-solid 60-day money-back guarantee. If a tool doesn\'t fit the agency\'s workflow, an instant refund is processed.',
  '#B45309'
);

// License Hub Feature Box
drawCard(
  45, 580, 505, 95, '#F8FAFC', '#CBD5E1',
  'Centralized Agency License Vault (One Single Dashboard)',
  'Instead of juggling 15 different login accounts, varying renewal dates, and lost credit card receipts, StackDeal provides a unified License Vault. Agency owners can view all active 5-Year Passes, copy license keys with one click, access dedicated redemption guides, and download historical GST tax receipts instantly.'
);


// =========================================================================
// PAGE 5: SECTION 4 — HOW VENDORS & BUILDERS PROFIT
// =========================================================================
newDocPage('Section 4 • Vendor Value Engine');
drawPageHeader('SECTION 4 OF 7', 'How SaaS Vendors & Builders Profit: The Creator Engine', 'Why bootstrapped developers and SaaS startups choose StackDeal over AppSumo.');

// Why Founders Need StackDeal
drawCard(
  45, 108, 505, 80, '#F8FAFC', '#CBD5E1',
  'The Creator Dilemma: Great Products, Difficult Distribution',
  'Building a world-class SaaS application has never been faster thanks to modern AI and frameworks. However, distributing and monetizing software in India is brutally expensive. Google and Meta ad costs consume 100%+ of customer lifetime value (LTV). Bootstrapped indie founders often run out of cash before achieving positive unit economics. StackDeal transforms this reality by providing guaranteed distribution and immediate non-dilutive capital.'
);

// Vendor Comparison Card: AppSumo vs StackDeal
doc.fillColor('#0F172A').fontSize(10).font('Helvetica-Bold').text('COMMISSION & ECONOMICS: APPSUMO VS STACKDEAL', 45, 200);

drawCard(
  45, 214, 245, 125, '#FEF2F2', '#FECACA',
  'AppSumo (Traditional Platform)',
  '• Commission: Takes up to 70% of gross revenue\n' +
  '• Creator Share: Only 30% left for the developer\n' +
  '• Currency: Exclusively USD (High forex friction)\n' +
  '• Geographic Focus: US/Europe (Ignores India)\n' +
  '• India Support: Zero UPI, zero GST compliance\n' +
  '• Support Burden: High ticket volume, minimal creator protection',
  '#991B1B'
);

drawCard(
  305, 214, 245, 125, '#F0FDF4', '#BBF7D0',
  'StackDeal (Vendor-First Marketplace)',
  '• Commission: StackDeal takes ONLY 30%\n' +
  '• Creator Share: Generous 70% paid to creator\n' +
  '• Currency: INR with instant domestic UPI checkout\n' +
  '• Geographic Focus: Deeply focused on 1.5M Indian agencies\n' +
  '• India Support: Full automated 18% GST B2B billing\n' +
  '• Direct Support: Dedicated Slack/WhatsApp founder channel',
  '#166534'
);

// 4 Tangible Profit Levers for Vendors
drawCard(
  45, 348, 245, 105, '#F0FDF4', '#BBF7D0',
  '1. Non-Dilutive Upfront Capital',
  'A single StackDeal campaign selling 100 units of a 5-Year Pass at ₹4,999 yields ₹3,50,000 in immediate cash. Selling 300 units yields ₹10,50,000. This capital allows solo founders to fund server bills, hire talent, and scale without giving away equity.',
  '#166534'
);

drawCard(
  305, 348, 245, 105, '#EFF6FF', '#BFDBFE',
  '2. Zero-CAC Indian Market Entry',
  'Founders bypass millions of rupees in paid ad spend. StackDeal directly spotlights the tool to thousands of pre-qualified, tech-savvy Indian digital agencies, freelancers, and businesses eager for productivity solutions.',
  '#1E40AF'
);

drawCard(
  45, 462, 245, 105, '#FAF5FF', '#E9D5FF',
  '3. Massive Viral Word-of-Mouth',
  'Indian agency owners are passionate community networkers. When a tool delivers high ROI, they recommend it across agency WhatsApp communities, LinkedIn posts, and client networks, creating an organic compounding growth loop.',
  '#6B21A8'
);

drawCard(
  305, 462, 245, 105, '#FFFBEB', '#FDE68A',
  '4. Upsell & Enterprise Expansion',
  '5-Year Pass buyers are not stagnant users—they represent qualified top-of-funnel accounts. Once integrated into their workflows, agencies routinely purchase white-label licenses, extra team seats, API usage top-ups, and custom integrations.',
  '#B45309'
);

// Vendor Onboarding Callout
drawCard(
  45, 576, 505, 95, '#0F172A', '#334155',
  'Zero Financial Risk for SaaS Founders',
  '• Zero Listing Fees: Listing your SaaS on StackDeal is 100% free with zero upfront or hidden charges.\n' +
  '• Complete Marketing Support: We write high-converting launch copy, produce UI promotional graphics, and run targeted community outreach.\n' +
  '• Automated DRM & Tax Compliance: StackDeal manages the entire billing, UPI reconciliation, and GST invoice dispatch pipeline, freeing creators to focus 100% on product development.',
  '#FF6B35'
);


// =========================================================================
// PAGE 6: SECTION 5 — FOUNDER STORY & PHILOSOPHY (UJJAWAL TIWARI)
// =========================================================================
newDocPage('Section 5 • Founder Story');
drawPageHeader('SECTION 5 OF 7', 'Founder Story & Vision: Built by a 19-Year-Old Solo Builder', 'The inspiration, engineering velocity, and long-term mission behind StackDeal.');

// Founder Profile Header Card
drawCard(
  45, 108, 505, 95, '#0F172A', '#334155',
  'The Builder Behind StackDeal: Ujjawal Tiwari',
  'Ujjawal Tiwari is a 19-year-old solo full-stack developer, software engineer, and relentless product builder from India. Without venture capital or a large team, Ujjawal single-handedly designed, coded, and deployed StackDeal from scratch into a full-scale production B2B marketplace.\n\n' +
  '• Engineering Velocity: Full-stack architect specializing in Next.js 16, React 19, TypeScript, MongoDB Atlas, Node.js, and bleeding-edge Groq AI Llama 3.3 LLM integration.\n' +
  '• Vision: Democratizing enterprise-grade software tools for 10 Lakh+ Indian small businesses while creating a sustainable, high-revenue launchpad for bootstrapped developers.',
  '#FF6B35'
);

// The Core Inspiration
drawCard(
  45, 212, 505, 100, '#F8FAFC', '#CBD5E1',
  'The Inspiration: Breaking the "Dollar Privilege" Barrier',
  'While building software tools and collaborating with digital agency founders in India, Ujjawal witnessed a persistent barrier: Indian developers and agencies had the talent, drive, and client demand, but were systematically held back by the global software pricing structure.\n\n' +
  '"Why should a young Indian agency paying in Rupees be forced to pay $100 a month in US Dollars just to send automated WhatsApp messages or audit SEO? Why should Indian cards fail because of e-mandate rules, leaving businesses stranded? I realized India didn\'t need another blog or directory—India needed its own dedicated, curated SaaS deal infrastructure."'
);

// The 4 Guiding Core Principles
doc.fillColor('#0F172A').fontSize(10).font('Helvetica-Bold').text('UJJAWAL\'S 4 GUIDING OPERATIONAL PRINCIPLES', 45, 322);

drawCard(
  45, 336, 245, 80, '#EFF6FF', '#BFDBFE',
  '1. Radical Creator Transparency',
  'No deceptive contracts. A clean 70% payout directly to the developer, visible real-time transaction logs, and zero hidden platform cuts.',
  '#1E40AF'
);

drawCard(
  305, 336, 245, 80, '#F0FDF4', '#BBF7D0',
  '2. Relentless Curation Standards',
  'Quality over quantity. We reject 90% of submitted tools to ensure only robust, security-audited, actively supported software enters the store.',
  '#166534'
);

drawCard(
  45, 424, 245, 80, '#FFFBEB', '#FDE68A',
  '3. Unconditional Customer Trust',
  'Trust is the currency of e-commerce. A flawless 60-day refund guarantee and direct developer support ensure buyers never lose a single rupee.',
  '#B45309'
);

drawCard(
  305, 424, 245, 80, '#FAF5FF', '#E9D5FF',
  '4. Localized Indian Execution',
  'Engineered for Indian rails: instant UPI QR payments, GST B2B tax credits, and tools specifically tuned for the Indian marketing landscape.',
  '#6B21A8'
);

// Technical Accomplishments Box
drawCard(
  45, 514, 505, 140, '#F8FAFC', '#CBD5E1',
  'Technical Milestones Achieved Under Solo Execution',
  '• Built in Next.js 16 (App Router): Engineered with React 19 Server Components, achieving sub-second page loads and 100/100 Core Web Vitals on mobile.\n' +
  '• Integrated Groq AI Matchmaker: Integrated Groq\'s high-speed Llama 3.3 70B inference engine to provide instantaneous, real-time AI SaaS recommendations.\n' +
  '• Automated GST Tax Engine: Developed dynamic serverless PDF generation creating compliant B2B tax invoices with SAC codes and GSTIN validation.\n' +
  '• Google Green-Tick Verified: Successfully indexed on Google Search Console with custom automated sitemaps, robots.txt, and AI crawler protocols.\n' +
  '• Enterprise DRM & Key Management: Built secure license key generation and webhook delivery endpoints to prevent piracy and automated account sharing.'
);


// =========================================================================
// PAGE 7: SECTION 6 — TECHNOLOGY ARCHITECTURE & SECURITY
// =========================================================================
newDocPage('Section 6 • Technology & DRM');
drawPageHeader('SECTION 6 OF 7', 'Technological Edge: Modern Architecture & Security', 'A high-performance, enterprise-grade Next.js 16 stack built for scale.');

// Tech Stack Breakdown
doc.fillColor('#0F172A').fontSize(10).font('Helvetica-Bold').text('PRODUCTION TECHNOLOGY STACK', 45, 108);

drawCard(
  45, 122, 245, 90, '#EFF6FF', '#BFDBFE',
  'Next.js 16 & React 19 Core',
  '• Modern App Router architecture\n' +
  '• React Server Components (RSC) for near-instant rendering\n' +
  '• Edge runtime caching with Vercel Global CDN\n' +
  '• Optimized bundle size with zero client hydration lag',
  '#1E40AF'
);

drawCard(
  305, 122, 245, 90, '#F0FDF4', '#BBF7D0',
  'Database & High Availability',
  '• MongoDB Atlas enterprise cluster with connection pooling\n' +
  '• Encrypted credential storage with BCrypt hashing\n' +
  '• Sub-50ms query latency across all product collections\n' +
  '• Automated daily backups with point-in-time recovery',
  '#166534'
);

drawCard(
  45, 220, 245, 90, '#FAF5FF', '#E9D5FF',
  'Groq AI Llama 3.3 Engine',
  '• Powered by Groq LPU inference delivering 300+ tokens/sec\n' +
  '• Analyzes agency business models, niche, and client budgets\n' +
  '• Delivers tailored 3-tool software stack recommendations\n' +
  '• Zero lag interactive conversational matchmaking modal',
  '#6B21A8'
);

drawCard(
  305, 220, 245, 90, '#FFFBEB', '#FDE68A',
  'Payment Rails & Invoicing',
  '• Razorpay verified payment integration\n' +
  '• Instant UPI (GPay, PhonePe, Paytm, BHIM)\n' +
  '• Automated 18% GST B2B PDF tax invoice generator\n' +
  '• Webhook event idempotency preventing double charges',
  '#B45309'
);

// License DRM & Anti-Piracy Architecture
drawCard(
  45, 320, 505, 105, '#0F172A', '#334155',
  'Proprietary License DRM & Anti-Fraud Security Engine',
  '• Tamper-Proof Cryptographic Keys: Licenses are generated using cryptographic pseudo-random strings tied specifically to the buyer\'s authenticated account.\n' +
  '• Automated Vendor Webhooks: When a deal is purchased, a signed webhook payload triggers an API handshake with the vendor\'s software to provision the account instantly.\n' +
  '• Rate Limiting & Anti-Scraping: Cloudflare edge rules and Next.js middleware protect platform listings against malicious scrapers and brute-force bot attacks.\n' +
  '• Refund Auto-Revocation: When a refund is initiated during the 60-day trial, an automated revocation signal disables the license key in the vendor\'s system.',
  '#FF6B35'
);

// Search & Discovery Speed
drawCard(
  45, 435, 505, 105, '#F8FAFC', '#CBD5E1',
  'Live Keyword Search & Instant Autocomplete Engine',
  '• Sub-Millisecond Client Indexing: Users can instantly search across 50+ keywords (e.g. "WhatsApp", "SEO", "Lead Scraper", "CRM", "Email") with zero latency.\n' +
  '• Dynamic Tag Filtering: Instant client-side filtering by categories, pricing brackets, and top trending deals without page refreshes.\n' +
  '• Mobile-First Responsive Design: Fully optimized touch navigation, bottom sheets, and responsive cards ensuring smooth mobile browsing on low-bandwidth Indian connections.\n' +
  '• SEO Crawlers & LLM Indexing: Fully compliant sitemap.xml, robots.txt, and llms.txt allowing modern AI engines (ChatGPT, Claude, Perplexity) to index StackDeal deals automatically.'
);

// Security & Compliance Badges
drawCard(
  45, 550, 245, 105, '#F0FDF4', '#BBF7D0',
  'Compliance & Trust Badges',
  '• 100% 18% GST Compliant\n' +
  '• Official SAC Code: 998313 (IT Services)\n' +
  '• SSL/TLS 256-bit Bank Grade Encryption\n' +
  '• RBI Compliant Domestic Payment Flows\n' +
  '• 60-Day Unconditional Money-Back Guarantee',
  '#166534'
);

drawCard(
  305, 550, 245, 105, '#EFF6FF', '#BFDBFE',
  'Operational Reliability Metrics',
  '• 99.98% Historical Platform Uptime\n' +
  '• Sub-800ms Average Page Response Time\n' +
  '• Zero Recorded Payment Discrepancies\n' +
  '• Real-Time Order Webhook Synchronization\n' +
  '• 24/7 Automated System Monitoring',
  '#1E40AF'
);


// =========================================================================
// PAGE 8: SECTION 7 — MARKET OPPORTUNITY, COMPETITOR COMPARISON & ROADMAP
// =========================================================================
newDocPage('Section 7 • Market & Roadmap');
drawPageHeader('SECTION 7 OF 7', 'Market Opportunity, Competitive Moats & Future Roadmap', 'Positioning StackDeal to capture a multi-crore market across India & South Asia.');

// Market Sizing TAM SAM SOM
drawCard(
  45, 108, 505, 90, '#F8FAFC', '#CBD5E1',
  'Market Size: India\'s Exploding Digital Agency & SaaS Landscape',
  '• Total Addressable Market (TAM): 63 Million Indian MSMEs adopting digital tools; Indian B2B SaaS market projected to exceed $50 Billion (₹4,15,000 Crore) by 2030.\n' +
  '• Serviceable Addressable Market (SAM): 1.5 Million+ active digital marketing agencies, software development firms, freelance marketing consultants, and content studios across India.\n' +
  '• Serviceable Obtainable Market (SOM): 50,000 Early-Adopter Agencies purchasing an average of 3 SaaS passes annually = ₹45 Crore ($5.4M) Annual GMV opportunity.'
);

// Comprehensive Competitive Moats Matrix
doc.fillColor('#0F172A').fontSize(10).font('Helvetica-Bold').text('COMPETITIVE COMPARISON: WHY STACKDEAL WINS IN INDIA', 45, 208);

// Table Header
doc.rect(45, 222, 505, 18).fill('#0F172A');
doc.fillColor('#FFFFFF').fontSize(7.5).font('Helvetica-Bold').text('FEATURE / CAPABILITY', 55, 227);
doc.fillColor('#FFFFFF').fontSize(7.5).font('Helvetica-Bold').text('APPSUMO (GLOBAL)', 180, 227);
doc.fillColor('#FFFFFF').fontSize(7.5).font('Helvetica-Bold').text('SAASMANTRA', 300, 227);
doc.fillColor('#10B981').fontSize(7.5).font('Helvetica-Bold').text('STACKDEAL (INDIA)', 420, 227);

// Comparison Row 1: Pricing Currency
doc.rect(45, 240, 505, 16).fill('#F8FAFC');
doc.strokeColor('#E2E8F0').lineWidth(0.8).rect(45, 240, 505, 16).stroke();
doc.fillColor('#0F172A').fontSize(7).font('Helvetica-Bold').text('Currency & Pricing', 55, 244);
doc.fillColor('#64748B').fontSize(7).font('Helvetica').text('USD ($49 - $299)', 180, 244);
doc.fillColor('#64748B').fontSize(7).font('Helvetica').text('USD ($49 - $199)', 300, 244);
doc.fillColor('#10B981').fontSize(7).font('Helvetica-Bold').text('INR (₹1,499 - ₹9,999)', 420, 244);

// Comparison Row 2: Vendor Revenue Split
doc.rect(45, 256, 505, 16).fill('#FFFFFF');
doc.strokeColor('#E2E8F0').lineWidth(0.8).rect(45, 256, 505, 16).stroke();
doc.fillColor('#0F172A').fontSize(7).font('Helvetica-Bold').text('Vendor Revenue Split', 55, 260);
doc.fillColor('#EF4444').fontSize(7).font('Helvetica').text('30% to Vendor (70% cut)', 180, 260);
doc.fillColor('#64748B').fontSize(7).font('Helvetica').text('50% - 60% to Vendor', 300, 260);
doc.fillColor('#10B981').fontSize(7).font('Helvetica-Bold').text('70% to Vendor (Industry Best)', 420, 260);

// Comparison Row 3: Payment Methods
doc.rect(45, 272, 505, 16).fill('#F8FAFC');
doc.strokeColor('#E2E8F0').lineWidth(0.8).rect(45, 272, 505, 16).stroke();
doc.fillColor('#0F172A').fontSize(7).font('Helvetica-Bold').text('Indian Payment Rails', 55, 276);
doc.fillColor('#EF4444').fontSize(7).font('Helvetica').text('No UPI, Card Forex Fees', 180, 276);
doc.fillColor('#EF4444').fontSize(7).font('Helvetica').text('No UPI, PayPal/Cards', 300, 276);
doc.fillColor('#10B981').fontSize(7).font('Helvetica-Bold').text('Instant UPI (GPay/PhonePe)', 420, 276);

// Comparison Row 4: Indian GST B2B Invoices
doc.rect(45, 288, 505, 16).fill('#FFFFFF');
doc.strokeColor('#E2E8F0').lineWidth(0.8).rect(45, 288, 505, 16).stroke();
doc.fillColor('#0F172A').fontSize(7).font('Helvetica-Bold').text('18% GST B2B Invoices', 55, 292);
doc.fillColor('#EF4444').fontSize(7).font('Helvetica').text('None (Foreign Invoice)', 180, 292);
doc.fillColor('#EF4444').fontSize(7).font('Helvetica').text('None (Foreign Billing)', 300, 292);
doc.fillColor('#10B981').fontSize(7).font('Helvetica-Bold').text('100% Automated GST ITC', 420, 292);

// Comparison Row 5: AI Matchmaking
doc.rect(45, 304, 505, 16).fill('#F8FAFC');
doc.strokeColor('#E2E8F0').lineWidth(0.8).rect(45, 304, 505, 16).stroke();
doc.fillColor('#0F172A').fontSize(7).font('Helvetica-Bold').text('AI Stack Matchmaking', 55, 308);
doc.fillColor('#64748B').fontSize(7).font('Helvetica').text('Basic keyword search', 180, 308);
doc.fillColor('#64748B').fontSize(7).font('Helvetica').text('Manual category browse', 300, 308);
doc.fillColor('#10B981').fontSize(7).font('Helvetica-Bold').text('Groq Llama 3.3 AI Engine', 420, 308);

// Strategic 3-Phase Growth Roadmap
doc.fillColor('#0F172A').fontSize(10).font('Helvetica-Bold').text('3-YEAR STRATEGIC EXPANSION ROADMAP', 45, 332);

drawCard(
  45, 345, 160, 135, '#EFF6FF', '#BFDBFE',
  'Phase 1: Foundation (2026)',
  '• Curate first 50 verified tools\n' +
  '• Onboard 2,500 agency buyers\n' +
  '• Achieve ₹1.5 Cr in platform GMV\n' +
  '• Launch Product Hunt & BetaList\n' +
  '• Deploy Groq AI Recommendation V2\n' +
  '• Zero-burn cash-flow profitability',
  '#1E40AF'
);

drawCard(
  217, 345, 160, 135, '#F0FDF4', '#BBF7D0',
  'Phase 2: Scale (2027)',
  '• Introduce Agency Team Workspaces\n' +
  '• White-label agency deal bundles\n' +
  '• Self-serve SaaS vendor dashboard\n' +
  '• Scale to 15,000 active agencies\n' +
  '• Achieve ₹12 Cr in platform GMV\n' +
  '• Launch StackDeal Affiliate Guild',
  '#166534'
);

drawCard(
  390, 345, 160, 135, '#FAF5FF', '#E9D5FF',
  'Phase 3: Ecosystem (2028)',
  '• Launch StackDeal Ventures\n' +
  '• Pre-seed grants for indie builders\n' +
  '• Expand to Southeast Asia & MENA\n' +
  '• 50,000+ paying businesses\n' +
  '• ₹50 Cr+ cumulative deal volume\n' +
  '• The #1 SaaS Launchpad in Asia',
  '#6B21A8'
);

// Final Call to Action & Contact Block
drawCard(
  45, 490, 505, 110, '#0F172A', '#334155',
  'Connect with the Founder & Join the Ecosystem',
  '• Official Platform: https://www.stackdeal.in\n' +
  '• Founder: Ujjawal Tiwari (Solo Founder & Full-Stack Architect)\n' +
  '• Direct Inquiries: support@stackdeal.in  |  founders@stackdeal.in\n' +
  '• For Software Creators: Submit your SaaS tool at stackdeal.in/submit for high-velocity distribution.\n' +
  '• For Investors & Partners: Open for strategic non-dilutive grants, venture partnerships, and agency distribution syndicates.\n' +
  '• Built with relentless dedication in India for the global software ecosystem.',
  '#FF6B35'
);

// End Document
doc.end();

writeStream.on('finish', () => {
  console.log('Master Guide PDF successfully created at:', desktopSaaterraOutput);

  // Copy to Documents folder
  try {
    fs.copyFileSync(desktopSaaterraOutput, docFolderOutput);
    console.log('Successfully copied to Documents folder:', docFolderOutput);
  } catch (e) {
    console.log('Note on Documents copy:', e.message);
  }

  // Copy to Desktop Root for 1-click user access
  try {
    fs.copyFileSync(desktopSaaterraOutput, desktopRootOutput);
    console.log('Successfully copied to Desktop root for 1-click user access:', desktopRootOutput);
  } catch (e) {
    console.log('Note on Desktop root copy:', e.message);
  }
});
