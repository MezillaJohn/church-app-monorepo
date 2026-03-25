import { Router } from 'express';
import { AdminUploadsController } from './uploads.controller';
import { upload } from '../../../shared/middleware/upload.middleware';

const router = Router();

router.post('/', upload.single('file'), AdminUploadsController.upload);
router.delete('/', AdminUploadsController.delete);

export default router;
