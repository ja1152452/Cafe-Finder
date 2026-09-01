import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Coffee, Mail, Lock, ArrowRight, Sparkles, UserCheck } from 'lucide-react';
import { useAuthStore } from '../stores/authStore.js';
import { toast } from 'sonner';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(email, password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    try {
      setLoading(true);
      await login(demoEmail, demoPass);
      toast.success(`Logged in as ${demoEmail}!`);
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error('Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex justify-center">
            <img
              src="/logo.png"
              alt="CafeFinder Logo"
              className="w-16 h-16 rounded-full object-cover shadow-lg border border-amber-500/30"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
            Welcome back
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Sign in to access your saved favorites and preferences.
          </p>
        </div>

        {/* Quick 1-Click Demo Logins */}
        <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/20 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Demo Logins</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('demo@cafefinder.com', 'password123')}
              className="py-1.5 px-3 rounded-xl bg-white dark:bg-stone-800 hover:bg-amber-600 hover:text-white dark:hover:bg-amber-600 text-xs font-semibold text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 shadow-sm transition-all text-center"
            >
              Demo User
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@cafefinder.com', 'admin123')}
              className="py-1.5 px-3 rounded-xl bg-white dark:bg-stone-800 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 text-xs font-semibold text-purple-700 dark:text-purple-300 border border-stone-200 dark:border-stone-700 shadow-sm transition-all text-center"
            >
              Admin User
            </button>
          </div>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-card space-y-4"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-amber-600 hover:text-amber-700 font-semibold"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-stone-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-amber-600 hover:text-amber-700">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};
