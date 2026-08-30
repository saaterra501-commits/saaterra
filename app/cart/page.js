'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import LTDCheckoutModal from '../../components/LTDCheckoutModal';
import StackDealAtmCard from '../../components/StackDealAtmCard';
import Link from 'next/link';
import {
  Trash2, Plus, Minus, Tag, Check, ShieldCheck, Zap, FileText,
  ArrowRight, Crown, AlertCircle, ShoppingBag, Gift, Sparkles, RefreshCw
} from 'lucide-react';

const KNOWN_DEALS = {
  'chat-chacha': {
    id: 'deal-1',
    slug: 'chat-chacha',
    title: 'Chat Chacha — WhatsApp AI Marketing & Automation',
    tierName: 'Starter Pass (5-Year Access)',
    price: 1999,
    originalPrice: 24000,
    screenshot: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=400&auto=format&fit=crop&q=80',
    vendorName: 'Chat Chacha',
  },
  'bitvoiper': {
    id: 'deal-2',
    slug: 'bitvoiper',
    title: 'Bitvoiper: Cloud Based VOIP & International Calling',
    tierName: 'Pro Pass (5-Year Access)',
    price: 2999,
    originalPrice: 32000,
    screenshot: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&auto=format&fit=crop&q=80',
    vendorName: 'Bitvoiper',
  },
  'viralclippr': {
    id: 'deal-3',
    slug: 'viralclippr',
    title: 'ViralClippr: AI Offline Video to Viral Shorts Generator',
    tierName: 'Starter Pass (5-Year Access)',
    price: 2499,
    originalPrice: 28000,
    screenshot: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&auto=format&fit=crop&q=80',
    vendorName: 'ViralClippr',
  },
  'duprun': {
    id: 'deal-4',
    slug: 'duprun',
    title: 'Duprun: Launch Your Own White-Label Video Creation SaaS',
    tierName: 'Agency Lifetime Pass (LTD)',
    price: 3999,
    originalPrice: 45000,
    screenshot: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80',
    vendorName: 'Duprun',
  },
};

const DEFAULT_CART = [
  KNOWN_DEALS['chat-chacha'],
  KNOWN_DEALS['duprun'],
];

