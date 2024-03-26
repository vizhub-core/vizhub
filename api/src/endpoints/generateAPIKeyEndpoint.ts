import express from 'express';
import { dateToTimestamp } from 'entities';
import { Gateways, err } from 'gateways';
import { getAuthenticatedUserId } from '../parseAuth0User';
import {
  authenticationRequiredError,
  missingParameterError,
} from 'gateways/src/errors';
import { GenerateAPIKey } from 'interactors';

export const generateAPIKeyEndpoint = ({
  app,
  gateways,
}: {
  app: any;
  gateways: Gateways;
}) => {
  const generateAPIKey = GenerateAPIKey(gateways);
  app.post(
    '/api/generate-api-key',
    express.json(),
    async (req, res) => {
      if (req.body) {
        const {
          name,
        }: {
          name: string;
        } = req.body;

        // Need to be authenticated to add a comment.
        const authenticatedUserId =
          getAuthenticatedUserId(req);
        if (!authenticatedUserId) {
          res.json(err(authenticationRequiredError()));
          return;
        }

        // Validate that a name was provided
        if (!name) {
          res.json(err(missingParameterError('name')));
          return;
        }

        const generateAPIKeyResult = await generateAPIKey({
          name,
          owner: authenticatedUserId,
          timestamp: dateToTimestamp(new Date()),
        });

        res.send(generateAPIKeyResult);
      }
    },
  );
};
