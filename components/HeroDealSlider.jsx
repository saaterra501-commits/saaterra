'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const DEFAULT_SLIDES = [
  {
    id: 'slide-1',
    badge: '🔥 Featured Deal',
    title: 'Run Your Ecommerce Store Without Plugins',
    description: 'Powerful tools for businesses, startups and agencies. Get long-term SaaS access with a simple one-time payment.',
    price: 999,
    originalPrice: 4999,
    accessText: '/ 5-Year Access',
    buttonText: 'Get This Deal',
    href: '/deals/run-your-ecommerce-store-without-plugins',
    image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'slide-2',
    badge: '🚀 New Deal',
    title: 'Powerful SaaS Tools For Your Business',
    description: 'Discover useful software for marketing, automation, sales, AI and productivity without recurring bills.',
    price: 1499,
    originalPrice: 6999,
    accessText: '/ 5-Year Access',
    buttonText: 'Explore Deal',
    href: '/deals',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'slide-3',
    badge: '⭐ Popular Deal',
    title: 'One Payment. 5 Years of SaaS Access.',
    description: 'Find the software your business needs without expensive recurring dollar subscriptions.',
    price: 799,
    originalPrice: 3999,
    accessText: '/ 5-Year Access',
    buttonText: 'View All Deals',
    href: '/deals',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
  }
];

