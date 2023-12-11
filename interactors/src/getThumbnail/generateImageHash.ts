import crypto from 'crypto';
import { ImageHash } from 'entities/src/Images';

// Utility function to generate a hash for an image
export const generateImageHash = (
  imageBuffer: Buffer,
): ImageHash => {
  return crypto
    .createHash('sha256')
    .update(imageBuffer)
    .digest('hex');
};
