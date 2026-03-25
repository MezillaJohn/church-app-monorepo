import { Router } from 'express';
import { HeroSlidersController } from './hero-sliders.controller';

const router = Router();

// ─── Public ───────────────────────────────────────────────────────────────────
router.get('/', HeroSlidersController.index);

export default router;
