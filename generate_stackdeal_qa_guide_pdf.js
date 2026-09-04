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
  console.log(`[PDFKit Event] Q&A Page ${actualPagesCreated} added`);
});

// Output paths
const docFolderOutput = path.join('C:\\Users\\ujjaw\\OneDrive\\Documents\\saaterra', 'StackDeal_Official_Master_QA_Guide.pdf');
const desktopSaaterraOutput = path.join('C:\\Users\\ujjaw\\OneDrive\\Desktop\\saaterra', 'StackDeal_Official_Master_QA_Guide.pdf');
const desktopRootOutput = path.join('C:\\Users\\ujjaw\\OneDrive\\Desktop', 'StackDeal_Official_Master_QA_Guide.pdf');

const writeStream = fs.createWriteStream(desktopSaaterraOutput);
doc.pipe(writeStream);

let pageNum = 0;
const totalPages = 6;

// Helper: Standard Document Page Frame
function newDocPage(categoryTag, isCover = false) {
  doc.addPage();
  pageNum++;

  // Top Orange Stripe Accent
  doc.rect(0, 0, 595.28, 5).fill('#FF6B35');

  // Top Running Header
  doc.fillColor('#FF6B35').fontSize(10.5).font('Helvetica-Bold').text('StackDeal', 45, 18);
  doc.fillColor('#64748B').fontSize(8).font('Helvetica').text('• stackdeal.in', 105, 20);
  doc.fillColor('#64748B').fontSize(8).font('Helvetica-Bold').text((categoryTag || 'Official Master Q&A Guide').toUpperCase(), 230, 20, { width: 320, align: 'right' });

  // Header Divider
  doc.strokeColor('#E2E8F0').lineWidth(0.8).moveTo(45, 34).lineTo(550, 34).stroke();

  // Bottom Running Footer
  doc.strokeColor('#E2E8F0').lineWidth(0.8).moveTo(45, 804).lineTo(550, 804).stroke();
  doc.fillColor('#94A3B8').fontSize(7.5).font('Helvetica').text('StackDeal — Official Master Q&A Knowledge Base • Founder: Ujjawal Tiwari (19-Year-Old Solo Builder)', 45, 812);
  doc.fillColor('#64748B').fontSize(8).font('Helvetica-Bold').text(`Page ${pageNum} of ${totalPages}`, 470, 812, { width: 80, align: 'right' });
}

// Helper: Section Title Block
function drawPageHeader(sectionTag, title, subtitle) {
  doc.fillColor('#FF6B35').fontSize(8.5).font('Helvetica-Bold').text(sectionTag.toUpperCase(), 45, 44);
  doc.fillColor('#0F172A').fontSize(17).font('Helvetica-Bold').text(title, 45, 57);
  if (subtitle) {
    doc.fillColor('#64748B').fontSize(8.5).font('Helvetica').text(subtitle, 45, 78, { width: 505 });
  }
  doc.strokeColor('#CBD5E1').lineWidth(0.8).moveTo(45, 94).lineTo(550, 94).stroke();
}

// Helper: Q&A Question Card Box
function drawQACard(x, y, w, h, qNumber, questionText, answerText, targetAudienceTag = 'BUYER FAQ', tagBg = '#EFF6FF', tagColor = '#1E40AF') {
  doc.roundedRect(x, y, w, h, 6).fill('#FFFFFF');
  doc.roundedRect(x, y, w, h, 6).strokeColor('#E2E8F0').lineWidth(1).stroke();

  // Left accent line
  doc.roundedRect(x, y, 4, h, 2).fill('#FF6B35');

  // Category Tag Pill
  doc.roundedRect(x + 14, y + 8, 85, 14, 3).fill(tagBg);
  doc.fillColor(tagColor).fontSize(7).font('Helvetica-Bold').text(targetAudienceTag.toUpperCase(), x + 14, y + 11, { width: 85, align: 'center' });

  // Question Number & Text
  doc.fillColor('#FF6B35').fontSize(9.5).font('Helvetica-Bold').text(`Q${qNumber}:`, x + 106, y + 10);
  doc.fillColor('#0F172A').fontSize(9.5).font('Helvetica-Bold').text(questionText, x + 130, y + 10, { width: w - 142 });

  // Divider
  doc.strokeColor('#F1F5F9').lineWidth(0.6).moveTo(x + 14, y + 28).lineTo(x + w - 14, y + 28).stroke();

  // Answer Text
  doc.fillColor('#334155').fontSize(8).font('Helvetica').text(answerText, x + 14, y + 34, {
    width: w - 28,
    lineGap: 2.2
  });
}

