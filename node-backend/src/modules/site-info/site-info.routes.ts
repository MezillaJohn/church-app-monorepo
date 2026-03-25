import { Router } from 'express';
import { SiteInfoController } from './site-info.controller';

const router = Router();

// ─── Public ───────────────────────────────────────────────────────────────────
router.get('/', SiteInfoController.index);

export default router;
