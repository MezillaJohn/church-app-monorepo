import { Router } from 'express';
import { AdminServiceTimesController } from './service-times.controller';
import { validate } from '../../../shared/middleware/validate.middleware';
import { adminServiceTimeQuerySchema, createServiceTimeSchema, updateServiceTimeSchema, idParamSchema } from './service-times.schema';

const router = Router();

router.get('/', validate({ query: adminServiceTimeQuerySchema }), AdminServiceTimesController.index);
router.post('/', validate({ body: createServiceTimeSchema }), AdminServiceTimesController.create);
router.get('/:id', validate({ params: idParamSchema }), AdminServiceTimesController.show);
router.put('/:id', validate({ params: idParamSchema, body: updateServiceTimeSchema }), AdminServiceTimesController.update);
router.delete('/:id', validate({ params: idParamSchema }), AdminServiceTimesController.delete);

export default router;
