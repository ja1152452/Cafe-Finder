import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(60).optional(),
  avatarUrl: z.string().url().nullable().optional(),
});

export const updatePreferencesSchema = z.object({
  radius: z.number().min(500).max(50000).optional(),
  preferredPrice: z.number().min(1).max(4).nullable().optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
  notificationsEnabled: z.boolean().optional(),
  favoriteAmenities: z.array(z.string()).optional(),
});

export const cafeSearchQuerySchema = z.object({
  query: z.string().optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  radius: z.coerce.number().min(100).max(50000).optional().default(5000),
  minRating: z.coerce.number().min(0).max(5).optional().default(0),
  openNow: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
  open24Hours: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
  priceLevels: z.string().optional(), // Comma-separated like "1,2"
  category: z.string().optional(),
  amenities: z.string().optional(), // Comma-separated like "wifi,power_outlets"
  sortBy: z.enum(['recommended', 'distance', 'rating', 'most_reviewed', 'price_asc', 'price_desc']).optional().default('recommended'),
  page: z.coerce.number().min(1).optional().default(1),
  pageSize: z.coerce.number().min(1).max(50).optional().default(20),
});

export const createFavoriteSchema = z.object({
  placeId: z.string().min(1, 'Place ID is required'),
  placeName: z.string().min(1, 'Place name is required'),
  placeAddress: z.string().min(1, 'Place address is required'),
  placePhotoUrl: z.string().optional().nullable(),
  rating: z.number().min(0).max(5).optional().nullable(),
  priceLevel: z.number().min(1).max(4).optional().nullable(),
  lat: z.number().min(-90).max(90).optional().nullable(),
  lng: z.number().min(-180).max(180).optional().nullable(),
});

export const createSearchHistorySchema = z.object({
  query: z.string().min(1, 'Query is required'),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  address: z.string().optional().nullable(),
});

export const trackEventSchema = z.object({
  eventType: z.string().min(1),
  metadata: z.record(z.any()).optional(),
});
