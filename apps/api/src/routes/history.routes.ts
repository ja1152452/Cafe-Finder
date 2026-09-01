import { Router } from 'express';
import { historyController } from '../controllers/history.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { createSearchHistorySchema } from '@cafefinder/shared';

const router = Router();

router.get('/', optionalAuth, historyController.getHistory);
router.post('/', optionalAuth, validateBody(createSearchHistorySchema), historyController.addHistory);
router.delete('/:id', optionalAuth, historyController.deleteHistoryItem);
router.delete('/', optionalAuth, historyController.clearHistory);

export default router;
