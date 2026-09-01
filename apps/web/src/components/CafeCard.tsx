import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, ArrowRight, Sparkles } from 'lucide-react';
import { Cafe } from '@cafefinder/shared';
import { RatingBadge } from './RatingBadge.js';
import { PriceIndicator } from './PriceIndicator.js';
import { OpenStatusBadge } from './OpenStatusBadge.js';
import { FavoriteButton } from './FavoriteButton.js';
import { useMapStore } from '../stores/mapStore.js';
import { useAnalytics } from '../hooks/useAnalytics.js';

interface CafeCardProps {
  cafe: Cafe;
  className?: string;
  variant?: 'vertical' | 'horizontal' | 'compact';
}

export const CafeCard: React.FC<CafeCardProps> = ({
  cafe,
  className = '',
  variant = 'vertical',
}) => {
  const { hoveredCafeId, setHoveredCafeId, setSelectedCafe, setCenter } = useMapStore();
  const { trackEvent } = useAnalytics();

  const isHovered = hoveredCafeId === cafe.placeId;

  const handleMouseEnter = () => {
    setHoveredCafeId(cafe.placeId);
  };

  const handleMouseLeave = () => {
    if (hoveredCafeId === cafe.placeId) {
      setHoveredCafeId(null);
    }
  };

  const handleSelectOnMap = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCafe(cafe);
    setCenter(cafe.location);
  };

  const handleGetDirections = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    trackEvent('directions_clicked', { placeId: cafe.placeId, name: cafe.name });
    const url = `https://www.google.com/maps/dir/?api=1&destination=${cafe.location.lat},${cafe.location.lng}&destination_place_id=${cafe.placeId}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const photoUrl =
    cafe.primaryPhotoUrl ||
    cafe.photos?.[0]?.url ||
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80';

  if (variant === 'horizontal') {
    return (
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`group relative flex flex-col sm:flex-row bg-white dark:bg-stone-900 rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm hover:shadow-card ${
          isHovered
            ? 'border-amber-500 ring-2 ring-amber-500/20 -translate-y-0.5'
            : 'border-stone-200/80 dark:border-stone-800/80 hover:border-amber-400/50'
        } ${className}`}
      >
        {/* Photo Thumbnail */}
        <div className="relative sm:w-56 h-48 sm:h-auto flex-shrink-0 overflow-hidden bg-stone-100 dark:bg-stone-800">
          <img
            src={photoUrl}
            alt={cafe.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 z-10">
            <FavoriteButton cafe={cafe} size="sm" />
          </div>
          {cafe.categories?.[0] && (
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-900/80 backdrop-blur-md text-white">
              {cafe.categories[0].replace('_', ' ')}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <Link
                to={`/cafe/${cafe.placeId}`}
                className="font-bold text-lg text-stone-900 dark:text-stone-100 hover:text-amber-600 dark:hover:text-amber-400 transition-colors line-clamp-1"
              >
                {cafe.name}
              </Link>
              <PriceIndicator level={cafe.priceLevel} />
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <RatingBadge rating={cafe.rating} reviewCount={cafe.userRatingsTotal} size="sm" />
              <OpenStatusBadge openingHours={cafe.openingHours} />
            </div>

            <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 mb-2 line-clamp-1">
              <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
              <span>{cafe.address}</span>
            </p>

            {cafe.formattedDistance && (
              <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1 mb-3">
                <Navigation className="w-3.5 h-3.5" />
                <span>{cafe.formattedDistance} away</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
            <button
              type="button"
              onClick={handleGetDirections}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-amber-600" />
              <span>Directions</span>
            </button>
            <Link
              to={`/cafe/${cafe.placeId}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <span>View Cafe</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Vertical Card (Default Grid View)
  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleSelectOnMap}
      className={`group relative flex flex-col bg-white dark:bg-stone-900 rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm hover:shadow-card cursor-pointer ${
        isHovered
          ? 'border-amber-500 ring-2 ring-amber-500/20 -translate-y-1'
          : 'border-stone-200/80 dark:border-stone-800/80 hover:border-amber-400/50'
      } ${className}`}
    >
      {/* Photo Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
        <img
          src={photoUrl}
          alt={cafe.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Favorite Heart Top Right */}
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton cafe={cafe} size="sm" />
        </div>

        {/* Distance Badge Top Left */}
        {cafe.formattedDistance && (
          <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-xs font-bold bg-stone-900/80 backdrop-blur-md text-amber-400 flex items-center gap-1 shadow-sm">
            <Navigation className="w-3 h-3" />
            <span>{cafe.formattedDistance}</span>
          </div>
        )}

        {/* Category Pill Bottom Left */}
        {cafe.categories?.[0] && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-900/70 backdrop-blur-md text-white">
            {cafe.categories[0].replace('_', ' ')}
          </div>
        )}
      </div>

      {/* Body Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <Link
              to={`/cafe/${cafe.placeId}`}
              onClick={(e) => e.stopPropagation()}
              className="font-bold text-base text-stone-900 dark:text-stone-100 hover:text-amber-600 dark:hover:text-amber-400 transition-colors line-clamp-1"
            >
              {cafe.name}
            </Link>
            <PriceIndicator level={cafe.priceLevel} />
          </div>

          <div className="flex items-center gap-2 mb-2.5">
            <RatingBadge rating={cafe.rating} reviewCount={cafe.userRatingsTotal} size="sm" />
            <OpenStatusBadge openingHours={cafe.openingHours} />
          </div>

          <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 line-clamp-1 mb-3">
            <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
            <span>{cafe.address}</span>
          </p>
        </div>

        {/* Card Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
          <button
            type="button"
            onClick={handleGetDirections}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-colors"
          >
            <Navigation className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Directions</span>
          </button>
          <Link
            to={`/cafe/${cafe.placeId}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
