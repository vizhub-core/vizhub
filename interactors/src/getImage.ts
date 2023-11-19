const acquireLock = async ({
  commitId,
}: {
  commitId: CommitId;
}): Promise<Result<void>> => {
  // TODO Redlock
  return ok(undefined);
};

const releaseLock = async ({
  commitId,
}: {
  commitId: CommitId;
}): Promise<Result<void>> => {
  // TODO Redlock
  return ok(undefined);
};

import { Gateways, Result, ok, err } from 'gateways';
import { VizId, UserId, CommitId, Image } from 'entities';

// getImage
//  * Gets an image for a commit
//  * If the image has already been generated, returns it.
//  * Otherwise, generates the image and returns it.
//  * Handles concurrency issues.
export const GetImage = (gateways: Gateways) => {
  const {
    getImageStatus,
    generateImage,
    fetchImage,
    storeImage,
  } = gateways;

  //   // Function to poll image status
  //   const pollImageStatus = async ({
  //     commitId,
  //     retries = 5,
  //     interval = 1000,
  //   }) => {
  //     for (let attempt = 1; attempt <= retries; attempt++) {
  //       const statusResult = await getImageStatus({
  //         commitId,
  //       });

  //       if (statusResult.outcome === 'failure') {
  //         throw new Error('Failed to get image status');
  //       }

  //       if (statusResult.value === 'generated') {
  //         return statusResult.value;
  //       }

  //       if (attempt < retries) {
  //         await new Promise((resolve) =>
  //           setTimeout(resolve, interval),
  //         );
  //       } else {
  //         throw new Error('Image generation timed out');
  //       }
  //     }
  //   };

  //   return async ({
  //     vizId,
  //     commitId,
  //     authenticatedUserId,
  //   }: {
  //     vizId: VizId;
  //     commitId: CommitId;
  //     authenticatedUserId: UserId | undefined;
  //   }): Promise<Result<Image>> => {
  //     try {
  //       await acquireLock({ commitId });

  //       // Check image status
  //       const imageStatusResult: Result<ImageStatus> =
  //         await getImageStatus({ commitId });

  //       if (imageStatusResult.outcome === 'failure') {
  //         return err(new Error('Failed to get image status'));
  //       }

  //       let image: Image;

  //       switch (imageStatusResult.value) {
  //         case 'not started':
  //           // Generate image
  //           const generationResult = await generateImage({
  //             vizId,
  //             commitId,
  //           });
  //           if (generationResult.outcome === 'failure') {
  //             return err(
  //               new Error('Image generation failed'),
  //             );
  //           }
  //           image = generationResult.value;
  //           break;
  //         case 'generating':
  //           // Poll until the image is generated
  //           await pollImageStatus({ commitId });
  //           const fetchResult = await fetchImage({
  //             commitId,
  //           });
  //           if (fetchResult.outcome === 'failure') {
  //             return err(
  //               new Error(
  //                 'Failed to fetch the generated image',
  //               ),
  //             );
  //           }
  //           image = fetchResult.value;
  //           break;
  //         case 'generated':
  //           // Fetch the already generated image
  //           const fetchGeneratedResult = await fetchImage({
  //             commitId,
  //           });
  //           if (fetchGeneratedResult.outcome === 'failure') {
  //             return err(
  //               new Error(
  //                 'Failed to fetch the generated image',
  //               ),
  //             );
  //           }
  //           image = fetchGeneratedResult.value;
  //           break;
  //         default:
  //           return err(new Error('Unknown image status'));
  //       }

  //       return ok(image);
  //     } catch (error) {
  //       return err(error);
  //     } finally {
  //       await releaseLock({ commitId });
  //     }
  //   };
  // Function to poll image status
  const pollImageStatus = async ({
    commitId,
    retries = 5,
    interval = 1000,
  }) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      const metadataResult = await getImageMetadata({
        commitId,
      });

      // Assuming 'not found' error is equivalent to 'not started'
      if (
        metadataResult.outcome === 'failure' &&
        metadataResult.error.message === 'Not found'
      ) {
        return 'not started';
      }

      if (metadataResult.outcome === 'failure') {
        throw new Error('Failed to get image metadata');
      }

      if (metadataResult.value.status === 'generated') {
        return metadataResult.value.status;
      }

      if (attempt < retries) {
        await new Promise((resolve) =>
          setTimeout(resolve, interval),
        );
      } else {
        throw new Error('Image generation timed out');
      }
    }
  };

  return async ({
    vizId,
    commitId,
    authenticatedUserId,
  }: {
    vizId: VizId;
    commitId: CommitId;
    authenticatedUserId: UserId | undefined;
  }): Promise<Result<Image>> => {
    try {
      await acquireLock({ commitId });

      // Check image metadata
      const imageMetadataResult: Result<ImageMetadata> =
        await getImageMetadata({ commitId });

      // If metadata not found, assume image status is 'not started'
      let imageStatus =
        imageMetadataResult.outcome === 'failure' &&
        imageMetadataResult.error.message === 'Not found'
          ? 'not started'
          : imageMetadataResult.value?.status || 'unknown';

      let image: Image;

      switch (imageStatus) {
        case 'not started':
          // Generate image
          const generationResult = await generateImage({
            vizId,
            commitId,
          });
          if (generationResult.outcome === 'failure') {
            return err(
              new Error('Image generation failed'),
            );
          }
          image = generationResult.value;
          break;
        case 'generating':
          // Poll until the image is generated
          await pollImageStatus({ commitId });
          const fetchResult = await fetchImage({
            commitId,
          });
          if (fetchResult.outcome === 'failure') {
            return err(
              new Error(
                'Failed to fetch the generated image',
              ),
            );
          }
          image = fetchResult.value;
          break;
        case 'generated':
          // Fetch the already generated image
          const fetchGeneratedResult = await fetchImage({
            commitId,
          });
          if (fetchGeneratedResult.outcome === 'failure') {
            return err(
              new Error(
                'Failed to fetch the generated image',
              ),
            );
          }
          image = fetchGeneratedResult.value;
          break;
        default:
          return err(new Error('Unknown image status'));
      }

      return ok(image);
    } catch (error) {
      return err(error);
    } finally {
      await releaseLock({ commitId });
    }
  };
};
