import React from 'react';
import { Amenity, AMENITIES_LIST } from '@cafefinder/shared';
import {
  Wifi,
  Zap,
  Sun,
  BookOpen,
  Dog,
  Wind,
  Car,
  CheckCircle,
  ShoppingBag,
  Truck,
  Check,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-4 h-4" />,
  power_outlets: <Zap className="w-4 h-4" />,
  outdoor_seating: <Sun className="w-4 h-4" />,
  study_friendly: <BookOpen className="w-4 h-4" />,
  pet_friendly: <Dog className="w-4 h-4" />,
  air_conditioned: <Wind className="w-4 h-4" />,
  parking: <Car className="w-4 h-4" />,
  restrooms: <CheckCircle className="w-4 h-4" />,
  takeout: <ShoppingBag className="w-4 h-4" />,
  delivery: <Truck className="w-4 h-4" />,
};

export const AmenitiesList: React.FC<{ amenities: Amenity[]; className?: string }> = ({
  amenities = [],
  className = '',
}) => {
  if (amenities.length === 0) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
        Features & Amenities
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {amenities.map((amenityKey) => {
          const item = AMENITIES_LIST.find((a) => a.id === amenityKey);
          return (
            <div
              key={amenityKey}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-300 shadow-sm"
            >
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                {ICON_MAP[amenityKey] || <Check className="w-4 h-4" />}
              </span>
              <span className="truncate">{item?.label || amenityKey}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
