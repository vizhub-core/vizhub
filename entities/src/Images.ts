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
  // mimeType: 'image/png' | 'image/jpeg';
};

export const imageFromBase64 = (base64: string): Image => {
  const buffer = Buffer.from(base64, 'base64');
  return { buffer };
};

// ImageMetadata
//  * Represents the status and access details of an image associated with a Viz commit.
//  * This type provides a structured way to track the lifecycle of an image,
//    from generation to its last access, facilitating efficient data handling and queries.
export interface ImageMetadata {
  // A unique identifier for the image
  // Format: `${commitId}-${width}`
  id: string;

  // The commit associated with the image
  commitId: CommitId;

  // The image's width in pixels.
  //  * `undefined` if the image is full-size
  //  * `number` if the image is a resized thumbnail
  width?: number;

  // True while the image is being generated
  status: 'generating' | 'generated';

  // Timestamp of the last time the image was accessed
  lastAccessed: Timestamp;
}

// StoredImage
//  * Represents an image stored in the database.
//  * This type is used for database queries and updates.
export interface StoredImage {
  // A unique identifier for the image
  // Format: `${commitId}-${width}`
  id: string;

  // The image data as a base64 encoded string
  base64: string;
}
