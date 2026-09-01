import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
  jwtSecret: process.env.JWT_SECRET || 'cafefinder-super-secret-jwt-key-change-in-production-12345',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
  googlePlacesApiKey: process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  cacheTtlSeconds: parseInt(process.env.CACHE_TTL_SECONDS || '3600', 10), // 1 hour default
};
