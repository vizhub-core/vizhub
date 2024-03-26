import express from 'express';
import { Gateways, err } from 'gateways';
import { getAuthenticatedUserId } from '../parseAuth0User';
import { authenticationRequiredError } from 'gateways/src/errors';

export const getAPIKeysEndpoint = ({
  app,
  gateways,
}: {
  app: any;
  gateways: Gateways;
}) => {
  const { getAPIKeys } = gateways;
  app.post(
    '/api/get-api-keys',
    // express.json(),
    async (req, res) => {
      console.log('getAPIKeysEndpoint');
      // Need to be authenticated to add a comment.
      const authenticatedUserId =
        getAuthenticatedUserId(req);
      if (!authenticatedUserId) {
        res.json(err(authenticationRequiredError()));
        return;
      }

      const getAPIKeysResult = await getAPIKeys(
        authenticatedUserId,
      );

      res.send(getAPIKeysResult);
    },
  );
};
