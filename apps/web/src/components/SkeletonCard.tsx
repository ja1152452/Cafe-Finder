import React from 'react';

export const SkeletonCard: React.FC<{ variant?: 'vertical' | 'horizontal' }> = ({
  variant = 'vertical',
}) => {
  if (variant === 'horizontal') {
    return (
      <div className="flex flex-col sm:flex-row bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 gap-4 animate-pulse">
        <div className="sm:w-52 h-44 bg-stone-200 dark:bg-stone-800 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-3 py-1">
          <div className="h-5 bg-stone-200 dark:bg-stone-800 rounded-md w-3/4" />
          <div className="flex gap-2">
            <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded-md w-16" />
            <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded-md w-20" />
          </div>
          <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded-md w-full" />
          <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded-md w-1/3" />
          <div className="pt-2 flex gap-2">
            <div className="h-9 bg-stone-200 dark:bg-stone-800 rounded-xl flex-1" />
            <div className="h-9 bg-stone-200 dark:bg-stone-800 rounded-xl flex-1" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden animate-pulse">
      <div className="aspect-[4/3] w-full bg-stone-200 dark:bg-stone-800" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-stone-200 dark:bg-stone-800 rounded-md w-4/5" />
        <div className="flex gap-2">
          <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded-md w-14" />
          <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded-md w-16" />
        </div>
        <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded-md w-full" />
        <div className="pt-2 flex gap-2">
          <div className="h-9 bg-stone-200 dark:bg-stone-800 rounded-xl flex-1" />
          <div className="h-9 bg-stone-200 dark:bg-stone-800 rounded-xl flex-1" />
        </div>
      </div>
    </div>
  );
};
