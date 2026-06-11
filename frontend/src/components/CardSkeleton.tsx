import React from 'react';

export default function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 animate-pulse">
          <div className="aspect-video bg-slate-200 rounded-lg mb-4" />
          <div className="w-3/4 h-5 bg-slate-200 rounded mb-3" />
          <div className="w-full h-4 bg-slate-100 rounded" />
        </div>
      ))}
    </div>
  );
}