// =========================================================================
// PAGE 1: COVER & CATEGORY 1 (BUYER ESSENTIALS - PART 1)
// =========================================================================
newDocPage('Buyer Essentials • Part 1', true);

// Header Banner
doc.fillColor('#FF6B35').fontSize(10).font('Helvetica-Bold').text('OFFICIAL KNOWLEDGE BASE & FREQUENTLY ASKED QUESTIONS', 45, 46);
doc.fillColor('#0F172A').fontSize(22).font('Helvetica-Bold').text('StackDeal: Master Q&A Compendium', 45, 62);
doc.fillColor('#475569').fontSize(10.5).font('Helvetica').text("Everything you need to know about India's Curated B2B SaaS 5-Year Deal Marketplace", 45, 90);

doc.strokeColor('#E2E8F0').lineWidth(1).moveTo(45, 108).lineTo(550, 108).stroke();

// Founder Profile Snippet Card
doc.roundedRect(45, 116, 505, 64, 6).fill('#0F172A');
doc.fillColor('#FF6B35').fontSize(8.5).font('Helvetica-Bold').text('FOUNDED BY UJJAWAL TIWARI • 19-YEAR-OLD SOLO BUILDER', 58, 126);
doc.fillColor('#FFFFFF').fontSize(11).font('Helvetica-Bold').text('Why We Published This Master Q&A Guide', 58, 138);
doc.fillColor('#94A3B8').fontSize(7.8).font('Helvetica').text(
  'StackDeal was built to end the predatory dollar subscription fatigue in India. This compendium provides transparent, verifiable answers for software buyers, digital marketing agencies, bootstrapped SaaS creators, and investors regarding our 5-Year Pass model, 70% rev-share, automated 18% GST invoices, and technical DRM architecture.',
  58, 153, { width: 478, lineGap: 1.8 }
);

// Q1
drawQACard(
  45, 190, 505, 130,
  1,
  'What exactly is StackDeal and how is it different from normal SaaS pricing?',
  '• StackDeal (https://www.stackdeal.in) is India\'s curated B2B SaaS deal marketplace.\n' +
  '• Instead of charging recurring monthly subscription fees in US Dollars ($49 to $199/month), StackDeal negotiates directly with vetted software creators to package tools into exclusive 5-Year Access Passes.\n' +
  '• Buyers pay a single, transparent one-time price in Indian Rupees (₹1,499 to ₹9,999) and secure uninterrupted access for 5 full years. There are zero auto-debit traps, zero recurring card fees, and zero hidden price hikes.',
  'BUYER FAQ', '#EFF6FF', '#1E40AF'
);

// Q2
drawQACard(
  45, 330, 505, 135,
  2,
  'Why does StackDeal offer "5-Year Passes" instead of "Lifetime Deals (LTD)"?',
  '• Real-World Sustainability: True "Lifetime Deals" (LTDs) often force software startups into bankruptcy after 12-18 months because server hosting, OpenAI/Claude API tokens, and engineering support cost real money every month.\n' +
  '• Healthy 5-Year Horizon: 5 years represents an eternity in modern software and digital agency lifecycles. By capping passes at 5 years, vendors stay financially solvent and committed to continuous feature updates.\n' +
  '• Maximum ROI for Agencies: A 5-Year Pass delivers over 92% to 97% savings compared to standard monthly subscriptions, giving Indian agencies certainty of cost without the risk of tool abandonment.',
  'BUYER FAQ', '#EFF6FF', '#1E40AF'
);

