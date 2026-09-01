import { AdminStats } from '@cafefinder/shared';
import { cacheService } from './cache.service.js';
import { memoryStore } from './memoryStore.js';

export class AnalyticsService {
  async trackEvent(data: {
    eventType: string;
    metadata?: Record<string, any>;
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void> {
    memoryStore.analyticsEvents.push({
      ...data,
      id: `evt_${Date.now()}`,
      createdAt: new Date().toISOString(),
    });
  }

  async getAdminStats(): Promise<AdminStats> {
    const totalUsers = memoryStore.users.size / 2; // email and id entries
    const totalFavorites = memoryStore.favorites.size;
    const totalSearches = memoryStore.searchHistory.length;
    const searchesToday = memoryStore.searchHistory.length;

    // Top search locations
    const searchCounts = new Map<string, number>();
    memoryStore.searchHistory.forEach((s) => {
      const c = searchCounts.get(s.query) || 0;
      searchCounts.set(s.query, c + 1);
    });

    const topSearchLocations = Array.from(searchCounts.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top favorited cafes
    const favCounts = new Map<string, { placeName: string; count: number; photoUrl?: string }>();
    for (const [, fav] of memoryStore.favorites) {
      const existing = favCounts.get(fav.placeId);
      if (existing) {
        existing.count++;
      } else {
        favCounts.set(fav.placeId, {
          placeName: fav.placeName,
          count: 1,
          photoUrl: fav.placePhotoUrl || undefined,
        });
      }
    }

    const topFavoritedCafes = Array.from(favCounts.entries())
      .map(([placeId, val]) => ({
        placeId,
        placeName: val.placeName,
        count: val.count,
        photoUrl: val.photoUrl,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalUsers: Math.max(2, Math.round(totalUsers)),
      totalFavorites,
      searchesToday,
      totalSearches,
      topSearchLocations,
      topFavoritedCafes,
      cacheStats: cacheService.getStats(),
      recentSearches: memoryStore.searchHistory.slice(0, 10),
    };
  }
}

export const analyticsService = new AnalyticsService();
