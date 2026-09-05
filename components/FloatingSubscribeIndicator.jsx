'use client';

import { useState, useEffect } from 'react';
import { ArrowDown, Flame, Sparkles, X, Bell } from 'lucide-react';

export default function FloatingSubscribeIndicator() {
  const [isVisible, setIsVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const [isNearTarget, setIsNearTarget] = useState(false);

  useEffect(() => {
    // Hide when the upcoming deals section is in view
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsNearTarget(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    const target = document.getElementById('upcoming-deals');
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, []);

  if (dismissed || isNearTarget) return null;

  const scrollToSubscribe = () => {
    const el = document.getElementById('upcoming-deals');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      // Temporary highlight pulse on the upcoming section
      el.classList.add('ring-4', 'ring-[#FF6B35]/50', 'transition-all', 'duration-500');
      setTimeout(() => {
        el.classList.remove('ring-4', 'ring-[#FF6B35]/50');
      }, 2000);

      // Focus the email input if available
      setTimeout(() => {
        const input = el.querySelector('input[type="email"]');
        if (input) input.focus();
      }, 700);
    }
  };

  return (
    <aside
      aria-label="Subscribe to Upcoming Software Drops"
      className="fixed bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5 duration-300 select-none"
    >
      {/* Clickable Floating Indicator Pill */}
      <button
        type="button"
        onClick={scrollToSubscribe}
        className="group flex items-center gap-3 bg-slate-950/95 hover:bg-slate-900 backdrop-blur-md text-white border-2 border-[#FF6B35]/70 hover:border-[#FF6B35] rounded-full p-2 pl-3.5 pr-2.5 shadow-[0_8px_30px_rgba(255,107,53,0.35)] hover:shadow-[0_12px_40px_rgba(255,107,53,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
        title="Scroll down to subscribe for 25+ upcoming 5-Year software passes"
      >
        {/* Pulsing Beacon Icon */}
        <div className="relative flex items-center justify-center">
          <span className="absolute w-6 h-6 rounded-full bg-[#FF6B35]/40 animate-ping" />
          <div className="w-6 h-6 rounded-full bg-[#FF6B35] flex items-center justify-center text-white shadow-xs">
            <Flame className="w-3.5 h-3.5 fill-white" />
          </div>
        </div>

        {/* Text Details */}
        <div className="text-left leading-tight pr-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider">
              25+ Drops Soon
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-xs font-black text-white group-hover:text-amber-200 transition-colors">
            Subscribe for VIP Pass
          </div>
        </div>

        {/* Continuously Bouncing Downward Arrow */}
        <div className="w-7 h-7 rounded-full bg-white/10 group-hover:bg-[#FF6B35] flex items-center justify-center text-white transition-colors shrink-0">
          <ArrowDown className="w-4 h-4 animate-bounce stroke-[2.5]" />
        </div>
      </button>

      {/* Dismiss Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setDismissed(true);
        }}
        className="w-6 h-6 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
        aria-label="Dismiss subscription indicator"
        title="Dismiss"
      >
        <X className="w-3 h-3" />
      </button>
    </aside>
  );
}
