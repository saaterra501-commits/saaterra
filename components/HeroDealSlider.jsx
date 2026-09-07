'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const CASHKARO_BANNERS = [
  {
    id: 'flipkart-deal',
    brandName: 'Flipkart',
    logoType: 'flipkart',
    discount: '50-90% Off',
    subtitle: 'Across Categories',
    cashbackTag: 'CK',
    cashbackText: 'Upto 6.5% Cashback',
    pillBg: 'bg-[#002B7A]',
    gradient: 'from-[#0070F3] via-[#0056D2] to-[#003DB3]',
    href: '/deals/chat-chacha',
    products: {
      type: 'flipkart',
      shoeImg: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=350&q=80',
      bagImg: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=250&q=80',
      watchImg: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=200&q=80',
    },
  },
  {
    id: 'amazon-deal',
    brandName: 'amazon.in',
    logoType: 'amazon',
    discount: 'Upto 80% Off',
    subtitle: 'Across Categories',
    cashbackTag: 'CK',
    cashbackText: 'Upto 5% Rewards',
    pillBg: 'bg-[#004080]',
    gradient: 'from-[#FF7A00] via-[#FF6600] to-[#E65100]',
    href: '/deals/seo-rocket',
    products: {
      type: 'amazon',
      headphoneImg: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80',
      phoneImg: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=250&q=80',
      sneakerImg: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=250&q=80',
    },
  },
  {
    id: 'nykaa-deal',
    brandName: 'NYKAA',
    logoType: 'nykaa',
    tagBadge: 'PAY DAY SALE',
    discount: 'Upto 50% Off',
    subtitle: 'On Selected Products',
    cashbackTag: 'CK',
    cashbackText: 'Upto 4% Cashback',
    pillBg: 'bg-[#003B6F]',
    gradient: 'from-[#D8FAF4] via-[#86E7D8] to-[#20C997]',
    textColor: 'text-slate-900',
    href: '/deals/geo-citation',
    products: {
      type: 'nykaa',
      serumImg: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=300&q=80',
      lotionImg: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=250&q=80',
      perfumeImg: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=200&q=80',
    },
  },
  {
    id: 'myntra-deal',
    brandName: 'Myntra',
    logoType: 'myntra',
    discount: '40-80% Off',
    subtitle: 'Fashion & Footwear Deals',
    cashbackTag: 'CK',
    cashbackText: 'Upto 8% Cashback',
    pillBg: 'bg-[#4A0033]',
    gradient: 'from-[#FF3F6C] via-[#E72B57] to-[#C2185B]',
    href: '/deals',
    products: {
      type: 'myntra',
      shoeImg: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=300&q=80',
      bagImg: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=250&q=80',
    },
  },
  {
    id: 'croma-deal',
    brandName: 'Croma',
    logoType: 'croma',
    discount: 'Upto 65% Off',
    subtitle: 'Laptops, TVs & Electronics',
    cashbackTag: 'CK',
    cashbackText: 'Upto 3.5% Cashback',
    pillBg: 'bg-[#002D33]',
    gradient: 'from-[#009688] via-[#00796B] to-[#004D40]',
    href: '/deals',
    products: {
      type: 'croma',
      laptopImg: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=300&q=80',
    },
  },
];

const TOP_CATEGORIES = [
  {
    id: 'most-popular',
    name: 'Most Popular',
    categoryKey: 'All',
    isMostPopular: true,
  },
  {
    id: 'fashion',
    name: 'Fashion',
    categoryKey: 'Fashion',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'credit-cards',
    name: 'Credit Cards',
    categoryKey: 'Credit Cards',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'beauty-grooming',
    name: 'Beauty & Grooming',
    categoryKey: 'Beauty & Grooming',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'home-kitchen',
    name: 'Home & Kitchen',
    categoryKey: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'electronics',
    name: 'Electronics',
    categoryKey: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'food-grocery',
    name: 'Food & Grocery',
    categoryKey: 'Food & Grocery',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'mobiles',
    name: 'Mobiles',
    categoryKey: 'Mobiles',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'pharmacy',
    name: 'Pharmacy',
    categoryKey: 'Pharmacy',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'min-50-cashback',
    name: 'Min 50% Cashback',
    categoryKey: 'Min 50%',
    isMinCashback: true,
  },
];

