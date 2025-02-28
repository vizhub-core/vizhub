import {
  CommitId,
  Content,
  defaultVizWidth,
  getHeight,
  Info,
  VizId,
} from 'entities';
import { rollup } from 'rollup';
import {
  CommitImageKey,
  thumbnailWidth,
} from 'entities/src/Images';
import { Gateways } from 'gateways';
import { compile } from 'svelte/compiler';
import {
  ImageKey,
  isImageKeyExpired,
  ScreenshotGenie,
} from 'screenshotgenie';
import { GetContentAtCommit } from './getContentAtCommit';
import {
  computeSrcDoc,
  createVizCache,
  VizCache,
} from '@vizhub/runtime';
import { ResolveSlug } from './resolveSlug';

const DEBUG = false;

let screenshotgenie: ScreenshotGenie;

export const GetThumbnailURLs = (gateways: Gateways) => {
  const { getCommitImageKeys, getContent } = gateways;
  const getContentAtCommit = GetContentAtCommit(gateways);
  const resolveSlug = ResolveSlug(gateways);

  return async (
    commitIds: Array<CommitId>,
    width: number = thumbnailWidth,
  ): Promise<Record<CommitId, string>> => {
    // Lazily initialize the screenshotgenie client.
    if (!screenshotgenie) {
      try {
        screenshotgenie = new ScreenshotGenie();
      } catch (e) {
        // Don't totally crash out in development
        // if the developer has not set up the
        // screenshotgenie environment variables.
        console.error(e);
        return {};
      }
    }

    // 1.) Get the image keys for the commits, if any.
    const commitImageKeysResult =
      await getCommitImageKeys(commitIds);
    if (commitImageKeysResult.outcome === 'failure') {
      DEBUG && console.error(commitImageKeysResult.error);
      return {};
    }
    const oldCommitImageKeys: Array<CommitImageKey> =
      commitImageKeysResult.value;
    const oldCommitImageKeysByCommitId: Record<
      CommitId,
      CommitImageKey
    > = oldCommitImageKeys.reduce((acc, commitImageKey) => {
      acc[commitImageKey.commitId] = commitImageKey;
      return acc;
    }, {});

    // 2.) Figure out which commits need new image keys.
    const commitIdsNeedingNewImageKeys: Array<CommitId> =
      // A commit is in need of a new image key if...
      commitIds.filter((commitId) => {
        const commitImageKey =
          oldCommitImageKeysByCommitId[commitId];

        // it doesn't have one in the DB, or
        if (!commitImageKey) {
          DEBUG &&
            console.log(
              'no image key for commitId ',
              commitId,
            );
          return true;
        }
        // the image key is expired.
        // DEBUG &&
        //   console.log(
        //     'calling isImageKeyExpired for ',
        //     commitImageKey.imageKey,
        //   );
        if (isImageKeyExpired(commitImageKey.imageKey)) {
          return true;
        }

        // DEBUG && console.log('image key is not expired ');

        return false;
      });

    DEBUG &&
      console.log(
        'commitIdsNeedingNewImageKeys ',
        JSON.stringify(
          commitIdsNeedingNewImageKeys,
          null,
          2,
        ),
      );

    // process.exit(0);

    // For each commit that needs a new image key, create one.
    const newCommitImageKeys: Array<CommitImageKey> = [];
    for (const commitId of commitIdsNeedingNewImageKeys) {
      const contentResult =
        await getContentAtCommit(commitId);

      if (contentResult.outcome === 'failure') {
        DEBUG && console.error(contentResult.error);
        continue;
      }
      const content = contentResult.value;

      // console.log(
      //   JSON.stringify(content, null, 2).substring(0, 200),
      // );

      const vizCache: VizCache = createVizCache({
        initialContents: [content],
        handleCacheMiss: async (vizId: VizId) => {
          if (DEBUG) {
            console.log(
              '  [GetThumbnailURLs] Handling cache miss for vizId',
              vizId,
            );
          }
          const contentResult = await getContent(vizId);
          if (contentResult.outcome === 'failure') {
            console.log(
              '  [GetThumbnailURLs] Error when fetching content for viz cache:',
            );
            console.log(contentResult.error);
            return null;
          }

          if (DEBUG) {
            console.log(
              '  [GetThumbnailURLs] Fetched content for viz cache',
            );
            // console.log(contentResult.value.data);
          }
          return contentResult.value.data;
        },
      });

      const { initialSrcdoc } = await computeSrcDoc({
        rollup,
        content,
        vizCache,
        resolveSlug,
        getSvelteCompiler: async () => compile,
      });

      // In case of build errors, just use an empty HTML document.
      // We can't use empty string HTML documents for the screenshotgenie
      // API, so we use a minimal HTML document instead.
      const html = initialSrcdoc || '<html></html>';

      const imageGenerationInputs = {
        html,
        width: defaultVizWidth,
        height: getHeight(content.height),
      };

      try {
        const imageKey: ImageKey =
          await screenshotgenie.createImageKey(
            imageGenerationInputs,
          );

        const commitImageKey: CommitImageKey = {
          commitId,
          imageKey,
        };
        newCommitImageKeys.push(commitImageKey);
      } catch (e) {
        console.error(e);

        // If this errors out, we don't want to
        // crash the whole process, so we just
        // skip this commit.
        continue;
      }
    }

    // Save the new image keys to the DB.
    DEBUG &&
      console.log(
        'saving newCommitImageKeys ',
        newCommitImageKeys,
      );
    await gateways.saveCommitImageKeys(newCommitImageKeys);

    // Combine the old and new image keys.
    const commitImageKeys: Array<CommitImageKey> = [
      ...oldCommitImageKeys,
      ...newCommitImageKeys,
    ];

    const thumbnailURLs: Record<CommitId, string> =
      commitImageKeys.reduce((acc, commitImageKey) => {
        acc[commitImageKey.commitId] =
          screenshotgenie.getImageUrl(
            commitImageKey.imageKey,
            width,
          );
        return acc;
      }, {});

    // console.log(JSON.stringify(thumbnailURLs, null, 2));

    return thumbnailURLs;
  };
};
