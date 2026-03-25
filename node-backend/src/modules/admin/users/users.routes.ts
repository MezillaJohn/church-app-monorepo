import { Router } from 'express';
import { AdminUsersController } from './users.controller';
import { validate } from '../../../shared/middleware/validate.middleware';
import { adminUserQuerySchema, createUserSchema, updateUserSchema, idParamSchema } from './users.schema';

const router = Router();

router.get('/', validate({ query: adminUserQuerySchema }), AdminUsersController.index);
router.post('/', validate({ body: createUserSchema }), AdminUsersController.create);
router.get('/:id', validate({ params: idParamSchema }), AdminUsersController.show);
router.put('/:id', validate({ params: idParamSchema, body: updateUserSchema }), AdminUsersController.update);
router.delete('/:id', validate({ params: idParamSchema }), AdminUsersController.delete);
router.put('/:id/toggle-admin', validate({ params: idParamSchema }), AdminUsersController.toggleAdmin);

export default router;
