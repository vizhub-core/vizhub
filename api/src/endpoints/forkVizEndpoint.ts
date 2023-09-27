import express from 'express';
import {
  CommitId,
  Content,
  Info,
  Timestamp,
  User,
  UserId,
  Visibility,
  VizId,
} from 'entities';
import {
  Gateways,
  err,
  missingParameterError,
  ok,
} from 'gateways';
import { ForkViz } from 'interactors';

// Used for debugging forking flow.
const debug = false;

export const forkVizEndpoint = ({
  app,
  gateways,
}: {
  app: any;
  gateways: Gateways;
}) => {
  const forkViz = ForkViz(gateways);
  app.post(
    '/api/fork-viz',
    express.json(),
    async (req, res) => {
      if (req.body) {
        const {
          forkedFrom,
          owner,
          title,
          visibility,
          content,
        }: {
          forkedFrom: VizId;
          owner: UserId;
          title: string;
          visibility: Visibility;

          // Provided only if there are unforked edits.
          content?: Content;
        } = req.body;

        // Validate parameters
        if (forkedFrom === undefined) {
          res.send(
            err(missingParameterError('forkedFrom')),
          );
          return;
        }
        if (owner === undefined) {
          res.send(err(missingParameterError('owner')));
          return;
        }
        if (title === undefined) {
          res.send(err(missingParameterError('title')));
          return;
        }
        if (visibility === undefined) {
          res.send(
            err(missingParameterError('visibility')),
          );
          return;
        }

        const forkVizOptions: {
          forkedFrom: VizId; // The ID of the viz being forked.
          timestamp: Timestamp; // The timestamp at which this viz is forked.
          newOwner: UserId; // The owner of the new viz.
          content?: Content; // The content of the new viz (optional).
          title: string; // The title of the new viz.
          visibility: Visibility; // The visibility of the new viz.
          forkedFromCommitId?: CommitId; // The ID of the commit being forked from (optional).
          newVizId?: VizId; // The ID of the new viz (optional).
        } = {
          forkedFrom,
          timestamp: Date.now(),
          newOwner: owner,
          content,
          title,
          visibility,
        };

        if (debug) {
          console.log(
            'Got these options for forkViz: ',
            JSON.stringify(forkVizOptions, null, 2),
          );
        }

        const forkVizResult = await forkViz(forkVizOptions);
        if (forkVizResult.outcome === 'failure') {
          return res.send(err(forkVizResult.error));
        }
        const forkedInfo: Info = forkVizResult.value;

        // Get the owner user so that the URL can be constructed.
        const ownerResult = await gateways.getUser(owner);
        if (ownerResult.outcome === 'failure') {
          return res.send(err(ownerResult.error));
        }
        const ownerUser: User = ownerResult.value.data;

        // Return the viz ID and the owner user name.
        // This is enough information to construct the URL.
        const vizId: VizId = forkedInfo.id;
        const ownerUserName: string = ownerUser.userName;
        res.send(ok({ vizId, ownerUserName }));
      }
    },
  );
};
