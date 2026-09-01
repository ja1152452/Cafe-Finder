import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { trackEventSchema } from '@cafefinder/shared';

const router = Router();

// Track event endpoint (public/optionalAuth for telemetry)
router.post('/analytics/track', optionalAuth, validateBody(trackEventSchema), adminController.trackEvent);

// Admin dashboard statistics
router.get('/dashboard', optionalAuth, adminController.getDashboardStats);

export default router;