function CartContent() {
  const searchParams = useSearchParams();
  const dealParam = searchParams.get('deal');
  const tierParam = searchParams.get('tier');
  const priceParam = searchParams.get('price');

  const [cartItems, setCartItems] = useState(DEFAULT_CART);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [plusAdded, setPlusAdded] = useState(false);
  const [useWallet, setUseWallet] = useState(false);
  const [walletBalance, setWalletBalance] = useState(250);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // If URL has ?deal=..., load that specific deal into cart dynamically
  useEffect(() => {
    if (dealParam) {
      async function loadCartDeal() {
        try {
          const res = await fetch(`/api/deals/${dealParam}`);
          const data = await res.json();
          if (data?.success && data?.deal) {
            const d = data.deal;
            const chosenTier = tierParam || d.pricingTiers?.[0]?.tierName || 'Starter Pass (5-Year Access)';
            const chosenPrice = priceParam ? Number(priceParam) : (d.pricingTiers?.[0]?.price || d.price || 1999);
            
            setCartItems([{
              id: d.id || `deal-${d.slug}`,
              slug: d.slug,
              title: d.title,
              tierName: chosenTier,
              price: chosenPrice,
              originalPrice: d.originalPrice || (chosenPrice * 10),
              screenshot: d.heroImage || d.screenshot || d.screenshots?.[0] || 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=400&auto=format&fit=crop&q=80',
              vendorName: d.vendorName || 'SaaS Partner',
              quantity: 1,
            }]);
            return;
          }
        } catch (err) {
          console.warn('Cart deal fetch error:', err);
        }

        const matched = KNOWN_DEALS[dealParam] || {
          id: `deal-${dealParam}`,
          slug: dealParam,
          title: dealParam.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') + ' 5-Year Pass',
          tierName: tierParam || 'Starter Pass (5-Year Access)',
          price: priceParam ? Number(priceParam) : 1999,
          originalPrice: 24000,
          screenshot: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=400&auto=format&fit=crop&q=80',
          vendorName: 'SaaS Partner',
        };

        if (tierParam) matched.tierName = tierParam;
        if (priceParam) matched.price = Number(priceParam);

        setCartItems([{ ...matched, quantity: 1 }]);
      }

      loadCartDeal();
    }
  }, [dealParam, tierParam, priceParam]);

  // Update item quantity
  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // Remove single item
  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Apply promo coupon
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();

    if (code === 'SAATERRA10' || code === 'VIP10') {
      setAppliedCoupon({ code, discountPercent: 10, label: '10% Launch Discount' });
    } else if (code === 'FOUNDER20') {
      setAppliedCoupon({ code, discountPercent: 20, label: '20% Founder Discount' });
    } else if (code === 'SAVE500') {
      setAppliedCoupon({ code, flatDiscount: 500, label: '₹500 Flat Savings' });
    } else {
      setCouponError('Invalid or expired coupon code. Try "SAATERRA10" or "FOUNDER20".');
    }
  };

  // Calculations
  const rawSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const plusCost = plusAdded ? 999 : 0;
  const plusDiscount = plusAdded ? Math.round(rawSubtotal * 0.10) : 0;

  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      couponDiscount = Math.round(rawSubtotal * (appliedCoupon.discountPercent / 100));
    } else if (appliedCoupon.flatDiscount) {
      couponDiscount = Math.min(rawSubtotal, appliedCoupon.flatDiscount);
    }
  }

  const walletDiscount = useWallet ? Math.min(walletBalance, rawSubtotal - plusDiscount - couponDiscount) : 0;
  const totalAmount = Math.max(0, rawSubtotal + plusCost - plusDiscount - couponDiscount - walletDiscount);
  const totalSavings = (rawSubtotal * 8.5) - totalAmount; // Compared to recurring monthly SaaS
  const usdTotal = Math.round(totalAmount / 83);

  return (
    <div className="space-y-8">
      {/* Page Title Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-[#FF6B35] text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider mb-1">
            🛒 Secure Cart & Checkout
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
            Review Your 5-Year Pass Order
          </h1>
        </div>
        <Link
          href="/deals"
          className="text-xs font-black text-[#2475FF] hover:underline flex items-center gap-1"
        >
          ← Continue Shopping Deals
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-950">Your cart is empty</h3>
          <p className="text-xs text-slate-500 font-medium">
            Explore our curated 5-Year SaaS pass deals and start saving 90% on software subscriptions today!
          </p>
          <Link
            href="/deals"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B35] hover:bg-[#1a5ecc] text-white text-xs font-black rounded-xl shadow-md transition-all"
          >
            <span>Explore Marketplace Deals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* ── 1. Top Section: Cart Items Table ── */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                {/* Table Header */}
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-black tracking-wider text-[11px]">
                  <tr>
                    <th className="py-4 px-4 sm:px-6">Product</th>
                    <th className="py-4 px-4 text-center">Unit Price</th>
                    <th className="py-4 px-4 text-center">Quantity</th>
                    <th className="py-4 px-4 text-right">Subtotal</th>
                    <th className="py-4 px-4 text-center w-12"></th>
                  </tr>
                </thead>

                {/* Table Body Rows */}
                <tbody className="divide-y divide-slate-100">
                  {cartItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      
                      {/* Product Thumbnail & Title */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.screenshot}
                            alt={item.title}
                            className="w-14 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-[9px] font-black text-[#FF6B35] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded uppercase block w-fit mb-0.5">
                              {item.tierName}
                            </span>
                            <Link
                              href={`/deals/${item.slug}`}
                              className="font-bold text-slate-950 text-xs sm:text-sm hover:text-[#FF6B35] transition-colors line-clamp-1"
                            >
                              {item.title}
                            </Link>
                            <span className="text-[10px] text-slate-400 font-medium">
                              By {item.vendorName} · 5-Year Lifetime Pass
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Unit Price */}
                      <td className="py-4 px-4 text-center font-bold text-slate-900 whitespace-nowrap">
                        <div>₹{item.price.toLocaleString('en-IN')}</div>
                        <div className="text-[10px] text-slate-400">(${Math.round(item.price / 83)})</div>
                      </td>

                      {/* Quantity Controls */}
                      <td className="py-4 px-4 text-center">
                        <div className="inline-flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-6 h-6 rounded-lg bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center font-black transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center font-black text-slate-900 text-xs">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-6 h-6 rounded-lg bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center font-black transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* Subtotal */}
                      <td className="py-4 px-4 text-right font-black text-slate-950 text-sm whitespace-nowrap">
                        <div>₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          (${Math.round((item.price * item.quantity) / 83)})
                        </div>
                      </td>

                      {/* Remove Action */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Remove from cart"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Table Toolbar: Coupon Code & Clear Cart */}
            <div className="p-4 sm:p-5 bg-slate-50/90 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Coupon Code Input */}
              <form onSubmit={handleApplyCoupon} className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. SAATERRA10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 uppercase focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FF6B35] hover:bg-[#1a5ecc] text-white font-black text-xs rounded-xl shadow-xs transition-all shrink-0 cursor-pointer"
                >
                  Apply coupon
                </button>
              </form>

              {/* Right actions */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={clearCart}
                  className="text-xs font-bold text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Coupon alerts */}
            {couponError && (
              <div className="px-5 py-2.5 bg-red-50 border-t border-red-100 text-red-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{couponError}</span>
              </div>
            )}
            {appliedCoupon && (
              <div className="px-5 py-2.5 bg-emerald-50 border-t border-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Coupon <strong>{appliedCoupon.code}</strong> applied ({appliedCoupon.label})</span>
                </div>
                <button
                  onClick={() => setAppliedCoupon(null)}
                  className="text-emerald-800 hover:underline font-bold text-[11px] cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* ── 2. Grid: Left Plus Membership Upsell & Right Cart Totals ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: StackDeal Pass ATM Card & ST Wallet Credits */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Luxury ATM Style StackDeal Pass Card */}
              <StackDealAtmCard
                rawSubtotal={rawSubtotal}
                plusAdded={plusAdded}
                onTogglePlus={() => setPlusAdded(!plusAdded)}
                price={999}
              />

              {/* ST Wallet Credits Box */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-950 text-xs sm:text-sm">Redeem ST Wallet Credits</h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      You have <strong>₹{walletBalance} ST Credits</strong> available in your account.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setUseWallet(!useWallet)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    useWallet
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  {useWallet ? 'Applied (-₹250)' : 'Apply Credits'}
                </button>
              </div>

            </div>

            {/* Right Column: Cart Totals & Checkout Actions */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm space-y-5">
                <h3 className="text-xl font-black text-slate-950 pb-3 border-b border-slate-100">
                  Cart Totals
                </h3>

                {/* Line Items Breakdown */}
                <div className="space-y-3 text-xs font-semibold text-slate-700">
                  
                  <div className="flex justify-between items-center">
                    <span>Passes Subtotal ({cartItems.length} items)</span>
                    <span className="font-bold text-slate-950 text-sm">
                      ₹{rawSubtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {plusAdded && (
                    <div className="flex justify-between items-center text-amber-600 font-bold">
                      <span className="flex items-center gap-1">
                        <Crown className="w-3.5 h-3.5" /> StackDeal Plus VIP (1 Year)
                      </span>
                      <span>+₹999</span>
                    </div>
                  )}

                  {plusDiscount > 0 && (
                    <div className="flex justify-between items-center text-emerald-600 font-bold">
                      <span>StackDeal Pass 10% Discount</span>
                      <span>-₹{plusDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {couponDiscount > 0 && (
                    <div className="flex justify-between items-center text-emerald-600 font-bold">
                      <span>Promo Coupon ({appliedCoupon?.code})</span>
                      <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {walletDiscount > 0 && (
                    <div className="flex justify-between items-center text-emerald-600 font-bold">
                      <span>ST Wallet Credits</span>
                      <span>-₹{walletDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-slate-500 pt-2 border-t border-slate-100 text-[11px]">
                    <span>18% B2B GST (Input Tax Credit)</span>
                    <span className="text-emerald-700 font-bold">100% Tax Invoice Included</span>
                  </div>

                </div>

                {/* Total Row */}
                <div className="pt-4 border-t-2 border-slate-100 flex items-baseline justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase">Total Amount</div>
                    <div className="text-[10px] text-emerald-600 font-bold">
                      Total 5-Yr Recurring Savings: ~₹{totalSavings.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-black text-slate-950">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs font-bold text-slate-500">
                      (${usdTotal} USD)
                    </div>
                  </div>
                </div>

                {/* Primary Checkout Button */}
                <button
                  onClick={() => setShowCheckoutModal(true)}
                  className="w-full py-4 bg-[#FF6B35] hover:bg-[#1a5ecc] text-white font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Checkout (Razorpay UPI / Cards)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-center text-[11px] text-slate-500 font-medium">
                  Need help with your order? Reach us at{' '}
                  <a href="mailto:support@stackdeal.in" className="text-[#FF6B35] font-bold hover:underline">
                    support@stackdeal.in
                  </a>
                </div>
              </div>

              {/* Trust & Guarantee Badges */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-950">60-Day Hassle-Free Returns</h5>
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                      Shop with peace of mind knowing our return process is simple, fair, and straightforward.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2475FF] flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-950">Instant License Code Delivery</h5>
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                      Your 5-Year redemption code is instantly activated and stored in your profile dashboard.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-950">100% B2B GSTIN Tax Invoice</h5>
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                      Claim 18% Input Tax Credit with our automated Indian GST compliant invoices.
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* Checkout Modal Popup */}
      {showCheckoutModal && (
        <LTDCheckoutModal
          deal={{
            title: cartItems.length === 1 ? cartItems[0].title : `StackDeal Bundle (${cartItems.length} Passes)`,
            tier1Price: totalAmount,
            tier1Title: plusAdded ? 'Bundle + StackDeal Plus VIP' : 'StackDeal 5-Year Pass Order',
          }}
          selectedTier={plusAdded ? 'Bundle + StackDeal Plus' : 'Cart Checkout'}
          onClose={() => setShowCheckoutModal(false)}
        />
      )}
    </div>
  );
}

export default function CartPage() {
  return (
    <div className="min-h-screen bg-[#F6F7FB] flex flex-col font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full space-y-8">
        <Suspense fallback={<div className="text-center py-12 text-xs font-bold text-slate-500">Loading your cart...</div>}>
          <CartContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
