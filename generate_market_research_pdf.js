const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

// A4 Portrait dimensions: 595.28 x 841.89 pt
const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 40, bottom: 40, left: 45, right: 45 },
  autoFirstPage: false
});

const outputPath = path.join('C:\\Users\\ujjaw\\OneDrive\\Documents\\saaterra', 'StackDeal_Market_Research_Master_Guide.pdf');
const desktopOutputPath = path.join('C:\\Users\\ujjaw\\OneDrive\\Desktop\\saaterra', 'StackDeal_Market_Research_Master_Guide.pdf');

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

let pageNumber = 0;

function startReportPage(sectionTitle) {
  doc.addPage();
  pageNumber++;

  // Top accent banner
  doc.rect(0, 0, 595.28, 6).fill('#FF6B35');

  // Header
  doc.fillColor('#0F172A').fontSize(12).font('Helvetica-Bold').text('StackDeal', 45, 25);
  doc.fillColor('#64748B').fontSize(9).font('Helvetica').text('• stackdeal.in', 105, 27);
  doc.fillColor('#64748B').fontSize(9).font('Helvetica-Bold').text(sectionTitle.toUpperCase(), 300, 27, { width: 250, align: 'right' });

  // Divider
  doc.strokeColor('#E2E8F0').lineWidth(0.8).moveTo(45, 45).lineTo(550, 45).stroke();

  // Footer
  doc.strokeColor('#E2E8F0').lineWidth(0.8).moveTo(45, 800).lineTo(550, 800).stroke();
  doc.fillColor('#94A3B8').fontSize(8.5).font('Helvetica').text('StackDeal — Strategic Market Research & Unit Economics Dossier', 45, 810);
  doc.fillColor('#94A3B8').fontSize(8.5).font('Helvetica').text(`Page ${pageNumber}`, 450, 810, { width: 100, align: 'right' });
}

// ─────────────────────────────────────────────
// PAGE 1: COVER & EXECUTIVE SUMMARY
// ─────────────────────────────────────────────
startReportPage('Executive Summary');

// Title Section
doc.fillColor('#FF6B35').fontSize(11).font('Helvetica-Bold').text('CONFIDENTIAL RESEARCH & STRATEGY DOSSIER', 45, 60);
doc.fillColor('#0F172A').fontSize(24).font('Helvetica-Bold').text('StackDeal: Indian B2B SaaS Market Opportunity & Financial Blueprint', 45, 80, { width: 505, lineGap: 4 });
doc.fillColor('#475569').fontSize(11).font('Helvetica').text('Comprehensive analysis of domestic agency software spending, TAM-SAM-SOM unit economics, cross-border vendor mechanics, and competitive moat.', 45, 140, { width: 505, lineGap: 4 });

// Highlight Box: Executive Summary
doc.roundedRect(45, 195, 505, 160, 6).fill('#F8FAFC');
doc.rect(45, 195, 505, 160).strokeColor('#CBD5E1').lineWidth(1).stroke();

doc.fillColor('#0F172A').fontSize(12).font('Helvetica-Bold').text('Executive Summary & Core Hypothesis', 60, 210);
doc.fillColor('#334155').fontSize(9.5).font('Helvetica').text(
  '• The Core Problem: Indian digital marketing agencies and solopreneurs face severe "SaaS Subscription Fatigue," paying $30–$99/month on foreign credit cards with zero GST input credit (18% direct tax loss). Simultaneously, bootstrapped SaaS founders struggle for distribution and get charged 70–80% cuts by legacy US platforms like AppSumo.\n\n' +
  '• The Solution: StackDeal (stackdeal.in) introduces curated 5-Year Access Passes. Buyers pay once in INR via UPI and receive automated 18% GST B2B tax invoices. Software creators keep 70% of sales with direct bi-weekly bank settlements.\n\n' +
  '• Market Scale: A ₹1,20,000 Crore ($14.5B) domestic SaaS market with 35,000+ digital agencies spending over ₹8,500 Crore annually on software tools.',
  60, 230, { width: 475, lineGap: 4 }
);

// Key Metric Grid
const metricBoxes = [
  { val: '₹1,20,000 Cr', label: 'Indian Domestic SaaS TAM', sub: '$14.5B by 2026 (SaaSBoomi/NASSCOM)' },
  { val: '35,000+', label: 'Registered Digital Agencies', sub: '94% boutique (IAMAI Census Data)' },
  { val: '₹85 Crore', label: '3-Year SOM GMV Target', sub: '5,000 agencies buying 3-4 passes/yr' },
  { val: '₹26.2 Crore', label: 'StackDeal Net Revenue Target', sub: '30% marketplace take-rate' }
];

