const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

// A4 Document format: 595.28 x 841.89 pt (Standard Google Doc / Executive Briefing style)
const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 45, bottom: 45, left: 50, right: 50 },
  autoFirstPage: false
});

const outputPath = path.join('C:\\Users\\ujjaw\\OneDrive\\Documents\\saaterra', 'StackDeal_Official_Pitch_Deck_Document.pdf');
const desktopOutputPath = path.join('C:\\Users\\ujjaw\\OneDrive\\Desktop\\saaterra', 'StackDeal_Official_Pitch_Deck_Document.pdf');

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

let pageNum = 0;

function newDocPage(headerCategory) {
  doc.addPage();
  pageNum++;

  // Top Orange Stripe
  doc.rect(0, 0, 595.28, 5).fill('#FF6B35');

  // Header
  doc.fillColor('#0F172A').fontSize(11).font('Helvetica-Bold').text('StackDeal', 50, 22);
  doc.fillColor('#64748B').fontSize(9).font('Helvetica').text('• stackdeal.in', 108, 24);
  doc.fillColor('#64748B').fontSize(8.5).font('Helvetica-Bold').text((headerCategory || 'First Capital by Indra Dhar — Official Pitch Document').toUpperCase(), 250, 24, { width: 295, align: 'right' });

  // Header Divider
  doc.strokeColor('#E2E8F0').lineWidth(0.8).moveTo(50, 40).lineTo(545, 40).stroke();

  // Footer
  doc.strokeColor('#E2E8F0').lineWidth(0.8).moveTo(50, 802).lineTo(545, 802).stroke();
  doc.fillColor('#94A3B8').fontSize(8.5).font('Helvetica').text('StackDeal — Official 10-Section Investment Pitch Document', 50, 812);
  doc.fillColor('#94A3B8').fontSize(8.5).font('Helvetica').text(`Page ${pageNum}`, 450, 812, { width: 95, align: 'right' });
}

function drawSectionHeader(number, title, promptQuestion) {
  doc.moveDown(0.6);
  doc.fillColor('#FF6B35').fontSize(10).font('Helvetica-Bold').text(`SECTION ${number} OF 10`, 50, doc.y);
  doc.fillColor('#0F172A').fontSize(17).font('Helvetica-Bold').text(`${number}. ${title}`, 50, doc.y + 2);
  if (promptQuestion) {
    doc.fillColor('#64748B').fontSize(9.5).font('Helvetica-Oblique').text(promptQuestion, 50, doc.y + 4, { width: 495, lineGap: 2 });
  }
  doc.moveDown(0.6);
  doc.strokeColor('#CBD5E1').lineWidth(0.6).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown(0.8);
}

function drawCalloutBox(title, bodyText, bgColor, borderColor, titleColor) {
  const boxX = 50;
  const boxY = doc.y;
  const width = 495;

  // Measure text height
  doc.fontSize(9.5).font('Helvetica');
  const textHeight = doc.heightOfString(bodyText, { width: width - 30, lineGap: 3.5 });
  const boxHeight = textHeight + 40;

  doc.roundedRect(boxX, boxY, width, boxHeight, 6).fill(bgColor || '#F8FAFC');
  doc.roundedRect(boxX, boxY, width, boxHeight, 6).strokeColor(borderColor || '#E2E8F0').lineWidth(1).stroke();

  doc.fillColor(titleColor || '#0F172A').fontSize(11).font('Helvetica-Bold').text(title, boxX + 15, boxY + 12);
  doc.fillColor('#334155').fontSize(9.5).font('Helvetica').text(bodyText, boxX + 15, boxY + 30, {
    width: width - 30,
    lineGap: 3.5
  });

  doc.y = boxY + boxHeight + 12;
}

// ─────────────────────────────────────────────
// PAGE 1: TITLE & COVER SHEET
// ─────────────────────────────────────────────
newDocPage('Executive Cover');

doc.moveDown(1.5);
doc.fillColor('#FF6B35').fontSize(11).font('Helvetica-Bold').text('FIRST CAPITAL BY INDRA DHAR • OFFICIAL APPLICATION', 50, doc.y);
doc.moveDown(0.3);
doc.fillColor('#0F172A').fontSize(26).font('Helvetica-Bold').text('StackDeal: Official 10-Section Pitch Document', 50, doc.y, { width: 495, lineGap: 4 });
doc.moveDown(0.2);
doc.fillColor('#475569').fontSize(12).font('Helvetica').text('India\'s Curated B2B SaaS 5-Year Deal Marketplace', 50, doc.y);
doc.moveDown(0.8);
doc.strokeColor('#E2E8F0').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
doc.moveDown(1.2);

