import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Heart, Sparkles, MapPin, Compass } from 'lucide-react';
import { POPULAR_LOCATIONS } from '@cafefinder/shared';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-100 dark:bg-[#070B11] border-t border-stone-200 dark:border-stone-800/80 pt-12 pb-24 md:pb-12 text-stone-600 dark:text-stone-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="CafeFinder Logo"
                className="w-10 h-10 rounded-full object-cover shadow-sm border border-amber-500/30"
              />
              <span className="font-extrabold text-xl tracking-tight text-stone-900 dark:text-white">
                Cafe<span className="text-amber-600 dark:text-amber-500">Finder</span>
              </span>
            </Link>
            <p className="text-sm max-w-sm text-stone-500 dark:text-stone-400 leading-relaxed">
              "Discover your next favorite cafe." The modern cafe discovery platform powered by real-time location and Google Maps to find coffee shops, specialty roasters, and cozy spots near you.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Real-time Google Places & Maps Discovery</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/search" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  Find Cafes Near Me
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  Saved Favorites
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  Discovery Preferences
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Hubs */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 uppercase tracking-wider">
              Popular Hubs
            </h4>
            <ul className="space-y-2 text-sm">
              {POPULAR_LOCATIONS.slice(0, 4).map((loc) => (
                <li key={loc.name}>
                  <Link
                    to={`/search?q=${encodeURIComponent(loc.name)}&lat=${loc.lat}&lng=${loc.lng}`}
                    className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                    <span>{loc.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-200 dark:border-stone-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 dark:text-stone-400">
          <p>© {new Date().getFullYear()} CafeFinder. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for coffee lovers everywhere.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
