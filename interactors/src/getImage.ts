import { rollup } from 'rollup';
import { Gateways, Result, ok, err } from 'gateways';
import {
  VizId,
  UserId,
  CommitId,
  Image,
  Commit,
  Info,
  Snapshot,
  ImageMetadata,
  dateToTimestamp,
  Content,
  defaultVizWidth,
  getHeight,
} from 'entities';
import { computeSrcDoc } from 'runtime';
import {
  VerifyVizAccess,
  VizAccess,
} from './verifyVizAccess';
import { accessDeniedError } from 'gateways/src/errors';
import { GetContentAtCommit } from './getContentAtCommit';
import { takeScreenshot } from './takeScreenshot';
import { imageFromBase64 } from 'entities/src/Images';

const debug = true;

// getImage
//  * Gets an image for a commit
//  * If the image has already been generated, returns it.
//  * Otherwise, generates the image and returns it.
//  * Handles concurrency issues.
export const GetImage = (gateways: Gateways) => {
  const {
    getCommit,
    getInfo,
    getImageMetadata,
    saveImageMetadata,
    saveStoredImage,
    getStoredImage,
  } = gateways;

  const verifyVizAccess = VerifyVizAccess(gateways);
  const getContentAtCommit = GetContentAtCommit(gateways);

  return async ({
    commitId,
    authenticatedUserId,
  }: {
    commitId: CommitId;
    authenticatedUserId: UserId | undefined;
  }): Promise<Result<Image | null>> => {
    if (debug) {
      console.log('getImage for commit ' + commitId);
    }
    // Get the vizId for this commit, so that we
    // can enforce access control on thumbnails.
    const commitResult: Result<Commit> =
      await getCommit(commitId);
    if (commitResult.outcome === 'failure') {
      return err(commitResult.error);
    }
    const commit: Commit = commitResult.value;
    const vizId: VizId = commit.viz;

    // Get the Info for this viz,
    // so we can verify access.
    const infoResult = await getInfo(vizId);
    if (infoResult.outcome === 'failure') {
      return err(infoResult.error);
    }
    const infoSnapshot: Snapshot<Info> = infoResult.value;
    const info = infoSnapshot.data;

    // Verify access
    const vizAccessResult: Result<VizAccess> =
      await verifyVizAccess({
        authenticatedUserId,
        info,
        actions: ['read'],
      });
    if (vizAccessResult.outcome === 'failure') {
      return err(vizAccessResult.error);
    }
    const vizAccess: VizAccess = vizAccessResult.value;
    if (!vizAccess.read) {
      return err(accessDeniedError('Read access denied'));
    }

    // Fetch the image metadata
    let imageMetadata: ImageMetadata | undefined;
    const imageMetadataResult =
      await getImageMetadata(commitId);
    if (imageMetadataResult.outcome === 'failure') {
      if (
        imageMetadataResult.error.code ===
        'resourceNotFound'
      ) {
        // This case is fine, it just means the image
        // hasn't been generated yet.
      } else {
        // This is an unexpected error, like a database
        // connection error.
        return err(imageMetadataResult.error);
      }
    } else {
      imageMetadata = imageMetadataResult.value.data;
    }

    // If the image metadata is not found, assume
    // the image status is 'not started'.
    if (!imageMetadata) {
      if (debug) {
        console.log(
          '  image metadata not found, generating',
        );
      }
      // Store the metadata that indicates the image
      // is being generated.
      await saveImageMetadata({
        id: commitId,
        commitId,
        status: 'generating',
        lastAccessed: dateToTimestamp(new Date()),
      });

      if (debug) {
        console.log(
          '  saved image metadata with status "generating"',
        );
      }

      // Fetch the Content, so we can generate the srcDoc,
      // and then generate the image.
      const contentResult: Result<Content> =
        await getContentAtCommit(commitId);
      if (contentResult.outcome === 'failure') {
        return err(contentResult.error);
      }
      const content: Content = contentResult.value;

      // Generate the srcDoc.
      // TODO refactor computeSrcDoc to a new package `runtime`
      const { initialSrcdoc, initialSrcdocError } =
        await computeSrcDoc({ rollup, content });

      if (initialSrcdocError) {
        console.log(
          'initialSrcdocError',
          initialSrcdocError,
        );
      }

      // TODO don't screenshot if there's an error in initialSrcdocError

      if (debug) {
        console.log(
          '  generated srcdoc, taking screenshot',
        );
      }
      // Take the screenshot
      const image = await takeScreenshot({
        srcDoc: initialSrcdoc,
        width: defaultVizWidth,
        height: getHeight(content.height),
      });

      if (debug) {
        console.log(
          '  took screenshot, saving stored image',
        );
      }

      // Save the image
      const saveResult = await saveStoredImage({
        id: commitId,
        base64: image.buffer.toString('base64'),
      });
      if (saveResult.outcome === 'failure') {
        return err(saveResult.error);
      }

      if (debug) {
        console.log(
          '  saving image metadata with status "generated"',
        );
      }

      // Store the metadata that indicates the image
      // has been generated.
      await saveImageMetadata({
        id: commitId,
        commitId,
        status: 'generated',
        lastAccessed: dateToTimestamp(new Date()),
      });

      // Return the image
      return ok(image);
    } else {
      if (imageMetadata.status === 'generating') {
        if (debug) {
          console.log(
            '  image metadata found with status "generating", polling',
          );
        }
        const retries = 20;
        const interval = 1000;
        for (
          let attempt = 1;
          attempt <= retries;
          attempt++
        ) {
          if (debug) {
            console.log(
              '    attempt ' +
                attempt +
                ' of ' +
                retries +
                ' to poll image status',
            );
          }
          // Poll until the image is generated
          await new Promise((resolve) =>
            setTimeout(resolve, interval),
          );
          const imageMetadataResult =
            await getImageMetadata(commitId);
          if (imageMetadataResult.outcome === 'failure') {
            // This should never happen, as it should
            // at least be stored with status as 'generating'.
            return err(imageMetadataResult.error);
          }
          imageMetadata = imageMetadataResult.value.data;
          if (imageMetadata.status === 'generated') {
            if (debug) {
              console.log(
                '    image status is "generated"!',
              );
            }
            break;
          } else {
            if (debug) {
              console.log(
                '    image status is "' +
                  imageMetadata.status +
                  '", continuing to poll',
              );
            }
          }
        }
        // If we've reached the max number of retries,
        // return null, and let the client request
        // time out.
        if (debug) {
          console.log(
            '  max retries reached, returning null',
          );
        }
        if (imageMetadata.status !== 'generated') {
          return ok(null);
        }
      }

      if (debug) {
        console.log(
          '  Fetching and returning the stored image',
        );
      }
      // if (imageMetadata.status === 'generated') {
      // Fetch and return the stored image
      const result = await getStoredImage(commitId);
      if (result.outcome === 'failure') {
        return err(result.error);
      }
      const storedImage = result.value;
      return ok(imageFromBase64(storedImage.base64));
      // }
    }
  };
};

