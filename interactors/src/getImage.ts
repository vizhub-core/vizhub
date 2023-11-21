import { Gateways, Result, ok, err } from 'gateways';
import {
  VizId,
  UserId,
  CommitId,
  Image,
  Commit,
  Info,
  Snapshot,
} from 'entities';
import { sampleImage } from './sampleImageDataURI';
import {
  VerifyVizAccess,
  VizAccess,
} from './verifyVizAccess';
import { accessDeniedError } from 'gateways/src/errors';

// getImage
//  * Gets an image for a commit
//  * If the image has already been generated, returns it.
//  * Otherwise, generates the image and returns it.
//  * Handles concurrency issues.
export const GetImage = (gateways: Gateways) => {
  const {
    getCommit,
    getInfo,
    // getImageStatus,
    // generateImage,
    // fetchImage,
    // storeImage,
  } = gateways;

  const verifyVizAccess = VerifyVizAccess(gateways);

  return async ({
    commitId,
    authenticatedUserId,
  }: {
    commitId: CommitId;
    authenticatedUserId: UserId | undefined;
  }): Promise<Result<Image>> => {
    // Get the vizId for this commit, so that we
    // can enforce access control on thumbnails.
    const commitResult: Result<Commit> =
      await getCommit(commitId);
    if (commitResult.outcome === 'failure') {
      return err(commitResult.error);
    }
    const commit: Commit = commitResult.value;
    const vizId: VizId = commit.viz;

    // Get the Info for this viz
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

    console.log('commit', commit);
    console.log('vizId', vizId);

    // TODO access control based on viz info

    return ok(sampleImage);
  };
};

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
