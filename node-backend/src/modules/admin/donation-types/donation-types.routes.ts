import { Router } from 'express';
import { AdminDonationTypesController } from './donation-types.controller';
import { validate } from '../../../shared/middleware/validate.middleware';
import { adminDonationTypeQuerySchema, createDonationTypeSchema, updateDonationTypeSchema, idParamSchema } from './donation-types.schema';

const router = Router();

router.get('/', validate({ query: adminDonationTypeQuerySchema }), AdminDonationTypesController.index);
router.post('/', validate({ body: createDonationTypeSchema }), AdminDonationTypesController.create);
router.get('/:id', validate({ params: idParamSchema }), AdminDonationTypesController.show);
router.put('/:id', validate({ params: idParamSchema, body: updateDonationTypeSchema }), AdminDonationTypesController.update);
router.delete('/:id', validate({ params: idParamSchema }), AdminDonationTypesController.delete);

export default router;
