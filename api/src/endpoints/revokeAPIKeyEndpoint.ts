import express from 'express';
import { APIKeyId } from 'entities';
import { Gateways, err } from 'gateways';
import { getAuthenticatedUserId } from '../parseAuth0User';
import { authenticationRequiredError } from 'gateways/src/errors';
import { RevokeAPIKey } from 'interactors';

export const revokeAPIKeyEndpoint = ({
  app,
  gateways,
}: {
  app: any;
  gateways: Gateways;
}) => {
  const revokeAPIKey = RevokeAPIKey(gateways);
  app.post(
    '/api/revoke-api-key',
    express.json(),
    async (req, res) => {
      if (req.body) {
        const {
          apiKeyId,
        }: {
          apiKeyId: APIKeyId;
        } = req.body;

        // Need to be authenticated to revoke an API key.
        const authenticatedUserId =
          getAuthenticatedUserId(req);
        if (!authenticatedUserId) {
          res.json(err(authenticationRequiredError()));
          return;
        }

        const generateAPIKeyResult = await revokeAPIKey({
          authenticatedUserId,
          apiKeyId,
        });

        res.send(generateAPIKeyResult);
      }
    },
  );
};
