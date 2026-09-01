import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  Settings,
  History,
  Heart,
  Search,
  Trash2,
  Save,
  Check,
  RotateCcw,
  Sliders,
  Bell,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore.js';
import { useFavorites } from '../hooks/useFavorites.js';
import { useSearchHistory } from '../hooks/useSearchHistory.js';
import { useThemeStore } from '../stores/themeStore.js';
import { api } from '../services/api.js';
import { toast } from 'sonner';
import {
  DISTANCE_OPTIONS,
  PRICE_LEVELS,
  AMENITIES_LIST,
  Amenity,
  PriceLevel,
} from '@cafefinder/shared';

export const ProfilePage: React.FC = () => {
  const { user, preference, updateUser, updatePreferences } = useAuthStore();
  const { favorites } = useFavorites();
  const { history, deleteHistory, clearHistory } = useSearchHistory();
  const { theme, setTheme } = useThemeStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'preferences'>('profile');

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Preference states
  const [prefRadius, setPrefRadius] = useState<number>(preference?.radius || 5000);
  const [prefPrice, setPrefPrice] = useState<number | null>(preference?.preferredPrice || null);
  const [notifications, setNotifications] = useState<boolean>(preference?.notificationsEnabled ?? true);
  const [prefAmenities, setPrefAmenities] = useState<Amenity[]>(preference?.favoriteAmenities || []);
  const [savingPrefs, setSavingPrefs] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await api.patch('/users/me', { name, avatarUrl });
      updateUser(res.data.data);
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePreferences = async () => {
    try {
      setSavingPrefs(true);
      const res = await api.patch('/users/preferences', {
        radius: prefRadius,
        preferredPrice: prefPrice,
        theme,
        notificationsEnabled: notifications,
        favoriteAmenities: prefAmenities,
      });
      updatePreferences(res.data.data);
      toast.success('Preferences saved successfully!');
    } catch {
      toast.error('Failed to save preferences.');
    } finally {
      setSavingPrefs(false);
    }
  };

  const toggleAmenity = (id: Amenity) => {
    if (prefAmenities.includes(id)) {
      setPrefAmenities(prefAmenities.filter((a) => a !== id));
    } else {
      setPrefAmenities([...prefAmenities, id]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Header / User Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-amber-500/20 shadow-md"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center font-black text-3xl shadow-md">
            {user?.name?.charAt(0) || 'U'}
          </div>
        )}

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
              {user?.name || 'Coffee Explorer'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 self-center sm:self-auto">
              {user?.role || 'MEMBER'}
            </span>
          </div>

          <p className="text-sm text-stone-500 dark:text-stone-400">{user?.email}</p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 pt-2 text-xs font-semibold text-stone-600 dark:text-stone-300">
            <div className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>{favorites.length} Saved Cafes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <History className="w-4 h-4 text-amber-600" />
              <span>{history.length} Searches Tracked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-stone-100 dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700 max-w-md">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'profile'
              ? 'bg-white dark:bg-stone-900 text-amber-600 dark:text-amber-400 shadow-sm'
              : 'text-stone-600 dark:text-stone-400'
          }`}
        >
          Profile
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('preferences')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'preferences'
              ? 'bg-white dark:bg-stone-900 text-amber-600 dark:text-amber-400 shadow-sm'
              : 'text-stone-600 dark:text-stone-400'
          }`}
        >
          Preferences
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'history'
              ? 'bg-white dark:bg-stone-900 text-amber-600 dark:text-amber-400 shadow-sm'
              : 'text-stone-600 dark:text-stone-400'
          }`}
        >
          Search History
        </button>
      </div>

      {/* Tab 1: Profile Information */}
      {activeTab === 'profile' && (
        <form
          onSubmit={handleSaveProfile}
          className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-6"
        >
          <div className="space-y-1">
            <h2 className="font-bold text-lg text-stone-900 dark:text-white">Profile Details</h2>
            <p className="text-xs text-stone-500">Update your personal account information.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 text-sm text-stone-500 cursor-not-allowed"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                Avatar Image URL
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{savingProfile ? 'Saving Changes...' : 'Save Profile'}</span>
          </button>
        </form>
      )}

      {/* Tab 2: Discovery Preferences */}
      {activeTab === 'preferences' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-8">
          <div className="space-y-1">
            <h2 className="font-bold text-lg text-stone-900 dark:text-white">Discovery Preferences</h2>
            <p className="text-xs text-stone-500">Configure default filters and favorite amenities.</p>
          </div>

          {/* Default Search Radius */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Default Search Radius
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {DISTANCE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPrefRadius(opt.value)}
                  className={`py-2 rounded-xl text-xs font-semibold transition-all text-center ${
                    prefRadius === opt.value
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Price Level */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Preferred Price Tier
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRICE_LEVELS.map((p) => (
                <button
                  key={p.level}
                  type="button"
                  onClick={() => setPrefPrice(prefPrice === p.level ? null : p.level)}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all text-center ${
                    prefPrice === p.level
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {p.symbol} ({p.label})
                </button>
              ))}
            </div>
          </div>

          {/* Theme Preference */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Theme Mode
            </label>
            <div className="grid grid-cols-3 gap-2 max-w-sm">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold ${
                  theme === 'light'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold ${
                  theme === 'dark'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Dark</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold ${
                  theme === 'system'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                <Laptop className="w-4 h-4" />
                <span>System</span>
              </button>
            </div>
          </div>

          {/* Favorite Amenities */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Must-Have Amenities
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AMENITIES_LIST.map((am) => {
                const isSelected = prefAmenities.includes(am.id);
                return (
                  <button
                    key={am.id}
                    type="button"
                    onClick={() => toggleAmenity(am.id)}
                    className={`p-3 rounded-xl text-xs font-semibold text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <span>{am.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSavePreferences}
            disabled={savingPrefs}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{savingPrefs ? 'Saving...' : 'Save Discovery Preferences'}</span>
          </button>
        </div>
      )}

      {/* Tab 3: Search History Manager */}
      {activeTab === 'history' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg text-stone-900 dark:text-white">Recent Searches</h2>
              <p className="text-xs text-stone-500">Revisit past searches or clear your history.</p>
            </div>
            {history.length > 0 && (
              <button
                type="button"
                onClick={() => clearHistory()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="p-8 text-center text-stone-500 text-sm">
              No recent search history recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-stone-100 dark:divide-stone-800">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="py-3.5 flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-500">
                      <Search className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-stone-800 dark:text-stone-200">
                        {item.query}
                      </p>
                      <span className="text-xs text-stone-400">
                        {new Date(item.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/search?q=${encodeURIComponent(item.query)}${
                            item.latitude && item.longitude
                              ? `&lat=${item.latitude}&lng=${item.longitude}`
                              : ''
                          }`
                        )
                      }
                      className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold transition-colors"
                    >
                      Search Again
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteHistory(item.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