drawCalloutBox(
  'Applicant & Startup Metadata',
  '• Startup Name: StackDeal (https://www.stackdeal.in)\n' +
  '• Founder: Ujjawal Tiwari (Solo Founder & Full-Stack Developer)\n' +
  '• Current Stage: Live Public Beta / Working MVP (Launched September 2026)\n' +
  '• Program: First Capital by Indra Dhar (₹1,00,000 Non-Equity Investment & Mentorship)\n' +
  '• Core Offering: Curated 5-Year Access Passes for Indian Digital Agencies with 18% GST Invoicing and 70% Founder Rev-Share.',
  '#F8FAFC', '#CBD5E1', '#0F172A'
);

drawCalloutBox(
  'Document Purpose & Structure',
  'This official document strictly fulfills all 10 evaluation criteria specified in the First Capital Participation Guide:\n' +
  '1. Your Startup  |  2. The Problem  |  3. Your Solution  |  4. Your Product / Service\n' +
  '5. Market Opportunity (TAM-SAM-SOM)  |  6. Business Model  |  7. Revenue Strategy\n' +
  '8. Competitive Advantage  |  9. Your Team & Execution  |  10. Future Vision & Capital Deployment.',
  '#EFF6FF', '#BFDBFE', '#1E40AF'
);

drawCalloutBox(
  'Current Operational Milestones (Live Proof)',
  '• Production Platform: 100% active at https://stackdeal.in with Next.js 16 SSR & Groq AI Matchmaker.\n' +
  '• Product Hunt Debut: Debuted September 2026 with verified Maker profile and positive community engagement.\n' +
  '• Verified Google Indexing: 100% indexed on Google Search Console with green-tick verified status.\n' +
  '• Payment Architecture: Razorpay checkout integration with automated 18% GST B2B invoice generation.',
  '#F0FDF4', '#BBF7D0', '#166534'
);


// ─────────────────────────────────────────────
// PAGE 2: SECTIONS 1 & 2 (YOUR STARTUP & THE PROBLEM)
// ─────────────────────────────────────────────
newDocPage('Sections 1 & 2');

drawSectionHeader(
  1,
  'Your Startup',
  'What does your startup do? Who is it for? What are you building, and why is it relevant?'
);

drawCalloutBox(
  'Core Identity & Mission',
  'StackDeal (stackdeal.in) is India\'s curated B2B SaaS deal marketplace. We help Indian digital marketing agencies, growth teams, and freelancers eliminate recurring monthly subscription fatigue by offering transparent 5-Year Access Passes to essential business software.\n\n' +
  'Instead of paying expensive foreign currency subscriptions ($30–$99/month) with zero tax compliance, Indian buyers pay once in INR via native UPI/Cards and receive official 18% GST tax invoices for CA write-offs. Simultaneously, we provide bootstrapped SaaS founders with instant, zero-CAC distribution and 70% revenue share with bi-weekly payouts.',
  '#F8FAFC', '#E2E8F0', '#0F172A'
);

drawSectionHeader(
  2,
  'The Problem',
  'What real problem, need, or market gap are you solving? Who faces this problem, and why does it matter?'
);

drawCalloutBox(
  'A. The Indian Agency Struggle (Buyers)',
  '• Severe Subscription Bleed: An average boutique digital agency uses 6 to 8 tools (WhatsApp bots, SEO trackers, scrapers, CRM), paying ₹20,000–₹50,000 every month on credit cards, even during slow client seasons.\n' +
  '• 18% GST Tax Loss: Foreign billing from Stripe/US entities offers zero Indian GST compliance, causing Indian agencies to lose 18% input tax credit (ITC) on all software expenses.\n' +
  '• Payment Rejections: Under RBI e-mandate rules, most Indian debit cards face automatic foreign transaction declines on US websites.',
  '#FEF2F2', '#FECACA', '#991B1B'
);

drawCalloutBox(
  'B. The SaaS Founder Struggle (Sellers)',
  '• Zero Marketing Distribution: Solo developers build solid technical software but lack the marketing budget to acquire their first 100 paying customers.\n' +
  '• Predatory Legacy Platforms: Global deal sites like AppSumo take 70% to 80% commissions and hold payouts for 60+ days.\n' +
  '• Infinite Lifetime Liability: Traditional "Lifetime Deals" burden founders with infinite server costs without clear boundaries.',
  '#FFFBEB', '#FDE68A', '#92400E'
);


// ─────────────────────────────────────────────
// PAGE 3: SECTIONS 3 & 4 (SOLUTION & PRODUCT)
// ─────────────────────────────────────────────
newDocPage('Sections 3 & 4');

drawSectionHeader(
  3,
  'Your Solution',
  'How does your product or service solve the problem? What value does it provide to customers?'
);

