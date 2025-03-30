import {
  Gateways,
  Result,
  ok,
  err,
  VizHubErrorCode,
} from 'gateways';
import { 
  VizId, 
  AIEditMetadata, 
  dateToTimestamp, 
  generateId,
  Files,
  userLock,
  User
} from 'entities';
import { VerifyVizAccess } from './verifyVizAccess';
import { CommitViz } from './commitViz';
import { diff } from 'ot';
import { ChatOpenAI } from '@langchain/openai';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { parseMarkdownFiles, serializeMarkdownFiles } from 'llm-code-format';
import { CREDIT_MARKUP } from 'entities/src/Pricing';

const debug = false;
const promptTemplateVersion = 1;

export const EditWithAI = (gateways: Gateways) => {
  const verifyVizAccess = VerifyVizAccess(gateways);
  const commitViz = CommitViz(gateways);
  const { getInfo, getUser, saveInfo, saveUser, lock, saveAIEditMetadata } = gateways;

  return async (options: {
    id: VizId;
    prompt: string;
    modelName?: string;
    authenticatedUserId: string;
    shareDBDoc: any;
  }): Promise<Result<{
    success: boolean;
    updatedCreditBalance?: number;
  }>> => {
    const { id, prompt, modelName, authenticatedUserId, shareDBDoc } = options;

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
        return err({
          code: VizHubErrorCode.accessDenied,
          message: 'Write access denied',
        });
      }

      // Get user and check plan/credits
      const userResult = await getUser(authenticatedUserId);
      if (userResult.outcome === 'failure') {
        return err(userResult.error);
      }
      const user = userResult.value.data;

      if (user.plan !== 'premium' && user.plan !== 'professional') {
        return err({
          code: VizHubErrorCode.accessDenied,
          message: 'Only Premium users can use AI Assist',
        });
      }

      const expiringCreditBalance = getExpiringCreditBalance(user);
      const nonExpiringCreditBalance = getNonExpiringCreditBalance(user);
      const totalCreditBalance = expiringCreditBalance + nonExpiringCreditBalance;

      if (totalCreditBalance === 0) {
        return err({
          code: VizHubErrorCode.creditsNeeded,
          message: 'You need more AI credits to use this feature',
        });
      }

      // Get existing files and create context
      const files: Files = shareDBDoc.data.files;
      const filesContext = serializeMarkdownFiles(
        Object.values(files).map((file) => ({
          name: file.name,
          text: file.text
            .split('\n')
            .slice(
              0,
              file.name.endsWith('.csv') || file.name.endsWith('.json')
                ? 50
                : 500,
            )
            .map((line) => line.slice(0, 200))
            .join('\n'),
        })),
      );

      // Generate AI response
      const fullPrompt = assembleFullPrompt({
        filesContext,
        prompt,
      });

      const chatModel = new ChatOpenAI({
        modelName: modelName || process.env.VIZHUB_EDIT_WITH_AI_MODEL_NAME,
        configuration: {
          apiKey: process.env.VIZHUB_EDIT_WITH_AI_API_KEY,
          baseURL: process.env.VIZHUB_EDIT_WITH_AI_BASE_URL,
        },
        streaming: false,
      });

      const result = await chatModel.invoke(fullPrompt);
      const parser = new StringOutputParser();
      const resultString = await parser.invoke(result);

      // Process AI changes
      const changedFiles = parseMarkdownFiles(resultString, 'bold');
      let newFiles = processFileChanges(files, changedFiles);

      // Commit current changes before AI edit
      await commitViz(id);

      // Apply AI edits
      const op1 = diff(shareDBDoc.data, {
        ...shareDBDoc.data,
        files: newFiles,
        isInteracting: true,
      });

      shareDBDoc.submitOp(op1);

      // Wait for propagation
      await new Promise((resolve) => setTimeout(resolve, 100));

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
      const { upstreamCostCents, userCostCents, provider, inputTokens, outputTokens } = 
        await getGenerationMetadata({
          apiKey: process.env.VIZHUB_EDIT_WITH_AI_API_KEY,
          generationId: result.lc_kwargs.id,
        });

      let updatedCreditBalance: number;
      await lock([userLock(authenticatedUserId)], async () => {
        const freshUserResult = await getUser(authenticatedUserId);
        if (freshUserResult.outcome === 'failure') {
          return err(freshUserResult.error);
        }
        const freshUser: User = freshUserResult.value.data;
        updatedCreditBalance = await updateUserCredits(freshUser, userCostCents, expiringCreditBalance);
        await saveUser(freshUser);
      });

      // Save metadata
      const aiEditMetadata: AIEditMetadata = {
        id: generateId(),
        openRouterGenerationId: result.lc_kwargs.id,
        timestamp: dateToTimestamp(new Date()),
        user: authenticatedUserId,
        viz: id,
        commit: commitVizResult.value.end,
        upstreamCostCents,
        userCostCents,
        updatedCreditBalance,
        model: modelName || process.env.VIZHUB_EDIT_WITH_AI_MODEL_NAME,
        provider,
        inputTokens,
        outputTokens,
        userPrompt: prompt,
        promptTemplateVersion,
      };

      await saveAIEditMetadata(aiEditMetadata);

      return ok({
        success: true,
        updatedCreditBalance
      });

    } catch (error) {
      console.error('[EditWithAI] error:', error);
      return err(error);
    }
  };
};

