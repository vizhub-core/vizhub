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
  imageFromBase64,
  ImageId,
} from 'entities';
import {
  VerifyVizAccess,
  VizAccess,
} from '../verifyVizAccess';
import { accessDeniedError } from 'gateways/src/errors';
import { resizeImage } from './resizeImage';
import { generateImageId } from 'entities/src/Images';
import { GetImage } from '../getImage';

const debug = false;

// getThumbnail
//  * Gets a resized image for a commit
//  * Invokes getImage if the image has not been generated yet.
//  * Handles access control.
export const GetThumbnail = (gateways: Gateways) => {
  const {
    getCommit,
    getInfo,
    getImageMetadata,
    saveImageMetadata,
    saveStoredImage,
    getStoredImage,
  } = gateways;

  const verifyVizAccess = VerifyVizAccess(gateways);
  const getImage = GetImage(gateways);

  return async ({
    commitId,
    authenticatedUserId,
    width,
  }: {
    commitId: CommitId;
    authenticatedUserId: UserId | undefined;
    width: number;
  }): Promise<Result<Image | null>> => {
    if (debug) {
      console.log('getThumbnail for commit ' + commitId);
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

    // Fetch the image metadata for this thumbnail.
    // TODO refactor this to eliminate duplication
    // between here and getImage
    const imageId: ImageId = generateImageId(
      commitId,
      width,
    );
    let imageMetadata: ImageMetadata | undefined;
    const imageMetadataResult =
      await getImageMetadata(imageId);
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
      const potentiallyBogusImageMetadata =
        imageMetadataResult.value.data;
      const generatedTimestamp =
        potentiallyBogusImageMetadata.lastAccessed;
      const nowTimestamp = dateToTimestamp(new Date());
      const elapsedSeconds =
        nowTimestamp - generatedTimestamp;

      // If the generation started more than 1 minute ago,
      // AND hasn't finished yet, then we should
      // assume it failed, and try again.
      if (
        potentiallyBogusImageMetadata.status ===
          'generating' &&
        elapsedSeconds > 60
      ) {
        if (debug) {
          console.log(
            '  [GetThumbnail] generation started more than 1 minute ago, assuming it failed, and trying again',
          );
        }
      } else {
        // If less than 1 minute ago, assume the image
        // is still being generated.
        imageMetadata = imageMetadataResult.value.data;
      }
    }

    // If the image metadata is not found, assume
    // the image status is 'not started'.
    if (!imageMetadata) {
      if (debug) {
        console.log(
          '  [GetThumbnail] image metadata not found, invoking getImage',
        );
      }
      // Store the metadata that indicates the image
      // is being generated.
      await saveImageMetadata({
        id: imageId,
        commitId,
        width,
        status: 'generating',
        lastAccessed: dateToTimestamp(new Date()),
      });

      if (debug) {
        console.log(
          '  [GetThumbnail] saved image metadata with status "generating"',
        );
      }

      const fullSizeImageResult = await getImage({
        commitId,
      });
      if (fullSizeImageResult.outcome === 'failure') {
        return err(fullSizeImageResult.error);
      }
      const fullSizeImage = fullSizeImageResult.value;

      if (debug) {
        console.log('  [GetThumbnail] resizing image');
      }
      // Resize the image
      const resizedImage: Image = await resizeImage({
        image: fullSizeImage,
        width,
      });

      // Save the resized image
      const saveResult = await saveStoredImage({
        id: imageId,
        base64: resizedImage.buffer.toString('base64'),
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
        width,
        status: 'generated',
        lastAccessed: dateToTimestamp(new Date()),
      });

      // Return the image
      return ok(resizedImage);
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
      // Fetch and return the stored image
      const result = await getStoredImage(imageId);
      if (result.outcome === 'failure') {
        return err(result.error);
      }
      const storedImage = result.value;
      return ok(imageFromBase64(storedImage.base64));
    }
  };
};
