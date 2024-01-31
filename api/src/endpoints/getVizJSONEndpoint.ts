import { Content, Info, VizId } from 'entities';
import express from 'express';
import {
  Gateways,
  err,
  missingParameterError,
} from 'gateways';
import { accessDeniedError } from 'gateways/src/errors';

export const getVizJSONEndpoint = ({
  app,
  gateways,
}: {
  app: express.Express;
  gateways: Gateways;
}) => {
  const { getInfo, getContent } = gateways;
  app.get(
    '/api/get-viz/:userName/:vizIdOrSlug.json',

    express.json(),
    async (req, res) => {
      // Get vizId param

      // TODO support slugs
      const vizId: VizId | undefined =
        req.params?.vizIdOrSlug;

      if (vizId === undefined) {
        return res.send(
          err(missingParameterError('vizId')),
        );
      }

      const getInfoResult = await getInfo(vizId);
      if (getInfoResult.outcome === 'failure') {
        return res.send(getInfoResult);
      }

      // Only works on public vizzes, for now
      const info: Info = getInfoResult.value.data;

      if (info.visibility !== 'public') {
        return res.send(
          err(
            accessDeniedError(
              'This viz is not public. This API only supports public vizzes.',
            ),
          ),
        );
      }

      const getContentResult = await getContent(vizId);
      if (getContentResult.outcome === 'failure') {
        return res.send(getContentResult);
      }
      const content: Content = getContentResult.value.data;

      // Set JSON type
      res.setHeader('Content-Type', 'application/json');

      res.send(
        JSON.stringify(
          {
            info,
            content,
          },
          null,
          2,
        ),
      );
    },
  );
};
