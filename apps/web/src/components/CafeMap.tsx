import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { Cafe, LocationCoordinates } from '@cafefinder/shared';
import {
  Navigation,
  Plus,
  Minus,
  Search,
  MapPin,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useMapStore } from '../stores/mapStore.js';
import { RatingBadge } from './RatingBadge.js';
import { PriceIndicator } from './PriceIndicator.js';

interface CafeMapProps {
  cafes: Cafe[];
  className?: string;
  onSearchArea?: (center: LocationCoordinates) => void;
}

// 100% Free, High-Resolution, No-API-Key Map Tile Providers
const TILE_PROVIDERS = {
  osm: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxZoom: 19,
    subdomains: ['a', 'b', 'c'],
    attribution: '&copy; OpenStreetMap contributors',
  },
  esri: {
    name: 'ESRI Street Map',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 19,
    subdomains: [],
    attribution: '&copy; Esri',
  },
  satellite: {
    name: 'Satellite View',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 19,
    subdomains: [],
    attribution: '&copy; Esri World Imagery',
  },
};

export const CafeMap: React.FC<CafeMapProps> = ({
  cafes,
  className = '',
  onSearchArea,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const currentTileLayerRef = useRef<L.TileLayer | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [activeTileKey, setActiveTileKey] = useState<keyof typeof TILE_PROVIDERS>('osm');
  const [showLayerPicker, setShowLayerPicker] = useState(false);

  const {
    center,
    zoom,
    setCenter,
    setZoom,
    selectedCafe,
    setSelectedCafe,
    hoveredCafeId,
    userLocation,
    hasMovedMap,
    setHasMovedMap,
    resetMapMovement,
  } = useMapStore();

  // 1. Initialize Leaflet Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialLat = center?.lat ?? 14.2977;
    const initialLng = center?.lng ?? 121.4596;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: zoom || 14,
      zoomControl: false,
      attributionControl: false,
    });

    // 100% Free OpenStreetMap High-Resolution Tiles (No API key, No watermark)
    const provider = TILE_PROVIDERS[activeTileKey];
    const tiles = L.tileLayer(provider.url, {
      maxZoom: provider.maxZoom,
      subdomains: provider.subdomains,
    }).addTo(map);

    currentTileLayerRef.current = tiles;

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    // Track user pan / drag movement to display "Search this area"
    map.on('moveend', () => {
      const c = map.getCenter();
      setCenter({ lat: c.lat, lng: c.lng });
      setZoom(map.getZoom());
      setHasMovedMap(true);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Change Tile Layer (Streets, ESRI, Satellite)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (currentTileLayerRef.current) {
      mapInstanceRef.current.removeLayer(currentTileLayerRef.current);
    }
    const provider = TILE_PROVIDERS[activeTileKey];
    const newTiles = L.tileLayer(provider.url, {
      maxZoom: provider.maxZoom,
      subdomains: provider.subdomains,
    }).addTo(mapInstanceRef.current);

    currentTileLayerRef.current = newTiles;
  }, [activeTileKey]);

  // 3. Update Map Center & FlyTo when center changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (center && (center.lat !== mapInstanceRef.current.getCenter().lat || center.lng !== mapInstanceRef.current.getCenter().lng)) {
      mapInstanceRef.current.flyTo([center.lat, center.lng], mapInstanceRef.current.getZoom(), {
        duration: 0.8,
      });
    }
  }, [center]);

  // 4. Render Custom Coffee Markers with Live Ratings & Icons
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    cafes.forEach((cafe) => {
      const isSelected = selectedCafe?.placeId === cafe.placeId;
      const isHovered = hoveredCafeId === cafe.placeId;

      const markerHtml = `
        <div class="relative group cursor-pointer transition-all duration-300 transform ${
          isSelected || isHovered ? 'scale-125 z-50' : 'scale-100 z-10'
        }">
          <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black shadow-xl border-2 transition-all ${
            isSelected || isHovered
              ? 'bg-amber-600 text-white border-white ring-4 ring-amber-500/50 shadow-amber-600/60'
              : 'bg-stone-950 text-amber-400 border-amber-500 hover:bg-amber-600 hover:text-white'
          }">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/>
            </svg>
            <span>${cafe.rating > 0 ? cafe.rating.toFixed(1) : '☕'}</span>
          </div>
          <div class="w-2.5 h-2.5 bg-stone-950 mx-auto transform rotate-45 -mt-1.5 ${isSelected || isHovered ? 'bg-amber-600' : ''}"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-cafe-marker',
        html: markerHtml,
        iconSize: [70, 36],
        iconAnchor: [35, 36],
      });

      const marker = L.marker([cafe.location.lat, cafe.location.lng], {
        icon: customIcon,
      });

      marker.on('click', () => {
        setSelectedCafe(cafe);
        setCenter(cafe.location);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([cafe.location.lat, cafe.location.lng], 16, { duration: 0.6 });
        }
      });

      markersLayerRef.current?.addLayer(marker);
    });

    // 5. Render User Location Pulsing Dot
    if (userLocation) {
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
      } else {
        const userIcon = L.divIcon({
          className: 'custom-user-marker',
          html: `
            <div class="relative flex items-center justify-center w-7 h-7">
              <div class="absolute w-7 h-7 bg-blue-500/30 rounded-full animate-ping"></div>
              <div class="relative w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-lg"></div>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const uMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon });
        markersLayerRef.current.addLayer(uMarker);
        userMarkerRef.current = uMarker;
      }
    }
  }, [cafes, selectedCafe, hoveredCafeId, userLocation]);

  // Handle Zoom In/Out
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  // Handle Center on User GPS Location
  const handleCenterOnUser = () => {
    if (userLocation && mapInstanceRef.current) {
      setCenter(userLocation);
      mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 15, { duration: 0.8 });
    }
  };

  // Handle "Search this area"
  const handleSearchAreaClick = () => {
    if (mapInstanceRef.current && onSearchArea) {
      const c = mapInstanceRef.current.getCenter();
      onSearchArea({ lat: c.lat, lng: c.lng });
      resetMapMovement();
    }
  };

  return (
    <div className={`relative w-full h-full min-h-[450px] overflow-hidden bg-stone-900 ${className}`}>
      {/* 1. Real OpenStreetMap / Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* 2. Floating "Search this area" Pill */}
      {hasMovedMap && onSearchArea && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 animate-slide-up">
          <button
            type="button"
            onClick={handleSearchAreaClick}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-950/90 text-white text-xs font-bold shadow-2xl border border-amber-500/50 hover:bg-amber-600 hover:border-amber-600 transition-all active:scale-95 cursor-pointer backdrop-blur-md"
          >
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span>Search this area</span>
          </button>
        </div>
      )}

      {/* 3. Floating Map Controls (Zoom, Layers, User GPS) */}
      <div className="absolute bottom-6 right-4 z-20 flex flex-col gap-2">
        {/* Layer Switcher Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLayerPicker(!showLayerPicker)}
            title="Switch Map Tiles (OpenStreetMap / Satellite)"
            className="p-2.5 rounded-xl bg-stone-900/90 text-stone-200 shadow-xl border border-stone-700 hover:bg-amber-600 hover:text-white transition-all cursor-pointer backdrop-blur-md"
          >
            <Layers className="w-4 h-4" />
          </button>

          {showLayerPicker && (
            <div className="absolute right-12 bottom-0 w-44 bg-stone-900/95 rounded-2xl shadow-2xl border border-stone-700 p-2 space-y-1 backdrop-blur-md animate-fade-in z-30">
              <div className="text-[10px] uppercase font-bold text-stone-400 px-2 py-1">
                Map Tile Layers
              </div>
              {(Object.keys(TILE_PROVIDERS) as Array<keyof typeof TILE_PROVIDERS>).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setActiveTileKey(key);
                    setShowLayerPicker(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    activeTileKey === key
                      ? 'bg-amber-600 text-white'
                      : 'text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  {TILE_PROVIDERS[key].name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Center on User Location */}
        {userLocation && (
          <button
            type="button"
            onClick={handleCenterOnUser}
            title="Recenter on My Location"
            className="p-2.5 rounded-xl bg-stone-900/90 text-stone-200 shadow-xl border border-stone-700 hover:bg-amber-600 hover:text-white transition-all cursor-pointer backdrop-blur-md"
          >
            <Navigation className="w-4 h-4 text-blue-400" />
          </button>
        )}

        {/* Zoom Controls */}
        <div className="flex flex-col bg-stone-900/90 rounded-xl shadow-xl border border-stone-700 overflow-hidden backdrop-blur-md">
          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-2.5 text-stone-200 hover:bg-stone-800 transition-colors border-b border-stone-700 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-2.5 text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. Selected Cafe Floating Mini Card */}
      {selectedCafe && (
        <div className="absolute bottom-6 left-4 right-16 sm:right-auto sm:max-w-xs z-20 animate-fade-in">
          <div className="bg-stone-900/95 rounded-2xl shadow-2xl border border-amber-500/40 overflow-hidden backdrop-blur-md p-3.5 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <Link
                  to={`/cafe/${selectedCafe.placeId}`}
                  className="font-bold text-sm text-white hover:text-amber-400 line-clamp-1"
                >
                  {selectedCafe.name}
                </Link>
                <p className="text-[11px] text-stone-400 line-clamp-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-stone-400 flex-shrink-0" />
                  <span>{selectedCafe.address}</span>
                </p>
              </div>
              <PriceIndicator level={selectedCafe.priceLevel} />
            </div>

            <div className="flex items-center justify-between text-xs pt-1.5 border-t border-stone-800">
              <div className="flex items-center gap-1.5">
                <RatingBadge rating={selectedCafe.rating} reviewCount={selectedCafe.userRatingsTotal} size="sm" />
                {selectedCafe.formattedDistance && (
                  <span className="text-[11px] font-bold text-amber-400">
                    📍 {selectedCafe.formattedDistance}
                  </span>
                )}
              </div>

              <Link
                to={`/cafe/${selectedCafe.placeId}`}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300"
              >
                <span>Details</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
