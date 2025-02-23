import bodyParser from 'body-parser';
import {
  ChatOpenAI,
  ChatOpenAIFields,
} from '@langchain/openai';
import { StringOutputParser } from '@langchain/core/output_parsers';
import {
  AIEditMetadata,
  dateToTimestamp,
  EntityName,
  File,
  Files,
  generateFileId,
  generateId,
  Info,
  User,
  userLock,
} from 'entities';
import {
  parseMarkdownFiles,
  serializeMarkdownFiles,
} from 'llm-code-format';
import { toCollectionName } from 'database/src/toCollectionName';
import { getAuthenticatedUserId } from '../parseAuth0User';
import { err, ok, Result } from 'gateways';
import {
  accessDeniedError,
  authenticationRequiredError,
  creditsNeededError,
  missingParameterError,
} from 'gateways/src/errors';
import {
  CommitViz,
  RecordAnalyticsEvents,
} from 'interactors';
import { diff } from 'ot';
import {
  VerifyVizAccess,
  VizAccess,
} from 'interactors/src/verifyVizAccess';
import { getCreditBalance } from 'entities/src/accessors';
import { CREDIT_MARKUP } from 'entities/src/Pricing';

const debug = false;

// Versions of the prompt template.
const promptTemplateVersion = 1;

export const editWithAIEndpoint = ({
  app,
  shareDBConnection,
  gateways,
}) => {
  const {
    getUser,
    getInfo,
    saveInfo,
    saveUser,
    lock,
    saveAIEditMetadata,
  } = gateways;
  const verifyVizAccess = VerifyVizAccess(gateways);
  const commitViz = CommitViz(gateways);

  const recordAnalyticsEvents =
    RecordAnalyticsEvents(gateways);

  // Handle AI Assist requests.
  app.post(
    '/api/edit-with-ai/',
    bodyParser.json(),
    async (req, res) => {
      debug &&
        console.log(
          '[editWithAIEndpoint] req.body:',
          req.body,
        );

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

        const { id, prompt } = req.body;

        if (!id || !prompt) {
          res.json(
            missingParameterError(
              "Missing 'id' or 'prompt'",
            ),
          );
          return;
        }

        // Verify write access to this viz
        const infoResult = await getInfo(id);
        if (infoResult.outcome === 'failure') {
          return err(infoResult.error);
        }
        const info = infoResult.value.data;
        const vizAccessResult: Result<VizAccess> =
          await verifyVizAccess({
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

        // ************************
        // *** AI Credits Logic ***
        // ************************

        const creditBalance = getCreditBalance(
          authenticatedUser,
        );

        debug &&
          console.log('creditBalance', creditBalance);

        // Check if the user has enough AI credits.
        // If not, return an error.
        if (creditBalance === 0) {
          return res.send(
            err(
              creditsNeededError(
                'You need more AI credits to use this feature.',
              ),
            ),
          );
        }

        // Get the ShareDB document for the viz content
        const entityName: EntityName = 'Content';
        const shareDBDoc = shareDBConnection.get(
          toCollectionName(entityName),
          id,
        );

        // console.log('Subscribing to ShareDB document');

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
            // console.log('Subscribed to ShareDB document');
            resolve();
          });
        });

        // console.log(
        //   'got shareDB doc' + JSON.stringify(shareDBDoc.data),
        // );

        // The "old files" existing in the viz.
        const files: Files = shareDBDoc.data.files;

        const filesContext = serializeMarkdownFiles(
          Object.values(files).map((file) => ({
            name: file.name,

            // Truncate .csv and .json files to the first 50 lines
            // and other files to the first 500 lines.
            // Max chars per line is 200.
            text: file.text
              .split('\n')
              .slice(
                0,
                file.name.endsWith('.csv') ||
                  file.name.endsWith('.json')
                  ? 50
                  : 500,
              )
              .map((line) => line.slice(0, 200))
              .join('\n'),
          })),
        );

        const fullPrompt = assembleFullPrompt({
          filesContext,
          prompt,
        });

        debug &&
          console.log('fullPrompt:`' + fullPrompt + '`');

        const modelName =
          process.env.VIZHUB_EDIT_WITH_AI_MODEL_NAME;
        const apiKey =
          process.env.VIZHUB_EDIT_WITH_AI_API_KEY;
        const baseURL =
          process.env.VIZHUB_EDIT_WITH_AI_BASE_URL;

        const options: ChatOpenAIFields = {
          modelName,
          configuration: {
            apiKey,
            baseURL,
          },
          streaming: false,
        };

        const chatModel = new ChatOpenAI(options);

        const result = await chatModel.invoke(fullPrompt);

        // Get the cost of the AI edit
        const generationMetadataPromise =
          getGenerationMetadata({
            apiKey,
            generationId: result.lc_kwargs.id,
          });

        debug &&
          console.log(
            'result:`' +
              JSON.stringify(result, null, 2) +
              '`',
          );
        const parser = new StringOutputParser();
        const resultString = await parser.invoke(result);

        const changedFiles = parseMarkdownFiles(
          resultString,
          'bold',
        );

        // console.log('changedFiles:', changedFiles);
        // newFiles: {
        //   files: [
        //     {
        //       name: 'index.js',
        //       text: "import { select, transition, easeLinear } from 'd3';\n" +
        //         "import data from './data.csv';\n" +
        //         "import  selected from './se
        //         ...
        // console.log('files:', files);
        // files: {
        //   '59504239': {
        //     name: 'directory/color.js',
        //     text: "\nexport const color = '#302EBD';"
        //   },
        //   ...

        // Update the files with the changed files.
        let newFiles: Files = Object.keys(files).reduce(
          (acc, fileId) => {
            const file = files[fileId];

            const changedFile = changedFiles.files.find(
              (changedFile) =>
                changedFile.name === file.name,
            );

            if (shouldDeleteFile(changedFile)) {
              return acc;
            } else {
              acc[fileId] = {
                ...file,
                text: changedFile
                  ? changedFile.text
                  : file.text,
              };
              return acc;
            }
          },
          {},
        );

        // Now account for newly created files:
        changedFiles.files.forEach((changedFile) => {
          const existingFile = Object.values(newFiles).find(
            (file) => file.name === changedFile.name,
          );

          // If we cannot find it in `newFiles`, it must be a new file
          if (
            !existingFile &&
            !shouldDeleteFile(changedFile)
          ) {
            const fileId = generateFileId();
            newFiles[fileId] = {
              name: changedFile.name,
              text: changedFile.text,
            };
          }
        });

        // Before making the AI edits, let's make sure the latest change
        // before the AI edit is committed.
        await commitViz(id);

        // Apply the AI edits to the files.
        const op1 = diff(shareDBDoc.data, {
          ...shareDBDoc.data,
          // update the files
          files: newFiles,
          // Trigger a re-run.
          isInteracting: true,
        });

        // Fetch the Info doc again, just in case
        // anything changed during AI generation.
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
            authenticatedUser.id,
            'AI:' + modelName,
          ],

          // Update the last updated timestamp, as this is used as the
          // timestamp for the next commit.
          updated: dateToTimestamp(new Date()),
        };
        await saveInfo(newInfo);

        // console.log('op', JSON.stringify(op1));

        // Subscribe to ShareDB document.
        // Required to call submitOp.

        shareDBDoc.submitOp(op1);

        // Wait for 100ms to ensure the `isInteracting` flag propagates to the client
        // via WebSocket before unsetting it.
        // TODO solve this in a more robust way.
        //  - The problem is that the ShareDB OT may "collapse" the ops
        //  - so that the `isInteracting` flag is not sent to the client.
        //  - This is a hack to ensure the flag is sent before unsetting it.
        //  - A more long-term solution would be to use a different mechanism
        //  - such as introducing the notion of a "Run ID" or "Run Key" in the Info doc.
        await new Promise((resolve) =>
          setTimeout(resolve, 100),
        );

        // Unset isInteracting.
        const op2 = diff(
          { isInteracting: true },
          {
            isInteracting: false,
          },
        );
        shareDBDoc.submitOp(op2);

        shareDBDoc.unsubscribe();

        // Make a new commit for this change
        const commitVizResult = await commitViz(id);
        if (commitVizResult.outcome === 'failure') {
          return err(commitVizResult.error);
        }
        const infoWithNewCommit: Info =
          commitVizResult.value;
        // This is the commit ID for this new AI change.
        const commit = infoWithNewCommit.end;

        await recordAnalyticsEvents({
          eventId: `event.editWithAI.${authenticatedUserId}`,
        });

        // Get the cost of the AI edit
        const {
          upstreamCostCents,
          userCostCents,
          provider,
          inputTokens,
          outputTokens,
        } = await generationMetadataPromise;

        // Charge the user for the AI edit.
        let updatedCreditBalance: number;
        await lock(
          [userLock(authenticatedUser.id)],
          async () => {
            // Get a fresh copy of the user just in case
            // it changed during the AI edit.
            const userResult = await getUser(
              authenticatedUser.id,
            );
            if (userResult.outcome === 'failure') {
              return res.send(err(userResult.error));
            }
            const user: User = userResult.value.data;

            user.creditBalance =
              creditBalance - userCostCents;

            // Don't let the credit balance go negative,
            // because we check for 0 exactly to trigger
            // the "You need more AI credits" error.
            if (user.creditBalance < 0) {
              user.creditBalance = 0;
            }
            updatedCreditBalance = user.creditBalance;

            const saveUserResult = await saveUser(user);
            if (saveUserResult.outcome === 'failure') {
              return res.send(err(saveUserResult.error));
            }
          },
        );

        // model: string;
        // provider: string;

        // Store the metadata of this transaction
        // for future reference.
        const aiEditMetadata: AIEditMetadata = {
          id: generateId(),
          openRouterGenerationId: result.lc_kwargs.id,
          timestamp: dateToTimestamp(new Date()),
          user: authenticatedUser.id,
          viz: id,
          commit,
          upstreamCostCents,
          userCostCents,
          updatedCreditBalance,
          model: modelName,
          provider,
          inputTokens,
          outputTokens,
          userPrompt: prompt,
          promptTemplateVersion,
        };

        const saveAIEditMetadataResult =
          await saveAIEditMetadata(aiEditMetadata);
        if (
          saveAIEditMetadataResult.outcome === 'failure'
        ) {
          return res.send(
            err(saveAIEditMetadataResult.error),
          );
        }

        res.json(ok('success'));
      } catch (error) {
        console.error('[editWithAIEndpoint] error:', error);
        res.json(err(error));
      }
    },
  );
};

