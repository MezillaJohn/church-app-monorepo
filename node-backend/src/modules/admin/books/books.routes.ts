import { Router } from 'express';
import { AdminBooksController } from './books.controller';
import { validate } from '../../../shared/middleware/validate.middleware';
import { adminBookQuerySchema, createBookSchema, updateBookSchema, idParamSchema } from './books.schema';

const router = Router();

router.get('/', validate({ query: adminBookQuerySchema }), AdminBooksController.index);
router.post('/', validate({ body: createBookSchema }), AdminBooksController.create);
router.get('/:id', validate({ params: idParamSchema }), AdminBooksController.show);
router.put('/:id', validate({ params: idParamSchema, body: updateBookSchema }), AdminBooksController.update);
router.delete('/:id', validate({ params: idParamSchema }), AdminBooksController.delete);
router.put('/:id/publish', validate({ params: idParamSchema }), AdminBooksController.togglePublish);

export default router;
