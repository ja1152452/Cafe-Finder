import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { config } from './config/index.js';
import { errorHandler } from './middleware/error.middleware.js';

import authRoutes from './routes/auth.routes.js';
import cafeRoutes from './routes/cafe.routes.js';
import favoriteRoutes from './routes/favorite.routes.js';
import historyRoutes from './routes/history.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';

export const app = express();

// Security Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow local development ports and same-origin
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

if (config.env !== 'test') {
  app.use(morgan('dev'));
}

// Rate Limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: {
    success: false,
    error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests. Please try again later.' },
  },
});

app.use('/api', generalLimiter);

// Health Check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'CafeFinder API',
    hasGoogleApiKey: Boolean(config.googlePlacesApiKey),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cafes', cafeRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/search-history', historyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Centralized Error Handling
app.use(errorHandler);

// Only listen if run directly (not imported by tests)
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    console.log(`☕ CafeFinder API server running on port ${config.port} (${config.env})`);
  });
}
