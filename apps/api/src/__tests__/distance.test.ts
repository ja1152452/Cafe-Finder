import { describe, it, expect } from 'vitest';
import { calculateDistanceMeters, formatDistance } from '../utils/distance.js';

describe('Distance Utilities', () => {
  it('calculates 0 meters for identical coordinates', () => {
    const p1 = { lat: 14.2977, lng: 121.4596 };
    const distance = calculateDistanceMeters(p1, p1);
    expect(distance).toBe(0);
  });

  it('calculates approximately correct distance between Lumban and Pagsanjan', () => {
    const lumban = { lat: 14.2977, lng: 121.4596 };
    const pagsanjan = { lat: 14.2731, lng: 121.4526 };
    const distance = calculateDistanceMeters(lumban, pagsanjan);
    // Real distance is ~2.8 km (between 2500m and 3200m)
    expect(distance).toBeGreaterThan(2000);
    expect(distance).toBeLessThan(3500);
  });

  it('formats distance in meters when under 1000m', () => {
    expect(formatDistance(450)).toBe('450 m');
    expect(formatDistance(999)).toBe('999 m');
  });

  it('formats distance in kilometers when 1000m or more', () => {
    expect(formatDistance(1200)).toBe('1.2 km');
    expect(formatDistance(5430)).toBe('5.4 km');
  });
});
