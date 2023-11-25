import { rollup } from 'rollup';
import { Gateways, Result, ok, err } from 'gateways';
import {
  CommitId,
  Image,
  ImageMetadata,
  dateToTimestamp,
  Content,
  defaultVizWidth,
  getHeight,
  imageFromBase64,
  ImageId,
} from 'entities';
import { computeSrcDoc } from 'runtime';
import { GetContentAtCommit } from '../getContentAtCommit';
import { takeScreenshot } from './takeScreenshot';
import { generateImageId } from 'entities/src/Images';
import { FetchImageMetadata } from './fetchImageMetadata';

const debug = false;

// getImage
//  * Gets an image for a commit
//  * If the image has already been generated, returns it.
//  * Otherwise, generates the image and returns it.
//  * Handles concurrency issues.
//  * Does not handle access control, that is handled
//    in getThumbnail.
export const GetImage = (gateways: Gateways) => {
  const {
    getImageMetadata,
    saveImageMetadata,
    saveStoredImage,
    getStoredImage,
  } = gateways;

  const getContentAtCommit = GetContentAtCommit(gateways);
  const fetchImageMetadata = FetchImageMetadata(gateways);

  return async ({
    commitId,
  }: {
    commitId: CommitId;
  }): Promise<Result<Image | null>> => {
    if (debug) {
      console.log('getImage for commit ' + commitId);
    }

    // Fetch the image metadata
    const imageId: ImageId = generateImageId(
      commitId,
      defaultVizWidth,
    );
    const imageMetadataResult: Result<ImageMetadata | null> =
      await fetchImageMetadata(imageId);
    if (imageMetadataResult.outcome === 'failure') {
      return err(imageMetadataResult.error);
    }
    let imageMetadata = imageMetadataResult.value;

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
        id: imageId,
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
        id: imageId,
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
            await getImageMetadata(imageId);
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
      // Fetch and return the stored image
      const result = await getStoredImage(commitId);
      if (result.outcome === 'failure') {
        return err(result.error);
      }
      const storedImage = result.value;
      return ok(imageFromBase64(storedImage.base64));
    }
  };
};
