// import { rollup } from 'rollup';
// import { compile } from 'svelte/compiler';
// import { Gateways, Result, ok, err } from 'gateways';
// import {
//   CommitId,
//   Image,
//   ImageMetadata,
//   dateToTimestamp,
//   Content,
//   defaultVizWidth,
//   getHeight,
//   imageFromBase64,
//   ImageId,
//   VizId,
// } from 'entities';
// import {
//   computeSrcDoc,
//   VizCache,
//   createVizCache,
// } from '@vizhub/runtime';
// import { GetContentAtCommit } from '../getContentAtCommit';
// import { takeScreenshot } from './takeScreenshot';
// import {
//   ImageHash,
//   generateImageId,
// } from 'entities/src/Images';
// import { FetchImageMetadata } from './fetchImageMetadata';
// import { PollImageGenerationStatus } from './PollImageGenerationStatus';
// import { generateImageHash } from './generateImageHash';
// import { ResolveSlug } from '../resolveSlug';

// const debug = false;

// // getImage
// //  * Gets an image for a commit
// //  * If the image has already been generated, returns it.
// //  * Otherwise, generates the image and returns it.
// //  * Handles concurrency issues.
// //  * Does not handle access control, that is handled
// //    in getThumbnail.
// export const GetImage = (gateways: Gateways) => {
//   const {
//     saveImageMetadata,
//     saveStoredImage,
//     getStoredImage,
//     getContent,
//     lock,
//   } = gateways;

//   const getContentAtCommit = GetContentAtCommit(gateways);
//   const fetchImageMetadata = FetchImageMetadata(gateways);
//   const pollImageGenerationStatus =
//     PollImageGenerationStatus(gateways);
//   const resolveSlug = ResolveSlug(gateways);

//   return async ({
//     commitId,
//     waitTime,
//   }: {
//     commitId: CommitId;
//     waitTime?: number;
//   }): Promise<Result<Image | null>> => {
//     if (debug) {
//       console.log(
//         '  [GetImage] getImage for commit ' + commitId,
//       );
//     }

//     // Fetch the image metadata
//     const imageId: ImageId = generateImageId(
//       commitId,
//       defaultVizWidth,
//     );

//     if (debug) {
//       console.log(
//         '  [GetImage] outside lock for imageId ' + imageId,
//       );
//     }

//     if (debug) {
//       console.log(
//         '  [GetImage] inside lock for imageId ' + imageId,
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
//           '  [GetImage] image metadata not found, generating',
//         );
//       }
//       // Store the metadata that indicates the image
//       // is being generated.
//       await saveImageMetadata({
//         id: imageId,
//         commitId,
//         status: 'generating',
//         lastAccessed: dateToTimestamp(new Date()),
//       });

//       if (debug) {
//         console.log(
//           '  [GetImage] saved image metadata with status "generating"',
//         );
//       }

//       // Fetch the Content, so we can generate the srcDoc,
//       // and then generate the image.
//       const contentResult: Result<Content> =
//         await getContentAtCommit(commitId);
//       if (contentResult.outcome === 'failure') {
//         return err(contentResult.error);
//       }
//       const content: Content = contentResult.value;

//       // if (debug) {
//       //   console.log('  content:');
//       //   console.log(content);
//       // }

//       const vizCache: VizCache = createVizCache({
//         initialContents: [content],
//         handleCacheMiss: async (vizId: VizId) => {
//           if (debug) {
//             console.log(
//               '  [GetImage] Handling cache miss for vizId',
//               vizId,
//             );
//           }
//           const contentResult = await getContent(vizId);
//           if (contentResult.outcome === 'failure') {
//             console.log(
//               '  [GetImage] Error when fetching content for viz cache:',
//             );
//             console.log(contentResult.error);
//             return null;
//           }

//           if (debug) {
//             console.log(
//               '  [GetImage] Fetched content for viz cache',
//             );
//             console.log(contentResult.value.data);
//           }
//           return contentResult.value.data;
//         },
//       });
//       // Generate the srcDoc.
//       const { initialSrcdoc, initialSrcdocError } =
//         await computeSrcDoc({
//           rollup,
//           content,
//           vizCache,
//           resolveSlug,
//           getSvelteCompiler: async () => compile,
//         });

//       if (initialSrcdocError) {
//         console.log(
//           '  [GetImage] initialSrcdocError',
//           initialSrcdocError,
//         );
//       }

//       // TODO don't screenshot if there's an error in initialSrcdocError

//       if (debug) {
//         console.log(
//           '  [GetImage] generated srcdoc, taking screenshot',
//         );
//       }
//       // Take the screenshot
//       const image = await takeScreenshot({
//         srcDoc: initialSrcdoc,
//         width: defaultVizWidth,
//         height: getHeight(content.height),
//         waitTime,
//       });

//       if (debug) {
//         console.log(
//           '  [GetImage] took screenshot, saving stored image',
//         );
//       }

//       // Generate hash for the image
//       const imageHash: ImageHash = generateImageHash(
//         image.buffer,
//       );

//       // Check if the image already exists using the hash
//       const existingStoredImageResult =
//         await getStoredImage(imageHash);
//       if (
//         existingStoredImageResult.outcome === 'success' &&
//         existingStoredImageResult.value
//       ) {
//         if (debug) {
//           console.log(
//             '  [GetImage] Image by hash already exists, using stored image',
//           );
//         }
//       } else {
//         // Save the image
//         const saveResult = await saveStoredImage({
//           id: imageHash,
//           base64: image.buffer.toString('base64'),
//         });
//         if (saveResult.outcome === 'failure') {
//           return err(saveResult.error);
//         }
//       }

//       if (debug) {
//         console.log(
//           '  [GetImage] saving image metadata with status "generated"',
//         );
//       }

//       // Store the metadata that indicates the image
//       // has been generated.
//       await saveImageMetadata({
//         id: imageId,
//         commitId,
//         status: 'generated',
//         imageHash,
//         lastAccessed: dateToTimestamp(new Date()),
//       });

//       // Return the image
//       return ok(image);
//     } else {
//       if (imageMetadata.status === 'generating') {
//         if (debug) {
//           console.log(
//             '  [GetImage] image metadata found with status "generating", polling',
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
//           '  [GetImage] Fetching and returning the stored image',
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
//   };
// };
