import { Response } from 'express';
import { prisma } from '../repositories/prisma.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { memoryStore } from '../services/memoryStore.js';
import { SearchHistoryItem } from '@cafefinder/shared';

export class HistoryController {
  async getHistory(req: AuthRequest, res: Response) {
    const userId = req.user?.userId;

    let items = memoryStore.searchHistory;
    if (userId) {
      items = items.filter((h) => !h.userId || h.userId === userId);
    }

    return res.json({
      success: true,
      data: items.slice(0, 20),
    });
  }

  async addHistory(req: AuthRequest, res: Response) {
    const { query, latitude, longitude, address } = req.body;
    const userId = req.user?.userId || null;

    const item: SearchHistoryItem = {
      id: `hist_${Date.now()}`,
      userId,
      query,
      latitude: latitude || null,
      longitude: longitude || null,
      address: address || null,
      createdAt: new Date().toISOString(),
    };

    memoryStore.searchHistory.unshift(item);

    // Optional DB sync
    try {
      await prisma.searchHistory.create({
        data: { userId, query, latitude, longitude, address },
      });
    } catch {
      // ignore
    }

    return res.status(201).json({
      success: true,
      data: item,
    });
  }

  async deleteHistoryItem(req: AuthRequest, res: Response) {
    const { id } = req.params;
    memoryStore.searchHistory = memoryStore.searchHistory.filter((h) => h.id !== id);

    try {
      await prisma.searchHistory.deleteMany({ where: { id } });
    } catch {
      // ignore
    }

    return res.json({
      success: true,
      data: { message: 'History item deleted.' },
    });
  }

  async clearHistory(req: AuthRequest, res: Response) {
    const userId = req.user?.userId;
    if (userId) {
      memoryStore.searchHistory = memoryStore.searchHistory.filter((h) => h.userId !== userId);
    } else {
      memoryStore.searchHistory = [];
    }

    try {
      if (userId) {
        await prisma.searchHistory.deleteMany({ where: { userId } });
      }
    } catch {
      // ignore
    }

    return res.json({
      success: true,
      data: { message: 'Search history cleared.' },
    });
  }
}

export const historyController = new HistoryController();
