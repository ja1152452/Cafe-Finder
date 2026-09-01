import { Response } from 'express';
import { prisma } from '../repositories/prisma.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { memoryStore } from '../services/memoryStore.js';
import { UserPreference } from '@cafefinder/shared';

export class UserController {
  async getProfile(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } });
    }

    const userId = req.user.userId;
    let user = memoryStore.users.get(userId);

    if (!user) {
      try {
        const dbUser = await prisma.user.findUnique({ where: { id: userId } });
        if (dbUser) user = dbUser;
      } catch {
        // ignore
      }
    }

    if (!user) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
    }

    let pref = memoryStore.preferences.get(userId) || {
      id: `pref_${userId}`,
      userId,
      radius: 5000,
      theme: 'system',
      notificationsEnabled: true,
      favoriteAmenities: ['wifi', 'power_outlets'],
    };

    let favCount = 0;
    for (const [key] of memoryStore.favorites) {
      if (key.startsWith(`${userId}_`)) favCount++;
    }

    return res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl || null,
          role: user.role || 'USER',
          createdAt: typeof user.createdAt === 'string' ? user.createdAt : user.createdAt?.toISOString?.() || new Date().toISOString(),
          updatedAt: typeof user.updatedAt === 'string' ? user.updatedAt : user.updatedAt?.toISOString?.() || new Date().toISOString(),
        },
        preference: pref,
        stats: {
          favoritesCount: favCount,
          searchCount: memoryStore.searchHistory.filter((s) => s.userId === userId).length,
        },
      },
    });
  }

  async updateProfile(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } });
    }

    const userId = req.user.userId;
    const { name, avatarUrl } = req.body;

    const user = memoryStore.users.get(userId);
    if (user) {
      if (name) user.name = name.trim();
      if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
      memoryStore.users.set(userId, user);
      if (user.email) memoryStore.users.set(user.email, user);
    }

    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          ...(name ? { name: name.trim() } : {}),
          ...(avatarUrl !== undefined ? { avatarUrl } : {}),
        },
      });
    } catch {
      // ignore
    }

    return res.json({
      success: true,
      data: {
        id: userId,
        email: user?.email || '',
        name: user?.name || name,
        avatarUrl: user?.avatarUrl || avatarUrl,
        role: user?.role || 'USER',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  }

  async updatePreferences(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } });
    }

    const userId = req.user.userId;
    const { radius, preferredPrice, theme, notificationsEnabled, favoriteAmenities } = req.body;

    const currentPref = memoryStore.preferences.get(userId) || {
      id: `pref_${userId}`,
      userId,
      radius: 5000,
      theme: 'system',
      notificationsEnabled: true,
      favoriteAmenities: ['wifi', 'power_outlets'],
    };

    const updatedPref: UserPreference = {
      ...currentPref,
      radius: radius || currentPref.radius,
      preferredPrice: preferredPrice !== undefined ? preferredPrice : currentPref.preferredPrice,
      theme: theme || currentPref.theme,
      notificationsEnabled: notificationsEnabled !== undefined ? notificationsEnabled : currentPref.notificationsEnabled,
      favoriteAmenities: favoriteAmenities || currentPref.favoriteAmenities,
    };

    memoryStore.preferences.set(userId, updatedPref);

    return res.json({
      success: true,
      data: updatedPref,
    });
  }
}

export const userController = new UserController();
