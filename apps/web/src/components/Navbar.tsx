import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Coffee, Search, Heart, User, ShieldAlert, LogIn, LogOut, Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle.js';
import { useAuthStore } from '../stores/authStore.js';
import { useFavorites } from '../hooks/useFavorites.js';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { favorites } = useFavorites();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Discover', path: '/search' },
    { name: 'Favorites', path: '/favorites', badge: favorites.length > 0 ? favorites.length : undefined },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-stone-200/80 dark:border-stone-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src="/logo.png"
            alt="CafeFinder Logo"
            className="w-10 h-10 rounded-full object-cover shadow-md group-hover:scale-105 transition-transform border border-amber-500/30"
          />
          <div>
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-stone-900 dark:text-stone-50">
              Cafe<span className="text-amber-600 dark:text-amber-500">Finder</span>
            </span>
            <span className="hidden sm:block text-[10px] text-stone-400 font-medium -mt-1">
              Find your perfect brew
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <span>{link.name}</span>
                {link.badge !== undefined && (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {user?.role === 'ADMIN' && (
            <Link
              to="/admin"
              className="px-3.5 py-2 rounded-xl text-sm font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 transition-colors flex items-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          )}
        </nav>

        {/* Right Section Actions */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          {isAuthenticated && user ? (
            <div className="relative flex items-center gap-2">
              <Link
                to="/profile"
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors border border-stone-200 dark:border-stone-700"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0)}
                  </div>
                )}
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200 max-w-[100px] truncate hidden sm:inline">
                  {user.name.split(' ')[0]}
                </span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                title="Log out"
                aria-label="Log out"
                className="p-2 rounded-xl text-stone-500 hover:text-rose-600 dark:text-stone-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-600 hover:bg-amber-700 active:scale-95 text-white shadow-md hover:shadow-lg transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
            aria-label="Open mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl p-4 space-y-2">
          <Link
            to="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 font-semibold text-stone-800 dark:text-stone-200"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-amber-600" />
              <span>Discover Cafes</span>
            </div>
          </Link>

          <Link
            to="/favorites"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 font-semibold text-stone-800 dark:text-stone-200"
          >
            <div className="flex items-center gap-2.5">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Favorites</span>
            </div>
            {favorites.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white">
                {favorites.length}
              </span>
            )}
          </Link>

          {user?.role === 'ADMIN' && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-3 rounded-xl text-purple-600 dark:text-purple-400 font-semibold"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </Link>
          )}

          {isAuthenticated ? (
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-3 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 font-semibold text-stone-800 dark:text-stone-200"
            >
              <User className="w-4 h-4 text-amber-600" />
              <span>My Profile & Settings</span>
            </Link>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-200 dark:border-stone-800">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-center font-semibold rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-sm"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-center font-bold rounded-xl bg-amber-600 text-white text-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
