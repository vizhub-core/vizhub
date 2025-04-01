import express from 'express';
import { ForkViz, EditWithAI } from 'interactors';
import { Gateways, err, ok } from 'gateways';
import { getAuthenticatedUserId } from '../parseAuth0User';
import { VizId, dateToTimestamp } from 'entities';
import {
  authenticationRequiredError,
  missingParameterError,
} from 'gateways/src/errors';

// The template viz ID that we'll fork from
const TEMPLATE_VIZ_ID: VizId =
  '469e558ba77941aa9e1b416ea521b0aa';

export const createVizFromPromptEndpoint = ({
  app,
  gateways,
}: {
  app: any;
  gateways: Gateways;
}) => {
  const forkViz = ForkViz(gateways);
  const editWithAI = EditWithAI(gateways);

  app.post(
    '/api/create-viz-from-prompt',
    express.json(),
    async (req, res) => {
      try {
        const authenticatedUserId =
          getAuthenticatedUserId(req);
        if (!authenticatedUserId) {
          res.send(err(authenticationRequiredError()));
          return;
        }

        const { prompt, file } = req.body;
        if (!prompt) {
          res.send(err(missingParameterError('prompt')));
          return;
        }
        if (!file) {
          res.send(err(missingParameterError('file')));
          return;
        }

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

        console.log('TODO implement ai edit here');

        // // Then edit it with AI using the prompt and file
        // const editResult = await editWithAI({
        //   id: newVizId,
        //   prompt: `Update this visualization using this data: ${file}\n\n${prompt}`,
        //   modelName: process.env.VIZHUB_EDIT_WITH_AI_MODEL_NAME
        // });

        // if (editResult.outcome === 'failure') {
        //   return res.json(err(editResult.error));
        // }

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
