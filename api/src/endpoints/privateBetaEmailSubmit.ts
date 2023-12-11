import express, { Express } from 'express';
import {
  Gateways,
  err,
  missingParameterError,
  ok,
} from 'gateways';
import {
  generateId,
  RecordAnalyticsEvents,
} from 'interactors';

export const privateBetaEmailSubmit = ({
  app,
  gateways,
}: {
  app: Express;
  gateways: Gateways;
}) => {
  const { saveBetaProgramSignup } = gateways;
  const recordAnalyticsEvents =
    RecordAnalyticsEvents(gateways);

  app.post(
    '/api/private-beta-email-submit',
    express.json(),
    async (req, res) => {
      // console.log('reveiced request to submit email');
      if (req.body && req.body.email) {
        const email = req.body.email;
        const result = await saveBetaProgramSignup({
          id: generateId(),
          email,
        });
        if (result.outcome !== 'success') {
          throw result.error;
        }

        await recordAnalyticsEvents({
          eventId: 'event.private-beta-email-submit',
        });

        res.send(ok('success'));
      } else {
        res.send(err(missingParameterError('email')));
      }
    },
  );

  app.get(
    '/api/private-beta-email-submit-debug',
    async (_, __) => {
      throw new Error('private-beta-email-submit-debug');
    },
  );
};
