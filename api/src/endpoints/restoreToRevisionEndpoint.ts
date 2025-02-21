import express from 'express';
import { Gateways } from 'gateways';
import { getAuthenticatedUserId } from '../parseAuth0User';
import { RestoreToRevision } from 'interactors';

const DEBUG = false;

export const restoreToRevisionEndpoint = ({
  app,
  gateways,
}: {
  app: any;
  gateways: Gateways;
}) => {
  const restoreToRevision = RestoreToRevision(gateways);
  app.post(
    '/api/restore-to-revision',
    express.json(),
    async (req, res) => {
      DEBUG &&
        console.log(
          '[restoreToRevisionEndpoint] ',
          req.body,
        );
      if (req.body) {
        const { vizId, commitId } = req.body;
        const authenticatedUserId =
          getAuthenticatedUserId(req);

        return res.send(
          await restoreToRevision({
            vizId,
            commitId,
            authenticatedUserId,
          }),
        );
      }
    },
  );
};
