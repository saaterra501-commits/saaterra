const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

// Clean standard 16:9 widescreen presentation (1280 x 720)
const doc = new PDFDocument({
  size: [1280, 720],
  margins: { top: 50, bottom: 50, left: 70, right: 70 },
  autoFirstPage: false
});

const outputPath = path.join('C:\\Users\\ujjaw\\OneDrive\\Documents\\saaterra', 'StackDeal_FirstCapital_PitchDeck.pdf');
const desktopOutputPath = path.join('C:\\Users\\ujjaw\\OneDrive\\Desktop\\saaterra', 'StackDeal_FirstCapital_PitchDeck.pdf');

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

function drawSlide(number, title, subtitle, contentBlocks) {
  doc.addPage();

  // Clean, premium white background with subtle border
  doc.rect(0, 0, 1280, 720).fill('#FFFFFF');

  // Top Accent Bar (StackDeal Brand Orange & Purple)
  doc.rect(0, 0, 1280, 8).fill('#FF6B35');

  // Header: Brand & Event
  doc.fillColor('#0F172A').fontSize(16).font('Helvetica-Bold').text('StackDeal', 70, 45);
  doc.fillColor('#64748B').fontSize(12).font('Helvetica').text('• stackdeal.in', 155, 48);

  doc.fillColor('#64748B').fontSize(11).font('Helvetica-Bold').text('FIRST CAPITAL BY INDRA DHAR', 800, 48, { width: 410, align: 'right' });

  // Divider
  doc.strokeColor('#E2E8F0').lineWidth(1).moveTo(70, 75).lineTo(1210, 75).stroke();

  // Slide Number & Title
  doc.fillColor('#FF6B35').fontSize(12).font('Helvetica-Bold').text(`SLIDE ${number} OF 10`, 70, 95);
  doc.fillColor('#0F172A').fontSize(26).font('Helvetica-Bold').text(title, 70, 115);

  if (subtitle) {
    doc.fillColor('#475569').fontSize(14).font('Helvetica').text(subtitle, 70, 150, { width: 1140 });
  }

  // Content Blocks
  let startY = subtitle ? 185 : 165;

  contentBlocks.forEach((block) => {
    if (block.type === 'box') {
      doc.roundedRect(block.x, block.y || startY, block.w, block.h, 8).fill('#F8FAFC');
      doc.rect(block.x, block.y || startY, block.w, block.h).strokeColor('#E2E8F0').lineWidth(1).stroke();

      if (block.tag) {
        doc.fillColor('#FF6B35').fontSize(11).font('Helvetica-Bold').text(block.tag.toUpperCase(), block.x + 20, (block.y || startY) + 18);
      }

      if (block.heading) {
        doc.fillColor('#0F172A').fontSize(16).font('Helvetica-Bold').text(block.heading, block.x + 20, (block.y || startY) + 38);
      }

      if (block.body) {
        doc.fillColor('#334155').fontSize(12).font('Helvetica').text(block.body, block.x + 20, (block.y || startY) + 65, {
          width: block.w - 40,
          lineGap: 6
        });
      }
    } else if (block.type === 'full') {
      doc.roundedRect(70, startY, 1140, block.h, 8).fill('#F8FAFC');
      doc.rect(70, startY, 1140, block.h).strokeColor('#E2E8F0').lineWidth(1).stroke();

      if (block.heading) {
        doc.fillColor('#0F172A').fontSize(16).font('Helvetica-Bold').text(block.heading, 95, startY + 20);
      }

      if (block.body) {
        doc.fillColor('#334155').fontSize(12.5).font('Helvetica').text(block.body, 95, startY + 50, {
          width: 1090,
          lineGap: 7
        });
      }
      startY += block.h + 20;
    }
  });

  // Footer
  doc.strokeColor('#E2E8F0').lineWidth(1).moveTo(70, 660).lineTo(1210, 660).stroke();
  doc.fillColor('#94A3B8').fontSize(10).font('Helvetica').text('StackDeal • B2B SaaS 5-Year Deal Marketplace • Confidential', 70, 675);
  doc.fillColor('#94A3B8').fontSize(10).font('Helvetica').text(`Founder: Ujjawal Tiwari (hello@stackdeal.in)`, 800, 675, { width: 410, align: 'right' });
}

