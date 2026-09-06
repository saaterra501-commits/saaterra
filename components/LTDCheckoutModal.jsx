'use client';

import { useState, useEffect } from 'react';
import {
  X, ShieldCheck, Zap, CheckCircle2, Copy, ArrowRight,
  Sparkles, CreditCard, Lock, Clock, Flame, Check, Gift,
  User, Mail, Phone, ExternalLink, FileText, AlertCircle
} from 'lucide-react';
import AuthModal from './AuthModal';

export default function LTDCheckoutModal({ deal, selectedTier = 'Tier 1', onClose, onSuccess }) {
  const [step, setStep] = useState('checkout'); // 'checkout' | 'processing' | 'success'
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Buyer Info
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [gstNumber, setGstNumber] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [assignedCode, setAssignedCode] = useState('');
  const [verifiedOrder, setVerifiedOrder] = useState(null);
  const [copied, setCopied] = useState(false);

  // Fetch logged in user to auto-prefill
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data?.authenticated && data?.user) {
          setCurrentUser(data.user);
          setBuyerName(data.user.name || '');
          setBuyerEmail(data.user.email || '');
          if (data.user.phone) setBuyerPhone(data.user.phone);
        }
      })
      .catch(() => {});
  }, []);

  // Pricing calculations
  let tierPrice = 1999;
  let tierTitle = 'Starter Pass';
  let tierCredits = '1 User · Standard Access';

  if (deal?.pricingTiers && deal.pricingTiers.length > 0) {
    const matched = deal.pricingTiers.find((t) =>
      t.tierName?.toLowerCase() === selectedTier?.toLowerCase() ||
      (selectedTier?.toLowerCase().includes('tier 1') && t.tierName?.toLowerCase().includes('starter')) ||
      (selectedTier?.toLowerCase().includes('tier 2') && (t.tierName?.toLowerCase().includes('pro') || t.tierName?.toLowerCase().includes('growth'))) ||
      (selectedTier?.toLowerCase().includes('tier 3') && (t.tierName?.toLowerCase().includes('agency') || t.tierName?.toLowerCase().includes('lifetime') || t.tierName?.toLowerCase().includes('scale')))
    );

    if (matched) {
      tierPrice = matched.price || tierPrice;
      tierTitle = matched.tierName || tierTitle;
      tierCredits = matched.features?.[0]?.text || tierCredits;
    } else {
      if (selectedTier === 'Tier 2' && deal.pricingTiers[1]) {
        tierPrice = deal.pricingTiers[1].price;
        tierTitle = deal.pricingTiers[1].tierName;
      } else if (selectedTier === 'Tier 3' && (deal.pricingTiers[2] || deal.pricingTiers[1])) {
        const t = deal.pricingTiers[2] || deal.pricingTiers[1];
        tierPrice = t.price;
        tierTitle = t.tierName;
      } else {
        tierPrice = deal.pricingTiers[0].price;
        tierTitle = deal.pricingTiers[0].tierName;
      }
    }
  } else {
    tierPrice = deal?.tier1Price || 1999;
    tierTitle = deal?.tier1Title || 'Starter Pass';
    tierCredits = deal?.tier1Credits || '1 User · 2,500 Credits/mo';

    if (selectedTier === 'Tier 2' || selectedTier === 'Pro Pass') {
      tierPrice = deal?.tier2Price || 3999;
      tierTitle = deal?.tier2Title || 'Pro Pass';
      tierCredits = deal?.tier2Credits || '3 Users · 10,000 Credits/mo';
    } else if (selectedTier === 'Tier 3' || selectedTier === 'Agency Pass' || selectedTier?.includes('Agency')) {
      tierPrice = deal?.tier3Price || 7999;
      tierTitle = deal?.tier3Title || 'Agency Lifetime Pass';
      tierCredits = deal?.tier3Credits || '10 Users · Unlimited Credits';
    }
  }

  const annualPrice = tierPrice * 10;
  const savingsAmt = annualPrice - tierPrice;

  // Load Razorpay Checkout Script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Launch Real Razorpay Payment Flow
  const handleInitiateRazorpay = async () => {
    setErrorMessage('');

    const emailToUse = buyerEmail || currentUser?.email;
    if (!emailToUse || !emailToUse.includes('@')) {
      setErrorMessage('Please enter a valid email address to receive your license key.');
      return;
    }

    setLoading(true);

    try {
      // 1. Create Razorpay order on backend
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealId: deal?._id || deal?.slug,
          tier: selectedTier,
          gstNumber: gstNumber.trim(),
          userEmail: emailToUse.trim(),
          userName: buyerName.trim() || 'Valued Founder',
          userPhone: buyerPhone.trim(),
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create Razorpay order');
      }

      // 2. Ensure script is loaded
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Could not load Razorpay payment gateway. Please check your internet connection.');
      }

      // 3. Configure Razorpay Options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'StackDeal',
        description: `5-Year Pass: ${deal?.title || 'SaaS Tool'} (${selectedTier})`,
        image: deal?.vendorLogo || 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png',
        order_id: orderData.orderId,
        prefill: {
          name: buyerName.trim() || currentUser?.name || '',
          email: emailToUse.trim(),
          contact: buyerPhone.trim() || '',
        },
        notes: {
          dealId: deal?._id ? deal._id.toString() : deal?.slug,
          dealTitle: deal?.title || '',
          tier: selectedTier,
          gstNumber: gstNumber.trim() || 'NONE',
        },
        theme: {
          color: '#059669', // StackDeal brand emerald
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
        handler: async function (response) {
          // Payment captured on Razorpay, verify on backend
          setStep('processing');
          try {
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                dealId: deal?._id || deal?.slug,
                tier: selectedTier,
                gstNumber: gstNumber.trim(),
                amount: tierPrice,
                userEmail: emailToUse.trim(),
                userName: buyerName.trim() || currentUser?.name || 'Verified Agency Founder',
                userPhone: buyerPhone.trim(),
                userId: currentUser?._id || null,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setAssignedCode(verifyData.licenseCode);
              setVerifiedOrder(verifyData);
              setStep('success');
              if (onSuccess) onSuccess(verifyData);
            } else {
              throw new Error(verifyData.message || 'Payment verification failed');
            }
          } catch (vErr) {
            setErrorMessage(vErr.message || 'Error verifying payment. Contact support@stackdeal.in with your Payment ID.');
            setStep('checkout');
          } finally {
            setLoading(false);
          }
        },
      };

      const razorpayInstance = new window.Razorpay(options);

      razorpayInstance.on('payment.failed', function (resp) {
        console.error('Razorpay Payment Failed:', resp.error);
        setErrorMessage(`Payment Failed: ${resp.error.description || resp.error.reason}`);
        setLoading(false);
      });

      razorpayInstance.open();
    } catch (err) {
      console.error('Razorpay checkout error:', err);
      setErrorMessage(err.message || 'Payment initiation failed. Please try again.');
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (assignedCode) {
      navigator.clipboard.writeText(assignedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#0A0F1E]/80 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full sm:max-w-[500px] sm:rounded-3xl rounded-t-3xl shadow-2xl border border-[#E8EBF3] overflow-hidden relative max-h-[95vh] overflow-y-auto scrollbar-hide">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F6F7FB] hover:bg-[#E8EBF3] text-slate-400 hover:text-slate-700 flex items-center justify-center transition-all z-30"
          title="Close Modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ──────── STEP 1: Checkout Form ──────── */}
        {step === 'checkout' && (
          <div className="p-6 space-y-5">

            {/* Header */}
            <div className="flex items-center gap-3 border-b border-[#F0F2F8] pb-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 overflow-hidden">
                {deal?.vendorLogo ? (
                  <img src={deal.vendorLogo} alt={deal.vendorName} className="w-8 h-8 object-contain" />
                ) : (
                  <span className="text-xl font-black text-emerald-700">
                    {deal?.vendorName?.charAt(0) || 'S'}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" /> Razorpay Verified
                  </span>
                  <span className="text-[10px] font-black text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full uppercase">
                    5-Year Pass
                  </span>
                </div>
                <h3 className="text-base font-black text-[#0A0F1E] leading-tight line-clamp-2">
                  {deal?.title || 'B2B Software Pass'}
                </h3>
              </div>
            </div>

            {/* Pricing Summary Box */}
            <div className="bg-[#F6F7FB] rounded-2xl p-4 border border-slate-200/80 relative overflow-hidden">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] font-black text-emerald-700 uppercase tracking-wider mb-1">
                    Selected Pass Plan
                  </div>
                  <div className="font-black text-[#0A0F1E] text-base">{tierTitle}</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">{tierCredits}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-3xl font-black text-emerald-700">
                    ₹{tierPrice.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-slate-400 line-through">
                    ₹{annualPrice.toLocaleString('en-IN')}/yr
                  </div>
                </div>
              </div>

              {/* Savings Banner */}
              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  You save ₹{savingsAmt.toLocaleString('en-IN')} today!
                </span>
                <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                  90% OFF
                </span>
              </div>
            </div>

            {/* Buyer Contact Details Inputs */}
            <div className="space-y-3 pt-1">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Buyer Delivery Details
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ujjwal Sharma"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="input-premium text-xs py-2.5"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Email for License <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="founder@agency.in"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    className="input-premium text-xs py-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Phone (for UPI/SMS receipt)
                  </label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="input-premium text-xs py-2.5"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    GSTIN <span className="text-slate-400 font-normal">(optional B2B)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="07AAAAA0000A1Z5"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                    className="input-premium text-xs py-2.5 font-mono tracking-wider"
                  />
                </div>
              </div>
            </div>

            {/* Error Message if any */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-start gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                <div>{errorMessage}</div>
              </div>
            )}

            {/* Trust Badges */}
            <div className="space-y-1.5 pt-1">
              {[
                'Instant license code delivery & redemption guide',
                'Official 18% GST B2B invoice with input tax credit',
                '60-Day unconditional money-back guarantee',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-emerald-600" />
                  </div>
                  {item}
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={handleInitiateRazorpay}
              disabled={loading}
              className="w-full btn-primary justify-center py-4 text-sm rounded-2xl cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-emerald-700/20"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Connecting to Razorpay...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Pay ₹{tierPrice.toLocaleString('en-IN')} via Razorpay</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Trust footer */}
            <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400 font-medium pt-1">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-400" /> 256-bit SSL
              </span>
              <span>·</span>
              <span>⚡ Razorpay UPI / Cards</span>
              <span>·</span>
              <span>🛡️ RBI Compliant</span>
            </div>
          </div>
        )}

        {/* ──────── STEP 2: Processing ──────── */}
        {step === 'processing' && (
          <div className="p-12 text-center space-y-5">
            <div className="relative w-20 h-20 mx-auto">
              <div className="w-20 h-20 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="w-7 h-7 text-emerald-600 animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-black text-[#0A0F1E]">Verifying Payment...</h3>
              <p className="text-xs text-slate-500 font-medium mt-1.5">
                Authenticating cryptographic signature & allocating your 5-Year Pass Key...
              </p>
            </div>
            <div className="bg-[#F6F7FB] rounded-xl p-3 border border-[#E8EBF3] text-xs font-medium text-slate-500">
              Please do not close or refresh this tab
            </div>
          </div>
        )}

        {/* ──────── STEP 3: Success & Code Delivery ──────── */}
        {step === 'success' && (
          <div className="p-6 space-y-5">

            {/* Confetti Header */}
            <div className="text-center space-y-3 py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-4 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  PAYMENT VERIFIED VIA RAZORPAY
                </span>
                <h3 className="text-2xl font-black text-[#0A0F1E]">Payment Successful! 🎉</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Your 5-Year Pass for <strong>{deal?.title || 'SaaS Tool'}</strong> is now active.
                </p>
              </div>
            </div>

            {/* Real Code Box */}
            <div className="bg-[#090D16] text-white p-5 rounded-2xl border-2 border-emerald-500/80 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none" />
              <div className="relative">
                <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5" /> Your Official License Pass Key
                  </span>
                  <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 bg-black/50 p-3 rounded-xl border border-emerald-500/30">
                  <span className="font-mono text-lg sm:text-xl font-black tracking-wider text-emerald-300 select-all break-all">
                    {assignedCode}
                  </span>
                  <button
                    onClick={copyCode}
                    className="btn-gold text-xs px-3.5 py-2 rounded-xl shrink-0 flex items-center gap-1.5 font-bold"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>

            {/* Actions & Links */}
            <div className="space-y-2.5">
              <a
                href={`/redeem?code=${encodeURIComponent(assignedCode)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-900 transition-colors text-xs font-bold"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">🚀</span>
                  <span>How to Activate & Redeem on Vendor Portal</span>
                </div>
                <ExternalLink className="w-4 h-4 text-emerald-600" />
              </a>

              {verifiedOrder?.invoiceUrl && (
                <a
                  href={verifiedOrder.invoiceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 transition-colors text-xs font-bold"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-600" />
                    <span>Download Official 18% GST Tax Invoice</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              )}

              <div className="flex items-center gap-2 text-[11px] text-slate-500 p-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Confirmation email with instructions has been sent to <strong>{buyerEmail || currentUser?.email}</strong></span>
              </div>
            </div>

            {/* Bottom Close */}
            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
              >
                <span>Done</span>
                <Check className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode="signup"
          onSuccess={(u) => {
            setCurrentUser(u);
            setBuyerName(u.name || '');
            setBuyerEmail(u.email || '');
            setShowAuthModal(false);
          }}
        />
      )}
    </div>
  );
}
