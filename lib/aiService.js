import dbConnect from './dbConnect';
import Deal from '@/models/Deal';
import { matchFaqQuery, STACKDEAL_SERVICES, STACKDEAL_FAQS } from './stackdealKnowledge';

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

/**
 * ⚡ Ultra-Fast Groq API Call (openai/gpt-oss-120b / groq/compound-mini)
 */
async function callLLM(messages, systemInstruction = '', jsonMode = false) {
  const apiKey = process.env.GROQ_API_KEY || '';
  if (apiKey) {
    const candidateModels = ['qwen/qwen3.8-27b', 'groq/compound-mini', 'openai/gpt-oss-120b'];

    for (const model of candidateModels) {
      try {
        const groqMessages = [];
        if (systemInstruction) {
          groqMessages.push({ role: 'system', content: systemInstruction });
        }
        groqMessages.push(...messages);

        const payload = {
          model,
          messages: groqMessages,
          temperature: 0.3,
          max_tokens: 280,
          ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
        };

        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const json = await res.json();
          let content = json?.choices?.[0]?.message?.content;
          if (content && typeof content === 'string' && content.trim()) {
            return content.trim();
          }
        } else {
          const err = await res.text();
          console.warn(`[Groq Error with ${model}]:`, err);
        }
      } catch (err) {
        console.warn(`[Groq Exception with ${model}]:`, err.message);
      }
    }
  }

  return null;
}

/**
 * 1. "Stacky" Dynamic AI Deal Matchmaker & Assistant powered by Groq LLM
 */
