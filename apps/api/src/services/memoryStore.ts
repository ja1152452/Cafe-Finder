import { FavoriteItem, SearchHistoryItem, UserPreference } from '@cafefinder/shared';
import bcrypt from 'bcryptjs';

// In-Memory Data Store for zero-database requirement
export class MemoryStore {
  public users: Map<string, any> = new Map();
  public favorites: Map<string, FavoriteItem> = new Map(); // key: userId_placeId
  public searchHistory: SearchHistoryItem[] = [];
  public preferences: Map<string, UserPreference> = new Map(); // key: userId
  public analyticsEvents: any[] = [];
  public cache: Map<string, { data: any; expiresAt: number }> = new Map();

  constructor() {
    this.seedDefaultData();
  }

  private seedDefaultData() {
    const defaultPasswordHash = bcrypt.hashSync('password123', 10);
    const adminPasswordHash = bcrypt.hashSync('admin123', 10);

    // 1. Demo User
    const demoUser = {
      id: 'demo_user_1',
      email: 'demo@cafefinder.com',
      passwordHash: defaultPasswordHash,
      name: 'Lumban Coffee Explorer',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      role: 'USER',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.set(demoUser.email, demoUser);
    this.users.set(demoUser.id, demoUser);

    // Demo Preferences
    this.preferences.set(demoUser.id, {
      id: 'pref_1',
      userId: demoUser.id,
      radius: 5000,
      preferredPrice: 2,
      theme: 'system',
      notificationsEnabled: true,
      favoriteAmenities: ['wifi', 'outdoor_seating', 'parking'],
    });

    // 2. Admin User
    const adminUser = {
      id: 'admin_user_1',
      email: 'admin@cafefinder.com',
      passwordHash: adminPasswordHash,
      name: 'System Admin',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      role: 'ADMIN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.set(adminUser.email, adminUser);
    this.users.set(adminUser.id, adminUser);

    this.preferences.set(adminUser.id, {
      id: 'pref_2',
      userId: adminUser.id,
      radius: 10000,
      preferredPrice: 2,
      theme: 'dark',
      notificationsEnabled: true,
      favoriteAmenities: ['wifi', 'parking', 'outdoor_seating'],
    });

    // 3. Initial Sample Real Favorites in Lumban & vicinity for Demo User
    const realFavorites: FavoriteItem[] = [
      {
        id: 'fav_1',
        userId: demoUser.id,
        placeId: 'real_niface_lumban',
        placeName: 'Nicafé Caliraya',
        placeAddress: 'Caliraya Viewpoint, Brgy. Lewin, Lumban, 4014 Laguna',
        placePhotoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
        rating: 4.8,
        priceLevel: 2,
        lat: 14.2985,
        lng: 121.4920,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'fav_2',
        userId: demoUser.id,
        placeId: 'real_highlanders_lumban',
        placeName: 'Highlanders Café Lumban',
        placeAddress: 'Brgy. Lewin (beside Caliraya Skypod), Lumban, 4014 Laguna',
        placePhotoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
        rating: 4.7,
        priceLevel: 2,
        lat: 14.3012,
        lng: 121.4880,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'fav_3',
        userId: demoUser.id,
        placeId: 'real_ibayo_lumban',
        placeName: 'Cafe Ibayó',
        placeAddress: 'Purok Tres, Brgy. Concepcion, Lumban, 4014 Laguna',
        placePhotoUrl: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&auto=format&fit=crop&q=80',
        rating: 4.8,
        priceLevel: 1,
        lat: 14.2970,
        lng: 121.4585,
        createdAt: new Date().toISOString(),
      },
    ];

    realFavorites.forEach((f) => {
      this.favorites.set(`${f.userId}_${f.placeId}`, f);
    });

    // 4. Initial Sample Search History in Lumban
    this.searchHistory.push(
      {
        id: 'hist_1',
        userId: demoUser.id,
        query: 'Coffee shops in Lumban Laguna',
        latitude: 14.2977,
        longitude: 121.4596,
        address: 'Lumban, Laguna',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'hist_2',
        userId: demoUser.id,
        query: 'Nicafe Caliraya Viewpoint',
        latitude: 14.2985,
        longitude: 121.4920,
        address: 'Brgy. Lewin, Lumban, Laguna',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: 'hist_3',
        userId: demoUser.id,
        query: 'Highlanders Cafe Lumban',
        latitude: 14.3012,
        longitude: 121.4880,
        address: 'Lumban, Laguna',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      }
    );
  }
}

export const memoryStore = new MemoryStore();
