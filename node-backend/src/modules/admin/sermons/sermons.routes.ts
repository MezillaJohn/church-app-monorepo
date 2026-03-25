import { Router } from 'express';
import { AdminSermonsController } from './sermons.controller';
import { validate } from '../../../shared/middleware/validate.middleware';
import { adminSermonQuerySchema, createSermonSchema, updateSermonSchema, idParamSchema } from './sermons.schema';

const router = Router();

router.get('/', validate({ query: adminSermonQuerySchema }), AdminSermonsController.index);
router.post('/', validate({ body: createSermonSchema }), AdminSermonsController.create);
router.get('/:id', validate({ params: idParamSchema }), AdminSermonsController.show);
router.put('/:id', validate({ params: idParamSchema, body: updateSermonSchema }), AdminSermonsController.update);
router.delete('/:id', validate({ params: idParamSchema }), AdminSermonsController.delete);
router.put('/:id/publish', validate({ params: idParamSchema }), AdminSermonsController.togglePublish);

export default router;
