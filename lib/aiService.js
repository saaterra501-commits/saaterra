import dbConnect from './dbConnect';
import Deal from '@/models/Deal';

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

/**
 * ⚡ Ultra-Fast Groq API Call (openai/gpt-oss-120b / groq/compound-mini)
 */
async function callLLM(messages, systemInstruction = '', jsonMode = false) {
  if (GROQ_API_KEY) {
    const candidateModels = ['openai/gpt-oss-120b', 'groq/compound-mini', 'qwen/qwen3.8-27b'];

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
          temperature: 0.4,
          max_tokens: 1500,
          ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
        };

        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const json = await res.json();
          const content = json?.choices?.[0]?.message?.content;
          if (content) return content;
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
 * 1. AI Deal Matchmaker Copilot using Groq
 */
export async function recommendDealsWithAI({ query, businessType = '', budget = null }) {
  await dbConnect();
  const activeDeals = await Deal.find({ status: 'Active' }).lean();

  if (!activeDeals || activeDeals.length === 0) {
    return {
      reply: "Currently no active software deals are published. Check back soon for new 5-Year Passes!",
      matchedDeals: [],
    };
  }

  // Strict RAG Deal Knowledge Base
  const dealsContext = activeDeals.map((d) => ({
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

  const systemPrompt = `You are "StackDeal AI Copilot", an expert Indian B2B SaaS investment and agency software advisor powered by Groq.
Your goal is to recommend the best 5-Year SaaS Access Passes from the provided list to help Indian agencies, freelancers, and businesses eliminate recurring monthly fees and scale their operations.

Guidelines:
- Recommend 1 to 2 relevant software deals from the catalogue below based strictly on the user query.
- Be punchy, helpful, energetic, and value-focused.
- Calculate approximate 5-year savings compared to expensive recurring monthly foreign SaaS (e.g. $50/mo = ₹2,40,000+ in 5 years).
- Mention Indian GST invoicing and the 60-day money-back guarantee.
- Return your answer in beautiful GitHub-style Markdown.
- IMPORTANT: At the very end of your response, output the exact slug IDs in brackets like this: [[MATCHED_SLUGS: "slug-1", "slug-2"]].`;

  const userMessage = `User Query: "${query}"
Business Type: ${businessType || 'Agency / Business'}
Budget: ${budget ? `Under ₹${budget}` : 'Flexible'}

Available 5-Year Passes on StackDeal:
${JSON.stringify(dealsContext, null, 2)}

Provide your personalized recommendation, strategy, and 5-year ROI breakdown:`;

  const aiResponse = await callLLM([{ role: 'user', content: userMessage }], systemPrompt, false);

  let finalReply = aiResponse;
  let matchedSlugs = [];

  if (aiResponse) {
    const slugMatch = aiResponse.match(/\[\[MATCHED_SLUGS:\s*([^\]]+)\]\]/);
    if (slugMatch) {
      matchedSlugs = slugMatch[1]
        .split(',')
        .map((s) => s.replace(/["'\s]/g, ''))
        .filter(Boolean);
      finalReply = aiResponse.replace(/\[\[MATCHED_SLUGS:[^\]]+\]\]/, '').trim();
    }
  }

  // If no slugs parsed or LLM unavailable, fallback to keyword scoring
  if (!finalReply || matchedSlugs.length === 0) {
    const qLower = query.toLowerCase();
    const scoredDeals = activeDeals.map((d) => {
      let score = 0;
      const text = `${d.title} ${d.tagline} ${d.category} ${(d.tldr || []).join(' ')} ${d.atAGlance?.bestFor || ''} ${d.atAGlance?.alternativeTo || ''}`.toLowerCase();
      const words = qLower.split(/\s+/).filter((w) => w.length > 2);
      for (const w of words) {
        if (text.includes(w)) score += 2;
      }
      if (qLower.includes('whatsapp') && (d.category.includes('WhatsApp') || text.includes('whatsapp'))) score += 5;
      if ((qLower.includes('seo') || qLower.includes('geo')) && text.includes('seo')) score += 5;
      if ((qLower.includes('lead') || qLower.includes('email') || qLower.includes('scrape')) && text.includes('lead')) score += 5;
      return { deal: d, score };
    });

    scoredDeals.sort((a, b) => b.score - a.score);
    const topMatches = scoredDeals.slice(0, 2).map((item) => item.deal);
    matchedSlugs = topMatches.map((d) => d.slug);

    finalReply = `Based on your requirements, here are the top recommended **5-Year Passes** for your workflow:

${topMatches.map((d) => `### 🚀 **${d.title}** (₹${d.tier1Price || 1999} 5-Year Pass)
* **Tagline:** ${d.tagline}
* **Why it fits:** Replaces expensive monthly tools like *${d.atAGlance?.alternativeTo || 'foreign SaaS'}*, saving your team **over ₹2,00,000+** in recurring bills.
* **Integrations:** ${d.atAGlance?.integrations || 'API & Webhooks'}`).join('\n\n')}

🔒 **All passes include 18% GST Invoices and our risk-free 60-Day Money-Back Guarantee.**`;
  }

  const matchedDeals = activeDeals.filter((d) => matchedSlugs.includes(d.slug));

  return {
    reply: finalReply,
    matchedDeals: matchedDeals.length > 0 ? matchedDeals : activeDeals.slice(0, 2),
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
