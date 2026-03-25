import multer from 'multer';
import type { Request } from 'express';
import { AppError } from './error.middleware';

const ALLOWED_MIME_TYPES = new Set([
  // Images
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  // Audio
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
  'audio/aac',
  'audio/mp4',
  // Video
  'video/mp4',
  'video/webm',
  'video/ogg',
  // Documents
  'application/pdf',
]);

const MAX_FILE_SIZE_MB = 100;

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 },
  fileFilter: (_req: Request, file, cb) => {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError(`File type "${file.mimetype}" is not supported`, 400));
    }
  },
});
