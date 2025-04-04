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
import { StringOutputParser } from '@langchain/core/output_parsers';
import { performAiEdit } from 'editcodewithai';
import {
  CREDIT_MARKUP,
  PRO_CREDITS_PER_MONTH,
} from 'entities/src/Pricing';
import { VizFiles, VizId } from '@vizhub/viz-types';
import { generateId } from './generateId';

const debug = false;
const DEBUG = false;
const promptTemplateVersion = 1;

// Get the expiring credit balance (pro credits for the current month)
const getExpiringCreditBalance = (user: User): number => {
  if (user.plan !== 'professional') return 0;
  const currentMonth = new Date().toISOString().slice(0, 7);
  return user.proCreditBalanceByMonth?.[currentMonth] || 0;
};

// Get the non-expiring credit balance (purchased credits)
const getNonExpiringCreditBalance = (
  user: User,
): number => {
  return user.creditBalance || 0;
};

export const EditWithAI = (gateways: Gateways) => {
  const verifyVizAccess = VerifyVizAccess(gateways);
  const commitViz = CommitViz(gateways);
  const {
    getInfo,
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
    streamHandler?: (chunk: string) => void;
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
      streamHandler,
    } = options;

    try {
      // Get the info to verify access
      const infoResult = await getInfo(id);
      if (infoResult.outcome === 'failure') {
        return err(infoResult.error);
      }
      const info = infoResult.value.data;

      // Verify write access to this viz
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
      const userResult = await getUser(authenticatedUserId);
      if (userResult.outcome === 'failure') {
        return err(userResult.error);
      }
      const user = userResult.value.data;

      if (
        user.plan !== 'premium' &&
        user.plan !== 'professional'
      ) {
        return err(
          accessDeniedError(
            'Only Premium users can use AI Assist',
          ),
        );
      }

      const expiringCreditBalance =
        getExpiringCreditBalance(user);
      const nonExpiringCreditBalance =
        getNonExpiringCreditBalance(user);
      const totalCreditBalance =
        expiringCreditBalance + nonExpiringCreditBalance;

      if (totalCreditBalance === 0) {
        return err(
          creditsNeededError(
            'You need more AI credits to use this feature',
          ),
        );
      }

      // Get existing files
      const files: VizFiles = shareDBDoc.data.files;

      // Define LLM function
      const llmFunction = async (fullPrompt: string) => {
        const chatModel = new ChatOpenAI({
          modelName:
            modelName ||
            process.env.VIZHUB_EDIT_WITH_AI_MODEL_NAME,
          configuration: {
            apiKey: process.env.VIZHUB_EDIT_WITH_AI_API_KEY,
            baseURL:
              process.env.VIZHUB_EDIT_WITH_AI_BASE_URL,
          },
          streaming: true,
        });

        // Collect all chunks
        let fullContent = '';
        let generationId = '';

        // Stream the response and log each chunk
        const stream = await chatModel.stream(fullPrompt);
        for await (const chunk of stream) {
          DEBUG && console.log('Received chunk:', chunk);
          if (chunk.content) {
            const chunkContent = String(chunk.content);
            fullContent += chunkContent;

            // Send chunk to client if streamHandler is provided
            if (streamHandler) {
              streamHandler(chunkContent);
            }
          }
          // Store the generation ID from the first chunk that has it
          if (!generationId && chunk.lc_kwargs?.id) {
            generationId = chunk.lc_kwargs.id;
          }
        }

        // Parse to string if needed
        const parser = new StringOutputParser();
        const contentString =
          await parser.invoke(fullContent);

        DEBUG &&
          console.log('Final content:', contentString);

        return {
          content: contentString,
          generationId: generationId,
        };
      };

      // Perform AI edit
      const editResult = await performAiEdit({
        prompt,
        files,
        llmFunction,
        apiKey: process.env.VIZHUB_EDIT_WITH_AI_API_KEY,
      });

      // Commit current changes before AI edit
      await commitViz(id);

      // Apply AI edits
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

      // Create new commit
      const commitVizResult = await commitViz(id);
      if (commitVizResult.outcome === 'failure') {
        return err(commitVizResult.error);
      }

      // Process costs and credits
      const {
        upstreamCostCents,
        provider,
        inputTokens,
        outputTokens,
      } = editResult;

      const userCostCents = Math.ceil(
        upstreamCostCents * CREDIT_MARKUP,
      );

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

      return ok({
        success: true,
        updatedCreditBalance,
      });
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

  if (!user.proCreditBalanceByMonth) {
    user.proCreditBalanceByMonth = {};
  }

  if (
    user.plan === 'professional' &&
    user.proCreditBalanceByMonth[currentMonth] === undefined
  ) {
    user.proCreditBalanceByMonth[currentMonth] =
      PRO_CREDITS_PER_MONTH;
  }

  if (expiringCreditBalance > 0) {
    if (expiringCreditBalance >= userCostCents) {
      user.proCreditBalanceByMonth[currentMonth] =
        (user.proCreditBalanceByMonth[currentMonth] || 0) -
        userCostCents;
    } else {
      const remainingUserCostCents =
        userCostCents - expiringCreditBalance;
      user.proCreditBalanceByMonth[currentMonth] = 0;
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
