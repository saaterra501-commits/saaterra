import sys
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()

    # Custom Color Tokens
    PRIMARY = colors.HexColor("#2475FF")    # Electric Royal Blue
    SECONDARY = colors.HexColor("#080512")  # Midnight Dark Navy
    ACCENT = colors.HexColor("#FFB800")     # SaaTerra Gold
    EMERALD = colors.HexColor("#00B058")    # Emerald Green
    URGENCY = colors.HexColor("#FF3B30")    # Urgency Red
    LIGHT_BG = colors.HexColor("#F8F9FA")   # Sand Light Gray
    TEXT_DARK = colors.HexColor("#1A1D20")  # Charcoal Black
    TEXT_MUTED = colors.HexColor("#5A6065") # Muted Gray

    # Custom Typography Styles
    style_cover_title = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=28,
        leading=34,
        textColor=PRIMARY,
        alignment=0,
        spaceAfter=10
    )

    style_cover_subtitle = ParagraphStyle(
        'CoverSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=SECONDARY,
        spaceAfter=15
    )

    style_meta = ParagraphStyle(
        'Meta',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=TEXT_MUTED,
        spaceAfter=20
    )

    style_h1 = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=PRIMARY,
        spaceBefore=18,
        spaceAfter=10,
        keepWithNext=True
    )

    style_h2 = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=SECONDARY,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    style_h3 = ParagraphStyle(
        'Heading3_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=TEXT_DARK,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    style_body = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=TEXT_DARK,
        spaceAfter=8
    )

    style_bullet = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=TEXT_DARK,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=4
    )

    style_box_text = ParagraphStyle(
        'BoxText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=13,
        textColor=SECONDARY
    )

    story = []

    # ── COVER / HEADER BLOCK ──
    story.append(Paragraph("SaaTerra Master UI/UX & Features Blueprint", style_cover_title))
    story.append(Paragraph("The Definitive B2B 5-Year Software Pass Marketplace Script (AppSumo + DealMirror + PitchGround Hybrid)", style_cover_subtitle))
    story.append(Paragraph("<b>Version:</b> 2.0 Complete Commercial Architecture | <b>Author:</b> SaaTerra Lead Product Architect | <b>Status:</b> Production Ready", style_meta))
    story.append(HRFlowable(width="100%", thickness=2.5, color=PRIMARY, spaceBefore=0, spaceAfter=15))

    # EXECUTIVE SUMMARY BOX
    summary_text = (
        "<b>Executive Vision:</b> SaaTerra solves SaaS subscription burnout for agency owners and founders by replacing "
        "endless monthly bills with high-value <b>5-Year Access Passes</b> (starting at ₹1,999 / $25). "
        "This master blueprint combines AppSumo's signature 🌮 Taco Rating &amp; Tier Matrix, DealMirror's ticking price pill hero carousel, "
        "and PitchGround's founder story &amp; flash campaign urgency engine into a single high-converting commercial platform."
    )
    summary_table = Table([[Paragraph(summary_text, style_box_text)]], colWidths=[530])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#EBF3FF")),
        ('BORDER', (0,0), (-1,-1), 1, PRIMARY),
        ('PADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 15))

    # ── SECTION 1: HYBRID MODEL ARCHITECTURE ──
    story.append(Paragraph("1. Hybrid Marketplace Architecture & Synthesis", style_h1))
    story.append(Paragraph(
        "SaaTerra synthesizes the highest-converting components from the world's top three LTD platforms:",
        style_body
    ))

    arch_data = [
        [Paragraph("<b>Platform</b>", style_h3), Paragraph("<b>Key Feature Borrowed</b>", style_h3), Paragraph("<b>SaaTerra Commercial Execution</b>", style_h3)],
        [
            Paragraph("<b>AppSumo</b>", style_body),
            Paragraph("🌮 5-Taco Ratings, 4-Column Tier Matrix, Select Gold Badges, Verified Reviews &amp; Q&amp;A", style_body),
            Paragraph("Integrated 🌮 Taco Rating component, 4-column plan matrix (Tier 1-4), verified buyer Q&amp;A thread, and SaaTerra Select badge.", style_body)
        ],
        [
            Paragraph("<b>DealMirror</b>", style_body),
            Paragraph("🟢 Green Dashed Price Pill, 🔴 Red Dashed Countdown Timer Blocks, Yellow Buy CTA", style_body),
            Paragraph("Compact Hero Carousel Slider featuring live ticking countdown digit blocks, green dashed price tag pill, and `#2475FF` action buttons.", style_body)
        ],
        [
            Paragraph("<b>PitchGround</b>", style_body),
            Paragraph("Founder Note / Pitch Story, Flash Sale Banners, Academy Video Spotlight, Revenue Split", style_body),
            Paragraph("Founder Pitch Note on deal pages, 14-Day Flash Campaign banners, vendor 70/30 commission partnership portal (`/submit`).", style_body)
        ],
        [
            Paragraph("<b>SaaTerra Innovation</b>", style_body),
            Paragraph("5-Year Pass Model, Razorpay Instant UPI Checkout, B2B GSTIN Tax Invoice, VIP Plus", style_body),
            Paragraph("5-Year Pass sustainability model, PhonePe/GPay UPI QR payment, B2B tax credit invoices, and SaaTerra Plus VIP (10% extra discount).", style_body)
        ]
    ]

    arch_table = Table(arch_data, colWidths=[90, 210, 230])
    arch_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#080512")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('PADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(arch_table)
    story.append(Spacer(1, 15))

    # ── SECTION 2: GLOBAL NAVIGATION & LAYOUT SYSTEM ──
    story.append(Paragraph("2. Global Navigation & Header System Blueprint", style_h1))
    story.append(Paragraph(
        "The header is designed for pixel-perfect clarity, high trust, and instant discovery:",
        style_body
    ))

    story.append(Paragraph("• <b>Top Social Proof Sales Ticker:</b> Real-time ticker bar showing live purchases (<i>'🔥 Rahul from Delhi bought Chat Chacha 5-Year Pass 2m ago'</i>) + SaaTerra Plus VIP notification.", style_bullet))
    story.append(Paragraph("• <b>Left Brand Identity:</b> Bold uppercase <b>SAATERRA</b> logo + cursive subtext <i>'India\'s #1 B2B software deals'</i>.", style_bullet))
    story.append(Paragraph("• <b>Center Search Bar:</b> Oval pill search input with magnifying glass icon `🔍 Search products (⌘+k)` keyboard shortcut listener.", style_bullet))
    story.append(Paragraph("• <b>Center-Right Navigation:</b> `Software ˅` (Dropdown category menu), `New arrivals`, `Ending soon`, `Radar [NEW]` badge.", style_bullet))
    story.append(Paragraph("• <b>Far-Right Action Cluster:</b> Notification Bell icon with red unread badge (`🔔¹`), Cart icon (`🛒`), and `[ Log in ]` button.", style_bullet))
    story.append(Paragraph("• <b>Category Sub-Bar:</b> Quick filter pills for WhatsApp Automation, AI &amp; GEO SEO, Lead Scraping, and CRMs.", style_bullet))

    story.append(Spacer(1, 15))

    # ── SECTION 3: HOMEPAGE & HERO CAROUSEL ──
    story.append(Paragraph("3. Homepage & Hero Carousel Slider Blueprint", style_h1))
    story.append(Paragraph(
        "The homepage is optimized for high conversion using psychological urgency triggers:",
        style_body
    ))

    story.append(Paragraph("<b>A. DealMirror-Style Hero Carousel Slider (`HeroDealSlider.jsx`):</b>", style_h2))
    story.append(Paragraph("• <b>Headline &amp; Accent:</b> `Grab [SaaS Name] 5-Year Pass (Exclusive Deal)` with punchy 2-line value proposition.", style_bullet))
    story.append(Paragraph("• <b>Green Dashed Price Tag Pill:</b> `🟢 ₹1,999 till 30th September` with live pulsing green dot indicator.", style_bullet))
    story.append(Paragraph("• <b>Red Dashed Countdown Timer Blocks:</b> Ticking digit boxes `[03 DAYS]` `[14 HOURS]` `[40 MINS]` `[22 SECS]` with live JavaScript countdown.", style_bullet))
    story.append(Paragraph("• <b>Primary Action Button:</b> `#2475FF` Electric Blue button `Buy Now ➔` triggering instant checkout modal.", style_bullet))
    story.append(Paragraph("• <b>Product Screenshot Preview Card:</b> Right column image preview card featuring red discount ribbon (`90% OFF`), vendor logo avatar, and taco rating tag.", style_bullet))

    story.append(Spacer(1, 8))

    story.append(Paragraph("<b>B. Homepage Conversion Sections:</b>", style_h2))
    story.append(Paragraph("• <b>SaaTerra Select Spotlight Grid:</b> High-converting 3-column deal cards (`AppSumoDealCard.jsx`) with 🌮 ratings, stock progress bar (`84% Claimed`), and discount ribbons.", style_bullet))
    story.append(Paragraph("• <b>5-Year Savings Math Calculator:</b> Interactive widget demonstrating savings math (₹24,000/yr recurring vs ₹1,999 one-time = ₹1,18,001 saved over 5 years).", style_bullet))
    story.append(Paragraph("• <b>Founder Campaign Banner:</b> PitchGround-style CTA banner encouraging SaaS vendors to list their tools for a 70/30 commission split.", style_bullet))

    story.append(Spacer(1, 15))

    # ── SECTION 4: SINGLE DEAL SALES PAGE ──
    story.append(Paragraph("4. Single Deal Sales Page Master Blueprint", style_h1))
    story.append(Paragraph(
        "The single deal sales page (`app/deals/[deal-slug]/page.js`) combines PitchGround storytelling with AppSumo tier comparison matrix:",
        style_body
    ))

    deal_page_data = [
        [Paragraph("<b>Component Block</b>", style_h3), Paragraph("<b>UI Layout &amp; Content Elements</b>", style_h3), Paragraph("<b>Conversion Functionality</b>", style_h3)],
        [
            Paragraph("<b>Sticky Sub-Header Navigation</b>", style_body),
            Paragraph("Appears on scroll: Logo, Deal Title, Price Tag (₹1,999), Jump links (Overview, Features, Plan Matrix, Q&amp;A), `#2475FF` Buy Button.", style_body),
            Paragraph("Keeps checkout CTA visible at all times as user scrolls down long sales copy.", style_body)
        ],
        [
            Paragraph("<b>TL;DR At a Glance Summary Box</b>", style_body),
            Paragraph("AppSumo signature summary box: Best for (Agencies), Alternative to (Zapier, Wati), Key Features bullet list, Integrations icons.", style_body),
            Paragraph("Allows buyers to evaluate software suitability in under 15 seconds.", style_body)
        ],
        [
            Paragraph("<b>Founder Note / Pitch Story</b>", style_body),
            Paragraph("PitchGround signature founder letter: Photo of founder, background story, product vision, product roadmap timeline, and exclusive pass deal rationale.", style_body),
            Paragraph("Builds deep human trust and removes 'AI-generated website' feel.", style_body)
        ],
        [
            Paragraph("<b>AppSumo 4-Column Plan Matrix Table</b>", style_body),
            Paragraph("Side-by-side comparison table for License Tier 1 to Tier 4: Feature rows, limits, recommended tier highlight, `#2475FF` Buy buttons.", style_body),
            Paragraph("Drives tier upgrades (Tier 1 ₹1,999 ➔ Tier 2 ₹3,999 ➔ Tier 3 ₹7,999).", style_body)
        ],
        [
            Paragraph("<b>Verified Q&amp;A &amp; 🌮 Reviews</b>", style_body),
            Paragraph("Founder-verified Q&amp;A thread with upvotes + 5 Taco Rating breakdowns with verified buyer badges.", style_body),
            Paragraph("Provides authentic social proof and answers technical objections.", style_body)
        ]
    ]

    deal_table = Table(deal_page_data, colWidths=[120, 230, 180])
    deal_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#080512")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('PADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(deal_table)
    story.append(Spacer(1, 15))

    # ── SECTION 5: CHECKOUT & PAYMENT ENGINE ──
    story.append(Paragraph("5. Checkout Modal & Payment Engine Blueprint", style_h1))
    story.append(Paragraph(
        "The checkout system (`components/LTDCheckoutModal.jsx`) is engineered for seamless Indian UPI payments:",
        style_body
    ))

    story.append(Paragraph("• <b>Clean White &amp; `#2475FF` Blue Aesthetic:</b> Pure white popup container matching the website design system perfectly.", style_bullet))
    story.append(Paragraph("• <b>Step 1 — Order Summary &amp; B2B GSTIN Input:</b> Plan title, pricing summary, instant savings ribbon (<i>'You Save ₹72,000 Today!'</i>), 60-day refund guarantee badge, and optional Company GSTIN field.", style_bullet))
    story.append(Paragraph("• <b>Step 2 — Razorpay UPI Gateway &amp; Live QR Code Scanner:</b> Razorpay security header, 10-minute ticking urgency clock (`⏳ 09:54`), high-res UPI QR code image, PhonePe/GPay/Paytm badges, and live auto-scan beam animation.", style_bullet))
    story.append(Paragraph("• <b>Step 3 — Strict Security &amp; Code Unlock:</b> Redemption code (`ST-CHAT-CHACHA-8912`) is unlocked ONLY AFTER payment verification and saved to MongoDB (`LTDOrder`).", style_bullet))
    story.append(Paragraph("• <b>Step 4 — 1-Click Code Copy &amp; Redemption Direct:</b> Copy button with instant confirmation toast + link to user dashboard.", style_bullet))

    story.append(Spacer(1, 15))

    # ── SECTION 6: ADDITIONAL ESSENTIAL PAGES ──
    story.append(Paragraph("6. Additional Commercial Marketplace Pages", style_h1))

    pages_data = [
        [Paragraph("<b>Page / Endpoint</b>", style_h3), Paragraph("<b>Route URL</b>", style_h3), Paragraph("<b>Commercial Feature Description</b>", style_h3)],
        [
            Paragraph("<b>License Redemption Portal</b>", style_body),
            Paragraph("`/redeem`", style_body),
            Paragraph("Interactive 1-click code activation portal where buyers enter their code (`ST-XXXX`) to validate their 5-year pass.", style_body)
        ],
        [
            Paragraph("<b>Founder Partner Portal</b>", style_body),
            Paragraph("`/submit`", style_body),
            Paragraph("SaaS vendor onboarding form for 14-day flash campaigns with 70/30 revenue share split calculator.", style_body)
        ],
        [
            Paragraph("<b>SaaTerra Plus VIP Page</b>", style_body),
            Paragraph("`/plus`", style_body),
            Paragraph("VIP annual membership portal (₹999/yr) offering 10% extra OFF on all deals + 90-day extended refund guarantee.", style_body)
        ],
        [
            Paragraph("<b>User Passes Dashboard</b>", style_body),
            Paragraph("`/profile`", style_body),
            Paragraph("User dashboard displaying all purchased 5-year passes fetched from MongoDB (`/api/user/deals`) with code copy &amp; GST invoices.", style_body)
        ]
    ]

    pages_table = Table(pages_data, colWidths=[130, 90, 310])
    pages_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#080512")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('PADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(pages_table)
    story.append(Spacer(1, 20))

    # ── CONCLUSION BOX ──
    concl_text = (
        "<b>Summary:</b> SaaTerra is now fully architected as a commercial-grade, full-stack Indian B2B marketplace. "
        "All features from AppSumo, DealMirror, and PitchGround are fully integrated with production MongoDB models, Razorpay UPI checkout, and responsive Next.js frontend pages."
    )
    concl_table = Table([[Paragraph(concl_text, style_box_text)]], colWidths=[530])
    concl_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F0FDF4")),
        ('BORDER', (0,0), (-1,-1), 1, EMERALD),
        ('PADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(concl_table)

    # Build PDF document
    doc.build(story)
    print(f"PDF successfully generated at {filename}")

if __name__ == "__main__":
    out_path = sys.argv[1] if len(sys.argv) > 1 else "SaaTerra_Master_UIUX_Features_Blueprint.pdf"
    build_pdf(out_path)
