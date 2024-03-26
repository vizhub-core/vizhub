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
  app.post('/api/get-api-keys', async (req, res) => {
    const authenticatedUserId = getAuthenticatedUserId(req);
    if (!authenticatedUserId) {
      res.json(err(authenticationRequiredError()));
      return;
    }

    res.send(await getAPIKeys(authenticatedUserId));
  });
};