// Helper functions
function processFileChanges(files: Files, changedFiles: any) {
  let newFiles = Object.keys(files).reduce((acc, fileId) => {
    const file = files[fileId];
    const changedFile = changedFiles.files.find(
      (changedFile) => changedFile.name === file.name
    );
    
    if (shouldDeleteFile(changedFile)) {
      return acc;
    } else {
      acc[fileId] = {
        ...file,
        text: changedFile ? changedFile.text : file.text,
      };
      return acc;
    }
  }, {});

  changedFiles.files.forEach((changedFile) => {
    const existingFile = Object.values(newFiles).find(
      (file) => file.name === changedFile.name
    );

    if (!existingFile && !shouldDeleteFile(changedFile)) {
      const fileId = generateFileId();
      newFiles[fileId] = {
        name: changedFile.name,
        text: changedFile.text,
      };
    }
  });

  return newFiles;
}

async function getGenerationMetadata({ apiKey, generationId }) {
  const maxRetries = 10;
  const retryDelay = 1000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const response = await fetch(
      `https://openrouter.ai/api/v1/generation?id=${generationId}`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${apiKey}` },
      }
    );

    if (response.ok) {
      const data = await response.json();
      const upstreamCostInDollars = data.data.total_cost;
      const upstreamCostCents = upstreamCostInDollars * 100;
      const userCostCents = Math.ceil(upstreamCostCents * CREDIT_MARKUP);

      return {
        upstreamCostCents,
        userCostCents,
        provider: data.data.provider_name,
        inputTokens: data.data.tokens_prompt,
        outputTokens: data.data.tokens_completion,
      };
    }

    if (attempt < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    } else {
      throw new Error(`HTTP error! Status: ${response.status} after ${maxRetries} attempts.`);
    }
  }
}

async function updateUserCredits(user: User, userCostCents: number, expiringCreditBalance: number) {
  const currentMonth = new Date().toISOString().slice(0, 7);

  if (!user.proCreditBalanceByMonth) {
    user.proCreditBalanceByMonth = {};
  }

  if (user.plan === 'professional' && user.proCreditBalanceByMonth[currentMonth] === undefined) {
    user.proCreditBalanceByMonth[currentMonth] = PRO_CREDITS_PER_MONTH;
  }

  if (expiringCreditBalance > 0) {
    if (expiringCreditBalance >= userCostCents) {
      user.proCreditBalanceByMonth[currentMonth] = 
        (user.proCreditBalanceByMonth[currentMonth] || 0) - userCostCents;
    } else {
      const remainingUserCostCents = userCostCents - expiringCreditBalance;
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

const shouldDeleteFile = (file?: File) => file && file.text.trim() === '';

const assembleFullPrompt = ({filesContext, prompt}: {filesContext: string; prompt: string}) => {
  const task = `## Your Task\n\n${prompt}`;
  const files = `## Original Files\n\n${filesContext}`;
  const format = [
    '## Formatting Instructions\n\n',
    'Suggest changes to the original files using this exact format:\n\n',
    '**fileA.js**\n\n```js\n// Entire updated code for fileA\n```\n\n',
    '**fileB.js**\n\n```js\n// Entire updated code for fileB\n```\n\n',
    'Only include the files that need to be updated or created.\n\n',
    'To suggest changes you MUST include the ENTIRE content of the updated file.\n\n',
    'NEVER leave out sections as in "... rest of the code remain the same ...".\n\n',
    'Refactor large files into smaller files in the same directory.\n\n',
    'Delete all unused files, but we need to keep `README.md`. ',
    'Files can be deleted by setting their content to empty, for example:\n\n',
    '**fileToDelete.js**\n\n```\n```\n\n',
    'For D3 logic, make sure it remains idempotent (use data joins), ',
    'and prefer function signatures like `someFunction(selection, options)` ',
    'where `selection` is a D3 selection and `options` is an object.\n\n',
  ].join('');

  return [task, files, format].join('\n\n');
}