export default function HeroDealSlider({
  deals = [],
  onBuyClick,
  activeCat = 'All',
  onSelectCategory,
}) {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const updateScrollButtons = () => {
    if (!trackRef.current) return;
    setCanScrollLeft(trackRef.current.scrollLeft > 30);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (el) {
      el.addEventListener('scroll', updateScrollButtons);
      return () => el.removeEventListener('scroll', updateScrollButtons);
    }
  }, []);

  const handleScroll = (distance) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: distance, behavior: 'smooth' });
  };

  // Auto-scroll banners smoothly every 5.5s
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      if (!trackRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 40) {
        trackRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        trackRef.current.scrollBy({ left: 450, behavior: 'smooth' });
      }
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleCategoryClick = (catKey) => {
    if (onSelectCategory) {
      onSelectCategory(catKey);
    }
    const dealsGrid = document.getElementById('deals-grid');
    if (dealsGrid) {
      dealsGrid.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="cashkaro-exact-hero w-full bg-white pt-6 pb-8 select-none overflow-hidden">
      
      {/* ── 1. FULL SCREEN MULTI-CARD BANNER CAROUSEL ── */}
      <div
        className="relative w-full px-4 sm:px-8 lg:px-12 xl:px-16"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left Arrow Button */}
        {canScrollLeft && (
          <button
            onClick={() => handleScroll(-460)}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-slate-800 shadow-xl border border-slate-200/90 flex items-center justify-center hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all z-30 cursor-pointer absolute left-6 sm:left-10 xl:left-14 top-1/2 -translate-y-1/2"
            aria-label="Previous Deals"
          >
            <ChevronLeft className="w-5 h-5 font-black text-slate-700" />
          </button>
        )}

        {/* Right Arrow Button (Exact floating circular white button with chevron from screenshot) */}
        <button
          onClick={() => handleScroll(460)}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-slate-800 shadow-xl border border-slate-200/90 flex items-center justify-center hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all z-30 cursor-pointer absolute right-6 sm:right-10 xl:right-14 top-1/2 -translate-y-1/2"
          aria-label="Next Deals"
        >
          <ChevronRight className="w-5 h-5 font-black text-slate-700" />
        </button>

        {/* Full Screen Width Horizontal Scroll Track */}
        <div
          ref={trackRef}
          className="flex items-center gap-4 sm:gap-6 overflow-x-auto scroll-smooth scrollbar-none py-2 px-1 w-full"
        >
          {CASHKARO_BANNERS.map((banner) => (
            <Link
              key={banner.id}
              href={banner.href}
              className={`relative flex-shrink-0 w-[340px] sm:w-[410px] lg:w-[450px] xl:w-[480px] h-[195px] sm:h-[220px] lg:h-[235px] rounded-[22px] bg-gradient-to-r ${banner.gradient} p-5 sm:p-7 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 overflow-hidden flex flex-col justify-between cursor-pointer group`}
            >
              {/* Subtle ambient lighting */}
              <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />

              {/* ── Card Header (Logo / Brand) ── */}
              <div className="z-10 flex items-center gap-2">
                {banner.logoType === 'flipkart' && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl sm:text-2xl font-black italic tracking-tight text-white drop-shadow-xs">
                      Flipkart
                    </span>
                    <span className="w-5 h-5 rounded bg-[#FFE500] text-[#0052cc] flex items-center justify-center text-[10px] font-black italic shadow-xs">
                      f
                    </span>
                  </div>
                )}

                {banner.logoType === 'amazon' && (
                  <div className="flex flex-col">
                    <span className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-xs">
                      amazon<span className="text-white/80 font-bold text-sm">.in</span>
                    </span>
                    <svg className="w-16 h-3 text-[#FF9900] -mt-1" viewBox="0 0 100 20" fill="currentColor">
                      <path d="M5 5 Q50 20 95 5 Q50 15 5 5" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                  </div>
                )}

                {banner.logoType === 'nykaa' && (
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl font-black italic tracking-widest text-[#E80071] drop-shadow-xs">
                      NYKAA
                    </span>
                    <span className="bg-[#20C997] text-white text-[9px] font-black px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
                      PAY DAY SALE
                    </span>
                  </div>
                )}

                {banner.logoType === 'myntra' && (
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-xs">
                    Myntra
                  </span>
                )}

                {banner.logoType === 'croma' && (
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-xs">
                    croma
                  </span>
                )}
              </div>

              {/* ── Card Body (Discount & Subtitle) ── */}
              <div className="z-10 my-auto">
                <h3 className={`text-2xl sm:text-3xl lg:text-[36px] font-black tracking-tight leading-none drop-shadow-xs ${banner.textColor || 'text-white'}`}>
                  {banner.discount}
                </h3>
                <p className={`text-xs sm:text-sm font-semibold mt-2 line-clamp-1 ${banner.textColor ? 'text-slate-800' : 'text-white/90'}`}>
                  {banner.subtitle}
                </p>
              </div>

              {/* ── Card Footer (Exact [CK] Pill Badge from Screenshot) ── */}
              <div className="z-10 flex items-center justify-between">
                <div className={`inline-flex items-center gap-2 ${banner.pillBg} text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs border border-white/15`}>
                  <span className="w-5 h-5 rounded bg-[#0066FF] text-white flex items-center justify-center text-[10px] font-black shrink-0 shadow-xs">
                    {banner.cashbackTag}
                  </span>
                  <span className="font-extrabold text-[11px] sm:text-xs tracking-tight">
                    {banner.cashbackText}
                  </span>
                </div>
              </div>

              {/* ── Right Side Cutout Product Photography Collage (Exact Match) ── */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-[150px] sm:w-[185px] h-[150px] sm:h-[175px] pointer-events-none flex items-center justify-center">
                {banner.logoType === 'flipkart' && (
                  <div className="relative w-full h-full flex items-center justify-end">
                    {/* Backpack */}
                    <div className="absolute right-14 top-1 w-20 sm:w-24 h-28 sm:h-32 rounded-xl overflow-hidden shadow-xl transform rotate-3">
                      <img src={banner.products.bagImg} alt="Bag" className="w-full h-full object-cover" />
                    </div>
                    {/* Blue Running Shoe */}
                    <div className="absolute right-0 bottom-1 w-24 sm:w-28 h-20 sm:h-24 rounded-xl overflow-hidden shadow-2xl transform -rotate-12 z-10 border-2 border-white/40">
                      <img src={banner.products.shoeImg} alt="Shoe" className="w-full h-full object-cover" />
                    </div>
                    {/* Luxury Watch */}
                    <div className="absolute right-18 bottom-0 w-12 sm:w-14 h-12 sm:h-14 rounded-full overflow-hidden shadow-lg z-20 border-2 border-white">
                      <img src={banner.products.watchImg} alt="Watch" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}

                {banner.logoType === 'amazon' && (
                  <div className="relative w-full h-full flex items-center justify-end">
                    {/* Delivery Box / Headphones */}
                    <div className="absolute right-8 top-1 w-20 sm:w-24 h-20 sm:h-24 rounded-2xl overflow-hidden shadow-xl transform -rotate-6">
                      <img src={banner.products.headphoneImg} alt="Headphones" className="w-full h-full object-cover" />
                    </div>
                    {/* White Sneaker */}
                    <div className="absolute right-0 bottom-2 w-24 sm:w-28 h-20 sm:h-24 rounded-xl overflow-hidden shadow-2xl transform rotate-6 z-10 border-2 border-white/40">
                      <img src={banner.products.sneakerImg} alt="Sneaker" className="w-full h-full object-cover" />
                    </div>
                    {/* Smartphone */}
                    <div className="absolute right-18 bottom-1 w-11 sm:w-13 h-18 sm:h-22 rounded-lg overflow-hidden shadow-lg z-20 border-2 border-white">
                      <img src={banner.products.phoneImg} alt="Mobile" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}

                {banner.logoType === 'nykaa' && (
                  <div className="relative w-full h-full flex items-center justify-end">
                    {/* Golden Cosmetic Bottle */}
                    <div className="absolute right-8 top-1 w-16 sm:w-20 h-28 sm:h-34 rounded-xl overflow-hidden shadow-xl transform rotate-6">
                      <img src={banner.products.serumImg} alt="Serum" className="w-full h-full object-cover" />
                    </div>
                    {/* Skincare Bottle */}
                    <div className="absolute right-0 bottom-2 w-16 sm:w-20 h-20 sm:h-24 rounded-xl overflow-hidden shadow-2xl transform -rotate-6 z-10 border-2 border-white/60">
                      <img src={banner.products.lotionImg} alt="Lotion" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}

                {banner.logoType === 'myntra' && (
                  <div className="relative w-full h-full flex items-center justify-end">
                    <div className="absolute right-4 top-2 w-28 h-28 rounded-xl overflow-hidden shadow-xl transform rotate-6">
                      <img src={banner.products.shoeImg} alt="Fashion" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}

                {banner.logoType === 'croma' && (
                  <div className="relative w-full h-full flex items-center justify-end">
                    <div className="absolute right-4 top-2 w-32 h-28 rounded-xl overflow-hidden shadow-xl transform -rotate-6">
                      <img src={banner.products.laptopImg} alt="Laptop" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
              </div>

            </Link>
          ))}
        </div>
      </div>

      {/* ── 2. TOP CATEGORIES SECTION (TRUE FULL SCREEN WIDTH) ── */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 pt-9 pb-4">
        
        {/* Section Heading */}
        <h2 className="text-xl sm:text-2xl lg:text-[26px] font-black text-slate-900 tracking-tight mb-6">
          Top Categories
        </h2>

        {/* Circular Category Items Row (Full Screen Even Spread on Desktop) */}
        <div className="w-full flex items-start justify-between gap-3 sm:gap-4 lg:gap-5 overflow-x-auto scrollbar-none pb-3 pt-1">
          {TOP_CATEGORIES.map((cat) => {
            const isSelected = activeCat === cat.categoryKey;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.categoryKey)}
                className="flex flex-col items-center flex-shrink-0 group cursor-pointer text-center focus:outline-hidden"
              >
                {/* ── 2A. "MOST POPULAR" Blue Circular Badge (Exact match to screenshot) ── */}
                {cat.isMostPopular && (
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 lg:w-26 lg:h-26 xl:w-28 xl:h-28 rounded-full bg-[#0052cc] border-2 border-blue-400 text-yellow-300 font-black text-center flex flex-col items-center justify-center shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all duration-200 ${
                    activeCat === 'All' ? 'ring-4 ring-blue-300 scale-105' : ''
                  }`}>
                    <span className="text-[12px] sm:text-[14px] lg:text-[15px] leading-tight font-black tracking-tight text-yellow-300">
                      MOST
                    </span>
                    <span className="text-[12px] sm:text-[14px] lg:text-[15px] leading-tight font-black tracking-tight text-yellow-300">
                      POPULAR
                    </span>
                  </div>
                )}

                {/* ── 2B. "Min 50% Cashback" Red Circular Badge (Exact match to screenshot) ── */}
                {cat.isMinCashback && (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-26 lg:h-26 xl:w-28 xl:h-28 rounded-full bg-white border-2 border-red-500 text-center flex flex-col items-center justify-center shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all duration-200">
                    <span className="text-[10px] sm:text-[11px] lg:text-xs font-bold text-red-600 leading-tight">
                      Min
                    </span>
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-red-600 leading-none tracking-tighter">
                      50%
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-bold text-red-600 uppercase tracking-tight">
                      Cashback
                    </span>
                  </div>
                )}

                {/* ── 2C. Photographic Circular Categories (Fashion, Credit Cards, Mobiles, etc.) ── */}
                {!cat.isMostPopular && !cat.isMinCashback && (
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 lg:w-26 lg:h-26 xl:w-28 xl:h-28 rounded-full bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center overflow-hidden p-1.5 sm:p-2 group-hover:scale-105 group-hover:shadow-md transition-all duration-200 ${
                    isSelected ? 'ring-4 ring-blue-400/40 border-blue-500 scale-105' : ''
                  }`}>
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-full group-hover:scale-108 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Category Label Below */}
                <span className={`text-xs sm:text-[13px] lg:text-sm font-bold mt-2.5 max-w-[85px] sm:max-w-[105px] leading-tight transition-colors ${
                  isSelected ? 'text-blue-600 font-black' : 'text-slate-700 group-hover:text-slate-950'
                }`}>
                  {cat.name}
                </span>

              </button>
            );
          })}
        </div>

      </div>

    </section>
  );
}
