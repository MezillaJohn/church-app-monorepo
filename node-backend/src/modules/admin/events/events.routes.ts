import { Router } from 'express';
import { AdminEventsController } from './events.controller';
import { validate } from '../../../shared/middleware/validate.middleware';
import { adminEventQuerySchema, createEventSchema, updateEventSchema, idParamSchema } from './events.schema';

const router = Router();

router.get('/', validate({ query: adminEventQuerySchema }), AdminEventsController.index);
router.post('/', validate({ body: createEventSchema }), AdminEventsController.create);
router.get('/:id', validate({ params: idParamSchema }), AdminEventsController.show);
router.put('/:id', validate({ params: idParamSchema, body: updateEventSchema }), AdminEventsController.update);
router.delete('/:id', validate({ params: idParamSchema }), AdminEventsController.delete);

export default router;
