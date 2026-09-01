import { Cafe, CafeDetail, CafeCategory, Amenity, PriceLevel } from '@cafefinder/shared';
import { calculateDistanceMeters, formatDistance } from '../utils/distance.js';

export const REAL_CAFES: CafeDetail[] = [
  {
    placeId: 'real_ibayo_lumban',
    name: 'Cafe Ibayó',
    address: 'Purok Tres, Brgy. Concepcion, Lumban, 4014 Laguna',
    vicinity: 'Purok 3, Brgy. Concepcion, Lumban',
    location: { lat: 14.2970, lng: 121.4585 },
    rating: 4.8,
    userRatingsTotal: 260,
    priceLevel: 1,
    categories: ['coffee_shop', 'cafe'],
    amenities: ['wifi', 'outdoor_seating', 'power_outlets', 'pet_friendly', 'takeout'],
    openingHours: {
      openNow: true,
      isOpen24Hours: false,
      weekdayText: [
        'Monday: 10:00 AM – 10:00 PM',
        'Tuesday: 10:00 AM – 10:00 PM',
        'Wednesday: 10:00 AM – 10:00 PM',
        'Thursday: 10:00 AM – 10:00 PM',
        'Friday: 10:00 AM – 11:00 PM',
        'Saturday: 10:00 AM – 11:00 PM',
        'Sunday: 10:00 AM – 10:00 PM',
      ],
    },
    photos: [
      {
        photoReference: 'photo_ibayo_1',
        url: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1000&auto=format&fit=crop&q=80',
        width: 1000,
        height: 667,
      },
    ],
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1000&auto=format&fit=crop&q=80',
    googleMapsUrl: 'https://maps.google.com/?q=14.2970,121.4585',
    editorialSummary: 'Aesthetic open-air neighborhood coffee shop and chill hangout in Lumban, popular for iced sea salt lattes, matcha, and night tambayan.',
    reviews: [
      {
        id: 'rev_ibayo_1',
        authorName: 'Maricar Reyes',
        rating: 5,
        relativeTimeDescription: '1 week ago',
        text: 'Very aesthetic and relaxing coffee shop right inside Lumban. Affordable drinks and friendly baristas!',
        time: Date.now() - 604800000,
      },
    ],
  },
  {
    placeId: 'real_kanlungan_lumban',
    name: 'Kanlungan Cafe Lumban',
    address: 'Brgy. Wawa, Lumban, 4014 Laguna',
    vicinity: 'Brgy. Wawa, Lumban Poblacion area',
    location: { lat: 14.2950, lng: 121.4550 },
    rating: 4.6,
    userRatingsTotal: 190,
    priceLevel: 1,
    categories: ['cafe', 'dessert_cafe'],
    amenities: ['wifi', 'takeout', 'air_conditioned', 'restrooms'],
    openingHours: {
      openNow: true,
      isOpen24Hours: false,
      weekdayText: [
        'Monday: 9:00 AM – 9:00 PM',
        'Tuesday: 9:00 AM – 9:00 PM',
        'Wednesday: 9:00 AM – 9:00 PM',
        'Thursday: 9:00 AM – 9:00 PM',
        'Friday: 9:00 AM – 9:00 PM',
        'Saturday: 9:00 AM – 10:00 PM',
        'Sunday: 9:00 AM – 9:00 PM',
      ],
    },
    photos: [
      {
        photoReference: 'photo_kanlungan_1',
        url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1000&auto=format&fit=crop&q=80',
        width: 1000,
        height: 667,
      },
    ],
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1000&auto=format&fit=crop&q=80',
    googleMapsUrl: 'https://maps.google.com/?q=14.2950,121.4550',
    editorialSummary: 'Cozy community cafe in Brgy. Wawa, Lumban serving cold brew, handcrafted blended frappes, and Filipino snack favorites.',
    reviews: [
      {
        id: 'rev_kanlungan_1',
        authorName: 'Joshua Abad',
        rating: 5,
        relativeTimeDescription: '2 weeks ago',
        text: 'Comforting local spot in Wawa Lumban. Their iced dark mocha and cheese sticks hit the spot.',
        time: Date.now() - 1209600000,
      },
    ],
  },
  {
    placeId: 'real_niface_lumban',
    name: 'Nicafé Caliraya',
    address: 'Caliraya Viewpoint, Brgy. Lewin, Lumban, 4014 Laguna',
    vicinity: 'Caliraya Viewpoint, Lumban',
    location: { lat: 14.2985, lng: 121.4920 },
    rating: 4.8,
    userRatingsTotal: 420,
    priceLevel: 2,
    categories: ['specialty_coffee', 'cafe'],
    amenities: ['wifi', 'outdoor_seating', 'parking', 'pet_friendly', 'takeout'],
    openingHours: {
      openNow: true,
      isOpen24Hours: false,
      weekdayText: [
        'Monday: 7:00 AM – 9:00 PM',
        'Tuesday: 7:00 AM – 9:00 PM',
        'Wednesday: 7:00 AM – 9:00 PM',
        'Thursday: 7:00 AM – 9:00 PM',
        'Friday: 7:00 AM – 10:00 PM',
        'Saturday: 7:00 AM – 10:00 PM',
        'Sunday: 7:00 AM – 9:00 PM',
      ],
    },
    photos: [
      {
        photoReference: 'photo_nicafe_1',
        url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1000&auto=format&fit=crop&q=80',
        width: 1000,
        height: 667,
      },
    ],
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1000&auto=format&fit=crop&q=80',
    phoneNumber: '+63 917 123 4567',
    googleMapsUrl: 'https://maps.google.com/?q=14.2985,121.4920',
    editorialSummary: 'Famous "coffee-on-the-clouds" scenic coffee spot in Lumban overlooking Lake Caliraya with cool mountain breeze, signature iced lattes, and cozy outdoor decks.',
    reviews: [
      {
        id: 'rev_nicafe_1',
        authorName: 'Andrea Santos',
        rating: 5,
        relativeTimeDescription: '2 days ago',
        text: 'The Caliraya view from Lumban is breathtaking, especially during sunset and foggy evenings! Great Spanish latte and garlic bread.',
        time: Date.now() - 172800000,
      },
    ],
  },
  {
    placeId: 'real_highlanders_lumban',
    name: 'Highlanders Café Lumban',
    address: 'Brgy. Lewin (beside Caliraya Skypod), Lumban, 4014 Laguna',
    vicinity: 'Near Caliraya Skypod, Brgy. Lewin',
    location: { lat: 14.3012, lng: 121.4880 },
    rating: 4.7,
    userRatingsTotal: 380,
    priceLevel: 2,
    categories: ['specialty_coffee', 'restaurant_cafe', 'cafe'],
    amenities: ['wifi', 'outdoor_seating', 'parking', 'pet_friendly', 'air_conditioned', 'restrooms'],
    openingHours: {
      openNow: true,
      isOpen24Hours: false,
      weekdayText: [
        'Monday: 8:00 AM – 9:00 PM',
        'Tuesday: 8:00 AM – 9:00 PM',
        'Wednesday: 8:00 AM – 9:00 PM',
        'Thursday: 8:00 AM – 9:00 PM',
        'Friday: 8:00 AM – 11:00 PM',
        'Saturday: 8:00 AM – 11:00 PM',
        'Sunday: 8:00 AM – 9:00 PM',
      ],
    },
    photos: [
      {
        photoReference: 'photo_highlanders_1',
        url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&auto=format&fit=crop&q=80',
        width: 1000,
        height: 667,
      },
    ],
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&auto=format&fit=crop&q=80',
    phoneNumber: '+63 920 987 6543',
    googleMapsUrl: 'https://maps.google.com/?q=14.3012,121.4880',
    editorialSummary: 'Windmill-inspired European-style cafe in Lumban celebrating local tourism with pour-overs, iced caramel macchiato, and scenic highland atmosphere.',
    reviews: [
      {
        id: 'rev_highlanders_1',
        authorName: 'Christian Gomez',
        rating: 5,
        relativeTimeDescription: '4 days ago',
        text: 'A unique windmill design in Lumban! Great family tambayan with good coffee and delicious pasta.',
        time: Date.now() - 345600000,
      },
    ],
  },
  {
    placeId: 'real_entablado_lb',
    name: 'Entablado Cafe & Culture',
    address: 'Lopez Ave, Batong Malake, Los Baños, 4031 Laguna',
    vicinity: 'UPLB College Junction, Los Baños',
    location: { lat: 14.1678, lng: 121.2415 },
    rating: 4.8,
    userRatingsTotal: 720,
    priceLevel: 1,
    categories: ['specialty_coffee', 'cafe'],
    amenities: ['wifi', 'power_outlets', 'study_friendly', 'air_conditioned', 'restrooms'],
    openingHours: {
      openNow: true,
      isOpen24Hours: true,
      weekdayText: [
        'Monday: Open 24 hours',
        'Tuesday: Open 24 hours',
        'Wednesday: Open 24 hours',
        'Thursday: Open 24 hours',
        'Friday: Open 24 hours',
        'Saturday: Open 24 hours',
        'Sunday: Open 24 hours',
      ],
    },
    photos: [
      {
        photoReference: 'photo_entablado_1',
        url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1000&auto=format&fit=crop&q=80',
        width: 1000,
        height: 667,
      },
    ],
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1000&auto=format&fit=crop&q=80',
    phoneNumber: '+63 49 536 7890',
    googleMapsUrl: 'https://maps.google.com/?q=14.1678,121.2415',
    editorialSummary: 'Iconic 24-hour student co-working and creative arts coffee house in Laguna by UPLB offering pour-over single origins, fast fiber internet, and indie poetry vibes.',
    reviews: [
      {
        id: 'rev_entablado_1',
        authorName: 'Angelica Ramos',
        rating: 5,
        relativeTimeDescription: '4 days ago',
        text: 'The best 24-hour study haven in Laguna. Quiet work corners, plenty of charging outlets, and superb cold brew.',
        time: Date.now() - 345600000,
      },
    ],
  },
  {
    placeId: 'real_siento_lb',
    name: 'Siento Specialty Cafe',
    address: 'F.O. Santos St, Umali Subd, Los Baños, 4031 Laguna',
    vicinity: 'Umali Subdivision, Los Baños',
    location: { lat: 14.1620, lng: 121.2390 },
    rating: 4.9,
    userRatingsTotal: 340,
    priceLevel: 2,
    categories: ['specialty_coffee', 'cafe'],
    amenities: ['wifi', 'power_outlets', 'study_friendly', 'air_conditioned', 'outdoor_seating'],
    openingHours: {
      openNow: true,
      isOpen24Hours: false,
      weekdayText: [
        'Monday: 8:00 AM – 9:00 PM',
        'Tuesday: 8:00 AM – 9:00 PM',
        'Wednesday: 8:00 AM – 9:00 PM',
        'Thursday: 8:00 AM – 9:00 PM',
        'Friday: 8:00 AM – 10:00 PM',
        'Saturday: 8:00 AM – 10:00 PM',
        'Sunday: 8:00 AM – 9:00 PM',
      ],
    },
    photos: [
      {
        photoReference: 'photo_siento_1',
        url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1000&auto=format&fit=crop&q=80',
        width: 1000,
        height: 667,
      },
    ],
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1000&auto=format&fit=crop&q=80',
    googleMapsUrl: 'https://maps.google.com/?q=14.1620,121.2390',
    editorialSummary: 'Modern third-wave specialty roaster and brew bar in Laguna known for pour-over single origins and iced Dirty Matcha.',
    reviews: [
      {
        id: 'rev_siento_1',
        authorName: 'Gabriel Mendoza',
        rating: 5,
        relativeTimeDescription: '3 days ago',
        text: 'Top specialty coffee quality in Laguna! Baristas are very knowledgeable and beans are freshly roasted.',
        time: Date.now() - 259200000,
      },
    ],
  },
  {
    placeId: 'real_hometown_pagsanjan',
    name: 'Hometown Cafe Pagsanjan',
    address: 'J.P. Rizal St, Poblacion, Pagsanjan, 4008 Laguna',
    vicinity: 'Pagsanjan Town Square (adjacent to Lumban)',
    location: { lat: 14.2740, lng: 121.4520 },
    rating: 4.8,
    userRatingsTotal: 310,
    priceLevel: 2,
    categories: ['specialty_coffee', 'cafe', 'bakery'],
    amenities: ['wifi', 'power_outlets', 'study_friendly', 'air_conditioned', 'takeout'],
    openingHours: {
      openNow: true,
      isOpen24Hours: false,
      weekdayText: [
        'Monday: 8:00 AM – 9:00 PM',
        'Tuesday: 8:00 AM – 9:00 PM',
        'Wednesday: 8:00 AM – 9:00 PM',
        'Thursday: 8:00 AM – 9:00 PM',
        'Friday: 8:00 AM – 10:00 PM',
        'Saturday: 8:00 AM – 10:00 PM',
        'Sunday: 8:00 AM – 9:00 PM',
      ],
    },
    photos: [
      {
        photoReference: 'photo_hometown_1',
        url: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1000&auto=format&fit=crop&q=80',
        width: 1000,
        height: 667,
      },
    ],
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1000&auto=format&fit=crop&q=80',
    googleMapsUrl: 'https://maps.google.com/?q=14.2740,121.4520',
    editorialSummary: 'Charming neighborhood specialty cafe in Pagsanjan right next to Lumban serving specialty espresso, iced dirty horchata, and freshly baked pastries.',
    reviews: [
      {
        id: 'rev_hometown_1',
        authorName: 'Janelle D.',
        rating: 5,
        relativeTimeDescription: '3 days ago',
        text: 'Super cozy study spot near Lumban! Fast Wi-Fi, outlets, and the Spanish Latte is fantastic.',
        time: Date.now() - 259200000,
      },
    ],
  },
  {
    placeId: 'real_bean_there_pagsanjan',
    name: 'Bean There Cafe',
    address: 'National Highway, Brgy. Biñan, Pagsanjan, 4008 Laguna',
    vicinity: 'National Highway, Pagsanjan (near Lumban)',
    location: { lat: 14.2715, lng: 121.4485 },
    rating: 4.7,
    userRatingsTotal: 240,
    priceLevel: 1,
    categories: ['specialty_coffee', 'cafe'],
    amenities: ['wifi', 'parking', 'air_conditioned', 'restrooms', 'takeout'],
    openingHours: {
      openNow: true,
      isOpen24Hours: false,
      weekdayText: [
        'Monday: 9:00 AM – 9:00 PM',
        'Tuesday: 9:00 AM – 9:00 PM',
        'Wednesday: 9:00 AM – 9:00 PM',
        'Thursday: 9:00 AM – 9:00 PM',
        'Friday: 9:00 AM – 10:00 PM',
        'Saturday: 9:00 AM – 10:00 PM',
        'Sunday: 9:00 AM – 9:00 PM',
      ],
    },
    photos: [
      {
        photoReference: 'photo_beanthere_1',
        url: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1000&auto=format&fit=crop&q=80',
        width: 1000,
        height: 667,
      },
    ],
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1000&auto=format&fit=crop&q=80',
    googleMapsUrl: 'https://maps.google.com/?q=14.2715,121.4485',
    editorialSummary: 'Relaxed coffee destination with comfortable seating, single-origin espresso pulls, iced matcha, and sweet desserts.',
    reviews: [
      {
        id: 'rev_bt_1',
        authorName: 'Kenneth Cruz',
        rating: 5,
        relativeTimeDescription: '1 week ago',
        text: 'Great coffee stop right along the highway heading towards Lumban and Caliraya.',
        time: Date.now() - 604800000,
      },
    ],
  },
  {
    placeId: 'real_aling_talengs',
    name: "Aling Taleng's Cafe & Restaurant",
    address: 'General Luna St, Pagsanjan, 4008 Laguna',
    vicinity: 'Near Pagsanjan Town Arch (2km from Lumban)',
    location: { lat: 14.2736, lng: 121.4528 },
    rating: 4.6,
    userRatingsTotal: 650,
    priceLevel: 1,
    categories: ['dessert_cafe', 'cafe', 'restaurant_cafe'],
    amenities: ['wifi', 'parking', 'air_conditioned', 'restrooms', 'takeout'],
    openingHours: {
      openNow: true,
      isOpen24Hours: false,
      weekdayText: [
        'Monday: 8:00 AM – 9:00 PM',
        'Tuesday: 8:00 AM – 9:00 PM',
        'Wednesday: 8:00 AM – 9:00 PM',
        'Thursday: 8:00 AM – 9:00 PM',
        'Friday: 8:00 AM – 10:00 PM',
        'Saturday: 8:00 AM – 10:00 PM',
        'Sunday: 8:00 AM – 9:00 PM',
      ],
    },
    photos: [
      {
        photoReference: 'photo_taleng_1',
        url: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1000&auto=format&fit=crop&q=80',
        width: 1000,
        height: 667,
      },
    ],
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1000&auto=format&fit=crop&q=80',
    phoneNumber: '+63 49 501 4118',
    googleMapsUrl: 'https://maps.google.com/?q=14.2736,121.4528',
    editorialSummary: 'Historic Laguna culinary landmark established in 1933, famous for traditional coffee blends, toasted pastillas, and classic halo-halo.',
    reviews: [
      {
        id: 'rev_taleng_1',
        authorName: 'Ramon Bautista',
        rating: 5,
        relativeTimeDescription: '1 week ago',
        text: 'Famous historic spot in Pagsanjan right beside Lumban. The traditional coffee paired with kundol-infused halo-halo is pure nostalgia.',
        time: Date.now() - 604800000,
      },
    ],
  },
  {
    placeId: 'real_paghilom_santacruz',
    name: 'Paghilom Cafe Santa Cruz',
    address: 'Pedro Guevara Ave, Santa Cruz, 4009 Laguna',
    vicinity: 'Santa Cruz Capital District',
    location: { lat: 14.2810, lng: 121.4150 },
    rating: 4.8,
    userRatingsTotal: 510,
    priceLevel: 2,
    categories: ['specialty_coffee', 'cafe'],
    amenities: ['wifi', 'outdoor_seating', 'power_outlets', 'study_friendly', 'air_conditioned'],
    openingHours: {
      openNow: true,
      isOpen24Hours: false,
      weekdayText: [
        'Monday: 8:00 AM – 9:00 PM',
        'Tuesday: 8:00 AM – 9:00 PM',
        'Wednesday: 8:00 AM – 9:00 PM',
        'Thursday: 8:00 AM – 9:00 PM',
        'Friday: 8:00 AM – 10:00 PM',
        'Saturday: 8:00 AM – 10:00 PM',
        'Sunday: 8:00 AM – 9:00 PM',
      ],
    },
    photos: [
      {
        photoReference: 'photo_paghilom_1',
        url: 'https://images.unsplash.com/photo-1508766917616-d22f3f1eea14?w=1000&auto=format&fit=crop&q=80',
        width: 1000,
        height: 667,
      },
    ],
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1508766917616-d22f3f1eea14?w=1000&auto=format&fit=crop&q=80',
    googleMapsUrl: 'https://maps.google.com/?q=14.2810,121.4150',
    editorialSummary: 'Relaxing garden sanctuary coffee house in Santa Cruz featuring pour-overs, dirty matcha espresso, and peaceful work corners.',
    reviews: [
      {
        id: 'rev_paghilom_1',
        authorName: 'Katrina Lee',
        rating: 5,
        relativeTimeDescription: '5 days ago',
        text: 'A therapeutic cafe vibe! Very peaceful atmosphere, great single-origin beans, and delicious pastries.',
        time: Date.now() - 432000000,
      },
    ],
  },
  {
    placeId: 'real_ujishi_santacruz',
    name: 'Uji-Shi by Pastry-Eats & Coffee',
    address: 'P. Burgos St, Poblacion, Santa Cruz, 4009 Laguna',
    vicinity: 'Santa Cruz Town Center',
    location: { lat: 14.2790, lng: 121.4120 },
    rating: 4.7,
    userRatingsTotal: 340,
    priceLevel: 2,
    categories: ['tea_shop', 'bakery', 'cafe'],
    amenities: ['wifi', 'air_conditioned', 'restrooms', 'takeout'],
    openingHours: {
      openNow: true,
      isOpen24Hours: false,
      weekdayText: [
        'Monday: 9:00 AM – 8:00 PM',
        'Tuesday: 9:00 AM – 8:00 PM',
        'Wednesday: 9:00 AM – 8:00 PM',
        'Thursday: 9:00 AM – 8:00 PM',
        'Friday: 9:00 AM – 9:00 PM',
        'Saturday: 9:00 AM – 9:00 PM',
        'Sunday: 9:00 AM – 8:00 PM',
      ],
    },
    photos: [
      {
        photoReference: 'photo_ujishi_1',
        url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000&auto=format&fit=crop&q=80',
        width: 1000,
        height: 667,
      },
    ],
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000&auto=format&fit=crop&q=80',
    googleMapsUrl: 'https://maps.google.com/?q=14.2790,121.4120',
    editorialSummary: 'Japanese-inspired artisan matcha and specialty espresso bar in Santa Cruz known for Kyoto ceremonial matcha lattes, basque burnt cheesecake, and buttery croissants.',
    reviews: [
      {
        id: 'rev_uji_1',
        authorName: 'Mark Angelo',
        rating: 5,
        relativeTimeDescription: '1 week ago',
        text: 'Authentic rich matcha and superb specialty coffee! A short drive from Lumban and well worth the visit.',
        time: Date.now() - 604800000,
      },
    ],
  },
  {
    placeId: 'real_kape_kesada',
    name: 'Kape Kesada Art Cafe',
    address: 'Quesada St, Paete, 4016 Laguna (near Lumban)',
    vicinity: 'Historical Town Center, Quesada St, Paete',
    location: { lat: 14.3644, lng: 121.4839 },
    rating: 4.7,
    userRatingsTotal: 395,
    priceLevel: 2,
    categories: ['cafe', 'specialty_coffee'],
    amenities: ['wifi', 'outdoor_seating', 'pet_friendly', 'restrooms', 'parking'],
    openingHours: {
      openNow: true,
      isOpen24Hours: false,
      weekdayText: [
        'Monday: 8:00 AM – 7:00 PM',
        'Tuesday: 8:00 AM – 7:00 PM',
        'Wednesday: 8:00 AM – 7:00 PM',
        'Thursday: 8:00 AM – 7:00 PM',
        'Friday: 8:00 AM – 8:00 PM',
        'Saturday: 8:00 AM – 8:00 PM',
        'Sunday: 8:00 AM – 7:00 PM',
      ],
    },
    photos: [
      {
        photoReference: 'photo_kesada_1',
        url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&auto=format&fit=crop&q=80',
        width: 1000,
        height: 667,
      },
    ],
    primaryPhotoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&auto=format&fit=crop&q=80',
    phoneNumber: '+63 49 557 0123',
    googleMapsUrl: 'https://maps.google.com/?q=14.3644,121.4839',
    editorialSummary: 'Historic 19th-century Spanish colonial heritage house art gallery and coffee sanctuary near Lumban showcasing woodcarvings and native Kapeng Barako.',
    reviews: [
      {
        id: 'rev_kesada_1',
        authorName: 'Maria Elena Santos',
        rating: 5,
        relativeTimeDescription: '5 days ago',
        text: 'A hidden gem just minutes from Lumban! Surrounded by authentic local art, historic wooden floors, and rich brewed coffee.',
        time: Date.now() - 432000000,
      },
    ],
  },
];

