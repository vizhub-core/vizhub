import bodyParser from 'body-parser';
import { EntityName } from 'entities';
import { handleAIChatMessage } from 'vzcode/src/server/handleAIChatMessage';
import { toCollectionName } from 'database/src/toCollectionName';
import { getAuthenticatedUserId } from '../parseAuth0User';
import { err } from 'gateways';
import {
  authenticationRequiredError,
  dailyQuotaExceededError,
} from 'gateways/src/errors';
import {
  RecordAnalyticsEvents,
  CommitViz,
} from 'interactors';
import { userLock, User, dateToTimestamp } from 'entities';
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
  const { getUser, saveUser, lock, getInfo, saveInfo } =
    gateways;
  const recordAnalyticsEvents =
    RecordAnalyticsEvents(gateways);
  const commitViz = CommitViz(gateways);

  // Handle AI Chat requests.
  app.post(
    '/api/ai-chat/',
    bodyParser.json(),
    async (req, res) => {
      DEBUG &&
        console.log('[aiChatEndpoint] req.body:', req.body);

      const { vizId, content, chatId } = req.body;

      // TODO only allow AI Chat requests users with edit access to the viz.
      // And, only allow AI chat requests if the user requesting it
      // is on the Premium plan.
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

        const handler = handleAIChatMessage({
          shareDBDoc,
          createVizBotLocalPresence: () =>
            docPresence.create(generateVizBotId()),
        });

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

        // Mark info as uncommitted and create a commit after AI chat changes have been applied
        DEBUG &&
          console.log(
            '[aiChatEndpoint] Fetching latest info doc and marking as uncommitted',
          );

        const latestInfoResult = await getInfo(vizId);
        if (latestInfoResult.outcome === 'failure') {
          console.error(
            '[aiChatEndpoint] Failed to get info:',
            latestInfoResult.error,
          );
          // Don't fail the request if getting info fails, just log the error
        } else {
          const latestInfo = latestInfoResult.value.data;

          // Mark the info uncommitted, so that the AI chat changes
          // will trigger a new commit.
          const newInfo = {
            ...latestInfo,
            committed: false,

            // Add the authenticated user to the list of commit authors
            commitAuthors: [authenticatedUserId, 'AI:chat'],

            // Update the last updated timestamp, as this is used as the
            // timestamp for the next commit.
            updated: dateToTimestamp(new Date()),
          };

          const saveInfoResult = await saveInfo(newInfo);
          if (saveInfoResult.outcome === 'failure') {
            console.error(
              '[aiChatEndpoint] Failed to save info:',
              saveInfoResult.error,
            );
            // Don't fail the request if saving info fails, just log the error
          } else {
            DEBUG &&
              console.log(
                '[aiChatEndpoint] Info marked as uncommitted, creating commit',
              );

            const commitResult = await commitViz(vizId);
            if (commitResult.outcome === 'failure') {
              console.error(
                '[aiChatEndpoint] Failed to create commit:',
                commitResult.error,
              );
              // Don't fail the request if commit fails, just log the error
            } else {
              DEBUG &&
                console.log(
                  '[aiChatEndpoint] Commit created successfully',
                );
            }
          }
        }
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
