import { Router } from 'express';
import { favoriteController } from '../controllers/favorite.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { createFavoriteSchema } from '@cafefinder/shared';

const router = Router();

router.get('/', requireAuth, favoriteController.getFavorites);
router.post('/', requireAuth, validateBody(createFavoriteSchema), favoriteController.addFavorite);
router.delete('/:placeId', requireAuth, favoriteController.removeFavorite);

export default router;
