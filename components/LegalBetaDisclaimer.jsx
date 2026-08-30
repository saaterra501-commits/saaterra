'use client';

import { useState, useEffect } from 'react';
import { Scale, Info, X, ShieldAlert } from 'lucide-react';

export default function LegalBetaDisclaimer() {
  const [visible, setVisible] = useState(true);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    try {
      const isDismissed = localStorage.getItem('sd_legal_disclaimer_minimized');
      if (isDismissed === 'true') {
        setMinimized(true);
      }
    } catch (e) {}
  }, []);

  const handleMinimize = () => {
    setMinimized(true);
    try {
      localStorage.setItem('sd_legal_disclaimer_minimized', 'true');
    } catch (e) {}
  };

  const handleExpand = () => {
    setMinimized(false);
    try {
      localStorage.setItem('sd_legal_disclaimer_minimized', 'false');
    } catch (e) {}
  };

  if (!visible) return null;

  if (minimized) {
    return (
      <div className="fixed bottom-4 left-4 z-40 animate-fadeIn">
        <button
          onClick={handleExpand}
          className="flex items-center gap-2 bg-slate-900/95 hover:bg-slate-950 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-full text-[11px] font-bold shadow-xl backdrop-blur-md transition-all cursor-pointer"
        >
          <Scale className="w-3.5 h-3.5 text-amber-400" />
          <span>Beta Demo & Legal Notice</span>
        </button>
      </div>
    );
  }

  return (
    <aside aria-label="Legal Beta Preview Notice" className="bg-amber-950/90 text-amber-100 border-b border-amber-500/30 px-4 py-2 font-sans text-xs relative z-40 backdrop-blur-xs">
      <div className="max-w-7xl mx-auto flex items-start sm:items-center justify-between gap-3">
        
        <div className="flex items-start sm:items-center gap-2.5 flex-1 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 text-amber-400">
            <Scale className="w-3.5 h-3.5" />
          </div>

          <div className="text-[11px] sm:text-xs leading-relaxed text-amber-200/90">
            <span className="font-black text-amber-300 uppercase tracking-wider mr-1.5">
              ⚖️ Beta Preview & Legal Notice:
            </span>
            <span>
              StackDeal is currently operating in <strong>public beta demonstration & platform testing mode</strong>. All software listings, trademarks, product names, logos, and features displayed on this portal are the intellectual property of their respective copyright holders and are utilized strictly for user-interface mock demonstration and sandbox evaluation purposes. No official partnership or commercial endorsement is claimed during this testing period.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleMinimize}
            className="text-[10px] font-bold bg-amber-900/60 hover:bg-amber-800/80 text-amber-200 px-2.5 py-1 rounded-lg border border-amber-700/50 transition-colors cursor-pointer"
          >
            Acknowledge
          </button>
          <button
            onClick={handleMinimize}
            className="text-amber-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
            title="Minimize"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </aside>
  );
}
