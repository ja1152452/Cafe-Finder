import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding CafeFinder database...');

  // Hash passwords
  const userPasswordHash = await bcrypt.hash('password123', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);

  // 1. Create Demo User
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@cafefinder.com' },
    update: {},
    create: {
      email: 'demo@cafefinder.com',
      name: 'Coffee Enthusiast',
      passwordHash: userPasswordHash,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      role: 'USER',
      preference: {
        create: {
          radius: 5000,
          preferredPrice: 2,
          theme: 'system',
          notificationsEnabled: true,
          favoriteAmenities: JSON.stringify(['wifi', 'power_outlets', 'study_friendly']),
        },
      },
    },
  });

  // 2. Create Admin User
  await prisma.user.upsert({
    where: { email: 'admin@cafefinder.com' },
    update: {},
    create: {
      email: 'admin@cafefinder.com',
      name: 'System Admin',
      passwordHash: adminPasswordHash,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      role: 'ADMIN',
      preference: {
        create: {
          radius: 10000,
          theme: 'dark',
          notificationsEnabled: true,
          favoriteAmenities: JSON.stringify(['wifi', 'parking', 'outdoor_seating']),
        },
      },
    },
  });

  // 3. Create Sample Favorites for Demo User
  const sampleFavorites = [
    {
      placeId: 'mock_cafe_lumban_1',
      placeName: 'Kape Laguna Artisan Roasters',
      placeAddress: 'General Luna St, Poblacion, Lumban, 4014 Laguna',
      placePhotoUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
      rating: 4.8,
      priceLevel: 2,
      lat: 14.2985,
      lng: 121.4589,
    },
    {
      placeId: 'mock_cafe_pagsanjan_1',
      placeName: 'Rivermist Brew & Espresso',
      placeAddress: 'National Highway, Brgy. Sampaloc, Pagsanjan, 4008 Laguna',
      placePhotoUrl: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&auto=format&fit=crop&q=80',
      rating: 4.7,
      priceLevel: 2,
      lat: 14.2745,
      lng: 121.4542,
    },
    {
      placeId: 'mock_cafe_bgc_1',
      placeName: 'Monolith Specialty Coffee & Lab',
      placeAddress: 'High Street South, 26th St, BGC, Taguig, 1634 Metro Manila',
      placePhotoUrl: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&auto=format&fit=crop&q=80',
      rating: 4.9,
      priceLevel: 3,
      lat: 14.5512,
      lng: 121.0518,
    },
  ];

  for (const fav of sampleFavorites) {
    await prisma.favorite.upsert({
      where: {
        userId_placeId: {
          userId: demoUser.id,
          placeId: fav.placeId,
        },
      },
      update: {},
      create: {
        userId: demoUser.id,
        ...fav,
      },
    });
  }

  // 4. Create Sample Search History
  const sampleSearches = [
    { query: 'Cafes near Lumban', latitude: 14.2977, longitude: 121.4596, address: 'Lumban, Laguna' },
    { query: 'Coffee shops in Pagsanjan', latitude: 14.2731, longitude: 121.4526, address: 'Pagsanjan, Laguna' },
    { query: 'Study cafes in Los Baños', latitude: 14.1706, longitude: 121.2425, address: 'Los Baños, Laguna' },
    { query: 'Specialty coffee BGC', latitude: 14.5547, longitude: 121.0485, address: 'Bonifacio Global City' },
    { query: 'Quiet pet friendly cafes Makati', latitude: 14.5547, longitude: 121.0244, address: 'Makati City' },
  ];

  for (const s of sampleSearches) {
    await prisma.searchHistory.create({
      data: {
        userId: demoUser.id,
        query: s.query,
        latitude: s.latitude,
        longitude: s.longitude,
        address: s.address,
      },
    });
  }

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
