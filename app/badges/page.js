'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import {
  ShieldCheck, Copy, Check, Sparkles, ExternalLink, Code2, Flame,
  Share2, ArrowLeft, ArrowRight, Award, CheckCircle2
} from 'lucide-react';

export default function VendorBadgesPage() {
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const badgeImgUrl = 'https://www.stackdeal.in/badges/featured-on-stackdeal.svg';
  
  const htmlEmbed = `<a href="https://www.stackdeal.in" target="_blank" rel="noopener noreferrer">
  <img src="https://www.stackdeal.in/badges/featured-on-stackdeal.svg" alt="Featured on StackDeal - India's Curated B2B SaaS 5-Year Deal Marketplace" width="180" height="48" />
</a>`;

  const markdownEmbed = `[![Featured on StackDeal](${badgeImgUrl})](https://www.stackdeal.in)`;

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'html') {
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    } else if (type === 'markdown') {
      setCopiedMarkdown(true);
      setTimeout(() => setCopiedMarkdown(false), 2000);
    } else {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 selection:bg-orange-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
        
        {/* TOP HEADER */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-[#FF6B35] text-xs font-black uppercase tracking-wider shadow-xs">
            <Award className="w-3.5 h-3.5" />
            <span>Official Partner Assets</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Official StackDeal Vendor Badges
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Showcase your verified 5-Year Deal on your website or landing page. Embedding the verified StackDeal badge boosts your deal placement and signals trust to 10,000+ Indian digital agencies.
          </p>
        </div>

        {/* LIVE BADGE PREVIEWS (LIGHT & DARK CONTAINER) */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Light Background Preview */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm text-center">
            <div className="text-xs font-black uppercase tracking-wider text-slate-400">
              Preview on Light Background
            </div>
            
            <div className="py-8 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center">
              <a href="https://www.stackdeal.in" target="_blank" rel="noopener noreferrer" className="hover:opacity-90 transition-opacity">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/badges/featured-on-stackdeal.svg"
                  alt="Featured on StackDeal"
                  className="w-48 h-auto shadow-sm rounded-xl"
                />
              </a>
            </div>

            <p className="text-[11px] text-slate-500 font-medium">
              Perfect for your website footer, pricing page, or announcement banner.
            </p>
          </div>

          {/* Dark Background Preview */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm text-center text-white">
            <div className="text-xs font-black uppercase tracking-wider text-slate-400">
              Preview on Dark Background
            </div>
            
            <div className="py-8 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center">
              <a href="https://www.stackdeal.in" target="_blank" rel="noopener noreferrer" className="hover:opacity-90 transition-opacity">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/badges/featured-on-stackdeal.svg"
                  alt="Featured on StackDeal"
                  className="w-48 h-auto shadow-md rounded-xl"
                />
              </a>
            </div>

            <p className="text-[11px] text-slate-400 font-medium">
              SVG vector format automatically scales crisply across all screen resolutions.
            </p>
          </div>

        </div>

        {/* 1-CLICK COPY EMBED CODES */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-[#FF6B35]" />
                <span>1-Click Embed Codes</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Copy and paste either snippet into your website, footer, documentation, or GitHub repo.
              </p>
            </div>
          </div>

          {/* HTML Embed Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>HTML Embed Code (Recommended for Webpages)</span>
              <button
                type="button"
                onClick={() => handleCopy(htmlEmbed, 'html')}
                className="inline-flex items-center gap-1 text-[#FF6B35] hover:text-orange-700 font-black cursor-pointer transition-colors"
              >
                {copiedHtml ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedHtml ? 'Copied to Clipboard!' : 'Copy HTML'}</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-900 text-slate-100 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
              {htmlEmbed}
            </pre>
          </div>

          {/* Markdown Embed Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Markdown Embed Code (For GitHub, Readme, Docs)</span>
              <button
                type="button"
                onClick={() => handleCopy(markdownEmbed, 'markdown')}
                className="inline-flex items-center gap-1 text-[#FF6B35] hover:text-orange-700 font-black cursor-pointer transition-colors"
              >
                {copiedMarkdown ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMarkdown ? 'Copied to Clipboard!' : 'Copy Markdown'}</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-900 text-slate-100 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
              {markdownEmbed}
            </pre>
          </div>

        </div>

        {/* WHY EMBED THE BADGE (BENEFITS FOR CREATORS) */}
        <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-wider text-[#FF6B35]">
              Vendor Partnership Perks
            </span>
            <h3 className="text-xl font-black text-slate-950">
              Why Embed the StackDeal Verified Badge?
            </h3>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            <div className="bg-white/90 border border-orange-200/60 rounded-2xl p-4 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF6B35] flex items-center justify-center font-black">
                <Flame className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-black text-slate-900">Featured Placement</h4>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Tools linking back to StackDeal receive prioritized placement on our homepage trending slider.
              </p>
            </div>

            <div className="bg-white/90 border border-orange-200/60 rounded-2xl p-4 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-black text-slate-900">Verified Trust Shield</h4>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Indian agency owners recognize the StackDeal shield as a guarantee of 18% GST invoicing & 60-day safety.
              </p>
            </div>

            <div className="bg-white/90 border border-orange-200/60 rounded-2xl p-4 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-black text-slate-900">Mutual SEO Authority</h4>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Both your domain and StackDeal benefit from legitimate, high-relevance B2B SaaS cross-linking.
              </p>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
