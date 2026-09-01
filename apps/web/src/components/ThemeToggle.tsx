import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore.js';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className={`inline-flex items-center p-1 bg-stone-100 dark:bg-stone-800 rounded-full border border-stone-200 dark:border-stone-700 ${className}`}>
      <button
        onClick={() => setTheme('light')}
        title="Light Mode"
        className={`p-1.5 rounded-full transition-all ${
          theme === 'light'
            ? 'bg-white dark:bg-stone-700 text-amber-600 shadow-sm'
            : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
        }`}
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        title="Dark Mode"
        className={`p-1.5 rounded-full transition-all ${
          theme === 'dark'
            ? 'bg-stone-900 text-amber-400 shadow-sm'
            : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
        }`}
      >
        <Moon className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('system')}
        title="System Preference"
        className={`p-1.5 rounded-full transition-all ${
          theme === 'system'
            ? 'bg-white dark:bg-stone-700 text-amber-600 dark:text-amber-400 shadow-sm'
            : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
        }`}
      >
        <Laptop className="w-4 h-4" />
      </button>
    </div>
  );
};
