import {
  Content,
  Info,
  Snapshot,
  VizId,
  absoluteURL,
  getHeight,
  getVizThumbnailURL,
  iframeSnippet,
  thumbnailWidth,
} from 'entities';
import express from 'express';
import {
  Gateways,
  err,
  missingParameterError,
} from 'gateways';
import {
  accessDeniedError,
  invariantViolationError,
} from 'gateways/src/errors';
import { GetInfoByIdOrSlug } from 'interactors';

// V2:
// https://github.com/vizhub-core/vizhub-legacy/blob/2a41920a083e08aa5e3729dd437c629678e71093/vizhub-v2/packages/controllers/src/oembedController.js#L5
export const oembedEndpoint = ({
  app,
  gateways,
}: {
  app: express.Express;
  gateways: Gateways;
}) => {
  const { getUserByUserName, getContent } = gateways;
  const getInfoByIdOrSlug = GetInfoByIdOrSlug(gateways);
  app.get(
    '/api/oembed',
    express.json(),
    // @ts-ignore
    async (req, res) => {
      // e.g. "https://vizhub.com/xujames0214/81f86931ad864c4db73efba71e508cda"
      const url: string = req.query.url as string;
      // console.log('url:', url);
      if (url === undefined) {
        return res.send(err(missingParameterError('url')));
      }
      const match = url.match(
        /https:\/\/vizhub.com\/([^/]+)\/([^/]+)/,
      );
      if (match === null) {
        return res.send(
          err(
            invariantViolationError(
              'Invalid URL. Expected format: https://vizhub.com/:userName/:vizId',
            ),
          ),
        );
      }
      const ownerUserName = match[1];
      const idOrSlug = match[2];

      // Validate parameters
      if (idOrSlug === undefined) {
        return res.send(
          err(missingParameterError('vizId')),
        );
      }
      if (ownerUserName === undefined) {
        return res.send(
          err(missingParameterError('userName')),
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
        return err(infoResult.error);
      }
      const infoSnapshot: Snapshot<Info> = infoResult.value;
      const info: Info = infoSnapshot.data;
      const vizId: VizId = info.id;

      // Only works on public vizzes, for now
      // TODO: support unlisted vizzes
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

      // Get the height of the viz.
      // TODO consider a more efficient way to get the height
      // e.g. query for just the height field.
      const getContentResult = await getContent(vizId);
      if (getContentResult.outcome === 'failure') {
        return res.send(getContentResult);
      }
      const content: Content = getContentResult.value.data;

      const height = getHeight(content.height);

      // Set JSON type
      res.setHeader('Content-Type', 'application/json');

      return res.send({
        version: '1.0',
        type: 'rich',

        title: info.title,
        description: 'A viz from VizHub',

        provider_name: 'VizHub',
        provider_url: 'https://vizhub.com/',

        html: iframeSnippet({
          ownerUserName,
          idOrSlug,
          height,
          brandedOption: 'branded',
        }),
        width: 960,
        height,

        thumbnail_url: absoluteURL(
          getVizThumbnailURL(info.end, thumbnailWidth),
        ),
        thumbnail_width: thumbnailWidth,
        thumbnail_height: Math.round(
          thumbnailWidth * (height / 960),
        ),

        cache_age: 3600,
      });
    },
  );
};
