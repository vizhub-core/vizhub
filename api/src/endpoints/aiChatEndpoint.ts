import bodyParser from 'body-parser';
import { EntityName, WRITE } from 'entities';
import { handleAIChatMessage } from 'vzcode/src/server/handleAIChatMessage';
import { toCollectionName } from 'database/src/toCollectionName';
import { getAuthenticatedUserId } from '../parseAuth0User';
import { err } from 'gateways';
import {
  authenticationRequiredError,
  dailyQuotaExceededError,
  accessDeniedError,
} from 'gateways/src/errors';
import {
  RecordAnalyticsEvents,
  VerifyVizAccess,
} from 'interactors';
import { userLock, User } from 'entities';
import {
  FREE_AI_CHAT_LIMIT,
  PREMIUM,
} from 'entities/src/Pricing';

const DEBUG = false;

export const aiChatEndpoint = ({
  app,
  shareDBConnection,
  gateways,
}) => {
  const { getUser, saveUser, lock, getInfo } = gateways;
  const recordAnalyticsEvents =
    RecordAnalyticsEvents(gateways);
  const verifyVizAccess = VerifyVizAccess(gateways);

  // Handle AI Chat requests.
  app.post(
    '/api/ai-chat/',
    bodyParser.json(),
    async (req, res) => {
      DEBUG &&
        console.log('[aiChatEndpoint] req.body:', req.body);

      const { vizId, content, chatId } = req.body;

      const authenticatedUserId =
        getAuthenticatedUserId(req);

      DEBUG &&
        console.log(
          '[aiChatEndpoint] authenticatedUserId:',
          authenticatedUserId,
        );

      if (!authenticatedUserId) {
        DEBUG &&
          console.log(
            '[aiChatEndpoint] No authenticated user ID, returning auth error',
          );
        res.json(err(authenticationRequiredError()));
        return;
      }

      // Get the viz info to verify access
      DEBUG &&
        console.log(
          '[aiChatEndpoint] Getting viz info for access control:',
          vizId,
        );

      const infoResult = await getInfo(vizId);
      if (infoResult.outcome === 'failure') {
        DEBUG &&
          console.log(
            '[aiChatEndpoint] Failed to get viz info:',
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
            '[aiChatEndpoint] Error when verifying viz access:',
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
            '[aiChatEndpoint] User does not have write access to viz',
          );
        res.json(
          err(
            accessDeniedError(
              'You do not have permission to use AI chat on this visualization. Only users with edit access can use this feature. Fork the viz to edit it.',
            ),
          ),
        );
        return;
      }

      DEBUG &&
        console.log(
          '[aiChatEndpoint] Access control check passed, user has write access',
        );

      DEBUG &&
        console.log(
          '[aiChatEndpoint] Getting user data for:',
          authenticatedUserId,
        );

      const userResult = await getUser(authenticatedUserId);
      if (userResult.outcome === 'failure') {
        DEBUG &&
          console.log(
            '[aiChatEndpoint] Failed to get user:',
            userResult.error,
          );
        res.json(err(userResult.error));
        return;
      }
      const authenticatedUser: User = userResult.value.data;

      DEBUG &&
        console.log(
          '[aiChatEndpoint] authenticatedUser.plan:',
          authenticatedUser.plan,
        );

      DEBUG &&
        console.log(
          '[aiChatEndpoint] authenticatedUser.currentDayMessages:',
          authenticatedUser.currentDayMessages,
        );

      // Check daily message limit for free users
      const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

      // Reset daily count if it's a new day
      if (authenticatedUser.currentDay !== today) {
        DEBUG &&
          console.log(
            '[aiChatEndpoint] Resetting daily message count for new day',
          );
        authenticatedUser.currentDay = today;
        authenticatedUser.currentDayMessages = 0;

        // Save the updated user data
        await saveUser(authenticatedUser);
        DEBUG &&
          console.log(
            '[aiChatEndpoint] User data updated with new day and message count reset',
          );
      }

      // Check if free user has exceeded daily limit
      if (authenticatedUser.plan !== PREMIUM) {
        const currentMessages =
          authenticatedUser.currentDayMessages || 0;
        if (currentMessages >= FREE_AI_CHAT_LIMIT) {
          DEBUG &&
            console.log(
              '[aiChatEndpoint] Daily quota exceeded for free user',
            );
          res.json(
            err(
              dailyQuotaExceededError(
                'You have reached your daily limit of 5 AI chat messages. Upgrade to Premium for unlimited access.',
              ),
            ),
          );
          return;
        }
      }

      DEBUG &&
        console.log(
          '[aiChatEndpoint] Daily message check passed:',
          {
            plan: authenticatedUser.plan,
            currentDay: authenticatedUser.currentDay,
            currentDayMessages:
              authenticatedUser.currentDayMessages,
          },
        );

      // Get the ShareDB document for the viz content
      const entityName: EntityName = 'Content';
      const shareDBDoc = shareDBConnection.get(
        toCollectionName(entityName),
        vizId,
      );

      DEBUG &&
        console.log(
          '[aiChatEndpoint] Got ShareDB document for vizId:',
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
              '[aiChatEndpoint] Successfully subscribed to ShareDB document',
            );
          resolve();
        });
      });

      try {
        DEBUG &&
          console.log(
            '[aiChatEndpoint] Incrementing daily message count',
          );

        // Update user daily message count with locking
        await lock(
          [userLock(authenticatedUserId)],
          async () => {
            const freshUserResult = await getUser(
              authenticatedUserId,
            );
            if (freshUserResult.outcome === 'failure') {
              throw new Error(
                'Failed to get fresh user data',
              );
            }
            const freshUser: User =
              freshUserResult.value.data;

            // Increment daily message count
            freshUser.currentDayMessages =
              (freshUser.currentDayMessages || 0) + 1;

            DEBUG &&
              console.log(
                '[aiChatEndpoint] Updated daily message count:',
                freshUser.currentDayMessages,
              );

            await saveUser(freshUser);
          },
        );

        // Create the handler with the ShareDB document and credit deduction callback
        DEBUG &&
          console.log(
            '[aiChatEndpoint] Creating AI chat handler',
          );

        // Set up presence for VizBot following the same pattern as useShareDB.ts
        const docPresence =
          shareDBConnection.getDocPresence(
            toCollectionName(entityName),
            vizId,
          );

        // Create local presence for VizBot with a unique ID
        const generateVizBotId = () => {
          const timestamp = Date.now().toString(36);
          return `vizbot-${timestamp}`;
        };

        // Function to get the current commit ID from the viz info
        const getCurrentCommitId = () => {
          return info.committed ? info.end : null;
        };

        const handler = handleAIChatMessage({
          shareDBDoc,
          createAIEditLocalPresence: () =>
            docPresence.create(generateVizBotId()),
          getCurrentCommitId,
        } as any);

        DEBUG &&
          console.log(
            '[aiChatEndpoint] Invoking AI chat handler',
          );

        // Invoke the handler with the request and response
        await handler(req, res);

        DEBUG &&
          console.log(
            '[aiChatEndpoint] AI chat handler completed successfully',
          );

        DEBUG &&
          console.log(
            '[aiChatEndpoint] Recording analytics event',
          );

        await recordAnalyticsEvents({
          eventId: `event.aiChat.${authenticatedUserId}`,
        });

        DEBUG &&
          console.log(
            '[aiChatEndpoint] Analytics event recorded successfully',
          );
      } catch (error) {
        console.error('[aiChatEndpoint] ERROR:', error);
        console.error(
          '[aiChatEndpoint] Error stack:',
          error.stack,
        );
        res.status(500).send({
          message: 'Internal Server Error',
          error: error.message,
        });
      } finally {
        DEBUG &&
          console.log(
            '[aiChatEndpoint] Unsubscribing from ShareDB document',
          );
        // Unsubscribe from updates to the ShareDB document.
        shareDBDoc.unsubscribe();
        DEBUG &&
          console.log(
            '[aiChatEndpoint] Request processing complete',
          );
      }
    },
  );
};
