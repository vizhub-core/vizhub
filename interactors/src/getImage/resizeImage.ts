import sharp from 'sharp';

export const resize = async (options) => {
  const {
    actualDimensions: actual,
    desiredDimensions: desired,
    screenshotBuffer,
  } = options;

  const { width, height } = computeImageDimensions({
    actual,
    desired,
  });

  return await sharp(screenshotBuffer)
    .resize(width, height)
    .toBuffer();
};
