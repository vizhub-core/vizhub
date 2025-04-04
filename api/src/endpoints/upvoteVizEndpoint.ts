import express from 'express';
import { dateToTimestamp } from 'entities';
import {
  Gateways,
  err,
  missingParameterError,
} from 'gateways';
import { getAuthenticatedUserId } from '../parseAuth0User';
import { authenticationRequiredError } from 'gateways/src/errors';
import { UpvoteViz } from 'interactors';
import { VizId } from '@vizhub/viz-types';

export const upvoteVizEndpoint = ({
  app,
  gateways,
}: {
  app: any;
  gateways: Gateways;
}) => {
  const upvoteViz = UpvoteViz(gateways);
  app.post(
    '/api/upvote-viz',
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

        const upvoteVizResult = await upvoteViz({
          viz: vizId,
          user: authenticatedUserId,
          timestamp: dateToTimestamp(new Date()),
        });
        res.send(upvoteVizResult);
      }
    },
  );
};
