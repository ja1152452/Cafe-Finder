import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Home, Search } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-5">
      <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
        <Coffee className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl font-black text-stone-900 dark:text-white">404 — Spilled Coffee</h1>
        <p className="text-sm text-stone-500 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved to another location.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </Link>
        <Link
          to="/search"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 font-semibold text-sm transition-all"
        >
          <Search className="w-4 h-4" />
          <span>Discover Cafes</span>
        </Link>
      </div>
    </div>
  );
};
