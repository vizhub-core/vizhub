import express from 'express';
import { Gateways } from 'gateways';
import { getAuthenticatedUserId } from '../parseAuth0User';
import { GetRevisionHistory } from 'interactors';

export const getRevisionHistoryEndpoint = ({
  app,
  gateways,
}: {
  app: any;
  gateways: Gateways;
}) => {
  const getRevisionHistory = GetRevisionHistory(gateways);
  app.post(
    '/api/get-revision-history',
    express.json(),
    async (req, res) => {
      if (req.body) {
        return res.send(
          await getRevisionHistory({
            vizId: req.body.vizId,
            authenticatedUserId:
              getAuthenticatedUserId(req),
          }),
        );
      }
    },
  );
};
