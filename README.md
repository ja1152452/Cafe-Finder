# ☕ CafeFinder — Modern Cafe Discovery Platform

> **"Discover your next favorite cafe."**

CafeFinder is a full-featured, commercial-grade cafe discovery platform built with TypeScript, React, Vite, Tailwind CSS, Express, and Prisma. It combines real-time GPS geolocation, interactive Google Maps, Google Places discovery, and intelligent filter algorithms to help coffee enthusiasts find specialty roasters, study-friendly spaces, 24/7 cafes, and hidden local gems.

---

## 🌟 Key Features

* **Real-time Geolocation & Geocoding**: Automatically detect your GPS location with reverse geocoding, distance calculation (Haversine formula), and smooth error fallbacks.
* **Interactive Google Maps**:
  * Custom styled map markers with rating scores and price levels.
  * Synchronized hover and selection between cafe cards and map pins.
  * Floating **"Search this area"** button when panning the map.
  * Interactive canvas fallback when testing without live Google Maps credentials.
* **Precision Smart Filters**:
  * **Distance Radius**: 500m, 1km, 3km, 5km, 10km, 20km.
  * **Ratings**: 4.5+, 4.0+, 3.5+, Any.
  * **Open Status**: Open Now, Open 24 Hours.
  * **Price Levels**: ₱, ₱₱, ₱₱₱, ₱₱₱₱.
  * **Categories**: Specialty Coffee, Modern Cafe, Bakery & Pastry, Dessert Cafe, Tea & Matcha, Bistro & Cafe.
  * **Verified Amenities**: Fast Wi-Fi, Power Outlets, Outdoor Seating, Study-friendly, Pet-friendly, Air-conditioned, Parking.
* **Comprehensive Cafe Details (`/cafe/:placeId`)**:
  * Lightbox photo gallery with fullscreen viewer.
  * Full weekly operating hours with current day highlighting.
  * Verified amenities list with icons.
  * Authentic Google community reviews.
  * 1-click turn-by-turn Google Maps directions.
  * Web Share API & clipboard link copy.
* **Saved Favorites & Collections (`/favorites`)**:
  * One-click animated heart bookmarks.
  * Search, sort, and filter within your saved cafes.
  * Turn-by-turn directions shortcuts.
* **User Authentication & Discovery Preferences**:
  * Secure JWT authentication with HTTP-only cookies and bcrypt password hashing.
  * Instant 1-click demo login buttons (`demo@cafefinder.com` / `admin@cafefinder.com`).
  * Customizable discovery preferences (default search radius, preferred price level, must-have amenities).
  * Recent search history manager with one-click re-search and clearing.
* **Modern Design System & Dark Mode**:
  * Coffee & cream warm roasted color palette, glassmorphism, and responsive cards.
  * Light, Dark, and System theme persistence.
  * Responsive split-view desktop layout and mobile bottom navigation with List/Map toggle.
* **Admin Dashboard & Telemetry (`/admin`)**:
  * Platform analytics, cache hit ratio, top search locations, and top favorited cafes.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, TanStack Query v5, Zustand, React Router v6, Sonner Toast |
| **Backend** | Node.js, Express.js, TypeScript, Prisma ORM, JWT, bcryptjs, Helmet, CORS, Express Rate Limit |
| **Database** | SQLite (Default for zero-config local dev) / PostgreSQL (Supported via `DATABASE_URL` & Docker) |
| **Maps & Places** | Google Maps JavaScript API, Google Places API, Geocoding API, Directions API |
| **Testing** | Vitest, Supertest, React Testing Library |
| **DevOps** | Docker, Docker Compose, npm Workspaces monorepo |

---

## 📁 Monorepo Structure

```text
cafefinder/
├── apps/
│   ├── web/                     # React + Vite Frontend
│   │   ├── src/
│   │   │   ├── components/      # Reusable UI & Map Components
│   │   │   ├── pages/           # Landing, Search, Details, Favorites, Profile, Admin
│   │   │   ├── layouts/         # RootLayout, Navbar, Footer, MobileBottomNav
│   │   │   ├── hooks/           # useGeolocation, useCafeSearch, useFavorites, etc.
│   │   │   ├── stores/          # Zustand stores (authStore, mapStore, filterStore, themeStore)
│   │   │   └── main.tsx
│   │   └── package.json
│   │
│   └── api/                     # Node.js + Express Backend
│       ├── src/
│       │   ├── config/          # Environment configuration
│       │   ├── controllers/     # Auth, Cafe, Favorite, History, User, Admin
│       │   ├── middleware/      # Auth guards, Zod validation, error handler, rate limit
│       │   ├── services/        # GooglePlacesService, MockDataService, CacheService, Analytics
│       │   ├── utils/           # Haversine distance, JWT & bcrypt utilities
│       │   └── server.ts
│       ├── prisma/
│       │   ├── schema.prisma    # Database models
│       │   └── seed.ts          # Demo seed data
│       └── package.json
│
├── packages/
│   └── shared/                  # Shared types, Zod schemas, constants
│
├── docker-compose.yml           # Multi-container Docker deployment
├── .env.example                 # Environment variables guide
└── README.md
```

---

## 🚀 Quickstart Guide

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` into `.env` (or run directly with default SQLite settings):

```bash
cp .env.example .env
```

### 3. Initialize & Seed Database

```bash
# Push database schema
npm run db:push

# Seed demo users and initial cafe favorites
npm run db:seed
```

### 4. Start Development Servers

```bash
# Starts both Backend (Port 4000) and Frontend (Port 5173) concurrently
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🔑 Demo Account Credentials

| Account Role | Email | Password |
| :--- | :--- | :--- |
| **Demo User** | `demo@cafefinder.com` | `password123` |
| **Admin User** | `admin@cafefinder.com` | `admin123` |

*(You can also use the 1-click demo login buttons directly on the `/login` page).*

---

## 🗺️ Google Maps API Setup (Optional)

CafeFinder runs with a **high-fidelity development dataset and interactive canvas map** even without API keys. To connect real-time Google Cloud data:

1. Visit [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project and enable:
   - **Places API (or Places API New)**
   - **Maps JavaScript API**
   - **Geocoding API**
   - **Directions API**
3. Create an API key and add it to your `.env` file:
   ```env
   GOOGLE_MAPS_API_KEY="YOUR_API_KEY_HERE"
   GOOGLE_PLACES_API_KEY="YOUR_API_KEY_HERE"
   VITE_GOOGLE_MAPS_API_KEY="YOUR_API_KEY_HERE"
   ```

---

## 🧪 Running Automated Tests

```bash
# Run backend tests (distance calculations, API search endpoints, auth)
npm run test --workspace=apps/api

# Run frontend tests
npm run test --workspace=apps/web
```

---

## 🐳 Docker Deployment

To spin up the entire production stack (PostgreSQL + API + Web):

```bash
docker compose up -d --build
```

Web client will be available at `http://localhost:5173`.
API server will be available at `http://localhost:4000`.

---

## 📜 License

MIT License. Crafted with ❤️ for coffee lovers everywhere.
