import bodyParser from 'body-parser';
import { EntityName, WRITE } from 'entities';
import { handleAIChatUndo } from 'vzcode/src/server/handleAIChatUndo';
import { toCollectionName } from 'database/src/toCollectionName';
import { getAuthenticatedUserId } from '../parseAuth0User';
import { err } from 'gateways';
import {
  authenticationRequiredError,
  accessDeniedError,
} from 'gateways/src/errors';
import {
  RecordAnalyticsEvents,
  VerifyVizAccess,
} from 'interactors';

const DEBUG = false;

export const aiChatUndoEndpoint = ({
  app,
  shareDBConnection,
  gateways,
}) => {
  const { getInfo } = gateways;
  const recordAnalyticsEvents =
    RecordAnalyticsEvents(gateways);
  const verifyVizAccess = VerifyVizAccess(gateways);

  // Handle AI Chat Undo requests.
  app.post(
    '/api/ai-chat-undo/',
    bodyParser.json(),
    async (req, res) => {
      DEBUG &&
        console.log(
          '[aiChatUndoEndpoint] req.body:',
          req.body,
        );

      const { vizId, chatId, messageId } = req.body;

      const authenticatedUserId =
        getAuthenticatedUserId(req);

      DEBUG &&
        console.log(
          '[aiChatUndoEndpoint] authenticatedUserId:',
          authenticatedUserId,
        );

      if (!authenticatedUserId) {
        DEBUG &&
          console.log(
            '[aiChatUndoEndpoint] No authenticated user ID, returning auth error',
          );
        res.json(err(authenticationRequiredError()));
        return;
      }

      // Get the viz info to verify access
      DEBUG &&
        console.log(
          '[aiChatUndoEndpoint] Getting viz info for access control:',
          vizId,
        );

      const infoResult = await getInfo(vizId);
      if (infoResult.outcome === 'failure') {
        DEBUG &&
          console.log(
            '[aiChatUndoEndpoint] Failed to get viz info:',
            infoResult.error,
          );
        res.json(err(infoResult.error));
        return;
      }
      const info = infoResult.value.data;

      // Access control: Verify that the user has write access to the viz
      const verifyVizAccessResult = await verifyVizAccess({
        authenticatedUserId,
        info,
        actions: [WRITE],
      });
      if (verifyVizAccessResult.outcome === 'failure') {
        DEBUG &&
          console.log(
            '[aiChatUndoEndpoint] Error when verifying viz access:',
            verifyVizAccessResult.error,
          );
        res.json(err(verifyVizAccessResult.error));
        return;
      }
      const vizAccess = verifyVizAccessResult.value;

      // Check if user has write access
      if (!vizAccess[WRITE]) {
        DEBUG &&
          console.log(
            '[aiChatUndoEndpoint] User does not have write access to viz',
          );
        res.json(
          err(
            accessDeniedError(
              'You do not have permission to undo AI edits on this visualization. Only users with edit access can use this feature.',
            ),
          ),
        );
        return;
      }

      DEBUG &&
        console.log(
          '[aiChatUndoEndpoint] Access control check passed, user has write access',
        );

      // Get the ShareDB document for the viz content
      const entityName: EntityName = 'Content';
      const shareDBDoc = shareDBConnection.get(
        toCollectionName(entityName),
        vizId,
      );

      DEBUG &&
        console.log(
          '[aiChatUndoEndpoint] Got ShareDB document for vizId:',
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
          DEBUG &&
            console.log(
              '[aiChatUndoEndpoint] Successfully subscribed to ShareDB document',
            );
          resolve();
        });
      });

      try {
        // Create the undo handler with the ShareDB document
        DEBUG &&
          console.log(
            '[aiChatUndoEndpoint] Creating AI chat undo handler',
          );

        const handler = handleAIChatUndo({
          shareDBDoc,
        });

        DEBUG &&
          console.log(
            '[aiChatUndoEndpoint] Invoking AI chat undo handler',
          );

        // Invoke the handler with the request and response
        await handler(req, res);

        DEBUG &&
          console.log(
            '[aiChatUndoEndpoint] AI chat undo handler completed successfully',
          );

        DEBUG &&
          console.log(
            '[aiChatUndoEndpoint] Recording analytics event',
          );

        await recordAnalyticsEvents({
          eventId: `event.aiChatUndo.${authenticatedUserId}`,
        });

        DEBUG &&
          console.log(
            '[aiChatUndoEndpoint] Analytics event recorded successfully',
          );
      } catch (error) {
        console.error('[aiChatUndoEndpoint] ERROR:', error);
        console.error(
          '[aiChatUndoEndpoint] Error stack:',
          error.stack,
        );
        res.status(500).send({
          message: 'Internal Server Error',
          error: error.message,
        });
      } finally {
        DEBUG &&
          console.log(
            '[aiChatUndoEndpoint] Unsubscribing from ShareDB document',
          );
        // Unsubscribe from updates to the ShareDB document.
        shareDBDoc.unsubscribe();
        DEBUG &&
          console.log(
            '[aiChatUndoEndpoint] Request processing complete',
          );
      }
    },
  );
};
