import { create } from 'zustand';
import { LocationCoordinates, Cafe } from '@cafefinder/shared';
import { DEFAULT_SEARCH_CENTER } from '@cafefinder/shared';

interface MapState {
  center: LocationCoordinates;
  zoom: number;
  selectedCafe: Cafe | null;
  hoveredCafeId: string | null;
  userLocation: LocationCoordinates | null;
  hasMovedMap: boolean;
  mapBounds: { north: number; south: number; east: number; west: number } | null;
  
  setCenter: (center: LocationCoordinates) => void;
  setZoom: (zoom: number) => void;
  setSelectedCafe: (cafe: Cafe | null) => void;
  setHoveredCafeId: (id: string | null) => void;
  setUserLocation: (loc: LocationCoordinates | null) => void;
  setHasMovedMap: (moved: boolean) => void;
  setMapBounds: (bounds: { north: number; south: number; east: number; west: number } | null) => void;
  resetMapMovement: () => void;
}

export const useMapStore = create<MapState>((set) => ({
  center: { lat: DEFAULT_SEARCH_CENTER.lat, lng: DEFAULT_SEARCH_CENTER.lng },
  zoom: 14,
  selectedCafe: null,
  hoveredCafeId: null,
  userLocation: null,
  hasMovedMap: false,
  mapBounds: null,

  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setSelectedCafe: (selectedCafe) => set({ selectedCafe }),
  setHoveredCafeId: (hoveredCafeId) => set({ hoveredCafeId }),
  setUserLocation: (userLocation) => set({ userLocation }),
  setHasMovedMap: (hasMovedMap) => set({ hasMovedMap }),
  setMapBounds: (mapBounds) => set({ mapBounds }),
  resetMapMovement: () => set({ hasMovedMap: false }),
}));
