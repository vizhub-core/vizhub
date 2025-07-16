import multer from 'multer';
import { ForkViz, EditWithAI } from 'interactors';
import { err, ok } from 'gateways';
import { getAuthenticatedUserId } from '../parseAuth0User';
import { dateToTimestamp } from 'entities';
import {
  authenticationRequiredError,
  missingParameterError,
} from 'gateways/src/errors';
import { toCollectionName } from 'database/src/toCollectionName';
import { VizId } from '@vizhub/viz-types';

// The template viz ID that we'll fork from
const TEMPLATE_VIZ_ID: VizId =
  // production value:
  '469e558ba77941aa9e1b416ea521b0aa';
// development value:
// '6dabb8a10b324a72bee8b7886bc0c5eb';

export const createVizFromPromptEndpoint = ({
  app,
  shareDBConnection,
  gateways,
}) => {
  const forkViz = ForkViz(gateways);
  const editWithAI = EditWithAI(gateways);

  // Set up multer for file uploads
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
  });

  app.post(
    '/api/create-viz-from-prompt',
    upload.single('file'),
    async (req, res) => {
      try {
        const authenticatedUserId =
          getAuthenticatedUserId(req);
        if (!authenticatedUserId) {
          res.send(err(authenticationRequiredError()));
          return;
        }

        const { prompt } = req.body;
        const file = req.file;
        if (!prompt) {
          res.send(err(missingParameterError('prompt')));
          return;
        }

        // console.log('User prompt:', prompt);
        // if (file) {
        //   console.log('Uploaded file:', {
        //     name: file.originalname,
        //     size: file.size,
        //     type: file.mimetype,
        //   });
        // }
        // if (!file) {
        //   res.send(err(missingParameterError('file')));
        //   return;
        // }

        // First fork the template viz
        const forkResult = await forkViz({
          forkedFrom: TEMPLATE_VIZ_ID,
          newOwner: authenticatedUserId,
          timestamp: dateToTimestamp(new Date()),
          title: 'Generated Visualization',
          visibility: 'public',
        });

        if (forkResult.outcome === 'failure') {
          res.send(err(forkResult.error));
          return;
        }

        const newVizId = forkResult.value.id;

        // Get the ShareDB document for the viz content
        const shareDBDoc = shareDBConnection.get(
          toCollectionName('Content'),
          newVizId,
        );

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
            resolve();
          });
        });

        // TODO add the uploaded file to the forked viz and commit it

        // Then edit it with AI using the prompt and file
        const editResult = await editWithAI({
          id: newVizId,
          prompt: file
            ? `${prompt}\n\nAlso make sure to use the newly added data in ${file.originalname}`
            : prompt,
          modelName: 'anthropic/claude-sonnet-4',
          authenticatedUserId,
          shareDBDoc,
          // No streaming handler needed here since we're not streaming to the client
        });

        shareDBDoc.unsubscribe();

        if (editResult.outcome === 'failure') {
          return res.json(err(editResult.error));
        }

        res.send(ok({ vizId: newVizId }));
      } catch (error) {
        console.error(
          '[createVizFromPromptEndpoint] error:',
          error,
        );
        res.send(err(error));
      }
    },
  );
};
