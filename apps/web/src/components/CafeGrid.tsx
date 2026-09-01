import React from 'react';
import { Cafe } from '@cafefinder/shared';
import { CafeCard } from './CafeCard.js';

interface CafeGridProps {
  cafes: Cafe[];
  className?: string;
}

export const CafeGrid: React.FC<CafeGridProps> = ({ cafes, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 ${className}`}>
      {cafes.map((cafe) => (
        <CafeCard key={cafe.placeId} cafe={cafe} variant="vertical" />
      ))}
    </div>
  );
};
