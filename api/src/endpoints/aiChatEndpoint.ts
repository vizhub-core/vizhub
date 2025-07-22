import bodyParser from 'body-parser';
import { EntityName } from 'entities';
import { handleAIChatMessage } from 'vzcode/src/server/handleAIChatMessage';
import { toCollectionName } from 'database/src/toCollectionName';
import { getAuthenticatedUserId } from '../parseAuth0User';
import { err } from 'gateways';
import {
  authenticationRequiredError,
  creditsNeededError,
} from 'gateways/src/errors';
import { RecordAnalyticsEvents } from 'interactors';
import {
  CREDIT_MARKUP,
  STARTING_CREDITS,
} from 'entities/src/Pricing';
import { userLock, User } from 'entities';
import { getExpiringCreditBalance } from 'entities/src/accessors';

const DEBUG = false;

// Get the non-expiring credit balance (purchased credits)
const getNonExpiringCreditBalance = (
  user: User,
): number => {
  return user.creditBalance === undefined
    ? STARTING_CREDITS
    : user.creditBalance;
};

// Helper function to update user credits (similar to EditWithAI)
async function updateUserCredits(
  user: User,
  userCostCents: number,
  expiringCreditBalance: number,
) {
  const currentMonth = new Date().toISOString().slice(0, 7);

  // Initialize credit balance objects if they don't exist
  if (!user.freeCreditBalanceByMonth) {
    user.freeCreditBalanceByMonth = {};
  }
  if (!user.premiumCreditBalanceByMonth) {
    user.premiumCreditBalanceByMonth = {};
  }
  if (!user.proCreditBalanceByMonth) {
    user.proCreditBalanceByMonth = {};
  }

  // Set up monthly credits for each plan type if not already set
  const {
    FREE_CREDITS_PER_MONTH,
    PREMIUM_CREDITS_PER_MONTH,
    PRO_CREDITS_PER_MONTH,
    FREE,
    PREMIUM,
    PRO,
  } = await import('entities/src/Pricing');

  if (
    user.plan === FREE &&
    user.freeCreditBalanceByMonth[currentMonth] ===
      undefined
  ) {
    user.freeCreditBalanceByMonth[currentMonth] =
      FREE_CREDITS_PER_MONTH;
  }

  if (
    user.plan === PREMIUM &&
    user.premiumCreditBalanceByMonth[currentMonth] ===
      undefined
  ) {
    user.premiumCreditBalanceByMonth[currentMonth] =
      PREMIUM_CREDITS_PER_MONTH;
  }

  if (
    user.plan === PRO &&
    user.proCreditBalanceByMonth[currentMonth] === undefined
  ) {
    user.proCreditBalanceByMonth[currentMonth] =
      PRO_CREDITS_PER_MONTH;
  }

  // Deduct credits from expiring balance first, then from non-expiring balance
  if (expiringCreditBalance > 0) {
    if (expiringCreditBalance >= userCostCents) {
      // Deduct from the appropriate plan's monthly credits
      switch (user.plan) {
        case FREE:
          user.freeCreditBalanceByMonth[currentMonth] =
            (user.freeCreditBalanceByMonth[currentMonth] ||
              0) - userCostCents;
          break;
        case PREMIUM:
          user.premiumCreditBalanceByMonth[currentMonth] =
            (user.premiumCreditBalanceByMonth[
              currentMonth
            ] || 0) - userCostCents;
          break;
        case PRO:
          user.proCreditBalanceByMonth[currentMonth] =
            (user.proCreditBalanceByMonth[currentMonth] ||
              0) - userCostCents;
          break;
      }
    } else {
      const remainingUserCostCents =
        userCostCents - expiringCreditBalance;

      // Zero out the monthly credits for the current plan
      switch (user.plan) {
        case FREE:
          user.freeCreditBalanceByMonth[currentMonth] = 0;
          break;
        case PREMIUM:
          user.premiumCreditBalanceByMonth[currentMonth] =
            0;
          break;
        case PRO:
          user.proCreditBalanceByMonth[currentMonth] = 0;
          break;
      }

      // Deduct remaining from non-expiring balance
      user.creditBalance -= remainingUserCostCents;
    }
  } else {
    user.creditBalance -= userCostCents;
  }

  if (user.creditBalance < 0) {
    user.creditBalance = 0;
  }

  return user.creditBalance;
}

export const aiChatEndpoint = ({
  app,
  shareDBConnection,
  gateways,
}) => {
  const { getUser, saveUser, lock } = gateways;
  const recordAnalyticsEvents =
    RecordAnalyticsEvents(gateways);

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
      const authenticatedUser = userResult.value.data;

      // Check user credits before proceeding
      const expiringCreditBalance =
        getExpiringCreditBalance(authenticatedUser);
      const nonExpiringCreditBalance =
        getNonExpiringCreditBalance(authenticatedUser);
      const totalCreditBalance =
        expiringCreditBalance + nonExpiringCreditBalance;

      DEBUG &&
        console.log('[aiChatEndpoint] Credit balances:', {
          expiringCreditBalance,
          nonExpiringCreditBalance,
          totalCreditBalance,
        });

      if (totalCreditBalance === 0) {
        DEBUG &&
          console.log(
            '[aiChatEndpoint] No credits available',
          );
        res.json(
          err(
            creditsNeededError(
              'You need more AI credits to use this feature',
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
        // Create credit deduction callback
        const onCreditDeduction = async ({
          upstreamCostCents,
          provider,
          inputTokens,
          outputTokens,
        }) => {
          const userCostCents = Math.ceil(
            upstreamCostCents * CREDIT_MARKUP,
          );

          DEBUG &&
            console.log(
              '[aiChatEndpoint] Credit deduction',
              {
                upstreamCostCents,
                userCostCents,
                inputTokens,
                outputTokens,
              },
            );

          // Update user credits with locking
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

              await updateUserCredits(
                freshUser,
                userCostCents,
                expiringCreditBalance,
              );

              await saveUser(freshUser);
            },
          );
        };

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

        const localPresence = docPresence.create(
          generateVizBotId(),
        );

        const handler = handleAIChatMessage({
          shareDBDoc,
          localPresence,
          onCreditDeduction,
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