// Q3
drawQACard(
  45, 475, 505, 135,
  3,
  'What payment methods are supported? Can I pay via UPI without an international card?',
  '• 100% Native Indian Payment Rails: StackDeal is powered by Razorpay and supports all major domestic payment systems.\n' +
  '• One-Click UPI: Instant payment via Google Pay, PhonePe, Paytm, BHIM, and any UPI QR scanner.\n' +
  '• Domestic Cards & NetBanking: All Indian RuPay, Visa, and MasterCard debit and credit cards, as well as net banking across 50+ Indian banks.\n' +
  '• Zero Foreign Exchange Markups: You never pay the 3.5% forex conversion fee or international transaction surcharges that foreign platforms like AppSumo or Stripe checkout impose.',
  'PAYMENTS FAQ', '#F0FDF4', '#166534'
);

// Q4
drawQACard(
  45, 620, 505, 135,
  4,
  'What happens after I make a purchase? How do I get my license key?',
  '• Instant Automated Fulfillment: The millisecond your UPI or card payment succeeds, StackDeal\'s automated webhook engine generates your unique license key.\n' +
  '• Unified License Vault: The license key appears immediately on your screen, is saved permanently inside your StackDeal dashboard ("My Deals"), and is emailed to your registered address.\n' +
  '• Direct Vendor Redemption: Each deal comes with a dedicated, step-by-step activation guide and direct redemption URL on the vendor\'s official software portal. You own direct access to the software.',
  'BUYER FAQ', '#EFF6FF', '#1E40AF'
);


// =========================================================================
// PAGE 2: CATEGORY 1 (BUYER ESSENTIALS - PART 2: TAX, REFUNDS & REDEMPTION)
// =========================================================================
newDocPage('Buyer Essentials • Part 2');
drawPageHeader('CATEGORY 1 (CONTINUED)', 'Buyer Essentials: GST Invoicing, Refunds & Upgrades', 'Addressing taxes, refund policies, stacking options, and customer support.');

// Q5
drawQACard(
  45, 108, 505, 130,
  5,
  'Can I get an official 18% GST B2B tax invoice to claim Input Tax Credit (ITC)?',
  '• Yes, 100% Automated GST Invoicing: During checkout, registered Indian businesses can enter their company name and GSTIN.\n' +
  '• Compliant Tax Invoices: StackDeal automatically generates a formal B2B tax invoice featuring your GSTIN, official SAC code 998313 (IT Software Services), and broken-down 18% GST (CGST/SGST or IGST).\n' +
  '• Direct Expense Write-Off: Because the invoice is fully GST-compliant, Indian businesses can claim 100% of the GST paid as Input Tax Credit (ITC) on their monthly GSTR-3B filings, lowering their effective software cost even further.',
  'TAX & GST FAQ', '#FAF5FF', '#6B21A8'
);

// Q6
drawQACard(
  45, 248, 505, 135,
  6,
  'How does the 60-Day Money-Back Guarantee work? What if a tool doesn\'t fit my workflow?',
  '• 60-Day Unconditional Shield: Every single product purchased on StackDeal is backed by our strict 60-Day Money-Back Guarantee.\n' +
  '• Zero Questions Asked: If you test a tool within 60 days of purchase and find that it doesn\'t integrate with your agency\'s processes, simply click "Request Refund" inside your dashboard or email support@stackdeal.in.\n' +
  '• Buyer Protection Escrow: StackDeal holds vendor payout reserves during the refund window, ensuring that refund requests are processed back to your original UPI account or bank within 3 to 5 business days without hassle.',
  'REFUND POLICY', '#FEF2F2', '#991B1B'
);

// Q7
drawQACard(
  45, 393, 505, 135,
  7,
  'Are software updates and new features included during the 5-Year Pass?',
  '• Continuous Feature Releases: Yes. 5-Year Passes entitle you to all core product improvements, bug fixes, and feature releases made to the tier you purchased during the entire 5-year window.\n' +
  '• Direct Platform Access: You are not running an outdated script or isolated sandbox. You access the live, production software directly on the vendor\'s official infrastructure.\n' +
  '• Transparent Version Roadmaps: In our vendor vetting process, we explicitly require founders to provide 5-year roadmap visibility before approving their product onto StackDeal.',
  'BUYER FAQ', '#EFF6FF', '#1E40AF'
);

