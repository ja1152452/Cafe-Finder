import React from 'react';

export const SkeletonDetails: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <div className="h-8 bg-stone-200 dark:bg-stone-800 rounded-lg w-2/3 md:w-1/3" />
        <div className="flex gap-3">
          <div className="h-5 bg-stone-200 dark:bg-stone-800 rounded-md w-24" />
          <div className="h-5 bg-stone-200 dark:bg-stone-800 rounded-md w-20" />
          <div className="h-5 bg-stone-200 dark:bg-stone-800 rounded-md w-32" />
        </div>
      </div>

      {/* Gallery Skeleton */}
      <div className="h-[360px] md:h-[440px] bg-stone-200 dark:bg-stone-800 rounded-3xl" />

      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-32 bg-stone-200 dark:bg-stone-800 rounded-2xl" />
          <div className="h-44 bg-stone-200 dark:bg-stone-800 rounded-2xl" />
          <div className="h-64 bg-stone-200 dark:bg-stone-800 rounded-2xl" />
        </div>
        <div className="space-y-6">
          <div className="h-60 bg-stone-200 dark:bg-stone-800 rounded-2xl" />
          <div className="h-48 bg-stone-200 dark:bg-stone-800 rounded-2xl" />
        </div>
      </div>
    </div>
  );
};
