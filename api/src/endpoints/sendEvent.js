import { err, missingParameterError } from 'gateways';
import { RecordAnalyticsEvents } from 'interactors';

// Handles recording an analytics event.
export const sendEvent = ({ app, gateways }) => {
  const recordAnalyticsEvents = RecordAnalyticsEvents(gateways);
  app.post('/api/send-event', async (req, res) => {
    if (req.body && req.body.eventId) {
      const eventId = req.body.eventId;
      res.send(await recordAnalyticsEvents({ eventId }));
    } else {
      res.send(err(missingParameterError('eventIds')));
    }
  });
};
