import {
  StreamingMarkdownParser,
  StreamingParserCallbacks,
} from 'llm-code-format';
import {
  Gateways,
  Result,
  ok,
  err,
  VizHubErrorCode,
  VizHubError,
  creditsNeededError,
  accessDeniedError,
} from 'gateways';
import {
  AIEditMetadata,
  dateToTimestamp,
  userLock,
  User,
} from 'entities';
import { VerifyVizAccess } from './verifyVizAccess';
import { CommitViz } from './commitViz';
import { diff } from 'ot';
import { ChatOpenAI } from '@langchain/openai';
import { performAiEdit } from 'editcodewithai';
import {
  CREDIT_MARKUP,
  PRO_CREDITS_PER_MONTH,
  FREE_CREDITS_PER_MONTH,
  PREMIUM_CREDITS_PER_MONTH,
  STARTING_CREDITS,
  FREE,
  PREMIUM,
  PRO,
} from 'entities/src/Pricing';
import { VizFiles, VizId } from '@vizhub/viz-types';
import { generateId } from './generateId';
import { getExpiringCreditBalance } from 'entities/src/accessors';

const DEBUG = false;
const promptTemplateVersion = 1;

// Get the non-expiring credit balance (purchased credits)
const getNonExpiringCreditBalance = (
  user: User,
): number => {
  return user.creditBalance === undefined
    ? STARTING_CREDITS
    : user.creditBalance;
};

