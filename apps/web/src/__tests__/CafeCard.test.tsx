import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CafeCard } from '../components/CafeCard.js';
import { Cafe } from '@cafefinder/shared';

const queryClient = new QueryClient();

const mockCafe: Cafe = {
  placeId: 'test_cafe_1',
  name: 'Artisan Pour-Over Bar',
  address: '123 Coffee Lane, Laguna',
  location: { lat: 14.2977, lng: 121.4596 },
  rating: 4.9,
  userRatingsTotal: 120,
  priceLevel: 2,
  categories: ['specialty_coffee'],
  amenities: ['wifi', 'power_outlets'],
  photos: [],
  primaryPhotoUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24',
  formattedDistance: '800 m',
};

describe('CafeCard Component', () => {
  it('renders cafe name, address, and distance', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CafeCard cafe={mockCafe} />
        </BrowserRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText('Artisan Pour-Over Bar')).toBeDefined();
    expect(screen.getByText('123 Coffee Lane, Laguna')).toBeDefined();
    expect(screen.getByText('800 m')).toBeDefined();
  });
});