const shouldDeleteFile = (file?: File) =>
  file && file.text.trim() === '';

const task = (prompt: string) => {
  return `## Your Task\n\n${prompt}`;
};

const files = (filesContext: string) => {
  return `## Original Files\n\n${filesContext}`;
};

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

const assembleFullPrompt = ({
  filesContext,
  prompt,
}: {
  filesContext: string;
  prompt: string;
}) => {
  return [task(prompt), files(filesContext), format].join(
    '\n\n',
  );
};

async function getGenerationMetadata({
  apiKey,
  generationId,
}): Promise<{
  upstreamCostCents: number;
  userCostCents: number;
  provider: string;
  inputTokens: number;
  outputTokens: number;
}> {
  // console.log("apiKey: '" + apiKey + "'");
  // console.log("generationId: '" + generationId + "'");
  const url = `https://openrouter.ai/api/v1/generation?id=${generationId}`;
  // const url = `http://localhost:8080/https://openrouter.ai/api/v1/generation?id=${generationId}`;

  const headers = {
    Authorization: `Bearer ${apiKey}`,
  };

  // const curl = `curl -G "${url}" \\\n  -H "Authorization: Bearer ${apiKey}"`;
  // console.log('Equivalent curl command:\n', curl);

  // Sometimes OpenRouter returns a 404 if we request
  // the cost too soon after the generation.
  // We retry a few times to get the cost reliably.
  const maxRetries = 10;
  const retryDelay = 1000; // 1 second

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (response.ok) {
      const data = await response.json();

      debug &&
        console.log(
          '[getCost] data:',
          JSON.stringify(data, null, 2),
        );

      // The upstream cost in USD from OpenRouter
      const upstreamCostInDollars = data.data.total_cost;
      const upstreamCostCents = upstreamCostInDollars * 100;

      const provider = data.data.provider_name;
      const inputTokens = data.data.tokens_prompt;
      const outputTokens = data.data.tokens_completion;

      debug &&
        console.log('upstreamCostCents', upstreamCostCents);

      // The amount of credits that we deduct from the user.
      // How it's calculated:
      // - The upstream cost is what VizHub pays to OpenRouter.
      // - We add a fixed percentage markup to the cost of each request.
      // - We round up to the nearest cent, so the credit balance
      //   is always an integer number of cents, and each request
      //   costs at minimum 1 cent to the end user.
      const userCostCents = Math.ceil(
        upstreamCostCents * CREDIT_MARKUP,
      );

      debug && console.log('userCostCents', userCostCents);
      return {
        upstreamCostCents,
        userCostCents,
        provider,
        inputTokens,
        outputTokens,
      };
    } else {
      // Log the text
      const text = await response.text();
      debug &&
        console.error(
          'Attempt',
          attempt,
          'failed. Response code:',
          response.status,
          text,
        );

      if (attempt < maxRetries) {
        debug &&
          console.log(
            `Retrying in ${retryDelay / 1000} seconds...`,
          );
        await new Promise((resolve) =>
          setTimeout(resolve, retryDelay),
        );
      } else {
        throw new Error(
          `HTTP error! Status: ${response.status} after ${maxRetries} attempts.`,
        );
      }
    }
  }
}
