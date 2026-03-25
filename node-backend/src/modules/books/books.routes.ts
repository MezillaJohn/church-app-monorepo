import { Router } from 'express';
import { BooksController } from './books.controller';
import { validate } from '../../shared/middleware/validate.middleware';
import { authenticate, requireVerified } from '../../shared/middleware/auth.middleware';
import { bookQuerySchema, rateBookSchema, idParamSchema } from './books.schema';

const router = Router();

// ─── Public ───────────────────────────────────────────────────────────────────
router.get('/featured', BooksController.featured);

// ─── Authenticated + verified ─────────────────────────────────────────────────
router.use(authenticate, requireVerified);

// Named routes must come before /:id to avoid conflicts
router.get('/my-books', BooksController.myBooks);

router.get('/', validate({ query: bookQuerySchema }), BooksController.index);
router.get('/:id', validate({ params: idParamSchema }), BooksController.show);
router.get('/:id/check-purchase', validate({ params: idParamSchema }), BooksController.checkPurchase);
router.post('/:id/rate', validate({ params: idParamSchema, body: rateBookSchema }), BooksController.rateBook);

export default router;