metricBoxes.forEach((m, idx) => {
  const x = 45 + (idx % 2) * 260;
  const y = 375 + Math.floor(idx / 2) * 95;
  doc.roundedRect(x, y, 245, 80, 6).fill('#F1F5F9');
  doc.rect(x, y, 245, 80).strokeColor('#E2E8F0').lineWidth(1).stroke();

  doc.fillColor('#FF6B35').fontSize(16).font('Helvetica-Bold').text(m.val, x + 15, y + 12);
  doc.fillColor('#0F172A').fontSize(10).font('Helvetica-Bold').text(m.label, x + 15, y + 36);
  doc.fillColor('#64748B').fontSize(8.5).font('Helvetica').text(m.sub, x + 15, y + 54, { width: 215 });
});

// Author Block
doc.roundedRect(45, 590, 505, 185, 6).fill('#0F172A');
doc.fillColor('#FFFFFF').fontSize(12).font('Helvetica-Bold').text('Platform & Founder Credentials', 60, 608);
doc.fillColor('#E2E8F0').fontSize(9.5).font('Helvetica').text(
  '• Platform: StackDeal (stackdeal.in) — Live, production-ready marketplace built on Next.js 16 SSR, Razorpay UPI/Cards engine, Groq AI Matchmaker, and MongoDB.\n\n' +
  '• Founder: Ujjawal Tiwari (Full-Stack Builder & Architect).\n\n' +
  '• Milestones: Officially launched on Product Hunt (September 2026), 100% Google Search Console indexing verified with zero crawl errors, multi-vendor deal catalogue live.\n\n' +
  '• Target Program: First Capital by Indra Dhar (₹1 Lakh Non-Equity Support & 15-Day Mentorship).',
  60, 630, { width: 475, lineGap: 4 }
);


// ─────────────────────────────────────────────
// PAGE 2: TAM, SAM, SOM WITH IN-DEPTH REAL-WORLD EXAMPLES
// ─────────────────────────────────────────────
startReportPage('TAM • SAM • SOM Breakdown');

doc.fillColor('#0F172A').fontSize(18).font('Helvetica-Bold').text('Market Sizing Framework & Exact Financial Math', 45, 60);
doc.fillColor('#475569').fontSize(10).font('Helvetica').text('Detailed breakdown of market sizing layers using real-world analogies and bottom-up financial calculations.', 45, 82);

// Analogy Box
doc.roundedRect(45, 105, 505, 75, 6).fill('#EFF6FF');
doc.rect(45, 105, 505, 75).strokeColor('#BFDBFE').lineWidth(1).stroke();
doc.fillColor('#1E40AF').fontSize(10.5).font('Helvetica-Bold').text('The Real-World Analogy (Samandar vs Talab vs Glass of Water):', 60, 118);
doc.fillColor('#1E3A8A').fontSize(9).font('Helvetica').text(
  '• TAM (Samandar): Total software spending by all businesses in India (Banks, Tata, Infosys, MSMEs).\n' +
  '• SAM (Talab): Software spending by our specific target customers (Digital Agencies & Freelancers).\n' +
  '• SOM (Glass of Water): The realistic market StackDeal will capture in 3 years (5,000 paying agencies).',
  60, 135, { width: 475, lineGap: 3 }
);

// TAM Block
doc.roundedRect(45, 195, 505, 150, 6).fill('#F8FAFC');
doc.rect(45, 195, 505, 150).strokeColor('#CBD5E1').lineWidth(1).stroke();
doc.fillColor('#FF6B35').fontSize(13).font('Helvetica-Bold').text('1. TAM (Total Addressable Market) = ₹1,20,000 Crore ($14.5 Billion)', 60, 210);
doc.fillColor('#334155').fontSize(9.5).font('Helvetica').text(
  '• Definition: Total domestic software and B2B SaaS consumption across India across enterprise, mid-market, and small business sectors.\n' +
  '• Growth Vector: Expanding at a 28% Compound Annual Growth Rate (CAGR) toward $50 Billion by 2030 (SaaSBoomi & NASSCOM Domestic SaaS Report).\n' +
  '• Key Drivers: Government digital push, mandatory e-invoicing/GST, UPI payments, and the rapid digitization of 6.3 Crore registered MSMEs under Udyam.',
  60, 230, { width: 475, lineGap: 5 }
);

