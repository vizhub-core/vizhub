// import { Gateways, Result, ok, err } from 'gateways';
// import {
//   VizId,
//   UserId,
//   CommitId,
//   Image,
//   Commit,
//   Info,
//   Snapshot,
//   ImageMetadata,
//   dateToTimestamp,
//   imageFromBase64,
//   ImageId,
// } from 'entities';
// import { accessDeniedError } from 'gateways/src/errors';
// import {
//   ImageHash,
//   generateImageId,
// } from 'entities/src/Images';
// import {
//   VerifyVizAccess,
//   VizAccess,
// } from '../verifyVizAccess';
// import { CommitViz } from '../commitViz';
// import { resizeImage } from './resizeImage';
// import { GetImage } from './getImage';
// import { FetchImageMetadata } from './fetchImageMetadata';
// import { PollImageGenerationStatus } from './PollImageGenerationStatus';
// import { generateImageHash } from './generateImageHash';
// // import { imageMetadataLock } from 'entities/src/Lock';

// export { GetImage };

// const debug = false;

// // getThumbnail
// //  * Gets a resized image for a commit
// //  * Invokes getImage if the image has not been generated yet.
// //  * Handles access control.
// export const GetThumbnail = (gateways: Gateways) => {
//   const {
//     getCommit,
//     getInfo,
//     saveImageMetadata,
//     saveStoredImage,
//     getStoredImage,
//   } = gateways;

//   const verifyVizAccess = VerifyVizAccess(gateways);
//   const commitViz = CommitViz(gateways);
//   const getImage = GetImage(gateways);
//   const fetchImageMetadata = FetchImageMetadata(gateways);
//   const pollImageGenerationStatus =
//     PollImageGenerationStatus(gateways);

//   return async ({
//     commitId,
//     authenticatedUserId,
//     width,
//     waitTime,
//   }: {
//     commitId: CommitId;
//     authenticatedUserId: UserId | undefined;
//     width: number;
//     waitTime?: number;
//   }): Promise<Result<Image | null>> => {
//     if (debug) {
//       console.log(
//         '[GetThumbnail] getThumbnail for commit ' +
//           commitId,
//       );
//     }
//     // Get the vizId for this commit, so that we
//     // can enforce access control on thumbnails.
//     const commitResult: Result<Commit> =
//       await getCommit(commitId);
//     if (commitResult.outcome === 'failure') {
//       return err(commitResult.error);
//     }
//     const commit: Commit = commitResult.value;
//     const vizId: VizId = commit.viz;

//     // Get the Info for this viz,
//     // so we can verify access.
//     const infoResult = await getInfo(vizId);
//     if (infoResult.outcome === 'failure') {
//       return err(infoResult.error);
//     }
//     const infoSnapshot: Snapshot<Info> = infoResult.value;
//     const info = infoSnapshot.data;

//     // If the viz is not committed, then commit it.
//     // This is necessary because the thumbnail is
//     // out of date if the viz is not committed.
//     // The desired effect of doing this is:
//     //  * The old thumbnail loads immediately
//     //  * The new thumbnail loads in the background,
//     //    showing a loading spinner on top of the old one
//     //  * The old thumbnail is replaced with the new thumbnail
//     if (!info.committed) {
//       if (debug) {
//         console.log(
//           'Viz is not committed, committing it now',
//         );
//       }
//       const commitVizResult = await commitViz(info.id);
//       if (commitVizResult.outcome === 'failure') {
//         // TODO handle this error better
//         // Needs a refactor of the returned type
//         // return err(commitVizResult.error);
//         console.log(
//           'Error when committing viz in GetThumbnail for viz id ' +
//             info.id,
//         );
//         // console.log(commitVizResult.error);
//       }
//     }

//     // Verify access
//     const vizAccessResult: Result<VizAccess> =
//       await verifyVizAccess({
//         authenticatedUserId,
//         info,
//         actions: ['read'],
//       });
//     if (vizAccessResult.outcome === 'failure') {
//       return err(vizAccessResult.error);
//     }
//     const vizAccess: VizAccess = vizAccessResult.value;
//     if (!vizAccess.read) {
//       return err(accessDeniedError('Read access denied'));
//     }