drawCalloutBox(
  'The 5-Year Access Pass Innovation',
  '• For Agencies: Pay once in INR, get 5 full years of verified software access with zero recurring monthly bills, native UPI checkout, and automated 18% GST tax invoices.\n' +
  '• For SaaS Creators: Keep 70% of every sale with bi-weekly direct bank settlements, 100+ active agency power users, and a 1-Click AI listing copilot.\n' +
  '• Why 5-Year Passes Beat Lifetime Deals: 5-Year Passes establish healthy server boundaries while giving buyers multi-year cost certainty. Heavy agencies naturally expand into recurring plans as their client operations grow.',
  '#F0FDF4', '#BBF7D0', '#166534'
);

drawSectionHeader(
  4,
  'Your Product / Service',
  'Show us what you\'re offering and how it works. (Live Production Platform: stackdeal.in)'
);

drawCalloutBox(
  'Live Production Architecture (100% Deployed)',
  '1. Next.js 16 SSR Engine: Pre-rendered server-side architecture delivering sub-second page loads, zero Soft 404 crawl errors, and Schema.org rich snippets.\n' +
  '2. Razorpay & GST Engine: Native PhonePe, GPay, Paytm, and Card checkout with automated B2B PDF tax invoice generation.\n' +
  '3. Groq AI Matchmaker: Llama-3 powered intelligent assistant that analyzes agency niche to suggest high-ROI software bundles in 3 seconds.\n' +
  '4. Vendor Operations Vault: Secure admin portal for deal approvals, redemption code management, and payout tracking.\n\n' +
  '• Active Live Deals: Chat Chacha (WhatsApp AI Automation), SEO Rocket (AI Rank Radar), EmailExtractor Pro AI (B2B Lead Scraper), Nuwatomic (GEO AI SEO).',
  '#F8FAFC', '#CBD5E1', '#0F172A'
);


// ─────────────────────────────────────────────
// PAGE 4: SECTIONS 5 & 6 (MARKET OPPORTUNITY & BUSINESS MODEL)
// ─────────────────────────────────────────────
newDocPage('Sections 5 & 6');

drawSectionHeader(
  5,
  'Market Opportunity',
  'Who are your target customers? How large is the market? (SaaSBoomi, NASSCOM & IAMAI Data)'
);

drawCalloutBox(
  'TAM • SAM • SOM Market Sizing',
  '• TAM (Total Addressable Market): ₹1,20,000 Crore ($14.5 Billion) — Total Indian domestic B2B SaaS software consumption market by 2026, growing at 28% annual CAGR toward $50B by 2030 (SaaSBoomi Report).\n\n' +
  '• SAM (Serviceable Market): ₹8,500 Crore ($1.0 Billion) — Annual software expenditure by 35,000+ Indian digital marketing agencies (spending ₹2.5L–₹4.0L/year) and 1.5 Crore+ tech freelancers & solopreneurs.\n\n' +
  '• SOM (Our 3-Year Target): ₹85 Crore ($10.0 Million GMV) — Target of acquiring 5,000 active digital agencies (representing only 14% of India\'s agency market) purchasing an average of 3.5 deal passes annually on StackDeal.\n' +
  '  👉 StackDeal Net Commission (30% of ₹85 Cr): ₹25.50 Crore ($3.0 Million) pure net revenue with zero inventory risk!',
  '#EFF6FF', '#BFDBFE', '#1E40AF'
);

drawSectionHeader(
  6,
  'Business Model',
  'How does your business create, deliver, and capture value? (Commercial Mechanics & Unit Economics)'
);

drawCalloutBox(
  'High-Margin Marketplace Unit Economics',
  '• Primary Take-Rate (30% Commission): StackDeal retains 30% of every 5-Year Pass transaction; 70% is transferred directly to the software creator.\n\n' +
  '• Unit Economics Example:\n' +
  '  - Average 5-Year Pass Retail Price: ₹2,499 (Buyer pays once for 5 years)\n' +
  '  - Founder Payout (70%): ₹1,749 (Direct bi-weekly bank transfer)\n' +
  '  - StackDeal Gross Profit (30%): ₹750 per sale\n' +
  '  - Inventory Cost: ₹0 (Pure digital software fulfillment via automated license keys)\n\n' +
  '• Fulfillment Flow: Curate tool ➔ Generate digital promo codes ➔ Indian UPI checkout ➔ Instant code delivery + 18% GST invoice ➔ Bi-weekly founder settlement.',
  '#F8FAFC', '#CBD5E1', '#0F172A'
);


// ─────────────────────────────────────────────
// PAGE 5: SECTIONS 7 & 8 (REVENUE STRATEGY & COMPETITIVE ADVANTAGE)
// ─────────────────────────────────────────────
newDocPage('Sections 7 & 8');

drawSectionHeader(
  7,
  'Revenue Strategy',
  'How does your startup make money today — or plan to make money in the future?'
);

