import { err, missingParameterError } from 'gateways';
import { RecordAnalyticsEvents } from 'interactors';
import { dateToTimestamp } from 'entities';

// Handles recording an analytics event.
export const sendEvent = ({ app, gateways }) => {
  const recordAnalyticsEvents = RecordAnalyticsEvents(gateways);
  app.post('/api/send-event', async (req, res) => {
    if (req.body && req.body.eventId) {
      const eventId = req.body.eventId;
      const timestamp = dateToTimestamp(new Date());
      res.send(await recordAnalyticsEvents({ eventId, timestamp }));
    } else {
      res.send(err(missingParameterError('eventIds')));
    }
  });
};