export const EditWithAI = (gateways: Gateways) => {
  const verifyVizAccess = VerifyVizAccess(gateways);
  const commitViz = CommitViz(gateways);
  const {
    getInfo,
    saveInfo,
    getUser,
    saveUser,
    lock,
    saveAIEditMetadata,
  } = gateways;

  return async (options: {
    id: VizId;
    prompt: string;
    modelName?: string;
    authenticatedUserId: string;
    shareDBDoc: any;
  }): Promise<
    Result<{
      success: boolean;
      updatedCreditBalance?: number;
    }>
  > => {
    const {
      id,
      prompt,
      modelName,
      authenticatedUserId,
      shareDBDoc,
    } = options;

    try {
      DEBUG &&
        console.log(
          '[EditWithAI] Starting AI edit process',
          {
            id,
            prompt: prompt.substring(0, 100) + '...',
            modelName,
            authenticatedUserId,
          },
        );

      // Get the info to verify access
      DEBUG &&
        console.log(
          '[EditWithAI] Step 1: Getting viz info for access verification',
        );
      const infoResult = await getInfo(id);
      if (infoResult.outcome === 'failure') {
        return err(infoResult.error);
      }
      const info = infoResult.value.data;

      // Verify write access to this viz
      DEBUG &&
        console.log(
          '[EditWithAI] Step 2: Verifying write access to viz',
        );
      const vizAccessResult = await verifyVizAccess({
        authenticatedUserId,
        info,
        actions: ['write'],
      });

      if (vizAccessResult.outcome === 'failure') {
        return err(vizAccessResult.error);
      }

      if (!vizAccessResult.value.write) {
        return err(
          accessDeniedError('Write access denied'),
        );
      }

      // Get user and check plan/credits
      DEBUG &&
        console.log(
          '[EditWithAI] Step 3: Getting user data and checking credits',
        );
      const userResult = await getUser(authenticatedUserId);
      if (userResult.outcome === 'failure') {
        return err(userResult.error);
      }
      const user = userResult.value.data;

      const expiringCreditBalance =
        getExpiringCreditBalance(user);
      const nonExpiringCreditBalance =
        getNonExpiringCreditBalance(user);
      const totalCreditBalance =
        expiringCreditBalance + nonExpiringCreditBalance;

      DEBUG &&
        console.log('[EditWithAI] Credit balance check', {
          expiringCreditBalance,
          nonExpiringCreditBalance,
          totalCreditBalance,
        });

      if (totalCreditBalance === 0) {
        return err(
          creditsNeededError(
            'You need more AI credits to use this feature',
          ),
        );
      }

      // Get existing files
      DEBUG &&
        console.log(
          '[EditWithAI] Step 4: Getting existing files from ShareDB doc',
        );
      const files: VizFiles = shareDBDoc.data.files;

      // Define LLM function
      DEBUG &&
        console.log(
          '[EditWithAI] Step 5: Setting up LLM function and streaming parser',
        );
      const llmFunction = async (fullPrompt: string) => {
        const chatModel = new ChatOpenAI({
          modelName:
            modelName ||
            process.env.VIZHUB_EDIT_WITH_AI_MODEL_NAME,
          configuration: {
            apiKey: process.env.VIZHUB_EDIT_WITH_AI_API_KEY,
            baseURL:
              process.env.VIZHUB_EDIT_WITH_AI_BASE_URL,
            defaultHeaders: {
              'HTTP-Referer': 'https://vizhub.com',
              'X-Title': 'VizHub',
            },
          },
          streaming: true,
        });

        // Collect all chunks
        let fullContent = '';
        let generationId = '';

        // Define callbacks for file name changes, code lines, and non-code lines
        // TODO use these to update the actual viz files
        const callbacks: StreamingParserCallbacks = {
          // When the current file being edited chnages
          onFileNameChange: (fileName, format) => {
            DEBUG &&
              console.log(
                `File changed to: ${fileName} (${format})`,
              );
            const op = diff(shareDBDoc.data, {
              ...shareDBDoc.data,
              aiStatus: 'Editing ' + fileName,
            });
            DEBUG &&
              console.log(
                'Submitting op:',
                JSON.stringify(op),
              );
            shareDBDoc.submitOp(op);
          },
          // Append the line to the current file's content
          onCodeLine: (line) => {
            DEBUG && console.log(`Code line: ${line}`);
          },
          // Process non-code, non-header lines (e.g., for displaying comments)
          onNonCodeLine: (line) => {
            DEBUG && console.log(`Comment/text: ${line}`);
            // const op = diff(shareDBDoc.data, {
            //   ...shareDBDoc.data,
            //   aiStatus: 'Thinking...',
            // });
            // DEBUG &&
            //   console.log(
            //     'Submitting op:',
            //     JSON.stringify(op),
            //   );
            // shareDBDoc.submitOp(op);
          },
        };

        // Create a new parser instance with the callbacks
        const parser = new StreamingMarkdownParser(
          callbacks,
        );

        // Set up an empty scratchpad in the content doc.
        // const op = diff(shareDBDoc.data, {
        //   ...shareDBDoc.data,
        //   aiScratchpad: '',
        //   aiStatus: 'Editing with AI...',
        // });

        // DEBUG &&
        //   console.log('Submitting op:', JSON.stringify(op));

        // shareDBDoc.submitOp(op);

        // Stream the response and log each chunk
        const stream = await chatModel.stream(fullPrompt);
        for await (const chunk of stream) {
          DEBUG && console.log('Received chunk:', chunk);
          if (chunk.content) {
            const chunkContent = String(chunk.content);
            fullContent += chunkContent;

            // TODO don't allow multiple parallel AI edits
            // to even happen at the same time.
            shareDBDoc.submitOp(
              diff(shareDBDoc.data, {
                ...shareDBDoc.data,
                aiScratchpad: fullContent,
              }),
            );

            // Send chunk to client if streamHandler is provided
            parser.processChunk(chunkContent);
          }
          // Store the generation ID from the first chunk that has it
          if (!generationId && chunk.lc_kwargs?.id) {
            generationId = chunk.lc_kwargs.id;
          }
        }
        parser.flushRemaining();

        // Parse to string if needed
        DEBUG && console.log('Final content:', fullContent);

        return {
          content: fullContent,
          generationId: generationId,
        };
      };

      // Perform AI edit
      DEBUG &&
        console.log(
          '[EditWithAI] Step 6: Performing AI edit with LLM',
        );
      try {
        const editResult = await performAiEdit({
          prompt,
          files,
          llmFunction,
          apiKey: process.env.VIZHUB_EDIT_WITH_AI_API_KEY,
        });

        DEBUG &&
          console.log(
            '[EditWithAI] Step 7: AI edit completed, clearing scratchpad',
          );

        // Clear the scratchpad.
        shareDBDoc.submitOp(
          diff(shareDBDoc.data, {
            ...shareDBDoc.data,
            aiScratchpad: undefined,
            aiStatus: 'Done editing with AI.',
          }),
        );

        // Commit any current changes before AI edit
        DEBUG &&
          console.log(
            '[EditWithAI] Step 8: Committing any existing changes before applying AI edits',
          );
        await commitViz(id);

        // Apply AI edits
        DEBUG &&
          console.log(
            '[EditWithAI] Step 9: Applying AI edits to ShareDB doc',
          );
        const op1 = diff(shareDBDoc.data, {
          ...shareDBDoc.data,
          files: editResult.changedFiles,
          isInteracting: true,
        });

        shareDBDoc.submitOp(op1);

        // Wait for propagation
        await new Promise((resolve) =>
          setTimeout(resolve, 100),
        );

        // Unset isInteracting
        const op2 = diff(
          { isInteracting: true },
          { isInteracting: false },
        );
        shareDBDoc.submitOp(op2);

        // Fetch the Info doc again, just in case
        // anything changed during AI generation.
        DEBUG &&
          console.log(
            '[EditWithAI] Step 10: Fetching latest info doc and marking as uncommitted',
          );
        const latestInfoResult = await getInfo(id);
        if (latestInfoResult.outcome === 'failure') {
          return err(latestInfoResult.error);
        }

        const latestInfo = latestInfoResult.value.data;

        // Mark the info uncommitted, so that the AI edit
        // will trigger a new commit.
        // TODO refactor to unify with app/src/pages/VizPage/useVizMutations.ts

        const newInfo = {
          ...latestInfo,
          committed: false,

          // Add the authenticated user to the list of commit authors
          commitAuthors: [
            authenticatedUserId,
            'AI:' + modelName,
          ],

          // Update the last updated timestamp, as this is used as the
          // timestamp for the next commit.
          updated: dateToTimestamp(new Date()),
        };
        await saveInfo(newInfo);

        // Create new commit
        DEBUG &&
          console.log(
            '[EditWithAI] Step 11: Creating new commit with AI changes',
          );
        const commitVizResult = await commitViz(id);
        if (commitVizResult.outcome === 'failure') {
          return err(commitVizResult.error);
        }

        // Process costs and credits
        DEBUG &&
          console.log(
            '[EditWithAI] Step 12: Processing costs and updating user credits',
          );

        const {
          upstreamCostCents,
          provider,
          inputTokens,
          outputTokens,
        } = editResult;

        const userCostCents = Math.ceil(
          upstreamCostCents * CREDIT_MARKUP,
        );

        DEBUG &&
          console.log('[EditWithAI] Cost calculation', {
            upstreamCostCents,
            userCostCents,
            inputTokens,
            outputTokens,
          });

        let updatedCreditBalance: number;
        await lock(
          [userLock(authenticatedUserId)],
          async () => {
            const freshUserResult = await getUser(
              authenticatedUserId,
            );
            if (freshUserResult.outcome === 'failure') {
              return err(freshUserResult.error);
            }
            const freshUser: User =
              freshUserResult.value.data;
            updatedCreditBalance = await updateUserCredits(
              freshUser,
              userCostCents,
              expiringCreditBalance,
            );
            await saveUser(freshUser);
          },
        );

        // Save metadata
        DEBUG &&
          console.log(
            '[EditWithAI] Step 13: Saving AI edit metadata',
          );
        const aiEditMetadata: AIEditMetadata = {
          id: generateId(),
          openRouterGenerationId:
            editResult.openRouterGenerationId,
          timestamp: dateToTimestamp(new Date()),
          user: authenticatedUserId,
          viz: id,
          commit: commitVizResult.value.end,
          upstreamCostCents,
          userCostCents,
          updatedCreditBalance,
          model:
            modelName ||
            process.env.VIZHUB_EDIT_WITH_AI_MODEL_NAME,
          provider,
          inputTokens,
          outputTokens,
          userPrompt: prompt,
          promptTemplateVersion,
        };

        await saveAIEditMetadata(aiEditMetadata);

        DEBUG &&
          console.log(
            '[EditWithAI] Step 14: AI edit process completed successfully',
            { updatedCreditBalance },
          );

        return ok({
          success: true,
          updatedCreditBalance,
        });
      } catch (error) {
        console.error(
          '[EditWithAI] Error during AI streaming:',
          error,
        );
        // Clear the scratchpad on error
        shareDBDoc.submitOp(
          diff(shareDBDoc.data, {
            ...shareDBDoc.data,
            aiScratchpad: undefined,
            aiStatus: 'Error during AI edit',
          }),
        );
        return err(
          new VizHubError(
            error.message || 'Unknown error',
            VizHubErrorCode.invariantViolation,
          ),
        );
      }
    } catch (error) {
      console.error('[EditWithAI] error:', error);
      return err(
        new VizHubError(
          error.message || 'Unknown error',
          VizHubErrorCode.invariantViolation,
        ),
      );
    }
  };
};

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
