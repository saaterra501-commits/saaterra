'use client';

import { useState } from 'react';
import { MessageSquare, ThumbsUp, Check, Trash2, Send, Star } from 'lucide-react';

const INITIAL_FAQS = [
  { id: 1, deal: 'Chat Chacha', askedBy: 'Rahul S.', question: 'Do I need WhatsApp Business API approval for Chat Chacha?', answer: 'Correct! You can start in 2 minutes via QR code scan without waiting for API approval. — Founder', status: 'Answered' },
  { id: 2, deal: 'Nuwatomic GEO SEO', askedBy: 'Sneha R.', question: 'Does Nuwatomic support ranking reports for Perplexity AI?', answer: '', status: 'Unanswered' },
];

export default function AdminQAPage() {
  const [faqs, setFaqs] = useState(INITIAL_FAQS);
  const [replyText, setReplyText] = useState({});

  const handleReplySubmit = (id) => {
    setFaqs(faqs.map((f) => (f.id === id ? { ...f, answer: replyText[id], status: 'Answered' } : f)));
  };

  const deleteQuestion = (id) => {
    setFaqs(faqs.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-6 font-sans">
      
      <div className="flex items-center justify-between bg-white/5 border border-white/10 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-black text-white">Community Q&A & Reviews Moderation</h2>
          <p className="text-xs text-slate-400 font-medium">Answer buyer questions directly as Verified Founder/Admin and moderate deal reviews.</p>
        </div>
      </div>

      <div className="bg-[#070B16] border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-black text-white">Buyer Questions ({faqs.length})</h3>

        <div className="space-y-4">
          {faqs.map((f) => (
            <div key={f.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-[#2475FF] bg-blue-500/20 px-2 py-0.5 rounded uppercase">{f.deal}</span>
                    <span className="text-xs font-bold text-slate-400">Asked by: {f.askedBy}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{f.question}</h4>
                </div>

                <button
                  onClick={() => deleteQuestion(f.id)}
                  className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {f.status === 'Answered' ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl text-xs text-emerald-300 font-medium">
                  <span className="font-black text-emerald-400 flex items-center gap-1 mb-1">
                    <Check className="w-3.5 h-3.5" /> Verified Admin/Founder Answer:
                  </span>
                  <p>{f.answer}</p>
                </div>
              ) : (
                <div className="space-y-2 pt-2">
                  <textarea
                    rows={2}
                    placeholder="Type official founder answer..."
                    value={replyText[f.id] || ''}
                    onChange={(e) => setReplyText({ ...replyText, [f.id]: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 text-white text-xs font-medium p-3 rounded-xl focus:outline-none focus:border-[#2475FF]"
                  />
                  <button
                    onClick={() => handleReplySubmit(f.id)}
                    className="px-4 py-2 bg-[#2475FF] hover:bg-blue-600 text-xs font-black text-white rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> Post Verified Answer
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
