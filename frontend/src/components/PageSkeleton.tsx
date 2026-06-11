import React from 'react';

export default function PageSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 animate-pulse">
      {/* Navbar skeleton */}
      <div className="h-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-8 flex items-center h-full gap-8">
          <div className="w-32 h-8 bg-slate-200 rounded" />
          <div className="flex gap-6 ml-auto">
            <div className="w-16 h-4 bg-slate-200 rounded" />
            <div className="w-16 h-4 bg-slate-200 rounded" />
            <div className="w-16 h-4 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
      {/* Hero skeleton */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="w-48 h-4 bg-slate-200 rounded mb-6" />
        <div className="w-96 h-12 bg-slate-200 rounded mb-4" />
        <div className="w-80 h-12 bg-slate-200 rounded mb-8" />
        <div className="w-64 h-6 bg-slate-200 rounded mb-10" />
        <div className="flex gap-4">
          <div className="w-36 h-12 bg-slate-200 rounded-full" />
          <div className="w-36 h-12 bg-slate-100 rounded-full" />
        </div>
      </div>
      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="w-12 h-12 bg-slate-200 rounded-lg mb-4" />
              <div className="w-32 h-5 bg-slate-200 rounded mb-3" />
              <div className="w-full h-4 bg-slate-100 rounded mb-2" />
              <div className="w-3/4 h-4 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
