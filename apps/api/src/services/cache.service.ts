import { prisma } from '../repositories/prisma.js';
import { config } from '../config/index.js';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class CacheService {
  private memoryCache = new Map<string, CacheEntry<any>>();
  private hitCount = 0;
  private missCount = 0;

  async get<T>(key: string): Promise<T | null> {
    const now = Date.now();

    // 1. Check in-memory cache
    const memItem = this.memoryCache.get(key);
    if (memItem) {
      if (memItem.expiresAt > now) {
        this.hitCount++;
        return memItem.data as T;
      }
      this.memoryCache.delete(key);
    }

    // 2. Check DB cache
    try {
      const dbItem = await prisma.placeCache.findUnique({
        where: { cacheKey: key },
      });

      if (dbItem && dbItem.expiresAt.getTime() > now) {
        const data = JSON.parse(dbItem.data) as T;
        this.memoryCache.set(key, { data, expiresAt: dbItem.expiresAt.getTime() });
        this.hitCount++;
        return data;
      }
    } catch {
      // ignore DB read error
    }

    this.missCount++;
    return null;
  }

  async set<T>(key: string, data: T, ttlSeconds: number = config.cacheTtlSeconds): Promise<void> {
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

    // 1. Update in-memory cache
    this.memoryCache.set(key, { data, expiresAt: expiresAt.getTime() });

    // 2. Persist to DB cache asynchronously
    try {
      await prisma.placeCache.upsert({
        where: { cacheKey: key },
        update: {
          data: JSON.stringify(data),
          expiresAt,
        },
        create: {
          cacheKey: key,
          data: JSON.stringify(data),
          expiresAt,
        },
      });
    } catch {
      // ignore DB write error
    }
  }

  getStats() {
    const total = this.hitCount + this.missCount;
    const hitRatio = total > 0 ? `${((this.hitCount / total) * 100).toFixed(1)}%` : '0%';
    return {
      totalKeys: this.memoryCache.size,
      hits: this.hitCount,
      misses: this.missCount,
      hitRatio,
    };
  }

  async cleanupExpired(): Promise<void> {
    const now = new Date();
    try {
      await prisma.placeCache.deleteMany({
        where: { expiresAt: { lt: now } },
      });
    } catch {
      // ignore
    }
  }
}

export const cacheService = new CacheService();
