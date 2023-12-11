import express from 'express';
import {
  Timestamp,
  VizId,
  dateToTimestamp,
} from 'entities';
import {
  Gateways,
  err,
  missingParameterError,
} from 'gateways';
import { TrashViz } from 'interactors';

// Used for debugging trashing flow.
const debug = false;

export const trashVizEndpoint = ({
  app,
  gateways,
}: {
  app: any;
  gateways: Gateways;
}) => {
  const trashViz = TrashViz(gateways);
  app.post(
    '/api/trash-viz',
    express.json(),
    async (req, res) => {
      if (req.body) {
        const {
          id,
        }: {
          id: VizId;
        } = req.body;

        // Validate parameters
        if (id === undefined) {
          res.send(err(missingParameterError('id')));
          return;
        }

        const trashVizOptions: {
          id: VizId;
          timestamp: Timestamp;
        } = {
          id,
          timestamp: dateToTimestamp(new Date()),
        };

        if (debug) {
          console.log(
            'Got these options for trashViz: ',
            JSON.stringify(trashVizOptions, null, 2),
          );
        }

        const trashVizResult =
          await trashViz(trashVizOptions);
        if (trashVizResult.outcome === 'failure') {
          return res.send(err(trashVizResult.error));
        }

        res.send(trashVizResult);
      }
    },
  );
};
