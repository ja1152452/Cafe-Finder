import { useState, useCallback } from 'react';
import { LocationCoordinates } from '@cafefinder/shared';
import { toast } from 'sonner';
import { api } from '../services/api.js';

interface GeolocationState {
  coordinates: LocationCoordinates | null;
  address: string | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    address: null,
    loading: false,
    error: null,
  });

  const getLocation = useCallback(
    (onSuccess?: (coords: LocationCoordinates, address?: string) => void) => {
      if (!navigator.geolocation) {
        const msg = 'Geolocation is not supported by your browser.';
        setState((s) => ({ ...s, loading: false, error: msg }));
        toast.error(msg);
        return;
      }

      setState((s) => ({ ...s, loading: true, error: null }));
      toast.loading('Detecting your location...', { id: 'cf-geo' });

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords: LocationCoordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          let resolvedAddr: string | null = null;
          try {
            const res = await api.get(`/cafes/reverse-geocode?lat=${coords.lat}&lng=${coords.lng}`);
            if (res.data?.data?.address) {
              resolvedAddr = res.data.data.address;
            }
          } catch {
            resolvedAddr = 'Current Location';
          }

          setState({
            coordinates: coords,
            address: resolvedAddr,
            loading: false,
            error: null,
          });

          toast.success('Location detected!', { id: 'cf-geo' });
          if (onSuccess) {
            onSuccess(coords, resolvedAddr || undefined);
          }
        },
        (error) => {
          let errorMsg = 'Could not access your location.';
          if (error.code === error.PERMISSION_DENIED) {
            errorMsg = 'Location permission denied. Please allow location access or search manually.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMsg = 'Location information is unavailable.';
          } else if (error.code === error.TIMEOUT) {
            errorMsg = 'Location request timed out. Please try again.';
          }

          setState((s) => ({ ...s, loading: false, error: errorMsg }));
          toast.error(errorMsg, { id: 'cf-geo' });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    },
    []
  );

  return {
    ...state,
    getLocation,
  };
}
