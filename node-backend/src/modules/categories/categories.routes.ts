import { Router } from 'express';
import { CategoriesController } from './categories.controller';
import { validate } from '../../shared/middleware/validate.middleware';
import { categoryQuerySchema } from './categories.schema';

const router = Router();

// GET /categories?type=sermon | ?type=giving | ?type=book | (no type = all)
router.get('/', validate({ query: categoryQuerySchema }), CategoriesController.list);

export default router;