// ─────────────────────────────────────────────
// SLIDE 1: 1. YOUR STARTUP
// ─────────────────────────────────────────────
drawSlide(
  1,
  '1. Your Startup',
  'What does your startup do? Who is it for? What are you building, and why is it relevant?',
  [
    {
      type: 'box',
      x: 70, y: 190, w: 550, h: 440,
      tag: 'Core Concept',
      heading: 'What is StackDeal?',
      body:
        'StackDeal (stackdeal.in) is India\'s curated B2B SaaS deal marketplace.\n\n' +
        'We connect high-utility software tools with digital marketing agencies, growth teams, and solopreneurs through exclusive 5-Year Access Passes.\n\n' +
        'Instead of paying expensive recurring monthly dollar bills, buyers pay once in INR via UPI/cards and secure 5 full years of verified software access with official 18% GST tax invoices.'
    },
    {
      type: 'box',
      x: 650, y: 190, w: 560, h: 440,
      tag: 'Relevance & Target User',
      heading: 'Who is it for and why now?',
      body:
        '• Target Buyers: 35,000+ Indian digital marketing agencies, 1.5 Crore+ freelancers, and SMB founders who suffer from SaaS subscription fatigue.\n\n' +
        '• Target Sellers: Early-stage bootstrapped SaaS founders who have built great technical products but lack marketing distribution.\n\n' +
        '• Why it is Relevant: India is experiencing a massive digitization boom, but global platforms like AppSumo ignore Indian payment realities (no UPI, no GST invoices, and 70-80% cuts from founders).'
    }
  ]
);

// ─────────────────────────────────────────────
// SLIDE 2: 2. THE PROBLEM
// ─────────────────────────────────────────────
drawSlide(
  2,
  '2. The Problem',
  'What real problem, need, or market gap are you solving? Who faces this problem, and why does it matter?',
  [
    {
      type: 'box',
      x: 70, y: 190, w: 550, h: 440,
      tag: 'Buyer Problem (Agencies)',
      heading: 'Severe Monthly Subscription Fatigue',
      body:
        '• Crushing Monthly Costs: An average boutique digital agency uses 6 to 8 software tools (WhatsApp bots, SEO trackers, lead scrapers, CRM), paying $30 to $99 every month on credit cards, even during slow business cycles.\n\n' +
        '• Zero Indian GST Credit: Foreign SaaS billing provides zero Indian GST tax compliance, causing a direct 18% tax loss for Indian agencies.\n\n' +
        '• Currency Markup Fees: Indian debit/credit cards incur 3.5% foreign transaction markup fees and conversion risks on USD payments.'
    },
    {
      type: 'box',
      x: 650, y: 190, w: 560, h: 440,
      tag: 'Seller Problem (Founders)',
      heading: 'The Distribution & Monetization Wall',
      body:
        '• Zero Distribution: Bootstrapped software developers spend months building solid products but have zero marketing budget to acquire their first 100 paying customers.\n\n' +
        '• Predatory Legacy Platforms: Global deal sites (like AppSumo) charge 70% to 80% commissions and lock founder payouts for over 60 days.\n\n' +
        '• Unsustainable Lifetime Liabilities: Traditional "Lifetime Deals" force founders into infinite server costs without clear boundaries.'
    }
  ]
);

// ─────────────────────────────────────────────
// SLIDE 3: 3. YOUR SOLUTION
// ─────────────────────────────────────────────
drawSlide(
  3,
  '3. Your Solution',
  'How does your product or service solve the problem? What value does it provide to customers?',
  [
    {
      type: 'box',
      x: 70, y: 190, w: 360, h: 440,
      tag: 'For Agency Buyers',
      heading: 'Peace of Mind & Local Tax',
      body:
        '• 5-Year Cost Predictability: Pay once in INR, use for 5 full years with zero recurring monthly bills.\n\n' +
        '• 100% Indian-Native Checkout: Instant UPI (PhonePe, GPay, Paytm), Cards, and Net Banking.\n\n' +
        '• Automated 18% GST Invoices: Instant B2B tax invoices with agency GSTIN for CA input tax write-offs.\n\n' +
        '• 60-Day Guarantee: Risk-free unconditional trial.'
    },
    {
      type: 'box',
      x: 450, y: 190, w: 360, h: 440,
      tag: 'For SaaS Founders',
      heading: 'Profitable Distribution',
      body:
        '• 70% Revenue Share: Founders keep 70% of every sale with bi-weekly direct bank transfers.\n\n' +
        '• 100+ Paying Power Users: Immediate cohort of active agency customers who provide reviews and word-of-mouth.\n\n' +
        '• 1-Click AI Listing Copilot: Automated deal copy, graphics, and landing page creation in minutes.\n\n' +
        '• Zero upfront listing fees.'
    },
    {
      type: 'box',
      x: 830, y: 190, w: 380, h: 440,
      tag: 'The 5-Year Innovation',
      heading: 'Sustainable Economics',
      body:
        '• Clear Unit Economics: 5-Year Passes eliminate the infinite server burden of traditional lifetime deals while giving buyers multi-year cost certainty.\n\n' +
        '• Natural Upsells: Growing agencies naturally expand to higher recurring tiers as their client workload increases.\n\n' +
        '• Win-Win Model: Founders get upfront growth capital, buyers save 85-92% on tools.'
    }
  ]
);

