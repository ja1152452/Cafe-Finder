import axios from 'axios';
import { Cafe, CafeDetail, CafeCategory, Amenity, PriceLevel, LocationCoordinates } from '@cafefinder/shared';
import { config } from '../config/index.js';
import { cacheService } from './cache.service.js';
import { mockDataService } from './mockData.service.js';
import { calculateDistanceMeters, formatDistance } from '../utils/distance.js';

export class GooglePlacesService {
  private apiKey: string;

  constructor() {
    this.apiKey = config.googlePlacesApiKey;
  }

  private hasValidKey(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim() !== '' && !this.apiKey.includes('YOUR_GOOGLE_MAPS_API_KEY'));
  }

  /**
   * Geocode an address/city to latitude and longitude
   */
  async geocode(address: string): Promise<{ location: LocationCoordinates; formattedAddress: string } | null> {
    if (!address || !address.trim()) return null;

    const cacheKey = `geocode:${address.toLowerCase().trim()}`;
    const cached = await cacheService.get<{ location: LocationCoordinates; formattedAddress: string }>(cacheKey);
    if (cached) return cached;

    if (!this.hasValidKey()) {
      // Fallback mock geocoding for popular areas
      const q = address.toLowerCase();
      if (q.includes('lumban')) return { location: { lat: 14.2977, lng: 121.4596 }, formattedAddress: 'Lumban, Laguna, Philippines' };
      if (q.includes('pagsanjan')) return { location: { lat: 14.2731, lng: 121.4526 }, formattedAddress: 'Pagsanjan, Laguna, Philippines' };
      if (q.includes('los baños') || q.includes('los banos')) return { location: { lat: 14.1706, lng: 121.2425 }, formattedAddress: 'Los Baños, Laguna, Philippines' };
      if (q.includes('bgc') || q.includes('bonifacio')) return { location: { lat: 14.5547, lng: 121.0485 }, formattedAddress: 'Bonifacio Global City, Taguig, Philippines' };
      if (q.includes('makati')) return { location: { lat: 14.5547, lng: 121.0244 }, formattedAddress: 'Makati, Metro Manila, Philippines' };
      if (q.includes('tagaytay')) return { location: { lat: 14.1153, lng: 120.9621 }, formattedAddress: 'Tagaytay, Cavite, Philippines' };
      if (q.includes('tokyo') || q.includes('shibuya')) return { location: { lat: 35.6580, lng: 139.7016 }, formattedAddress: 'Shibuya, Tokyo, Japan' };
      
      return { location: { lat: 14.2977, lng: 121.4596 }, formattedAddress: address };
    }

    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address,
          key: this.apiKey,
        },
      });

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const result = response.data.results[0];
        const res = {
          location: {
            lat: result.geometry.location.lat,
            lng: result.geometry.location.lng,
          },
          formattedAddress: result.formatted_address,
        };
        await cacheService.set(cacheKey, res, 86400 * 7); // Cache geocoding for 7 days
        return res;
      }
    } catch (err) {
      console.warn('Geocoding API error, using fallback:', (err as Error).message);
    }

    return null;
  }

  /**
   * Reverse geocode coordinates to human-readable address
   */
  async reverseGeocode(lat: number, lng: number): Promise<string> {
    const cacheKey = `revgeo:${lat.toFixed(4)},${lng.toFixed(4)}`;
    const cached = await cacheService.get<string>(cacheKey);
    if (cached) return cached;

    if (!this.hasValidKey()) {
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }

    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          latlng: `${lat},${lng}`,
          key: this.apiKey,
        },
      });

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const addr = response.data.results[0].formatted_address;
        await cacheService.set(cacheKey, addr, 86400 * 7);
        return addr;
      }
    } catch (err) {
      console.warn('Reverse geocoding error:', (err as Error).message);
    }

    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }

  /**
   * Search cafes using Google Places API (Nearby / Text Search) with caching & mock fallback
   */
  async searchCafes(params: {
    query?: string;
    lat?: number;
    lng?: number;
    radius?: number;
    minRating?: number;
    openNow?: boolean;
    open24Hours?: boolean;
    priceLevels?: PriceLevel[];
    category?: string;
    amenities?: Amenity[];
    sortBy?: string;
  }): Promise<{ cafes: Cafe[]; total: number; center: LocationCoordinates; resolvedAddress?: string; isMockData?: boolean }> {
    let centerLat = params.lat;
    let centerLng = params.lng;
    let resolvedAddress: string | undefined;

    // Resolve address coordinates if query specifies a location
    if (params.query && params.query.trim()) {
      const geocoded = await this.geocode(params.query);
      if (geocoded) {
        centerLat = geocoded.location.lat;
        centerLng = geocoded.location.lng;
        resolvedAddress = geocoded.formattedAddress;
      }
    }

    // Default to Lumban, Laguna if still undefined
    if (centerLat === undefined || centerLng === undefined) {
      centerLat = 14.2977;
      centerLng = 121.4596;
      resolvedAddress = 'Lumban, Laguna, Philippines';
    }

    const center: LocationCoordinates = { lat: centerLat, lng: centerLng };
    const radius = params.radius || 5000;

    // Build Cache Key
    const cacheKey = `places:search:${params.query || ''}:${centerLat.toFixed(4)}:${centerLng.toFixed(4)}:${radius}:${params.category || ''}`;
    const cached = await cacheService.get<{ cafes: Cafe[]; total: number }>(cacheKey);

    let rawCafes: Cafe[] = [];
    let isMock = false;

    if (cached) {
      rawCafes = cached.cafes;
    } else if (this.hasValidKey()) {
      try {
        let placesUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
        let queryParams: Record<string, any> = {
          location: `${centerLat},${centerLng}`,
          radius: Math.min(radius, 50000),
          type: 'cafe',
          key: this.apiKey,
        };

        if (params.query && params.query.trim()) {
          placesUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
          queryParams = {
            query: `${params.query} cafe coffee`,
            location: `${centerLat},${centerLng}`,
            radius: Math.min(radius, 50000),
            key: this.apiKey,
          };
        }

        const response = await axios.get(placesUrl, { params: queryParams });

        if (response.data.status === 'OK' && Array.isArray(response.data.results) && response.data.results.length > 0) {
          rawCafes = response.data.results.map((p: any) => this.mapGooglePlaceToCafe(p, center));
          await cacheService.set(cacheKey, { cafes: rawCafes, total: rawCafes.length }, config.cacheTtlSeconds);
        } else {
          // If Google returns ZERO_RESULTS or quota exceeded, supplement with mock data
          const mockRes = mockDataService.searchCafes({ ...params, lat: centerLat, lng: centerLng, radius });
          rawCafes = mockRes.cafes;
          isMock = true;
        }
      } catch (error) {
        console.warn('Google Places API request error, falling back to mock dataset:', (error as Error).message);
        const mockRes = mockDataService.searchCafes({ ...params, lat: centerLat, lng: centerLng, radius });
        rawCafes = mockRes.cafes;
        isMock = true;
      }
    } else {
      // Mock data provider: if lat/lng were not explicitly provided, search across all cafes
      const searchRadius = params.lat && params.lng ? radius : undefined;
      const mockRes = mockDataService.searchCafes({ ...params, lat: centerLat, lng: centerLng, radius: searchRadius });
      rawCafes = mockRes.cafes;
      isMock = true;
    }

    // Apply Client Filter & Sort Rules
    let filtered = rawCafes.map((c) => {
      const distanceMeters = calculateDistanceMeters(center, c.location);
      return {
        ...c,
        distanceMeters,
        formattedDistance: formatDistance(distanceMeters),
      };
    });

    if (params.minRating && params.minRating > 0) {
      filtered = filtered.filter((c) => c.rating >= params.minRating!);
    }

    if (params.openNow) {
      filtered = filtered.filter((c) => c.openingHours?.openNow === true);
    }

    if (params.open24Hours) {
      filtered = filtered.filter((c) => c.openingHours?.isOpen24Hours === true);
    }

    if (params.priceLevels && params.priceLevels.length > 0) {
      filtered = filtered.filter((c) => c.priceLevel && params.priceLevels!.includes(c.priceLevel));
    }

    if (params.category && params.category !== 'all') {
      filtered = filtered.filter((c) => c.categories.includes(params.category as CafeCategory));
    }

    if (params.amenities && params.amenities.length > 0) {
      filtered = filtered.filter((c) => params.amenities!.every((a) => c.amenities.includes(a)));
    }

    // Sorting
    switch (params.sortBy) {
      case 'distance':
        filtered.sort((a, b) => (a.distanceMeters ?? 0) - (b.distanceMeters ?? 0));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'most_reviewed':
        filtered.sort((a, b) => b.userRatingsTotal - a.userRatingsTotal);
        break;
      case 'price_asc':
        filtered.sort((a, b) => (a.priceLevel ?? 2) - (b.priceLevel ?? 2));
        break;
      case 'price_desc':
        filtered.sort((a, b) => (b.priceLevel ?? 2) - (a.priceLevel ?? 2));
        break;
      case 'recommended':
      default:
        filtered.sort((a, b) => {
          const scoreA = (a.rating * Math.log10(a.userRatingsTotal + 10)) / (((a.distanceMeters ?? 1000) / 2000) + 1);
          const scoreB = (b.rating * Math.log10(b.userRatingsTotal + 10)) / (((b.distanceMeters ?? 1000) / 2000) + 1);
          return scoreB - scoreA;
        });
        break;
    }

    return {
      cafes: filtered,
      total: filtered.length,
      center,
      resolvedAddress,
      isMockData: isMock,
    };
  }

  /**
   * Retrieve rich details for a specific cafe placeId
   */
  async getPlaceDetails(placeId: string, userLocation?: LocationCoordinates): Promise<CafeDetail | null> {
    // 1. Check Mock Data first for mock IDs
    if (placeId.startsWith('mock_')) {
      return mockDataService.getCafeById(placeId, userLocation);
    }

    // 2. Check Cache
    const cacheKey = `places:detail:${placeId}`;
    const cached = await cacheService.get<CafeDetail>(cacheKey);
    if (cached) {
      if (userLocation) {
        const distanceMeters = calculateDistanceMeters(userLocation, cached.location);
        return {
          ...cached,
          distanceMeters,
          formattedDistance: formatDistance(distanceMeters),
        };
      }
      return cached;
    }

    // 3. Query Google Places API Details
    if (this.hasValidKey()) {
      try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
          params: {
            place_id: placeId,
            fields:
              'place_id,name,formatted_address,geometry,rating,user_ratings_total,price_level,opening_hours,photos,formatted_phone_number,international_phone_number,website,url,reviews,utc_offset,business_status,vicinity,types',
            key: this.apiKey,
          },
        });

        if (response.data.status === 'OK' && response.data.result) {
          const detail = this.mapGoogleDetailToCafe(response.data.result, userLocation);
          await cacheService.set(cacheKey, detail, config.cacheTtlSeconds * 2);
          return detail;
        }
      } catch (err) {
        console.warn('Google Place Details error:', (err as Error).message);
      }
    }

    // Fallback to mock cafe if not found
    return mockDataService.getCafeById(placeId, userLocation) || mockDataService.getCafeById('mock_cafe_lumban_1', userLocation);
  }

  /**
   * Helper mapping from Google Place Search JSON to Cafe
   */
  private mapGooglePlaceToCafe(place: any, center?: LocationCoordinates): Cafe {
    const loc: LocationCoordinates = {
      lat: place.geometry?.location?.lat || 0,
      lng: place.geometry?.location?.lng || 0,
    };

    const distanceMeters = center ? calculateDistanceMeters(center, loc) : undefined;

    const photos = (place.photos || []).map((p: any) => ({
      photoReference: p.photo_reference,
      url: `/api/cafes/photo?ref=${encodeURIComponent(p.photo_reference)}&maxWidth=800`,
      width: p.width,
      height: p.height,
      attributions: p.html_attributions,
    }));

    const primaryPhotoUrl = photos.length > 0
      ? photos[0].url
      : 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80';

    return {
      placeId: place.place_id,
      name: place.name || 'Cozy Cafe',
      address: place.vicinity || place.formatted_address || '',
      location: loc,
      rating: place.rating || 4.5,
      userRatingsTotal: place.user_ratings_total || 50,
      priceLevel: (place.price_level as PriceLevel) || 2,
      openingHours: {
        openNow: place.opening_hours?.open_now ?? true,
      },
      photos,
      primaryPhotoUrl,
      categories: this.inferCategories(place.types || [], place.name),
      amenities: this.inferAmenities(place.types || [], place.name),
      distanceMeters,
      formattedDistance: formatDistance(distanceMeters),
      businessStatus: place.business_status,
    };
  }

  /**
   * Helper mapping from Google Place Details JSON to CafeDetail
   */
  private mapGoogleDetailToCafe(detail: any, userLocation?: LocationCoordinates): CafeDetail {
    const cafe = this.mapGooglePlaceToCafe(detail, userLocation);

    const reviews = (detail.reviews || []).map((r: any) => ({
      id: `${r.time}_${r.author_name}`,
      authorName: r.author_name,
      authorPhotoUrl: r.profile_photo_url,
      rating: r.rating,
      relativeTimeDescription: r.relative_time_description,
      text: r.text,
      time: r.time * 1000,
    }));

    return {
      ...cafe,
      phoneNumber: detail.formatted_phone_number,
      internationalPhoneNumber: detail.international_phone_number,
      website: detail.website,
      googleMapsUrl: detail.url,
      reviews,
      vicinity: detail.vicinity,
      openingHours: {
        openNow: detail.opening_hours?.open_now,
        weekdayText: detail.opening_hours?.weekday_text || [],
      },
    };
  }

  private inferCategories(types: string[], name: string = ''): CafeCategory[] {
    const lowerName = name.toLowerCase();
    const categories: CafeCategory[] = ['cafe'];

    if (types.includes('bakery') || lowerName.includes('bakery') || lowerName.includes('bakeshop')) {
      categories.push('bakery');
    }
    if (lowerName.includes('specialty') || lowerName.includes('roaster') || lowerName.includes('brew')) {
      categories.push('specialty_coffee');
    }
    if (lowerName.includes('tea') || lowerName.includes('matcha')) {
      categories.push('tea_shop');
    }
    if (lowerName.includes('dessert') || lowerName.includes('waffle') || lowerName.includes('gelato')) {
      categories.push('dessert_cafe');
    }
    if (types.includes('restaurant') || lowerName.includes('bistro')) {
      categories.push('restaurant_cafe');
    }
    if (lowerName.includes('coffee') || lowerName.includes('espresso')) {
      categories.push('coffee_shop');
    }

    return Array.from(new Set(categories));
  }

  private inferAmenities(types: string[], name: string = ''): Amenity[] {
    // In real Google Places API, features can be inferred or derived from Place Details
    const amenities: Amenity[] = ['wifi', 'air_conditioned', 'takeout'];
    const lower = name.toLowerCase();

    if (lower.includes('study') || lower.includes('cowork') || lower.includes('nook')) {
      amenities.push('power_outlets', 'study_friendly');
    }
    if (lower.includes('garden') || lower.includes('view') || lower.includes('terrace') || lower.includes('river')) {
      amenities.push('outdoor_seating', 'pet_friendly');
    }
    if (types.includes('parking') || lower.includes('plaza') || lower.includes('highway')) {
      amenities.push('parking');
    }

    return Array.from(new Set(amenities));
  }
}

export const googlePlacesService = new GooglePlacesService();
