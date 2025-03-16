// import { Image } from 'entities';
// import sharp from 'sharp';

// // Resizes an image to the specified width while maintaining aspect ratio.
// export const resizeImage = async ({
//   image,
//   width,
// }: {
//   image: Image;
//   width: number;
// }): Promise<Image> => {
//   try {
//     // Resize the image using sharp.
//     // The height is automatically adjusted to maintain aspect ratio.
//     return {
//       buffer: await sharp(image.buffer)
//         .resize(width)
//         .toBuffer(),
//     };
//   } catch (error) {
//     console.error('Error resizing image:', error);
//     throw error;
//   }
// };