//     // Fetch the image metadata for this thumbnail.
//     // TODO refactor this to eliminate duplication
//     // between here and getImage
//     const imageId: ImageId = generateImageId(
//       commitId,
//       width,
//     );
//     if (debug) {
//       console.log(
//         '  [GetThumbnail] outside lock for imageId ' +
//           imageId,
//       );
//     }
//     // TODO consider bringing this back?
//     // It's not clear if it's necessary.
//     // It was causing the server to crash.
//     // return lock([imageMetadataLock(imageId)], async () => {
//     if (debug) {
//       console.log(
//         '  [GetThumbnail] inside lock for imageId ' +
//           imageId,
//       );
//     }
//     const imageMetadataResult: Result<ImageMetadata | null> =
//       await fetchImageMetadata(imageId);
//     if (imageMetadataResult.outcome === 'failure') {
//       return err(imageMetadataResult.error);
//     }
//     const imageMetadata = imageMetadataResult.value;

//     // If the image metadata is not found, assume
//     // the image status is 'not started'.
//     if (!imageMetadata) {
//       if (debug) {
//         console.log(
//           '  [GetThumbnail] image metadata not found, invoking getImage',
//         );
//       }
//       // Store the metadata that indicates the image
//       // is being generated.
//       await saveImageMetadata({
//         id: imageId,
//         commitId,
//         width,
//         status: 'generating',
//         lastAccessed: dateToTimestamp(new Date()),
//       });

//       if (debug) {
//         console.log(
//           '  [GetThumbnail] saved image metadata with status "generating"',
//         );
//       }

//       const fullSizeImageResult = await getImage({
//         commitId,
//         waitTime,
//       });
//       if (fullSizeImageResult.outcome === 'failure') {
//         return err(fullSizeImageResult.error);
//       }
//       const fullSizeImage = fullSizeImageResult.value;

//       if (debug) {
//         console.log('  [GetThumbnail] resizing image');
//       }
//       // Resize the image
//       const resizedImage: Image = await resizeImage({
//         image: fullSizeImage,
//         width,
//       });

//       // Generate hash for the image
//       const resizedImageHash: ImageHash = generateImageHash(
//         resizedImage.buffer,
//       );

//       // Check if the image already exists using the hash
//       const existingStoredImageResult =
//         await getStoredImage(resizedImageHash);
//       if (
//         existingStoredImageResult.outcome === 'success' &&
//         existingStoredImageResult.value
//       ) {
//         if (debug) {
//           console.log(
//             '  [GetThumbnail] Resized image already exists, using stored image',
//           );
//         }
//       } else {
//         if (debug) {
//           console.log(
//             '  [GetThumbnail] Saving resized image',
//           );
//         }
//         // Save the image
//         const saveResult = await saveStoredImage({
//           id: resizedImageHash,
//           base64: resizedImage.buffer.toString('base64'),
//         });
//         if (saveResult.outcome === 'failure') {
//           return err(saveResult.error);
//         }
//       }

//       if (debug) {
//         console.log(
//           '  [GetThumbnail] saving image metadata with status "generated"',
//         );
//       }

//       // Store the metadata that indicates the image
//       // has been generated.
//       await saveImageMetadata({
//         id: imageId,
//         commitId,
//         width,
//         status: 'generated',
//         lastAccessed: dateToTimestamp(new Date()),
//         imageHash: resizedImageHash,
//       });

//       // Return the image
//       return ok(resizedImage);
//     } else {
//       if (imageMetadata.status === 'generating') {
//         if (debug) {
//           console.log(
//             '  [GetThumbnail] image metadata found with status "generating", polling',
//           );
//         }
//         const polledImageMetadataResult: Result<ImageMetadata> =
//           await pollImageGenerationStatus(imageId);
//         if (
//           polledImageMetadataResult.outcome === 'failure'
//         ) {
//           return err(polledImageMetadataResult.error);
//         }
//         const polledImageMetadata =
//           polledImageMetadataResult.value;
//         if (polledImageMetadata.status !== 'generated') {
//           return ok(null);
//         }
//       }

//       if (debug) {
//         console.log(
//           '  [GetThumbnail] Fetching and returning the stored image',
//         );
//       }
//       // Fetch and return the stored image
//       const result = await getStoredImage(
//         imageMetadata.imageHash,
//       );
//       if (result.outcome === 'failure') {
//         return err(result.error);
//       }
//       const storedImage = result.value;
//       return ok(imageFromBase64(storedImage.base64));
//     }
//     // });
//   };
// };
