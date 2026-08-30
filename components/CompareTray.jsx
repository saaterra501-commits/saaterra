'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, X, Scale, Sparkles } from 'lucide-react';

export default function CompareTray() {
  const [selectedDeals, setSelectedDeals] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load from localStorage on mount
    function loadCompare() {
      try {
        const saved = JSON.parse(localStorage.getItem('stackdeal_compare_items') || '[]');
        setSelectedDeals(saved);
      } catch (e) {
        console.error('Error loading compare items:', e);
      }
    }

    loadCompare();

    // Listen to custom compare update events
    const handleStorageChange = () => loadCompare();
    window.addEventListener('stackdeal_compare_updated', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('stackdeal_compare_updated', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleRemove = (slug) => {
    const updated = selectedDeals.filter((d) => d.slug !== slug);
    setSelectedDeals(updated);
    localStorage.setItem('stackdeal_compare_items', JSON.stringify(updated));
    window.dispatchEvent(new Event('stackdeal_compare_updated'));
  };

  const handleClear = () => {
    setSelectedDeals([]);
    localStorage.removeItem('stackdeal_compare_items');
    window.dispatchEvent(new Event('stackdeal_compare_updated'));
  };

  if (selectedDeals.length === 0) return null;

  const compareUrl = `/compare?tools=${selectedDeals.map((d) => d.slug).join(',')}`;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4 animate-slideUp">
      <div className="bg-slate-950/95 backdrop-blur-md text-white border-2 border-slate-800 rounded-2xl shadow-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left: Info & Badges */}
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-[#FFD519] flex items-center justify-center text-slate-950 shadow-xs">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black">Compare Software</div>
              <div className="text-[10px] text-[#FFD519] font-bold">
                {selectedDeals.length}/4 selected
              </div>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden sm:block" />

          {/* Selected Item Pills */}
          <div className="flex items-center gap-2">
            {selectedDeals.map((item) => (
              <div
                key={item.slug}
                className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1 text-xs font-bold shrink-0"
              >
                <div className="w-5 h-5 rounded-md bg-white/10 p-0.5 shrink-0 overflow-hidden flex items-center justify-center">
                  <img
                    src={item.vendorLogo || 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png'}
                    alt={item.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="truncate max-w-[100px] text-slate-200">{item.title || item.vendorName}</span>
                <button
                  onClick={() => handleRemove(item.slug)}
                  className="hover:text-red-400 p-0.5 cursor-pointer transition-colors"
                  title="Remove from compare"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
          <button
            onClick={handleClear}
            className="px-3 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Clear
          </button>

          <Link
            href={compareUrl}
            className="px-5 py-2.5 bg-[#FFD519] hover:bg-[#E6C016] text-slate-950 text-xs font-black rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap border border-[#E6C016]"
          >
            <span>Compare Now ({selectedDeals.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