// const pollImageStatus = async ({
//   commitId,
//   retries = 5,
//   interval = 1000,
// }) => {
//   for (let attempt = 1; attempt <= retries; attempt++) {
//     const metadataResult = await getImageMetadata({
//       commitId,
//     });

//     // Assuming 'not found' error is equivalent to 'not started'
//     if (
//       metadataResult.outcome === 'failure' &&
//       metadataResult.error.message === 'Not found'
//     ) {
//       return 'not started';
//     }

//     if (metadataResult.outcome === 'failure') {
//       throw new Error('Failed to get image metadata');
//     }

//     if (metadataResult.value.status === 'generated') {
//       return metadataResult.value.status;
//     }

//     if (attempt < retries) {
//       await new Promise((resolve) =>
//         setTimeout(resolve, interval),
//       );
//     } else {
//       throw new Error('Image generation timed out');
//     }
//   }
// };

// TODO make this work
// try {
//   await acquireLock({ commitId });

//   // Check image metadata
//   const imageMetadataResult: Result<ImageMetadata> =
//     await getImageMetadata({ commitId });

//   // If metadata not found, assume image status is 'not started'
//   let imageStatus =
//     imageMetadataResult.outcome === 'failure' &&
//     imageMetadataResult.error.message === 'Not found'
//       ? 'not started'
//       : imageMetadataResult.value?.status || 'unknown';

//   let image: Image;

//   switch (imageStatus) {
//     case 'not started':
//       // Generate image
//       const generationResult = await generateImage({
//         vizId,
//         commitId,
//       });
//       if (generationResult.outcome === 'failure') {
//         return err(
//           new Error('Image generation failed'),
//         );
//       }
//       image = generationResult.value;
//       break;
//     case 'generating':
//       // Poll until the image is generated
//       await pollImageStatus({ commitId });
//       const fetchResult = await fetchImage({
//         commitId,
//       });
//       if (fetchResult.outcome === 'failure') {
//         return err(
//           new Error(
//             'Failed to fetch the generated image',
//           ),
//         );
//       }
//       image = fetchResult.value;
//       break;
//     case 'generated':
//       // Fetch the already generated image
//       const fetchGeneratedResult = await fetchImage({
//         commitId,
//       });
//       if (fetchGeneratedResult.outcome === 'failure') {
//         return err(
//           new Error(
//             'Failed to fetch the generated image',
//           ),
//         );
//       }
//       image = fetchGeneratedResult.value;
//       break;
//     default:
//       return err(new Error('Unknown image status'));
//   }

//   return ok(image);
// } catch (error) {
//   return err(error);
// } finally {
//   await releaseLock({ commitId });
// }
// TODO make this work
// // Function to poll image status
// const pollImageStatus = async ({
//   commitId,
//   retries = 5,
//   interval = 1000,
// }) => {
//   for (let attempt = 1; attempt <= retries; attempt++) {
//     const metadataResult = await getImageMetadata({
//       commitId,
//     });

//     // Assuming 'not found' error is equivalent to 'not started'
//     if (
//       metadataResult.outcome === 'failure' &&
//       metadataResult.error.message === 'Not found'
//     ) {
//       return 'not started';
//     }

//     if (metadataResult.outcome === 'failure') {
//       throw new Error('Failed to get image metadata');
//     }

//     if (metadataResult.value.status === 'generated') {
//       return metadataResult.value.status;
//     }

//     if (attempt < retries) {
//       await new Promise((resolve) =>
//         setTimeout(resolve, interval),
//       );
//     } else {
//       throw new Error('Image generation timed out');
//     }
//   }
// };
