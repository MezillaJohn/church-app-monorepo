import { Router } from 'express';
import { AdminSettingsController } from './settings.controller';
import { validate } from '../../../shared/middleware/validate.middleware';
import { groupQuerySchema, upsertSettingSchema, batchUpsertSettingsSchema, keyParamSchema } from './settings.schema';

const router = Router();

router.get('/', validate({ query: groupQuerySchema }), AdminSettingsController.index);
router.put('/', validate({ body: upsertSettingSchema }), AdminSettingsController.upsert);
router.post('/batch', validate({ body: batchUpsertSettingsSchema }), AdminSettingsController.batchUpsert);
router.delete('/:key', validate({ params: keyParamSchema }), AdminSettingsController.delete);

export default router;
