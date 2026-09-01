import { Amenity, CafeCategory, PriceLevel, SortOption } from './types';

export const CAFE_CATEGORIES: { id: CafeCategory; label: string; icon: string; description: string }[] = [
  {
    id: 'specialty_coffee',
    label: 'Specialty Coffee',
    icon: 'Sparkles',
    description: 'Single-origin brews, pour-overs & artisan roasters',
  },
  {
    id: 'coffee_shop',
    label: 'Coffee Shop',
    icon: 'Coffee',
    description: 'Classic espresso, lattes, cold brews & cozy vibes',
  },
  {
    id: 'cafe',
    label: 'Modern Cafe',
    icon: 'Store',
    description: 'All-day breakfast, brunch, sandwiches & beverages',
  },
  {
    id: 'bakery',
    label: 'Bakery & Pastry',
    icon: 'Croissant',
    description: 'Fresh artisanal bread, croissants, cakes & treats',
  },
  {
    id: 'dessert_cafe',
    label: 'Dessert Cafe',
    icon: 'Cake',
    description: 'Waffles, gelato, parfaits & sweet treats',
  },
  {
    id: 'tea_shop',
    label: 'Tea & Matcha',
    icon: 'CupSoda',
    description: 'Matcha lattes, premium loose-leaf tea & boba',
  },
  {
    id: 'restaurant_cafe',
    label: 'Bistro & Cafe',
    icon: 'Utensils',
    description: 'Full food menu, pastas, toasts & cocktails',
  },
];

export const AMENITIES_LIST: { id: Amenity; label: string; icon: string }[] = [
  { id: 'wifi', label: 'Fast Wi-Fi', icon: 'Wifi' },
  { id: 'power_outlets', label: 'Power Outlets', icon: 'Zap' },
  { id: 'outdoor_seating', label: 'Outdoor / Al Fresco', icon: 'Sun' },
  { id: 'study_friendly', label: 'Study / Work Friendly', icon: 'BookOpen' },
  { id: 'pet_friendly', label: 'Pet Friendly', icon: 'Dog' },
  { id: 'air_conditioned', label: 'Air Conditioned', icon: 'Wind' },
  { id: 'parking', label: 'Parking Available', icon: 'Car' },
  { id: 'restrooms', label: 'Clean Restrooms', icon: 'CheckCircle' },
  { id: 'takeout', label: 'Takeout Available', icon: 'ShoppingBag' },
  { id: 'delivery', label: 'Delivery', icon: 'Truck' },
];

export const PRICE_LEVELS: { level: PriceLevel; label: string; symbol: string; description: string }[] = [
  { level: 1, label: 'Budget Friendly', symbol: '₱', description: 'Under ₱150 per drink' },
  { level: 2, label: 'Moderate', symbol: '₱₱', description: '₱150 - ₱280 per drink' },
  { level: 3, label: 'Premium', symbol: '₱₱₱', description: '₱280 - ₱450 per drink' },
  { level: 4, label: 'Luxury / Fine Brew', symbol: '₱₱₱₱', description: '₱450+ per drink' },
];

export const DISTANCE_OPTIONS = [
  { value: 500, label: 'Within 500m' },
  { value: 1000, label: 'Within 1 km' },
  { value: 3000, label: 'Within 3 km' },
  { value: 5000, label: 'Within 5 km' },
  { value: 10000, label: 'Within 10 km' },
  { value: 20000, label: 'Within 20 km' },
];

export const RATING_OPTIONS = [
  { value: 0, label: 'Any Rating' },
  { value: 3.5, label: '3.5+ Stars' },
  { value: 4.0, label: '4.0+ Stars' },
  { value: 4.5, label: '4.5+ Top Rated' },
];

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'distance', label: 'Nearest Distance' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'most_reviewed', label: 'Most Reviewed' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
];

// Default search locations
export const POPULAR_LOCATIONS = [
  { name: 'Lumban, Laguna', lat: 14.2977, lng: 121.4596, tag: 'Scenic & Heritage' },
  { name: 'Pagsanjan, Laguna', lat: 14.2731, lng: 121.4526, tag: 'Riverside Gems' },
  { name: 'Los Baños, Laguna', lat: 14.1706, lng: 121.2425, tag: 'University Vibe' },
  { name: 'Bonifacio Global City (BGC)', lat: 14.5547, lng: 121.0485, tag: 'Modern Specialty' },
  { name: 'Makati City', lat: 14.5547, lng: 121.0244, tag: 'Artisan Hubs' },
  { name: 'Quezon City', lat: 14.6760, lng: 121.0437, tag: 'Hidden Cafes' },
  { name: 'Tagaytay City', lat: 14.1153, lng: 120.9621, tag: 'Overlooking Views' },
  { name: 'Shibuya, Tokyo', lat: 35.6580, lng: 139.7016, tag: 'Pour-Over Masters' },
];

export const DEFAULT_SEARCH_CENTER = {
  lat: 14.2977,
  lng: 121.4596,
  name: 'Lumban, Laguna',
};