// Q8
drawQACard(
  45, 538, 505, 135,
  8,
  'Can I stack multiple codes to get higher usage limits or add team members?',
  '• Code Stacking Architecture: Most tools featured on StackDeal support "Code Stacking". Buying 1 pass unlocks standard tier usage; buying a 2nd or 3rd pass multiplies account seats, daily API limits, or lead scraper credits.\n' +
  '• White-Label & Agency Rights: Select deals offer specialized "Agency Tier" passes that allow you to rebrand the client portal with your agency\'s custom domain, logo, and color palette.\n' +
  '• Check Deal Specifications: Each product page on stackdeal.in clearly lists the exact stacking matrix and limits before you complete your purchase.',
  'BUYER FAQ', '#EFF6FF', '#1E40AF'
);


// =========================================================================
// PAGE 3: CATEGORY 2 (SAAS VENDORS & CREATORS)
// =========================================================================
newDocPage('Vendor & Creator Engine');
drawPageHeader('CATEGORY 2 OF 5', 'SaaS Vendors & Creators: Revenue Share, Payouts & Reach', 'How bootstrapped developers monetize in India without paying ad costs or high platform cuts.');

// Q9
drawQACard(
  45, 108, 505, 130,
  9,
  'Why should a SaaS founder list on StackDeal instead of AppSumo or SaaSMantra?',
  '• 70% Revenue Share to Creators: Traditional platforms like AppSumo take up to 70% of gross revenue, leaving developers with a tiny 30% cut. StackDeal flips this model by giving 70% of gross sales directly to the creator.\n' +
  '• Dedicated Indian Agency Distribution: AppSumo focuses on the US/Europe and ignores India\'s 1.5M digital agencies. StackDeal is the undisputed #1 curated launchpad for the Indian B2B tech market.\n' +
  '• Zero Forex Friction & INR Checkout: Indian buyers drop off on USD platforms due to card mandate failures. StackDeal converts high intent with native UPI, maximizing vendor sales volume.',
  'VENDOR FAQ', '#F0FDF4', '#166534'
);

// Q10
drawQACard(
  45, 248, 505, 135,
  10,
  'How much upfront capital can a SaaS founder generate from a single StackDeal launch?',
  '• Immediate Non-Dilutive Liquidity: A single featured 30-day deal on StackDeal selling 100 units of a ₹4,999 pass generates ₹4,99,900 gross, paying ₹3,50,000 directly to the founder.\n' +
  '• Scaling to 300 Sales: Selling 300 units yields ₹10,50,000 in immediate cash flow. This upfront injection allows bootstrapped indie hackers to pay server hosting bills, hire engineers, and scale without giving up equity.\n' +
  '• Zero Ad Spend (CAC = ₹0): You acquire hundreds of paying, verified business accounts without spending a single rupee on Meta or Google Ads.',
  'VENDOR FAQ', '#F0FDF4', '#166534'
);

// Q11
drawQACard(
  45, 393, 505, 135,
  11,
  'Are there any upfront listing fees or hidden charges to launch a product?',
  '• 100% Free Listing: There are zero upfront listing fees, zero onboarding charges, and zero hidden maintenance fees to launch on StackDeal.\n' +
  '• Pure Performance Partnership: StackDeal only earns its 30% platform share when we successfully sell passes for your software. If we don\'t make sales, you pay absolutely nothing.\n' +
  '• Complimentary Marketing Support: Our team helps write high-converting sales copy, designs promotional launch graphics, and distributes the deal across Indian agency WhatsApp groups and email lists for free.',
  'VENDOR FAQ', '#F0FDF4', '#166534'
);

