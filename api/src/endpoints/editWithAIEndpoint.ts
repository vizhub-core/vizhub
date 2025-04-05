import bodyParser from 'body-parser';
import { getAuthenticatedUserId } from '../parseAuth0User';
import { err, ok } from 'gateways';
import {
  authenticationRequiredError,
  missingParameterError,
} from 'gateways/src/errors';
import { EditWithAI } from 'interactors';
import { toCollectionName } from 'database/src/toCollectionName';

const debug = false;

export const editWithAIEndpoint = ({
  app,
  shareDBConnection,
  gateways,
}) => {
  const editWithAI = EditWithAI(gateways);

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

        const {
          id,
          prompt,
          modelName = process.env
            .VIZHUB_EDIT_WITH_AI_MODEL_NAME,
        } = req.body;

        if (!id || !prompt) {
          res.json(
            err(
              missingParameterError(
                "Missing 'id' or 'prompt'",
              ),
            ),
          );
          return;
        }

        // Get the ShareDB document for the viz content
        const shareDBDoc = shareDBConnection.get(
          toCollectionName('Content'),
          id,
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

        const result = await editWithAI({
          id,
          prompt,
          modelName,
          authenticatedUserId,
          shareDBDoc,
        });

        if (result.outcome === 'failure') {
          res.json(err(result.error));
          return;
        }

        shareDBDoc.unsubscribe();
        res.json(ok('success'));
      } catch (error) {
        console.error('[editWithAIEndpoint] error:', error);
        res.json(err(error));
      }
    },
  );
};
