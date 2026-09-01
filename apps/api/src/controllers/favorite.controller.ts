import { Response } from 'express';
import { prisma } from '../repositories/prisma.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { analyticsService } from '../services/analytics.service.js';
import { memoryStore } from '../services/memoryStore.js';
import { FavoriteItem } from '@cafefinder/shared';

export class FavoriteController {
  async getFavorites(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } });
    }

    const userId = req.user.userId;
    const userFavorites: FavoriteItem[] = [];

    for (const [key, fav] of memoryStore.favorites.entries()) {
      if (fav.userId === userId || key.startsWith(`${userId}_`)) {
        userFavorites.push(fav);
      }
    }

    // Try DB as enhancement
    try {
      const dbFavs = await prisma.favorite.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      if (dbFavs.length > 0) {
        dbFavs.forEach((f) => {
          const item: FavoriteItem = {
            id: f.id,
            userId: f.userId,
            placeId: f.placeId,
            placeName: f.placeName,
            placeAddress: f.placeAddress,
            placePhotoUrl: f.placePhotoUrl,
            rating: f.rating,
            priceLevel: f.priceLevel,
            lat: f.lat,
            lng: f.lng,
            createdAt: f.createdAt.toISOString(),
          };
          if (!memoryStore.favorites.has(`${userId}_${f.placeId}`)) {
            userFavorites.push(item);
            memoryStore.favorites.set(`${userId}_${f.placeId}`, item);
          }
        });
      }
    } catch {
      // ignore
    }

    return res.json({
      success: true,
      data: userFavorites,
    });
  }

  async addFavorite(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } });
    }

    const userId = req.user.userId;
    const { placeId, placeName, placeAddress, placePhotoUrl, rating, priceLevel, lat, lng } = req.body;

    const favoriteItem: FavoriteItem = {
      id: `fav_${Date.now()}`,
      userId,
      placeId,
      placeName,
      placeAddress,
      placePhotoUrl: placePhotoUrl || null,
      rating: rating || null,
      priceLevel: priceLevel || null,
      lat: lat || null,
      lng: lng || null,
      createdAt: new Date().toISOString(),
    };

    memoryStore.favorites.set(`${userId}_${placeId}`, favoriteItem);

    // Optional DB sync
    try {
      await prisma.favorite.upsert({
        where: {
          userId_placeId: { userId, placeId },
        },
        update: { placeName, placeAddress, placePhotoUrl, rating, priceLevel, lat, lng },
        create: { userId, placeId, placeName, placeAddress, placePhotoUrl, rating, priceLevel, lat, lng },
      });
    } catch {
      // ignore
    }

    analyticsService.trackEvent({
      eventType: 'favorite_added',
      userId,
      metadata: { placeId, placeName },
    });

    return res.status(201).json({
      success: true,
      data: favoriteItem,
    });
  }

  async removeFavorite(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } });
    }

    const userId = req.user.userId;
    const { placeId } = req.params;

    memoryStore.favorites.delete(`${userId}_${placeId}`);

    try {
      await prisma.favorite.deleteMany({
        where: { userId, placeId },
      });
    } catch {
      // ignore
    }

    analyticsService.trackEvent({
      eventType: 'favorite_removed',
      userId,
      metadata: { placeId },
    });

    return res.json({
      success: true,
      data: { message: 'Removed from favorites.' },
    });
  }
}

export const favoriteController = new FavoriteController();
