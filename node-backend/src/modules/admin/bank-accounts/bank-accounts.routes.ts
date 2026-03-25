import { Router } from 'express';
import { AdminBankAccountsController } from './bank-accounts.controller';
import { validate } from '../../../shared/middleware/validate.middleware';
import { adminBankAccountQuerySchema, createBankAccountSchema, updateBankAccountSchema, idParamSchema } from './bank-accounts.schema';

const router = Router();

router.get('/', validate({ query: adminBankAccountQuerySchema }), AdminBankAccountsController.index);
router.post('/', validate({ body: createBankAccountSchema }), AdminBankAccountsController.create);
router.get('/:id', validate({ params: idParamSchema }), AdminBankAccountsController.show);
router.put('/:id', validate({ params: idParamSchema, body: updateBankAccountSchema }), AdminBankAccountsController.update);
router.delete('/:id', validate({ params: idParamSchema }), AdminBankAccountsController.delete);

export default router;
