import { Router } from 'express';
import { AdminPartnershipsController } from './partnerships.controller';
import { validate } from '../../../shared/middleware/validate.middleware';
import { adminPartnershipQuerySchema, createPartnershipSchema, updatePartnershipSchema, idParamSchema } from './partnerships.schema';

const router = Router();

router.get('/', validate({ query: adminPartnershipQuerySchema }), AdminPartnershipsController.index);
router.post('/', validate({ body: createPartnershipSchema }), AdminPartnershipsController.create);
router.get('/:id', validate({ params: idParamSchema }), AdminPartnershipsController.show);
router.put('/:id', validate({ params: idParamSchema, body: updatePartnershipSchema }), AdminPartnershipsController.update);
router.delete('/:id', validate({ params: idParamSchema }), AdminPartnershipsController.delete);

export default router;
