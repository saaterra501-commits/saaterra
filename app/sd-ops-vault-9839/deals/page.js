'use client';

import { useState, useEffect } from 'react';
import PlanFeaturesBuilder from '@/components/PlanFeaturesBuilder';
import VendorDealPreviewModal from '@/components/VendorDealPreviewModal';
import {
  Plus, Tag, Edit3, Trash2, CheckCircle2, Sparkles, Flame, Clock, Eye, Save,
  RefreshCw, Video, Image as ImageIcon, FileText, Layout, Layers, ShieldCheck, User, Globe,
  Bell, Check, X, AlertCircle, Upload, Key, CreditCard, Star, DollarSign, HelpCircle,
  ExternalLink, ChevronDown, CheckSquare
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

function generateCodesForTier(tierName, count) {
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

export default function AdminDealsPage() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState('basic');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Pending' | 'Active'
  const [uploadingField, setUploadingField] = useState(null);

  // Preview Modal State
  const [previewDeal, setPreviewDeal] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const emptyDeal = {
    title: '',
    slug: '',
    tagline: '',
    category: 'WhatsApp Bots',
    websiteUrl: 'https://www.chatchacha.in',
    vendorName: '',
    vendorLogo: 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png',
    vendorLocation: 'Bengaluru, India',
    foundedDate: 'April 2023',
    teamSize: '1-10 employees',
    isSelect: true,
    status: 'Pending',
    
    campaignDurationDays: 14,

    pricingTiers: [
      {
        id: 'starter',
        tierName: 'Starter Pass',
        price: 1999,
        originalPrice: 24000,
        totalCodes: 180,
        isRecommended: false,
        enabled: true,
        rawLicenseCodes: generateCodesForTier('Starter Pass', 180),
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
        totalCodes: 91,
        isRecommended: true,
        enabled: true,
        rawLicenseCodes: generateCodesForTier('Pro Pass', 91),
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
        totalCodes: 30,
        isRecommended: false,
        enabled: true,
        rawLicenseCodes: generateCodesForTier('Agency Pass', 30),
        features: [
          { text: 'Everything in Pro Pass', included: true },
          { text: 'Unlimited team seats & workspaces', included: true },
          { text: '100% White-Label (Custom Domain)', included: true },
          { text: 'Client Sub-Accounts & Reseller rights', included: true },
          { text: 'Dedicated 1-on-1 Account Manager', included: true },
          { text: 'Native Razorpay UPI Checkout Widget', included: true },
        ],
      },
    ],

    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    screenshotsText: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop\nhttps://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
    
    tldrText: '1-Click automated WhatsApp broadcasts & drip sequences\nRecover abandoned carts automatically via AI WhatsApp chatbots\nAccept direct payments inside chat via UPI, PhonePe & GPay',
    
    alternativeTo: 'Interakt, WATI, ManyChat ($100+/month)',
    integrations: 'Shopify, WooCommerce, Razorpay, Google Sheets, Zapier',
    bestFor: 'Digital Marketing Agencies, Freelancers, E-commerce Founders',

    feat1Title: 'High-Impact Automated Workflows',
    feat1Desc: 'Empower your team to execute complex campaigns in seconds without technical knowledge.',
    feat1Bullets: 'Zero setup friction with intuitive dashboard\nExport analytics reports in 1 click\nMulti-user team collaboration support',
    feat1Image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',

    feat2Title: 'Built Specifically for Indian Market Growth',
    feat2Desc: 'Optimized for high conversion rates, speed, and seamless customer onboarding.',
    feat2Bullets: 'Native INR pricing and Indian payment options\nLightning-fast cloud servers\n24/7 Priority WhatsApp technical assistance',
    feat2Image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',

    faqs: [
      {
        question: 'How do customers redeem the 5-Year Pass after purchase?',
        answer: 'Buyers receive an instant unique license key and redemption URL on StackDeal immediately upon payment confirmation.'
      },
      {
        question: 'Are future software updates included?',
        answer: 'Yes, all core product feature updates and bug fixes for the next 5 years are 100% included in the pass.'
      },
      {
        question: 'How does the 60-day refund policy work?',
        answer: 'Buyers have 60 full days to test the software. If unsatisfied, a 100% full refund is issued with zero questions asked.'
      }
    ],

    founderName: 'Ujjawal Kumar',
    founderTitle: 'Founder & CEO',
    founderEmail: 'ujjawal@stackdeal.in',
    founderPhone: '+91 98765 43210',
    founderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    founderLinkedin: 'https://www.linkedin.com/in/ujjawal-kumar',
    founderTwitter: 'https://x.com/ujjawal_dev',
    founderNote: 'We built this software to solve real agency bottlenecks without burning cash on overpriced monthly subscriptions.',
    vendorRedeemUrl: 'https://www.chatchacha.in/redeem',
    termsText: '5-Year Access Pass to software updates.\nMust redeem license code within 60 days of purchase.\n60-Day Money-Back Guarantee included.',

    payoutMethod: 'UPI',
    upiId: 'ujjawal@okaxis',
    accountHolderName: 'Ujjawal Kumar',
    accountNumber: '919876543210',
    ifscCode: 'HDFC0001234',
    bankName: 'HDFC Bank',
    panOrGstin: 'ABCDE1234F',
  };

  const [editingDeal, setEditingDeal] = useState(emptyDeal);

  const fetchAdminDeals = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/deals');
      const data = await res.json();
      if (data?.deals) {
        setDeals(data.deals);
      }
    } catch (err) {
      console.error('Failed to fetch admin deals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminDeals();
  }, []);

  const handleStatusChange = async (slug, newStatus) => {
    try {
      const res = await fetch('/api/admin/deals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, status: newStatus }),
      });

      if (res.ok) {
        setStatusMsg(`Deal "${slug}" status updated to ${newStatus}. Live across StackDeal!`);
        setTimeout(() => setStatusMsg(''), 4000);
        await fetchAdminDeals();
      }
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  const handleDelete = async (slug) => {
    if (!confirm(`Are you sure you want to permanently delete "${slug}"?`)) return;
    try {
      const res = await fetch(`/api/admin/deals?slug=${slug}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusMsg(`Deal ${slug} deleted successfully.`);
        setTimeout(() => setStatusMsg(''), 3000);
        await fetchAdminDeals();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleEditClick = (deal) => {
    const screenshotsText = (deal.screenshots || []).join('\n');
    const tldrText = (deal.tldr || []).join('\n');
    const termsText = (deal.terms || []).join('\n');
    const f1 = deal.featureShowcases?.[0] || {};
    const f2 = deal.featureShowcases?.[1] || {};

    const formattedTiers = (deal.pricingTiers && deal.pricingTiers.length > 0)
      ? deal.pricingTiers.map((t, idx) => ({
          ...t,
          id: t.id || `tier-${idx}`,
          rawLicenseCodes: Array.isArray(t.licenseCodes) && t.licenseCodes.length > 0
            ? t.licenseCodes.join('\n')
            : t.rawLicenseCodes || '',
        }))
      : emptyDeal.pricingTiers;

    setEditingDeal({
      ...emptyDeal,
      ...deal,
      heroImage: deal.heroImage || deal.screenshot || emptyDeal.heroImage,
      screenshotsText: screenshotsText || emptyDeal.screenshotsText,
      tldrText: tldrText || emptyDeal.tldrText,
      termsText: termsText || emptyDeal.termsText,
      feat1Title: f1.title || emptyDeal.feat1Title,
      feat1Desc: f1.description || emptyDeal.feat1Desc,
      feat1Bullets: (f1.bullets || []).join('\n') || emptyDeal.feat1Bullets,
      feat1Image: f1.imageUrl || emptyDeal.feat1Image,
      feat2Title: f2.title || emptyDeal.feat2Title,
      feat2Desc: f2.description || emptyDeal.feat2Desc,
      feat2Bullets: (f2.bullets || []).join('\n') || emptyDeal.feat2Bullets,
      feat2Image: f2.imageUrl || emptyDeal.feat2Image,
      alternativeTo: deal.atAGlance?.alternativeTo || emptyDeal.alternativeTo,
      integrations: deal.atAGlance?.integrations || emptyDeal.integrations,
      bestFor: deal.atAGlance?.bestFor || emptyDeal.bestFor,
      pricingTiers: formattedTiers,
      faqs: deal.faqs && deal.faqs.length > 0 ? deal.faqs : emptyDeal.faqs,
      founderName: deal.founderName || emptyDeal.founderName,
      founderTitle: deal.founderTitle || emptyDeal.founderTitle,
      founderEmail: deal.founderContact?.email || deal.founderEmail || emptyDeal.founderEmail,
      founderPhone: deal.founderContact?.phone || deal.founderPhone || emptyDeal.founderPhone,
      founderAvatar: deal.founderAvatar || emptyDeal.founderAvatar,
      founderLinkedin: deal.founderLinkedin || emptyDeal.founderLinkedin,
      founderTwitter: deal.founderTwitter || emptyDeal.founderTwitter,
      founderNote: deal.founderNote || emptyDeal.founderNote,
      vendorRedeemUrl: deal.vendorRedeemUrl || emptyDeal.vendorRedeemUrl,
      payoutMethod: deal.payoutDetails?.payoutMethod || emptyDeal.payoutMethod,
      upiId: deal.payoutDetails?.upiId || emptyDeal.upiId,
      accountHolderName: deal.payoutDetails?.accountHolderName || emptyDeal.accountHolderName,
      accountNumber: deal.payoutDetails?.accountNumber || emptyDeal.accountNumber,
      ifscCode: deal.payoutDetails?.ifscCode || emptyDeal.ifscCode,
      bankName: deal.payoutDetails?.bankName || emptyDeal.bankName,
      panOrGstin: deal.payoutDetails?.panOrGstin || emptyDeal.panOrGstin,
    });

    setShowAddForm(true);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleOpenPreview = (deal) => {
    setPreviewDeal(deal);
    setShowPreviewModal(true);
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
        setEditingDeal((prev) => ({ ...prev, [fieldName]: json.url }));
      }
    } catch (err) {
      console.error('File upload error:', err);
    } finally {
      setUploadingField(null);
    }
  };

  // Pricing Tiers Handlers
  const handleTierChange = (index, field, value) => {
    setEditingDeal((prev) => {
      const updated = [...(prev.pricingTiers || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, pricingTiers: updated };
    });
  };

  const handleToggleTierEnabled = (index) => {
    setEditingDeal((prev) => {
      const updated = [...(prev.pricingTiers || [])];
      const curr = updated[index]?.enabled !== false;
      updated[index] = { ...updated[index], enabled: !curr };
      return { ...prev, pricingTiers: updated };
    });
  };

  const handleSetRecommendedTier = (index) => {
    setEditingDeal((prev) => {
      const updated = (prev.pricingTiers || []).map((t, idx) => ({
        ...t,
        isRecommended: idx === index,
      }));
      return { ...prev, pricingTiers: updated };
    });
  };

  const handleAddCustomPlan = () => {
    setEditingDeal((prev) => {
      const currentList = prev.pricingTiers || [];
      const newIdx = currentList.length + 1;
      const newTier = {
        id: `custom-tier-${Date.now()}`,
        tierName: `Plan Tier ${newIdx}`,
        price: 4999,
        originalPrice: 49990,
        totalCodes: 50,
        isRecommended: false,
        enabled: true,
        rawLicenseCodes: generateCodesForTier(`Tier ${newIdx}`, 50),
        features: [
          { text: 'Full 5-Year Core Software Updates', included: true },
          { text: 'Priority WhatsApp Support', included: true },
        ],
      };
      return { ...prev, pricingTiers: [...currentList, newTier] };
    });
  };

  const handleDeletePlan = (index) => {
    if ((editingDeal.pricingTiers || []).length <= 1) {
      alert('Must have at least 1 pricing plan.');
      return;
    }
    setEditingDeal((prev) => ({
      ...prev,
      pricingTiers: prev.pricingTiers.filter((_, idx) => idx !== index),
    }));
  };

  // FAQ Handlers
  const handleAddFaq = () => {
    setEditingDeal((prev) => ({
      ...prev,
      faqs: [...(prev.faqs || []), { question: '', answer: '' }],
    }));
  };

  const handleFaqChange = (index, field, value) => {
    setEditingDeal((prev) => {
      const updated = [...(prev.faqs || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, faqs: updated };
    });
  };

  const handleRemoveFaq = (index) => {
    setEditingDeal((prev) => ({
      ...prev,
      faqs: (prev.faqs || []).filter((_, idx) => idx !== index),
    }));
  };

  const handleSaveDeal = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const slug = editingDeal.slug || editingDeal.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const screenshots = (editingDeal.screenshotsText || '').split('\n').map((s) => s.trim()).filter(Boolean);
      const tldr = (editingDeal.tldrText || '').split('\n').map((s) => s.trim()).filter(Boolean);
      const terms = (editingDeal.termsText || '').split('\n').map((s) => s.trim()).filter(Boolean);

      const featureShowcases = [
        {
          title: editingDeal.feat1Title,
          description: editingDeal.feat1Desc,
          bullets: (editingDeal.feat1Bullets || '').split('\n').map((b) => b.trim()).filter(Boolean),
          imageUrl: editingDeal.feat1Image,
        },
        {
          title: editingDeal.feat2Title,
          description: editingDeal.feat2Desc,
          bullets: (editingDeal.feat2Bullets || '').split('\n').map((b) => b.trim()).filter(Boolean),
          imageUrl: editingDeal.feat2Image,
        },
      ];

      const activePlans = (editingDeal.pricingTiers || []).filter((t) => t.enabled !== false);
      const lowestPrice = activePlans.length > 0 ? Math.min(...activePlans.map((t) => Number(t.price) || 1999)) : 1999;
      const totalInventory = activePlans.reduce((sum, t) => sum + (Number(t.totalCodes) || 100), 0);

      // Collect license keys
      const allCollectedCodes = [];
      const formattedPricingTiers = (editingDeal.pricingTiers || []).map((t) => {
        const tierCodes = t.rawLicenseCodes
          ? t.rawLicenseCodes.split('\n').map((c) => c.trim()).filter(Boolean)
          : [];
        allCollectedCodes.push(...tierCodes);

        return {
          tierName: t.tierName,
          price: Number(t.price) || 1999,
          originalPrice: Number(t.originalPrice) || ((Number(t.price) || 1999) * 10),
          totalCodes: Number(t.totalCodes) || 100,
          soldCount: t.soldCount || 0,
          isRecommended: Boolean(t.isRecommended),
          enabled: t.enabled !== false,
          licenseCodes: tierCodes,
          features: t.features || [],
        };
      });

      const payload = {
        ...editingDeal,
        slug,
        isSelect: true,
        status: editingDeal.status || 'Active',
        tier1Price: lowestPrice,
        totalCodes: allCollectedCodes.length > 0 ? allCollectedCodes.length : totalInventory,
        heroImage: editingDeal.heroImage,
        screenshot: editingDeal.heroImage,
        screenshots,
        tldr,
        terms,
        featureShowcases,
        pricingTiers: formattedPricingTiers,
        faqs: (editingDeal.faqs || []).filter((f) => f.question && f.question.trim()),
        atAGlance: {
          alternativeTo: editingDeal.alternativeTo,
          integrations: editingDeal.integrations,
          bestFor: editingDeal.bestFor,
        },
        founderName: editingDeal.founderName,
        founderTitle: editingDeal.founderTitle,
        founderAvatar: editingDeal.founderAvatar,
        founderLinkedin: editingDeal.founderLinkedin,
        founderTwitter: editingDeal.founderTwitter,
        founderNote: editingDeal.founderNote,
        vendorRedeemUrl: editingDeal.vendorRedeemUrl,
        founderContact: {
          email: editingDeal.founderEmail,
          phone: editingDeal.founderPhone,
        },
        payoutDetails: {
          payoutMethod: editingDeal.payoutMethod || 'UPI',
          upiId: editingDeal.upiId,
          accountHolderName: editingDeal.accountHolderName,
          accountNumber: editingDeal.accountNumber,
          ifscCode: editingDeal.ifscCode,
          bankName: editingDeal.bankName,
          panOrGstin: editingDeal.panOrGstin,
        },
        licenseKeys: allCollectedCodes,
      };

      const res = await fetch('/api/admin/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSavedMsg(true);
        setTimeout(() => setSavedMsg(false), 3500);
        setShowAddForm(false);
        await fetchAdminDeals();
      }
    } catch (err) {
      console.error('Save deal error:', err);
    } finally {
      setSaving(false);
    }
  };

  const pendingDeals = deals.filter((d) => d.status === 'Pending');
  const activeDeals = deals.filter((d) => d.status === 'Active' || !d.status);

  const filteredDeals = statusFilter === 'Pending'
    ? pendingDeals
    : statusFilter === 'Active'
    ? activeDeals
    : deals;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Super Admin Software Moderation & Full Editing Vault</span>
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Admin has 100% full rights to preview, modify, approve, and manage vendor SaaS listings.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchAdminDeals}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-slate-300 rounded-xl transition-all cursor-pointer"
            title="Refresh from MongoDB Atlas"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => {
              setEditingDeal(emptyDeal);
              setShowAddForm(!showAddForm);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#FF6B35] hover:bg-[#e55a27] text-white text-xs font-black rounded-xl transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" /> {showAddForm ? 'Close Full Editor' : 'Create New Software Deal'}
          </button>
        </div>
      </div>

      {/* ── Active Admin Alert Banner if Pending Submissions Exist ── */}
      {pendingDeals.length > 0 && (
        <div className="bg-amber-500/15 border-2 border-amber-500/40 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-amber-300 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="text-sm font-black text-white flex items-center gap-2">
                <span>{pendingDeals.length} New Vendor Software {pendingDeals.length === 1 ? 'Submission' : 'Submissions'} Awaiting QA Approval!</span>
                <span className="text-[10px] font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full uppercase">Action Required</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Click <strong>👁️ QA Preview</strong> to test the real software deal page before approving.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenPreview(pendingDeals[0])}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>QA Preview Top Submission</span>
            </button>
          </div>
        </div>
      )}

      {statusMsg && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 p-4 rounded-xl text-xs font-bold text-emerald-400 animate-fadeIn">
          🎉 {statusMsg}
        </div>
      )}

      {savedMsg && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 p-4 rounded-xl text-xs font-bold text-emerald-400 animate-fadeIn">
          🎉 All software deal sections saved permanently to SaasGrid MongoDB Atlas! Single deal page updated live.
        </div>
      )}

      {/* ── 6-Tab Comprehensive Admin Form Editor (Admin Full Adhikar) ── */}
      {showAddForm && (
        <form onSubmit={handleSaveDeal} className="bg-[#070B16] border border-[#2475FF]/40 rounded-2xl p-6 sm:p-8 space-y-6 animate-fadeInUp">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Super Admin Full Details Editor & Control Rights</span>
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Admin can edit all vendor fields, modify pricing passes, upload images, manage FAQs, and update bank details.
              </p>
            </div>
            <span className="text-[10px] font-black text-[#2475FF] bg-blue-500/20 px-2.5 py-0.5 rounded uppercase">
              100% MongoDB Atlas Synced
            </span>
          </div>

          {/* Form Tabs Header */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
            {[
              { id: 'basic', label: '1. Basic & Status', icon: Layout },
              { id: 'pricing', label: '2. Plans & Inventory', icon: Tag },
              { id: 'media', label: '3. Media & Gallery', icon: Video },
              { id: 'tldr', label: '4. TL;DR & FAQs', icon: FileText },
              { id: 'features', label: '5. Visual Showcases', icon: Layers },
              { id: 'founder', label: '6. Founder, Payouts & Codes', icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeFormTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFormTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    active ? 'bg-[#2475FF] text-white shadow-md font-black' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: BASIC & STATUS */}
          {activeFormTab === 'basic' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 mb-1">Software Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chat Chacha - WhatsApp Marketing"
                    value={editingDeal.title}
                    onChange={(e) => setEditingDeal({ ...editingDeal, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#2475FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Listing Status (Admin Control) *</label>
                  <select
                    value={editingDeal.status || 'Pending'}
                    onChange={(e) => setEditingDeal({ ...editingDeal, status: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 text-white text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#2475FF] cursor-pointer"
                  >
                    <option value="Pending" className="bg-slate-900 text-amber-300">⏳ Pending QA Review</option>
                    <option value="Active" className="bg-slate-900 text-emerald-400">🟢 Active & Live on Marketplace</option>
                    <option value="Rejected" className="bg-slate-900 text-red-400">❌ Rejected</option>
                    <option value="Paused" className="bg-slate-900 text-slate-400">⏸️ Paused</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Slug (URL Identifier) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. chat-chacha"
                    value={editingDeal.slug}
                    onChange={(e) => setEditingDeal({ ...editingDeal, slug: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 text-white text-xs font-mono font-bold p-3 rounded-xl focus:outline-none focus:border-[#2475FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Category *</label>
                  <select
                    value={editingDeal.category}
                    onChange={(e) => setEditingDeal({ ...editingDeal, category: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#2475FF] cursor-pointer"
                  >
                    <option value="WhatsApp Bots" className="bg-slate-900">💬 WhatsApp Tools & Bots</option>
                    <option value="AI & GEO SEO" className="bg-slate-900">🤖 AI & GEO SEO</option>
                    <option value="Lead Scrapers" className="bg-slate-900">🎯 Lead Scraping & B2B</option>
                    <option value="CRM & Sales" className="bg-slate-900">📊 CRM & Sales Automation</option>
                    <option value="Video & Design" className="bg-slate-900">🎨 Video & Design Tools</option>
                    <option value="Analytics" className="bg-slate-900">📈 Analytics & Reporting</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Tagline (High Converting Pitch) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Automate WhatsApp broadcasts, AI chatbot cart recovery, and lead conversion with zero coding."
                  value={editingDeal.tagline}
                  onChange={(e) => setEditingDeal({ ...editingDeal, tagline: e.target.value })}
                  className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#2475FF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Official Website Link</label>
                  <input
                    type="url"
                    placeholder="https://www.chatchacha.in"
                    value={editingDeal.websiteUrl || ''}
                    onChange={(e) => setEditingDeal({ ...editingDeal, websiteUrl: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#2475FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Vendor / Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chat Chacha Tech Private Limited"
                    value={editingDeal.vendorName}
                    onChange={(e) => setEditingDeal({ ...editingDeal, vendorName: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#2475FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Campaign Duration (Days)</label>
                  <input
                    type="number"
                    value={editingDeal.campaignDurationDays || 14}
                    onChange={(e) => setEditingDeal({ ...editingDeal, campaignDurationDays: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#2475FF]"
                  />
                </div>
              </div>

              {/* Vendor Logo Upload & URL Box */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                <label className="block text-xs font-bold text-slate-400">Vendor Logo Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white p-1.5 flex items-center justify-center overflow-hidden shrink-0">
                    <img
                      src={editingDeal.vendorLogo || 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png'}
                      alt="Logo preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      placeholder="Logo Image URL"
                      value={editingDeal.vendorLogo}
                      onChange={(e) => setEditingDeal({ ...editingDeal, vendorLogo: e.target.value })}
                      className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-2.5 rounded-xl focus:outline-none focus:border-[#2475FF]"
                    />
                    <label className="inline-flex px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold rounded-lg cursor-pointer items-center gap-1.5 transition-all">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingField === 'vendorLogo' ? 'Uploading...' : 'Upload Logo File'}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'vendorLogo')} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PLANS & INVENTORY PER TIER */}
          {activeFormTab === 'pricing' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    Configure Pricing Tiers & User Pass Inventory
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Turn tiers ON/OFF, set user access limits (180 Starter, 91 Pro, 30 Agency), and edit pricing.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddCustomPlan}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-all"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Add Tier</span>
                </button>
              </div>

              {/* Tiers List */}
              <div className="space-y-4">
                {(editingDeal.pricingTiers || []).map((tier, idx) => {
                  const isEnabled = tier.enabled !== false;

                  return (
                    <div
                      key={tier.id || idx}
                      className={`p-4 rounded-2xl border transition-all space-y-3 ${
                        isEnabled
                          ? tier.isRecommended
                            ? 'bg-orange-500/10 border-[#FF6B35]'
                            : 'bg-white/5 border-white/15'
                          : 'bg-white/5 border-white/10 opacity-50'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                            <input
                              type="checkbox"
                              checked={isEnabled}
                              onChange={() => handleToggleTierEnabled(idx)}
                              className="accent-[#FF6B35] rounded"
                            />
                            <span>{isEnabled ? 'Tier Active' : 'Tier Disabled'}</span>
                          </label>

                          <input
                            type="text"
                            value={tier.tierName}
                            onChange={(e) => handleTierChange(idx, 'tierName', e.target.value)}
                            className="bg-white/10 border border-white/20 text-white text-xs font-black px-2.5 py-1 rounded-lg focus:outline-none focus:border-[#FF6B35]"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleSetRecommendedTier(idx)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer ${
                              tier.isRecommended ? 'bg-[#FF6B35] text-white' : 'bg-white/10 text-slate-400'
                            }`}
                          >
                            ★ Most Popular
                          </button>

                          {(editingDeal.pricingTiers || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeletePlan(idx)}
                              className="p-1.5 text-slate-500 hover:text-red-400 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {isEnabled && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/10">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 mb-1">5-Yr Price (₹)</label>
                            <input
                              type="number"
                              value={tier.price}
                              onChange={(e) => handleTierChange(idx, 'price', Number(e.target.value))}
                              className="w-full bg-white/10 border border-white/20 text-white text-xs font-bold p-2 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 mb-1">Original Price (₹)</label>
                            <input
                              type="number"
                              value={tier.originalPrice}
                              onChange={(e) => handleTierChange(idx, 'originalPrice', Number(e.target.value))}
                              className="w-full bg-white/10 border border-white/20 text-white text-xs font-bold p-2 rounded-xl focus:outline-none focus:border-[#FF6B35]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-amber-400 mb-1">Passes / Users Limit</label>
                            <input
                              type="number"
                              value={tier.totalCodes || 100}
                              onChange={(e) => handleTierChange(idx, 'totalCodes', Number(e.target.value))}
                              className="w-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black p-2 rounded-xl focus:outline-none focus:border-amber-400"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Feature Matrix */}
              <div className="pt-4 border-t border-white/10">
                <PlanFeaturesBuilder
                  pricingTiers={editingDeal.pricingTiers || emptyDeal.pricingTiers}
                  onChange={(updated) => setEditingDeal({ ...editingDeal, pricingTiers: updated })}
                />
              </div>
            </div>
          )}

          {/* TAB 3: MEDIA & SCREENSHOTS */}
          {activeFormTab === 'media' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                <label className="block text-xs font-bold text-slate-400">Hero Product Screenshot Image *</label>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-8 space-y-2">
                    <input
                      type="text"
                      required
                      placeholder="Paste image URL (https://...)"
                      value={editingDeal.heroImage}
                      onChange={(e) => setEditingDeal({ ...editingDeal, heroImage: e.target.value })}
                      className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#2475FF]"
                    />
                    <label className="inline-flex px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl cursor-pointer items-center gap-1.5 transition-all">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingField === 'heroImage' ? 'Uploading Image...' : 'Upload Screenshot File'}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'heroImage')} />
                    </label>
                  </div>
                  <div className="sm:col-span-4 aspect-video rounded-xl overflow-hidden bg-slate-900 border border-white/15 flex items-center justify-center">
                    {editingDeal.heroImage ? (
                      <img src={editingDeal.heroImage} alt="Hero" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-slate-500">No Image</span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Additional Gallery Screenshots (1 per line)</label>
                <textarea
                  rows={3}
                  value={editingDeal.screenshotsText}
                  onChange={(e) => setEditingDeal({ ...editingDeal, screenshotsText: e.target.value })}
                  className="w-full bg-white/5 border border-white/15 text-white text-xs font-mono p-3 rounded-xl focus:outline-none focus:border-[#2475FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Demo Video URL (YouTube / Loom embed)</label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/embed/..."
                  value={editingDeal.videoUrl}
                  onChange={(e) => setEditingDeal({ ...editingDeal, videoUrl: e.target.value })}
                  className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#2475FF]"
                />
              </div>
            </div>
          )}

          {/* TAB 4: TL;DR & CUSTOM FAQS */}
          {activeFormTab === 'tldr' && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">TL;DR Key Points (1 per line) *</label>
                <textarea
                  rows={4}
                  required
                  value={editingDeal.tldrText}
                  onChange={(e) => setEditingDeal({ ...editingDeal, tldrText: e.target.value })}
                  className="w-full bg-white/5 border border-white/15 text-white text-xs font-medium p-3.5 rounded-xl focus:outline-none focus:border-[#2475FF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Alternative To</label>
                  <input
                    type="text"
                    value={editingDeal.alternativeTo}
                    onChange={(e) => setEditingDeal({ ...editingDeal, alternativeTo: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#2475FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Integrations</label>
                  <input
                    type="text"
                    value={editingDeal.integrations}
                    onChange={(e) => setEditingDeal({ ...editingDeal, integrations: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#2475FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Best For</label>
                  <input
                    type="text"
                    value={editingDeal.bestFor}
                    onChange={(e) => setEditingDeal({ ...editingDeal, bestFor: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#2475FF]"
                  />
                </div>
              </div>

              {/* Interactive Custom FAQ Manager */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">
                      Frequently Asked Questions (FAQs)
                    </h4>
                    <p className="text-[11px] text-slate-400">Admin can add, modify, or delete software FAQs.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddFaq}
                    className="px-3 py-1.5 bg-[#FF6B35] hover:bg-[#E85A24] text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Question</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(editingDeal.faqs || []).map((faq, fIdx) => (
                    <div key={fIdx} className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-2.5 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-amber-400 uppercase">FAQ #{fIdx + 1}</span>
                        {(editingDeal.faqs || []).length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveFaq(fIdx)}
                            className="text-red-400 hover:text-red-300 text-xs cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        placeholder="Question"
                        value={faq.question}
                        onChange={(e) => handleFaqChange(fIdx, 'question', e.target.value)}
                        className="w-full bg-white/10 border border-white/15 text-white text-xs font-bold p-2.5 rounded-lg focus:outline-none focus:border-[#FF6B35]"
                      />

                      <textarea
                        rows={2}
                        placeholder="Answer"
                        value={faq.answer}
                        onChange={(e) => handleFaqChange(fIdx, 'answer', e.target.value)}
                        className="w-full bg-white/10 border border-white/15 text-white text-xs font-medium p-2.5 rounded-lg focus:outline-none focus:border-[#FF6B35]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: VISUAL SHOWCASES */}
          {activeFormTab === 'features' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Feature 1 */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider">Feature Showcase #1</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Feature Title"
                    value={editingDeal.feat1Title}
                    onChange={(e) => setEditingDeal({ ...editingDeal, feat1Title: e.target.value })}
                    className="w-full bg-white/10 border border-white/15 text-white text-xs font-bold p-2.5 rounded-xl focus:outline-none focus:border-[#2475FF]"
                  />
                  <input
                    type="text"
                    placeholder="Feature Screenshot URL"
                    value={editingDeal.feat1Image}
                    onChange={(e) => setEditingDeal({ ...editingDeal, feat1Image: e.target.value })}
                    className="w-full bg-white/10 border border-white/15 text-white text-xs font-bold p-2.5 rounded-xl focus:outline-none focus:border-[#2475FF]"
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="Feature Description"
                  value={editingDeal.feat1Desc}
                  onChange={(e) => setEditingDeal({ ...editingDeal, feat1Desc: e.target.value })}
                  className="w-full bg-white/10 border border-white/15 text-white text-xs font-medium p-2.5 rounded-xl focus:outline-none focus:border-[#2475FF]"
                />
              </div>

              {/* Feature 2 */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider">Feature Showcase #2</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Feature Title"
                    value={editingDeal.feat2Title}
                    onChange={(e) => setEditingDeal({ ...editingDeal, feat2Title: e.target.value })}
                    className="w-full bg-white/10 border border-white/15 text-white text-xs font-bold p-2.5 rounded-xl focus:outline-none focus:border-[#2475FF]"
                  />
                  <input
                    type="text"
                    placeholder="Feature Screenshot URL"
                    value={editingDeal.feat2Image}
                    onChange={(e) => setEditingDeal({ ...editingDeal, feat2Image: e.target.value })}
                    className="w-full bg-white/10 border border-white/15 text-white text-xs font-bold p-2.5 rounded-xl focus:outline-none focus:border-[#2475FF]"
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="Feature Description"
                  value={editingDeal.feat2Desc}
                  onChange={(e) => setEditingDeal({ ...editingDeal, feat2Desc: e.target.value })}
                  className="w-full bg-white/10 border border-white/15 text-white text-xs font-medium p-2.5 rounded-xl focus:outline-none focus:border-[#2475FF]"
                />
              </div>
            </div>
          )}

          {/* TAB 6: FOUNDER, 70% PAYOUTS & LICENSE CODES */}
          {activeFormTab === 'founder' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Founder Name *</label>
                  <input
                    type="text"
                    value={editingDeal.founderName}
                    onChange={(e) => setEditingDeal({ ...editingDeal, founderName: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#2475FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Founder Title *</label>
                  <input
                    type="text"
                    value={editingDeal.founderTitle}
                    onChange={(e) => setEditingDeal({ ...editingDeal, founderTitle: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#2475FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Founder Work Email *</label>
                  <input
                    type="email"
                    value={editingDeal.founderEmail}
                    onChange={(e) => setEditingDeal({ ...editingDeal, founderEmail: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#2475FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Founder WhatsApp / Phone *</label>
                  <input
                    type="text"
                    value={editingDeal.founderPhone}
                    onChange={(e) => setEditingDeal({ ...editingDeal, founderPhone: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#2475FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={editingDeal.founderLinkedin}
                    onChange={(e) => setEditingDeal({ ...editingDeal, founderLinkedin: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#2475FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Twitter / X Profile URL</label>
                  <input
                    type="text"
                    value={editingDeal.founderTwitter}
                    onChange={(e) => setEditingDeal({ ...editingDeal, founderTwitter: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#2475FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">License Redemption Link *</label>
                <input
                  type="url"
                  value={editingDeal.vendorRedeemUrl}
                  onChange={(e) => setEditingDeal({ ...editingDeal, vendorRedeemUrl: e.target.value })}
                  className="w-full bg-white/5 border border-white/15 text-white text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-[#2475FF]"
                />
              </div>

              {/* 70% Payout Bank / UPI Details */}
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span>70% Vendor Payout Details</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">UPI ID (VPA)</label>
                    <input
                      type="text"
                      value={editingDeal.upiId}
                      onChange={(e) => setEditingDeal({ ...editingDeal, upiId: e.target.value })}
                      className="w-full bg-white/10 border border-white/15 text-white text-xs font-bold p-2.5 rounded-xl focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Account Holder Name</label>
                    <input
                      type="text"
                      value={editingDeal.accountHolderName}
                      onChange={(e) => setEditingDeal({ ...editingDeal, accountHolderName: e.target.value })}
                      className="w-full bg-white/10 border border-white/15 text-white text-xs font-bold p-2.5 rounded-xl focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Bank Account Number</label>
                    <input
                      type="text"
                      value={editingDeal.accountNumber}
                      onChange={(e) => setEditingDeal({ ...editingDeal, accountNumber: e.target.value })}
                      className="w-full bg-white/10 border border-white/15 text-white text-xs font-bold p-2.5 rounded-xl focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Bank IFSC Code</label>
                    <input
                      type="text"
                      value={editingDeal.ifscCode}
                      onChange={(e) => setEditingDeal({ ...editingDeal, ifscCode: e.target.value })}
                      className="w-full bg-white/10 border border-white/15 text-white text-xs font-bold p-2.5 rounded-xl focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>
              </div>

              {/* Plan-wise License Codes Management */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  <span>Plan-Wise License Codes & Delivery Vault</span>
                </h4>
                <div className="space-y-3">
                  {(editingDeal.pricingTiers || []).filter((t) => t.enabled !== false).map((tier, idx) => (
                    <div key={tier.id || idx} className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-white">
                        <span>{tier.tierName} ({tier.totalCodes || 100} Passes Target)</span>
                        <button
                          type="button"
                          onClick={() => handleTierChange(idx, 'rawLicenseCodes', generateCodesForTier(tier.tierName, tier.totalCodes || 100))}
                          className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-black rounded-lg cursor-pointer transition-all"
                        >
                          ⚡ Auto-Generate {tier.totalCodes || 100} Codes
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={tier.rawLicenseCodes || ''}
                        onChange={(e) => handleTierChange(idx, 'rawLicenseCodes', e.target.value)}
                        placeholder={`Paste codes for ${tier.tierName} or click Auto-Generate`}
                        className="w-full bg-white/10 border border-white/15 text-white text-xs font-mono p-2 rounded-lg focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Form Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => handleOpenPreview(editingDeal)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Preview Deal Page</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 bg-[#FF6B35] hover:bg-[#e55a27] disabled:opacity-50 text-white text-xs font-black rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Deal Permanently</span>
              </button>
            </div>
          </div>

        </form>
      )}

      {/* ── Deals Moderation Table & Action Hub ── */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <h3 className="text-sm font-black text-white uppercase tracking-wider">
            All Software Listings ({deals.length})
          </h3>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setStatusFilter('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'All' ? 'bg-[#2475FF] text-white shadow' : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              All Deals ({deals.length})
            </button>

            <button
              onClick={() => setStatusFilter('Pending')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'Pending' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'bg-white/5 text-amber-300 hover:bg-white/10'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pending QA ({pendingDeals.length})</span>
            </button>

            <button
              onClick={() => setStatusFilter('Active')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'Active' ? 'bg-emerald-600 text-white font-black shadow' : 'bg-white/5 text-emerald-400 hover:bg-white/10'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Active Live ({activeDeals.length})</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="w-7 h-7 border-2 border-[#2475FF] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-400">Loading listings from MongoDB Atlas...</p>
          </div>
        ) : filteredDeals.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs font-bold">
            No software listings found in this filter tab.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDeals.map((d) => {
              const isPending = d.status === 'Pending';
              
              return (
                <div
                  key={d.id || d.slug || d._id}
                  className={`border rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all ${
                    isPending ? 'bg-amber-950/20 border-amber-500/40 shadow-md' : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black text-[#2475FF] bg-blue-500/20 px-2.5 py-0.5 rounded uppercase">
                        {d.category || 'SaaS Tool'}
                      </span>
                      
                      {isPending ? (
                        <span className="text-[10px] font-black text-amber-300 bg-amber-500/30 px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
                          <Clock className="w-3 h-3 animate-pulse" /> Pending QA Approval
                        </span>
                      ) : (
                        <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Live on Marketplace
                        </span>
                      )}

                      <span className="text-[10px] font-bold text-slate-400">
                        Duration: {d.campaignDurationDays || 14} Days
                      </span>
                    </div>

                    <h4 className="text-base font-black text-white">{d.title}</h4>
                    
                    <div className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
                      <span>Vendor: <strong className="text-slate-200">{d.vendorName}</strong></span>
                      <span>•</span>
                      <span>Starter Pass: <strong className="text-amber-400">₹{d.tier1Price || d.price || 1999}</strong></span>
                      {d.founderContact?.email && (
                        <>
                          <span>•</span>
                          <span>Contact: <strong className="text-slate-300">{d.founderContact.email}</strong></span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                    
                    {/* Instant QA Preview Button */}
                    <button
                      onClick={() => handleOpenPreview(d)}
                      className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>👁️ QA Preview</span>
                    </button>

                    {/* Edit All Details Button */}
                    <button
                      onClick={() => handleEditClick(d)}
                      className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Edit Details</span>
                    </button>

                    {/* 1-Click Approve or Toggle */}
                    {isPending ? (
                      <>
                        <button
                          onClick={() => handleStatusChange(d.slug, 'Active')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve & Live</span>
                        </button>

                        <button
                          onClick={() => handleStatusChange(d.slug, 'Rejected')}
                          className="px-3 py-2 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(d.slug, 'Pending')}
                        className="px-3 py-1.5 bg-white/10 hover:bg-amber-500/20 text-xs font-bold text-slate-300 hover:text-amber-300 rounded-xl transition-all cursor-pointer"
                        title="Move to pending review"
                      >
                        Unpublish
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(d.slug)}
                      className="p-2 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete deal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ── Super Admin Interactive Deal Preview Modal ── */}
      <VendorDealPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        deal={previewDeal}
        isAdmin={true}
        onApprove={(slug) => handleStatusChange(slug, 'Active')}
        onReject={(slug) => handleStatusChange(slug, 'Rejected')}
        onEdit={(deal) => handleEditClick(deal)}
      />

    </div>
  );
}