// Q12
drawQACard(
  45, 538, 505, 135,
  12,
  'How and when do vendors receive their payouts? What currency is used?',
  '• Direct Bank Wire / NEFT: For Indian developers, payouts are transferred directly in INR into their registered Indian current or savings bank account.\n' +
  '• International Founders Welcome: For overseas SaaS creators, payouts are remitted via Wise or international wire in USD, EUR, or GBP.\n' +
  '• Payout Schedule & Escrow: Payouts are reconciled bi-weekly following the 60-day customer satisfaction window, ensuring accurate reconciliation against any refunded orders.',
  'VENDOR FAQ', '#F0FDF4', '#166534'
);


// =========================================================================
// PAGE 4: CATEGORY 3 (FOUNDER STORY, BUSINESS MODEL & UNIT ECONOMICS)
// =========================================================================
newDocPage('Founder Story & Unit Economics');
drawPageHeader('CATEGORY 3 OF 5', 'Founder Story, Business Model & Unit Economics', 'The vision of Ujjawal Tiwari (19-year-old solo builder), market moats, and financial models.');

// Q13
drawQACard(
  45, 108, 505, 135,
  13,
  'Who is the founder of StackDeal, and what inspired the creation of the platform?',
  '• Ujjawal Tiwari — Solo Founder & Full-Stack Architect: Ujjawal is a 19-year-old software engineer and product builder from India who single-handedly developed and launched StackDeal.\n' +
  '• The Inspiration: Ujjawal observed that millions of talented Indian marketing agencies, freelancers, and small business owners were locked out of essential software tools because global SaaS products priced in USD ($50-$200/mo) and Indian credit cards failed under RBI e-mandate rules.\n' +
  '• The Mission: To build India\'s dedicated SaaS deal marketplace, democratizing enterprise tools for 10 Lakh+ Indian businesses while giving bootstrapped creators a sustainable monetization engine.',
  'FOUNDER FAQ', '#0F172A', '#FF6B35'
);

// Q14
drawQACard(
  45, 253, 505, 135,
  14,
  'What is StackDeal\'s business model and how does the company make money?',
  '• Transparent Commission Model: StackDeal operates on a performance-based 70/30 revenue split on all 5-Year Pass sales. 70% goes directly to the software creator, and 30% is retained by StackDeal.\n' +
  '• High Operating Margins: Because StackDeal is built on serverless, edge-cached Next.js 16 architecture, platform hosting and operational overhead remain under 5% of GMV, yielding an 80%+ net operating profit on platform commissions.\n' +
  '• Secondary Monetization: Future expansion includes premium placement sponsorships, white-label agency bundles, and enterprise team seat upgrades.',
  'INVESTOR FAQ', '#FFFBEB', '#B45309'
);

// Q15
drawQACard(
  45, 398, 505, 135,
  15,
  'What is the Total Addressable Market (TAM) for StackDeal in India?',
  '• 63 Million Indian MSMEs: India is undergoing a massive digital transformation, with the domestic B2B SaaS market projected to exceed $50 Billion (₹4,15,000 Crore) by 2030.\n' +
  '• SAM (Serviceable Addressable Market): 1.5 Million+ active digital marketing agencies, SEO consultancies, software development studios, and freelance marketing teams that require at least 5-10 core SaaS tools.\n' +
  '• SOM (Serviceable Obtainable Market): Capturing just 50,000 active agency accounts purchasing an average of 3 software passes annually represents a ₹45 Crore ($5.4M) Annual GMV opportunity.',
  'INVESTOR FAQ', '#FFFBEB', '#B45309'
);

// Q16
drawQACard(
  45, 543, 505, 135,
  16,
  'What is StackDeal\'s competitive moat against foreign giants like AppSumo?',
  '• Localized Payment Infrastructure: AppSumo cannot process domestic UPI QR payments (PhonePe, GPay) and has high failure rates with Indian cards. StackDeal has zero payment friction.\n' +
  '• Official 18% GST B2B Invoices: Foreign platforms cannot provide Indian GST ITC invoices, depriving Indian agencies of legal tax write-offs. StackDeal generates compliant GSTIN invoices automatically.\n' +
  '• Creator Economics: AppSumo\'s 70% commission alienates indie creators. StackDeal\'s 70% vendor-first payout attracts the best emerging software founders.',
  'MOAT & STRATEGY', '#FAF5FF', '#6B21A8'
);


