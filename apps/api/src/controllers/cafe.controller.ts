import { Request, Response } from 'express';
import axios from 'axios';
import { googlePlacesService } from '../services/googlePlaces.service.js';
import { analyticsService } from '../services/analytics.service.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { Amenity, PriceLevel } from '@cafefinder/shared';
import { config } from '../config/index.js';

export class CafeController {
  async search(req: AuthRequest, res: Response) {
    try {
      const {
        query,
        lat,
        lng,
        radius,
        minRating,
        openNow,
        open24Hours,
        priceLevels,
        category,
        amenities,
        sortBy,
        page = 1,
        pageSize = 20,
      } = req.query as any;

      let parsedPriceLevels: PriceLevel[] | undefined;
      if (priceLevels && typeof priceLevels === 'string') {
        parsedPriceLevels = priceLevels.split(',').map((p: string) => parseInt(p, 10) as PriceLevel);
      }

      let parsedAmenities: Amenity[] | undefined;
      if (amenities && typeof amenities === 'string') {
        parsedAmenities = amenities.split(',').map((a: string) => a.trim() as Amenity);
      }

      const results = await googlePlacesService.searchCafes({
        query: query as string,
        lat: lat ? parseFloat(lat) : undefined,
        lng: lng ? parseFloat(lng) : undefined,
        radius: radius ? parseInt(radius, 10) : undefined,
        minRating: minRating ? parseFloat(minRating) : undefined,
        openNow: openNow === true || openNow === 'true',
        open24Hours: open24Hours === true || open24Hours === 'true',
        priceLevels: parsedPriceLevels,
        category: category as string,
        amenities: parsedAmenities,
        sortBy: sortBy as string,
      });

      // Pagination
      const pageNum = Math.max(1, parseInt(page as any, 10) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(pageSize as any, 10) || 20));
      const startIndex = (pageNum - 1) * limit;
      const paginatedCafes = results.cafes.slice(startIndex, startIndex + limit);
      const totalPages = Math.ceil(results.total / limit) || 1;

      // Track Search Analytics Event asynchronously
      if (query || (lat && lng)) {
        analyticsService.trackEvent({
          eventType: 'search_performed',
          userId: req.user?.userId,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
          metadata: { query, lat, lng, totalResults: results.total },
        });
      }

      return res.json({
        success: true,
        data: {
          cafes: paginatedCafes,
          total: results.total,
          center: results.center,
          resolvedAddress: results.resolvedAddress,
          page: pageNum,
          totalPages,
          isMockData: results.isMockData,
        },
      });
    } catch (err: any) {
      console.error('Cafe search error:', err);
      return res.status(500).json({
        success: false,
        error: { code: 'SEARCH_ERROR', message: 'Failed to search cafes. Please try again.' },
      });
    }
  }

  async getById(req: AuthRequest, res: Response) {
    try {
      const { placeId } = req.params;
      const { lat, lng } = req.query;

      const userLoc = lat && lng ? { lat: parseFloat(lat as string), lng: parseFloat(lng as string) } : undefined;
      const cafe = await googlePlacesService.getPlaceDetails(placeId, userLoc);

      if (!cafe) {
        return res.status(404).json({
          success: false,
          error: { code: 'CAFE_NOT_FOUND', message: 'Cafe details not found.' },
        });
      }

      // Track Cafe View event
      analyticsService.trackEvent({
        eventType: 'cafe_viewed',
        userId: req.user?.userId,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        metadata: { placeId, name: cafe.name },
      });

      return res.json({
        success: true,
        data: cafe,
      });
    } catch (err: any) {
      console.error('Get cafe details error:', err);
      return res.status(500).json({
        success: false,
        error: { code: 'FETCH_ERROR', message: 'Failed to fetch cafe details.' },
      });
    }
  }

  async photoProxy(req: Request, res: Response) {
    try {
      const { ref, maxWidth = '800' } = req.query;
      if (!ref) {
        return res.redirect('https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80');
      }

      if (!config.googlePlacesApiKey) {
        return res.redirect('https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80');
      }

      const googlePhotoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${ref}&key=${config.googlePlacesApiKey}`;
      const response = await axios.get(googlePhotoUrl, { responseType: 'stream' });

      res.setHeader('Content-Type', String(response.headers['content-type'] || 'image/jpeg'));
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return response.data.pipe(res);
    } catch {
      return res.redirect('https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80');
    }
  }

  async geocode(req: Request, res: Response) {
    const { address } = req.query;
    if (!address || typeof address !== 'string') {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_ADDRESS', message: 'Address query parameter is required.' },
      });
    }

    const result = await googlePlacesService.geocode(address);
    if (!result) {
      return res.status(404).json({
        success: false,
        error: { code: 'GEOCODE_FAILED', message: 'Could not resolve location.' },
      });
    }

    return res.json({ success: true, data: result });
  }

  async reverseGeocode(req: Request, res: Response) {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_COORDINATES', message: 'Latitude and longitude are required.' },
      });
    }

    const address = await googlePlacesService.reverseGeocode(parseFloat(lat as string), parseFloat(lng as string));
    return res.json({ success: true, data: { address } });
  }
}

export const cafeController = new CafeController();
