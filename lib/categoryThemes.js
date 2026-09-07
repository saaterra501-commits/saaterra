/**
 * StackDeal Official Category Theme & Styling Registry
 * Gives each SaaS category its distinct color identity, gradient, icon, and badges.
 * Shared across:
 *  1. Homepage Deal Grid (NachoNachoCard)
 *  2. Deals Marketplace (/deals)
 *  3. Vendor Submit Page Live Category Card Preview (/submit)
 *  4. Admin Deal Management & QA Vault
 */

import {
  MessageSquare, Sparkles, Target, BarChart3,
  Video, TrendingUp, Zap, Layers, Code, ShieldCheck
} from 'lucide-react';

export const CATEGORY_THEMES = {
  'WhatsApp Bots': {
    id: 'WhatsApp Bots',
    label: '💬 WhatsApp Tools & Bots',
    shortLabel: 'WhatsApp Bots',
    badgeText: '💬 WHATSAPP BOT',
    icon: MessageSquare,
    iconName: 'MessageSquare',
    themeColor: '#25D366', // Official WhatsApp Green
    accentColor: '#10B981', // Emerald-500
    borderClass: 'border-emerald-300 group-hover:border-emerald-500',
    headerGlow: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
    badgeBg: 'bg-[#25D366] text-slate-950',
    ribbonBg: 'bg-emerald-600 text-white',
    pillBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    priceColor: 'text-emerald-700',
    btnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    btnBorder: 'border-emerald-600',
    progressGradient: 'from-emerald-400 to-emerald-600',
    description: 'WhatsApp Cloud API bots, automated cart recovery, and broadcast marketing suites.',
    taglinePlaceholder: 'Automate WhatsApp marketing broadcasts & cart recovery with official Cloud API.',
  },

  'AI & GEO SEO': {
    id: 'AI & GEO SEO',
    label: '🤖 AI & GEO SEO',
    shortLabel: 'AI & GEO SEO',
    badgeText: '🤖 AI & GEO SEO',
    icon: Sparkles,
    iconName: 'Sparkles',
    themeColor: '#8B5CF6', // Purple-500
    accentColor: '#6366F1', // Indigo-500
    borderClass: 'border-purple-300 group-hover:border-purple-500',
    headerGlow: 'from-purple-500/20 via-indigo-500/5 to-transparent',
    badgeBg: 'bg-purple-600 text-white',
    ribbonBg: 'bg-purple-600 text-white',
    pillBg: 'bg-purple-50 text-purple-800 border-purple-200',
    priceColor: 'text-purple-700',
    btnBg: 'bg-purple-600 hover:bg-purple-700 text-white',
    btnBorder: 'border-purple-600',
    progressGradient: 'from-purple-400 to-indigo-600',
    description: 'Generative Engine Optimization (GEO), ChatGPT/Claude citations, keyword tracking.',
    taglinePlaceholder: 'Track agency rankings and optimize brand citations across ChatGPT & Perplexity.',
  },

  'Lead Scrapers': {
    id: 'Lead Scrapers',
    label: '🎯 Lead Scraping & B2B',
    shortLabel: 'Lead Scrapers',
    badgeText: '🎯 B2B LEADS',
    icon: Target,
    iconName: 'Target',
    themeColor: '#0284C7', // Sky-600
    accentColor: '#06B6D4', // Cyan-500
    borderClass: 'border-sky-300 group-hover:border-sky-500',
    headerGlow: 'from-sky-500/20 via-cyan-500/5 to-transparent',
    badgeBg: 'bg-sky-600 text-white',
    ribbonBg: 'bg-sky-600 text-white',
    pillBg: 'bg-sky-50 text-sky-800 border-sky-200',
    priceColor: 'text-sky-700',
    btnBg: 'bg-sky-600 hover:bg-sky-700 text-white',
    btnBorder: 'border-sky-600',
    progressGradient: 'from-sky-400 to-blue-600',
    description: 'Google Maps, LinkedIn, and directory email/phone extractors with SMTP validation.',
    taglinePlaceholder: 'Extract 100% verified B2B leads from Google Maps & LinkedIn with SMTP validator.',
  },

  'CRM & Sales': {
    id: 'CRM & Sales',
    label: '📊 CRM & Sales Automation',
    shortLabel: 'CRM & Sales',
    badgeText: '📊 CRM & SALES',
    icon: BarChart3,
    iconName: 'BarChart3',
    themeColor: '#FF6B35', // StackDeal Signature Orange
    accentColor: '#EA580C', // Orange-600
    borderClass: 'border-orange-300 group-hover:border-[#FF6B35]',
    headerGlow: 'from-orange-500/20 via-amber-500/5 to-transparent',
    badgeBg: 'bg-[#FF6B35] text-white',
    ribbonBg: 'bg-[#FF6B35] text-white',
    pillBg: 'bg-orange-50 text-orange-800 border-orange-200',
    priceColor: 'text-[#FF6B35]',
    btnBg: 'bg-[#FF6B35] hover:bg-[#e06000] text-white',
    btnBorder: 'border-[#FF6B35]',
    progressGradient: 'from-amber-400 to-[#FF6B35]',
    description: 'Sales pipelines, omnichannel lead management, automated follow-ups & billing.',
    taglinePlaceholder: 'Close high-ticket agency deals with automated WhatsApp pipelines and zero monthly fees.',
  },

  'Video & Design': {
    id: 'Video & Design',
    label: '🎨 Video & Design Tools',
    shortLabel: 'Video & Design',
    badgeText: '🎨 VIDEO & DESIGN',
    icon: Video,
    iconName: 'Video',
    themeColor: '#EC4899', // Pink-500
    accentColor: '#F43F5E', // Rose-500
    borderClass: 'border-pink-300 group-hover:border-pink-500',
    headerGlow: 'from-pink-500/20 via-rose-500/5 to-transparent',
    badgeBg: 'bg-pink-600 text-white',
    ribbonBg: 'bg-pink-600 text-white',
    pillBg: 'bg-pink-50 text-pink-800 border-pink-200',
    priceColor: 'text-pink-700',
    btnBg: 'bg-pink-600 hover:bg-pink-700 text-white',
    btnBorder: 'border-pink-600',
    progressGradient: 'from-pink-400 to-rose-600',
    description: 'AI video generation, thumbnail creators, graphics design & studio templates.',
    taglinePlaceholder: 'Create studio-quality agency videos and marketing creatives in under 60 seconds.',
  },

  'Analytics': {
    id: 'Analytics',
    label: '📈 Analytics & Reporting',
    shortLabel: 'Analytics',
    badgeText: '📈 ANALYTICS',
    icon: TrendingUp,
    iconName: 'TrendingUp',
    themeColor: '#0D9488', // Teal-600
    accentColor: '#14B8A6', // Teal-500
    borderClass: 'border-teal-300 group-hover:border-teal-500',
    headerGlow: 'from-teal-500/20 via-emerald-500/5 to-transparent',
    badgeBg: 'bg-teal-600 text-white',
    ribbonBg: 'bg-teal-600 text-white',
    pillBg: 'bg-teal-50 text-teal-800 border-teal-200',
    priceColor: 'text-teal-700',
    btnBg: 'bg-teal-600 hover:bg-teal-700 text-white',
    btnBorder: 'border-teal-600',
    progressGradient: 'from-teal-400 to-cyan-600',
    description: 'Web traffic intelligence, funnel analytics, conversion heatmaps & client reports.',
    taglinePlaceholder: 'Uncover agency client conversion drop-offs and generate automated weekly reports.',
  },
};

