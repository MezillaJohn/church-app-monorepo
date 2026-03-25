import { Router } from 'express';
import { ChurchCentresController } from './church-centres.controller';

const router = Router();

// ─── Public ───────────────────────────────────────────────────────────────────
router.get('/', ChurchCentresController.index);

export default router;
