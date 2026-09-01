import { useCallback } from 'react';
import { api } from '../services/api.js';

export function useAnalytics() {
  const trackEvent = useCallback((eventType: string, metadata?: Record<string, any>) => {
    try {
      api.post('/admin/analytics/track', { eventType, metadata }).catch(() => {
        // ignore telemetry errors
      });
    } catch {
      // ignore
    }
  }, []);

  return { trackEvent };
}
