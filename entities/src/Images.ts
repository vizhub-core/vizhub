import { ImageKey } from 'screenshotgenie';
import { CommitId } from './RevisionHistory';
import { Timestamp } from './common';

// TODO delete this
export type Image = {
  buffer: Buffer;
};

// TODO delete this
export const imageFromBase64 = (base64: string): Image => {
  const buffer = Buffer.from(base64, 'base64');
  return { buffer };
};

// TODO delete this
export type ImageId = string;

// TODO delete this
export const generateImageId = (
  commitId: CommitId,
  width: number,
): ImageId => `${commitId}-${width}`;

// TODO delete this
export type ImageHash = string;

// TODO delete this
export interface ImageMetadata {
  id: ImageId;
  commitId: CommitId;
  width?: number;
  status: 'generating' | 'generated';
  lastAccessed: Timestamp;
  imageHash?: ImageHash;
}

// TODO delete this
export interface StoredImage {
  id: ImageHash;
  base64: string;
}

// The width in pixels of the thumbnail image
export const thumbnailWidth = 300;

// Stores the mapping from commit id
// to Screenshot Genie image key
export interface CommitImageKey {
  commitId: CommitId;
  imageKey: ImageKey;
}
