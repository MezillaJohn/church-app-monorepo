import type { Request, Response } from 'express';
import { uploadFile, deleteFile } from '../../../shared/utils/cloudinary';
import { ApiResponse } from '../../../shared/utils/api-response';
import { catchAsync } from '../../../shared/utils/catch-async';
import { AppError } from '../../../shared/middleware/error.middleware';

const FOLDER_MAP: Record<string, string> = {
  image: 'church-app/images',
  audio: 'church-app/audio',
  video: 'church-app/video',
  document: 'church-app/documents',
};

function inferFolder(mimetype: string): string {
  if (mimetype.startsWith('image/')) return FOLDER_MAP['image']!;
  if (mimetype.startsWith('audio/')) return FOLDER_MAP['audio']!;
  if (mimetype.startsWith('video/')) return FOLDER_MAP['video']!;
  return FOLDER_MAP['document']!;
}

function inferResourceType(mimetype: string): 'image' | 'video' | 'raw' | 'auto' {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype.startsWith('audio/')) return 'video'; // Cloudinary uses 'video' for audio
  return 'raw';
}

export const AdminUploadsController = {
  upload: catchAsync(async (req: Request, res: Response) => {
    if (!req.file) throw new AppError('No file provided', 400);

    const folder = (req.query['folder'] as string | undefined) ?? inferFolder(req.file.mimetype);
    const resourceType = inferResourceType(req.file.mimetype);

    const result = await uploadFile(req.file.buffer, folder, { resourceType });
    ApiResponse.created(res, result, 'File uploaded successfully');
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    const { publicId, resourceType } = req.body as { publicId: string; resourceType?: 'image' | 'video' | 'raw' };

    if (!publicId) throw new AppError('publicId is required', 400);

    await deleteFile(publicId, resourceType ?? 'image');
    ApiResponse.noContent(res);
  }),
};