// SAM Block
doc.roundedRect(45, 360, 505, 185, 6).fill('#F8FAFC');
doc.rect(45, 360, 505, 185).strokeColor('#CBD5E1').lineWidth(1).stroke();
doc.fillColor('#2563EB').fontSize(13).font('Helvetica-Bold').text('2. SAM (Serviceable Addressable Market) = ₹8,500 Crore ($1.0 Billion)', 60, 375);
doc.fillColor('#334155').fontSize(9.5).font('Helvetica').text(
  '• Definition: The exact portion of the market targeted by StackDeal (Indian Digital Marketing Agencies, B2B Growth Teams, Freelancers, and Solopreneurs).\n\n' +
  '• The Math & Breakdown:\n' +
  '  - 35,000+ Registered Digital Marketing Agencies × ₹2.5 Lakh average annual spend on software tools (WhatsApp bots, SEO trackers, scrapers, CRMs) = ₹875 Crore.\n' +
  '  - 1.5 Crore Freelancers (NASSCOM data) where top 5 Lakh active solopreneurs spend ₹15,000/year on tools = ₹750 Crore.\n' +
  '  - Emerging B2B E-commerce & Direct-to-Consumer (D2C) brands spending on marketing SaaS = ₹6,875 Crore.\n' +
  '  - Total Addressable Annual Software Spend = ₹8,500 Crore ($1.0B).',
  60, 395, { width: 475, lineGap: 4 }
);

// SOM Block
doc.roundedRect(45, 560, 505, 220, 6).fill('#F8FAFC');
doc.rect(45, 560, 505, 220).strokeColor('#10B981').lineWidth(1.5).stroke();
doc.fillColor('#059669').fontSize(13).font('Helvetica-Bold').text('3. SOM (Serviceable Obtainable Market - 3-Year Target) = ₹85 Crore ($10M GMV)', 60, 575);
doc.fillColor('#334155').fontSize(9.5).font('Helvetica').text(
  '• Definition: The realistic, bottom-up market share StackDeal aims to capture over the next 36 months.\n\n' +
  '• The Exact Calculation:\n' +
  '  - Target Customers: 5,000 Active Agencies (representing only 14% of India\'s 35,000 agencies).\n' +
  '  - Purchase Frequency: Each agency purchases an average of 3.5 SaaS deals per year (e.g. 1 WhatsApp bot + 1 SEO radar + 1 Lead scraper + 1 CRM pass).\n' +
  '  - Average Order Value (AOV): ₹5,000 per deal pass.\n' +
  '  - Total Gross Merchandise Value (GMV): 5,000 × 3.5 × ₹5,000 = ₹87.5 Crore (~$10 Million GMV).\n\n' +
  '• StackDeal Net Revenue (30% Marketplace Commission):\n' +
  '  - ₹87.5 Crore GMV × 30% take-rate = ₹26.25 Crore ($3.1 Million) Pure Net Revenue for StackDeal with zero inventory risk!',
  60, 595, { width: 475, lineGap: 4 }
);


// ─────────────────────────────────────────────
// PAGE 3: COMPETITIVE MOAT & ZERO-LOSS OPERATIONAL BLUEPRINT
// ─────────────────────────────────────────────
startReportPage('Competitive Strategy & Operations');

doc.fillColor('#0F172A').fontSize(18).font('Helvetica-Bold').text('Why StackDeal Wins Over AppSumo & Zero-Loss Mechanics', 45, 60);
doc.fillColor('#475569').fontSize(10).font('Helvetica').text('How StackDeal eliminates Indian buyer friction, rewards SaaS founders, and safeguards gross margins.', 45, 82);

// Comparison Table
const compData = [
  { feat: 'Payment Method', sd: 'Instant UPI, PhonePe, Paytm, RuPay, Cards', as: 'Foreign USD Credit Card only (3.5% markup)' },
  { feat: 'GST Compliance', sd: 'Automated 18% GST B2B Tax Invoices with GSTIN', as: 'Zero Indian GST (18% direct tax loss for CA)' },
  { feat: 'Founder Payout', sd: '70% to SaaS Founder (Bi-weekly settlements)', as: '20% to 30% (AppSumo retains 70-80% cut)' },
  { feat: 'Access Model', sd: 'Sustainable 5-Year Pass (Protects server unit costs)', as: 'Infinite Lifetime Deals (Heavy server liability)' },
  { feat: 'Hot Niche Focus', sd: 'WhatsApp Automation, Google Maps Scrapers, Local SEO', as: 'US-centric tools (Ignores WhatsApp/Indian D2C)' }
];

