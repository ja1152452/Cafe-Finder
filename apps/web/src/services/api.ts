import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token if present in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cf_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401 expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If unauthorized, clean up token if invalid
      if (error.response.data?.error?.code === 'INVALID_TOKEN') {
        localStorage.removeItem('cf_token');
      }
    }
    return Promise.reject(error);
  }
);
