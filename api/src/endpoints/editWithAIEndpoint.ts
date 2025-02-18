import bodyParser from 'body-parser';
import {
  ChatOpenAI,
  ChatOpenAIFields,
} from '@langchain/openai';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { EntityName, Files } from 'entities';
import {
  parseMarkdownFiles,
  serializeMarkdownFiles,
} from 'llm-code-format';
import { toCollectionName } from 'database/src/toCollectionName';
import { getAuthenticatedUserId } from '../parseAuth0User';
import { err, ok } from 'gateways';
import {
  accessDeniedError,
  authenticationRequiredError,
  missingParameterError,
} from 'gateways/src/errors';
import { RecordAnalyticsEvents } from 'interactors';
import { diff } from 'ot';

const debug = false;

const formatInstructions = [
  'Formatting instructions: ',
  'Format your solution as code listings ',
  'in _exactly_ the same way as the original code listings. For example:\n\n',
  '**fileA.js**\n```js\n// Updated code for fileA\n```\n\n',
  '**fileB.js**\n```js\n// Updated for fileB\n```\n\n',
  'Only include the files that need to be updated or created.\n\n',
  'Do not create files within directories, only top-level files are supported.\n\n',
  'The original code listings:',
].join('');

export const editWithAIEndpoint = ({
  app,
  shareDBConnection,
  gateways,
}) => {
  const { getUser } = gateways;
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

      const { id, prompt } = req.body;

      if (!id || !prompt) {
        res.json(
          missingParameterError("Missing 'id' or 'prompt'"),
        );
        return;
      }

      // Get the ShareDB document for the viz content
      const entityName: EntityName = 'Content';
      const shareDBDoc = shareDBConnection.get(
        toCollectionName(entityName),
        id,
      );

      console.log('Subscribing to ShareDB document');

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
          console.log('Subscribed to ShareDB document');
          resolve();
        });
      });

      console.log(
        'got shareDB doc' + JSON.stringify(shareDBDoc.data),
      );

      const files: Files = shareDBDoc.data.files;

      const filesContext = serializeMarkdownFiles(
        Object.values(files),
      );

      const fullPrompt = [
        prompt,
        formatInstructions,
        filesContext,
      ].join('\n\n');

      // debug &&
      //   console.log('fullPrompt:`' + fullPrompt + '`');

      const options: ChatOpenAIFields = {
        modelName:
          process.env.VIZHUB_EDIT_WITH_AI_MODEL_NAME,
        configuration: {
          apiKey: process.env.VIZHUB_EDIT_WITH_AI_API_KEY,
          baseURL: process.env.VIZHUB_EDIT_WITH_AI_BASE_URL,
        },
        streaming: false,
      };

      const chatModel = new ChatOpenAI(options);

      const result = await chatModel.invoke(fullPrompt);
      const parser = new StringOutputParser();
      const resultString = await parser.invoke(result);

      debug &&
        console.log('resultString:`' + resultString + '`');

      const changedFiles = parseMarkdownFiles(resultString);

      console.log('changedFiles:', changedFiles);
      // newFiles: {
      //   files: [
      //     {
      //       name: 'index.js',
      //       text: "import { select, transition, easeLinear } from 'd3';\n" +
      //         "import data from './data.csv';\n" +
      //         "import  selected from './se
      console.log('files:', files);
      // files: {
      //   '59504239': {
      //     name: 'directory/color.js',
      //     text: "\nexport const color = '#302EBD';"
      //   },

      const newFiles: Files = Object.keys(files).reduce(
        (acc, fileId) => {
          const file = files[fileId];

          const changedFile = changedFiles.files.find(
            (changedFile) => changedFile.name === file.name,
          );

          acc[fileId] = {
            ...file,
            text: changedFile
              ? changedFile.text
              : file.text,
          };

          // if (changedFile) {
          //   acc[fileId] = {
          //     ...file,
          //     text: changedFile.text,
          //   };
          // }
          return acc;
        },
        {},
      );

      const op1 = diff(shareDBDoc.data, {
        ...shareDBDoc.data,
        // update the files
        files: newFiles,
        // Trigger a re-run.
        isInteracting: true,
      });

      console.log('op', JSON.stringify(op1));

      // Subscribe to ShareDB document.
      // Required to call submitOp.

      shareDBDoc.submitOp(op1);

      // Wait for 10ms to allow the ShareDB document to update.
      await new Promise((resolve) =>
        setTimeout(resolve, 10),
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

      await recordAnalyticsEvents({
        eventId: `event.editWithAI.${authenticatedUserId}`,
      });

      res.json(ok('success'));
    },
  );
};
