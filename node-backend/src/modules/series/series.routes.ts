import { Router } from 'express';
import { SeriesController } from './series.controller';
import { validate } from '../../shared/middleware/validate.middleware';
import { seriesQuerySchema, idParamSchema } from './series.schema';

const router = Router();

// ─── Public ───────────────────────────────────────────────────────────────────
router.get('/', validate({ query: seriesQuerySchema }), SeriesController.index);
router.get('/:id', validate({ params: idParamSchema }), SeriesController.show);

export default router;