// ─────────────────────────────────────────────
// SLIDE 4: 4. YOUR PRODUCT / SERVICE
// ─────────────────────────────────────────────
drawSlide(
  4,
  '4. Your Product / Service',
  'Show us what you\'re offering and how it works. (Live at stackdeal.in)',
  [
    {
      type: 'box',
      x: 70, y: 190, w: 265, h: 260,
      tag: 'Performance',
      heading: 'Next.js 16 SSR',
      body: 'Pre-rendered server-side architecture for sub-second page loads and complete Google search indexing.'
    },
    {
      type: 'box',
      x: 360, y: 190, w: 265, h: 260,
      tag: 'Billing Engine',
      heading: 'Razorpay & GST',
      body: 'Native Indian payment gateway with automated PDF B2B tax invoice generation and GSTIN validation.'
    },
    {
      type: 'box',
      x: 650, y: 190, w: 265, h: 260,
      tag: 'AI Intelligence',
      heading: 'Groq AI Matchmaker',
      body: 'Llama-3 powered intelligent assistant that analyzes agency niche and recommends high-ROI tools instantly.'
    },
    {
      type: 'box',
      x: 940, y: 190, w: 270, h: 260,
      tag: 'Vendor Portal',
      heading: 'Operations Vault',
      body: 'Secure admin portal for deal curation, license key distribution, and automated founder payout tracking.'
    },
    {
      type: 'box',
      x: 70, y: 470, w: 1140, h: 160,
      tag: 'Live Verified Catalogue Today',
      heading: 'Active Software Categories on stackdeal.in',
      body:
        '1. WhatsApp Marketing Automation: Recover carts and broadcast via Meta Cloud API (Chat Chacha)\n' +
        '2. AI & GEO SEO Trackers: Monitor search rankings across Google, ChatGPT & Perplexity (SEO Rocket & Nuwatomic)\n' +
        '3. B2B Lead Scrapers & Data Finders: Extract verified emails and map leads for agency outreach (EmailExtractor Pro AI)'
    }
  ]
);

// ─────────────────────────────────────────────
// SLIDE 5: 5. MARKET OPPORTUNITY
// ─────────────────────────────────────────────
drawSlide(
  5,
  '5. Market Opportunity',
  'Who are your target customers? How large is the market? (SaaSBoomi, NASSCOM & IAMAI data)',
  [
    {
      type: 'box',
      x: 70, y: 190, w: 360, h: 240,
      tag: 'TAM (Total Market)',
      heading: 'Rs 1,20,000 Crore ($14.5B)',
      body: 'Total Indian domestic B2B SaaS software consumption market by 2026, growing at 28% annual CAGR toward $50B by 2030 (SaaSBoomi Report).'
    },
    {
      type: 'box',
      x: 450, y: 190, w: 360, h: 240,
      tag: 'SAM (Serviceable Market)',
      heading: 'Rs 8,500 Crore ($1.0B)',
      body: 'Annual software expenditure by 35,000+ Indian digital agencies and 1.5 Crore+ freelancers & tech solopreneurs.'
    },
    {
      type: 'box',
      x: 830, y: 190, w: 380, h: 240,
      tag: 'SOM (3-Year Target)',
      heading: 'Rs 85 Crore ($10M GMV)',
      body: 'Targeting 5,000 active digital agencies purchasing an average of 3 to 4 SaaS passes annually on StackDeal.'
    },
    {
      type: 'box',
      x: 70, y: 450, w: 550, h: 180,
      tag: 'Buyer Segment A',
      heading: '35,000+ Digital Marketing Agencies',
      body:
        '• 94% are boutique agencies with 2 to 20 team members (IAMAI Census).\n' +
        '• Average agency spends Rs 2.5 Lakh to Rs 4 Lakh annually on software tools.'
    },
    {
      type: 'box',
      x: 650, y: 450, w: 560, h: 180,
      tag: 'Buyer Segment B',
      heading: '1.5 Crore+ Tech Freelancers & Solopreneurs',
      body:
        '• India is the #2 freelancer workforce globally (NASSCOM data).\n' +
        '• High intent to buy productivity and automation tools via instant Indian UPI.'
    }
  ]
);

