import { create } from 'zustand';
import { User, UserPreference } from '@cafefinder/shared';
import { api } from '../services/api.js';

interface AuthState {
  user: User | null;
  preference: UserPreference | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (updatedUser: Partial<User>) => void;
  updatePreferences: (updatedPref: Partial<UserPreference>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  preference: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { user, token } = res.data.data;
    if (token) {
      localStorage.setItem('cf_token', token);
    }
    set({ user, isAuthenticated: true });
    // Fetch profile to also populate preferences
    await get().checkAuth();
  },

  register: async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    const { user, token } = res.data.data;
    if (token) {
      localStorage.setItem('cf_token', token);
    }
    set({ user, isAuthenticated: true });
    await get().checkAuth();
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    }
    localStorage.removeItem('cf_token');
    set({ user: null, preference: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const res = await api.get('/auth/me');
      if (res.data.success && res.data.data) {
        set({
          user: res.data.data.user,
          preference: res.data.data.preference || null,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }
    } catch {
      // not authenticated
    }
    set({ user: null, preference: null, isAuthenticated: false, isLoading: false });
  },

  updateUser: (updatedUser) => {
    const current = get().user;
    if (current) {
      set({ user: { ...current, ...updatedUser } });
    }
  },

  updatePreferences: (updatedPref) => {
    const current = get().preference;
    if (current) {
      set({ preference: { ...current, ...updatedPref } });
    }
  },
}));
