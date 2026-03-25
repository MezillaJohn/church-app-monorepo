import { Router } from 'express';
import { AdminHeroSlidersController } from './hero-sliders.controller';
import { validate } from '../../../shared/middleware/validate.middleware';
import { adminHeroSliderQuerySchema, createHeroSliderSchema, updateHeroSliderSchema, idParamSchema } from './hero-sliders.schema';

const router = Router();

router.get('/', validate({ query: adminHeroSliderQuerySchema }), AdminHeroSlidersController.index);
router.post('/', validate({ body: createHeroSliderSchema }), AdminHeroSlidersController.create);
router.get('/:id', validate({ params: idParamSchema }), AdminHeroSlidersController.show);
router.put('/:id', validate({ params: idParamSchema, body: updateHeroSliderSchema }), AdminHeroSlidersController.update);
router.delete('/:id', validate({ params: idParamSchema }), AdminHeroSlidersController.delete);

export default router;
