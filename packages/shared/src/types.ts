export type PriceLevel = 1 | 2 | 3 | 4; // 1 = ₱, 2 = ₱₱, 3 = ₱₱₱, 4 = ₱₱₱₱

export type CafeCategory =
  | 'coffee_shop'
  | 'cafe'
  | 'bakery'
  | 'dessert_cafe'
  | 'tea_shop'
  | 'restaurant_cafe'
  | 'specialty_coffee';

export type Amenity =
  | 'wifi'
  | 'power_outlets'
  | 'outdoor_seating'
  | 'study_friendly'
  | 'pet_friendly'
  | 'air_conditioned'
  | 'parking'
  | 'restrooms'
  | 'delivery'
  | 'takeout';

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface OpeningPeriod {
  open: { day: number; time: string };
  close?: { day: number; time: string };
}

export interface OpeningHours {
  openNow?: boolean;
  isOpen24Hours?: boolean;
  weekdayText?: string[];
  periods?: OpeningPeriod[];
}

export interface CafeReview {
  id: string;
  authorName: string;
  authorPhotoUrl?: string;
  rating: number;
  relativeTimeDescription: string;
  text: string;
  time: number;
}

export interface CafePhoto {
  photoReference: string;
  url: string;
  width?: number;
  height?: number;
  attributions?: string[];
}

export interface Cafe {
  placeId: string;
  name: string;
  address: string;
  location: LocationCoordinates;
  rating: number;
  userRatingsTotal: number;
  priceLevel?: PriceLevel;
  openingHours?: OpeningHours;
  photos: CafePhoto[];
  categories: CafeCategory[];
  amenities: Amenity[];
  distanceMeters?: number;
  formattedDistance?: string;
  primaryPhotoUrl?: string;
  businessStatus?: 'OPERATIONAL' | 'CLOSED_TEMPORARILY' | 'CLOSED_PERMANENTLY';
  editorialSummary?: string;
}

export interface CafeDetail extends Cafe {
  phoneNumber?: string;
  internationalPhoneNumber?: string;
  website?: string;
  googleMapsUrl?: string;
  reviews: CafeReview[];
  utcOffsetMinutes?: number;
  vicinity?: string;
}

export type SortOption =
  | 'recommended'
  | 'distance'
  | 'rating'
  | 'most_reviewed'
  | 'price_asc'
  | 'price_desc';

export interface CafeFilterParams {
  query?: string;
  lat?: number;
  lng?: number;
  radius?: number; // in meters, e.g. 500, 1000, 3000, 5000, 10000
  minRating?: number; // 0, 3.5, 4.0, 4.5
  openNow?: boolean;
  open24Hours?: boolean;
  priceLevels?: PriceLevel[];
  category?: CafeCategory | 'all';
  amenities?: Amenity[];
  sortBy?: SortOption;
  page?: number;
  pageSize?: number;
}

export interface SearchCafesResponse {
  cafes: Cafe[];
  total: number;
  center?: LocationCoordinates;
  resolvedAddress?: string;
  page: number;
  totalPages: number;
  isMockData?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface FavoriteItem {
  id: string;
  userId: string;
  placeId: string;
  placeName: string;
  placeAddress: string;
  placePhotoUrl?: string | null;
  rating?: number | null;
  priceLevel?: number | null;
  lat?: number | null;
  lng?: number | null;
  createdAt: string;
}

export interface SearchHistoryItem {
  id: string;
  userId?: string | null;
  query: string;
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  createdAt: string;
}

export interface UserPreference {
  id: string;
  userId: string;
  radius: number;
  preferredPrice?: number | null;
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  favoriteAmenities: Amenity[];
}

export interface AdminStats {
  totalUsers: number;
  totalFavorites: number;
  searchesToday: number;
  totalSearches: number;
  topSearchLocations: { query: string; count: number }[];
  topFavoritedCafes: { placeId: string; placeName: string; count: number; photoUrl?: string }[];
  cacheStats: { totalKeys: number; hits: number; misses: number; hitRatio: string };
  recentSearches: SearchHistoryItem[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: Record<string, any>;
}
