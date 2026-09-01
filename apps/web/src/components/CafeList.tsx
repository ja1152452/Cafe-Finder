import React from 'react';
import { Cafe } from '@cafefinder/shared';
import { CafeCard } from './CafeCard.js';

interface CafeListProps {
  cafes: Cafe[];
  className?: string;
}

export const CafeList: React.FC<CafeListProps> = ({ cafes, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {cafes.map((cafe) => (
        <CafeCard key={cafe.placeId} cafe={cafe} variant="horizontal" />
      ))}
    </div>
  );
};
