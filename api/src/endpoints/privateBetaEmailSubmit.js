import { err, missingParameterError, ok } from 'gateways';
import { generateId, RecordAnalyticsEvents } from 'interactors';

export const privateBetaEmailSubmit = ({ app, gateways }) => {
  const { saveBetaProgramSignup } = gateways;
  const recordAnalyticsEvents = RecordAnalyticsEvents(gateways);

  app.post('/api/private-beta-email-submit', async (req, res) => {
    if (req.body && req.body.email) {
      const email = req.body.email;
      const result = await saveBetaProgramSignup({
        id: generateId(),
        email,
      });
      if (result.outcome !== 'success') {
        console.log(result.error);
      }

      await recordAnalyticsEvents({ eventId: 'private-beta-email-submit' });

      res.send(ok('success'));
    } else {
      res.send(err(missingParameterError('email')));
    }
  });
};
