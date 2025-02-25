import bodyParser from 'body-parser';
import { handleAICopilot } from 'vzcode/src/server/handleAICopilot';
import { getAuthenticatedUserId } from '../parseAuth0User';
import { err } from 'gateways';
import {
  accessDeniedError,
  authenticationRequiredError,
} from 'gateways/src/errors';
import { RecordAnalyticsEvents } from 'interactors';

const debug = false;

const handler = handleAICopilot();

export const aiCopilotEndpoint = ({ app, gateways }) => {
  const { getUser } = gateways;
  const recordAnalyticsEvents =
    RecordAnalyticsEvents(gateways);

  // Handle AI Copilot requests.
  app.post(
    '/api/ai-copilot/',
    bodyParser.json(),
    async (req, res) => {
      if (debug)
        console.log(
          '[aiCopilotEndpoint] req.body:',
          req.body,
        );

      // TODO only allow AI Assist requests users with edit access to the viz.
      // And, only allow AI assist requests if the user requesting it
      // is on the Premium plan.
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
              'Only Premium users can use AI Completions. Please upgrade your plan.',
            ),
          ),
        );
        return;
      }

      recordAnalyticsEvents({
        eventId: `event.aiCompletion.${authenticatedUserId}`,
      });

      // Invoke the implementation from VZCode.
      handler(req, res);
    },
  );
};
