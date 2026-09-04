'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles, X, Send, Bot, User, ArrowRight, ShieldCheck,
  CheckCircle2, Flame, RefreshCw, Zap, Lightbulb, ExternalLink,
  Maximize2, Minimize2, RotateCcw, Paperclip, HelpCircle, MessageSquare
} from 'lucide-react';

const SUGGESTIONS = [
  'What are your services?',
  'Contact support',
  'What is StackDeal?',
  'How do 5-Year Passes work?',
  'What is your refund policy?',
  'Can I get an 18% GST invoice?',
  'Recommend best WhatsApp tools',
  'Best deals under ₹3,000',
];

const INITIAL_MESSAGES = [
  {
    role: 'assistant',
    text: "Hello! I'm your Stacky assistant. How can I help?",
    deals: [],
    showSuggestions: true,
  },
];

export default function AiDealAssistantModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
    setInput('');
  };

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
            showSuggestions: false,
          },
        ]);
      } else {
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            text: data.error || 'Sorry, I could not process your query. Please try again.',
            deals: [],
            showSuggestions: false,
          },
        ]);
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          text: 'Network error. Please check your connection and try again or email us at support@stackdeal.in.',
          deals: [],
          showSuggestions: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={
        isExpanded
          ? 'fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeIn flex items-center justify-center p-3 sm:p-6 font-sans'
          : 'fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-[94vw] sm:w-[420px] h-[600px] max-h-[88vh] font-sans animate-fadeIn'
      }
    >
      <div
        className={`bg-[#0F1117] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative w-full h-full ${
          isExpanded ? 'max-w-4xl h-[88vh]' : ''
        }`}
      >
        {/* ── 1. Orange Header ("Stacky") ── */}
        <div className="p-3.5 sm:p-4 bg-[#FF6B35] text-white flex items-center justify-between gap-3 shrink-0 shadow-md">
          <div className="flex items-center gap-2.5">
            {/* Official StackDeal Logo Icon */}
            <div className="w-8 h-8 rounded-full bg-white/20 p-1 flex items-center justify-center shadow-sm shrink-0">
              <img
                src="/stackdeal-icon.png"
                alt="StackDeal"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white tracking-wide">Stacky</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" title="Online" />
              </div>
              <p className="text-[10px] text-white/85 font-medium">StackDeal AI & FAQ Copilot</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Expand / Minimize Toggle */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? 'Dock to bottom-right' : 'Expand full-screen'}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* New Chat / Reset */}
            <button
              type="button"
              onClick={handleResetChat}
              title="Reset conversation"
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Close Modal */}
            <button
              type="button"
              onClick={onClose}
              title="Close chat"
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── 2. Chat Messages Area ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#0F1117]">
          {messages.map((msg, mIdx) => (
            <div key={mIdx} className="space-y-3">
              <div
                className={`flex gap-2.5 items-start animate-fadeIn ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-white/10 p-1 shrink-0 mt-0.5 flex items-center justify-center border border-white/10 shadow-sm">
                    <img
                      src="/stackdeal-icon.png"
                      alt="Stacky"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                <div
                  className={`max-w-[88%] sm:max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#FF6B35] text-white font-bold rounded-tr-xs shadow-md ml-auto'
                      : 'bg-[#2B1B17] border border-white/5 text-slate-100 rounded-tl-xs shadow-sm space-y-3'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {/* Render Embedded Interactive Deal Cards if matched */}
                  {msg.deals && msg.deals.length > 0 && (
                    <div className="pt-3 border-t border-white/10 space-y-2.5">
                      <span className="text-[10px] font-black text-[#FFD519] uppercase tracking-wider block">
                        ⚡ Recommended 5-Year Passes:
                      </span>

                      <div className="grid grid-cols-1 gap-2.5">
                        {msg.deals.slice(0, 2).map((d) => {
                          const price = d.tier1Price || 1999;
                          const original = d.originalPrice || price * 10;
                          const discount = Math.round(((original - price) / original) * 100);

                          return (
                            <div
                              key={d.slug}
                              className="bg-[#12141D] border border-white/10 rounded-xl p-3 space-y-2 hover:border-[#FF6B35] transition-all shadow-md group"
                            >
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

                              <div className="flex items-center justify-between pt-1 border-t border-white/5">
                                <div>
                                  <span className="text-xs font-black text-white">₹{price.toLocaleString('en-IN')}</span>
                                  <span className="text-[9px] text-slate-500 line-through ml-1 font-bold">₹{original.toLocaleString('en-IN')}</span>
                                </div>

                                <Link
                                  href={`/deals/${d.slug}`}
                                  onClick={onClose}
                                  className="px-3 py-1 bg-[#FF6B35] hover:bg-[#E85A24] text-white text-[10px] font-black rounded-lg transition-all shadow flex items-center gap-1 cursor-pointer"
                                >
                                  <span>View Deal</span>
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
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              {/* Suggestions Pill Row (shown under initial greeting or on demand) */}
              {msg.showSuggestions && (
                <div className="pl-9 space-y-2 animate-fadeIn">
                  <p className="text-[11px] text-slate-400 font-medium">
                    Here are some suggestions, or ask me anything!
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTIONS.map((sugg, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => handleSend(sugg)}
                        className="px-3 py-1.5 bg-[#1B1D26] hover:bg-[#252836] text-slate-200 hover:text-white text-[11px] font-semibold rounded-xl border border-white/10 hover:border-[#FF6B35]/60 transition-all cursor-pointer shadow-xs text-left"
                      >
                        {sugg}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2.5 animate-fadeIn">
              <div className="w-8 h-8 rounded-full bg-white/10 p-1 shrink-0 flex items-center justify-center border border-white/10 shadow-sm">
                <img
                  src="/stackdeal-icon.png"
                  alt="Stacky"
                  className="w-full h-full object-contain animate-pulse"
                />
              </div>
              <div className="bg-[#2B1B17] border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-slate-300 font-bold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FF6B35] animate-ping" />
                <span>Stacky is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── 3. Bottom Input Box (Matches Screenshot) ── */}
        <div className="p-3 sm:p-3.5 bg-[#0A0C12] border-t border-white/10 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative bg-[#161922] border border-[#FF6B35]/70 focus-within:border-[#FF6B35] focus-within:ring-1 focus-within:ring-[#FF6B35]/50 rounded-2xl p-2 sm:p-2.5 transition-all shadow-md"
          >
            <textarea
              rows={2}
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={loading}
              className="w-full bg-transparent text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none resize-none px-2 py-0.5"
            />

            <div className="flex items-center justify-between pt-1 border-t border-white/5 px-1">
              <button
                type="button"
                onClick={() => handleSend('What are your services?')}
                title="Quick Ask: What are your services?"
                className="text-slate-400 hover:text-[#FF6B35] transition-colors p-1 cursor-pointer"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
                  Press Enter ↵
                </span>
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="w-7 h-7 rounded-full bg-[#FF6B35] hover:bg-[#E85A24] disabled:opacity-30 text-white flex items-center justify-center transition-all shadow-md cursor-pointer shrink-0"
                >
                  {loading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5 ml-0.5" />
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
