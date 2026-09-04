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
    { label: 'Vendor Partner Badges', href: '/badges' },
    { label: 'AppSumo Alternative India', href: '/appsumo-alternative-india' },
    { label: '70% Revenue Share', href: '/submit' },
  ],
  Members: [
    { label: 'Join VIP WhatsApp Club 💬', href: 'https://chat.whatsapp.com/GmWT9MGU8LX2PFGEtl1Z7f' },
    { label: 'StackDeal Plus ⭐', href: '/plus' },
    { label: 'Redeem License Code', href: '/redeem' },
    { label: 'My Passes Dashboard', href: '/profile' },
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
  {
    label: 'WhatsApp VIP Community',
    href: 'https://chat.whatsapp.com/GmWT9MGU8LX2PFGEtl1Z7f',
    icon: (
      <svg className="w-3.5 h-3.5 fill-current text-emerald-400" viewBox="0 0 24 24">
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.761.815 2.796.815 3.18 0 5.766-2.587 5.767-5.766.001-3.181-2.585-5.768-5.767-5.768zm3.397 8.21c-.141.396-.714.726-1.074.77-.361.045-.826.068-2.673-.699-2.223-.924-3.642-3.182-3.753-3.329-.111-.148-.908-1.209-.908-2.306 0-1.097.575-1.637.778-1.859.203-.223.443-.278.591-.278.148 0 .296.002.425.008.136.006.319-.052.499.38.188.452.641 1.564.697 1.677.056.113.093.245.018.394-.075.148-.112.241-.223.371-.111.13-.233.29-.333.39-.111.111-.227.232-.098.454.129.222.574.947 1.233 1.535.849.758 1.565.993 1.787 1.104.222.111.352.093.481-.056.129-.148.556-.649.704-.871.148-.222.296-.185.499-.111.204.074 1.296.611 1.518.722.222.111.37.167.425.26.056.093.056.538-.085.934zM12 2C6.477 2 2 6.477 2 12c0 1.891.526 3.662 1.438 5.178L2 22l4.98-1.306C8.423 21.492 10.153 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
      </svg>
    ),
  },
  {
    label: 'X (Twitter)',
    href: 'https://x.com/stackdealIN',
    icon: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/stack-deal-/',
    icon: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64c-.95 0-1.72.78-1.72 1.73a1.73 1.73 0 0 0 1.72 1.73 1.73 1.73 0 0 0 1.73-1.73c0-.95-.78-1.73-1.73-1.73" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/stackdeal.in/',
    icon: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    href: 'mailto:hello@stackdeal.in',
    icon: <Mail className="w-3.5 h-3.5" />,
  },
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
            {/* StackDeal Logo Component (Dark Background Variant) */}
            <div className="flex items-center gap-2">
              <Link href="/" className="inline-block transition-opacity hover:opacity-90">
                <img
                  src="/stackdeal-footer-logo.png"
                  alt="StackDeal"
                  width={150}
                  height={45}
                  className="h-9 w-auto object-contain"
                />
              </Link>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              India's premier B2B software discovery marketplace. 5-Year Access Passes for digital agencies & solopreneurs.
            </p>

            {/* Direct Email Contact Badge */}
            <div className="pt-0.5 flex flex-col gap-2">
              <a
                href="mailto:hello@stackdeal.in"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-amber-300 hover:text-amber-200 text-xs font-bold transition-colors w-fit"
              >
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>hello@stackdeal.in</span>
              </a>

              {/* Direct VIP WhatsApp Community CTA */}
              <a
                href="https://chat.whatsapp.com/GmWT9MGU8LX2PFGEtl1Z7f"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 text-xs font-bold transition-all shadow-xs group w-fit"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span>Join VIP WhatsApp Club</span>
                <span className="text-xs group-hover:translate-x-0.5 transition-transform">➔</span>
              </a>
            </div>

            {/* Social Icons & Product Hunt Embed */}
            <div className="flex items-center gap-2.5 pt-1">
              {SOCIAL_ICONS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  title={s.label}
                  target={s.href?.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-[#FF6B35] hover:border-[#FF6B35] flex items-center justify-center transition-all cursor-pointer shadow-xs"
                  suppressHydrationWarning
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Official Product Hunt Launch Badge (Light/Red Theme) */}
            <div className="pt-2">
              <a
                href="https://www.producthunt.com/products/stackdeal-2?launch=stackdeal-2"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition-transform hover:scale-105"
                title="Support StackDeal on Product Hunt"
              >
                <img
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=stackdeal-2&theme=light"
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
                    {link.href?.startsWith('http') ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-400 font-medium hover:text-emerald-400 transition-colors flex items-center gap-1"
                      >
                        <span>{link.label}</span>
                        <span className="text-[10px] text-emerald-400">↗</span>
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-xs text-slate-400 font-medium hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
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