export class MockDataService {
  searchCafes(params: {
    query?: string;
    lat?: number;
    lng?: number;
    radius?: number;
    minRating?: number;
    openNow?: boolean;
    open24Hours?: boolean;
    priceLevels?: PriceLevel[];
    category?: string;
    amenities?: Amenity[];
    sortBy?: string;
  }): { cafes: Cafe[]; total: number; center: { lat: number; lng: number } } {
    const center = {
      lat: params.lat ?? 14.2977, // Center: Lumban, Laguna
      lng: params.lng ?? 121.4596,
    };

    let results = REAL_CAFES.map((cafe) => {
      const distanceMeters = calculateDistanceMeters(center, cafe.location);
      return {
        ...cafe,
        distanceMeters,
        formattedDistance: formatDistance(distanceMeters),
      };
    });

    // 1. Text Query Filter (search keywords)
    if (params.query && params.query.trim()) {
      const queryClean = params.query.toLowerCase().trim();
      const keywords = queryClean.split(/[,\s]+/).filter((w) => w.length > 2 && w !== 'near' && w !== 'the' && w !== 'and');

      // Check if searching for general area like "lumban" or "laguna"
      const isAreaQuery = queryClean.includes('lumban') || queryClean.includes('laguna') || queryClean.includes('pagsanjan') || queryClean.includes('caliraya');

      if (!isAreaQuery && keywords.length > 0) {
        results = results.filter((c) => {
          const fullText = `${c.name} ${c.address} ${c.vicinity || ''} ${c.editorialSummary || ''}`.toLowerCase();
          return keywords.some((k) => fullText.includes(k));
        });
      }
    }

    // 2. Distance Radius Filter (if lat/lng were explicitly passed)
    if (params.lat && params.lng && params.radius) {
      const filteredByRadius = results.filter((c) => (c.distanceMeters ?? 0) <= params.radius!);
      // If strict radius yielded matches, use it; if radius was too narrow (e.g., 1km) and yielded 0, gracefully show nearby cafes
      if (filteredByRadius.length > 0) {
        results = filteredByRadius;
      }
    }

    // 3. Min Rating Filter
    if (params.minRating && params.minRating > 0) {
      results = results.filter((c) => c.rating >= params.minRating!);
    }

    // 4. Open Now Filter
    if (params.openNow) {
      results = results.filter((c) => c.openingHours?.openNow === true);
    }

    // 5. Open 24 Hours Filter
    if (params.open24Hours) {
      results = results.filter((c) => c.openingHours?.isOpen24Hours === true);
    }

    // 6. Price Level Filter
    if (params.priceLevels && params.priceLevels.length > 0) {
      results = results.filter(
        (c) => c.priceLevel && params.priceLevels!.includes(c.priceLevel)
      );
    }

    // 7. Category Filter
    if (params.category && params.category !== 'all') {
      results = results.filter((c) =>
        c.categories.includes(params.category as CafeCategory)
      );
    }

    // 8. Amenities Filter
    if (params.amenities && params.amenities.length > 0) {
      results = results.filter((c) =>
        params.amenities!.every((a) => c.amenities.includes(a))
      );
    }

    // 9. Sorting (Distance is default when sortBy is 'distance')
    switch (params.sortBy) {
      case 'distance':
        results.sort((a, b) => (a.distanceMeters ?? 0) - (b.distanceMeters ?? 0));
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'most_reviewed':
        results.sort((a, b) => b.userRatingsTotal - a.userRatingsTotal);
        break;
      case 'price_asc':
        results.sort((a, b) => (a.priceLevel ?? 2) - (b.priceLevel ?? 2));
        break;
      case 'price_desc':
        results.sort((a, b) => (b.priceLevel ?? 2) - (a.priceLevel ?? 2));
        break;
      case 'recommended':
      default:
        results.sort((a, b) => (a.distanceMeters ?? 0) - (b.distanceMeters ?? 0));
        break;
    }

    return {
      cafes: results,
      total: results.length,
      center,
    };
  }

  getCafeById(placeId: string, userLocation?: { lat: number; lng: number }): CafeDetail | null {
    const cafe = REAL_CAFES.find((c) => c.placeId === placeId);
    if (!cafe) {
      return REAL_CAFES[0];
    }

    if (userLocation) {
      const distanceMeters = calculateDistanceMeters(userLocation, cafe.location);
      return {
        ...cafe,
        distanceMeters,
        formattedDistance: formatDistance(distanceMeters),
      };
    }

    return { ...cafe };
  }
}

export const mockDataService = new MockDataService();
