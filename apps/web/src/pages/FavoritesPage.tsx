import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Search, Navigation, Trash2, ArrowRight, Star, LogIn, Lock } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites.js';
import { useAuthStore } from '../stores/authStore.js';
import { EmptyState } from '../components/EmptyState.js';
import { RatingBadge } from '../components/RatingBadge.js';
import { PriceIndicator } from '../components/PriceIndicator.js';

export const FavoritesPage: React.FC = () => {
  const { favorites, isLoading, removeFavorite } = useFavorites();
  const { isAuthenticated } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredFavorites = favorites.filter((fav) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      fav.placeName.toLowerCase().includes(q) ||
      fav.placeAddress.toLowerCase().includes(q)
    );
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
            Sign In to Save Favorites
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Sign in to bookmark your favorite coffee spots, sync across devices, and organize your cafe discoveries.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Continue</span>
          </Link>
          <Link
            to="/search"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold text-sm hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <span>Explore Cafes</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
              My Saved Cafes
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            {favorites.length} {favorites.length === 1 ? 'cafe' : 'cafes'} saved to your account.
          </p>
        </div>

        {/* Search within favorites */}
        {favorites.length > 0 && (
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter your saved cafes..."
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>
        )}
      </div>

      {/* Content */}
      {favorites.length === 0 ? (
        <EmptyState
          title="No saved cafes yet"
          description="Start exploring cafes and click the heart icon on any cafe card or details page to bookmark your favorite spots."
          actionText="Discover Cafes"
          icon={<Heart className="w-10 h-10 text-rose-500" />}
          onReset={() => navigate('/search')}
        />
      ) : filteredFavorites.length === 0 ? (
        <EmptyState
          title="No matches found"
          description={`No saved cafes match "${searchQuery}".`}
          actionText="Clear Filter"
          onReset={() => setSearchQuery('')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map((fav) => (
            <div
              key={fav.id || fav.placeId}
              className="group relative bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              {/* Photo */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                <img
                  src={
                    fav.placePhotoUrl ||
                    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80'
                  }
                  alt={fav.placeName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeFavorite(fav.placeId)}
                  title="Remove from favorites"
                  className="absolute top-3 right-3 p-2 rounded-full bg-stone-900/80 text-rose-400 hover:bg-rose-600 hover:text-white transition-colors backdrop-blur-md cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <Link
                      to={`/cafe/${fav.placeId}`}
                      className="font-bold text-base text-stone-900 dark:text-stone-100 hover:text-amber-600 dark:hover:text-amber-400 transition-colors line-clamp-1"
                    >
                      {fav.placeName}
                    </Link>
                    <PriceIndicator level={fav.priceLevel as any} />
                  </div>

                  <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1 mb-2">
                    {fav.placeAddress}
                  </p>

                  <div className="flex items-center gap-2">
                    <RatingBadge rating={fav.rating || 0} size="sm" />
                    {fav.lat && fav.lng && (
                      <span className="text-[11px] font-semibold text-stone-400">
                        📍 Coordinates Saved
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${fav.lat || ''},${fav.lng || ''}&destination_place_id=${fav.placeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5 text-amber-600" />
                    <span>Directions</span>
                  </a>
                  <Link
                    to={`/cafe/${fav.placeId}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
