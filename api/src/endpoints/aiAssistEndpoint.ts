import bodyParser from 'body-parser';
import { EntityName } from 'entities';
import { generateAIResponse } from 'vzcode/src/server/generateAIResponse';
import { toCollectionName } from 'database/src/toCollectionName';
import { getAuthenticatedUserId } from '../parseAuth0User';
import { err } from 'gateways';
import {
  accessDeniedError,
  authenticationRequiredError,
} from 'gateways/src/errors';
import { RecordAnalyticsEvents } from 'interactors';

const debug = false;

export const aiAssistEndpoint = ({
  app,
  shareDBConnection,
  gateways,
}) => {
  const { getUser } = gateways;
  const recordAnalyticsEvents =
    RecordAnalyticsEvents(gateways);

  // Handle AI Assist requests.
  app.post(
    '/api/ai-assist/',
    bodyParser.json(),
    async (req, res) => {
      if (debug)
        console.log(
          '[aiAssistEndpoint] req.body:',
          req.body,
        );

      const {
        vizId,
        inputText,
        insertionCursor,
        fileId,
        aiStreamId,
      } = req.body;

      // TODO only allow AI Assist requests users with edit access to the viz.
      // And, only allow AI assist requests if the user requesting it
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
              'Only Premium users can use AI Assist. Please upgrade your plan.',
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
        await generateAIResponse({
          inputText,
          insertionCursor,
          fileId,
          shareDBDoc,
          streamId: aiStreamId,
        });

        res
          .status(200)
          .send({ message: 'Operation successful!' });
      } catch (error) {
        console.error('handleAIAssist error:', error);
        res.status(500).send({
          message: 'Internal Server Error',
          error: error.message,
        });
      } finally {
        // Unsubscribe from updates to the ShareDB document.
        shareDBDoc.unsubscribe();

        await recordAnalyticsEvents({
          eventId: `event.aiAssist.${authenticatedUserId}`,
        });
      }
    },
  );
};
