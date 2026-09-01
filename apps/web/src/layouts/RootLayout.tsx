import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar.js';
import { Footer } from '../components/Footer.js';
import { MobileBottomNav } from '../components/MobileBottomNav.js';
import { useAuthStore } from '../stores/authStore.js';
import { useThemeStore } from '../stores/themeStore.js';

export const RootLayout: React.FC = () => {
  const { checkAuth } = useAuthStore();
  const { initTheme } = useThemeStore();
  const location = useLocation();

  useEffect(() => {
    initTheme();
    checkAuth();
  }, [initTheme, checkAuth]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-coffee-50 dark:bg-[#0B0F17] text-stone-900 dark:text-stone-100 transition-colors">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};
