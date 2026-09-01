import { LocationCoordinates } from '@cafefinder/shared';

/**
 * Calculates the Haversine distance in meters between two geographical points.
 */
export function calculateDistanceMeters(
  point1: LocationCoordinates,
  point2: LocationCoordinates
): number {
  const R = 6371e3; // Earth radius in meters
  const lat1Rad = (point1.lat * Math.PI) / 180;
  const lat2Rad = (point2.lat * Math.PI) / 180;
  const deltaLatRad = ((point2.lat - point1.lat) * Math.PI) / 180;
  const deltaLngRad = ((point2.lng - point1.lng) * Math.PI) / 180;

  const a =
    Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLngRad / 2) *
      Math.sin(deltaLngRad / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Formats distance in meters to a human readable string (e.g. "450 m" or "2.4 km")
 */
export function formatDistance(meters?: number): string {
  if (meters === undefined || meters === null || isNaN(meters)) {
    return '';
  }
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}
