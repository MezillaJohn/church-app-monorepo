import { Router } from 'express';
import { SermonsController } from './sermons.controller';
import { validate } from '../../shared/middleware/validate.middleware';
import { authenticate, requireVerified } from '../../shared/middleware/auth.middleware';
import { sermonQuerySchema, updateProgressSchema, idParamSchema } from './sermons.schema';

const router = Router();

// ─── Protected (auth + verified) ─────────────────────────────────────────────
router.use(authenticate, requireVerified);

// Must come before /:id to avoid route conflicts
router.get('/featured', SermonsController.featured);
router.get('/favorites', SermonsController.favorites);
router.get('/watch-later', SermonsController.watchLater);

router.get('/', validate({ query: sermonQuerySchema }), SermonsController.index);
router.get('/:id', validate({ params: idParamSchema }), SermonsController.show);

router.post('/:id/favorite', validate({ params: idParamSchema }), SermonsController.toggleFavorite);
router.post('/:id/watch-later', validate({ params: idParamSchema }), SermonsController.toggleWatchLater);
router.post('/:id/progress', validate({ params: idParamSchema, body: updateProgressSchema }), SermonsController.updateProgress);
router.get('/:id/progress', validate({ params: idParamSchema }), SermonsController.getProgress);

export default router;
