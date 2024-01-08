import express from 'express';
import { VizId } from 'entities';
import {
  Gateways,
  err,
  missingParameterError,
} from 'gateways';
import { getAuthenticatedUserId } from '../parseAuth0User';
import { authenticationRequiredError } from 'gateways/src/errors';
import { UnUpvoteViz } from 'interactors';

export const unUpvoteVizEndpoint = ({
  app,
  gateways,
}: {
  app: any;
  gateways: Gateways;
}) => {
  const unUpvoteViz = UnUpvoteViz(gateways);
  app.post(
    '/api/un-upvote-viz',
    express.json(),
    async (req, res) => {
      if (req.body) {
        const {
          vizId,
        }: {
          vizId: VizId;
        } = req.body;

        // Validate parameters
        if (vizId === undefined) {
          res.send(err(missingParameterError('vizId')));
          return;
        }

        // Need to be authenticated to add a permission.
        const authenticatedUserId =
          getAuthenticatedUserId(req);
        if (!authenticatedUserId) {
          res.json(err(authenticationRequiredError()));
          return;
        }

        const upvoteVizResult = await unUpvoteViz({
          viz: vizId,
          user: authenticatedUserId,
        });
        res.send(upvoteVizResult);
      }
    },
  );
};
