'use client';

import Link from 'next/link';
import {
  Heart, ArrowRight, Mail
} from 'lucide-react';

import StackDealLogo from './StackDealLogo';

const FOOTER_LINKS = {
  Marketplace: [
    { label: 'All Deals', href: '/deals' },
    { label: 'New Arrivals 🔥', href: '/deals' },
    { label: 'Ending Soon', href: '/deals' },
    { label: 'WhatsApp Tools', href: '/deals?cat=whatsapp' },
    { label: 'AI & GEO SEO', href: '/deals?cat=ai-tools' },
    { label: 'Lead Scraping', href: '/deals?cat=lead-gen' },
  ],
  Founders: [
    { label: 'List Your SaaS Tool', href: '/submit' },
    { label: '70% Revenue Share', href: '/submit' },
    { label: '5-Year Pass Economics', href: '/submit' },
    { label: 'Partner Dashboard', href: '/submit' },
  ],
  Members: [
    { label: 'StackDeal Plus ⭐', href: '/plus' },
    { label: 'Redeem License Code', href: '/redeem' },
    { label: 'My Passes Dashboard', href: '/profile' },
    { label: 'Radar (Coming Soon)', href: '/deals' },
  ],
  Support: [
    { label: 'About StackDeal 🏢', href: '/about' },
    { label: 'Contact & Support Desk 💬', href: '/contact' },
    { label: 'Email Us (hello@stackdeal.in)', href: 'mailto:hello@stackdeal.in' },
    { label: '60-Day Refund Policy', href: '/contact' },
    { label: 'GST Invoice Support', href: '/contact' },
    { label: 'Privacy Policy', href: '/contact' },
    { label: 'Terms of Service', href: '/contact' },
  ],
};

const SOCIAL_ICONS = [
  { emoji: '𝕏', label: 'Twitter / X', href: 'https://twitter.com/stackdeal_in' },
  { emoji: 'in', label: 'LinkedIn', href: 'https://linkedin.com/company/stackdeal' },
  { emoji: '📧', label: 'Email', href: 'mailto:hello@stackdeal.in' },
];

export default function Footer() {
  return (
    <footer className="bg-[#0A0F1E] text-white border-t border-white/5 mt-16">

      {/* ── Newsletter Bar ── */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <h3 className="text-lg font-black text-white">Get notified on new deals 🚀</h3>
              <p className="text-sm text-slate-400 font-medium mt-0.5">
                Weekly digest of the best B2B SaaS deals for Indian agencies.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full bg-white/5 border border-white/10 text-white text-sm font-medium pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-[#2475FF] placeholder:text-slate-500 transition-colors"
                  suppressHydrationWarning
                />
              </div>
              <button className="btn-primary px-5 py-2.5 text-sm rounded-xl whitespace-nowrap shrink-0" suppressHydrationWarning>
                Subscribe
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">

          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            {/* StackDeal Logo Component */}
            <div className="flex items-center gap-2">
              <StackDealLogo className="h-8" />
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              India's premier B2B software discovery marketplace. 5-Year Access Passes for digital agencies & solopreneurs.
            </p>

            {/* Direct Email Contact Badge */}
            <div className="pt-0.5">
              <a
                href="mailto:hello@stackdeal.in"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-amber-300 hover:text-amber-200 text-xs font-bold transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>hello@stackdeal.in</span>
              </a>
            </div>

            {/* Social Icons & Product Hunt Embed */}
            <div className="flex items-center gap-2 pt-1">
              {SOCIAL_ICONS.map((s) => (
                <a
                  key={s.label}
                  href={s.href || 'mailto:hello@stackdeal.in'}
                  aria-label={s.label}
                  title={s.label}
                  target={s.href?.startsWith('http') ? '_blank' : '_self'}
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-[#2475FF] hover:border-[#2475FF] flex items-center justify-center transition-all text-xs font-black"
                  suppressHydrationWarning
                >
                  {s.emoji}
                </a>
              ))}
            </div>

            {/* Official Product Hunt Launch Badge */}
            <div className="pt-2">
              <a
                href="https://www.producthunt.com/products/stackdeal"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition-transform hover:scale-105"
                title="Support StackDeal on Product Hunt"
              >
                <img
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=stackdeal&theme=dark"
                  alt="StackDeal - Curated 5-Year SaaS Passes on Product Hunt"
                  style={{ width: '210px', height: '45px' }}
                  width="210"
                  height="45"
                />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h5 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4">
                {section}
              </h5>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-slate-400 font-medium hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Formal Legal & Beta Demonstration Notice ── */}
      <div className="border-t border-white/[0.06] bg-black/40 py-5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-[10px] text-slate-400/80 leading-relaxed space-y-1">
          <p className="font-bold text-slate-300">
            ⚖️ Legal Safe Harbor & Beta Testing Notice:
          </p>
          <p>
            StackDeal.in is an independent software discovery platform operating in public preview & testing mode. All brand names, software titles, logos, product marks, and trademarks referenced on this platform are the sole intellectual property of their respective trademark holders. The display of these software tools is solely for user-interface mock demonstration, sandbox testing, and software discovery workflow preview. StackDeal makes no claim of endorsement, formal partnership, or direct sponsorship with any unlisted third-party SaaS vendors during this beta evaluation period. For legal queries, trademark inquiries, or listing requests, contact <a href="mailto:hello@stackdeal.in" className="text-amber-400 font-mono underline hover:text-amber-300">hello@stackdeal.in</a>.
          </p>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 font-medium">
          <p>© 2026 StackDeal Marketplace India. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Built with{' '}
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />{' '}
            for Indian Founders & Agencies
          </p>
        </div>
      </div>

    </footer>
  );
}
