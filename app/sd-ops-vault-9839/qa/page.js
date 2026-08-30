'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, Check, Trash2, Send, Star, RefreshCw } from 'lucide-react';

export default function AdminQAPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQA = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/overview');
      const data = await res.json();
      if (data?.success && Array.isArray(data.reviews)) {
        setReviews(data.reviews);
      }
    } catch (e) {
      console.error('Failed to load Q&A:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQA();
  }, []);

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between bg-white/5 border border-white/10 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#2475FF]" /> Community Reviews & Q&A Moderation
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Moderate verified buyer reviews and answer customer questions across all SaaS software listings.
          </p>
        </div>

        <button
          onClick={fetchQA}
          className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl border border-white/10 transition-colors cursor-pointer"
          title="Refresh Reviews"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="bg-[#070B16] border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-black text-white">Buyer Reviews & Questions ({reviews.length})</h3>

        {loading ? (
          <div className="py-16 text-center text-slate-500 text-xs animate-pulse">
            Checking community questions & reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-12 text-center space-y-3 bg-white/[0.02] border border-white/5 rounded-2xl">
            <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">No reviews or questions submitted yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              When verified buyers post reviews or leave public questions on deal pages, they will appear here for admin moderation.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r._id} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-[#2475FF] bg-blue-500/20 px-2 py-0.5 rounded uppercase">
                        {r.dealSlug || 'Deal'}
                      </span>
                      <span className="text-xs font-bold text-slate-400">By: {r.userName || r.userEmail}</span>
                    </div>
                    <div className="text-xs text-amber-400 flex items-center gap-1">
                      {[...Array(r.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-white mt-1">{r.comment || r.review}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
