import { CommitId } from './RevisionHistory';
import { Timestamp } from './common';

// Image
// * Represents the image generated from a Puppeteer screenshot.
// * Can be stored as either a Buffer or a base64 encoded string.
// * The 'buffer' property holds the image as a Buffer object, commonly used for binary data in Node.js.
//     - Used when the image is generated as a file or a binary stream.
// * The 'mimeType' property indicates the image format, typically 'image/png' or 'image/jpeg'.
//     - Essential for correct interpretation and display of the image data.
export type Image = {
  buffer: Buffer;
  mimeType: 'image/png' | 'image/jpeg';
};

// ImageMetadata
//  * Represents the status and access details of an image associated with a Viz commit.
//  * This type provides a structured way to track the lifecycle of an image,
//    from generation to its last access, facilitating efficient data handling and queries.
export interface ImageMetadata {
  // Unique identifier for the commit associated with the image
  commitId: CommitId;

  // Status of the image regarding its generation process
  status: ImageStatus;

  // Timestamp indicating when the image was originally generated
  // Helps in identifying the age of the image and managing updates or cache invalidations
  generatedAt: Timestamp;

  // Timestamp of the last time the image was accessed
  // Useful for tracking image relevance and optimizing storage (e.g., cleaning up old, unused images)
  lastAccessedAt: Timestamp;
}

type ImageStatus = 'generating' | 'generated';