export const DEFAULT_THEME = {
  id: 'Software Deal',
  label: '⚡ General SaaS',
  shortLabel: 'General SaaS',
  badgeText: '⚡ SOFTWARE DEAL',
  icon: Zap,
  iconName: 'Zap',
  themeColor: '#FF6B35',
  accentColor: '#2475FF',
  borderClass: 'border-slate-200 group-hover:border-slate-400',
  headerGlow: 'from-slate-500/20 via-transparent to-transparent',
  badgeBg: 'bg-slate-900 text-white',
  ribbonBg: 'bg-red-600 text-white',
  pillBg: 'bg-slate-100 text-slate-800 border-slate-200',
  priceColor: 'text-[#FF6B35]',
  btnBg: 'bg-[#FF6B35] hover:bg-[#e06000] text-white',
  btnBorder: 'border-[#FF6B35]',
  progressGradient: 'from-emerald-400 to-emerald-600',
  description: 'Top Indian lifetime software deals and 5-Year access passes.',
  taglinePlaceholder: 'Discover verified SaaS tools built to scale Indian agencies with zero monthly bills.',
};

/**
 * Normalizes any category string (from database or user input)
 * and returns the corresponding category styling configuration.
 */
export function getCategoryTheme(categoryName) {
  if (!categoryName || typeof categoryName !== 'string') {
    return DEFAULT_THEME;
  }

  const clean = categoryName.trim().toLowerCase();

  if (clean.includes('whatsapp') || clean.includes('chat') || clean.includes('bot')) {
    return CATEGORY_THEMES['WhatsApp Bots'];
  }
  if (clean.includes('ai') || clean.includes('seo') || clean.includes('geo') || clean.includes('gpt')) {
    return CATEGORY_THEMES['AI & GEO SEO'];
  }
  if (clean.includes('lead') || clean.includes('scrape') || clean.includes('extractor') || clean.includes('b2b')) {
    return CATEGORY_THEMES['Lead Scrapers'];
  }
  if (clean.includes('crm') || clean.includes('sale') || clean.includes('pipeline') || clean.includes('deal')) {
    return CATEGORY_THEMES['CRM & Sales'];
  }
  if (clean.includes('video') || clean.includes('design') || clean.includes('graphic') || clean.includes('media')) {
    return CATEGORY_THEMES['Video & Design'];
  }
  if (clean.includes('analytic') || clean.includes('report') || clean.includes('metric') || clean.includes('tracking')) {
    return CATEGORY_THEMES['Analytics'];
  }

  // Direct match in keys
  if (CATEGORY_THEMES[categoryName]) {
    return CATEGORY_THEMES[categoryName];
  }

  return DEFAULT_THEME;
}
