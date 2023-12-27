import { Gateways, Result, err, ok } from 'gateways';
import {
  ImageMetadata,
  ImageId,
  dateToTimestamp,
  infoLock,
} from 'entities';
import { imageMetadataLock } from 'entities/src/Lock';

// The maximum amount of time to wait for an image to be generated.
// If the image has been generating for longer than this, we assume
// it has failed and try again.
// Note that this time could be longer than the time it takes to
// generate the image, if the image is enqueued for a long time.
const oneHour = 60 * 60;
const maxGenerationTimeSeconds = oneHour;

// Fetches image metadata, and checks if it is
// valid. Assumes old metadata with "generating"
// status is invalid.
export const FetchImageMetadata = (gateways: Gateways) => {
  const { getImageMetadata } = gateways;

  return async (
    imageId: ImageId,
  ): Promise<Result<ImageMetadata | null>> => {
    let imageMetadata: ImageMetadata | undefined;

    const imageMetadataResult =
      await getImageMetadata(imageId);
    if (imageMetadataResult.outcome === 'failure') {
      if (
        imageMetadataResult.error.code ===
        'resourceNotFound'
      ) {
        // This case is fine, it just means the image hasn't been generated yet.
      } else {
        // This is an unexpected error, like a database connection error.
        return err(imageMetadataResult.error);
      }
    } else {
      const potentiallyBogusImageMetadata =
        imageMetadataResult.value.data;
      const generatedTimestamp =
        potentiallyBogusImageMetadata.lastAccessed;
      const nowTimestamp = dateToTimestamp(new Date());
      const elapsedSeconds =
        nowTimestamp - generatedTimestamp;

      // If the generation started more than maxGenerationTimeSeconds ago,
      // AND hasn't finished yet, then we should assume it failed, and try again.
      // Note that it may be enqueued for a long time potentially.
      if (
        potentiallyBogusImageMetadata.status ===
          'generating' &&
        elapsedSeconds > maxGenerationTimeSeconds
      ) {
        // Generation started more than 1 minute ago, assume it
        // failed and return nothing.
      } else {
        // If less than 1 minute ago, assume the image is still being generated.
        imageMetadata = imageMetadataResult.value.data;
      }
    }

    return ok(imageMetadata);
  };
};
