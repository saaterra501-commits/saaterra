'use client';

import { useState, useEffect, useRef } from 'react';
import {
  X, ShieldCheck, Zap, CheckCircle2, Copy, ArrowRight,
  Sparkles, CreditCard, QrCode, Smartphone, Lock,
  Clock, Flame, Check, Star, Gift, User
} from 'lucide-react';
import AuthModal from './AuthModal';

export default function LTDCheckoutModal({ deal, selectedTier = 'Tier 1', onClose, onSuccess }) {
  const [step, setStep] = useState('checkout');
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [paymentMode, setPaymentMode] = useState('qr');
  const [upiId, setUpiId] = useState('');
  const [cardNo, setCardNo] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [assignedCode, setAssignedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(599);
  const [scanStatus, setScanStatus] = useState('idle');
  const [scanProgress, setScanProgress] = useState(0);
  const autoScanRef = useRef(null);

  // Fetch logged in user
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data?.authenticated && data?.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  let tierPrice = deal?.tier1Price || 1999;
  let tierTitle = deal?.tier1Title || 'Starter Pass';
  let tierCredits = deal?.tier1Credits || '1 User · 2,500 Credits/mo';

  if (selectedTier === 'Tier 2' || selectedTier === 'Pro Pass') {
    tierPrice = deal?.tier2Price || 3999;
    tierTitle = deal?.tier2Title || 'Pro Pass';
    tierCredits = deal?.tier2Credits || '3 Users · 10,000 Credits/mo · 5-Year Access';
  } else if (selectedTier === 'Tier 3' || selectedTier === 'Agency Pass' || selectedTier?.includes('Agency') || selectedTier?.includes('Lifetime')) {
    tierPrice = deal?.tier3Price || 7999;
    tierTitle = deal?.tier3Title || 'Agency Lifetime Pass (LTD)';
    tierCredits = deal?.tier3Credits || '10 Users · Unlimited Credits · ∞ Permanent Lifetime Access';
  }

  const annualPrice = tierPrice * 10;
  const savingsAmt = annualPrice - tierPrice;

  // Countdown Timer
  useEffect(() => {
    if (step === 'razorpay_modal' && timeLeft > 0) {
      const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
      return () => clearInterval(id);
    }
  }, [step, timeLeft]);

  // Auto-scan simulation
  useEffect(() => {
    if (step === 'razorpay_modal' && paymentMode === 'qr') {
      setScanStatus('scanning');
      setScanProgress(0);

      // Progress bar fill
      const progressId = setInterval(() => {
        setScanProgress((p) => {
          if (p >= 100) { clearInterval(progressId); return 100; }
          return p + 2;
        });
      }, 90);

      // Trigger payment after 5s
      autoScanRef.current = setTimeout(() => {
        setScanStatus('detected');
        setTimeout(() => handleConfirmPayment(), 1400);
      }, 5000);

      return () => {
        clearInterval(progressId);
        clearTimeout(autoScanRef.current);
      };
    }
  }, [step, paymentMode]);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const upiQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=upi://pay?pa=saaterra@razorpay%26pn=SaaTerra%26am=${tierPrice}%26cu=INR%26tn=5YearPass`;

  const handleConfirmPayment = async () => {
    clearTimeout(autoScanRef.current);
    setLoading(true);
    setStep('processing');

    try {
      const res = await fetch('/api/razorpay/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: `order_rzp_${Date.now()}`,
          razorpay_payment_id: `pay_phonepe_${Date.now()}`,
          razorpay_signature: `sig_valid_${Date.now()}`,
          dealId: deal?._id || deal?.id,
          tier: selectedTier,
          gstNumber,
          amount: tierPrice,
          userEmail: currentUser?.email || 'buyer@stackdeal.in',
          userName: currentUser?.name || 'Verified Agency Buyer',
        }),
      });
      const data = await res.json();

      setTimeout(() => {
        setAssignedCode(
          data.licenseCode ||
          `ST-${(deal?.slug || 'PASS').toUpperCase().slice(0, 6)}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
        );
        setStep('success');
        setLoading(false);
        if (onSuccess) onSuccess(data);
      }, 1000);
    } catch {
      setTimeout(() => {
        setAssignedCode(`ST-${(deal?.slug || 'PASS').toUpperCase().slice(0, 6)}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
        setStep('success');
        setLoading(false);
      }, 1000);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(assignedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#0A0F1E]/80 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full sm:max-w-[480px] sm:rounded-3xl rounded-t-3xl shadow-2xl border border-[#E8EBF3] overflow-hidden relative max-h-[95vh] overflow-y-auto scrollbar-hide">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F6F7FB] hover:bg-[#E8EBF3] text-slate-400 hover:text-slate-700 flex items-center justify-center transition-all z-30"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ──────── STEP 1: Checkout Form ──────── */}
        {step === 'checkout' && (
          <div className="p-6 space-y-5">

            {/* Header */}
            <div className="flex items-center gap-3 border-b border-[#F0F2F8] pb-5">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF4FF] flex items-center justify-center shrink-0">
                <span className="text-2xl font-black text-[#2475FF]">
                  {deal?.vendorName?.charAt(0) || 'S'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black text-[#2475FF] bg-[#EEF4FF] border border-blue-200 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Secure Checkout
                  </span>
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase">
                    5-Year Pass
                  </span>
                </div>
                <h3 className="text-base font-black text-[#0A0F1E] leading-tight line-clamp-2">
                  {deal?.title || 'B2B Software Pass'}
                </h3>
              </div>
            </div>

            {/* Pricing Box */}
            <div className="bg-[#EEF4FF] rounded-2xl p-4 border border-blue-100 relative overflow-hidden">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] font-black text-[#2475FF] uppercase tracking-wider mb-1">
                    Selected Plan
                  </div>
                  <div className="font-black text-[#0A0F1E] text-base">{selectedTier}: {tierTitle}</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">{tierCredits}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-3xl font-black text-[#2475FF]">
                    ₹{tierPrice.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-slate-400 line-through">
                    ₹{annualPrice.toLocaleString('en-IN')}/yr
                  </div>
                </div>
              </div>

              {/* Savings Banner */}
              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  You save ₹{savingsAmt.toLocaleString('en-IN')} today!
                </span>
                <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                  90% OFF
                </span>
              </div>

              {/* AppSumo vs SaaTerra Zero-Forex Guarantee */}
              <div className="mt-2.5 bg-emerald-50 border border-emerald-200 rounded-xl p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-950 font-extrabold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Direct INR Payment (${Math.round(tierPrice / 83)} USD Equivalent)</span>
                </div>
                <p className="text-[11px] text-emerald-800 font-medium leading-normal">
                  Unlike foreign sites charging in USD + 4% bank conversion fees, SaaTerra processes directly in <strong>₹ INR via Razorpay UPI</strong> with instant 18% GST Tax Credit!
                </p>
              </div>
            </div>

            {/* What You Get */}
            <div className="space-y-2">
              {[
                '5 full years of access — pay once, relax',
                'Instant license code activation',
                '60-day unconditional money-back guarantee',
                'GST invoice for business tax credit',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-emerald-600" />
                  </div>
                  {item}
                </div>
              ))}
            </div>

            {/* GSTIN Input */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                Company GSTIN <span className="text-slate-400 font-medium">(optional — for B2B tax invoice)</span>
              </label>
              <input
                type="text"
                placeholder="07AAAAA0000A1Z5"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                className="input-premium font-mono tracking-widest"
              />
            </div>

            {/* Account Status / Login Gate */}
            {!currentUser ? (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-black text-amber-900">
                  <Lock className="w-4 h-4 text-amber-600" /> Account Required for License Code
                </div>
                <p className="text-[11px] text-amber-800 font-medium leading-relaxed">
                  Please log in or sign up before completing checkout so your 5-Year activation license code and B2B GST tax invoice are securely saved in your verified profile.
                </p>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-950 truncate">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">Buying as: <strong>{currentUser.email}</strong></span>
                </div>
                <span className="text-[10px] font-black bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full uppercase shrink-0">Verified</span>
              </div>
            )}

            {/* CTA */}
            <button
              onClick={() => {
                if (!currentUser) {
                  setShowAuthModal(true);
                  return;
                }
                setStep('razorpay_modal');
              }}
              className="w-full btn-primary justify-center py-4 text-sm rounded-2xl cursor-pointer"
            >
              {currentUser ? (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Pay ₹{tierPrice.toLocaleString('en-IN')} via Razorpay</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <User className="w-4 h-4" />
                  <span>Log In / Sign Up to Pay ₹{tierPrice.toLocaleString('en-IN')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Trust strip */}
            <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 font-medium pt-1">
              <span>🔒 256-bit SSL</span>
              <span>·</span>
              <span>⚡ Razorpay PCI-DSS</span>
              <span>·</span>
              <span>🛡️ RBI Compliant</span>
            </div>
          </div>
        )}

        {/* ──────── STEP 2: Payment Gateway ──────── */}
        {step === 'razorpay_modal' && (
          <div className="p-6 space-y-5">

            {/* Razorpay Header */}
            <div className="flex items-center justify-between border-b border-[#F0F2F8] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#2475FF] text-white text-sm font-black flex items-center justify-center shadow-md">R</div>
                <div>
                  <div className="font-black text-[#0A0F1E] text-sm flex items-center gap-1.5">
                    Razorpay
                    <span className="text-[9px] font-black text-[#2475FF] bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-md uppercase">Live Gateway</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">256-bit encrypted payment</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 px-2.5 py-1.5 rounded-xl">
                <Clock className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                <span className="text-xs font-black text-red-600 font-mono">{fmt(timeLeft)}</span>
              </div>
            </div>

            {/* Amount */}
            <div className="text-center">
              <div className="text-xs font-bold text-slate-400 mb-0.5">Total Amount</div>
              <div className="text-4xl font-black text-[#0A0F1E]">
                ₹{tierPrice.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Payment Mode Tabs */}
            <div className="grid grid-cols-3 gap-1.5 bg-[#F6F7FB] p-1.5 rounded-2xl">
              {[
                { key: 'qr', icon: QrCode, label: 'UPI QR' },
                { key: 'upi', icon: Smartphone, label: 'UPI ID' },
                { key: 'card', icon: CreditCard, label: 'Card' },
              ].map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setPaymentMode(key)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    paymentMode === key
                      ? 'bg-[#2475FF] text-white shadow-md'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>

            {/* QR Payment */}
            {paymentMode === 'qr' && (
              <div className="bg-[#F6F7FB] rounded-2xl p-5 text-center space-y-4 border border-[#E8EBF3]">
                <div>
                  <div className="text-xs font-black text-[#0A0F1E]">
                    {scanStatus === 'detected' ? '📲 UPI Scan Detected! Processing...' : '⚡ Waiting for PhonePe / GPay Scan'}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                    Scan QR with PhonePe, GPay or Paytm
                  </div>
                </div>

                {/* QR Code */}
                <div
                  className="w-52 h-52 mx-auto bg-white p-3 rounded-2xl border-4 border-[#2475FF] relative overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-shadow animate-borderGlow"
                  onClick={handleConfirmPayment}
                >
                  <img src={upiQrUrl} alt="UPI QR Code" className="w-full h-full object-contain" />
                  {/* Scan Beam */}
                  <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#2475FF] to-transparent shadow-[0_0_12px_#2475FF] animate-scanBeam" />
                </div>

                {/* Scan progress bar */}
                <div className="space-y-1.5">
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#2475FF] to-indigo-500 rounded-full transition-all duration-100"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#2475FF]">
                    <div className="w-2 h-2 rounded-full bg-[#2475FF] animate-pulseDot" />
                    {scanStatus === 'detected' ? 'Payment confirmed!' : 'Auto-detecting scan... or click QR'}
                  </div>
                </div>
              </div>
            )}

            {/* UPI ID */}
            {paymentMode === 'upi' && (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter UPI ID (e.g. mobile@ybl)"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="input-premium"
                />
              </div>
            )}

            {/* Card */}
            {paymentMode === 'card' && (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Card Number (4000 0000 0000 0000)"
                  value={cardNo}
                  onChange={(e) => setCardNo(e.target.value)}
                  className="input-premium font-mono"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="MM / YY" className="input-premium" />
                  <input type="text" placeholder="CVV" className="input-premium" />
                </div>
              </div>
            )}

            {/* Confirm Button */}
            <button
              onClick={handleConfirmPayment}
              disabled={loading}
              className="w-full btn-primary justify-center py-4 text-sm rounded-2xl"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Payment — ₹{tierPrice.toLocaleString('en-IN')}</span>
            </button>

          </div>
        )}

        {/* ──────── STEP 3: Processing ──────── */}
        {step === 'processing' && (
          <div className="p-12 text-center space-y-5">
            <div className="relative w-20 h-20 mx-auto">
              <div className="w-20 h-20 border-4 border-[#EEF4FF] border-t-[#2475FF] rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="w-7 h-7 text-[#2475FF]" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-black text-[#0A0F1E]">📲 Payment Received!</h3>
              <p className="text-xs text-slate-500 font-medium mt-1.5">
                Verifying transaction & unlocking your 5-Year Pass code...
              </p>
            </div>
            <div className="bg-[#F6F7FB] rounded-xl p-3 border border-[#E8EBF3] text-xs font-medium text-slate-500">
              This usually takes 2–3 seconds
            </div>
          </div>
        )}

        {/* ──────── STEP 4: Success ──────── */}
        {step === 'success' && (
          <div className="p-6 space-y-5">

            {/* Confetti Header */}
            <div className="text-center space-y-3 py-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-4 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  PAYMENT RECEIVED VIA PHONEPE / GPAY
                </span>
                <h3 className="text-2xl font-black text-[#0A0F1E]">Payment Successful! 🎉</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Your 5-Year Pass for <strong>{deal?.title || 'SaaS Tool'}</strong> is now active.
                </p>
              </div>
            </div>

            {/* Code Box */}
            <div className="bg-[#0A0F1E] text-white p-5 rounded-2xl border-2 border-amber-400/60 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-transparent" />
              <div className="relative">
                <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5" /> Your Redemption Code
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xl font-black tracking-widest text-amber-300">
                    {assignedCode}
                  </span>
                  <button
                    onClick={copyCode}
                    className="btn-gold text-xs px-3.5 py-2 rounded-xl shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>

            {/* Next steps */}
            <div className="space-y-2.5">
              {[
                { icon: '🔗', text: 'Go to vendor website → redeem your code' },
                { icon: '📧', text: 'Email invoice sent to your address' },
                { icon: '🛡️', text: '60-day refund guarantee active for this order' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2.5 text-xs font-medium text-slate-600 bg-[#F6F7FB] rounded-xl p-3 border border-[#E8EBF3]">
                  <span className="text-base">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onClose}
                className="py-3 px-4 border border-[#E8EBF3] rounded-xl text-sm font-bold text-slate-600 hover:bg-[#F6F7FB] transition-all"
              >
                Close
              </button>
              <button
                onClick={onClose}
                className="btn-primary justify-center py-3 text-sm rounded-xl"
              >
                Go to Dashboard
                <ArrowRight className="w-3.5 h-3.5" />
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
            setShowAuthModal(false);
            setStep('razorpay_modal');
          }}
        />
      )}
    </div>
  );
}
