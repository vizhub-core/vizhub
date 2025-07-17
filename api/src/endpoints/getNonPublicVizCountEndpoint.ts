import bodyParser from 'body-parser';
import { getAuthenticatedUserId } from '../parseAuth0User';
import { err, Gateways, ok } from 'gateways';
import { authenticationRequiredError } from 'gateways/src/errors';

export const getNonPublicVizCountEndpoint = ({
  app,
  gateways,
}: {
  app: any;
  gateways: Gateways;
}) => {
  const { getInfos } = gateways;

  app.post(
    '/api/get-non-public-viz-count/',
    bodyParser.json(),
    async (req, res) => {
      try {
        const authenticatedUserId =
          getAuthenticatedUserId(req);

        if (!authenticatedUserId) {
          res.json(err(authenticationRequiredError()));
          return;
        }

        // Get all private and unlisted vizzes for this user
        const infosResult = await getInfos({
          owner: authenticatedUserId,
          visibilities: ['private', 'unlisted'],
          disablePagination: true,
        });

        if (infosResult.outcome === 'failure') {
          res.json(err(infosResult.error));
          return;
        }

        const count = infosResult.value.length;

        res.json(ok({ count }));
      } catch (error) {
        console.error(
          '[getNonPublicVizCountEndpoint] error:',
          error,
        );
        res.json(err(error));
      }
    },
  );
};
