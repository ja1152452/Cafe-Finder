import React from 'react';
import { Share2, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ShareButtonProps {
  title: string;
  url?: string;
  className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  title,
  url = window.location.href,
  className = '',
}) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out ${title} on CafeFinder`,
          text: `Discover ${title} on CafeFinder - Find your next favorite cafe!`,
          url,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Could not copy link.');
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      title="Share Cafe"
      aria-label="Share Cafe"
      className={`inline-flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:text-amber-600 dark:hover:text-amber-400 border border-stone-200 dark:border-stone-700 shadow-sm hover:shadow transition-all ${className}`}
    >
      <Share2 className="w-4 h-4" />
      <span className="text-xs font-semibold hidden sm:inline">Share</span>
    </button>
  );
};
