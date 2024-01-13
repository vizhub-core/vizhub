import express from 'express';
import {
  Gateways,
  err,
  missingParameterError,
  ok,
} from 'gateways';

export const isSlugAvailableEndpoint = ({
  app,
  gateways,
}: {
  app: any;
  gateways: Gateways;
}) => {
  const { getInfoByUserAndSlug } = gateways;
  app.post(
    '/api/is-slug-available',
    express.json(),
    async (req, res) => {
      if (req.body) {
        const { owner, slug } = req.body;

        if (owner === undefined) {
          res.send(err(missingParameterError('owner')));
          return;
        }
        if (slug === undefined) {
          res.send(err(missingParameterError('slug')));
          return;
        }

        const getInfoResult = await getInfoByUserAndSlug({
          userId: owner,
          slug,
        });
        if (getInfoResult.outcome === 'failure') {
          if (
            getInfoResult.error.code === 'resourceNotFound'
          ) {
            // If the info is not found, then the slug is available.
            res.send(ok(true));
            return;
          }
        }

        // If the info is found, then the slug is not available.
        res.send(ok(false));
      }
    },
  );
};
