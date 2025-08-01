import {
  VizContent,
  VizFile,
  VizId,
} from '@vizhub/viz-types';
import { determineRuntimeVersion } from '@vizhub/runtime';
import { Info, Snapshot, slugify } from 'entities';
import express from 'express';
import {
  Gateways,
  err,
  missingParameterError,
} from 'gateways';
import { accessDeniedError } from 'gateways/src/errors';
import {
  BuildViz,
  GetInfoByIdOrSlug,
  RecordAnalyticsEvents,
  GetAPIKeyOwner,
} from 'interactors';
import { zipFiles } from './zipFiles';
import { BuildVizResult } from 'interactors/src/buildViz';
import { vizFilesToFileCollection } from '@vizhub/viz-utils';
import { getAuthenticatedUserId } from '../parseAuth0User';

export const exportVizEndpoint = ({
  app,
  gateways,
}: {
  app: express.Express;
  gateways: Gateways;
}) => {
  const { getUserByUserName, getContent } = gateways;
  const getInfoByIdOrSlug = GetInfoByIdOrSlug(gateways);
  const buildViz = BuildViz(gateways);
  const recordAnalyticsEvents =
    RecordAnalyticsEvents(gateways);
  const getAPIKeyOwner = GetAPIKeyOwner(gateways);

  app.get(
    '/api/export-viz/:userName/:vizIdOrSlug/:format',
    express.json(),
    // @ts-ignore
    async (req, res) => {
      const idOrSlug: VizId | undefined =
        req.params?.vizIdOrSlug;
      const ownerUserName: string = req.params?.userName;
      const format: string = req.params?.format;

      if (format !== 'vite') {
        return res.send(
          err(
            accessDeniedError(
              'This API only supports Vite exports',
            ),
          ),
        );
      }

      if (idOrSlug === undefined) {
        return res.send(
          err(missingParameterError('vizIdOrSlug')),
        );
      }

      // Get the User entity for the owner of the viz.
      const ownerUserResult =
        await getUserByUserName(ownerUserName);
      if (ownerUserResult.outcome === 'failure') {
        // console.log('Error when fetching owner user:');
        // console.log(ownerUserResult.error);
        return null;
      }
      const ownerUserSnapshot = ownerUserResult.value;
      const userId = ownerUserSnapshot.data.id;

      // Get the Info entity of the Viz.
      const infoResult = await getInfoByIdOrSlug({
        userId,
        idOrSlug,
      });
      if (infoResult.outcome === 'failure') {
        // Indicates viz not found
        return null;
      }
      const infoSnapshot: Snapshot<Info> = infoResult.value;
      const info: Info = infoSnapshot.data;
      const id = info.id;

      // Only works on public vizzes, for now
      if (
        info.visibility !== 'public' &&
        info.visibility !== 'unlisted'
      ) {
        return res.send(
          err(
            accessDeniedError(
              'This viz is not public. This API only supports public vizzes.',
            ),
          ),
        );
      }

      const getContentResult = await getContent(id);
      if (getContentResult.outcome === 'failure') {
        return res.send(getContentResult);
      }
      const contentSnapshot: Snapshot<VizContent> =
        getContentResult.value;
      const content: VizContent = contentSnapshot.data;
      const runtimeVersion = determineRuntimeVersion(
        vizFilesToFileCollection(content?.files),
      );

      if (runtimeVersion !== 'v3') {
        return res.send(
          err(
            accessDeniedError(
              'This API only supports Vite exports for runtime version 3 vizzes (no index.html present).',
            ),
          ),
        );
      }

      // Get the authenticated user ID from the request
      // Either from web session or API key
      let authenticatedUserId = undefined;

      // Try to get authenticated user from web session first
      const webAuthUserId = getAuthenticatedUserId(req);
      if (webAuthUserId) {
        authenticatedUserId = webAuthUserId;
      } else {
        // Try to get authenticated user from API key
        const apiKeyString: string | undefined =
          req.headers.authorization;
        if (apiKeyString) {
          const apiKeyOwnerResult =
            await getAPIKeyOwner(apiKeyString);
          if (apiKeyOwnerResult.outcome === 'success') {
            authenticatedUserId = apiKeyOwnerResult.value;
          }
        }
      }

      // Build the viz, to get the imported vizzes!
      const buildVizResult: BuildVizResult = await buildViz(
        {
          type: 'live',
          id,
          infoSnapshot,
          contentSnapshot,
          authenticatedUserId,
        },
      );

      if (buildVizResult.type !== 'live') {
        throw new Error('Expected live buildVizResult');
      }

      const {
        vizCacheInfoSnapshots,
        vizCacheContentSnapshots,
        slugResolutionCache,
      } = buildVizResult;

      // Lets us look up the slug (${userName}/${slug}) for a given viz ID.
      // Example value of this map:
      // {
      //   "19e8cbd752a540eba9cbcb9200889119": "curran/blue-background"
      // }
      // NOTE: This does not include the top level viz, only imported ones.
      const idToSlugMap: Record<VizId, string> =
        Object.entries(slugResolutionCache).reduce(
          (acc, [slug, vizId]) => {
            acc[vizId] = slug;
            return acc;
          },
          {},
        );

      const getSlug = (info) =>
        info.slug || slugify(info.title);

      const getFullSlug = (vizId: VizId) => {
        let fullSlug = idToSlugMap[vizId];
        if (!fullSlug) {
          // In this case, it's the top level viz.
          fullSlug = `${ownerUserName}/${getSlug(vizCacheInfoSnapshots[vizId].data)}`;
        }
        return fullSlug;
      };

      if (format === 'vite') {
        // TODO migrate this part into an Interactor and
        // add proper tests for it
        // - [X] Pull in transitive dependencies similar to VizPage server
        // - [X] Generate the exported files under the `vizhub-exports` directory
        // - [ ] Modify (or create) `package.json` files that define `name`
        // - [ ] Pull in the code from VizHub Rosetta Stone
        // - [ ] Generate the export top level package.json defining workspaces
        // - The file tree will look like this:
        //   - sligified-title/
        //     - package.json - defines workspaces
        //     - app/ - contains the Vite app
        //       - imports from vizhub-exports/curran/id-or-slug-for-exported-viz-entry-point/
        //     - vizhub-exports/
        //       - curran/
        //         - id-or-slug-for-exported-viz-entry-point/
        //         - slug-for-imported-viz-1/
        //         - slug-for-imported-viz-2/
        //         - slug-for-imported-viz-3/

        let allFiles: Array<VizFile> = [];

        // For each vizCacheInfoSnapshots
        for (const [vizId, infoSnapshot] of Object.entries(
          vizCacheInfoSnapshots,
        )) {
          const info: Info = infoSnapshot.data;
          const contentSnapshot =
            vizCacheContentSnapshots[vizId];
          const content: VizContent = contentSnapshot.data;

          const directoryName = getSlug(info);
          // const fullSlug = `${userName}/${directoryName}`;
          // const directory = `vizhub-exports/${userName}/${directoryName}`;

          // Look up the full slug for the viz ID.
          const fullSlug = getFullSlug(vizId);
          const directory = `vizhub-exports/${fullSlug}`;

          // Place the files in the directory.
          const vizFiles: Array<VizFile> = Object.values(
            content.files,
          ).map((file: VizFile) => ({
            name: `${directory}/${file.name}`,
            text: file.text,
          }));

          //////////////////////////////////////
          // Add `name` field to package.json //
          //////////////////////////////////////

          // Check if there is a package.json file in the directory
          const packageJsonFile = vizFiles.find((file) =>
            file.name.endsWith('package.json'),
          );

          // If there is a package.json file, update the name field
          const nameField = `@${ownerUserName}/${directoryName}`;
          if (packageJsonFile) {
            // Attempt to add the `name` field to the package.json file.
            try {
              const packageJson = JSON.parse(
                packageJsonFile.text,
              );
              packageJson.name = nameField;
              packageJsonFile.text = JSON.stringify(
                packageJson,
                null,
                2,
              );
            } catch (e) {
              // Invalid JSON? Oh well! ¯\_(ツ)_/¯
              // No name field for you.
            }
          } else {
            // If there is no package.json file, create one
            const newPackageJson = {
              name: nameField,
            };
            vizFiles.push({
              name: `${directory}/package.json`,
              text: JSON.stringify(newPackageJson, null, 2),
            });
          }

          allFiles = [...allFiles, ...vizFiles];
        }

        // TODO? Add the top level package.json that defines the
        // NPM workspaces for the exported vizzes.
        // const topLevelPackageJson: File = {
        //   name: 'package.json',
        //   text: JSON.stringify(
        //     {
        //       name: '@vizhub/exports',
        //       workspaces: Object.values(
        //         vizCacheInfoSnapshots,
        //       ).map(
        //         (vizId) =>
        //           `vizhub-exports/${ownerUserName}/${vizId}`,
        //       ),
        //     },
        //     null,
        //     2,
        //   ),
        // };

        const zipBuffer: Buffer = zipFiles(
          Object.values(allFiles),
        );
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader(
          'Content-Disposition',
          // This simple version crashes the server if there are emojis in the title
          // `attachment; filename="${info.title}.zip"`,
          // This new version:
          // - uses the slug if it exists
          // - otherwise slugifies the title (which removes emojis)
          `attachment; filename="${info.slug || slugify(info.title)}.zip"`,
        );
        res.send(zipBuffer);

        await recordAnalyticsEvents({
          eventId: `event.exportViz`,
        });
      }
    },
  );
};
