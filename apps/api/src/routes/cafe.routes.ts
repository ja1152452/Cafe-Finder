import { Router } from 'express';
import { cafeController } from '../controllers/cafe.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/search', optionalAuth, cafeController.search);
router.get('/nearby', optionalAuth, cafeController.search);
router.get('/photo', cafeController.photoProxy);
router.get('/geocode', cafeController.geocode);
router.get('/reverse-geocode', cafeController.reverseGeocode);
router.get('/:placeId', optionalAuth, cafeController.getById);

export default router;
