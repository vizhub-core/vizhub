import { CommitId } from './RevisionHistory';
import { Timestamp } from './common';

// Image
// * Not an entity, just used internally.
// * Represents the image generated from a Puppeteer screenshot.
// * Can be stored as either a Buffer or a base64 encoded string.
// * The 'buffer' property holds the image as a Buffer object, commonly used for binary data in Node.js.
//     - Used when the image is generated as a file or a binary stream.
// * The 'base64' property holds the image as a base64 encoded string, commonly used for data transfer.
//     - Used when the image is generated as a data URI.
// * The 'buffer' and 'base64' properties are mutually exclusive.
// * The 'mimeType' property indicates the image format, typically 'image/png' or 'image/jpeg'.
//     - Essential for correct interpretation and display of the image data.
export type Image = {
  // buffer = Buffer.from(base64, 'base64'),
  // base64 = buffer.toString('base64'),
  buffer: Buffer;
  // base64: string;
  mimeType: 'image/png' | 'image/jpeg';
};

export const imageFromBase64 = (base64: string): Image => {
  const buffer = Buffer.from(base64, 'base64');
  return { buffer, mimeType: 'image/png' };
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
