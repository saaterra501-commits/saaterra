'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import PlanFeaturesBuilder from '../../components/PlanFeaturesBuilder';
import VendorDealPreviewModal from '../../components/VendorDealPreviewModal';
import {
  Rocket, DollarSign, ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft, Zap, Users,
  Calculator, Gift, Tag, Video, Image as ImageIcon, FileText, Layers, User, Sparkles,
  ExternalLink, Check, Clock, Upload, Mail, Phone, Building, Eye, Edit3, Globe,
  Plus, Trash2, Key, CreditCard, RotateCcw, AlertCircle, ToggleLeft, ToggleRight, Star,
  Copy, RefreshCw
} from 'lucide-react';

function LinkedInIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  );
}

function TwitterXIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

// Smart Video URL Sanitizer (Converts youtube watch links, youtu.be, loom, vimeo to embed format)
function sanitizeVideoUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  const ytWatchMatch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
  if (ytWatchMatch && ytWatchMatch[1]) {
    return `https://www.youtube.com/embed/${ytWatchMatch[1]}`;
  }

  const loomMatch = trimmed.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9_-]+)/);
  if (loomMatch && loomMatch[1]) {
    return `https://www.loom.com/embed/${loomMatch[1]}`;
  }

  const vimeoMatch = trimmed.match(/vimeo\.com\/([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return trimmed;
}

// License Code Generator Helper per Tier
function generateSampleCodesForTier(tierName, count) {
  const cleanName = (tierName || 'PASS').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const prefix = cleanName.includes('START') ? 'START' : cleanName.includes('PRO') ? 'PRO' : cleanName.includes('AGEN') ? 'AGNCY' : cleanName.slice(0, 5);
  const codes = [];
  for (let i = 1; i <= count; i++) {
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const padNum = String(i).padStart(3, '0');
    codes.push(`SD-${prefix}-${padNum}-${randomHex}`);
  }
  return codes.join('\n');
}

// Pre-seeded default license keys (180 Starter, 91 Pro, 30 Agency)
const DEFAULT_STARTER_CODES = generateSampleCodesForTier('Starter Pass', 180);
const DEFAULT_PRO_CODES = generateSampleCodesForTier('Pro Pass', 91);
const DEFAULT_AGENCY_CODES = generateSampleCodesForTier('Agency Pass', 30);

const TABS = [
  { id: 'basic', step: 1, label: '1. Basic & Pricing Plans', icon: Tag },
  { id: 'tiers', step: 2, label: '2. Plan Features', icon: Layers },
  { id: 'media', step: 3, label: '3. Media & Gallery', icon: Video },
  { id: 'tldr', step: 4, label: '4. TL;DR & FAQs', icon: FileText },
  { id: 'features', step: 5, label: '5. Feature Showcases', icon: Sparkles },
  { id: 'founder', step: 6, label: '6. Founder, Payouts & Codes', icon: User },
];

export default function VendorSubmitPage() {
  // ── 1. 70/30 Revenue Calculator State ──
  const [salesTarget, setSalesTarget] = useState(180);

  // ── 2. Flexible Plans & Tier-Wise Inventory State (180 Starter, 91 Pro, 30 Agency) ──
  const [pricingTiers, setPricingTiers] = useState([
    {
      id: 'starter',
      tierName: 'Starter Pass',
      price: 1999,
      originalPrice: 24000,
      totalCodes: 180, // 180 users / passes
      isRecommended: false,
      enabled: true,
      rawLicenseCodes: DEFAULT_STARTER_CODES,
      features: [
        { text: 'Full Core Software Access (5-Year Pass)', included: true },
        { text: 'Single workspace & 1 Admin seat', included: true },
        { text: 'Standard email support', included: true },
        { text: 'Official 18% GST B2B Invoice', included: true },
        { text: 'Team collaboration seats', included: false },
        { text: 'White-label / Custom domain', included: false },
      ],
    },
    {
      id: 'pro',
      tierName: 'Pro Pass',
      price: 3999,
      originalPrice: 48000,
      totalCodes: 91, // 91 users / passes
      isRecommended: true,
      enabled: true,
      rawLicenseCodes: DEFAULT_PRO_CODES,
      features: [
        { text: 'Everything in Starter Pass', included: true },
        { text: '3 Team member seats & 5 workspaces', included: true },
        { text: 'Advanced Automations & Webhooks', included: true },
        { text: 'Priority WhatsApp & Chat Support', included: true },
        { text: 'Commercial Agency client usage', included: true },
        { text: 'White-label / Custom domain', included: false },
      ],
    },
    {
      id: 'agency',
      tierName: 'Agency Pass',
      price: 7999,
      originalPrice: 96000,
      totalCodes: 30, // 30 users / passes
      isRecommended: false,
      enabled: true,
      rawLicenseCodes: DEFAULT_AGENCY_CODES,
      features: [
        { text: 'Everything in Pro Pass', included: true },
        { text: 'Unlimited team seats & workspaces', included: true },
        { text: '100% White-Label (Custom Domain)', included: true },
        { text: 'Client Sub-Accounts & Reseller rights', included: true },
        { text: 'Dedicated 1-on-1 Account Manager', included: true },
        { text: 'Native Razorpay UPI Checkout Widget', included: true },
      ],
    },
  ]);

  const activeTiers = pricingTiers.filter((t) => t.enabled !== false);
  const primaryTier = activeTiers[0] || pricingTiers[0] || { price: 1999, totalCodes: 180 };
  const passPrice = primaryTier.price || 1999;

  const grossRevenue = salesTarget * passPrice;
  const vendorPayout = Math.round(grossRevenue * 0.70);
  const stackdealCommission = Math.round(grossRevenue * 0.30);

  // ── 3. Wizard & Fully Pre-Filled Form State ──
  const [activeFormTab, setActiveFormTab] = useState('basic');
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState(null);
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [submittedDeal, setSubmittedDeal] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [draftSavedTime, setDraftSavedTime] = useState(null);

  const [formData, setFormData] = useState({
    title: 'Chat Chacha — WhatsApp AI Marketing & Automation',
    slug: 'chat-chacha',
    tagline: 'Automate WhatsApp marketing broadcasts, AI chatbot cart recovery, and lead conversion with zero coding.',
    category: 'WhatsApp Bots',
    websiteUrl: 'https://www.chatchacha.in',
    vendorName: 'Chat Chacha Tech Private Limited',
    vendorLogo: 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png',
    vendorLocation: 'Bengaluru, India',
    foundedDate: 'April 2023',
    teamSize: '1-10 employees',
    
    campaignDurationDays: 14,

    // Media
    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    screenshotsText: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop\nhttps://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',

    // TL;DR & Specs
    tldrText: '1-Click automated WhatsApp broadcasts & drip sequences\nRecover abandoned carts with AI chatbot flow builder\nAccept direct payments inside chat via UPI, PhonePe & GPay',
    alternativeTo: 'Interakt, WATI, ManyChat ($100+/month)',
    integrations: 'Shopify, WooCommerce, Razorpay, Google Sheets, Zapier',
    bestFor: 'Digital Marketing Agencies, Freelancers, E-commerce Founders',

    // Feature Showcase 1
    feat1Title: 'High-Impact Automated Workflows',
    feat1Desc: 'Empower your team to execute complex campaigns in seconds without technical knowledge.',
    feat1Bullets: 'Zero setup friction with intuitive dashboard\nExport analytics reports in 1 click\nMulti-user team collaboration support',
    feat1Image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',

    // Feature Showcase 2
    feat2Title: 'Built Specifically for Indian Market Growth',
    feat2Desc: 'Optimized for high conversion rates, speed, and seamless customer onboarding.',
    feat2Bullets: 'Native INR pricing and Indian payment options\nLightning-fast cloud servers\n24/7 Priority WhatsApp technical assistance',
    feat2Image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',

    // Custom FAQs
    faqs: [
      {
        question: 'How do customers redeem the 5-Year Pass after purchase?',
        answer: 'Buyers receive an instant unique license key and redemption URL on StackDeal immediately upon payment confirmation.'
      },
      {
        question: 'Are future software updates included?',
        answer: 'Yes, all core product feature updates and bug fixes for the next 5 years are 100% included in the pass.'
      }
    ],

    // Founder Story
    founderName: 'Ujjawal Kumar',
    founderTitle: 'Founder & CEO',
    founderEmail: 'ujjawal@stackdeal.in',
    founderPhone: '+91 98765 43210',
    founderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    founderLinkedin: 'https://www.linkedin.com/in/ujjawal-kumar',
    founderTwitter: 'https://x.com/ujjawal_dev',
    founderNote: 'We built Chat Chacha to solve real agency bottlenecks without burning cash on overpriced monthly subscriptions.',
    vendorRedeemUrl: 'https://www.chatchacha.in/redeem',
    termsText: '5-Year Access Pass to software updates.\nMust redeem license code within 60 days of purchase.\n60-Day Money-Back Guarantee included.',

    // Payout Details (UPI / Bank)
    payoutMethod: 'UPI',
    upiId: 'ujjawal@okaxis',
    accountHolderName: 'Ujjawal Kumar',
    accountNumber: '919876543210',
    ifscCode: 'HDFC0001234',
    bankName: 'HDFC Bank',
    panOrGstin: 'ABCDE1234F',

    // Legal Terms Agreement
    termsAgreed: true,
  });

  // ── 4. Restore Draft from LocalStorage on Mount ──
  useEffect(() => {
    try {
      const saved = localStorage.getItem('stackdeal_vendor_submission_draft_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.formData) setFormData((prev) => ({ ...prev, ...parsed.formData }));
        if (parsed?.pricingTiers && Array.isArray(parsed.pricingTiers)) setPricingTiers(parsed.pricingTiers);
        if (parsed?.salesTarget) setSalesTarget(parsed.salesTarget);
        setDraftSavedTime('Restored from draft');
      }
    } catch (e) {
      console.warn('Could not restore draft:', e);
    }
  }, []);

  // ── AI Listing Auto-Generator States & Handler ──
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [aiSuccessMsg, setAiSuccessMsg] = useState('');

  const handleAiAutoGenerate = async () => {
    const inputUrlOrPitch = (aiPromptInput || formData.websiteUrl).trim();
    if (!inputUrlOrPitch) {
      alert('Please enter your Website URL or a 1-sentence product pitch first!');
      return;
    }

    setAiGenerating(true);
    setAiSuccessMsg('');

    try {
      const res = await fetch('/api/ai/generate-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteUrl: formData.websiteUrl || (inputUrlOrPitch.startsWith('http') ? inputUrlOrPitch : ''),
          pitch: inputUrlOrPitch,
          category: formData.category,
        }),
      });

      const json = await res.json();
      if (json?.success && json?.data) {
        const d = json.data;
        setFormData((prev) => ({
          ...prev,
          title: d.title || prev.title,
          tagline: d.tagline || prev.tagline,
          category: d.category || prev.category,
          websiteUrl: prev.websiteUrl || (inputUrlOrPitch.startsWith('http') ? inputUrlOrPitch : prev.websiteUrl),
          tldrText: Array.isArray(d.tldr) ? d.tldr.join('\n') : (d.tldr || prev.tldrText),
          alternativeTo: d.alternativeTo || prev.alternativeTo,
          integrations: d.integrations || prev.integrations,
          bestFor: d.bestFor || prev.bestFor,
          feat1Title: d.feat1Title || prev.feat1Title,
          feat1Desc: d.feat1Desc || prev.feat1Desc,
          feat1Bullets: d.feat1Bullets || prev.feat1Bullets,
          feat2Title: d.feat2Title || prev.feat2Title,
          feat2Desc: d.feat2Desc || prev.feat2Desc,
          feat2Bullets: d.feat2Bullets || prev.feat2Bullets,
          founderNote: d.founderNote || prev.founderNote,
          faqs: Array.isArray(d.faqs) && d.faqs.length > 0 ? d.faqs : prev.faqs,
        }));

        setAiSuccessMsg('✨ AI successfully generated your title, tagline, highlights, feature showcases, and FAQs! You can review or edit below.');
      } else {
        alert(json?.error || 'Failed to auto-generate with AI');
      }
    } catch (e) {
      alert('AI Generation error: ' + e.message);
    } finally {
      setAiGenerating(false);
    }
  };

  // ── 5. Auto-Save Draft to LocalStorage ──
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(
          'stackdeal_vendor_submission_draft_v4',
          JSON.stringify({ formData, pricingTiers, salesTarget })
        );
        const now = new Date();
        setDraftSavedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } catch (e) {
        console.warn('Auto-save error:', e);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [formData, pricingTiers, salesTarget]);

  const clearDraft = () => {
    if (window.confirm('Are you sure you want to reset and clear all saved draft form data?')) {
      localStorage.removeItem('stackdeal_vendor_submission_draft_v4');
      window.location.reload();
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'title' && !prev.slug) {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
      }
      return updated;
    });
  };

  const handleWebsiteChange = (url) => {
    let domain = url.trim();
    domain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
    setFormData((prev) => ({
      ...prev,
      websiteUrl: url,
      vendorRedeemUrl: prev.vendorRedeemUrl === 'https://yourwebsite.com/redeem' || !prev.vendorRedeemUrl ? (domain ? `https://${domain}/redeem` : 'https://yourwebsite.com/redeem') : prev.vendorRedeemUrl,
    }));
  };

  // ── Dynamic Pricing Tiers Handlers ──
  const handleTierChange = (index, field, value) => {
    setPricingTiers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleToggleTierEnabled = (index) => {
    setPricingTiers((prev) => {
      const updated = [...prev];
      const current = updated[index]?.enabled !== false;
      updated[index] = { ...updated[index], enabled: !current };
      return updated;
    });
  };

  const handleSetRecommendedTier = (index) => {
    setPricingTiers((prev) => {
      return prev.map((t, idx) => ({
        ...t,
        isRecommended: idx === index,
      }));
    });
  };

  const handleAddCustomPlan = () => {
    const newIndex = pricingTiers.length + 1;
    const newTier = {
      id: `custom-tier-${Date.now()}`,
      tierName: `Plan Tier ${newIndex}`,
      price: 4999,
      originalPrice: 49990,
      totalCodes: 50,
      isRecommended: false,
      enabled: true,
      rawLicenseCodes: generateSampleCodesForTier(`Tier ${newIndex}`, 50),
      features: [
        { text: 'Full 5-Year Core Software Updates', included: true },
        { text: 'Priority WhatsApp Support', included: true },
        { text: 'Custom Webhooks & Integrations', included: true },
      ],
    };
    setPricingTiers((prev) => [...prev, newTier]);
  };

  const handleDeletePlan = (index) => {
    if (pricingTiers.length <= 1) {
      alert('You must have at least 1 plan configured.');
      return;
    }
    setPricingTiers((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Tier-wise auto code generator buttons
  const handleGenerateCodesForTier = (tierIdx) => {
    const tier = pricingTiers[tierIdx];
    if (!tier) return;
    const count = Number(tier.totalCodes) || 100;
    const generated = generateSampleCodesForTier(tier.tierName, count);
    handleTierChange(tierIdx, 'rawLicenseCodes', generated);
  };

  const handleGenerateAllCodes = () => {
    setPricingTiers((prev) => {
      return prev.map((tier) => {
        const count = Number(tier.totalCodes) || 100;
        const generated = generateSampleCodesForTier(tier.tierName, count);
        return { ...tier, rawLicenseCodes: generated };
      });
    });
  };

  // Direct File Upload Helper
  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldName);
    try {
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (json?.url) {
        setFormData((prev) => ({ ...prev, [fieldName]: json.url }));
      }
    } catch (err) {
      console.error('File upload error:', err);
    } finally {
      setUploadingField(null);
    }
  };

  const handleScreenshotsUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingField('screenshots');
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const data = new FormData();
        data.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: data });
        const json = await res.json();
        if (json?.url) uploadedUrls.push(json.url);
      }

      if (uploadedUrls.length > 0) {
        setFormData((prev) => ({
          ...prev,
          screenshotsText: prev.screenshotsText ? `${prev.screenshotsText}\n${uploadedUrls.join('\n')}` : uploadedUrls.join('\n'),
        }));
      }
    } catch (err) {
      console.error('Screenshots upload error:', err);
    } finally {
      setUploadingField(null);
    }
  };

  // FAQ Add / Remove
  const handleAddFaq = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }],
    }));
  };

  const handleFaqChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.faqs];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, faqs: updated };
    });
  };

  const handleRemoveFaq = (index) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, idx) => idx !== index),
    }));
  };

  // Step Wizard Helpers
  const currentStepIndex = TABS.findIndex((t) => t.id === activeFormTab);
  const progressPercent = Math.round(((currentStepIndex + 1) / TABS.length) * 100);

  const validateStep = (tabId) => {
    setErrorMsg('');
    if (tabId === 'basic') {
      if (!formData.title.trim()) return 'Please enter Software Title.';
      if (!formData.tagline.trim()) return 'Please enter a Tagline for your deal.';
      if (!formData.vendorName.trim()) return 'Please enter Company / Vendor Name.';
      const activePlans = pricingTiers.filter((t) => t.enabled !== false);
      if (activePlans.length === 0) return 'Please enable at least 1 pricing plan (e.g. Starter Pass).';
      for (const p of activePlans) {
        if (!p.price || p.price < 499) return `Please enter a valid price for "${p.tierName}".`;
        if (!p.totalCodes || p.totalCodes < 1) return `Please set the number of passes available for "${p.tierName}" (e.g. 180 or 91).`;
      }
    }
    if (tabId === 'media') {
      if (!formData.heroImage.trim()) return 'Please upload or provide a Hero Screenshot image.';
    }
    if (tabId === 'tldr') {
      if (!formData.tldrText.trim()) return 'Please enter at least 1 TL;DR bullet point.';
    }
    if (tabId === 'founder') {
      if (!formData.founderName.trim()) return 'Please enter Founder Name.';
      if (!formData.founderEmail.trim()) return 'Please enter Founder Work Email.';
      if (!formData.founderPhone.trim()) return 'Please enter Founder WhatsApp / Phone number.';
      if (!formData.vendorRedeemUrl.trim()) return 'Please enter License Redemption URL.';
      if (!formData.termsAgreed) return 'Please accept the 70/30 Revenue Share and 60-day Guarantee terms.';
    }
    return null;
  };

  const handleNextStep = () => {
    const error = validateStep(activeFormTab);
    if (error) {
      setErrorMsg(error);
      return;
    }
    if (currentStepIndex < TABS.length - 1) {
      setActiveFormTab(TABS[currentStepIndex + 1].id);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setActiveFormTab(TABS[currentStepIndex - 1].id);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  // Build combined deal object for live preview and submission
  const getCombinedDealPayload = () => {
    const autoSlug = (formData.slug || formData.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `saas-${Date.now()}`;

    const activePlans = pricingTiers.filter((t) => t.enabled !== false);
    const totalInventoryCount = activePlans.reduce((sum, t) => sum + (Number(t.totalCodes) || 100), 0);
    const lowestPrice = activePlans.length > 0 ? Math.min(...activePlans.map((t) => Number(t.price) || 1999)) : 1999;

    // Collect all codes across tiers
    const allCollectedCodes = [];
    activePlans.forEach((t) => {
      if (t.rawLicenseCodes) {
        const lines = t.rawLicenseCodes.split('\n').map((c) => c.trim()).filter(Boolean);
        allCollectedCodes.push(...lines);
      }
    });

    return {
      title: formData.title || 'Untitled Software Deal',
      slug: autoSlug,
      tagline: formData.tagline || '5-Year Access Pass for Indian Agencies',
      category: formData.category,
      websiteUrl: formData.websiteUrl,
      vendorName: formData.vendorName || 'Vendor Partner',
      vendorLogo: formData.vendorLogo || 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png',
      vendorLocation: formData.vendorLocation || 'Mumbai, India',
      foundedDate: formData.foundedDate || 'April 2023',
      teamSize: formData.teamSize || '1-10 employees',
      isSelect: true,
      status: 'Pending',
      
      tier1Price: lowestPrice,
      totalCodes: allCollectedCodes.length > 0 ? allCollectedCodes.length : totalInventoryCount,
      soldCount: 0,
      rating: 5.0,
      reviewsCount: 0,
      reviews: [],

      campaignDurationDays: Number(formData.campaignDurationDays) || 14,
      campaignEndDate: new Date(Date.now() + (Number(formData.campaignDurationDays) || 14) * 24 * 60 * 60 * 1000),
      launchDate: new Date(),

      heroImage: formData.heroImage,
      screenshot: formData.heroImage,
      videoUrl: sanitizeVideoUrl(formData.videoUrl),
      screenshots: formData.screenshotsText.split('\n').map((s) => s.trim()).filter(Boolean),
      tldr: formData.tldrText.split('\n').map((s) => s.trim()).filter(Boolean),
      terms: formData.termsText.split('\n').map((s) => s.trim()).filter(Boolean),
      termsAgreed: Boolean(formData.termsAgreed),

      atAGlance: {
        alternativeTo: formData.alternativeTo,
        integrations: formData.integrations,
        bestFor: formData.bestFor,
      },

      featureShowcases: [
        {
          title: formData.feat1Title,
          description: formData.feat1Desc,
          bullets: formData.feat1Bullets.split('\n').map((b) => b.trim()).filter(Boolean),
          imageUrl: formData.feat1Image,
        },
        {
          title: formData.feat2Title,
          description: formData.feat2Desc,
          bullets: formData.feat2Bullets.split('\n').map((b) => b.trim()).filter(Boolean),
          imageUrl: formData.feat2Image,
        },
      ],

      faqs: formData.faqs.filter((f) => f.question && f.question.trim()),

      pricingTiers: pricingTiers.map((t) => {
        const tierCodes = t.rawLicenseCodes
          ? t.rawLicenseCodes.split('\n').map((c) => c.trim()).filter(Boolean)
          : [];

        return {
          tierName: t.tierName,
          price: Number(t.price) || 1999,
          originalPrice: Number(t.originalPrice) || ((Number(t.price) || 1999) * 10),
          totalCodes: Number(t.totalCodes) || 100,
          soldCount: 0,
          isRecommended: Boolean(t.isRecommended),
          enabled: t.enabled !== false,
          licenseCodes: tierCodes,
          features: t.features || [],
        };
      }),

      founderName: formData.founderName,
      founderTitle: formData.founderTitle,
      founderAvatar: formData.founderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      founderLinkedin: formData.founderLinkedin,
      founderTwitter: formData.founderTwitter,
      founderNote: formData.founderNote,
      vendorRedeemUrl: formData.vendorRedeemUrl,
      founderContact: {
        email: formData.founderEmail,
        phone: formData.founderPhone,
      },

      payoutDetails: {
        payoutMethod: formData.payoutMethod || 'UPI',
        upiId: formData.upiId,
        accountHolderName: formData.accountHolderName,
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode,
        bankName: formData.bankName,
        panOrGstin: formData.panOrGstin,
      },

      licenseKeys: allCollectedCodes,
    };
  };

  const handleVendorSubmit = async (e) => {
    if (e) e.preventDefault();
    
    for (const tab of TABS) {
      const err = validateStep(tab.id);
      if (err) {
        setActiveFormTab(tab.id);
        setErrorMsg(err);
        return;
      }
    }

    setSaving(true);
    setErrorMsg('');

    try {
      const payload = getCombinedDealPayload();

      const res = await fetch('/api/admin/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data?.success) {
        localStorage.removeItem('stackdeal_vendor_submission_draft_v4');
        setSubmittedDeal(payload);
        setShowLivePreview(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setErrorMsg(data?.error || 'Failed to submit software. Please try again.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMsg('Network error. Please check connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex flex-col font-sans">
      <Navbar />

      {/* Orange Ticker Ribbon (#FF6B35) */}
      <div className="w-full bg-[#FF6B35] text-white py-2.5 overflow-hidden shadow-sm relative z-20">
        <div className="ticker-wrapper flex whitespace-nowrap">
          <div className="ticker-inner flex items-center gap-8 animate-ticker text-xs font-black uppercase tracking-wider">
            {[1, 2, 3, 4].map((_, i) => (
              <span key={i} className="inline-flex items-center gap-8">
                <span className="flex items-center gap-2"><Rocket className="w-3.5 h-3.5 text-amber-300" /> Keep 70% of Every Sale</span>
                <span className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-yellow-300" /> Instant UPI & Card Payouts</span>
                <span className="flex items-center gap-2"><Users className="w-3.5 h-3.5 text-blue-200" /> Access 50,000+ Indian Agency Founders</span>
                <span className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> 100% Tax Compliant GST Invoices</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">

        {/* Success Banner if submitted */}
        {submittedDeal ? (
          <div className="bg-white border-2 border-emerald-300 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-6 animate-fadeIn">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <div className="space-y-2 max-w-xl mx-auto">
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
                🔔 Admin Notification Sent
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
                "{submittedDeal.title}" Submitted for Admin Approval!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Our QA team will review your software images, pricing tiers, and integration parameters within 24 hours. You will receive an email confirmation at <span className="font-bold text-slate-900">{submittedDeal.founderContact?.email}</span> once approved.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowLivePreview(true)}
                className="px-6 py-3.5 bg-slate-950 hover:bg-slate-800 text-white text-xs font-black rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-amber-400" />
                <span>View Live Deal Page Preview</span>
              </button>

              <button
                onClick={() => setSubmittedDeal(null)}
                className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-2xl transition-all cursor-pointer"
              >
                Submit Another SaaS Tool
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* ── 1. Hero Revenue Split Header & 70/30 Calculator ── */}
            <div className="bg-gradient-to-br from-[#0A0F1E] via-[#11192E] to-[#17223F] rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-white/10 space-y-8">
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <span className="inline-flex items-center gap-1.5 bg-[#FF6B35] text-white text-[11px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" /> Founder Partner Program
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                    Launch Your 5-Year Pass to 50,000+ Indian Agencies
                  </h1>
                  <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
                    Zero upfront listing fees. Keep <span className="text-emerald-400 font-bold">70% of every sale</span> with automated bi-weekly UPI bank payouts & automated GST invoicing.
                  </p>
                </div>

                {/* Top Actions: Live Preview & Clear Draft */}
                <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setShowLivePreview(true)}
                    className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>👁️ Live Preview</span>
                  </button>

                  <button
                    type="button"
                    onClick={clearDraft}
                    title="Clear saved draft data"
                    className="p-3 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white rounded-2xl transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Interactive 70/30 Economics Simulator */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-black text-white uppercase tracking-wider">
                      70/30 Revenue Payout Simulator
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-white/10 px-2.5 py-1 rounded-full">
                    Bi-Weekly Direct Bank Payouts
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Sales Target Slider */}
                  <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-300">Target Passes Sold:</span>
                      <span className="text-base font-black text-amber-400">{salesTarget} passes</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="500"
                      step="10"
                      value={salesTarget}
                      onChange={(e) => setSalesTarget(Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                      <span>20 passes</span>
                      <span>180 passes (Target)</span>
                      <span>500 passes</span>
                    </div>
                  </div>

                  {/* Pass Price */}
                  <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-300">Starter Pass Price:</span>
                      <span className="text-base font-black text-emerald-400">₹{passPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 pt-2 font-medium">
                      Configured automatically from your enabled plans below in Step 1.
                    </p>
                  </div>
                </div>

                {/* Payout Totals */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/10">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Campaign Sales</div>
                    <div className="text-xl sm:text-2xl font-black text-white mt-1">₹{grossRevenue.toLocaleString('en-IN')}</div>
                  </div>

                  <div className="bg-emerald-950/40 rounded-2xl p-4 border border-emerald-500/30">
                    <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Your Net Payout (70%)</div>
                    <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">₹{vendorPayout.toLocaleString('en-IN')}</div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">StackDeal Cut (30%)</div>
                    <div className="text-xl sm:text-2xl font-black text-slate-300 mt-1">₹{stackdealCommission.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 1.5. 1-Click AI Vendor Listing Generator Card ── */}
            <div className="bg-gradient-to-r from-[#070B16] via-[#0E1528] to-[#17153B] border-2 border-[#FF6B35]/40 rounded-3xl p-6 shadow-xl space-y-4 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B35] to-[#2475FF] p-0.5 shadow-lg">
                    <div className="w-full h-full bg-[#070B16] rounded-2xl flex items-center justify-center text-[#FFD519]">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                      <span>1-Click AI Listing Copilot</span>
                      <span className="bg-[#FF6B35] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                        ⚡ 10 SEC AUTO-FILL
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      Enter your website URL or a short product pitch — AI will auto-write your title, highlights, feature showcases & FAQs!
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                <input
                  type="text"
                  placeholder="Enter Website URL or pitch (e.g. https://chatchacha.com or AI cold email automation tool)"
                  value={aiPromptInput}
                  onChange={(e) => setAiPromptInput(e.target.value)}
                  disabled={aiGenerating}
                  className="flex-1 w-full bg-white/10 border border-white/20 text-white text-xs font-bold p-3.5 rounded-2xl focus:bg-white/15 focus:outline-none focus:border-[#FF6B35] placeholder:text-slate-400 transition-all disabled:opacity-50"
                />

                <button
                  type="button"
                  onClick={handleAiAutoGenerate}
                  disabled={aiGenerating}
                  className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#FF6B35] to-[#FF8C35] hover:opacity-95 text-white text-xs font-black rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
                >
                  {aiGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-200" />
                      <span>AI Writing Listing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>⚡ Generate Listing with AI</span>
                    </>
                  )}
                </button>
              </div>

              {aiSuccessMsg && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-xs font-bold text-emerald-300 flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{aiSuccessMsg}</span>
                </div>
              )}
            </div>

            {/* ── 2. Wizard Progress Bar & Step Header ── */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-black text-slate-950 text-base flex items-center gap-2">
                    <Rocket className="w-4 h-4 text-[#FF6B35]" />
                    <span>Step {currentStepIndex + 1} of 6: {TABS[currentStepIndex].label.replace(/^[0-9]+\.\s*/, '')}</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    Progress: {progressPercent}% completed · {draftSavedTime ? `Draft saved (${draftSavedTime})` : 'Auto-saving enabled'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
                    ⚡ Auto-Draft Active
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-400 to-[#FF6B35] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto">
                {TABS.map((tab, idx) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveFormTab(tab.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      activeFormTab === tab.id
                        ? 'bg-[#FF6B35] text-white shadow-md font-black'
                        : idx < currentStepIndex
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {idx < currentStepIndex && <Check className="w-3 h-3 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* ── 3. Step Form Content Box ── */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-xl p-6 sm:p-10 space-y-8">

              {errorMsg && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-2xl flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleVendorSubmit} className="space-y-6">

                {/* ── TAB 1: BASIC & PRICING PLANS ── */}
                {activeFormTab === 'basic' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Software Title *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Chat Chacha — WhatsApp AI Marketing & Automation"
                          value={formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3.5 rounded-xl focus:bg-white focus:border-[#FF6B35] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Custom URL Slug *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. chat-chacha"
                          value={formData.slug}
                          onChange={(e) => handleInputChange('slug', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono font-bold p-3.5 rounded-xl focus:bg-white focus:border-[#FF6B35] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Catchy Tagline / Value Proposition *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Automate WhatsApp marketing broadcasts, AI chatbot recovery, and lead conversion with zero coding."
                        value={formData.tagline}
                        onChange={(e) => handleInputChange('tagline', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3.5 rounded-xl focus:bg-white focus:border-[#FF6B35] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Official Website URL *</label>
                        <input
                          type="url"
                          required
                          placeholder="https://www.chatchacha.in"
                          value={formData.websiteUrl}
                          onChange={(e) => handleWebsiteChange(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3.5 rounded-xl focus:bg-white focus:border-[#FF6B35] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Vendor / Company Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Chat Chacha Tech Private Limited"
                          value={formData.vendorName}
                          onChange={(e) => handleInputChange('vendorName', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3.5 rounded-xl focus:bg-white focus:border-[#FF6B35] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Company Logo Upload Box */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                          Company / Product Logo *
                        </label>
                        <span className="text-[10px] text-slate-500 font-bold">Square PNG / SVG recommended</span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 p-2 shadow-xs shrink-0 flex items-center justify-center overflow-hidden">
                          <img
                            src={formData.vendorLogo || 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png'}
                            alt="Logo preview"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.src = 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png';
                            }}
                          />
                        </div>

                        <div className="flex-1 w-full space-y-2">
                          <input
                            type="text"
                            placeholder="Logo Image URL (https://...)"
                            value={formData.vendorLogo}
                            onChange={(e) => handleInputChange('vendorLogo', e.target.value)}
                            className="w-full bg-white border border-slate-200 text-slate-900 text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                          />
                          <div className="flex items-center gap-2">
                            <label className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-xl cursor-pointer flex items-center gap-1.5 transition-all">
                              <Upload className="w-3.5 h-3.5" />
                              <span>{uploadingField === 'vendorLogo' ? 'Uploading Logo...' : 'Upload Company Logo File'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, 'vendorLogo')}
                              />
                            </label>
                            <span className="text-[10px] text-slate-500">PNG, SVG, JPG up to 5MB</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Category *</label>
                        <select
                          value={formData.category}
                          onChange={(e) => handleInputChange('category', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3.5 rounded-xl cursor-pointer focus:outline-none focus:border-[#FF6B35]"
                        >
                          <option value="WhatsApp Bots">💬 WhatsApp Tools & Bots</option>
                          <option value="AI & GEO SEO">🤖 AI & GEO SEO</option>
                          <option value="Lead Scrapers">🎯 Lead Scraping & B2B</option>
                          <option value="CRM & Sales">📊 CRM & Sales Automation</option>
                          <option value="Video & Design">🎨 Video & Design Tools</option>
                          <option value="Analytics">📈 Analytics & Reporting</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Headquarters Location</label>
                        <input
                          type="text"
                          placeholder="e.g. Mumbai, India"
                          value={formData.vendorLocation}
                          onChange={(e) => handleInputChange('vendorLocation', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3.5 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Founded Date</label>
                        <input
                          type="text"
                          placeholder="e.g. April 2023"
                          value={formData.foundedDate}
                          onChange={(e) => handleInputChange('foundedDate', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3.5 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                        />
                      </div>
                    </div>

                    {/* ── FLEXIBLE PRICING PLANS & INVENTORY PER TIER ── */}
                    <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-5 sm:p-6 space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3.5">
                        <div>
                          <h4 className="text-sm font-black text-slate-950 uppercase tracking-wider flex items-center gap-2">
                            <Tag className="w-4 h-4 text-[#FF6B35]" />
                            <span>Configure Your Deal Plans & Pass Limits</span>
                          </h4>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Starter: 180 Passes · Pro: 91 Passes · Agency: 30 Passes (Fully Customizable).
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={handleAddCustomPlan}
                          className="px-3.5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all self-start sm:self-auto shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5 text-amber-400" />
                          <span>Add Custom Plan</span>
                        </button>
                      </div>

                      {/* List of Dynamic Tiers */}
                      <div className="space-y-4">
                        {pricingTiers.map((tier, idx) => {
                          const isEnabled = tier.enabled !== false;

                          return (
                            <div
                              key={tier.id || idx}
                              className={`p-5 rounded-2xl border-2 transition-all space-y-4 ${
                                isEnabled
                                  ? tier.isRecommended
                                    ? 'bg-orange-50/50 border-[#FF6B35]/40 shadow-xs'
                                    : 'bg-white border-slate-200 shadow-xs'
                                  : 'bg-slate-100/70 border-slate-200 opacity-60'
                              }`}
                            >
                              {/* Top Bar: Enable Switch + Name + Controls */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  {/* Toggle Active Switch */}
                                  <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                      type="checkbox"
                                      checked={isEnabled}
                                      onChange={() => handleToggleTierEnabled(idx)}
                                      className="w-4 h-4 accent-[#FF6B35] rounded"
                                    />
                                    <span className={`text-xs font-black ${isEnabled ? 'text-slate-900' : 'text-slate-500'}`}>
                                      {isEnabled ? 'Plan Active' : 'Plan Disabled'}
                                    </span>
                                  </label>

                                  <input
                                    type="text"
                                    value={tier.tierName}
                                    onChange={(e) => handleTierChange(idx, 'tierName', e.target.value)}
                                    placeholder="e.g. Starter Pass"
                                    className="bg-slate-50 border border-slate-200 text-slate-900 text-xs font-black px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#FF6B35]"
                                  />
                                </div>

                                <div className="flex items-center gap-2">
                                  {/* Set as Recommended */}
                                  <button
                                    type="button"
                                    onClick={() => handleSetRecommendedTier(idx)}
                                    className={`px-3 py-1 rounded-xl text-[11px] font-black flex items-center gap-1 transition-all cursor-pointer ${
                                      tier.isRecommended
                                        ? 'bg-[#FF6B35] text-white shadow-xs'
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                                    }`}
                                  >
                                    <Star className={`w-3 h-3 ${tier.isRecommended ? 'fill-current' : ''}`} />
                                    <span>{tier.isRecommended ? '★ Most Popular' : 'Set as Popular'}</span>
                                  </button>

                                  {/* Delete Plan */}
                                  {pricingTiers.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleDeletePlan(idx)}
                                      className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded-lg cursor-pointer"
                                      title="Delete Plan"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Price, Original Price, and Pass Availability Inputs */}
                              {isEnabled && (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 border-t border-slate-100">
                                  <div>
                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                      5-Year Deal Price (₹) *
                                    </label>
                                    <input
                                      type="number"
                                      value={tier.price}
                                      onChange={(e) => handleTierChange(idx, 'price', Number(e.target.value))}
                                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-black p-2.5 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                      Original 5-Yr Cost (₹)
                                    </label>
                                    <input
                                      type="number"
                                      value={tier.originalPrice}
                                      onChange={(e) => handleTierChange(idx, 'originalPrice', Number(e.target.value))}
                                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-2.5 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                                      <span>Passes / Users Limit *</span>
                                      <span className="text-[10px] text-amber-600 font-black">Scarcity Limit</span>
                                    </label>
                                    <input
                                      type="number"
                                      value={tier.totalCodes || 100}
                                      onChange={(e) => handleTierChange(idx, 'totalCodes', Number(e.target.value))}
                                      placeholder="e.g. 180 or 91 passes"
                                      className="w-full bg-amber-50/50 border border-amber-300 text-slate-900 text-xs font-black p-2.5 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                )}

                {/* ── TAB 2: PLAN FEATURES BUILDER ── */}
                {activeFormTab === 'tiers' && (
                  <div className="space-y-4 animate-fadeIn">
                    <PlanFeaturesBuilder
                      pricingTiers={pricingTiers}
                      onChange={(updatedTiers) => setPricingTiers(updatedTiers)}
                    />
                  </div>
                )}

                {/* ── TAB 3: MEDIA & SCREENSHOTS (WITH DIRECT FILE UPLOAD) ── */}
                {activeFormTab === 'media' && (
                  <div className="space-y-6 animate-fadeIn">
                    
                    {/* Hero Image */}
                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                          Hero Product Screenshot Image *
                        </label>
                        <span className="text-[10px] text-slate-500 font-bold">Appears in main deal header & card preview</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        <div className="md:col-span-8 space-y-2">
                          <input
                            type="text"
                            required
                            placeholder="Paste image URL (https://...)"
                            value={formData.heroImage}
                            onChange={(e) => handleInputChange('heroImage', e.target.value)}
                            className="w-full bg-white border border-slate-200 text-slate-900 text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                          />
                          <div className="flex items-center gap-2">
                            <label className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-xl cursor-pointer flex items-center gap-1.5 transition-all">
                              <Upload className="w-3.5 h-3.5" />
                              <span>{uploadingField === 'heroImage' ? 'Uploading Image...' : 'Upload Image File'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, 'heroImage')}
                              />
                            </label>
                            <span className="text-[10px] text-slate-500">JPG, PNG, WebP up to 10MB</span>
                          </div>
                        </div>

                        <div className="md:col-span-4 aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm flex items-center justify-center">
                          {formData.heroImage ? (
                            <img src={formData.heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs text-slate-400 font-bold">No Image Selected</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Additional Screenshots */}
                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                          Additional Gallery Screenshots (1 per line or Upload Multiple)
                        </label>
                      </div>

                      <textarea
                        rows={3}
                        placeholder="https://image1.jpg\nhttps://image2.jpg"
                        value={formData.screenshotsText}
                        onChange={(e) => handleInputChange('screenshotsText', e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-900 text-xs font-mono p-3 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                      />

                      <label className="inline-flex px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-xl cursor-pointer items-center gap-1.5 transition-all">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingField === 'screenshots' ? 'Uploading...' : 'Upload Screenshot Files'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleScreenshotsUpload}
                        />
                      </label>
                    </div>

                    {/* Optional Video Walkthrough with Auto-Embed Parsing */}
                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                      <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                        YouTube Demo / Loom Video URL (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. https://www.youtube.com/watch?v=... or https://youtu.be/... (auto-sanitized)"
                        value={formData.videoUrl}
                        onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-900 text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                      />
                      <p className="text-[10px] text-slate-500 font-medium">
                        Standard YouTube links will automatically be converted to embed format for flawless video playback. If left blank, buyers will see your screenshots.
                      </p>
                    </div>

                  </div>
                )}

                {/* ── TAB 4: TL;DR, SPECS & CUSTOM FAQS ── */}
                {activeFormTab === 'tldr' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                        TL;DR Key Value Props (1 bullet per line) *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formData.tldrText}
                        onChange={(e) => handleInputChange('tldrText', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium p-3.5 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Alternative To</label>
                        <input
                          type="text"
                          placeholder="e.g. Expensive foreign SaaS"
                          value={formData.alternativeTo}
                          onChange={(e) => handleInputChange('alternativeTo', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3.5 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Integrations</label>
                        <input
                          type="text"
                          placeholder="e.g. Shopify, Razorpay, Zapier"
                          value={formData.integrations}
                          onChange={(e) => handleInputChange('integrations', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3.5 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Best For</label>
                        <input
                          type="text"
                          placeholder="e.g. Digital Agencies, E-commerce"
                          value={formData.bestFor}
                          onChange={(e) => handleInputChange('bestFor', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3.5 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                        />
                      </div>
                    </div>

                    {/* ── Interactive Custom FAQ Builder ── */}
                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                            Frequently Asked Questions (FAQs)
                          </h4>
                          <p className="text-[11px] text-slate-500 font-medium">
                            Add custom questions to answer buyer doubts and boost conversions.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleAddFaq}
                          className="px-3.5 py-1.5 bg-[#FF6B35] hover:bg-[#E85A24] text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Question</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {formData.faqs.map((faq, fIdx) => (
                          <div key={fIdx} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs relative">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                FAQ #{fIdx + 1}
                              </span>
                              {formData.faqs.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFaq(fIdx)}
                                  className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            <input
                              type="text"
                              placeholder="e.g. Can I upgrade my license tier later?"
                              value={faq.question}
                              onChange={(e) => handleFaqChange(fIdx, 'question', e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3 rounded-lg focus:outline-none focus:border-[#FF6B35]"
                            />

                            <textarea
                              rows={2}
                              placeholder="e.g. Yes, you can upgrade from Starter to Pro Pass anytime by paying the price difference."
                              value={faq.answer}
                              onChange={(e) => handleFaqChange(fIdx, 'answer', e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium p-3 rounded-lg focus:outline-none focus:border-[#FF6B35]"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* ── TAB 5: FEATURE SHOWCASES (WITH DIRECT IMAGE UPLOAD) ── */}
                {activeFormTab === 'features' && (
                  <div className="space-y-6 animate-fadeIn">
                    
                    {/* Feature 1 */}
                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Feature Showcase #1</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Feature Title</label>
                          <input
                            type="text"
                            value={formData.feat1Title}
                            onChange={(e) => handleInputChange('feat1Title', e.target.value)}
                            className="w-full bg-white border border-slate-200 text-slate-900 text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Feature Screenshot URL</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={formData.feat1Image}
                              onChange={(e) => handleInputChange('feat1Image', e.target.value)}
                              className="w-full bg-white border border-slate-200 text-slate-900 text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                            />
                            <label className="p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl cursor-pointer shrink-0">
                              <Upload className="w-4 h-4" />
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, 'feat1Image')}
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Feature Description</label>
                        <textarea
                          rows={2}
                          value={formData.feat1Desc}
                          onChange={(e) => handleInputChange('feat1Desc', e.target.value)}
                          className="w-full bg-white border border-slate-200 text-slate-900 text-xs font-medium p-3 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                        />
                      </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Feature Showcase #2</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Feature Title</label>
                          <input
                            type="text"
                            value={formData.feat2Title}
                            onChange={(e) => handleInputChange('feat2Title', e.target.value)}
                            className="w-full bg-white border border-slate-200 text-slate-900 text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Feature Screenshot URL</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={formData.feat2Image}
                              onChange={(e) => handleInputChange('feat2Image', e.target.value)}
                              className="w-full bg-white border border-slate-200 text-slate-900 text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                            />
                            <label className="p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl cursor-pointer shrink-0">
                              <Upload className="w-4 h-4" />
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, 'feat2Image')}
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Feature Description</label>
                        <textarea
                          rows={2}
                          value={formData.feat2Desc}
                          onChange={(e) => handleInputChange('feat2Desc', e.target.value)}
                          className="w-full bg-white border border-slate-200 text-slate-900 text-xs font-medium p-3 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                        />
                      </div>
                    </div>

                  </div>
                )}

                {/* ── TAB 6: FOUNDER, 70% PAYOUTS & TIER-WISE LICENSE CODES ── */}
                {activeFormTab === 'founder' && (
                  <div className="space-y-6 animate-fadeIn">
                    
                    {/* Founder Photo Upload Box */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                          Founder Profile Picture *
                        </label>
                        <span className="text-[10px] text-slate-500 font-bold">Square photo recommended</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-200 border border-slate-300 shadow-xs shrink-0 flex items-center justify-center">
                          <img
                            src={formData.founderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                            alt="Founder photo preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
                            }}
                          />
                        </div>

                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            placeholder="Founder Photo URL (https://...)"
                            value={formData.founderAvatar}
                            onChange={(e) => handleInputChange('founderAvatar', e.target.value)}
                            className="w-full bg-white border border-slate-200 text-slate-900 text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                          />
                          <div className="flex items-center gap-2">
                            <label className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-xl cursor-pointer flex items-center gap-1.5 transition-all">
                              <Upload className="w-3.5 h-3.5" />
                              <span>{uploadingField === 'founderAvatar' ? 'Uploading Photo...' : 'Upload Founder Picture'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, 'founderAvatar')}
                              />
                            </label>
                            <span className="text-[10px] text-slate-500">JPG, PNG up to 5MB</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Founder Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ujjawal Kumar"
                          value={formData.founderName}
                          onChange={(e) => handleInputChange('founderName', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3.5 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Founder Title *</label>
                        <input
                          type="text"
                          required
                          placeholder="Founder & CEO"
                          value={formData.founderTitle}
                          onChange={(e) => handleInputChange('founderTitle', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3.5 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                        />
                      </div>
                    </div>

                    {/* Social Links (LinkedIn & Twitter/X) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <LinkedInIcon className="w-3.5 h-3.5 text-[#0A66C2] fill-current" />
                          <span>Founder LinkedIn Profile URL</span>
                        </label>
                        <input
                          type="url"
                          placeholder="https://www.linkedin.com/in/ujjawal-kumar"
                          value={formData.founderLinkedin}
                          onChange={(e) => handleInputChange('founderLinkedin', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3.5 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <TwitterXIcon className="w-3.5 h-3.5 text-slate-900 fill-current" />
                          <span>Founder Twitter / X Profile URL</span>
                        </label>
                        <input
                          type="text"
                          placeholder="https://x.com/ujjawal_dev or @handle"
                          value={formData.founderTwitter}
                          onChange={(e) => handleInputChange('founderTwitter', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3.5 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                          Founder Work Email *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="founder@company.com"
                          value={formData.founderEmail}
                          onChange={(e) => handleInputChange('founderEmail', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3.5 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                          Founder WhatsApp / Phone Number *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="+91 98765 43210"
                          value={formData.founderPhone}
                          onChange={(e) => handleInputChange('founderPhone', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3.5 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                        License Redemption URL (Where buyers activate their 5-Yr pass) *
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://yourproduct.com/redeem"
                        value={formData.vendorRedeemUrl}
                        onChange={(e) => handleInputChange('vendorRedeemUrl', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold p-3.5 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                      />
                    </div>

                    {/* ── 70% Revenue Share Payout Banking / UPI Details ── */}
                    <div className="p-5 bg-emerald-50/60 border-2 border-emerald-200/80 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-emerald-600" />
                          <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider">
                            70% Payout Banking & UPI Details *
                          </h4>
                        </div>
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          Bi-Weekly Direct Transfer
                        </span>
                      </div>

                      {/* Payment Method Selector */}
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                          <input
                            type="radio"
                            name="payoutMethod"
                            checked={formData.payoutMethod === 'UPI'}
                            onChange={() => handleInputChange('payoutMethod', 'UPI')}
                            className="accent-emerald-600"
                          />
                          <span>UPI ID (Instant Direct)</span>
                        </label>
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                          <input
                            type="radio"
                            name="payoutMethod"
                            checked={formData.payoutMethod === 'BANK'}
                            onChange={() => handleInputChange('payoutMethod', 'BANK')}
                            className="accent-emerald-600"
                          />
                          <span>Bank Account (NEFT / IMPS)</span>
                        </label>
                      </div>

                      {formData.payoutMethod === 'UPI' ? (
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            UPI ID (VPA) *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. founder@okaxis or company@upi"
                            value={formData.upiId}
                            onChange={(e) => handleInputChange('upiId', e.target.value)}
                            className="w-full bg-white border border-slate-200 text-slate-900 text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Account Holder Name *</label>
                            <input
                              type="text"
                              placeholder="Name on bank account"
                              value={formData.accountHolderName}
                              onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                              className="w-full bg-white border border-slate-200 text-slate-900 text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-emerald-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Bank Account Number *</label>
                            <input
                              type="text"
                              placeholder="Account number"
                              value={formData.accountNumber}
                              onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                              className="w-full bg-white border border-slate-200 text-slate-900 text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-emerald-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Bank IFSC Code *</label>
                            <input
                              type="text"
                              placeholder="e.g. HDFC0001234"
                              value={formData.ifscCode}
                              onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                              className="w-full bg-white border border-slate-200 text-slate-900 text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-emerald-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Bank Name</label>
                            <input
                              type="text"
                              placeholder="e.g. HDFC Bank"
                              value={formData.bankName}
                              onChange={(e) => handleInputChange('bankName', e.target.value)}
                              className="w-full bg-white border border-slate-200 text-slate-900 text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Company GSTIN or PAN (Optional for Tax Invoice)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 29AAAAA0000A1Z5 or ABCDE1234F"
                          value={formData.panOrGstin}
                          onChange={(e) => handleInputChange('panOrGstin', e.target.value)}
                          className="w-full bg-white border border-slate-200 text-slate-900 text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    {/* ── TIER-WISE LICENSE CODES & DELIVERY SETUP ── */}
                    <div className="p-5 sm:p-6 bg-slate-50 border-2 border-slate-200 rounded-3xl space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3.5">
                        <div className="flex items-center gap-2">
                          <Key className="w-4 h-4 text-amber-500" />
                          <div>
                            <h4 className="text-sm font-black text-slate-950 uppercase tracking-wider">
                              Plan-Wise License Codes & Delivery Setup
                            </h4>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                              Pre-filled with 180 Starter, 91 Pro, and 30 Agency unique codes ready for delivery.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleGenerateAllCodes}
                          className="px-3.5 py-2 bg-[#FF6B35] hover:bg-[#E85A24] text-white text-xs font-black rounded-xl flex items-center gap-1.5 cursor-pointer transition-all self-start sm:self-auto shadow-xs"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>⚡ Regenerate All 301 Codes</span>
                        </button>
                      </div>

                      {/* Boxes for each Active Plan */}
                      <div className="space-y-4">
                        {activeTiers.map((tier) => {
                          const realIdx = pricingTiers.findIndex((t) => t.tierName === tier.tierName);
                          const currentCodes = tier.rawLicenseCodes ? tier.rawLicenseCodes.split('\n').map((c) => c.trim()).filter(Boolean) : [];
                          const targetCount = Number(tier.totalCodes) || 100;
                          const isFilled = currentCodes.length >= targetCount;

                          return (
                            <div key={tier.id || tier.tierName} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B35]" />
                                  <span className="font-black text-slate-900 text-xs sm:text-sm">{tier.tierName}</span>
                                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                    ₹{(tier.price || 0).toLocaleString('en-IN')} · Target: {targetCount} Users
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleGenerateCodesForTier(realIdx)}
                                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-black rounded-lg border border-amber-200 flex items-center gap-1 cursor-pointer transition-all"
                                  >
                                    <Zap className="w-3 h-3 text-amber-600" />
                                    <span>Auto-Generate {targetCount} Codes</span>
                                  </button>

                                  {currentCodes.length > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => handleTierChange(realIdx, 'rawLicenseCodes', '')}
                                      className="px-2.5 py-1.5 text-slate-400 hover:text-red-600 text-[11px] font-bold rounded-lg cursor-pointer"
                                    >
                                      Clear
                                    </button>
                                  )}
                                </div>
                              </div>

                              <textarea
                                rows={3}
                                placeholder={`Paste custom license keys for ${tier.tierName} (1 code per line)... or click 'Auto-Generate ${targetCount} Codes' above.`}
                                value={tier.rawLicenseCodes || ''}
                                onChange={(e) => handleTierChange(realIdx, 'rawLicenseCodes', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono p-3 rounded-xl focus:bg-white focus:outline-none focus:border-[#FF6B35]"
                              />

                              <div className="flex items-center justify-between text-[11px] font-bold">
                                <span className={currentCodes.length > 0 ? 'text-emerald-700 font-black' : 'text-slate-500'}>
                                  {currentCodes.length > 0
                                    ? `🟢 ${currentCodes.length} / ${targetCount} codes ready in inventory`
                                    : '⚡ Automated StackDeal key generation active if left empty'}
                                </span>
                                {currentCodes.length > 0 && (
                                  <span className="text-slate-400 text-[10px]">
                                    {isFilled ? '✓ Target Met' : `Need ${targetCount - currentCodes.length} more codes`}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Terms & Agreement Checkbox */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.termsAgreed}
                          onChange={(e) => handleInputChange('termsAgreed', e.target.checked)}
                          className="mt-0.5 w-4 h-4 accent-[#FF6B35] rounded"
                        />
                        <span className="text-xs font-bold text-slate-700 leading-relaxed">
                          I agree to the <span className="text-[#FF6B35]">70/30 Revenue Share terms</span>, guarantee 5 years of software access & updates to verified buyers, and honor the 60-day customer money-back policy.
                        </span>
                      </label>
                    </div>

                  </div>
                )}

                {/* ── Wizard Step Action Controls ── */}
                <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  
                  {/* Left: Previous Button or Live Preview */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {currentStepIndex > 0 && (
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Previous Step</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setShowLivePreview(true)}
                      className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Eye className="w-4 h-4 text-amber-400" />
                      <span>Live Preview</span>
                    </button>
                  </div>

                  {/* Right: Continue Next or Submit */}
                  <div className="w-full sm:w-auto">
                    {currentStepIndex < TABS.length - 1 ? (
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="w-full sm:w-auto px-8 py-3.5 bg-[#FF6B35] hover:bg-[#E85A24] text-white font-black text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Save & Continue to Step {currentStepIndex + 2}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={saving}
                        className="w-full sm:w-auto px-10 py-4 bg-[#FF6B35] hover:bg-[#E85A24] disabled:opacity-50 text-white font-black text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {saving ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Rocket className="w-4 h-4" />
                            <span>Submit for Admin Approval</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                </div>

              </form>

            </div>
          </>
        )}

      </main>

      {/* ── Interactive Live Deal Preview Modal ── */}
      <VendorDealPreviewModal
        isOpen={showLivePreview}
        onClose={() => setShowLivePreview(false)}
        deal={getCombinedDealPayload()}
        onSubmit={() => handleVendorSubmit()}
        isSubmitting={saving}
      />

      <Footer />
    </div>
  );
}
