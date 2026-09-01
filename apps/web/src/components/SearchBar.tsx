import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, MapPin, Sparkles } from 'lucide-react';
import { LocationButton } from './LocationButton.js';
import { POPULAR_LOCATIONS } from '@cafefinder/shared';
import { useSearchHistory } from '../hooks/useSearchHistory.js';
import { useFilterStore } from '../stores/filterStore.js';
import { useMapStore } from '../stores/mapStore.js';

interface SearchBarProps {
  initialQuery?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showSuggestions?: boolean;
  onSearch?: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialQuery = '',
  size = 'md',
  className = '',
  showSuggestions = true,
  onSearch,
}) => {
  const [inputValue, setInputValue] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { setQuery, setCoordinates } = useFilterStore();
  const { setCenter } = useMapStore();
  const { history, addHistory } = useSearchHistory();

  useEffect(() => {
    setInputValue(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExecuteSearch = (query: string, lat?: number, lng?: number) => {
    setIsOpen(false);
    const trimmed = query.trim();
    if (trimmed) {
      addHistory({ query: trimmed, latitude: lat, longitude: lng });
    }

    if (lat && lng) {
      setCoordinates(lat, lng);
      setCenter({ lat, lng });
    }
    setQuery(trimmed);

    if (onSearch) {
      onSearch(trimmed);
    } else {
      const searchParams = new URLSearchParams();
      if (trimmed) searchParams.set('q', trimmed);
      if (lat && lng) {
        searchParams.set('lat', lat.toString());
        searchParams.set('lng', lng.toString());
      }
      navigate(`/search?${searchParams.toString()}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleExecuteSearch(inputValue);
  };

  const handleSelectLocation = (loc: { name: string; lat: number; lng: number }) => {
    setInputValue(loc.name);
    handleExecuteSearch(loc.name, loc.lat, loc.lng);
  };

  const sizeStyles = {
    sm: 'py-2 px-3 text-sm',
    md: 'py-3 px-4 text-base',
    lg: 'py-4 px-5 text-lg',
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center w-full rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-card transition-all focus-within:ring-2 focus-within:ring-amber-500/30 focus-within:border-amber-500"
      >
        <div className="pl-4 text-stone-400 dark:text-stone-500">
          <Search className={size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} />
        </div>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search cafes, coffee shops, cities, or addresses..."
          className={`w-full bg-transparent text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none ${sizeStyles[size]}`}
        />

        {inputValue && (
          <button
            type="button"
            onClick={() => {
              setInputValue('');
              setQuery('');
            }}
            className="p-1.5 mr-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="pr-2 flex items-center gap-1.5">
          <LocationButton
            variant="icon"
            onLocationFound={(coords, addr) => {
              const query = addr || 'Near Me';
              setInputValue(query);
              handleExecuteSearch(query, coords.lat, coords.lng);
            }}
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-semibold text-sm transition-all shadow-sm"
          >
            Search
          </button>
        </div>
      </form>

      {/* Autocomplete & Suggestions Dropdown */}
      {showSuggestions && isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl border border-stone-200 dark:border-stone-800 shadow-2xl p-3 max-h-[380px] overflow-y-auto">
          {/* Recent Searches */}
          {history.length > 0 && (
            <div className="mb-3">
              <div className="text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider px-3 py-1.5">
                Recent Searches
              </div>
              <div className="space-y-1">
                {history.slice(0, 3).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setInputValue(item.query);
                      handleExecuteSearch(
                        item.query,
                        item.latitude || undefined,
                        item.longitude || undefined
                      );
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 text-sm transition-colors"
                  >
                    <Search className="w-4 h-4 text-stone-400 flex-shrink-0" />
                    <span className="truncate">{item.query}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Locations */}
          <div>
            <div className="flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
              <span>Popular Cafe Hubs</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="space-y-1">
              {POPULAR_LOCATIONS.map((loc) => (
                <button
                  key={loc.name}
                  type="button"
                  onClick={() => handleSelectLocation(loc)}
                  className="w-full flex items-center justify-between px-3 py-2 text-left rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 text-sm transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-500 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">{loc.name}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500">
                    {loc.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
