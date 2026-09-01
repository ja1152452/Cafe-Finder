import React from 'react';
import { Navigation, Loader2 } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation.js';
import { useMapStore } from '../stores/mapStore.js';
import { useFilterStore } from '../stores/filterStore.js';
import { useSearchHistory } from '../hooks/useSearchHistory.js';
import { LocationCoordinates } from '@cafefinder/shared';

interface LocationButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'icon';
  onLocationFound?: (coords: LocationCoordinates, address?: string) => void;
}

export const LocationButton: React.FC<LocationButtonProps> = ({
  className = '',
  variant = 'secondary',
  onLocationFound,
}) => {
  const { loading, getLocation } = useGeolocation();
  const { setCenter, setUserLocation } = useMapStore();
  const { setCoordinates, setQuery } = useFilterStore();
  const { addHistory } = useSearchHistory();

  const handleDetectLocation = () => {
    getLocation((coords, address) => {
      setCenter(coords);
      setUserLocation(coords);
      setCoordinates(coords.lat, coords.lng);
      if (address) {
        setQuery(address);
        addHistory({
          query: `Near ${address}`,
          latitude: coords.lat,
          longitude: coords.lng,
          address,
        });
      }
      if (onLocationFound) {
        onLocationFound(coords, address);
      }
    });
  };

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleDetectLocation}
        disabled={loading}
        title="Use My Location"
        aria-label="Use My Current Location"
        className={`p-2.5 rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:text-amber-600 dark:hover:text-amber-400 border border-stone-200 dark:border-stone-700 shadow-sm transition-all hover:shadow-md disabled:opacity-50 ${className}`}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin text-amber-600 dark:text-amber-400" />
        ) : (
          <Navigation className="w-5 h-5" />
        )}
      </button>
    );
  }

  if (variant === 'primary') {
    return (
      <button
        type="button"
        onClick={handleDetectLocation}
        disabled={loading}
        className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 ${className}`}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Navigation className="w-5 h-5" />
        )}
        <span>{loading ? 'Finding Location...' : 'Use My Location'}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleDetectLocation}
      disabled={loading}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-sm font-medium border border-stone-200 dark:border-stone-700 transition-all disabled:opacity-50 ${className}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-amber-600 dark:text-amber-400" />
      ) : (
        <Navigation className="w-4 h-4 text-amber-600 dark:text-amber-400" />
      )}
      <span>{loading ? 'Locating...' : 'Near Me'}</span>
    </button>
  );
};