drawCalloutBox(
  '3-Tiered Monetization Roadmap',
  '1. Deal Sales Take-Rate (Live Today): 30% commission on all marketplace deal transactions.\n' +
  '2. StackDeal Plus VIP Membership (Q4 Launch): ₹2,999/year subscription for active agencies providing an extra 10% discount on all deals and 24-hour early access drops (100% recurring SaaS revenue).\n' +
  '3. Sponsored Vendor Spotlights: Featured hero carousel slots and dedicated agency newsletter blasts (₹25,000–₹50,000 per launch campaign).',
  '#F8FAFC', '#E2E8F0', '#0F172A'
);

drawSectionHeader(
  8,
  'Competitive Advantage',
  'Who are your competitors or alternatives? What makes your startup different?'
);

drawCalloutBox(
  'StackDeal vs. Global Incumbents (AppSumo / PitchGround)',
  '• Payment Rails: AppSumo requires USD credit cards with expensive foreign exchange markups. StackDeal supports native UPI, PhonePe, Paytm, RuPay, and Net Banking.\n' +
  '• GST Compliance: AppSumo provides foreign US receipts with 0% Indian GST credit. StackDeal delivers automated 18% GST B2B tax invoices with GSTIN validation.\n' +
  '• Founder Rev-Share: AppSumo takes 70%–80% cuts (founders get 20-30%). StackDeal gives 70% directly back to the creator.\n' +
  '• Model Sustainability: Legacy platforms push infinite lifetime deals; StackDeal pioneers the sustainable 5-Year Pass model.\n' +
  '• Niche Focus: AppSumo ignores Indian tools; StackDeal focuses on high-demand WhatsApp bots, scrapers, and local SEO tools.',
  '#F0FDF4', '#BBF7D0', '#166534'
);


// ─────────────────────────────────────────────
// PAGE 6: SECTIONS 9 & 10 (TEAM & FUTURE VISION)
// ─────────────────────────────────────────────
newDocPage('Sections 9 & 10');

drawSectionHeader(
  9,
  'Your Team',
  'Who is behind the startup? Introduce the founders, their roles, and execution experience.'
);

drawCalloutBox(
  'Founder Profile & Execution Capability',
  '• Ujjawal Tiwari — Solo Founder & Full-Stack Builder\n' +
  '• Technical Mastery: Engineered the complete StackDeal production platform from scratch (Next.js 16, TypeScript, MongoDB, Razorpay API, Groq AI).\n' +
  '• Speed & Problem Solving: Solved technical SEO SSR soft 404 indexing challenges, debuted on Product Hunt, and deployed a production marketplace with zero external capital burn.\n' +
  '• Execution Principles: Hyper-lean capital discipline, daily shipping cadence, and organic community-driven customer acquisition.',
  '#F8FAFC', '#CBD5E1', '#0F172A'
);

drawSectionHeader(
  10,
  'Future Vision & Capital Deployment',
  'Where are you taking this business? Share your growth plans and how you will deploy First Capital (₹1 Lakh).'
);

drawCalloutBox(
  'Deployment of First Capital (₹1,00,000 Non-Equity Grant)',
  '• 40% (₹40,000) — Vendor Curation & Onboarding: Direct outreach and launch onboarding incentives to secure exclusive 5-Year Passes for the first 25 verified high-utility SaaS tools.\n' +
  '• 35% (₹35,000) — Agency Community Distribution: Targeted spotlight campaigns across Indian marketing agency WhatsApp hubs, LinkedIn founder networks, and digital marketing communities.\n' +
  '• 25% (₹25,000) — Platform Infrastructure & Scaling: Dedicated production server capacity, automated GST invoice pipelines, and Groq AI Matchmaker scaling.',
  '#EFF6FF', '#BFDBFE', '#1E40AF'
);

drawCalloutBox(
  '12-Month Hard Performance Milestones',
  '• Curate 50+ Verified SaaS Tools across WhatsApp, AI SEO, Lead Scrapers, CRM, and Productivity.\n' +
  '• Onboard 2,000+ Active Paying Agency Accounts across Tier-1 and Tier-2 Indian business hubs.\n' +
  '• Generate ₹1.5 Crore+ in Deal Sales GMV with strong positive operational cash flows.\n' +
  '• Direct Economic Impact: Enabling 50+ Indian bootstrapped software creators to earn their first ₹5L to ₹10L in sustainable revenue.',
  '#F8FAFC', '#CBD5E1', '#0F172A'
);

doc.end();

writeStream.on('finish', () => {
  console.log('Google Doc Style Master PDF successfully generated at:', outputPath);
  try {
    fs.copyFileSync(outputPath, desktopOutputPath);
    console.log('Copied to Desktop:', desktopOutputPath);
  } catch (e) {
    console.log('Desktop copy note:', e.message);
  }
});
