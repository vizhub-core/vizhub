import bodyParser from 'body-parser';
import { getAuthenticatedUserId } from '../parseAuth0User';
import { err, Gateways, ok } from 'gateways';
import { authenticationRequiredError } from 'gateways/src/errors';

export const getAIUsageEndpoint = ({
  app,
  gateways,
}: {
  app: any;
  gateways: Gateways;
}) => {
  const { getUser, getAIEditMetadataForUser } = gateways;

  app.post(
    '/api/get-ai-usage/',
    bodyParser.json(),
    async (req, res) => {
      try {
        const authenticatedUserId =
          getAuthenticatedUserId(req);

        if (!authenticatedUserId) {
          res.json(err(authenticationRequiredError()));
          return;
        }

        const userResult = await getUser(
          authenticatedUserId,
        );
        if (userResult.outcome === 'failure') {
          res.json(err(userResult.error));
          return;
        }

        // Get the user ID from the request body
        const { userId } = req.body;

        // Only allow users to access their own usage data
        if (userId !== authenticatedUserId) {
          res.json(err(authenticationRequiredError()));
          return;
        }

        const aiEditMetadataResult =
          await getAIEditMetadataForUser(userId);
        if (aiEditMetadataResult.outcome === 'failure') {
          res.json(err(aiEditMetadataResult.error));
          return;
        }

        // Return the AI usage data
        res.json(ok(aiEditMetadataResult.value));
      } catch (error) {
        console.error('[getAIUsageEndpoint] error:', error);
        res.json(err(error));
      }
    },
  );
};
