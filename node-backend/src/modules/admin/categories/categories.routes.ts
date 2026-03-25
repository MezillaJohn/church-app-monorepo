import { Router } from 'express';
import { AdminCategoriesController } from './categories.controller';
import { validate } from '../../../shared/middleware/validate.middleware';
import { adminCategoryQuerySchema, createCategorySchema, updateCategorySchema, idParamSchema } from './categories.schema';

const router = Router();

router.get('/', validate({ query: adminCategoryQuerySchema }), AdminCategoriesController.index);
router.post('/', validate({ body: createCategorySchema }), AdminCategoriesController.create);
router.get('/:id', validate({ params: idParamSchema }), AdminCategoriesController.show);
router.put('/:id', validate({ params: idParamSchema, body: updateCategorySchema }), AdminCategoriesController.update);
router.delete('/:id', validate({ params: idParamSchema }), AdminCategoriesController.delete);

export default router;