// ─────────────────────────────────────────────
// SLIDE 6: 6. BUSINESS MODEL
// ─────────────────────────────────────────────
drawSlide(
  6,
  '6. Business Model',
  'How does your business create, deliver, and capture value? (Commercial mechanics)',
  [
    {
      type: 'box',
      x: 70, y: 190, w: 550, h: 440,
      tag: 'Core Revenue Engine',
      heading: '30% Marketplace Commission',
      body:
        '• Transparent Take-Rate: StackDeal retains 30% on every 5-Year Pass transaction; 70% is transferred directly to the SaaS founder.\n\n' +
        '• Real Unit Economics Example:\n' +
        '  - Retail Deal Price: Rs 2,499 (Buyer pays once for 5 years)\n' +
        '  - Founder Payout: Rs 1,749 (70% direct transfer)\n' +
        '  - StackDeal Gross Margin: Rs 750 (30% take-rate)\n\n' +
        '• Zero Inventory Holding Costs: 100% digital software fulfillment via automated license keys with pure software gross margins.'
    },
    {
      type: 'box',
      x: 650, y: 190, w: 560, h: 440,
      tag: 'Value Delivery Flow',
      heading: 'How Value is Created & Delivered',
      body:
        '1. Curation & QA: We test and verify early-stage B2B software for uptime, utility, and agency relevance.\n\n' +
        '2. Local Distribution: We package the deal with Indian payment options (UPI/Cards) and automated GST tax invoicing.\n\n' +
        '3. Instant Fulfillment: Buyer receives instant software license access, while the vendor acquires an active paying customer with zero marketing spend.\n\n' +
        '4. Bi-Weekly Settlements: Automated payouts deposited directly to the vendor\'s verified bank account.'
    }
  ]
);

// ─────────────────────────────────────────────
// SLIDE 7: 7. REVENUE STRATEGY
// ─────────────────────────────────────────────
drawSlide(
  7,
  '7. Revenue Strategy',
  'How does your startup make money today — or plan to make money in the future? (Revenue streams)',
  [
    {
      type: 'box',
      x: 70, y: 190, w: 360, h: 440,
      tag: 'Stream 1 (Active Today)',
      heading: 'Deal Commission Take-Rate',
      body:
        '• 30% take-rate on every 5-Year Pass sold through the marketplace.\n\n' +
        '• Zero cost of goods sold (COGS); revenue scales directly with transaction volume.\n\n' +
        '• Target: 500 sales/month @ Rs 2,500 avg ticket = Rs 3.75 Lakhs net monthly revenue.'
    },
    {
      type: 'box',
      x: 450, y: 190, w: 360, h: 440,
      tag: 'Stream 2 (Q4 Roadmap)',
      heading: 'StackDeal Plus Membership',
      body:
        '• Annual VIP Subscription: Rs 2,999/year for high-frequency agency buyers.\n\n' +
        '• Member Benefits: Extra 10% discount on all deals, 24-hour early access VIP drops, and priority support.\n\n' +
        '• 100% pure recurring annual SaaS revenue for StackDeal.'
    },
    {
      type: 'box',
      x: 830, y: 190, w: 380, h: 440,
      tag: 'Stream 3 (Expansion)',
      heading: 'Sponsored Vendor Spotlights',
      body:
        '• Featured Homepage Banners: Established SaaS vendors pay Rs 25,000 to Rs 50,000 per launch campaign for premium hero slider placement.\n\n' +
        '• Dedicated Outbound Blasts: Sponsored newsletter broadcasts to our verified Indian agency database.'
    }
  ]
);

// ─────────────────────────────────────────────
// SLIDE 8: 8. COMPETITIVE ADVANTAGE
// ─────────────────────────────────────────────
drawSlide(
  8,
  '8. Competitive Advantage',
  'Who are your competitors or alternatives? What makes your startup different, and why would customers choose you?',
  [
    {
      type: 'box',
      x: 70, y: 190, w: 550, h: 440,
      tag: 'Competitor Landscape',
      heading: 'Global & Legacy Alternatives',
      body:
        '• AppSumo (US Market Leader - $80M+ GMV):\n' +
        '  - Requires USD credit cards with expensive foreign exchange markups.\n' +
        '  - Zero Indian GST tax invoice compliance.\n' +
        '  - Takes 70% to 80% cuts from founders and holds payouts for 60+ days.\n\n' +
        '• Monthly SaaS Subscriptions (Direct Tools):\n' +
        '  - High recurring churn and subscription fatigue during slow client months.\n\n' +
        '• PitchGround / DealMirror:\n' +
        '  - Outdated UX, limited Indian payment methods, and inconsistent support.'
    },
    {
      type: 'box',
      x: 650, y: 190, w: 560, h: 440,
      tag: 'Our Unfair Advantages',
      heading: 'Why StackDeal Wins in India',
      body:
        '1. Indian-Native Checkout & Tax: Instant UPI (PhonePe/GPay) + automated 18% GST B2B tax invoices with GSTIN.\n\n' +
        '2. Founder-Friendly Economics: Fair 70% payout with bi-weekly settlements.\n\n' +
        '3. Sustainable 5-Year Pass Model: Eliminates infinite server liability while giving agencies multi-year cost certainty.\n\n' +
        '4. Built-in AI Matchmaker: Proprietary Groq-powered AI copilot recommending customized software stacks based on agency niche.'
    }
  ]
);

