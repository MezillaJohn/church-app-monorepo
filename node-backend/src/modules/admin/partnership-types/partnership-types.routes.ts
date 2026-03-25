import { Router } from 'express';
import { AdminPartnershipTypesController } from './partnership-types.controller';
import { validate } from '../../../shared/middleware/validate.middleware';
import { adminPartnershipTypeQuerySchema, createPartnershipTypeSchema, updatePartnershipTypeSchema, idParamSchema } from './partnership-types.schema';

const router = Router();

router.get('/', validate({ query: adminPartnershipTypeQuerySchema }), AdminPartnershipTypesController.index);
router.post('/', validate({ body: createPartnershipTypeSchema }), AdminPartnershipTypesController.create);
router.get('/:id', validate({ params: idParamSchema }), AdminPartnershipTypesController.show);
router.put('/:id', validate({ params: idParamSchema, body: updatePartnershipTypeSchema }), AdminPartnershipTypesController.update);
router.delete('/:id', validate({ params: idParamSchema }), AdminPartnershipTypesController.delete);

export default router;
