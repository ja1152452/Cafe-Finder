import React from 'react';
import { Clock } from 'lucide-react';
import { OpeningHours } from '@cafefinder/shared';

interface OpenStatusBadgeProps {
  openingHours?: OpeningHours;
  className?: string;
}

export const OpenStatusBadge: React.FC<OpenStatusBadgeProps> = ({ openingHours, className = '' }) => {
  if (!openingHours) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 ${className}`}>
        <Clock className="w-3 h-3 text-stone-400" />
        <span>Hours unverified</span>
      </span>
    );
  }

  if (openingHours.isOpen24Hours) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Open 24 Hours</span>
      </span>
    );
  }

  const isOpen = openingHours.openNow ?? true;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        isOpen
          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
          : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20'
      } ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-emerald-500' : 'bg-rose-500'}`} />
      <span>{isOpen ? 'Open Now' : 'Closed'}</span>
    </span>
  );
};
