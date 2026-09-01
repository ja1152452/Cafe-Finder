import React from 'react';
import { PriceLevel } from '@cafefinder/shared';

interface PriceIndicatorProps {
  level?: PriceLevel;
  className?: string;
}

export const PriceIndicator: React.FC<PriceIndicatorProps> = ({ level = 2, className = '' }) => {
  const totalTiers = 4;

  return (
    <span className={`inline-flex items-center text-xs font-semibold tracking-wider ${className}`} title={`Price Level ${level} of 4`}>
      {Array.from({ length: totalTiers }).map((_, i) => (
        <span
          key={i}
          className={
            i < level
              ? 'text-amber-600 dark:text-amber-400 font-bold'
              : 'text-stone-300 dark:text-stone-700'
          }
        >
          ₱
        </span>
      ))}
    </span>
  );
};
