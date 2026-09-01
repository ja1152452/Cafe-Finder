import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  MapPin,
  Navigation,
  ArrowRight,
  Zap,
  Heart,
} from 'lucide-react';
import { SearchBar } from '../components/SearchBar.js';
import { CafeCard } from '../components/CafeCard.js';
import { SkeletonCard } from '../components/SkeletonCard.js';
import { CAFE_CATEGORIES, POPULAR_LOCATIONS } from '@cafefinder/shared';
import { useCafeSearch } from '../hooks/useCafeSearch.js';
import { useGeolocation } from '../hooks/useGeolocation.js';
import { useFilterStore } from '../stores/filterStore.js';
import { useMapStore } from '../stores/mapStore.js';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setCategory, setCoordinates, setQuery, setSortBy, setRadius } = useFilterStore();
  const { center, userLocation, setCenter, setUserLocation } = useMapStore();
  const { getLocation, loading: geoLoading } = useGeolocation();

  // Query top featured cafes around userLocation or default center
  const { data: featuredData, isLoading: featuredLoading } = useCafeSearch({
    lat: userLocation ? userLocation.lat : center.lat,
    lng: userLocation ? userLocation.lng : center.lng,
    radius: 15000,
    sortBy: 'recommended',
    pageSize: 6,
  });

  const handleSelectCategory = (categoryId: string) => {
    setCategory(categoryId as any);
    navigate(`/search?category=${categoryId}`);
  };

  const handleSelectHub = (hub: typeof POPULAR_LOCATIONS[0]) => {
    setCoordinates(hub.lat, hub.lng);
    setQuery(hub.name);
    navigate(`/search?q=${encodeURIComponent(hub.name)}&lat=${hub.lat}&lng=${hub.lng}`);
  };

  const handleFindNearest = () => {
    getLocation((loc) => {
      setUserLocation(loc);
      setCenter(loc);
      setCoordinates(loc.lat, loc.lng);
      setSortBy('distance');
      setRadius(5000);
      navigate(`/search?lat=${loc.lat}&lng=${loc.lng}&radius=5000&sortBy=distance`);
    });
  };

  return (
    <div className="space-y-20 pb-16">
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-amber-500/10 via-transparent to-transparent dark:from-amber-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          {/* Brand Logo Emblem */}
          <div className="flex justify-center -mb-2">
            <img
              src="/logo.png"
              alt="CafeFinder Logo"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full shadow-2xl border-2 border-amber-500/40 p-1 bg-white dark:bg-stone-900 animate-float"
            />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs sm:text-sm font-bold shadow-sm animate-pulse-subtle">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Find your perfect brew</span>
          </div>

          {/* Heading */}
          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-6xl font-black text-stone-950 dark:text-white tracking-tight leading-[1.15]">
              Find Your Perfect <br />
              <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 bg-clip-text text-transparent">
                Coffee Sanctuary
              </span>
            </h1>
            <p className="text-base sm:text-xl text-stone-600 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed">
              Discover specialty roasters, study havens, and hidden coffee gems near you with real-time maps, live opening hours, and verified amenities.
            </p>
          </div>

          {/* Search Bar & Nearest Button Container */}
          <div className="max-w-2xl mx-auto space-y-3 pt-2">
            <SearchBar size="lg" />

            {/* Quick Find Nearest Button */}
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleFindNearest}
                disabled={geoLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-sm font-bold shadow-md shadow-amber-600/20 transition-all cursor-pointer"
              >
                <Navigation className={`w-4 h-4 ${geoLoading ? 'animate-spin' : ''}`} />
                <span>{geoLoading ? 'Locating...' : '📍 Find Nearest Cafes'}</span>
              </button>
            </div>
          </div>

          {/* Popular Category Quick Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 max-w-4xl mx-auto">
            {CAFE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectCategory(cat.id)}
                className="px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-white dark:bg-stone-900 hover:bg-amber-600 hover:text-white dark:hover:bg-amber-600 dark:hover:text-white text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer"
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Featured Cafes / Cafes Near You */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Curated Selection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
              Trending & Top Rated Cafes
            </h2>
          </div>
          <Link
            to="/search"
            className="inline-flex items-center gap-1 text-sm font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400 group"
          >
            <span>Explore all cafes</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {featuredLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredData?.cafes?.map((cafe) => (
              <CafeCard key={cafe.placeId} cafe={cafe} />
            ))}
          </div>
        )}
      </section>

      {/* 3. Explore by Coffee Hub / Location */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-100 dark:bg-stone-900 rounded-3xl p-8 sm:p-12 border border-stone-200 dark:border-stone-800 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
              Explore Popular Coffee Hubs
            </h2>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400">
              Jump straight into curated cafe scenes across top coffee districts.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {POPULAR_LOCATIONS.map((hub) => (
              <button
                key={hub.name}
                type="button"
                onClick={() => handleSelectHub(hub)}
                className="flex flex-col items-center p-4 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-md transition-all group text-center active:scale-95 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                  {hub.name}
                </span>
                <span className="text-[11px] text-stone-500 dark:text-stone-400">
                  {hub.tag}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Why CafeFinder / Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Navigation className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100">
              Live Distance & Directions
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Calculates precise distance from your exact GPS coordinates with 1-click turn-by-turn navigation on Google Maps.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100">
              Verified Cafe Amenities
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Filter by high-speed Wi-Fi, power outlets, pet-friendly spaces, 24/7 opening hours, and quiet study-friendly seating.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100">
              Curated Favorites & Reviews
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Save your favorite coffee spots, organize your cafe bucket list, and view community reviews before stepping in.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