export default function HeroDealSlider({ deals = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // If dynamic deals are provided from MongoDB, map them cleanly while preserving user's exact structure
  const slides = (deals && deals.length > 0)
    ? deals.slice(0, 6).map((d, idx) => {
        const starterTier = d.pricingTiers && d.pricingTiers.length > 0 ? d.pricingTiers[0] : null;
        const price = Number(d.tier1Price ?? starterTier?.price ?? d.price ?? 999);
        const originalPrice = Number(d.originalPrice ?? starterTier?.originalPrice ?? (price * 5));
        const defaultSlide = DEFAULT_SLIDES[idx % DEFAULT_SLIDES.length];

        return {
          id: d.slug || d.id || `slide-${idx}`,
          badge: idx === 0 ? '🔥 Featured Deal' : idx === 1 ? '🚀 New Deal' : '⭐ Popular Deal',
          title: d.title || defaultSlide.title,
          description: d.tagline || defaultSlide.description,
          price: price,
          originalPrice: originalPrice,
          accessText: '/ 5-Year Access',
          buttonText: idx === 0 ? 'Get This Deal' : 'Explore Deal',
          href: `/deals/${d.slug}`,
          image: d.screenshot || d.heroImage || defaultSlide.image,
        };
      })
    : DEFAULT_SLIDES;

  const [stripConfig, setStripConfig] = useState({
    enabled: true,
    isSlim: true,
    items: [
      { text: '5-Year Access', icon: '✓' },
      { text: 'One-Time Payment', icon: '⚡' },
      { text: 'Business Deals', icon: '★' },
      { text: 'Save More', icon: '%' },
    ],
  });

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch('/api/site-config');
        if (!res.ok) return;
        const data = await res.json();
        if (data?.success && data?.config?.greenStrip) {
          setStripConfig(data.config.greenStrip);
        }
      } catch (e) {}
    }
    loadConfig();
  }, []);

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const showSlide = (index) => {
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;
    setCurrentSlide(index);
  };

  const nextSlide = () => showSlide(currentSlide + 1);
  const previousSlide = () => showSlide(currentSlide - 1);

  return (
    <section
      className="stackdeal-slider relative w-full overflow-hidden select-none"
      style={{
        minHeight: '650px',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 45%, #d9ffe8 100%)',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── GREEN TOP STRIP ── */}
      {stripConfig.enabled !== false && (
        <div
          className={`deal-strip w-[110%] -ml-[5%] ${
            stripConfig.isSlim !== false ? 'h-[32px] sm:h-[36px]' : 'h-[52px] sm:h-[62px]'
          } bg-[#63f477] flex items-center overflow-hidden relative z-20 mt-[12px] sm:mt-[15px] shadow-xs`}
          style={{ transform: 'rotate(-3deg)' }}
        >
          <div className="strip-content flex items-center gap-[32px] sm:gap-[40px] whitespace-nowrap text-[12px] sm:text-[13px] font-bold text-[#111] animate-marquee tracking-wide">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="flex items-center gap-[32px] sm:gap-[40px] shrink-0">
                {(stripConfig.items || []).map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-center gap-[8px] sm:gap-[10px]">
                    <span>{item.text}</span>
                    <span className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] rounded-full bg-[#111] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      {item.icon || '✓'}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SLIDER CONTENT ── */}
      <div className="slider-wrapper max-w-[1250px] mx-auto pt-[35px] sm:pt-[45px] px-[20px] sm:px-[30px] pb-[90px] sm:pb-[100px] relative">
        
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;

          return (
            <div
              key={slide.id}
              className={`slide ${isActive ? 'grid grid-cols-1 lg:grid-cols-2 items-center gap-[30px] lg:gap-[70px] animate-fadeIn' : 'hidden'}`}
            >
              {/* LEFT SIDE */}
              <div className="slide-content pl-0 sm:pl-[10px] text-left">
                
                <span className="inline-block bg-[#111] text-white px-[15px] py-[8px] rounded-[30px] text-[13px] font-bold mb-[20px]">
                  {slide.badge}
                </span>

                <Link href={slide.href} className="block group">
                  <h1 className="text-[34px] sm:text-[48px] leading-[1.08] font-extrabold tracking-[-1.5px] text-[#111] mb-[20px] group-hover:text-slate-800 transition-colors">
                    {slide.title}
                  </h1>
                </Link>

                <p className="text-[17px] sm:text-[19px] leading-[1.55] max-w-[570px] text-[#222] mb-[25px]">
                  {slide.description}
                </p>

                <div className="flex items-center gap-[12px] flex-wrap mb-[25px]">
                  <span className="text-[28px] sm:text-[30px] font-extrabold text-[#111]">
                    ₹{Number(slide.price).toLocaleString('en-IN')}
                  </span>

                  <span className="text-[15px] font-bold text-[#111]">
                    {slide.accessText}
                  </span>

                  <span className="text-[16px] text-[#555] line-through">
                    ₹{Number(slide.originalPrice).toLocaleString('en-IN')}
                  </span>
                </div>

                <Link
                  href={slide.href}
                  className="buy-btn inline-block px-[32px] py-[15px] bg-[#ffb900] hover:bg-[#e6a700] text-[#111] no-underline rounded-[6px] text-[16px] font-extrabold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] cursor-pointer"
                >
                  {slide.buttonText}
                </Link>

              </div>

              {/* RIGHT SOFTWARE IMAGE */}
              <div className="product-preview w-full h-[260px] sm:h-[360px] bg-white/70 rounded-[15px] flex items-center justify-center overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.07)]">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-[92%] h-[90%] object-contain rounded-[10px]"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?q=80&w=1000&auto=format&fit=crop';
                  }}
                />
              </div>

            </div>
          );
        })}

        {/* ── NAVIGATION (Dots & Arrows) ── */}
        <div className="slider-nav absolute bottom-[30px] left-1/2 -translate-x-1/2 flex items-center gap-[9px] z-30">
          
          <button
            onClick={previousSlide}
            className="w-[40px] h-[40px] border border-[#ddd] bg-white hover:bg-[#111] hover:text-white rounded-full cursor-pointer text-[18px] flex items-center justify-center transition-colors shadow-xs"
            aria-label="Previous Slide"
          >
            ←
          </button>

          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => showSlide(i)}
              className={`transition-all duration-200 cursor-pointer border-0 ${
                i === currentSlide
                  ? 'w-[28px] h-[9px] rounded-[20px] bg-[#111]'
                  : 'w-[9px] h-[9px] rounded-full bg-[#aaa] hover:bg-[#777]'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}

          <button
            onClick={nextSlide}
            className="w-[40px] h-[40px] border border-[#ddd] bg-white hover:bg-[#111] hover:text-white rounded-full cursor-pointer text-[18px] flex items-center justify-center transition-colors shadow-xs"
            aria-label="Next Slide"
          >
            →
          </button>

        </div>

      </div>

      <style jsx>{`
        @keyframes scrollStrip {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: scrollStrip 20s linear infinite;
        }
      `}</style>
    </section>
  );
}
