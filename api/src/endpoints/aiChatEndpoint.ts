import bodyParser from 'body-parser';
import { EntityName } from 'entities';
import { handleAIChatMessage } from 'vzcode/src/server/handleAIChatMessage';
import { toCollectionName } from 'database/src/toCollectionName';
import { getAuthenticatedUserId } from '../parseAuth0User';
import { err } from 'gateways';
import {
  accessDeniedError,
  authenticationRequiredError,
} from 'gateways/src/errors';
import { RecordAnalyticsEvents } from 'interactors';

const debug = false;

export const aiChatEndpoint = ({
  app,
  shareDBConnection,
  gateways,
}) => {
  const { getUser } = gateways;
  const recordAnalyticsEvents =
    RecordAnalyticsEvents(gateways);

  // Handle AI Chat requests.
  app.post(
    '/api/ai-chat/',
    bodyParser.json(),
    async (req, res) => {
      if (debug)
        console.log('[aiChatEndpoint] req.body:', req.body);

      const { vizId, content, chatId } = req.body;

      // TODO only allow AI Chat requests users with edit access to the viz.
      // And, only allow AI chat requests if the user requesting it
      // is on the Premium plan.
      const authenticatedUserId =
        getAuthenticatedUserId(req);

      if (!authenticatedUserId) {
        res.json(err(authenticationRequiredError()));
        return;
      }

      const userResult = await getUser(authenticatedUserId);
      if (userResult.outcome === 'failure') {
        res.json(err(userResult.error));
        return;
      }
      const authenticatedUser = userResult.value.data;
      if (authenticatedUser.plan !== 'premium') {
        res.json(
          err(
            accessDeniedError(
              'Only Premium users can use AI Chat. Please upgrade your plan.',
            ),
          ),
        );
        return;
      }

      // Get the ShareDB document for the viz content
      const entityName: EntityName = 'Content';
      const shareDBDoc = shareDBConnection.get(
        toCollectionName(entityName),
        vizId,
      );

      // Subscribe to updates from the ShareDB document.
      await new Promise<void>((resolve, reject) => {
        shareDBDoc.subscribe((error) => {
          if (error) {
            console.error(
              'shareDBDoc.subscribe error:',
              error,
            );
            reject(error);
            return;
          }
          resolve();
        });
      });

      try {
        // Create the handler with the ShareDB document
        const handler = handleAIChatMessage(shareDBDoc);

        // Invoke the handler with the request and response
        await handler(req, res);

        await recordAnalyticsEvents({
          eventId: `event.aiChat.${authenticatedUserId}`,
        });
      } catch (error) {
        console.error('aiChatEndpoint error:', error);
        res.status(500).send({
          message: 'Internal Server Error',
          error: error.message,
        });
      } finally {
        // Unsubscribe from updates to the ShareDB document.
        shareDBDoc.unsubscribe();
      }
    },
  );
};
