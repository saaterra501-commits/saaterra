'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DynamicPromoBanner() {
  const [promo, setPromo] = useState(null);

  useEffect(() => {
    async function loadPromo() {
      try {
        const res = await fetch('/api/site-config');
        if (!res.ok) return;
        const data = await res.json();
        if (data?.success && data?.config?.promoBanner?.enabled) {
          setPromo(data.config.promoBanner);
        }
      } catch (e) {}
    }
    loadPromo();
  }, []);

  if (!promo || !promo.enabled) {
    return null;
  }

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-8 sm:pt-14 sm:pb-10 animate-fadeIn">
      <div className="relative rounded-[24px] bg-[#FFF0EB] border border-[#FFE2D6] px-6 py-10 sm:px-10 sm:py-12 lg:py-14 lg:pl-[440px] lg:pr-12">
        
        {/* Overhanging Left Card */}
        <div className="lg:absolute lg:left-8 lg:-top-8 lg:-bottom-8 lg:w-[380px] xl:w-[400px] w-full bg-white rounded-[16px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col justify-between overflow-hidden z-20 mb-8 lg:mb-0">
          <div className="h-[6px] w-full bg-[#FF5A36]" />

          <div className="p-7 sm:p-9 flex flex-col items-center text-center flex-1 justify-between">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-[20px] sm:text-[22px] font-black tracking-wider text-[#111]">
                {promo.badge?.split(' ')[0] || 'STACKDEAL'}
              </span>
              <span className="text-gray-300 font-light text-2xl">|</span>
              <span className="text-[20px] sm:text-[22px] font-bold tracking-wider text-[#FF5A36]">
                {promo.badge?.split(' ').slice(1).join(' ') || 'PLUS'}
              </span>
            </div>

            <h3 className="text-[#FF5A36] text-[18px] sm:text-[20px] font-extrabold leading-snug mb-3">
              {promo.title || 'Save $350+/year on essential tools to grow your business'}
            </h3>

            <p className="text-[#333] text-[14px] sm:text-[15px] leading-relaxed mb-6 font-medium">
              {promo.subtitle || 'Enjoy member-only perks that will help your business scale faster.'}
            </p>

            <div className="flex items-baseline justify-center gap-2 mb-6">
              <span className="text-[36px] sm:text-[40px] font-black text-[#111]">
                {promo.price || '$99'}
              </span>
              <span className="text-[14px] text-gray-500 font-semibold">
                {promo.priceSubtitle || 'Annual membership'}
              </span>
            </div>

            <Link
              href={promo.buttonLink || '/plus'}
              className="w-full py-[14px] px-6 bg-[#FFB900] hover:bg-[#EAA900] text-[#111] font-black text-[16px] rounded-[6px] transition-all duration-200 shadow-sm hover:shadow-md text-center block no-underline cursor-pointer"
            >
              {promo.buttonText || 'Join StackDeal Plus'}
            </Link>

            <p className="text-[11px] text-gray-500 text-center mt-4 leading-normal max-w-[280px]">
              This membership is billed annually. You can cancel at any time and not be charged for the following year.
            </p>
          </div>
        </div>

        {/* Right Perks */}
        <div className="flex flex-col justify-center space-y-6 sm:space-y-7">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 shrink-0 flex items-center justify-center text-[#111] mt-0.5">
              <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="7" y="10" width="22" height="13" rx="2" transform="rotate(-15 7 10)" />
                <ellipse cx="32" cy="24" rx="9" ry="3.5" />
                <path d="M23 24v5c0 1.9 4 3.5 9 3.5s9-1.6 9-3.5v-5" />
                <path d="M23 29v5c0 1.9 4 3.5 9 3.5s9-1.6 9-3.5v-5" />
              </svg>
            </div>
            <div>
              <h4 className="text-[16px] font-extrabold text-[#111] mb-1">10% off all the time</h4>
              <p className="text-[13px] text-[#444] leading-relaxed">Auto-applies to your cart. No purchase limit.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 shrink-0 flex items-center justify-center text-[#111] mt-0.5">
              <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="24" cy="26" r="13" />
                <polyline points="24 19 24 26 29 26" />
                <path d="M13 13l3.5 3.5" />
                <path d="M35 13l-3.5 3.5" />
              </svg>
            </div>
            <div>
              <h4 className="text-[16px] font-extrabold text-[#111] mb-1">Special sales</h4>
              <p className="text-[13px] text-[#444] leading-relaxed">Extra time to purchase with Extended Access.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 shrink-0 flex items-center justify-center text-[#111] mt-0.5">
              <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="13" y="21" width="22" height="18" rx="4" />
                <path d="M18 21V15a6 6 0 1 1 12 0v6" />
              </svg>
            </div>
            <div>
              <h4 className="text-[16px] font-extrabold text-[#111] mb-1">Member-only deals</h4>
              <p className="text-[13px] text-[#444] leading-relaxed">Unlock exclusive tools and community perks—just for VIPs.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
