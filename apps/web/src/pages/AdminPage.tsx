import React, { useEffect, useState } from 'react';
import {
  Users,
  Heart,
  Search,
  Activity,
  Database,
  TrendingUp,
  MapPin,
  Coffee,
  ShieldAlert,
} from 'lucide-react';
import { AdminStats } from '@cafefinder/shared';
import { api } from '../services/api.js';
import { SkeletonCard } from '../components/SkeletonCard.js';

export const AdminPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.get('/admin/dashboard');
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} variant="vertical" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
              Platform Admin & Analytics
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500">
            Real-time platform discovery metrics, API caching health, and user favorites.
          </p>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Total Users
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-stone-900 dark:text-white">
            {stats?.totalUsers || 0}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold">Active Accounts</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Total Favorites
            </span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-stone-900 dark:text-white">
            {stats?.totalFavorites || 0}
          </p>
          <span className="text-[11px] text-rose-500 font-semibold">Bookmarked Cafes</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Searches Today
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Search className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-stone-900 dark:text-white">
            {stats?.searchesToday || 0}
          </p>
          <span className="text-[11px] text-stone-400 font-medium">
            {stats?.totalSearches || 0} total queries
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Cache Hit Ratio
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {stats?.cacheStats.hitRatio || '0%'}
          </p>
          <span className="text-[11px] text-stone-400 font-medium">
            {stats?.cacheStats.hits || 0} hits / {stats?.cacheStats.misses || 0} misses
          </span>
        </div>
      </div>

      {/* Two Column Section: Top Locations & Top Favorited Cafes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Popular Search Locations */}
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-white">
            <MapPin className="w-4 h-4 text-amber-600" />
            <h3>Top Searched Locations & Keywords</h3>
          </div>

          <div className="space-y-2">
            {stats?.topSearchLocations && stats.topSearchLocations.length > 0 ? (
              stats.topSearchLocations.map((loc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 text-xs sm:text-sm font-medium"
                >
                  <span className="truncate">{loc.query}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-bold">
                    {loc.count} searches
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-400 p-2">No location queries tracked yet.</p>
            )}
          </div>
        </div>

        {/* Most Favorited Cafes */}
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-white">
            <Coffee className="w-4 h-4 text-amber-600" />
            <h3>Most Bookmarked Cafes</h3>
          </div>

          <div className="space-y-2">
            {stats?.topFavoritedCafes && stats.topFavoritedCafes.length > 0 ? (
              stats.topFavoritedCafes.map((cafe) => (
                <div
                  key={cafe.placeId}
                  className="flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 text-xs sm:text-sm font-medium"
                >
                  <span className="truncate">{cafe.placeName}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 font-bold">
                    {cafe.count} saves
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-400 p-2">No favorites recorded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
