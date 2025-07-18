import {
  CommitId,
  defaultVizWidth,
  getHeight,
} from 'entities';
import { rollup } from 'rollup';
import {
  build,
  createVizCache,
  SvelteCompiler,
  VizCache,
} from '@vizhub/runtime';
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
import { ResolveSlug } from './resolveSlug';
import { VizId } from '@vizhub/viz-types';
import { vizFilesToFileCollection } from '@vizhub/viz-utils';
import type { BuildResult } from '@vizhub/runtime';

const DEBUG = false;

let screenshotgenie: ScreenshotGenie;

export const GetThumbnailURLs = (gateways: Gateways) => {
  const { getCommitImageKeys, getContent } = gateways;
  const getContentAtCommit = GetContentAtCommit(gateways);
  const slugCache = ResolveSlug(gateways);

  return async (
    commitIds: Array<CommitId>,
    width: number = thumbnailWidth,
  ): Promise<{
    thumbnailURLs: Record<CommitId, string>;
    fullResolutionURLs: Record<CommitId, string>;
    generateAndSaveNewImageKeys: () => Promise<void>;
  }> => {
    // Lazily initialize the screenshotgenie client.
    const noop = {
      thumbnailURLs: {},
      fullResolutionURLs: {},
      generateAndSaveNewImageKeys: async () => {},
    };
    if (!screenshotgenie) {
      try {
        screenshotgenie = new ScreenshotGenie();
      } catch (e) {
        // Don't totally crash out in development
        // if the developer has not set up the
        // screenshotgenie environment variables.
        console.error(e);
        return noop;
      }
    }

    // 1.) Get the image keys for the commits, if any.
    const commitImageKeysResult =
      await getCommitImageKeys(commitIds);
    if (commitImageKeysResult.outcome === 'failure') {
      DEBUG && console.error(commitImageKeysResult.error);
      return noop;
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

    const generateAndSaveNewImageKeys = async () => {
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

        let initialSrcdoc;

        try {
          const buildResult: BuildResult = await build({
            vizId: content.id,
            rollup,
            files: vizFilesToFileCollection(content?.files),
            vizCache,
            slugCache,
            getSvelteCompiler: async () =>
              compile as unknown as SvelteCompiler,
          });
          initialSrcdoc = buildResult.html;
        } catch (e) {
          // Fail silently if the build fails.
          // Sometimes vizzes are broken and we don't want to
          // crash the whole process.
        }

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

          // console.log('imageGenerationInputs:');

          // console.log(
          //   JSON.stringify(imageGenerationInputs, null, 2),
          // );

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
      await gateways.saveCommitImageKeys(
        newCommitImageKeys,
      );
    };

    // // Combine the old and new image keys.
    // const commitImageKeys: Array<CommitImageKey> = [
    //   ...oldCommitImageKeys,
    //   ...newCommitImageKeys,
    // ];

    const commitImageKeys = oldCommitImageKeys;

    const thumbnailURLs: Record<CommitId, string> =
      commitImageKeys.reduce((acc, commitImageKey) => {
        acc[commitImageKey.commitId] =
          screenshotgenie.getImageUrl(
            commitImageKey.imageKey,
            width,
          );
        return acc;
      }, {});

    const fullResolutionURLs: Record<CommitId, string> =
      commitImageKeys.reduce((acc, commitImageKey) => {
        acc[commitImageKey.commitId] =
          screenshotgenie.getImageUrl(
            commitImageKey.imageKey,
            defaultVizWidth,
          );
        return acc;
      }, {});

    // console.log(JSON.stringify(thumbnailURLs, null, 2));

    return {
      thumbnailURLs,
      fullResolutionURLs,
      generateAndSaveNewImageKeys,
    };
  };
};
