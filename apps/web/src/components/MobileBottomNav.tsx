import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Heart, User } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites.js';
import { useAuthStore } from '../stores/authStore.js';

export const MobileBottomNav: React.FC = () => {
  const { favorites } = useFavorites();
  const { isAuthenticated } = useAuthStore();

  const navItems = [
    { name: 'Home', path: '/', icon: <Home className="w-5 h-5" /> },
    { name: 'Search', path: '/search', icon: <Search className="w-5 h-5" /> },
    {
      name: 'Favorites',
      path: '/favorites',
      icon: <Heart className="w-5 h-5" />,
      badge: favorites.length > 0 ? favorites.length : undefined,
    },
    {
      name: isAuthenticated ? 'Profile' : 'Sign In',
      path: isAuthenticated ? '/profile' : '/login',
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl border-t border-stone-200 dark:border-stone-800 py-2 px-4 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-amber-600 dark:text-amber-500 font-bold scale-105'
                  : 'text-stone-500 dark:text-stone-400 font-medium hover:text-stone-800 dark:hover:text-stone-200'
              }`
            }
          >
            <div className="relative">
              {item.icon}
              {item.badge !== undefined && (
                <span className="absolute -top-1 -right-2 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-rose-500 text-white shadow-sm">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px]">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};
