import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { updateProfileSchema, updatePreferencesSchema } from '@cafefinder/shared';

const router = Router();

router.get('/me', requireAuth, userController.getProfile);
router.patch('/me', requireAuth, validateBody(updateProfileSchema), userController.updateProfile);
router.get('/preferences', requireAuth, userController.getProfile);
router.patch('/preferences', requireAuth, validateBody(updatePreferencesSchema), userController.updatePreferences);

export default router;
