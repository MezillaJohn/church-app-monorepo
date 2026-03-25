import { Router } from 'express';
import { AdminDonationsController } from './donations.controller';
import { validate } from '../../../shared/middleware/validate.middleware';
import { adminDonationQuerySchema, createDonationSchema, updateDonationSchema, idParamSchema } from './donations.schema';

const router = Router();

router.get('/', validate({ query: adminDonationQuerySchema }), AdminDonationsController.index);
router.post('/', validate({ body: createDonationSchema }), AdminDonationsController.create);
router.get('/:id', validate({ params: idParamSchema }), AdminDonationsController.show);
router.put('/:id', validate({ params: idParamSchema, body: updateDonationSchema }), AdminDonationsController.update);
router.delete('/:id', validate({ params: idParamSchema }), AdminDonationsController.delete);

export default router;
