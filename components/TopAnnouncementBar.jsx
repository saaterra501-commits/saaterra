'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, X } from 'lucide-react';

export default function TopAnnouncementBar() {
  const [announcement, setAnnouncement] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    async function loadBar() {
      try {
        const res = await fetch('/api/site-config');
        if (!res.ok) return;
        const data = await res.json();
        if (data?.success && data?.config?.announcement?.enabled) {
          setAnnouncement(data.config.announcement);
        }
      } catch (e) {}
    }
    loadBar();
  }, []);

  if (!announcement || !announcement.enabled || dismissed) {
    return null;
  }

  return (
    <div
      className="relative z-40 px-4 py-2 text-xs font-bold transition-all shadow-xs"
      style={{
        backgroundColor: announcement.bgColor || '#0F172A',
        color: announcement.textColor || '#FFFFFF',
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2.5 text-center flex-wrap pr-6">
        {announcement.badge && (
          <span className="bg-[#FFB900] text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
            {announcement.badge}
          </span>
        )}

        <span>{announcement.text}</span>

        {announcement.link && (
          <Link
            href={announcement.link}
            className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-[#FFB900] transition-colors"
          >
            <span>Learn more</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity p-1 cursor-pointer"
        aria-label="Close Announcement"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
