import { Router } from 'express';
import { AdminSeriesController } from './series.controller';
import { validate } from '../../../shared/middleware/validate.middleware';
import { adminSeriesQuerySchema, createSeriesSchema, updateSeriesSchema, idParamSchema } from './series.schema';

const router = Router();

router.get('/', validate({ query: adminSeriesQuerySchema }), AdminSeriesController.index);
router.post('/', validate({ body: createSeriesSchema }), AdminSeriesController.create);
router.get('/:id', validate({ params: idParamSchema }), AdminSeriesController.show);
router.put('/:id', validate({ params: idParamSchema, body: updateSeriesSchema }), AdminSeriesController.update);
router.delete('/:id', validate({ params: idParamSchema }), AdminSeriesController.delete);

export default router;
