import React from 'react';
import { Coffee, RotateCcw, Search } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
  actionText?: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No cafes found nearby',
  description = 'Try expanding your search radius, removing active filters, or searching for a different city.',
  onReset,
  actionText = 'Reset Filters',
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-3xl bg-white/60 dark:bg-stone-900/60 border border-dashed border-stone-300 dark:border-stone-800 space-y-4">
      <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
        {icon || <Coffee className="w-10 h-10" />}
      </div>

      <div className="max-w-md space-y-1.5">
        <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100">{title}</h3>
        <p className="text-sm text-stone-500 dark:text-stone-400">{description}</p>
      </div>

      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold shadow-md transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};
