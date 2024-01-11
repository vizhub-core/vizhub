// Generates an image source URL from S3 bucket.
// TODO - use a CDN instead of directly an S3 bucket.
const baseSrc = 'https://vizhub-images.s3.amazonaws.com';
export const image = (name: string, extension = 'webp') =>
  baseSrc + '/' + name + '.' + extension;
