import { Router } from 'express';
import { AdminChurchCentresController } from './church-centres.controller';
import { validate } from '../../../shared/middleware/validate.middleware';
import { adminChurchCentreQuerySchema, createChurchCentreSchema, updateChurchCentreSchema, idParamSchema } from './church-centres.schema';

const router = Router();

router.get('/', validate({ query: adminChurchCentreQuerySchema }), AdminChurchCentresController.index);
router.post('/', validate({ body: createChurchCentreSchema }), AdminChurchCentresController.create);
router.get('/:id', validate({ params: idParamSchema }), AdminChurchCentresController.show);
router.put('/:id', validate({ params: idParamSchema, body: updateChurchCentreSchema }), AdminChurchCentresController.update);
router.delete('/:id', validate({ params: idParamSchema }), AdminChurchCentresController.delete);

export default router;