let tableY = 110;
doc.roundedRect(45, tableY, 505, 25, 4).fill('#1E293B');
doc.fillColor('#FFFFFF').fontSize(9).font('Helvetica-Bold').text('FEATURE / METRIC', 55, tableY + 8);
doc.fillColor('#818CF8').fontSize(9).font('Helvetica-Bold').text('STACKDEAL (INDIA)', 180, tableY + 8);
doc.fillColor('#CBD5E1').fontSize(9).font('Helvetica-Bold').text('APPSUMO (GLOBAL INCUMBENT)', 360, tableY + 8);

compData.forEach((row, i) => {
  tableY += 30;
  doc.roundedRect(45, tableY, 505, 26, 4).fill(i % 2 === 0 ? '#F8FAFC' : '#FFFFFF');
  doc.rect(45, tableY, 505, 26).strokeColor('#E2E8F0').lineWidth(0.8).stroke();

  doc.fillColor('#0F172A').fontSize(8.5).font('Helvetica-Bold').text(row.feat, 55, tableY + 8);
  doc.fillColor('#059669').fontSize(8.5).font('Helvetica-Bold').text(row.sd, 180, tableY + 8, { width: 170 });
  doc.fillColor('#64748B').fontSize(8.5).font('Helvetica').text(row.as, 360, tableY + 8, { width: 180 });
});

// Zero-Loss Operational Architecture
doc.roundedRect(45, 305, 505, 240, 6).fill('#F8FAFC');
doc.rect(45, 305, 505, 240).strokeColor('#CBD5E1').lineWidth(1).stroke();
doc.fillColor('#0F172A').fontSize(12).font('Helvetica-Bold').text('The 4 Pillars of Zero-Loss Marketplace Operations', 60, 320);
doc.fillColor('#334155').fontSize(9.5).font('Helvetica').text(
  '1. Zero Upfront Inventory: StackDeal never buys software licenses in advance. Digital license keys are delivered on commission upon successful customer payment, guaranteeing 0% capital at risk.\n\n' +
  '2. Currency Pegging & Buffer: Deals are pegged to USD with an automated INR conversion buffer (e.g. ₹85/USD + 3% margin buffer). Whether the dollar rises or falls, StackDeal\'s 30% take-rate remains 100% protected.\n\n' +
  '3. Reliable B2B Outward Remittance (Wise / PayPal / Razorpay): Unlike consumer card swipes that fail due to RBI auto-debit rules, StackDeal settles foreign vendor payouts via direct B2B bank wire transfer (Wise Business / PayPal), ensuring 100% payout success rate.\n\n' +
  '4. Escrow & Refund Protection: Vendor payouts are disbursed bi-weekly after the 30-60 day trial window. In the event of a customer refund, the digital license is deactivated via API and funds are reversed from escrow without out-of-pocket loss.',
  60, 340, { width: 475, lineGap: 4 }
);

// Strategic Growth Roadmap
doc.roundedRect(45, 560, 505, 220, 6).fill('#0F172A');
doc.fillColor('#FFFFFF').fontSize(12).font('Helvetica-Bold').text('3-Year Strategic Growth Roadmap & Milestones', 60, 578);
doc.fillColor('#E2E8F0').fontSize(9.5).font('Helvetica').text(
  '• Months 1 to 6 (Curation & Density):\n' +
  '  - Curate 30 verified high-ROI SaaS tools across WhatsApp, AI SEO, and Lead Scrapers.\n' +
  '  - Onboard 500 digital agencies across Delhi-NCR, Bengaluru, Mumbai, and Tier-2 hubs.\n\n' +
  '• Months 6 to 18 (Monetization & VIP Plus):\n' +
  '  - Launch StackDeal Plus (₹2,999/year VIP membership) for recurring SaaS revenue.\n' +
  '  - Introduce Sponsored Vendor Spotlights (₹25k–₹50k/launch) for enterprise SaaS discovery.\n' +
  '  - Target: ₹15 Crore Annual GMV (~₹4.5 Crore Net Revenue).\n\n' +
  '• Months 18 to 36 (Ecosystem Dominance):\n' +
  '  - Scale to 5,000+ active agency accounts generating ₹85 Crore ($10M) in deal GMV.\n' +
  '  - Become India\'s default B2B software review, benchmark, and distribution layer.',
  60, 600, { width: 475, lineGap: 4 }
);

doc.end();

writeStream.on('finish', () => {
  console.log('Market Research PDF successfully created at:', outputPath);
  try {
    fs.copyFileSync(outputPath, desktopOutputPath);
    console.log('Copied to Desktop:', desktopOutputPath);
  } catch (e) {
    console.log('Desktop copy note:', e.message);
  }
});
