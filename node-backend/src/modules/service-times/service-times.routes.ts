import { Router } from 'express';
import { ServiceTimesController } from './service-times.controller';

const router = Router();

router.get('/', ServiceTimesController.index);

export default router;
