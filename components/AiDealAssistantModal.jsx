'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles, X, Send, Bot, User, ArrowRight, ShieldCheck,
  CheckCircle2, Flame, RefreshCw, Zap, Lightbulb, ExternalLink
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
  '💬 WhatsApp automation & cart recovery',
  '🔍 AI SEO tool to rank on ChatGPT & Gemini',
  '🎯 B2B LinkedIn lead scraper for agency',
  '💰 Best software stack under ₹5,000',
  '🛍️ E-commerce marketing & payments tool',
];

export default function AiDealAssistantModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `👋 **Hi! I'm StackDeal AI Copilot.**\n\nTell me what business you run or what software bottleneck you want to solve, and I'll find you the highest-ROI **5-Year Access Passes** to save you thousands in recurring bills!`,
      deals: [],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (queryText) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || loading) return;

    setInput('');
    const newMessages = [...messages, { role: 'user', text: textToSend }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSend }),
      });

      const data = await res.json();

      if (data?.success) {
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            text: data.reply,
            deals: data.matchedDeals || [],
          },
        ]);
      } else {
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            text: data.error || 'Sorry, I could not process your query. Please try again.',
            deals: [],
          },
        ]);
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          text: 'Network error. Please check your connection and try again.',
          deals: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeIn flex items-center justify-center p-3 sm:p-6 font-sans">
      <div className="bg-[#070B16] border border-white/15 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh] sm:h-[80vh] relative">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#0D1527] border-b border-white/10 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B35] to-[#2475FF] p-0.5 shadow-lg">
              <div className="w-full h-full bg-[#070B16] rounded-2xl flex items-center justify-center text-[#FFD519]">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white">StackDeal AI Deal Matchmaker</h3>
                <span className="bg-[#FF6B35]/20 text-[#FF8243] border border-[#FF6B35]/40 text-[9px] font-black px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                  ⚡ Powered by Groq AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                AI software recommendations tailored to your agency niche & budget
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2.5 bg-white/5 border-b border-white/10 flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-[#FFD519]" /> Ask:
          </span>
          {SUGGESTED_PROMPTS.map((prompt, pIdx) => (
            <button
              key={pIdx}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1 bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-bold rounded-full transition-all border border-white/10 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat History Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, mIdx) => (
            <div
              key={mIdx}
              className={`flex gap-3 items-start animate-fadeIn ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF6B35] to-[#2475FF] p-0.5 shrink-0 mt-0.5">
                  <div className="w-full h-full bg-[#070B16] rounded-xl flex items-center justify-center text-[#FFD519]">
                    <Bot className="w-4 h-4" />
                  </div>
                </div>
              )}

              <div
                className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-3 ${
                  msg.role === 'user'
                    ? 'bg-[#FF6B35] text-white font-bold rounded-tr-xs shadow-md'
                    : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-xs shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Render Embedded Interactive Deal Cards */}
                {msg.deals && msg.deals.length > 0 && (
                  <div className="pt-3 border-t border-white/10 space-y-3">
                    <span className="text-[10px] font-black text-[#FFD519] uppercase tracking-wider block">
                      ⚡ Recommended 5-Year Passes:
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {msg.deals.map((d) => {
                        const price = d.tier1Price || 1999;
                        const original = d.originalPrice || price * 10;
                        const discount = Math.round(((original - price) / original) * 100);

                        return (
                          <div
                            key={d.slug}
                            className="bg-[#070B16] border border-white/15 rounded-2xl p-3.5 space-y-2.5 flex flex-col justify-between hover:border-[#FF6B35] transition-all shadow-md group"
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black text-[#38BDF8] bg-blue-500/20 px-2 py-0.5 rounded uppercase">
                                  {d.category || 'SaaS Pass'}
                                </span>
                                <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                                  Save {discount}%
                                </span>
                              </div>

                              <h4 className="font-black text-white text-xs line-clamp-1 group-hover:text-[#FF6B35] transition-colors">
                                {d.title}
                              </h4>
                              <p className="text-[11px] text-slate-400 font-medium line-clamp-2">
                                {d.tagline}
                              </p>
                            </div>

                            <div className="space-y-2 pt-2 border-t border-white/10">
                              <div className="flex items-baseline justify-between">
                                <div>
                                  <span className="text-sm font-black text-white">₹{price.toLocaleString('en-IN')}</span>
                                  <span className="text-[10px] text-slate-500 line-through ml-1.5 font-bold">₹{original.toLocaleString('en-IN')}</span>
                                </div>
                                <span className="text-[9px] text-amber-400 font-bold">5-Year Pass</span>
                              </div>

                              <Link
                                href={`/deals/${d.slug}`}
                                onClick={onClose}
                                className="w-full py-2 bg-[#FF6B35] hover:bg-[#E85A24] text-white text-[11px] font-black rounded-xl transition-all shadow flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <span>Get 5-Year Pass</span>
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 animate-fadeIn">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF6B35] to-[#2475FF] p-0.5 shrink-0">
                <div className="w-full h-full bg-[#070B16] rounded-xl flex items-center justify-center text-[#FFD519]">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-slate-300 font-bold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FF6B35] animate-ping" />
                <span>AI analyzing 50+ SaaS catalogues & pricing passes...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 sm:p-4 bg-[#0D1527] border-t border-white/10 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            placeholder="Ask AI: e.g. I run a 5-member digital marketing agency, recommend tools for WhatsApp & client leads..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 bg-white/5 border border-white/15 text-white text-xs font-bold p-3 sm:p-3.5 rounded-2xl focus:bg-white/10 focus:outline-none focus:border-[#FF6B35] transition-all disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-5 py-3 sm:py-3.5 bg-[#FF6B35] hover:bg-[#E85A24] disabled:opacity-50 text-white font-black text-xs rounded-2xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Ask AI</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
