'use client';

export default function TacoRating({ rating = 5, reviewsCount = 0, size = 'sm' }) {
  const iconSize = size === 'lg' ? 'text-lg' : 'text-xs';
  
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`${iconSize} ${i <= Math.round(rating) ? 'opacity-100 scale-100' : 'opacity-30 grayscale'} transition-all`}
            title={`${rating} Tacos`}
          >
            🌮
          </span>
        ))}
      </div>
      <span className="font-extrabold text-slate-900 text-xs ml-0.5">{rating}</span>
      {reviewsCount > 0 && (
        <span className="text-slate-400 font-medium text-xs">({reviewsCount})</span>
      )}
    </div>
  );
}
