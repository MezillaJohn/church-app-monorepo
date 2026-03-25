import { v2 as cloudinary } from 'cloudinary';
import { env } from '../../config/env';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  url: string;
  publicId: string;
  resourceType: string;
}

export async function uploadFile(
  buffer: Buffer,
  folder: string,
  options: { resourceType?: 'image' | 'video' | 'raw' | 'auto'; filename?: string } = {},
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: (options.resourceType ?? 'auto') as 'image' | 'video' | 'raw' | 'auto',
      ...(options.filename && { public_id: options.filename }),
    };

    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error || !result) return reject(error ?? new Error('Upload failed'));
      resolve({
        url: result.secure_url,
        publicId: result.public_id,
        resourceType: result.resource_type,
      });
    });

    stream.end(buffer);
  });
}

export async function deleteFile(publicId: string, resourceType: 'image' | 'video' | 'raw' = 'image'): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}
