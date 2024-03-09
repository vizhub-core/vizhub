import {
  Content,
  File,
  Info,
  Snapshot,
  VizId,
  getRuntimeVersion,
  slugify,
} from 'entities';
import express from 'express';
import {
  Gateways,
  err,
  missingParameterError,
} from 'gateways';
import { accessDeniedError } from 'gateways/src/errors';
import { BuildViz, GetInfoByIdOrSlug } from 'interactors';
import { zipFiles } from './zipFiles';

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

  app.get(
    '/api/export-viz/:userName/:vizIdOrSlug/:format',
    express.json(),
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
        console.log('Error when fetching owner user:');
        console.log(ownerUserResult.error);
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
      if (info.visibility !== 'public') {
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
      const contentSnapshot: Snapshot<Content> =
        getContentResult.value;
      const content: Content = contentSnapshot.data;
      const runtimeVersion = getRuntimeVersion(content);

      if (runtimeVersion !== 3) {
        return res.send(
          err(
            accessDeniedError(
              'This API only supports Vite exports for runtime version 3 vizzes (no index.html present).',
            ),
          ),
        );
      }

      // TODO: Get the authenticated user ID from the request
      // based on the API key being used.
      // Setting this to undefined for now, which should
      // support public vizzes.
      const authenticatedUserId = undefined;

      // Build the viz!
      const {
        vizCacheInfoSnapshots,
        vizCacheContentSnapshots,
      }: {
        vizCacheInfoSnapshots: Record<
          VizId,
          Snapshot<Info>
        >;
        vizCacheContentSnapshots: Record<
          VizId,
          Snapshot<Content>
        >;
      } = await buildViz({
        id,
        infoSnapshot,
        contentSnapshot,
        authenticatedUserId,
      });

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

        // // File
        // //  * A file with `name` and `text`.
        // export interface File {
        //   // The file name.
        //   // e.g. "index.html".
        //   name: string;

        //   // The text content of the file.
        //   // e.g. "<body>Hello</body>"
        //   text: string;
        // }

        let allFiles: Array<File> = [];

        // For each vizCacheInfoSnapshots
        for (const [vizId, infoSnapshot] of Object.entries(
          vizCacheInfoSnapshots,
        )) {
          const info: Info = infoSnapshot.data;
          const contentSnapshot =
            vizCacheContentSnapshots[vizId];
          const content: Content = contentSnapshot.data;

          const directoryName =
            info.slug || slugify(info.title);
          const directory = `vizhub-exports/${ownerUserName}/${directoryName}`;

          // Place the files in the directory.
          const vizFiles: Array<File> = Object.values(
            content.files,
          ).map((file: File) => ({
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
          if (packageJsonFile) {
            const packageJson = JSON.parse(
              packageJsonFile.text,
            );
            packageJson.name = `${ownerUserName}/${directoryName}`;
            packageJsonFile.text = JSON.stringify(
              packageJson,
              null,
              2,
            );
          } else {
            // If there is no package.json file, create one
            const newPackageJson = {
              name: `${ownerUserName}/${directoryName}`,
            };
            vizFiles.push({
              name: `${directory}/package.json`,
              text: JSON.stringify(newPackageJson, null, 2),
            });
          }

          allFiles = [...allFiles, ...vizFiles];
        }

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
      }
    },
  );
};
