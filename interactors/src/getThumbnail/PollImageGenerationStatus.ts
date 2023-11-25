import { Gateways, Result, ok, err } from 'gateways';
import { ImageMetadata, ImageId } from 'entities';

export const PollImageGenerationStatus = (
  gateways: Gateways,
) => {
  const { getImageMetadata } = gateways;

  return async (
    imageId: ImageId,
  ): Promise<Result<ImageMetadata>> => {
    const retries = 20;
    const interval = 1000; // 1 second
    let imageMetadata: ImageMetadata | undefined;

    for (let attempt = 1; attempt <= retries; attempt++) {
      const imageMetadataResult =
        await getImageMetadata(imageId);
      if (imageMetadataResult.outcome === 'failure') {
        return err(imageMetadataResult.error); // handle error appropriately
      }

      imageMetadata = imageMetadataResult.value.data;
      if (imageMetadata.status === 'generated') {
        // Image has been successfully generated
        return ok(imageMetadata);
      }

      // Wait for the specified interval before the next check
      await new Promise((resolve) =>
        setTimeout(resolve, interval),
      );
    }

    // After all retries, if the image is still not generated, handle accordingly
    return err(/* appropriate error indicating timeout or retry failure */);
  };
};
