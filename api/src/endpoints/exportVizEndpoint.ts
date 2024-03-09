import {
  Content,
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
import { GetInfoByIdOrSlug } from 'interactors';
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
      const content: Content = getContentResult.value.data;
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

      if (format === 'vite') {
        const zipBuffer: Buffer = zipFiles(content.files);
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
