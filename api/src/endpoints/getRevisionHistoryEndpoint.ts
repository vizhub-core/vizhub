import express from 'express';
import {
  Gateways,
  Result,
  err,
  missingParameterError,
} from 'gateways';
import { getAuthenticatedUserId } from '../parseAuth0User';
import { VerifyVizAccess } from 'interactors';
import { VizAccess } from 'interactors/src/verifyVizAccess';
import { accessDeniedError } from 'gateways/src/errors';

export const getRevisionHistoryEndpoint = ({
  app,
  gateways,
}: {
  app: any;
  gateways: Gateways;
}) => {
  const { getRevisionHistory, getInfo } = gateways;
  const verifyVizAccess = VerifyVizAccess(gateways);
  app.post(
    '/api/get-revision-history',
    express.json(),
    async (req, res) => {
      if (req.body) {
        const { vizId } = req.body;

        // Validate that the vizId is provided.
        if (vizId === undefined) {
          res.send(err(missingParameterError('vizId')));
          return;
        }

        // Validate that the authenticated user
        // is allowed to access this viz.
        const authenticatedUserId =
          getAuthenticatedUserId(req);
        const infoResult = await getInfo(vizId);
        if (infoResult.outcome === 'failure') {
          return err(infoResult.error);
        }
        const vizAccessResult: Result<VizAccess> =
          await verifyVizAccess({
            authenticatedUserId,
            info: infoResult.value.data,
            actions: ['read'],
          });
        if (vizAccessResult.outcome === 'failure') {
          return err(vizAccessResult.error);
        }
        if (!vizAccessResult.value.read) {
          return err(
            accessDeniedError('Read access denied'),
          );
        }

        return res.send(await getRevisionHistory(vizId));
      }
    },
  );
};
