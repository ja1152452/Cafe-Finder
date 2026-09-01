import React from 'react';
import { Star } from 'lucide-react';

interface RatingBadgeProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export const RatingBadge: React.FC<RatingBadgeProps> = ({
  rating,
  reviewCount,
  size = 'md',
  showCount = true,
}) => {
  const formattedRating = Number(rating || 0).toFixed(1);

  const sizeClasses = {
    sm: 'text-xs gap-1 py-0.5 px-1.5',
    md: 'text-sm gap-1.5 py-1 px-2.5',
    lg: 'text-base gap-2 py-1.5 px-3',
  };

  const starSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className={`inline-flex items-center font-semibold rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 ${sizeClasses[size]}`}>
      <Star className={`${starSizes[size]} fill-amber-500 text-amber-500`} />
      <span>{formattedRating}</span>
      {showCount && reviewCount !== undefined && (
        <span className="text-stone-400 dark:text-stone-400 font-normal text-xs">
          ({reviewCount})
        </span>
      )}
    </div>
  );
};
