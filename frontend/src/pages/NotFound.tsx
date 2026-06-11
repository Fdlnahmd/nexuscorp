import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <h1 className="text-[120px] font-black text-slate-200 leading-none">404</h1>
        <h2 className="text-2xl font-bold text-slate-800 mt-4 mb-2">
          Page Not Found
        </h2>
        <p className="text-slate-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 border border-slate-200 rounded-full text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={16} /> Go Back
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition-colors"
          >
            <Home size={16} /> Home
          </Link>
        </div>
      </div>
    </div>
  );
}