// ─────────────────────────────────────────────
// SLIDE 9: 9. YOUR TEAM
// ─────────────────────────────────────────────
drawSlide(
  9,
  '9. Your Team',
  'Who is behind the startup? Introduce the founders, their roles, and the skills or experience they bring.',
  [
    {
      type: 'box',
      x: 70, y: 190, w: 550, h: 440,
      tag: 'Founder & Full-Stack Builder',
      heading: 'Ujjawal Tiwari',
      body:
        '• Role: Founder & Full-Stack Product Architect.\n\n' +
        '• Technical Execution: Engineered the entire StackDeal platform architecture from scratch using Next.js 16, TypeScript, MongoDB, Razorpay API, and Groq AI.\n\n' +
        '• Speed & Problem Solving: Solved complex technical SEO crawl indexing challenges, launched on Product Hunt, and deployed production-grade infrastructure with zero external burn.\n\n' +
        '• Vision & Commitment: Dedicated to empowering Indian bootstrapped developers and solving software distribution for digital agencies.'
    },
    {
      type: 'box',
      x: 650, y: 190, w: 560, h: 440,
      tag: 'Execution Philosophy',
      heading: 'Lean, Fast & Capital Efficient',
      body:
        '• Hyper-Lean Operations: Zero bloated corporate overheads; every rupee is deployed directly into product performance and customer acquisition.\n\n' +
        '• High Velocity Shipping: Daily shipping cadence driven by live user feedback, technical monitoring, and fast feature deployment.\n\n' +
        '• Community-First Growth: Leveraging Product Hunt, LinkedIn founder networks, and direct agency partnerships for organic distribution.'
    }
  ]
);

// ─────────────────────────────────────────────
// SLIDE 10: 10. FUTURE VISION
// ─────────────────────────────────────────────
drawSlide(
  10,
  '10. Future Vision',
  'Where are you taking this business? Share your growth plans, key milestones, and what you aim to achieve.',
  [
    {
      type: 'box',
      x: 70, y: 190, w: 550, h: 440,
      tag: 'Stage 1 • Next 6 to 12 Months',
      heading: 'Curation & Agency Distribution',
      body:
        '• Curate 50+ Verified SaaS Tools across Marketing, Sales, SEO, and Productivity.\n\n' +
        '• Onboard 2,000+ Active Agency Accounts across Tier-1 and Tier-2 Indian business hubs.\n\n' +
        '• Launch StackDeal Plus VIP Membership for high-frequency agency buyers.\n\n' +
        '• Deployment of First Capital (Rs 1 Lakh):\n' +
        '  - 40% (Rs 40k): Vendor onboarding & launch incentives\n' +
        '  - 35% (Rs 35k): Targeted agency community growth\n' +
        '  - 25% (Rs 25k): Server infra & AI Matchmaker scaling'
    },
    {
      type: 'box',
      x: 650, y: 190, w: 560, h: 440,
      tag: 'Stage 2 • Long-Term Vision (2 to 3 Years)',
      heading: 'India\'s Default Software Ecosystem',
      body:
        '• Scale to Rs 15+ Crore ($2M+) in Annual Gross Merchandise Value (GMV).\n\n' +
        '• Expand into a comprehensive B2B software discovery, verification, and review platform for 100,000+ Indian businesses.\n\n' +
        '• Direct Economic Impact: Helping 100+ Indian bootstrapped software creators earn their first Rs 10 Lakh to Rs 50 Lakh in profitable, sustainable revenue.'
    }
  ]
);

doc.end();

writeStream.on('finish', () => {
  console.log('Simple 10-Slide PDF successfully generated at:', outputPath);
  try {
    fs.copyFileSync(outputPath, desktopOutputPath);
    console.log('Copied to Desktop:', desktopOutputPath);
  } catch (e) {
    console.log('Desktop copy note:', e.message);
  }
});
