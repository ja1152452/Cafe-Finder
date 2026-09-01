import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Cafe } from '@cafefinder/shared';
import { useFavorites } from '../hooks/useFavorites.js';

interface FavoriteButtonProps {
  cafe: Cafe;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  cafe,
  size = 'md',
  className = '',
  showText = false,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [animating, setAnimating] = useState(false);
  const active = isFavorite(cafe.placeId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAnimating(true);
    toggleFavorite(cafe);
    setTimeout(() => setAnimating(false), 450);
  };

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-2.5 text-base',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={active ? 'Remove from favorites' : 'Save to favorites'}
      title={active ? 'Remove from favorites' : 'Save to favorites'}
      className={`relative inline-flex items-center gap-2 rounded-full transition-all duration-200 ${sizeClasses[size]} ${
        active
          ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
          : 'bg-white/90 dark:bg-stone-800/90 text-stone-600 dark:text-stone-300 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-stone-800 shadow-sm border border-stone-200 dark:border-stone-700'
      } ${className}`}
    >
      <Heart
        className={`${iconSizes[size]} transition-transform duration-200 ${
          animating ? 'animate-heart-burst' : ''
        } ${active ? 'fill-rose-500 text-rose-500' : 'text-current'}`}
      />
      {showText && (
        <span className="font-medium text-xs">
          {active ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
};
