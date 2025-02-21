import bodyParser from 'body-parser';
import {
  ChatOpenAI,
  ChatOpenAIFields,
} from '@langchain/openai';
import { StringOutputParser } from '@langchain/core/output_parsers';
import {
  dateToTimestamp,
  EntityName,
  Files,
  generateFileId,
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

const debug = false;

export const editWithAIEndpoint = ({
  app,
  shareDBConnection,
  gateways,
}) => {
  const { getUser, getInfo, saveInfo } = gateways;
  const verifyVizAccess = VerifyVizAccess(gateways);
  const commitViz = CommitViz(gateways);

  const recordAnalyticsEvents =
    RecordAnalyticsEvents(gateways);

  // Handle AI Assist requests.
  app.post(
    '/api/edit-with-ai/',
    bodyParser.json(),
    async (req, res) => {
      if (debug)
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

        const options: ChatOpenAIFields = {
          modelName,
          configuration: {
            apiKey: process.env.VIZHUB_EDIT_WITH_AI_API_KEY,
            baseURL:
              process.env.VIZHUB_EDIT_WITH_AI_BASE_URL,
          },
          streaming: false,
        };

        const chatModel = new ChatOpenAI(options);

        const result = await chatModel.invoke(fullPrompt);

        debug &&
          console.log(
            'result:`' +
              JSON.stringify(result, null, 2) +
              '`',
          );
        const parser = new StringOutputParser();
        const resultString = await parser.invoke(result);

        debug &&
          console.log(
            'resultString:`' + resultString + '`',
          );

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

            acc[fileId] = {
              ...file,
              text: changedFile
                ? changedFile.text
                : file.text,
            };
            return acc;
          },
          {},
        );

        // Now account for newly created files:
        changedFiles.files.forEach((changedFile) => {
          const existingFile = Object.values(newFiles).find(
            (file) => file.name === changedFile.name,
          );

          // If we cannot find it in `newFiles`, it must be a new file
          if (!existingFile) {
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
        await commitViz(id);

        await recordAnalyticsEvents({
          eventId: `event.editWithAI.${authenticatedUserId}`,
        });

        res.json(ok('success'));
      } catch (error) {
        console.error('[editWithAIEndpoint] error:', error);
        res.json(err(error));
      }
    },
  );
};

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
  'Refactor large files into smaller files in the same directory.\n\n',
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