// =========================================================================
// PAGE 5: CATEGORY 4 (TECHNOLOGY ARCHITECTURE, GROQ AI & DRM)
// =========================================================================
newDocPage('Technology Architecture & DRM');
drawPageHeader('CATEGORY 4 OF 5', 'Technology Architecture, Groq AI Engine & Security', 'Modern Next.js 16 stack, edge infrastructure, and anti-piracy DRM key management.');

// Q17
drawQACard(
  45, 108, 505, 135,
  17,
  'What technology stack powers StackDeal, and why was it chosen?',
  '• Next.js 16 (App Router) & React 19: Built with React Server Components (RSC) to achieve sub-second page loads, zero client-side hydration lag, and 100/100 Core Web Vitals on mobile.\n' +
  '• MongoDB Atlas with Connection Pooling: High-throughput document store handling user profiles, deal inventories, encrypted license keys, and transaction logs with sub-50ms query response times.\n' +
  '• Razorpay Payment Gateway Webhooks: Idempotent webhook architecture that guarantees orders are fulfilled and licenses dispatched within 200ms of successful UPI debit.',
  'TECH FAQ', '#EFF6FF', '#1E40AF'
);

// Q18
drawQACard(
  45, 253, 505, 135,
  18,
  'How does the Groq AI Matchmaker work and how does it assist software buyers?',
  '• Powered by Groq LPU & Llama 3.3 70B: The AI Matchmaker utilizes Groq\'s ultra-low latency LPU hardware to deliver real-time inference speeds exceeding 300 tokens per second.\n' +
  '• Intelligent Stack Recommendations: Instead of manually searching through dozens of tools, agency owners answer 3 quick questions about their niche, team size, and monthly budget.\n' +
  '• Custom Agency Blueprint: In under 3 seconds, the AI outputs a personalized 3-tool software stack, calculating exact 5-year savings and operational ROI for the agency\'s specific workflow.',
  'TECH FAQ', '#EFF6FF', '#1E40AF'
);

// Q19
drawQACard(
  45, 398, 505, 135,
  19,
  'How does StackDeal prevent software piracy, key sharing, and unauthorized access?',
  '• Cryptographically Secure License Keys: License keys are generated using cryptographically secure pseudo-random algorithms and tied directly to the buyer\'s authenticated account ID.\n' +
  '• Webhook Handshake Verification: StackDeal signs all fulfillment payloads with HMAC SHA-256 signatures, allowing vendor servers to verify license authenticity before granting account permissions.\n' +
  '• Automated Refund Revocation: If an order is refunded within 60 days, StackDeal immediately fires an automated revocation webhook to the vendor\'s API, deactivating the software license instantly.',
  'SECURITY & DRM', '#FEF2F2', '#991B1B'
);

// Q20
drawQACard(
  45, 543, 505, 135,
  20,
  'How does StackDeal vet software products before approving them onto the platform?',
  '• Strict 4-Stage Vetting Process: StackDeal rejects over 90% of submitted tools to maintain exceptional platform quality.\n' +
  '• Stage 1 — Code & Infrastructure Audit: Verification that the application is built on modern architecture with active hosting and SSL.\n' +
  '• Stage 2 — Founder Background & Roadmap: Background check on the software creator and their 5-year technical commitment.\n' +
  '• Stage 3 — Feature & Security Testing: Rigorous test of all advertising claims, export capabilities, and data privacy policies.\n' +
  '• Stage 4 — Escrow Agreement: Formal sign-off on 60-day buyer refund protection and customer support SLA.',
  'CURATION FAQ', '#F0FDF4', '#166534'
);


