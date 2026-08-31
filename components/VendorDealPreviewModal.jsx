'use client';

import { useState } from 'react';
import {
  X, Check, ShieldCheck, Clock, ArrowRight, Eye, Edit3, Rocket,
  Sparkles, ExternalLink, MessageSquare, Play, HelpCircle,
  Globe, Building2, CheckCircle2, AlertTriangle, Trash2
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

export default function VendorDealPreviewModal({
  isOpen,
  onClose,
  deal,
  onSubmit,
  isSubmitting,
  isAdmin = false,
  onApprove,
  onReject,
  onEdit,
}) {
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);

  if (!isOpen || !deal) return null;

  const screenshots = [
    ...(deal.heroImage ? [deal.heroImage] : []),
    ...(deal.screenshots || [])
  ].filter(Boolean);

  const uniqueScreenshots = Array.from(new Set(screenshots));
  if (uniqueScreenshots.length === 0) {
    uniqueScreenshots.push('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop');
  }

  const activeTiers = (deal.pricingTiers && deal.pricingTiers.length > 0)
    ? deal.pricingTiers.filter((t) => t.enabled !== false)
    : [
        {
          tierName: 'Starter Pass',
          price: deal.tier1Price || 1999,
          originalPrice: (deal.tier1Price || 1999) * 10,
          totalCodes: 180,
          features: [{ text: '5-Year Core Updates', included: true }],
        },
      ];

  const primaryTier = activeTiers[0] || { price: 1999, totalCodes: 100 };
  const starterPrice = primaryTier.price || 1999;
  const originalPrice = primaryTier.originalPrice || (starterPrice * 10);
  const discountPercent = Math.round(((originalPrice - starterPrice) / originalPrice) * 100);
  const isPending = deal.status === 'Pending';

  const handleAdminApprove = async () => {
    if (!onApprove) return;
    setActionLoading(true);
    try {
      await onApprove(deal.slug);
      onClose();
    } catch (e) {
      console.error('Approval error:', e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAdminReject = async () => {
    if (!onReject) return;
    if (!confirm(`Are you sure you want to reject submission for "${deal.title}"?`)) return;
    setActionLoading(true);
    try {
      await onReject(deal.slug);
      onClose();
    } catch (e) {
      console.error('Reject error:', e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAdminEdit = () => {
    if (onEdit) {
      onEdit(deal);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md animate-fadeIn flex flex-col font-sans">
      
      {/* ── Top Preview Sticky Bar ── */}
      <div className="sticky top-0 z-50 bg-[#0A0F1E] border-b border-white/10 text-white px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isAdmin ? 'bg-indigo-500/20 text-indigo-400' : 'bg-amber-400/20 text-amber-300'}`}>
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-white">
                {isAdmin ? '🛡️ Super Admin QA Deal Preview' : '👁️ Live Deal Page Preview'}
              </span>
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                isPending
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}>
                {isAdmin ? (isPending ? '⏳ Awaiting Admin Approval' : '🟢 Live Deal') : 'Vendor Mode'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              {isAdmin
                ? 'Review full software imagery, pricing passes, FAQs, and founder credentials before publishing.'
                : 'This is the exact view buyers will see when discovering your 5-Year Pass.'}
            </p>
          </div>
        </div>

        {/* Action Controls in Header */}
        <div className="flex items-center gap-2.5">
          {isAdmin ? (
            <>
              <button
                type="button"
                onClick={handleAdminEdit}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span>Edit Details</span>
              </button>

              {isPending && (
                <>
                  <button
                    type="button"
                    onClick={handleAdminApprove}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {actionLoading ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Approve & Launch Live</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleAdminReject}
                    disabled={actionLoading}
                    className="px-3 py-2 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white text-xs font-bold rounded-xl border border-red-500/30 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Reject</span>
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Details</span>
              </button>

              {onSubmit && (
                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#FF6B35] hover:bg-[#E85A24] text-white text-xs font-black rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Rocket className="w-3.5 h-3.5" />
                      <span>Submit for Approval</span>
                    </>
                  )}
                </button>
              )}
            </>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Main Preview Content ── */}
      <div className="flex-1 bg-[#F6F7FB] text-slate-900 pb-20">
        
        {/* Deal Header Section */}
        <section className="bg-white border-b border-slate-200 pt-8 pb-12 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto space-y-4">
            
            {/* Breadcrumb & Badges */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 flex-wrap">
              <span>Software Deals</span>
              <span>›</span>
              <span className="text-[#FF6B35] font-black">{deal.category || 'AI Tools'}</span>
              <span>›</span>
              <span className="text-slate-900 font-bold truncate max-w-xs">{deal.title}</span>

              <span className="ml-auto inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3 h-3" /> 5-Year Pass
              </span>
            </div>

            {/* Title & Tagline */}
            <div className="space-y-2 max-w-4xl">
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-950 leading-tight">
                {deal.title}
              </h1>
              <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed">
                {deal.tagline}
              </p>
            </div>

            {/* Vendor Company Pill */}
            <div className="flex items-center gap-3 pt-2 flex-wrap">
              <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-2xl shadow-2xs">
                <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 p-0.5 flex items-center justify-center overflow-hidden shrink-0">
                  <img
                    src={deal.vendorLogo || 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png'}
                    alt="Company logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xs font-black text-slate-800">{deal.vendorName}</span>
                {deal.vendorLocation && (
                  <span className="text-[11px] text-slate-500 font-medium">· {deal.vendorLocation}</span>
                )}
              </div>

              {deal.websiteUrl && (
                <a
                  href={deal.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF6B35] hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Visit Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

          </div>
        </section>

        {/* ── Media Gallery & Key Value Props ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Gallery & Video */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Main Active Media Viewport */}
              <div className="aspect-video w-full rounded-3xl overflow-hidden bg-slate-900 border-2 border-slate-200 shadow-xl relative group flex items-center justify-center">
                {selectedImgIdx === -1 && deal.videoUrl ? (
                  <iframe
                    src={deal.videoUrl}
                    title="Demo Video Walkthrough"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <img
                    src={uniqueScreenshots[selectedImgIdx] || uniqueScreenshots[0]}
                    alt="Software Hero Screenshot"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Thumbnails Row */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {deal.videoUrl && (
                  <button
                    type="button"
                    onClick={() => setSelectedImgIdx(-1)}
                    className={`h-16 w-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-slate-900 flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      selectedImgIdx === -1 ? 'border-[#FF6B35] shadow-md scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-[9px] font-black text-white uppercase">Video Demo</span>
                  </button>
                )}

                {uniqueScreenshots.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImgIdx(idx)}
                    className={`h-16 w-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer bg-slate-100 ${
                      selectedImgIdx === idx ? 'border-[#FF6B35] shadow-md scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

            </div>

            {/* Right: Pricing Card Preview */}
            <div className="lg:col-span-4 bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
                  Save {discountPercent}% Instant
                </span>
                <span className="text-xs font-bold text-slate-500">5-Year Pass</span>
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-slate-950">
                    ₹{starterPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-base text-slate-400 line-through font-bold">
                    ₹{originalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">One-time payment · Zero recurring monthly fees</p>
              </div>

              {/* Pass Inventory Scarcity Badge */}
              <div className="p-3.5 bg-orange-50 border border-orange-200 rounded-2xl space-y-1">
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="text-orange-950 flex items-center gap-1.5">
                    🔥 Passes Available:
                  </span>
                  <span className="text-[#FF6B35]">
                    {primaryTier.totalCodes || 100} Passes Limit
                  </span>
                </div>
                <div className="w-full bg-orange-200/60 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#FF6B35] h-full rounded-full" style={{ width: '25%' }} />
                </div>
              </div>

              {/* Purchase CTA simulation */}
              <div className="space-y-3">
                <button
                  type="button"
                  className="w-full py-4 bg-[#FF6B35] text-white text-sm font-black rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-default"
                >
                  <span>Get 5-Year Pass (₹{starterPrice.toLocaleString('en-IN')})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>60-Day Money-Back Guarantee</span>
                </div>
              </div>

              {/* Specs Breakdown */}
              <div className="border-t border-slate-100 pt-4 space-y-2.5 text-xs">
                {deal.atAGlance?.alternativeTo && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Alternative to:</span>
                    <span className="text-slate-900 font-bold">{deal.atAGlance.alternativeTo}</span>
                  </div>
                )}
                {deal.atAGlance?.bestFor && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Best for:</span>
                    <span className="text-slate-900 font-bold">{deal.atAGlance.bestFor}</span>
                  </div>
                )}
                {deal.atAGlance?.integrations && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Integrations:</span>
                    <span className="text-slate-900 font-bold">{deal.atAGlance.integrations}</span>
                  </div>
                )}
              </div>

            </div>

          </div>
        </section>

        {/* ── TL;DR Highlights ── */}
        {deal.tldr && deal.tldr.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
              <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>TL;DR Software Highlights</span>
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                {deal.tldr.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ── Feature Showcases ── */}
        {deal.featureShowcases && deal.featureShowcases.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
            <h3 className="text-2xl font-black text-slate-950">Deep Feature Showcases</h3>
            <div className="space-y-8">
              {deal.featureShowcases.map((feat, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center shadow-xs">
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-[#FF6B35] bg-orange-50 px-3 py-1 rounded-full uppercase">
                      Feature #{idx + 1}
                    </span>
                    <h4 className="text-xl font-black text-slate-950">{feat.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">{feat.description}</p>
                    {feat.bullets && feat.bullets.length > 0 && (
                      <ul className="space-y-2 text-xs text-slate-700 font-medium">
                        {feat.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm flex items-center justify-center">
                    {feat.imageUrl ? (
                      <img src={feat.imageUrl} alt={feat.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-slate-400 font-bold">Feature Preview</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Plan Comparison Matrix ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[10px] font-black text-[#FF6B35] bg-orange-50 border border-orange-200 px-3.5 py-1 rounded-full uppercase tracking-wider">
              5-Year Pass Tiers
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950">Choose Your 5-Year Pass</h3>
            <p className="text-xs text-slate-500 font-medium">Lock in 5 years of software updates with zero monthly recurring charges.</p>
          </div>

          <div className={`grid gap-6 ${
            activeTiers.length === 1
              ? 'grid-cols-1 max-w-md mx-auto'
              : activeTiers.length === 2
              ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
              : 'grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto'
          }`}>
            {activeTiers.map((tier, idx) => {
              const tierPrice = tier.price || 1999;
              const originalTierPrice = tier.originalPrice || (tierPrice * 10);
              const tierDiscount = Math.round(((originalTierPrice - tierPrice) / originalTierPrice) * 100);

              return (
                <div
                  key={idx}
                  className={`bg-white rounded-3xl p-6 sm:p-7 border-2 space-y-5 transition-all flex flex-col justify-between ${
                    tier.isRecommended ? 'border-[#FF6B35] shadow-xl relative' : 'border-slate-200 shadow-sm'
                  }`}
                >
                  {tier.isRecommended && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FF6B35] text-white text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                      ★ Most Popular Choice
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-black text-slate-950">{tier.tierName}</h4>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Save {tierDiscount}%
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-slate-950">₹{tierPrice.toLocaleString('en-IN')}</span>
                        <span className="text-sm text-slate-400 line-through font-bold">₹{originalTierPrice.toLocaleString('en-IN')}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">5-Year Pass License</p>
                    </div>

                    {/* Pass Quantity Badge */}
                    <div className="text-[11px] font-black text-orange-950 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-200 flex items-center justify-between">
                      <span>🔥 Passes:</span>
                      <span className="text-[#FF6B35]">{tier.totalCodes || 100} Available</span>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-2.5 pt-3 border-t border-slate-100 text-xs">
                      {(tier.features || []).map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2 text-slate-700 font-medium">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{feat.text || feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    className={`w-full py-3.5 rounded-2xl font-black text-xs transition-all shadow-md cursor-default ${
                      tier.isRecommended ? 'bg-[#FF6B35] text-white' : 'bg-slate-900 text-white'
                    }`}
                  >
                    Select {tier.tierName}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Founder Story & Verification ── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-8 py-8 w-full">
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-black text-slate-950 uppercase tracking-wider">
                Founder Verification & Story
              </h3>
            </div>

            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium italic bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                "{deal.founderNote || 'We built this software to help growing businesses and agencies scale smoothly without expensive monthly recurring bills.'}"
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 border border-slate-300 shrink-0 shadow-xs">
                    <img
                      src={deal.founderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                      alt="Founder"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-black text-slate-950 text-sm">{deal.founderName || 'Founder'}</div>
                    <div className="text-[11px] text-slate-500 font-bold">{deal.founderTitle || 'Founder & CEO'}</div>
                  </div>
                </div>

                {/* Social Badges */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0A66C2]/10 text-[#0A66C2] text-xs font-black rounded-xl">
                    <LinkedInIcon className="w-3.5 h-3.5 fill-current" />
                    <span>LinkedIn</span>
                  </span>
                  {deal.founderTwitter && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl">
                      <TwitterXIcon className="w-3.5 h-3.5 fill-current" />
                      <span>Twitter / X</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── Custom FAQs Section in Preview ── */}
        {deal.faqs && deal.faqs.length > 0 && (
          <section className="max-w-5xl mx-auto px-4 sm:px-8 py-8 w-full space-y-4">
            <h3 className="text-xl font-black text-slate-950">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {deal.faqs.map((faq, fIdx) => (
                <div key={fIdx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
                  <h4 className="font-black text-slate-900 text-sm">{faq.question}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* ── Admin Sticky Action Footer Bar (When in Admin QA Mode) ── */}
      {isAdmin && isPending && (
        <div className="sticky bottom-0 z-50 bg-[#070B16] border-t border-white/15 p-4 sm:px-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping shrink-0" />
            <div>
              <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                Action Required: Pending QA Verification
              </span>
              <p className="text-[11px] text-slate-400">
                Approving this deal will immediately publish it to 50,000+ Indian Agency Founders.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleAdminEdit}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-amber-400" />
              <span>Modify Details</span>
            </button>

            <button
              type="button"
              onClick={handleAdminApprove}
              disabled={actionLoading}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {actionLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Launch Live</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