export async function recommendDealsWithAI({ query, businessType = '', budget = null }) {
  await dbConnect();
  const activeDeals = await Deal.find({ status: 'Active' }).lean();

  const isSoftwareSearch = /\b(recommend|tool|tools|software|deal|deals|pass|passes|alternative|whatsapp|seo|lead|crm|scraper|video|marketing|buy|suggest|koun sa|kaun sa|chahiye|khareedna|best)\b/i.test(query);

  // Strict RAG Deal Knowledge Base
  const dealsContext = (activeDeals || []).map((d) => ({
    title: d.title,
    slug: d.slug,
    category: d.category,
    tagline: d.tagline,
    starterPrice: d.tier1Price || 1999,
    originalPrice: d.originalPrice || 24000,
    tldr: d.tldr || [],
    alternativeTo: d.atAGlance?.alternativeTo || '',
    bestFor: d.atAGlance?.bestFor || '',
    integrations: d.atAGlance?.integrations || '',
  }));

  const systemPrompt = `You are "Stacky", the official dynamic AI assistant for StackDeal (https://www.stackdeal.in).
StackDeal is India's dedicated marketplace for 5-Year Lifetime SaaS Passes, saving 90% over monthly subscriptions.

### CORE GROUND TRUTH KNOWLEDGE BASE (STRICT FACTS - NEVER HALLUCINATE):
- **Founder & Owner**: Ujjawal Tiwari (Solo Founder & Full-Stack Architect, @ujjawal_dev, ujjawal@stackdeal.in). StackDeal was single-handedly designed, built, and launched by Ujjawal Tiwari. NEVER invent or hallucinate any other person's name (such as Saurabh Singh or anyone else). If asked who is the owner, founder, creator, or who made StackDeal in any language (Hindi, Hinglish, English), ALWAYS state that **Ujjawal Tiwari** is the founder & owner.
- **Refund Policy**: 100% Risk-Free 60-Day Money-Back Guarantee, no questions asked. Email support@stackdeal.in.
- **Invoices**: Automated 18% GST B2B Invoices with Input Tax Credit (ITC) for businesses.
- **Support**: support@stackdeal.in | WhatsApp live chat (Mon-Sat 9 AM-8 PM IST).
- **WhatsApp Community**: Official VIP Community invite link: https://chat.whatsapp.com/GmWT9MGU8LX2PFGEtl1Z7f (48-hr early deal access, secret coupon drops).
- **Payment Methods**: Instant UPI (Google Pay, PhonePe, Paytm, BHIM), Debit/Credit Cards (Visa, Mastercard, RuPay), and NetBanking via Razorpay.
- **StackDeal PLUS**: VIP membership at ₹999/year for an extra 10% OFF on all 5-Year software passes.
- **Vendor Listing**: SaaS developers can list on StackDeal with 70% revenue share and bi-weekly payouts.

### ABSOLUTE BEHAVIOR RULES (STRICT COMPLIANCE REQUIRED):
1. **DYNAMIC & NATURAL CONVERSATION**: Answer dynamically in the same language and tone as the user (Hindi, Hinglish, English).
2. **ANSWER ONLY WHAT THE USER ASKS. NEVER ADD EXTRA MARKETING FLUFF, PITCHES, OR UNSOLICITED DEALS.**
   - If user asks about WhatsApp Community / VIP group / link: provide the link [https://chat.whatsapp.com/GmWT9MGU8LX2PFGEtl1Z7f](https://chat.whatsapp.com/GmWT9MGU8LX2PFGEtl1Z7f) in 1-2 short sentences.
   - If user asks who owns/founded StackDeal ("malik kaun hai", "founder kaun hai", "kisne banaya", "संस्थापक कौन है"): state in 1-2 concise sentences that **Ujjawal Tiwari** is the founder & owner.
   - If user asks about GST, ONLY answer about GST in 2 sentences. DO NOT mention or pitch any software tools.
   - If user asks about refund, ONLY answer the refund policy in 2 sentences.
   - If user asks about services or support, ONLY answer that question concisely.
   - If user greets ("hi", "hello"), reply with a brief, friendly greeting in 1 sentence.
3. **ONLY IF THE USER EXPLICITLY ASKS FOR SOFTWARE OR TOOL RECOMMENDATIONS (e.g. "recommend a tool", "best whatsapp software", "which tool for seo"):**
   - Recommend 1 or 2 relevant tools from the catalogue in 1 sentence each.
   - At the very end of your response, output: [[MATCHED_SLUGS: "slug-1", "slug-2"]].
4. **BREVITY:** Maximum 2 to 3 short sentences or bullet points (under 50 words). Zero giant tables, zero long essays.`;

  const userMessage = `User Query: "${query}"

Available StackDeal 5-Year Passes (ONLY recommend if user explicitly asks for software):
${isSoftwareSearch ? JSON.stringify(dealsContext, null, 2) : 'None (Do not mention any software)'}

Answer ONLY what is asked in 2 to 3 short sentences:`;

  const aiResponse = await callLLM([{ role: 'user', content: userMessage }], systemPrompt, false);

  let finalReply = aiResponse;
  let matchedSlugs = [];

  if (aiResponse) {
    const slugMatch = aiResponse.match(/\[\[MATCHED_SLUGS:\s*([^\]]+)\]\]/i);
    if (slugMatch) {
      matchedSlugs = slugMatch[1]
        .split(',')
        .map((s) => s.replace(/["'\s]/g, '').toLowerCase())
        .filter(Boolean);
      finalReply = aiResponse.replace(/\[\[MATCHED_SLUGS:[^\]]+\]\]/i, '').trim();
    } else if (isSoftwareSearch) {
      // Find active deals explicitly mentioned in AI reply
      for (const d of (activeDeals || [])) {
        if (d.title && d.title.length >= 3) {
          const titleRegex = new RegExp(`\\b${d.title.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\b`, 'i');
          if (titleRegex.test(aiResponse)) {
            matchedSlugs.push(d.slug);
          }
        }
        if (d.slug && d.slug.length >= 3) {
          const slugRegex = new RegExp(`\\b${d.slug.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\b`, 'i');
          if (slugRegex.test(aiResponse)) {
            matchedSlugs.push(d.slug);
          }
        }
      }
      finalReply = aiResponse.trim();
    }
  }

  // Graceful fallback ONLY if Groq AI call failed (network or rate limit)
  if (!finalReply) {
    const directFaqAnswer = matchFaqQuery(query);
    if (directFaqAnswer) {
      finalReply = directFaqAnswer;
    } else if (isSoftwareSearch) {
      const qLower = query.toLowerCase();
      const scoredDeals = (activeDeals || []).map((d) => {
        let score = 0;
        const text = `${d.title} ${d.tagline} ${d.category}`.toLowerCase();
        if (qLower.includes('whatsapp') && text.includes('whatsapp')) score += 5;
        if ((qLower.includes('seo') || qLower.includes('geo')) && text.includes('seo')) score += 5;
        return { deal: d, score };
      });
      scoredDeals.sort((a, b) => b.score - a.score);
      const top = scoredDeals[0]?.deal;
      if (top) {
        finalReply = `Aapke liye **${top.title}** (₹${top.tier1Price || 1999} 5-Year Pass) best rahega. ${top.tagline}`;
        matchedSlugs = [top.slug];
      } else {
        finalReply = "Aap hamare [All Deals](/deals) page par jakar saare 5-Year Passes explore kar sakte hain.";
      }
    } else {
      finalReply = "StackDeal par aapko 5-Year Lifetime SaaS Passes milte hain with 18% GST Invoices and 60-day money-back guarantee. Aap kisi bhi specific query ke bare me puch sakte hain!";
    }
  }

  // ONLY return matched deals if user actually searched for software and slugs were identified!
  const matchedDeals = (isSoftwareSearch && matchedSlugs.length > 0)
    ? (activeDeals || []).filter((d) => matchedSlugs.includes(d.slug))
    : [];

  return {
    reply: finalReply,
    matchedDeals,
  };
}

/**
 * 2. 1-Click AI Vendor Listing Copilot using Groq
 */
export async function generateVendorListingWithAI({ websiteUrl, pitch = '', category = '' }) {
  const domain = (websiteUrl || '').trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
  const cleanName = domain.split('.')[0] ? domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1) : 'SaaS Tool';

  const systemPrompt = `You are a world-class B2B SaaS copywriter and ProductHunt/AppSumo launch expert for Indian agency buyers.
Generate a complete, high-converting SaaS listing in JSON format.
Return ONLY valid JSON without markdown wrapping.

JSON Schema:
{
  "title": "Product Name — Catchy USP",
  "tagline": "1 punchy sentence describing the core transformation & benefit.",
  "category": "WhatsApp Tools" | "AI & GEO SEO" | "Lead Scraping" | "CRM & Sales" | "Video & Design" | "Analytics",
  "tldr": [
    "High-impact benefit 1 (Automation / time saved)",
    "High-impact benefit 2 (Client results / revenue)",
    "High-impact benefit 3 (GST / agency-friendly features)"
  ],
  "alternativeTo": "2-3 expensive monthly foreign SaaS (e.g. WATI, Apollo.io, ManyChat)",
  "integrations": "Key integrations (e.g. Shopify, Razorpay, Google Sheets, Zapier, Webhooks)",
  "bestFor": "Target audience (e.g. Digital Marketing Agencies, B2B Sales Teams, E-commerce Brands)",
  "feat1Title": "Key Feature 1 Heading",
  "feat1Desc": "Compelling description of automated workflows and simplicity.",
  "feat1Bullets": "Point 1\\nPoint 2\\nPoint 3",
  "feat2Title": "Key Feature 2 Heading",
  "feat2Desc": "Compelling description of agency scalability and client sub-accounts.",
  "feat2Bullets": "Point 1\\nPoint 2\\nPoint 3",
  "faqs": [
    { "question": "How do buyers redeem their 5-Year Pass?", "answer": "Buyers receive an instant unique license code upon purchase to activate directly on your official dashboard." },
    { "question": "Are future software updates included over 5 years?", "answer": "Yes! All core product updates, bug fixes, and improvements released over the 5-year period are 100% included." },
    { "question": "What is the refund policy?", "answer": "StackDeal provides a 60-day risk-free money-back guarantee for complete buyer peace of mind." }
  ],
  "founderNote": "Authentic personal note from the founder explaining why they created this software to help growing businesses escape monthly subscription fatigue."
}`;

  const userMessage = `Create a complete SaaS marketplace listing for:
Software Name / Domain: ${cleanName}
Website URL: ${websiteUrl || 'https://' + domain}
Category Preference: ${category || 'Auto-detect'}
Product Description / Pitch: "${pitch || 'Advanced cloud automation platform designed to help digital agencies and businesses scale without recurring fees.'}"`;

  const aiText = await callLLM([{ role: 'user', content: userMessage }], systemPrompt, true);

  if (aiText) {
    try {
      const cleanJson = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return { success: true, data: parsed };
    } catch (e) {
      console.warn('[Groq JSON Parse Error]:', e.message);
    }
  }

  // Reliable Smart Fallback
  return {
    success: true,
    data: {
      title: `${cleanName} — Cloud Growth & Automation Suite`,
      tagline: `Scale your agency workflows, automate repetitive tasks, and boost client retention with zero monthly fees.`,
      category: category || (pitch.toLowerCase().includes('whatsapp') ? 'WhatsApp Tools' : pitch.toLowerCase().includes('seo') ? 'AI & GEO SEO' : pitch.toLowerCase().includes('lead') ? 'Lead Scraping' : 'CRM & Sales'),
      tldr: [
        `Execute automated agency campaigns and multi-channel workflows in 1 click.`,
        `Empower team collaboration with unified client sub-accounts and permissions.`,
        `100% Indian GST compliant with priority WhatsApp technical support.`,
      ],
      alternativeTo: `Expensive $99/month foreign tools with recurring subscriptions`,
      integrations: `Shopify, WooCommerce, Razorpay, Google Sheets, Webhooks`,
      bestFor: `Digital Marketing Agencies, Freelancers, E-Commerce Founders, B2B Teams`,
      feat1Title: `Automate Core Workflows with Zero Code`,
      feat1Desc: `Set up intelligent triggers and automation rules in minutes without hiring expensive developers.`,
      feat1Bullets: `Visual flow builder with pre-built agency templates\nInstant trigger webhooks & API synchronization\nReal-time conversion tracking & analytics reports`,
      feat2Title: `Built Specifically for Fast Agency Scaling`,
      feat2Desc: `Manage multiple client accounts from a single intuitive dashboard with custom brand settings.`,
      feat2Bullets: `Multi-user role access and seat management\nExport white-label PDF audit reports for clients\n24/7 dedicated assistance and fast onboarding`,
      faqs: [
        {
          question: `How do customers redeem their 5-Year Pass for ${cleanName}?`,
          answer: `Upon checkout on StackDeal, you receive an instant unique license code and direct dashboard activation link.`,
        },
        {
          question: `Are all software updates included for the 5-year duration?`,
          answer: `Yes! All future core feature releases, improvements, and security patches over 5 years are 100% included.`,
        },
        {
          question: `How does the 60-day refund guarantee work?`,
          answer: `You can test the software for 60 full days. If not completely satisfied, request a full refund with zero hassle.`,
        },
      ],
      founderNote: `After spending thousands of dollars every year on overpriced foreign tools that charged recurring monthly bills, we built ${cleanName}. We believe Indian founders and agencies deserve world-class software at fair, one-time pricing!`,
    },
  };
}
