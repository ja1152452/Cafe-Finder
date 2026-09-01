import React from 'react';
import { CafeReview } from '@cafefinder/shared';
import { Star, User as UserIcon } from 'lucide-react';

export const ReviewCard: React.FC<{ review: CafeReview }> = ({ review }) => {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {review.authorPhotoUrl ? (
            <img
              src={review.authorPhotoUrl}
              alt={review.authorName}
              className="w-10 h-10 rounded-full object-cover border border-stone-200 dark:border-stone-700"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-stone-800 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold">
              <UserIcon className="w-5 h-5" />
            </div>
          )}
          <div>
            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              {review.authorName}
            </h4>
            <span className="text-xs text-stone-400 dark:text-stone-500">
              {review.relativeTimeDescription}
            </span>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-0.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>{review.rating}.0</span>
        </div>
      </div>

      <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
        {review.text}
      </p>
    </div>
  );
};
