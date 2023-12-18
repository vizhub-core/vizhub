import { CommitId } from './RevisionHistory';
import { Timestamp } from './common';

// Image
// * Not an entity, just used internally.
// * Represents the image generated from a Puppeteer screenshot.
// * Contains a WebP image buffer.
export type Image = {
  buffer: Buffer;
};

export const imageFromBase64 = (base64: string): Image => {
  const buffer = Buffer.from(base64, 'base64');
  return { buffer };
};

// ImageId
//  * Unique identifier string for image metadata.
//  * Format: `${commitId}-${width}`
export type ImageId = string;

// generateImageId
//  * Generates an ImageId.
export const generateImageId = (
  commitId: CommitId,
  width: number,
): ImageId => `${commitId}-${width}`;

// The image's hash, used to detect changes and
// avoid generating the same image twice.
//  * Stored in metadata once the image is generated.
export type ImageHash = string;

// ImageMetadata
//  * Represents the status and access details of an image associated with a Viz commit.
//  * This type provides a structured way to track the lifecycle of an image,
//    from generation to its last access, facilitating efficient data handling and queries.
//  * Applies to both full-size images and thumbnails.
export interface ImageMetadata {
  // A unique identifier for the image metadata,
  // including width.
  id: ImageId;

  // The commit associated with the image
  commitId: CommitId;

  // The image's width in pixels.
  //  * `undefined` if the image is full-size
  //  * `number` if the image is a resized thumbnail
  width?: number;

  // True while the image is being generated
  status: 'generating' | 'generated';

  // Timestamp of the last time the image was accessed
  // * Includes the time that generation was kicked off.
  // * Includes when users view the image.
  lastAccessed: Timestamp;

  // Only present when status is 'generated'.
  imageHash?: ImageHash;
}

// StoredImage
//  * Represents an image stored in the database.
//  * This type is used for database queries and updates.
export interface StoredImage {
  // Each image is identified by its hash.
  id: ImageHash;

  // The image data as a base64 encoded string
  base64: string;
}