// =========================================================================
// PAGE 6: CATEGORY 5 (COMPLIANCE, ROADMAP & FOUNDER CONTACT)
// =========================================================================
newDocPage('Compliance, Roadmap & Contact');
drawPageHeader('CATEGORY 5 OF 5', 'Compliance, Growth Roadmap & Founder Contact', 'Legal framework, long-term ecosystem expansion, and direct contact channels.');

// Q21
drawQACard(
  45, 108, 505, 130,
  21,
  'Is StackDeal legally registered and compliant with Indian business tax laws?',
  '• 100% Indian Regulatory Compliance: StackDeal operates under Indian commercial and tax regulations.\n' +
  '• Official SAC Code 998313: All transactions are classified under Service Accounting Code 998313 (Information Technology Software Services), ensuring uniform 18% GST invoicing.\n' +
  '• RBI Domestic Payment Directives: All payments flow exclusively through RBI-authorized payment aggregators (Razorpay), ensuring 100% compliance with domestic banking guidelines.\n' +
  '• Strict Data Privacy: Buyer payment details are tokenized by the payment gateway; StackDeal never stores raw credit card numbers or UPI PINs.',
  'LEGAL & TAX FAQ', '#FAF5FF', '#6B21A8'
);

// Q22
drawQACard(
  45, 248, 505, 135,
  22,
  'What is the 3-Year Strategic Growth Roadmap for StackDeal?',
  '• 2026 (Phase 1 - Market Anchor): Curate first 50 verified B2B SaaS tools, onboard 2,500 active Indian digital agencies, and achieve ₹1.5 Crore in platform GMV with zero cash-burn.\n' +
  '• 2027 (Phase 2 - Agency Ecosystem): Launch Agency Workspaces (multi-user team permissions), White-Label Deal Bundles, and an automated self-serve vendor analytics dashboard, scaling to ₹12 Cr GMV.\n' +
  '• 2028 (Phase 3 - Pan-Asia Expansion): Launch StackDeal Ventures (pre-seed grants for top indie builders) and expand localized currency passes to Southeast Asia and MENA markets.',
  'ROADMAP FAQ', '#EFF6FF', '#1E40AF'
);

// Q23
drawQACard(
  45, 393, 505, 135,
  23,
  'How can software founders submit their SaaS to be featured on StackDeal?',
  '• Fast 5-Minute Application: Founders can visit https://www.stackdeal.in/submit and provide their product demo link, pricing history, and target customer profile.\n' +
  '• 48-Hour Review Response: Our curation team audits every submission and responds with technical feedback and launch scheduling within 48 hours.\n' +
  '• White-Glove Launch Support: Once accepted, we handle copywriting, media asset production, and email marketing at zero upfront cost.',
  'SUBMISSION FAQ', '#F0FDF4', '#166534'
);

// Direct Founder Contact Box
doc.roundedRect(45, 540, 505, 140, 8).fill('#0F172A');
doc.roundedRect(45, 540, 505, 140, 8).strokeColor('#334155').lineWidth(1).stroke();

doc.fillColor('#FF6B35').fontSize(10).font('Helvetica-Bold').text('CONNECT WITH STACKDEAL FOUNDER & LEADERSHIP', 60, 554);
doc.fillColor('#FFFFFF').fontSize(15).font('Helvetica-Bold').text('Have More Questions? We Are 100% Transparent.', 60, 569);

doc.fillColor('#94A3B8').fontSize(8.5).font('Helvetica').text(
  '• Official Platform: https://www.stackdeal.in\n' +
  '• Founder: Ujjawal Tiwari (Solo Founder & Full-Stack Developer)\n' +
  '• Support Email: support@stackdeal.in  |  Founders Email: founders@stackdeal.in\n' +
  '• For Software Creators: https://www.stackdeal.in/submit\n' +
  '• For Investors & Accelerators: Open for strategic non-dilutive grants, mentor syndicates, and agency partnerships.\n' +
  '• Built with relentless dedication in India • Dedicated to empowering the next generation of builders.',
  60, 592, { width: 475, lineGap: 3 }
);

// End Document
doc.end();

writeStream.on('finish', () => {
  console.log('Master Q&A PDF successfully created at:', desktopSaaterraOutput);

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
