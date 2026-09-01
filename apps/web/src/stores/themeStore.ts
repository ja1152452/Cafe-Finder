import { create } from 'zustand';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  initTheme: () => void;
}

function applyThemeClass(theme: Theme): boolean {
  const root = document.documentElement;
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === 'system' && systemPrefersDark);

  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  return isDark;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: (localStorage.getItem('cf_theme') as Theme) || 'system',
  isDark: false,
  setTheme: (theme: Theme) => {
    localStorage.setItem('cf_theme', theme);
    const isDark = applyThemeClass(theme);
    set({ theme, isDark });
  },
  initTheme: () => {
    const savedTheme = (localStorage.getItem('cf_theme') as Theme) || 'system';
    const isDark = applyThemeClass(savedTheme);
    set({ theme: savedTheme, isDark });

    // Listen for system changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (get().theme === 'system') {
        const dark = applyThemeClass('system');
        set({ isDark: dark });
      }
    });
  },
}));
